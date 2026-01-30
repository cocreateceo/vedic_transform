"""
TRUE Real-Time Streaming Implementation
Uses Server-Sent Events (SSE) to stream chunks as they're generated
"""

from flask import Response, stream_with_context
import json
import time

def create_sse_response(data):
    """Format data as Server-Sent Event"""
    return f"data: {json.dumps(data)}\n\n"

def remove_all_punctuation(text):
    """
    Remove ALL punctuation that causes TTS pauses
    This ensures completely continuous speech
    """
    import re
    # Remove ALL punctuation: . , ! ? ; : - ( ) [ ] { } " ' ... etc
    # Keep only letters, numbers, and spaces
    speech_text = re.sub(r'[^\w\s]', ' ', text)
    # Remove emojis and special characters
    speech_text = re.sub(r'[^\x00-\x7F]+', ' ', speech_text)
    # Remove multiple spaces
    speech_text = " ".join(speech_text.split())
    return speech_text

def stream_audio_chunks(question, ai_engine, tts_engine, audio_dir, request_id, t_start, logger):
    """
    Generator that yields audio chunks as they're generated
    This enables TRUE streaming - each chunk sent immediately when ready
    """
    import os
    import hashlib
    import scipy.io.wavfile

    try:
        # Step 1: Get AI response
        logger.info(f"🤖 [REQUEST {request_id}] Calling AI engine...")
        t_ai_start = time.time()

        answer = ai_engine.get_response(question)

        t_ai_end = time.time()
        ai_duration = t_ai_end - t_ai_start
        logger.info(f"✅ [REQUEST {request_id}] T+{t_ai_end - t_start:.3f}s - AI response: {answer[:100]}...")

        # Send original answer IMMEDIATELY for fast text display
        yield create_sse_response({
            'type': 'answer',
            'answer': answer,
            'timing': {
                'ai_duration': round(ai_duration, 3)
            }
        })

        # Clean for TTS (remove all punctuation for continuous speech)
        answer_clean = remove_all_punctuation(answer)
        logger.info(f"🔇 [REQUEST {request_id}] Cleaned for TTS: {answer_clean[:100]}...")

        # Step 2: Stream audio chunks as they're generated
        logger.info(f"🎵 [REQUEST {request_id}] Starting TRUE streaming...")

        chunk_count = 0
        for chunk_data in tts_engine.synthesize_streaming(answer_clean):
            t_chunk_ready = time.time()
            chunk_count += 1

            chunk_index = chunk_data['chunk_index']
            audio = chunk_data['audio']
            sample_rate = chunk_data['sample_rate']
            is_last = chunk_data['is_last']

            # Save chunk to file
            chunk_id = f"{hashlib.md5(answer.encode()).hexdigest()[:8]}_{chunk_index}"
            chunk_filename = f"{chunk_id}.wav"
            chunk_path = os.path.join(audio_dir, chunk_filename)

            scipy.io.wavfile.write(chunk_path, sample_rate, audio)

            chunk_duration = time.time() - t_chunk_ready
            elapsed = time.time() - t_start

            logger.info(f"🚀 [REQUEST {request_id}] T+{elapsed:.3f}s - STREAMING Chunk {chunk_index + 1} NOW! (generated in {chunk_duration:.3f}s)")

            # Send chunk immediately (don't wait for next chunk!)
            yield create_sse_response({
                'type': 'chunk',
                'chunk_index': chunk_index,
                'audio_url': f'/audio/{chunk_filename}',
                'text': chunk_data['text'],
                'is_last': is_last,
                'timing': {
                    'elapsed': round(elapsed, 3),
                    'chunk_generation': round(chunk_duration, 3)
                }
            })

        # Send completion event
        total_duration = time.time() - t_start
        tts_duration = total_duration - ai_duration

        logger.info(f"🎉 [REQUEST {request_id}] T+{total_duration:.3f}s - STREAMING COMPLETE")
        logger.info(f"📊 [REQUEST {request_id}] Streamed {chunk_count} chunks")
        logger.info(f"   - AI: {ai_duration:.3f}s")
        logger.info(f"   - TTS: {tts_duration:.3f}s")
        logger.info(f"   - Total: {total_duration:.3f}s")
        logger.info("=" * 80)

        yield create_sse_response({
            'type': 'complete',
            'total_chunks': chunk_count,
            'timing': {
                'ai_duration': round(ai_duration, 3),
                'tts_duration': round(tts_duration, 3),
                'total_duration': round(total_duration, 3)
            }
        })

    except Exception as e:
        logger.error(f"❌ [REQUEST {request_id}] Streaming error: {e}")
        import traceback
        traceback.print_exc()

        yield create_sse_response({
            'type': 'error',
            'error': str(e)
        })
