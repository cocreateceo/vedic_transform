# Vedic Transform AI Chat Assistant - Setup Guide

## 📋 Overview

This AI chat assistant integrates voice-cloned avatar, real-time audio responses, and AI-powered guidance into your Vedic Transform Next.js application.

**Features:**
- 🕉️ Animated avatar with 81-frame sprite sheet
- 🎤 Voice input (speech-to-text)
- 🔊 Voice output with your cloned voice
- 🤖 Claude AI-powered responses
- 📱 Responsive modal design
- ⚡ Real-time audio streaming

---

## 🚀 Quick Start (Local Development)

### Step 1: Copy Avatar Asset

```bash
# Copy avatar sprite to your public folder
cp vedic-ai-assistant/public/avatar_sprite_circular.png public/avatar_sprite_circular.png
```

### Step 2: Install Voice Server Dependencies

```bash
cd vedic-ai-assistant/voice-server

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use any text editor
```

**Required API Keys:**

1. **Hugging Face Token** (for Pocket TTS voice cloning)
   - Get from: https://huggingface.co/settings/tokens
   - Add to `.env`: `HF_TOKEN=hf_your_token_here`

2. **Anthropic API Key** (for Claude AI responses)
   - Get from: https://console.anthropic.com/
   - Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-your_key_here`

**Example .env:**
```bash
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
HOST=0.0.0.0
PORT=5000
DEBUG=True
TTS_ENGINE=pocket_tts
VOICE_FILE=voices/vedic_guru_voice.wav
```

### Step 4: Start Voice Server

```bash
# Make sure you're in the voice-server directory with venv activated
cd vedic-ai-assistant/voice-server
source venv/bin/activate

# Start the server
python app.py
```

You should see:
```
============================================================
🚀 Initializing components (first request)...
============================================================
🎤 Using: Pocket TTS (100M params, 24kHz)
✅ Model loaded
🔊 Voice File: voices/vedic_guru_voice.wav
🤖 AI: Claude API
📦 Cache: Enabled
============================================================
✅ Server ready!
============================================================
🚀 Starting server on 0.0.0.0:5000
```

### Step 5: Install React Components

```bash
# Go back to your main Vedic Transform project
cd ../..

# Copy the chat components to your project
cp vedic-ai-assistant/components/VedicChatAssistant.tsx src/components/features/chat/
cp vedic-ai-assistant/components/VedicChatButton.tsx src/components/features/chat/
```

### Step 6: Add Chat Button to Your Layout

Edit your main layout file (e.g., `src/app/(main)/layout.tsx`):

```typescript
import { VedicChatButton } from '@/components/features/chat/VedicChatButton';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen">
      {children}

      {/* Add floating chat button */}
      <VedicChatButton backendUrl="http://localhost:5000" />
    </div>
  );
}
```

### Step 7: Test the Integration

1. **Start voice server:**
   ```bash
   cd vedic-ai-assistant/voice-server
   source venv/bin/activate
   python app.py
   ```

2. **Start Next.js dev server** (in another terminal):
   ```bash
   npm run dev
   ```

3. **Open browser:**
   - Navigate to http://localhost:3000
   - Click the orange floating chat button in the bottom-right
   - Ask: "What is the 10X Vedic Transform program?"
   - You should see text response + hear audio in the cloned voice!

---

## 🎨 Customization

### Change Avatar

Replace `public/avatar_sprite_circular.png` with your own 81-frame sprite sheet.

**Requirements:**
- Total width: 41,472px (81 frames × 512px)
- Frame size: 512px × 768px
- Format: PNG with transparency

### Change Voice

1. Record 3-10 seconds of clear speech
2. Save as `vedic-ai-assistant/voice-server/voices/vedic_guru_voice.wav`
3. Update `.env`: `VOICE_FILE=voices/vedic_guru_voice.wav`
4. Restart voice server

### Modify Quick Questions

Edit `VedicChatAssistant.tsx`, line ~40:

```typescript
const quickQuestions = [
  "Your custom question 1",
  "Your custom question 2",
  // ...
];
```

### Update AI Context

Edit `vedic-ai-assistant/voice-server/config.py`, the `PROJECT_CONTEXT` variable to change how the AI responds.

### Change Colors

The component uses Tailwind classes. Main colors:
- Primary: `orange-500` to `orange-600` (can change to any Tailwind color)
- User messages: `blue-600`
- Background: `gray-50`

---

## 🔧 Troubleshooting

### "Module not found" errors

```bash
# Install missing dependencies
cd vedic-ai-assistant/voice-server
pip install -r requirements.txt
```

### "Hugging Face authentication failed"

1. Check your `HF_TOKEN` is correct
2. Verify token has read permissions
3. Test: `curl -H "Authorization: Bearer $HF_TOKEN" https://huggingface.co/api/whoami`

