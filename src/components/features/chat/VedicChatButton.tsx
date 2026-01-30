"use client";

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { VedicChatAssistant } from './VedicChatAssistant';

interface VedicChatButtonProps {
  backendUrl?: string;
}

export function VedicChatButton({ backendUrl }: VedicChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button - Matches "Start Free" Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full shadow-2xl shadow-amber-500/25 transition-all duration-300 hover:scale-110 hover:shadow-amber-500/50 group animate-pulse hover:animate-none"
        aria-label="Open AI Chat Assistant"
        style={{ width: '72px', height: '72px' }}
      >
        <MessageCircle className="w-9 h-9 mx-auto" strokeWidth={2.5} />

        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-lg">
          AI
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl font-medium">
          🕉️ Ask your Vedic Guide
          <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-orange-500"></div>
        </div>
      </button>

      {/* Chat Modal */}
      <VedicChatAssistant
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        backendUrl={backendUrl}
      />
    </>
  );
}
