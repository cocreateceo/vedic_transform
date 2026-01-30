# 🕉️ Vedic Transform AI Voice Assistant - Setup Guide

**Your AI spiritual guide is now integrated into the Vedic Transform project!**

---

## ✅ What Has Been Implemented

### **Components Added**
- ✅ `src/components/features/chat/VedicChatAssistant.tsx` - Main chat modal
- ✅ `src/components/features/chat/VedicChatButton.tsx` - Floating chat button
- ✅ `public/avatar_sprite_circular.png` - Avatar sprite (16.9 MB)
- ✅ `src/app/(main)/layout.tsx` - Updated with chat button

### **Voice Server Created**
- ✅ `vedic-ai-assistant/voice-server/` - Complete backend setup
- ✅ Flask API with Claude AI integration
- ✅ Pocket TTS voice cloning
- ✅ Real-time audio streaming
- ✅ Vedic Transform knowledge base

### **Design**
- ✅ Exact match to CROPION assistant design
- ✅ Orange gradient header with circular avatar
- ✅ **Animated avatar sprite with 81-frame lip-sync** (mouth moves when speaking)
- ✅ Speed controls (0.5x, 1x, 1.5x, 2x)
- ✅ Pause/Play buttons
- ✅ Quick question orange pills
- ✅ Voice input (microphone button)
- ✅ Voice output (cloned voice with synchronized mouth animation)

---

## 🚀 Quick Start (5 Minutes)

### **Step 1: Get API Keys** (2 minutes)

#### **Hugging Face Token** (Required for Pocket TTS)
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Name: "vedic-transform-voice"
4. Access: **Read**
5. Click "Generate"
6. **Copy the token** (starts with `hf_`)

#### **Anthropic API Key** (Required for Claude AI)
1. Go to https://console.anthropic.com/
2. Sign up or Sign in
3. Go to "API Keys" section
4. Click "Create Key"
5. Name: "vedic-transform"
6. **Copy the key** (starts with `sk-ant-`)

---

### **Step 2: Configure Voice Server** (1 minute)

```bash
# Navigate to voice server directory
cd vedic-ai-assistant/voice-server

# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # or use VS Code, Notepad, etc.
```

**Add your API keys to `.env`:**

```bash
# Hugging Face Token (for Pocket TTS voice cloning)
HF_TOKEN=hf_paste_your_token_here

# Anthropic API Key (for Claude AI)
ANTHROPIC_API_KEY=sk-ant-paste_your_key_here

# Server Configuration (leave as default)
HOST=0.0.0.0
PORT=5000
DEBUG=True

# TTS Engine (recommended: pocket_tts)
TTS_ENGINE=pocket_tts

# Voice File
VOICE_FILE=voices/vedic_guru_voice.wav
```

**Save the file** (Ctrl+X, Y, Enter in nano)

---

### **Step 3: Start Voice Server** (1 minute)

**Option A: Using the start script (Recommended)**

```bash
# Make script executable (first time only)
chmod +x start.sh

# Run the server
./start.sh
```

**Option B: Manual setup**

```bash
# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

**You should see:**

```
============================================================
🚀 Initializing components (first request)...
============================================================
🎤 Using: Pocket TTS (100M params, 24kHz)
📦 Cache: Enabled
🤖 AI: Claude API
============================================================
✅ Server ready!
============================================================
 * Running on http://0.0.0.0:5000
```

**✅ Voice server is now running!** Keep this terminal open.

---

### **Step 4: Start Next.js Dev Server** (1 minute)

**Open a NEW terminal window:**

```bash
# Navigate to project root
cd /mnt/d/vedic-transformation-Voice-Avatar/vedic-transformation-Voice-Avatar

# Start Next.js
npm run dev
```

**You should see:**

```
  ▲ Next.js 16.1.1
  - Local:        http://localhost:3000
  - Network:      http://10.0.0.27:3000

 ✓ Ready in 2.5s
