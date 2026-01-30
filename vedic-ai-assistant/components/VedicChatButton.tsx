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
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="Open AI Chat Assistant"
      >
        <MessageCircle className="w-6 h-6" />

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask your Vedic Guide
        </div>

        {/* Notification badge (optional) */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
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
