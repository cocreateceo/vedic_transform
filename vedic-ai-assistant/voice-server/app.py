"""Flask API Server for Live Voice Chatbot"""
from flask import Flask, request, send_file, send_from_directory, jsonify, Response, stream_with_context
from flask_cors import CORS
import tempfile
import time
import os
import hashlib
import logging
from datetime import datetime
from config import Config
from tts_base import AudioCache
from tts_factory import create_tts_engine, get_engine_info
from ai_engine import AIEngine

# Setup detailed logging
# In Lambda, use only StreamHandler (filesystem is read-only except /tmp)
# In local dev, also log to file
handlers = [logging.StreamHandler()]
if os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
    # Running in Lambda - only use console logging
    pass
else:
    # Local development - also log to file
    os.makedirs('logs', exist_ok=True)
    handlers.append(logging.FileHandler('logs/performance.log'))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=handlers
)
logger = logging.getLogger(__name__)

# Initialize Flask
app = Flask(__name__)
CORS(app, resources={r"/*": {
    "origins": Config.CORS_ORIGINS,
    "expose_headers": ["X-Answer-Text"]  # Allow browser to read this custom header
}})

# Create audio directory for serving generated files
# In Lambda, use /tmp (only writable directory)
if os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
    AUDIO_DIR = '/tmp/audio_files'
else:
    AUDIO_DIR = os.path.join(os.path.dirname(__file__), 'audio_files')
os.makedirs(AUDIO_DIR, exist_ok=True)

# Lazy initialization for Lambda (avoid INIT timeout)
tts_engine = None
audio_cache = None
ai_engine = None
_initialized = False

def _ensure_initialized():
    """Initialize components on first request (lazy loading for Lambda INIT timeout fix)"""
    global tts_engine, audio_cache, ai_engine, _initialized

    if _initialized:
        return

    print("=" * 60)
    print("🚀 Initializing components (first request)...")
    print("=" * 60)

    tts_engine = create_tts_engine()
    audio_cache = AudioCache(Config.CACHE_DIR) if Config.CACHE_ENABLED else None
    ai_engine = AIEngine()

    engine_info = get_engine_info()

    print("=" * 60)
    print("✅ Server ready!")
    print(f"🎤 TTS Engine: {engine_info['name']}")
    print(f"📊 Model: {engine_info['params']} params, {engine_info['sample_rate']}")
    print(f"🔊 Voice File: {engine_info['voice_file']}")
    if 'prompt_text' in engine_info:
        print(f"📝 Prompt: '{engine_info['prompt_text']}'")
    print(f"🤖 AI: {'Claude API' if ai_engine.client else 'Fallback Mode'}")
    print(f"📦 Cache: {'Enabled' if audio_cache else 'Disabled'}")
    print("=" * 60)

    _initialized = True


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    engine_info = get_engine_info()
    return jsonify({
        'status': 'ok',
        'service': 'Live Voice Chatbot',
        'tts_engine': engine_info['name'],
        'tts_params': engine_info['params'],
        'voice': 'Cloned Voice'
    })


@app.route('/audio/<filename>', methods=['GET'])
def serve_audio(filename):
    """Serve generated audio files with caching"""
    response = send_from_directory(AUDIO_DIR, filename)
    # Cache audio files for 24 hours
    response.headers['Cache-Control'] = 'public, max-age=86400'
    response.headers['Vary'] = 'Accept-Encoding'
    return response