```

---

### **Step 5: Test the Chat Assistant!** 🎉

1. **Open browser:** http://localhost:3000
2. **Login** to your Vedic Transform account
3. **Look for the orange floating button** in the bottom-right corner
4. **Click the button** to open the chat
5. **Try these:**
   - Click a quick question button
   - Type: "What is 10X Vedic Transform?"
   - Click the **green microphone** button and speak: "Tell me about meditation"
   - Hear the AI response in the cloned voice!

---

## 🎯 Features You Can Use

### **1. Voice Input** 🎤
- Click the green microphone button
- Speak your question clearly
- It will auto-submit after you stop speaking
- Works in Chrome, Edge, Safari (not Firefox)

### **2. Voice Output** 🔊
- Every response plays in the cloned voice
- Control playback speed: 0.5x, 1x, 1.5x, 2x
- Pause/Resume with the Pause button
- Stop completely with the Stop button

### **3. Quick Questions**
- Orange pill-shaped buttons
- Pre-configured Vedic Transform questions
- Click any to instantly ask

### **4. Text Chat**
- Type questions manually
- Press Enter or click Send
- Get instant AI responses

---

## 🎨 Customization

### **Change the Avatar Image**

Edit `src/components/features/chat/VedicChatAssistant.tsx` (line ~330):

```tsx
// Replace the emoji with an actual image
<div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20">
  <img
    src="/images/vedic-guru.jpg"  // Add your guru image to public/images/
    alt="Vedic Guide"
    className="w-full h-full object-cover"
  />
</div>
```

### **Change Quick Questions**

Edit `src/components/features/chat/VedicChatAssistant.tsx` (line ~39):

```tsx
const quickQuestions = [
  "Your custom question 1",
  "Your custom question 2",
  "Your custom question 3",
  "Your custom question 4",
  "Your custom question 5",
  "Your custom question 6",
  "Your custom question 7"
];
```

### **Change the AI Personality**

Edit `vedic-ai-assistant/voice-server/config.py` - the `PROJECT_CONTEXT` variable (line ~18):

```python
PROJECT_CONTEXT = """
You are a wise spiritual guide...
[Customize the AI's role and knowledge here]
"""
```

### **Clone Your Own Voice**

1. **Record 5-10 seconds of clear speech**
   - Use your phone or microphone
   - Speak clearly in a quiet room
   - Save as WAV or MP3

2. **Convert to WAV format** (if needed)
   ```bash
   ffmpeg -i your_voice.mp3 -ar 24000 -ac 1 vedic_guru_voice.wav
   ```

3. **Replace the reference voice**
   ```bash
   cp vedic_guru_voice.wav vedic-ai-assistant/voice-server/voices/vedic_guru_voice.wav
   ```

4. **Restart the voice server**

---

## 🐛 Troubleshooting

### **Voice server won't start**

**Problem:** Dependencies not installed
```bash
cd vedic-ai-assistant/voice-server
pip install -r requirements.txt
```

**Problem:** Python version too old
```bash
python3 --version  # Should be 3.10 or higher
```

**Problem:** API keys not set
- Check `.env` file exists
- Verify HF_TOKEN and ANTHROPIC_API_KEY are set
- No quotes needed around the values

---

### **Chat button not showing**

**Check 1:** Component imported correctly
```bash
# Verify file exists
ls src/components/features/chat/VedicChatButton.tsx
```

**Check 2:** Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

**Check 3:** Hard refresh browser
- Chrome/Edge: Ctrl + Shift + R
- Mac: Cmd + Shift + R

---

### **No audio playing**

**Check 1:** Voice server running
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok",...}
```

**Check 2:** Browser console
- Press F12
- Check Console tab for errors
- Look for CORS or network errors

**Check 3:** Audio permissions
- Check browser didn't block audio
- Check volume is on
- Try different browser

---

### **Microphone not working**

**Browser Support:**
- ✅ Chrome/Edge (best support)
- ✅ Safari (macOS/iOS)
- ❌ Firefox (not supported)

**Check Permissions:**
- Browser should ask for microphone permission
- Grant permission when prompted
- Check browser settings if blocked

**HTTPS Required:**
- Microphone works on localhost (HTTP)
- Production needs HTTPS

---

### **API Errors**

**"Invalid API key"**
- Verify key in `.env` is correct
- Check no extra spaces or quotes
- Restart voice server after changing `.env`

**"Rate limit exceeded"**
- Check Anthropic account has credits
- Wait a few minutes and try again

