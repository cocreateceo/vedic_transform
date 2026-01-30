# 🕉️ Vedic Transform AI Chat Assistant

**Complete voice-enabled AI chatbot with avatar for the Vedic Transform project**

Matching the exact design and features from the CROPION AI Assistant with spiritual guidance for your 48-day transformation journey.

---

## ✨ Features

- 🎯 **Circular Avatar** in orange header
- 🎤 **Voice Input** - Speak your questions (Chrome/Edge/Safari)
- 🔊 **Voice Output** - Cloned voice responses via Pocket TTS
- 🤖 **Claude AI** - Intelligent spiritual guidance
- ⚡ **Speed Controls** - 0.5x, 1x, 1.5x, 2x playback
- ⏸️ **Pause/Resume** - Control audio playback
- 💬 **Quick Questions** - Orange pill buttons for common queries
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Exact Match** - Same design as CROPION assistant

---

## 📸 Screenshot

The chatbot matches this exact design:
- Orange gradient header with circular avatar
- Speed control buttons (0.5x, 1x, 1.5x, 2x)
- Pause and Start/Stop buttons
- Quick question orange pills
- Green microphone button
- Orange send button
- Clean white chat interface

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Voice Server

```bash
cd vedic-ai-assistant/voice-server

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure API Keys

```bash
# Copy environment file
cp .env.example .env

# Edit .env and add your keys
nano .env
```

**Add these keys to `.env`:**

```bash
# Get from https://huggingface.co/settings/tokens
HF_TOKEN=hf_your_token_here

# Get from https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

### Step 3: Start Everything

**Terminal 1 - Start Voice Server:**
```bash
cd vedic-ai-assistant/voice-server
source venv/bin/activate
python app.py
```

**Terminal 2 - Start Next.js:**
```bash
cd /path/to/vedic-transform
npm run dev
```

**Open Browser:**
- http://localhost:3000
- Click the orange chat button (bottom-right)
- Start chatting! 🎉

---

## 🎨 Integration into Your Vedic Transform Project

### Option 1: Copy Components (Recommended)

```bash
# Copy chat components
cp vedic-ai-assistant/components/VedicChatAssistant.tsx src/components/features/chat/
cp vedic-ai-assistant/components/VedicChatButton.tsx src/components/features/chat/

# Copy avatar (if using custom avatar image)
cp vedic-ai-assistant/public/avatar_sprite_circular.png public/
```

### Option 2: Add to Main Layout

Edit `src/app/(main)/layout.tsx`:

```typescript
import { VedicChatButton } from '@/components/features/chat/VedicChatButton';

export default function MainLayout({ children }) {
  return (
    <>
      {children}

      {/* Floating chat button - appears on all pages */}
      <VedicChatButton backendUrl="http://localhost:5000" />
    </>
  );
}
```

### Option 3: Add to Specific Pages

```typescript
// In any page, e.g., src/app/(main)/dashboard/page.tsx
import { VedicChatButton } from '@/components/features/chat/VedicChatButton';

export default function DashboardPage() {
  return (
    <div>
      {/* Your dashboard content */}

      {/* Chat button */}
      <VedicChatButton />
    </div>
  );
}
```

---

## 📁 Project Structure

```
vedic-ai-assistant/
├── components/
│   ├── VedicChatAssistant.tsx       # Main chat modal (matches CROPION design)
│   └── VedicChatButton.tsx          # Floating button wrapper
│
├── voice-server/
│   ├── app.py                       # Flask API server
│   ├── config.py                    # Vedic Transform AI context
│   ├── ai_engine.py                 # Claude AI integration
│   ├── tts_pocket.py                # Pocket TTS voice cloning
│   ├── tts_voxcpm.py                # VoxCPM alternative
│   ├── tts_factory.py               # TTS engine factory
│   ├── tts_base.py                  # Base TTS class
│   ├── streaming_real.py            # Real-time audio streaming
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment template
│   └── voices/
│       └── vedic_guru_voice.wav     # Your cloned voice (3-10 sec audio)
│
├── public/
│   └── avatar_sprite_circular.png   # Avatar sprite (optional)
│
├── README.md                         # This file
└── SETUP.md                          # Detailed setup guide
```

---

## 🎯 Design Match Checklist

✅ **Header**
- Orange gradient background
- Circular avatar (192px)
- Title: "Vedic Transform AI Guide"
- Speed buttons: 0.5x, 1x, 1.5x, 2x
- Pause button
- Start/Stop button
- Subtitle: "Ask me anything about your 48-day transformation journey"

