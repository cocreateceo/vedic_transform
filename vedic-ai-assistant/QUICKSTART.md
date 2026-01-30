# ⚡ Quick Start - Vedic Transform AI Assistant

**Get the AI chatbot running in 5 minutes!**

---

## Step 1: Get API Keys (2 min)

### Hugging Face Token
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Name it "vedic-transform"
4. Select "Read" access
5. Copy the token (starts with `hf_`)

### Anthropic API Key
1. Go to https://console.anthropic.com/
2. Create account / Sign in
3. Go to "API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)

---

## Step 2: Setup Voice Server (2 min)

```bash
cd vedic-ai-assistant/voice-server

# Create .env file
cp .env.example .env

# Edit .env and paste your keys
nano .env  # or use any text editor
```

**In .env, add your keys:**
```
HF_TOKEN=hf_paste_your_token_here
ANTHROPIC_API_KEY=sk-ant-paste_your_key_here
```

**Save and exit** (Ctrl+X, then Y, then Enter if using nano)

---

## Step 3: Install & Run (1 min)

```bash
# Still in voice-server directory

# Make start script executable (Linux/Mac)
chmod +x start.sh

# Run the start script
./start.sh
```

**Or manually:**
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**You should see:**
```
🚀 Initializing components...
✅ Model loaded
✅ Voice loaded
✅ Server ready!
 * Running on http://0.0.0.0:5000
```

---

## Step 4: Add to Your Vedic Transform Project

**Copy components:**
```bash
# Go to your main project directory
cd ../..

# Copy chat components
cp vedic-ai-assistant/components/VedicChatAssistant.tsx src/components/features/chat/
cp vedic-ai-assistant/components/VedicChatButton.tsx src/components/features/chat/
```

**Add to your layout:**

Edit `src/app/(main)/layout.tsx`:

```typescript
import { VedicChatButton } from '@/components/features/chat/VedicChatButton';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}

      {/* Add floating chat button */}
      <VedicChatButton backendUrl="http://localhost:5000" />
    </div>
  );
}
```

---

## Step 5: Test It! (1 min)

**Terminal 1 - Voice Server (already running):**
```bash
cd vedic-ai-assistant/voice-server
./start.sh
```

**Terminal 2 - Next.js:**
```bash
npm run dev
```

**Browser:**
1. Open http://localhost:3000
2. Look for orange floating button (bottom-right corner)
3. Click the button
4. Ask: "What is 10X Vedic Transform?"
5. Hear the AI response! 🎉

---

## 🎯 That's It!

You now have a fully functional AI chatbot with:
- ✅ Voice input (speak your questions)
- ✅ Voice output (cloned voice responses)
- ✅ Claude AI intelligence
- ✅ Exact CROPION design
- ✅ Speed controls (0.5x - 2x)
- ✅ Pause/Play controls
- ✅ Quick question buttons

---

## 🔧 Quick Customization

### Change the Avatar
Edit `VedicChatAssistant.tsx` line 332:
```tsx
<img src="/path/to/guru-avatar.jpg" className="w-full h-full object-cover" />
```

### Change Quick Questions
Edit `VedicChatAssistant.tsx` line 39:
```typescript
const quickQuestions = [
  "Your question 1",
  "Your question 2",
  // ...
];
```

### Change Colors
All orange colors are in Tailwind classes like:
- `bg-orange-500` → Change to `bg-purple-500`, `bg-blue-500`, etc.
- `from-orange-500 to-orange-600` → Gradient colors

---

## 🐛 Troubleshooting

### Voice server won't start
```bash
# Check Python version
python3 --version  # Should be 3.10+

# Reinstall dependencies
pip install -r requirements.txt
```

### Chat button not showing
1. Check component is imported correctly
2. Restart Next.js dev server
3. Clear browser cache (Ctrl+Shift+R)

### No audio playing
1. Check voice server is running: `curl http://localhost:5000/health`
2. Check browser console (F12) for errors
3. Verify volume is on

### API errors
1. Verify API keys in `.env` are correct
2. Check you have API credits
3. Restart voice server after changing `.env`

---

## 📚 Next Steps

- [README.md](./README.md) - Full documentation
- [SETUP.md](./SETUP.md) - Detailed setup guide
- Customize the AI context in `voice-server/config.py`
- Record your own voice for voice cloning
- Deploy to production

---

## 💡 Pro Tips

1. **Keep responses short** - Under 40 words = faster audio
2. **Clear voice** - Record 5-10 seconds of clear speech for best cloning
3. **Test locally** - Everything should work on localhost before deploying

---

**🎉 Enjoy your AI spiritual guide!** 🕉️

Having issues? Check [SETUP.md](./SETUP.md) for detailed troubleshooting.