**"Model not found"**
- HuggingFace token needs Read access
- Verify token at https://huggingface.co/settings/tokens

---

## 📊 Testing Checklist

- [ ] Voice server starts without errors
- [ ] Next.js dev server running
- [ ] Orange chat button visible (bottom-right)
- [ ] Chat modal opens when clicking button
- [ ] Welcome message appears
- [ ] Quick question buttons work
- [ ] Text input works
- [ ] Send button works
- [ ] AI response appears (text)
- [ ] Audio plays automatically
- [ ] Speed controls work (0.5x, 1x, 1.5x, 2x)
- [ ] Pause button works
- [ ] Start/Stop button works
- [ ] Microphone button appears (green)
- [ ] Voice input works (speak question)
- [ ] Close button closes modal

---

## 🚀 What's Running

### **Terminal 1: Voice Server**
```
Port: 5000
URL: http://localhost:5000
Purpose: AI + Voice generation backend
Keep running: YES
```

### **Terminal 2: Next.js**
```
Port: 3000
URL: http://localhost:3000
Purpose: Frontend application
Keep running: YES
```

### **Database (SQLite)**
```
File: prisma/dev.db
Running: Automatic (via Next.js)
```

---

## 📁 File Locations

```
Project Root/
├── src/
│   └── components/
│       └── features/
│           └── chat/
│               ├── VedicChatAssistant.tsx  ← Main chat component
│               └── VedicChatButton.tsx     ← Floating button
│
├── public/
│   └── avatar_sprite_circular.png          ← Avatar image
│
├── vedic-ai-assistant/
│   └── voice-server/
│       ├── app.py                          ← Flask server
│       ├── config.py                       ← AI configuration
│       ├── .env                            ← YOUR API KEYS
│       └── voices/
│           └── vedic_guru_voice.wav        ← Voice clone
│
└── VOICE_ASSISTANT_SETUP.md               ← This file
```

---

## 💡 Pro Tips

1. **Keep responses concise** - AI is configured for max 40 words for faster audio

2. **Clear voice** - Better reference audio = better voice cloning quality

3. **Test locally first** - Make sure everything works before deploying

4. **Cache is your friend** - Common responses are cached for instant playback

5. **Monitor costs** - Claude API charges per request, Pocket TTS is free

---

## 🌐 Production Deployment (Later)

When ready to deploy to production:

### **Deploy Voice Server**
1. Deploy to Railway, Render, or AWS EC2
2. Update `.env` with production API keys
3. Enable HTTPS

### **Update Frontend**
```tsx
// Change backendUrl from localhost to production
<VedicChatButton backendUrl="https://your-voice-server.com" />
```

### **Configure CORS**
Edit `vedic-ai-assistant/voice-server/config.py`:
```python
CORS_ORIGINS = [
    'https://10x.vedics.net',  # Your production domain
    'http://localhost:3000'     # Keep for local dev
]
```

---

## 🆘 Still Having Issues?

1. **Check both terminals** - Are both servers running?
2. **Check browser console** (F12) - Any errors?
3. **Test health endpoint** - `curl http://localhost:5000/health`
4. **Verify API keys** - Both HF_TOKEN and ANTHROPIC_API_KEY set?
5. **Restart everything** - Stop both servers, restart in order

---

## 📚 Additional Resources

- **Pocket TTS Docs:** https://github.com/kyutai-labs/pocket-tts
- **Claude API Docs:** https://docs.anthropic.com/
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Orange chat button appears in bottom-right
2. ✅ Clicking opens the chat modal
3. ✅ Quick questions are orange pills
4. ✅ Typing a question and clicking Send works
5. ✅ You see the AI's text response
6. ✅ You **hear** the audio response in the cloned voice
7. ✅ Speed controls change playback speed
8. ✅ Microphone button works (speak a question)

---

**🎉 Congratulations! Your Vedic Transform AI Guide is live!** 🕉️

**Click the orange button and start your spiritual guidance journey!**

---

**Need Help?**
- Check [QUICKSTART.md](vedic-ai-assistant/QUICKSTART.md)
- Review [README.md](vedic-ai-assistant/README.md)
- Check [SETUP.md](vedic-ai-assistant/SETUP.md)
