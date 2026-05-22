// ===== Vedic Wisdom Guide chatbot — LIGHT theme version =====

const SCRIPTED_REPLIES = {
  default: "Namaste — that's a great question. Here's what the Vedas teach about it.",
  dosha:   "Your Dosha is your Ayurvedic constitution — Vata (air+ether), Pitta (fire+water), or Kapha (earth+water). Most people are a blend; one usually dominates.",
  pranayama: "Pranayama is breath control. Start with Nadi Shodhana (alternate-nostril): 4 in / 4 hold / 4 out. Five minutes daily rewires the nervous system in weeks.",
  ayurveda: "Ayurveda — the 'science of life' — personalizes nutrition, herbs, and routine to your unique constitution. Not one-size-fits-all.",
  mandala: "The 48-day Mandala is one full transformation cycle: 11 daily pillars over 48 days. Show up consistently — you will not be the same at the end.",
};

const QUICK_Q = [
  { l: 'What is my Dosha?', k: 'dosha' },
  { l: 'About the 48-day program', k: 'mandala' },
  { l: 'What is Pranayama?', k: 'pranayama' },
  { l: 'What is Ayurveda?', k: 'ayurveda' },
];

const VedicWisdomGuide = () => {
  const [open, setOpen] = React.useState(false);
  const [msgs, setMsgs] = React.useState([
    { from: 'bot', text: "Namaste! I'm your Vedic Wisdom Guide. Ask me about pillars, dosha, pranayama, or anything Vedic. How can I help?" },
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
      <button className={'chat-toggle ' + (open ? 'open' : '')} onClick={() => setOpen(!open)} aria-label="Chat">
        <LucideIcon name={open ? 'x' : 'sparkles'} size={24} color="#fff" />
      </button>
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-avatar"><LucideIcon name="sparkles" size={18} color="#fff" /></div>
            <div style={{ flex: 1 }}>
              <h4>Vedic Wisdom Guide</h4>
              <span>● Online</span>
            </div>
          </div>
          <div className="chat-messages" ref={scrollRef}>
            {msgs.map((m, i) => <div key={i} className={'chat-msg ' + m.from}>{m.text}</div>)}
            {typing && (
              <div className="chat-msg bot typing">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
            )}
          </div>
          <div className="chat-quick">
            {QUICK_Q.map(q => <button key={q.k} onClick={() => send(q.l, q.k)}>{q.l}</button>)}
          </div>
          <div className="chat-input-area">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input, null)}
              placeholder="Ask about Vedic wisdom..." />
            <button className="chat-send" onClick={() => send(input, null)}>
              <LucideIcon name="send" size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

Object.assign(window, { VedicWisdomGuide });
