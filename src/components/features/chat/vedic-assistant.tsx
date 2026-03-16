"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const GREETING =
  "\u{1F549}\uFE0F Namaste! I'm your Vedic Transform AI guide. I can answer questions about the 48-day transformation journey, the 11 pillars, and your spiritual practices.\n\nFeel free to ask me anything about meditation, karma points, daily practices, or how the program works!";

export function VedicAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // TTS
  const speakText = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const cleanText = text.replace(
        /[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu,
        ""
      );
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechRate;
      utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
      utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
      utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
      window.speechSynthesis.speak(utterance);
    },
    [speechRate]
  );

  const togglePause = () => {
    if (!window.speechSynthesis) return;
    if (isPaused) { window.speechSynthesis.resume(); setIsPaused(false); }
    else { window.speechSynthesis.pause(); setIsPaused(true); }
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    stopSpeaking();

    const userMsg: Message = { role: "user", content: input.trim(), timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const botMsg: Message = {
        role: "assistant",
        content: data.reply || "I apologize, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };
      setMessages([...newMessages, botMsg]);
      speakText(botMsg.content);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I'm having trouble connecting right now. Please try again.", timestamp: new Date() },
      ]);
    }
    setIsLoading(false);
  };

  // STT
  const toggleListening = () => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => { setInput(event.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Floating button ──
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Vedic AI Assistant"
        className="fixed bottom-20 right-6 z-[9999] w-[72px] h-[72px] rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xl shadow-amber-500/25 transition-all duration-300 hover:scale-110 hover:shadow-amber-500/50 group flex items-center justify-center"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {/* AI badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-lg">
          AI
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl font-medium">
          Ask your Vedic Guide
          <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-orange-500" />
        </div>
      </button>
    );
  }

  // ── Chat panel ──
  return (
    <div className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm">
      {/* Sprite animation styles */}
      <style>{`
        .vedic-chat-modal {
          position: fixed;
          top: 20px;
          right: -100%;
          width: 520px;
          max-width: 90vw;
          height: calc(100vh - 40px);
          background: white;
          border-radius: 20px;
          border: 2px solid #DAA520;
          box-shadow: 0 10px 50px rgba(0,0,0,0.3), 0 0 20px rgba(255,215,0,0.1);
          transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .vedic-chat-modal.active {
          right: 30px;
        }

        /* Avatar Sprite - Animated */
        .vedic-avatar-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .vedic-large-avatar-sprite {
          width: 512px;
          height: 768px;
          background-image: url(/avatar_sprite_circular.png);
          background-size: 41472px 768px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-color: transparent;
          image-rendering: crisp-edges;
          transform: scale(0.50) translateY(10px);
          transform-origin: center;
        }
        .vedic-large-avatar-sprite.talking {
          animation: vedic-mouth-animation 5.0625s steps(81) infinite;
        }
        @keyframes vedic-mouth-animation {
          from { background-position: 0 0; }
          to { background-position: -41472px 0; }
        }

        /* Small avatar for messages */
        .vedic-small-avatar-sprite {
          background-image: url(/avatar_sprite_circular.png);
          background-size: 2592px 48px;
          background-repeat: no-repeat;
          background-position: 0 -8px;
          background-color: white;
          image-rendering: crisp-edges;
        }
        .vedic-small-avatar-sprite.talking {
          animation: vedic-small-mouth-animation 5.0625s steps(81) infinite;
        }
        @keyframes vedic-small-mouth-animation {
          from { background-position: 0 -8px; }
          to { background-position: -2592px -8px; }
        }

        .vedic-chat-modal .messages-area::-webkit-scrollbar { display: none; }
        .vedic-chat-modal .messages-area { scrollbar-width: none; -ms-overflow-style: none; }

        @media (max-width: 768px) {
          .vedic-chat-modal { width: calc(100vw - 20px); height: 85vh; }
          .vedic-chat-modal.active { right: 10px; }
          .vedic-large-avatar-sprite { transform: scale(0.45) translateY(15px); }
        }
      `}</style>

      <div className={`vedic-chat-modal ${isOpen ? "active" : ""}`}>

        {/* ── Header with animated avatar ── */}
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 flex flex-col items-center justify-center py-2 px-4 flex-shrink-0 overflow-hidden rounded-t-[18px]" style={{ height: "240px" }}>
          {/* Close */}
          <button
            onClick={() => { setIsOpen(false); stopSpeaking(); }}
            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-orange-800/40 hover:bg-orange-800/60 text-white transition-all z-10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>

          {/* Animated Avatar Sprite */}
          <div className="vedic-avatar-wrapper">
            <div className={`vedic-large-avatar-sprite ${isSpeaking && !isPaused ? "talking" : ""}`} />
          </div>
        </div>

        {/* ── Title + Speed Controls (same row) ── */}
        <div className="bg-white py-3 px-3 border-b-2 border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-[17px] font-bold text-black">Vedic AI Assistant</h1>
            <div className="flex items-center gap-1">
              {[0.5, 1, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSpeechRate(speed)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold min-w-[32px] transition-all ${
                    speechRate === speed
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                  }`}
                >
                  {speed}x
                </button>
              ))}
              <button
                onClick={isSpeaking ? togglePause : undefined}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all flex items-center gap-0.5 ${
                  isSpeaking
                    ? isPaused
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-sm"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-400 border border-gray-200 cursor-default"
                }`}
              >
                {isPaused ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>Play</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>Pause</>
                )}
              </button>
            </div>
          </div>
          <p className="text-[13px] text-gray-500 leading-tight">
            Ask me anything about your 48-day transformation journey
          </p>
        </div>

        {/* ── Messages ── */}
        <div className="flex-auto min-h-0 overflow-y-auto px-3 py-2 bg-white messages-area">
          {messages.map((msg, i) => {
            const isBot = msg.role === "assistant";
            return (
              <div key={i} className={`flex gap-2.5 mb-3 ${!isBot ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                {isBot ? (
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 border-orange-500 vedic-small-avatar-sprite ${isSpeaking && !isPaused ? "talking" : ""}`} />
                ) : (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {/* Bubble */}
                <div className={`flex-1 ${!isBot ? "text-right" : ""}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl max-w-[85%] text-left ${
                    isBot
                      ? "bg-gray-50 border border-gray-200 shadow-sm"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                  }`}>
                    <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1.5 ${isBot ? "text-amber-500" : "text-orange-200"}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-2.5 mb-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-orange-500 vedic-small-avatar-sprite" />
              <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input ── */}
        <div className="flex-shrink-0 border-t-2 border-[#DAA520]/30 py-2.5 px-3 bg-white flex gap-2 items-center rounded-b-[18px]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-[25px] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm transition-all"
          />

          {/* Green Mic */}
          <button
            onClick={toggleListening}
            className={`px-3 py-2.5 rounded-[25px] transition-all font-bold ${
              isListening
                ? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg"
                : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
            }`}
            style={{ minWidth: "48px", minHeight: "40px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mx-auto">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          </button>

          {/* Orange Send pill */}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`px-5 py-2.5 rounded-[25px] font-semibold text-sm flex items-center gap-1.5 transition-all ${
              !input.trim() || isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 hover:scale-105 active:scale-95 text-white shadow-md hover:shadow-lg"
            }`}
            style={{ minHeight: "40px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