@app.route('/chat', methods=['POST'])
@app.route('/api/chat', methods=['POST'])  # Also support /api/chat
def chat():
    """
    Chat endpoint - Get AI response to user question

    POST /chat or /api/chat
    Body: {"question": "What is CROPION?"}
    Returns: {"answer": "CROPION Terra RX1 is..."}
    """
    _ensure_initialized()
    try:
        data = request.get_json()
        # Support both 'question' and 'message' parameters
        question = data.get('question') or data.get('message', '')
        question = question.strip() if question else ''

        if not question:
            return jsonify({'error': 'No question provided'}), 400

        print(f"💬 User: {question}")

        # Get AI response
        start = time.time()
        answer = ai_engine.get_response(question)
        duration = time.time() - start
        print(f"⏱️  AI responded in {duration:.2f}s")

        # Generate audio ID for this response
        audio_id = hashlib.md5(answer.encode()).hexdigest()[:8]

        # Return with 'response' key (for frontend compatibility)
        return jsonify({
            'response': answer,      # Frontend expects 'response'
            'answer': answer,         # Keep for backward compatibility
            'audio_id': audio_id,     # ID for audio generation
            'processing_time': duration
        })

    except Exception as e:
        print(f"❌ Chat error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/generate-speech', methods=['POST'])
@app.route('/api/generate-voice', methods=['POST'])  # Also support /api/generate-voice
def generate_speech():
    """
    Generate speech from text using your cloned voice

    POST /generate-speech or /api/generate-voice
    Body: {"text": "text to speak", "audio_id": "optional_id"}
    Returns: WAV audio file (if Accept: audio/wav) or JSON with audio_url
    """
    _ensure_initialized()
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        audio_id = data.get('audio_id', hashlib.md5(text.encode()).hexdigest()[:8])

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Generate filename
        filename = f"{audio_id}.wav"
        output_path = os.path.join(AUDIO_DIR, filename)

        # Check if already exists
        if not os.path.exists(output_path):
            # Check cache first
            if audio_cache:
                cache_key = tts_engine.get_cache_key(text)
                cached_file = audio_cache.get(cache_key)
                if cached_file:
                    # Copy from cache to audio directory
                    import shutil
                    shutil.copy(cached_file, output_path)
                else:
                    # Generate new audio
                    tts_engine.synthesize_to_file(text, output_path)
                    # Cache it
                    audio_cache.set(cache_key, output_path)
            else:
                # Generate new audio without cache
                tts_engine.synthesize_to_file(text, output_path)

        # Check if client wants direct audio file or JSON
        if request.headers.get('Accept') == 'audio/wav':
            return send_file(output_path, mimetype='audio/wav')
        else:
            # Return JSON with audio URL (for frontend)
            return jsonify({
                'audio_url': f'/audio/{filename}',
                'audio_id': audio_id,
                'text': text
            })

    except Exception as e:
        print(f"❌ TTS error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/chat-with-voice', methods=['POST'])
@app.route('/api/chat-with-voice', methods=['POST'])  # Also support /api/chat-with-voice
def chat_with_voice():
    """
    Combined endpoint - Get AI response AND generate voice

    POST /chat-with-voice or /api/chat-with-voice
    Body: {"question": "What is CROPION?"}
    Returns: WAV audio file + answer in header
    """
    _ensure_initialized()
    try:
        data = request.get_json()
        question = data.get('question', '').strip()

        if not question:
            return jsonify({'error': 'No question provided'}), 400

        print(f"💬 User: {question}")

        # Get AI response
        answer = ai_engine.get_response(question)

        # Check cache
        if audio_cache:
            cache_key = tts_engine.get_cache_key(answer)
            cached_file = audio_cache.get(cache_key)
            if cached_file:
                response = send_file(cached_file, mimetype='audio/wav')
                response.headers['X-Answer-Text'] = answer
                return response

        # Generate audio
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        output_path = temp_file.name
        temp_file.close()

        tts_engine.synthesize_to_file(answer, output_path)

        # Cache it
        if audio_cache:
            audio_cache.set(cache_key, output_path)

        # Return audio with answer in header
        response = send_file(output_path, mimetype='audio/wav')
        response.headers['X-Answer-Text'] = answer
        return response

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/chat-with-voice-streaming', methods=['POST'])
@app.route('/api/chat-with-voice-streaming', methods=['POST'])
def chat_with_voice_streaming():
    """
    Streaming endpoint - Returns audio chunks as they're generated

    POST /chat-with-voice-streaming
    Body: {"question": "What is CROPION?"}
    Returns: JSON with audio chunks that can be played sequentially
    """
    _ensure_initialized()
    request_id = hashlib.md5(str(time.time()).encode()).hexdigest()[:8]
    t_start = time.time()

    logger.info("=" * 80)
    logger.info(f"🎬 [REQUEST {request_id}] NEW STREAMING REQUEST")
    logger.info("=" * 80)

    try:
        data = request.get_json()
        question = data.get('question', '').strip()

        if not question:
            return jsonify({'error': 'No question provided'}), 400

        logger.info(f"📝 [REQUEST {request_id}] Question: {question}")
        logger.info(f"⏱️  [REQUEST {request_id}] T+0.000s - Request received")

        # Get AI response
        t_ai_start = time.time()
        logger.info(f"🤖 [REQUEST {request_id}] Calling AI engine...")

        answer = ai_engine.get_response(question)

        t_ai_end = time.time()
        ai_duration = t_ai_end - t_ai_start
        logger.info(f"✅ [REQUEST {request_id}] T+{t_ai_end - t_start:.3f}s - AI response received ({ai_duration:.3f}s)")
        logger.info(f"💬 [REQUEST {request_id}] Answer: {answer[:100]}...")

        # Generate audio chunks
        chunks = []
        audio_ids = []

        logger.info(f"🎵 [REQUEST {request_id}] Starting TTS streaming...")

        for chunk_data in tts_engine.synthesize_streaming(answer):
            t_chunk_done = time.time()
            chunk_index = chunk_data['chunk_index']
            audio = chunk_data['audio']
            sample_rate = chunk_data['sample_rate']
            is_last = chunk_data['is_last']

            # Save chunk to file
            chunk_id = f"{hashlib.md5(answer.encode()).hexdigest()[:8]}_{chunk_index}"
            chunk_filename = f"{chunk_id}.wav"
            chunk_path = os.path.join(AUDIO_DIR, chunk_filename)

            # Write audio chunk
            import scipy.io.wavfile
            scipy.io.wavfile.write(chunk_path, sample_rate, audio)

            chunks.append({
                'chunk_index': chunk_index,
                'audio_url': f'/audio/{chunk_filename}',
                'text': chunk_data['text'],
                'is_last': is_last
            })
            audio_ids.append(chunk_id)

            logger.info(f"✅ [REQUEST {request_id}] T+{t_chunk_done - t_start:.3f}s - Chunk {chunk_index + 1} ready: {chunk_data['text'][:60]}...")

        t_all_done = time.time()
        total_duration = t_all_done - t_start
        tts_duration = t_all_done - t_ai_end

        logger.info(f"🎉 [REQUEST {request_id}] T+{total_duration:.3f}s - ALL CHUNKS GENERATED")
        logger.info(f"📊 [REQUEST {request_id}] TIMING BREAKDOWN:")
        logger.info(f"   - AI Generation: {ai_duration:.3f}s")
        logger.info(f"   - TTS Generation: {tts_duration:.3f}s")
        logger.info(f"   - Total: {total_duration:.3f}s")
        logger.info(f"   - Chunks: {len(chunks)}")
        logger.info("=" * 80)

        return jsonify({
            'answer': answer,
            'chunks': chunks,
            'total_chunks': len(chunks),
            'streaming': True,
            'timing': {
                'ai_duration': round(ai_duration, 3),
                'tts_duration': round(tts_duration, 3),
                'total_duration': round(total_duration, 3)
            }
        })

    except Exception as e:
        logger.error(f"❌ [REQUEST {request_id}] ERROR: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/chat-with-voice-realtime', methods=['POST'])
@app.route('/api/chat-with-voice-realtime', methods=['POST'])
def chat_with_voice_realtime():
    """
    TRUE REAL-TIME STREAMING using Server-Sent Events (SSE)
    Sends each chunk immediately when ready, not all at once!

    POST /chat-with-voice-realtime
    Body: {"question": "What is CROPION?"}
    Returns: SSE stream of chunks
    """
    _ensure_initialized()
    from streaming_real import stream_audio_chunks

    data = request.get_json()
    question = data.get('question', '').strip()

    if not question:
        return jsonify({'error': 'No question provided'}), 400

    request_id = hashlib.md5(str(time.time()).encode()).hexdigest()[:8]
    t_start = time.time()

    logger.info("=" * 80)
    logger.info(f"⚡ [REQUEST {request_id}] TRUE REAL-TIME STREAMING REQUEST")
    logger.info("=" * 80)
    logger.info(f"📝 [REQUEST {request_id}] Question: {question}")

    # Return SSE response (streaming)
    return Response(
        stream_with_context(
            stream_audio_chunks(
                question, ai_engine, tts_engine,
                AUDIO_DIR, request_id, t_start, logger
            )
        ),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no'
        }
    )


if __name__ == '__main__':
    print(f"\n🚀 Starting server on {Config.HOST}:{Config.PORT}\n")
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
