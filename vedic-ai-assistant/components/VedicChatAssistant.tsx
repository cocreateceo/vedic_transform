"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, Pause, Play } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VedicChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  backendUrl?: string;
}

export function VedicChatAssistant({
  isOpen,
  onClose,
  backendUrl = 'http://localhost:5000'
}: VedicChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioQueueRef = useRef<Array<{url: string, isLast: boolean}>>([]);
  const isPlayingQueueRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Quick question suggestions - Vedic Transform themed
  const quickQuestions = [
    "What is 10X Vedic Transform?",
    "Explain the 11 pillars",
    "What is Brahma Muhurta?",
    "Tell me about meditation",
    "How does karma work?",
    "Guide morning practices",
    "Good for beginners?"
  ];

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setTimeout(() => {
            handleSend(transcript);
          }, 500);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please enable microphone permissions.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: "🕉️ Namaste! I'm your Vedic Transform AI guide. I can answer questions about the 48-day transformation journey, the 11 pillars, and your spiritual practices.\n\nFeel free to ask me anything about meditation, karma points, daily practices, or how the program works!",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopAllAudio();
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Stop audio when closing
  useEffect(() => {
    if (!isOpen) {
      stopAllAudio();
    }
  }, [isOpen]);

  const stopAllAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingQueueRef.current = false;
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (!currentAudioRef.current) return;

    if (isPaused) {
      currentAudioRef.current.play();
      setIsPaused(false);
    } else {
      currentAudioRef.current.pause();
      setIsPaused(true);
    }
  };

  const toggleStartStop = () => {
    if (isSpeaking) {
      stopAllAudio();
    } else {
      // Resume if there's audio in queue
      if (audioQueueRef.current.length > 0) {
        playNextInQueue();
      }
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (currentAudioRef.current) {
      currentAudioRef.current.playbackRate = speed;
    }
  };

  const addToAudioQueue = (audioUrl: string, isLast: boolean) => {
    audioQueueRef.current.push({ url: audioUrl, isLast });

    if (!isPlayingQueueRef.current) {
      playNextInQueue();
    }
  };

  const playNextInQueue = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingQueueRef.current = false;
      setIsSpeaking(false);
      return;
    }

    isPlayingQueueRef.current = true;
    const { url, isLast } = audioQueueRef.current.shift()!;

    const audio = new Audio(url);
    currentAudioRef.current = audio;
    audio.playbackRate = playbackSpeed;

    setIsSpeaking(true);
    setIsPaused(false);

    audio.play().catch(err => {
      console.error('Audio play error:', err);
      playNextInQueue();
    });

    audio.onended = () => {
      if (isLast && audioQueueRef.current.length === 0) {
        setIsSpeaking(false);
        isPlayingQueueRef.current = false;
      } else {
        playNextInQueue();
      }
    };

    audio.onerror = (err) => {
      console.error('Audio error:', err);
      playNextInQueue();
    };
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Stop any playing audio
    stopAllAudio();

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call backend with SSE streaming
      const response = await fetch(`${backendUrl}/chat-with-voice-realtime`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: text })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantMessage: Message | null = null;

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'answer') {
              assistantMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.answer,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, assistantMessage!]);
              setIsLoading(false);
            } else if (data.type === 'chunk') {
              const audioUrl = `${backendUrl}${data.audio_url}`;
              addToAudioQueue(audioUrl, data.is_last);
            } else if (data.type === 'error') {
              console.error('Backend error:', data.error);
              throw new Error(data.error);
            }
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the voice server is running.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    handleSend(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header with Avatar */}
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 pt-8 pb-6 px-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Avatar Circle */}
          <div className="flex justify-center mb-4">
            <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden border-4 border-white/20">
              {/* Avatar image - replace with actual avatar */}
              <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center text-6xl">
                🕉️
              </div>
            </div>
          </div>

          {/* Title and Controls */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Vedic Transform AI Guide</h2>

            {/* Speed and Control Buttons */}
            <div className="flex justify-center items-center gap-2 mb-3">
              {/* Speed buttons */}
              {[0.5, 1, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => changeSpeed(speed)}
                  className={`px-3 py-1 rounded text-sm font-bold transition-all ${
                    playbackSpeed === speed
                      ? 'bg-white text-orange-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {speed}x
                </button>
              ))}

              {/* Pause button */}
              <button
                onClick={togglePause}
                disabled={!isSpeaking}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-bold transition-all flex items-center gap-1"
              >
                <Pause className="w-3 h-3" />
                Pause
              </button>

              {/* Start/Stop button */}
              <button
                onClick={toggleStartStop}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-sm font-bold transition-all flex items-center gap-1"
              >
                {isSpeaking ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isSpeaking ? 'Stop' : 'Start'}
              </button>
            </div>

            <p className="text-sm text-white/90">
              Ask me anything about your 48-day transformation journey
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message, index) => (
            <div key={message.id}>
              <div
                className={`flex gap-3 mb-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                }`}>
                  {message.role === 'user' ? '👤' : '🕉️'}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white shadow-sm border border-gray-200'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Questions after first message */}
              {index === 0 && message.role === 'assistant' && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {quickQuestions.map((question, qIndex) => (
                    <button
                      key={qIndex}
                      onClick={() => handleQuickQuestion(question)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-full transition-colors shadow-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm">
                🕉️
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              disabled={isLoading || isListening}
            />

            {/* Microphone Button */}
            <button
              onClick={toggleVoiceInput}
              className={`p-3 rounded-full transition-all shadow-md ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-full font-medium transition-all disabled:cursor-not-allowed shadow-md"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
