// ===== Vedic Wisdom Guide — floating AI chatbot =====

const SCRIPTED_REPLIES = {
  default: "Namaste 🙏 — that's a beautiful question. Let me share what the Vedas teach about this...",
  dosha:   "Your Dosha is your Ayurvedic constitution — Vata (air+ether), Pitta (fire+water), or Kapha (earth+water). Most people are a blend, with one dominant. Take our quiz to discover yours.",
  pranayama: "Pranayama is the practice of breath control. Begin with Nadi Shodhana (alternate-nostril breathing): 4 counts inhale, 4 hold, 4 exhale. Five minutes a day rewires the nervous system within weeks.",
  ayurveda: "Ayurveda — the 'science of life' — is a 5,000-year-old system that personalizes nutrition, herbs, and routines based on your unique constitution. Not one-size-fits-all.",
  mandala: "The 48-day Mandala is one full transformation cycle: 11 daily pillars over 48 days. Show up consistently and you will not be the same person at the end.",
  astrology: "Vedic astrology — Jyotish — is the science of light. It maps the karmic patterns of your birth chart (Kundli) through 27 Nakshatras, Dashas, and planetary transits.",
};

const QUICK_Q = [
  { l: 'What is my Dosha?', k: 'dosha' },
  { l: 'About 48-day program', k: 'mandala' },
  { l: 'What is Pranayama?', k: 'pranayama' },
  { l: 'What is Ayurveda?', k: 'ayurveda' },
];

const VedicWisdomGuide = () => {
  const [open, setOpen] = React.useState(false);
  const [msgs, setMsgs] = React.useState([
    { from: 'bot', text: "Namaste! 🙏 I'm your Vedic Wisdom Guide. Ask me about astrology, Ayurveda, yoga, or transformation. How can I help you today?" },
  ]);
  const [typing, setTyping] = React.useState(false);
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  const send = (text, key) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { from: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = SCRIPTED_REPLIES[key] || SCRIPTED_REPLIES.default;
      setTyping(false);
      setMsgs(m => [...m, { from: 'bot', text: reply }]);
    }, 1100);
  };

  return (
    <React.Fragment>
      <button className={'chat-toggle ' + (open ? 'open' : '')} onClick={() => setOpen(!open)} aria-label="Open chat">
        {open ? '×' : '🙏'}
      </button>
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-avatar">🙏</div>
            <div>
              <h4>Vedic Wisdom Guide</h4>
              <span>● Online — Ask me anything</span>
            </div>
          </div>
          <div className="chat-messages" ref={scrollRef}>
            {msgs.map((m, i) => (
              <div key={i} className={'chat-msg ' + m.from}>{m.text}</div>
            ))}
            {typing && (
              <div className="chat-msg bot typing">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
            )}
          </div>
          <div className="chat-quick">
            {QUICK_Q.map(q => (
              <button key={q.k} onClick={() => send(q.l, q.k)}>{q.l}</button>
            ))}
          </div>
          <div className="chat-input-area">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input, null)}
              placeholder="Ask about Vedic wisdom..." />
            <button className="chat-send" onClick={() => send(input, null)}>➤</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

Object.assign(window, { VedicWisdomGuide });