✅ **Chat Interface**
- White background
- Small circular avatars (36px)
- Rounded message bubbles
- Timestamp on each message
- Typing indicator (3 dots)

✅ **Quick Questions**
- Orange pill-shaped buttons
- Appears after first message
- 7 Vedic Transform questions

✅ **Input Area**
- "Type your question here..." placeholder
- Green microphone button (with red when listening)
- Orange "Send" button
- Rounded full input field

---

## 🔧 Customization

### Change Avatar Image

Replace the emoji in line 332 with an actual image:

```tsx
<div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20">
  <img
    src="/path/to/guru-avatar.jpg"
    alt="Vedic Guide"
    className="w-full h-full object-cover"
  />
</div>
```

### Modify Quick Questions

Edit `VedicChatAssistant.tsx` line 39:

```typescript
const quickQuestions = [
  "Your custom question 1",
  "Your custom question 2",
  // ... add up to 8 questions
];
```

### Change Voice

1. Record 3-10 seconds of clear speech
2. Save as `vedic-ai-assistant/voice-server/voices/vedic_guru_voice.wav`
3. Restart voice server

### Update AI Context

Edit `voice-server/config.py` - the `PROJECT_CONTEXT` variable controls how the AI responds.

---

## 🎤 Voice Server API

### Endpoints

#### `GET /health`
Check server status

```bash
curl http://localhost:5000/health
```

#### `POST /chat-with-voice-realtime`
Get AI response + streaming audio (SSE)

```bash
curl -X POST http://localhost:5000/chat-with-voice-realtime \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Brahma Muhurta?"}'
```

---

## 🐛 Troubleshooting

### Voice server won't start

```bash
# Check Python version (needs 3.10+)
python3 --version

# Reinstall dependencies
pip install -r requirements.txt
```

### "HuggingFace authentication failed"

1. Get token from https://huggingface.co/settings/tokens
2. Make sure it's a **read** token
3. Add to `.env`: `HF_TOKEN=hf_your_token_here`

### No audio playing

1. Check voice server is running: `curl http://localhost:5000/health`
2. Check browser console for errors
3. Verify speaker/volume is on

### Microphone not working

- **Chrome/Edge**: Works (HTTPS required in production)
- **Firefox**: Not supported
- **Safari**: Works
- Grant microphone permissions when prompted

### Chat button not showing

1. Verify component is imported correctly
2. Check z-index (should be 40+)
3. Look in bottom-right corner

---

## 🚀 Production Deployment

### Deploy Voice Server

**Option A: Railway/Render**
1. Push voice-server folder to GitHub
2. Connect to Railway/Render
3. Add environment variables
4. Deploy

**Option B: AWS EC2**
1. Launch t3.small instance
2. Install Python, dependencies
3. Run with Gunicorn
4. Setup Nginx reverse proxy

### Update Frontend

```typescript
<VedicChatButton backendUrl="https://your-voice-server.com" />
```

---

## 📊 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, TypeScript, Tailwind CSS, Next.js 16 |
| **Backend** | Python 3.11, Flask, Flask-CORS |
| **Voice Clone** | Pocket TTS (Kyutai Labs) |
| **AI** | Claude Sonnet 4.5 (Anthropic) |
| **Speech** | Web Speech API (browser) |
| **Streaming** | Server-Sent Events (SSE) |

---

## 📝 Environment Variables

```bash
# Required
HF_TOKEN=                # Hugging Face token
ANTHROPIC_API_KEY=       # Claude API key

# Optional
TTS_ENGINE=pocket_tts    # or "voxcpm"
HOST=0.0.0.0
PORT=5000
DEBUG=True
```

---

## 💡 Tips

1. **Keep responses short** - Under 40 words for fast audio generation
2. **Clear voice** - Use noise-free 3-10 sec audio for best cloning
3. **Test locally first** - Verify everything works before deploying
4. **Cache enabled** - Common responses play instantly (cached)

---

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed step-by-step setup guide
- [Pocket TTS Docs](https://github.com/kyutai-labs/pocket-tts) - Voice cloning documentation
- [Claude API Docs](https://docs.anthropic.com/) - AI API reference

---

## 🆘 Support

**Issues?**

1. Check browser console (F12)
2. Check voice server logs
3. Test health endpoint: `curl http://localhost:5000/health`
4. Verify API keys are valid

**Common Fixes:**
- Restart voice server
- Clear browser cache
- Reinstall Python dependencies
- Check API credit balance

---

## 📄 License

MIT License - Feel free to use and modify

---

**🎉 You're all set! Click the orange chat button and start your spiritual guidance journey!** 🕉️
