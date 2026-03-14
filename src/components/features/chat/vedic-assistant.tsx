"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Pause,
  Play,
  Volume2,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const GREETING =
  "\u{1F64F} Namaste! I'm your Vedic Transform AI guide. I can answer questions about the 48-day transformation journey, the 11 pillars, and your spiritual practices.\n\nFeel free to ask me anything about meditation, karma points, daily practices, or how the program works!";

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

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Text-to-Speech
  const speakText = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      // Strip emojis for cleaner speech
      const cleanText = text.replace(
        /[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu,
        ""
      );
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechRate;
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      window.speechSynthesis.speak(utterance);
    },
    [speechRate]
  );

  const togglePause = () => {
    if (!window.speechSynthesis) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
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

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      const botMsg: Message = {
        role: "assistant",
        content:
          data.reply || "I apologize, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };
      setMessages([...newMessages, botMsg]);
      speakText(botMsg.content);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please check your connection and try again.",
          timestamp: new Date(),
        },
      ]);
    }
    setIsLoading(false);
  };

  // Speech-to-Text
  const toggleListening = () => {
    if (
      typeof window === "undefined" ||
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const speedOptions = [0.5, 1, 1.5, 2];

  // ── Floating button (closed state) ──
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Vedic AI Assistant"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 4px 20px rgba(124, 58, 237, 0.5), 0 0 40px rgba(124, 58, 237, 0.2)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        }}
      >
        <MessageCircle size={28} color="white" />
      </button>
    );
  }

  // ── Chat panel (open state) ──
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        width: "min(400px, calc(100vw - 32px))",
        height: "min(620px, calc(100vh - 48px))",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--color-bg-surface, #ffffff)",
        border: "1px solid var(--color-border, rgba(124,58,237,0.15))",
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.2), 0 0 60px rgba(124,58,237,0.15)",
        animation: "slideUp 0.35s ease-out",
      }}
    >
      {/* Inline animation keyframes */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
          padding: "16px",
          color: "white",
          flexShrink: 0,
        }}
      >
        {/* Top row: avatar + title + close */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "3px solid #FF9933",
              background:
                "linear-gradient(135deg, #FFD700 0%, #FF9933 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              flexShrink: 0,
            }}
          >
            {"\u{1F549}"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: "0.3px",
              }}
            >
              Vedic AI Assistant
            </div>
            <div
              style={{
                fontSize: "11px",
                opacity: 0.85,
                marginTop: "2px",
                lineHeight: 1.3,
              }}
            >
              Ask me anything about your 48-day transformation journey
            </div>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              stopSpeaking();
            }}
            aria-label="Close chat"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Speed controls row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          <Volume2 size={14} style={{ opacity: 0.7 }} />
          {speedOptions.map((rate) => (
            <button
              key={rate}
              onClick={() => setSpeechRate(rate)}
              style={{
                background:
                  speechRate === rate
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.1)",
                border:
                  speechRate === rate
                    ? "1px solid rgba(255,255,255,0.5)"
                    : "1px solid transparent",
                borderRadius: "12px",
                padding: "2px 10px",
                fontSize: "11px",
                color: "white",
                cursor: "pointer",
                fontWeight: speechRate === rate ? 700 : 400,
                transition: "all 0.2s ease",
              }}
            >
              {rate}x
            </button>
          ))}
          {/* Pause / Play */}
          {isSpeaking && (
            <button
              onClick={togglePause}
              aria-label={isPaused ? "Resume speech" : "Pause speech"}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                marginLeft: "auto",
              }}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "var(--color-bg-primary, #faf5ff)",
        }}
        className="hide-scrollbar"
      >
        {messages.map((msg, i) => {
          const isBot = msg.role === "assistant";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isBot ? "flex-start" : "flex-end",
                maxWidth: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "8px",
                  maxWidth: "85%",
                  flexDirection: isBot ? "row" : "row-reverse",
                }}
              >
                {/* Bot avatar */}
                {isBot && (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #FFD700, #FF9933)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    {"\u{1F549}"}
                  </div>
                )}
                {/* Message bubble */}
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: isBot
                      ? "4px 16px 16px 16px"
                      : "16px 4px 16px 16px",
                    background: isBot
                      ? "var(--color-card-bg, rgba(124,58,237,0.08))"
                      : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    color: isBot
                      ? "var(--color-text-primary, #1e1b4b)"
                      : "white",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    border: isBot
                      ? "1px solid var(--color-border, rgba(124,58,237,0.1))"
                      : "none",
                    boxShadow: isBot
                      ? "none"
                      : "0 2px 8px rgba(124,58,237,0.3)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
              {/* Timestamp */}
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--color-text-muted, #94a3b8)",
                  marginTop: "4px",
                  paddingLeft: isBot ? "36px" : "0",
                  paddingRight: isBot ? "0" : "0",
                }}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              maxWidth: "85%",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FFD700, #FF9933)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              {"\u{1F549}"}
            </div>
            <div
              style={{
                padding: "12px 18px",
                borderRadius: "4px 16px 16px 16px",
                background:
                  "var(--color-card-bg, rgba(124,58,237,0.08))",
                border:
                  "1px solid var(--color-border, rgba(124,58,237,0.1))",
                display: "flex",
                gap: "6px",
              }}
            >
              {[0, 1, 2].map((dot) => (
                <div
                  key={dot}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#7c3aed",
                    animation: `typingDot 1.4s ease-in-out ${dot * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div
        style={{
          padding: "12px 16px",
          borderTop:
            "1px solid var(--color-border, rgba(124,58,237,0.1))",
          background: "var(--color-bg-surface, #ffffff)",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "12px",
            border: "1px solid var(--color-border, rgba(124,58,237,0.2))",
            background:
              "var(--color-bg-elevated, #f5f0ff)",
            color: "var(--color-text-primary, #1e1b4b)",
            fontSize: "13px",
            outline: "none",
            transition: "border-color 0.2s",
            minWidth: 0,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#7c3aed";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor =
              "var(--color-border, rgba(124,58,237,0.2))";
          }}
        />

        {/* Mic button */}
        <button
          onClick={toggleListening}
          aria-label={isListening ? "Stop listening" : "Start voice input"}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: isListening
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "var(--color-bg-elevated, #f5f0ff)",
            color: isListening
              ? "white"
              : "var(--color-text-secondary, #64748b)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Send button */}
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background:
              !input.trim() || isLoading
                ? "var(--color-bg-elevated, #e5e7eb)"
                : "linear-gradient(135deg, #FF9933, #FFD700)",
            color:
              !input.trim() || isLoading
                ? "var(--color-text-muted, #94a3b8)"
                : "#1e1b4b",
            cursor:
              !input.trim() || isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
            boxShadow:
              input.trim() && !isLoading
                ? "0 2px 8px rgba(255,153,51,0.4)"
                : "none",
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