### "Claude API error"

1. Check `ANTHROPIC_API_KEY` is valid
2. Verify you have API credits
3. Check key permissions at https://console.anthropic.com/

### No audio playing

1. Check browser console for errors
2. Verify voice server is running on port 5000
3. Test endpoint: `curl http://localhost:5000/health`
4. Check microphone/speaker permissions

### Voice recognition not working

- **Chrome/Edge:** Should work (requires HTTPS in production)
- **Firefox:** Not supported
- **Safari:** Works on macOS/iOS
- Ensure microphone permissions are granted

### Avatar not animating

1. Check `public/avatar_sprite_circular.png` exists
2. Verify file size is ~17MB (correct sprite sheet)
3. Check browser console for 404 errors

---

## 📦 File Structure

```
vedic-ai-assistant/
├── components/
│   ├── VedicChatAssistant.tsx    # Main chat modal component
│   └── VedicChatButton.tsx       # Floating button wrapper
├── voice-server/
│   ├── app.py                    # Flask API server
│   ├── config.py                 # Configuration & AI context
│   ├── ai_engine.py              # Claude AI integration
│   ├── tts_factory.py            # TTS engine factory
│   ├── tts_pocket.py             # Pocket TTS engine
│   ├── tts_voxcpm.py             # VoxCPM engine (alternative)
│   ├── tts_base.py               # Base TTS class
│   ├── streaming_real.py         # SSE streaming implementation
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Example environment variables
│   └── voices/
│       └── vedic_guru_voice.wav  # Reference voice file
├── public/
│   └── avatar_sprite_circular.png # Avatar sprite sheet
└── SETUP.md                      # This file
```

---

## 🌐 Backend API Endpoints

The voice server exposes these endpoints:

### `GET /health`
Health check

**Response:**
```json
{
  "status": "ok",
  "service": "Live Voice Chatbot",
  "tts_engine": "Pocket TTS",
  "voice": "Cloned Voice"
}
```

### `POST /chat`
Get AI response (text only)

**Request:**
```json
{
  "question": "What is Brahma Muhurta?"
}
```

**Response:**
```json
{
  "response": "Brahma Muhurta at 5 AM is the sacred awakening time...",
  "audio_id": "a3f2c1d4",
  "processing_time": 0.42
}
```

### `POST /chat-with-voice-realtime`
Get AI response + streaming audio (SSE)

**Request:**
```json
{
  "question": "Explain the 11 pillars"
}
```

**Response:** Server-Sent Events stream
```
data: {"type":"answer","answer":"The 11 pillars cover..."}

data: {"type":"chunk","chunk_index":0,"audio_url":"/audio/xxx_0.wav","is_last":false}

data: {"type":"chunk","chunk_index":1,"audio_url":"/audio/xxx_1.wav","is_last":true}

data: {"type":"complete","total_chunks":2}
```

---

## 🚀 Production Deployment (Future)

When ready to deploy to production:

1. **Deploy voice server to EC2/Railway/Render**
2. **Update backend URL in component:**
   ```typescript
   <VedicChatButton backendUrl="https://your-voice-server.com" />
   ```
3. **Enable HTTPS** (required for microphone in production)
4. **Set production environment variables**
5. **Configure CORS** in `config.py` to include your production domain

---

## 📚 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Next.js 16
- **Backend:** Python, Flask, Flask-CORS
- **Voice Cloning:** Pocket TTS (Kyutai Labs) or VoxCPM
- **AI:** Claude Sonnet 4.5 (Anthropic)
- **Speech Recognition:** Web Speech API (browser-native)
- **Audio Streaming:** Server-Sent Events (SSE)

---

## 💡 Tips

1. **Fast responses:** Keep AI responses under 40 words for quick audio generation
2. **Voice quality:** Use clear, 3-10 second reference audio for best voice cloning
3. **Caching:** Common responses are cached for instant playback
4. **Testing:** Use fallback mode (no API keys) to test UI without backend costs

---

## 🆘 Support

If you encounter issues:

1. Check browser console for errors
2. Verify voice server logs: `tail -f voice-server/logs/*.log`
3. Test backend health: `curl http://localhost:5000/health`
4. Ensure all API keys are valid and have sufficient credits

---

**Ready to use! Click the orange chat button to start your spiritual guidance journey.** 🕉️
