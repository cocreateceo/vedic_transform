"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Mic } from 'lucide-react';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className={`vedic-chat-modal ${isOpen ? 'active' : ''}`}>

        {/* CROPION Header Structure - Avatar Section */}
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 flex flex-col items-center justify-center py-2 px-4 flex-shrink-0 overflow-hidden rounded-t-[20px]" style={{ height: '240px' }}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-orange-800/40 hover:bg-orange-800/60 text-white transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Avatar Sprite - CROPION exact placement */}
          <div className="vedic-avatar-wrapper">
            <div className={`vedic-large-avatar-sprite ${isSpeaking ? 'talking' : ''}`} />
          </div>

          <style jsx global>{`
            .vedic-chat-modal {
              position: fixed;
              top: 20px;
              right: -100%;
              transform: none;
              width: 520px;
              max-width: 90vw;
              height: calc(100vh - 40px);
              background: white;
              border-radius: 20px;
              box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
              transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              z-index: 10000;
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }

            .vedic-chat-modal.active {
              right: 30px;
            }

            /* Hide scrollbar in messages area - all browsers */
            .vedic-chat-modal .flex-auto::-webkit-scrollbar {
              display: none;
            }

            /* Avatar Wrapper - CROPION Exact Implementation */
            .vedic-avatar-wrapper {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              cursor: pointer;
              transition: transform 0.3s ease;
            }

            .vedic-avatar-wrapper:hover .vedic-large-avatar-sprite {
              transform: scale(0.52) translateY(10px);
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

            /* Small Avatar Sprite for Message Avatars */
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

            @media (max-width: 768px) {
              .vedic-chat-modal {
                width: calc(100vw - 20px);
                height: 85vh;
                right: -100%;
              }

              .vedic-chat-modal.active {
                right: 10px;
              }

              .vedic-large-avatar-sprite {
                transform: scale(0.5) translateY(75px);
              }
            }
          `}</style>

        </div>

        {/* CROPION Chat Header Structure */}
        <div className="bg-white py-3 px-3 border-b-2 border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-[20px] font-bold text-black">Vedic AI Assistant</h1>

            {/* Inline Audio Controls - YouTube Style */}
            <div className="flex items-center gap-1">
              {/* Speed presets */}
              {[0.5, 1, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => changeSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold min-w-[32px] transition-all ${
                    playbackSpeed === speed
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                  }`}
                >
                  {speed}x
                </button>
              ))}

              {/* Play/Pause button - Always Enabled */}
              <button
                onClick={togglePause}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all flex items-center gap-0.5 ${
                  isPaused
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md border-none'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md border-none'
                }`}
              >
                {isPaused ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                    Play
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                    </svg>
                    Pause
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-[15px] text-gray-600 leading-tight">
            Ask me anything about your 48-day transformation journey
          </p>
        </div>

        {/* CROPION Messages Area */}
        <div className="flex-auto min-h-0 overflow-y-auto px-2.5 py-1.5 bg-white" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`flex gap-2.5 mb-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                {message.role === 'user' ? (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 border-orange-500 vedic-small-avatar-sprite ${isSpeaking ? 'talking' : ''}`} />
                )}

                {/* Message Content */}
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-3 py-2 rounded-2xl ${
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

            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 mb-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-orange-500 vedic-small-avatar-sprite" />
              <div className="bg-white px-3 py-2 rounded-2xl shadow-sm border border-gray-200">
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

        {/* CROPION Input Area Structure */}
        <div className="flex-shrink-0 border-t-2 border-gray-200 py-2 px-2.5 bg-white flex gap-2 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question here..."
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-[25px] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm transition-all"
            style={{ minHeight: '40px' }}
          />

          {/* Microphone Button - CROPION exact */}
          <button
            onClick={toggleVoiceInput}
            className={`px-3 py-2 rounded-[25px] transition-all font-bold ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
            }`}
            title={isListening ? 'Stop listening' : 'Voice input'}
            style={{ minWidth: '48px', minHeight: '40px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mx-auto">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          </button>

          {/* Send Button - CROPION exact */}
          <button
            onClick={() => handleSend()}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 hover:scale-105 active:scale-95 text-white rounded-[25px] font-semibold transition-all shadow-md hover:shadow-lg text-sm flex items-center gap-1.5"
            style={{ minHeight: '40px' }}
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
