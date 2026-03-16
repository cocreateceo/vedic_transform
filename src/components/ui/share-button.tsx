"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { Share2, Copy, Check, X } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
  size?: "sm" | "md";
  variant?: "primary" | "outline";
  label?: string;
}

export function ShareButton({
  title,
  text,
  url,
  className,
  size = "md",
  variant = "outline",
  label = "Share",
}: ShareButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  const handleShare = async () => {
    // Try native Web Share API first (mobile)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch (err) {
        // User cancelled or API failed, fall through to dropdown
        if ((err as DOMException)?.name === "AbortError") return;
      }
    }
    // Fallback: show dropdown
    setShowDropdown((prev) => !prev);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowDropdown(false);
      }, 1500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowDropdown(false);
      }, 1500);
    }
  };

  const handleWhatsApp = () => {
    const whatsappText = encodeURIComponent(`${title}\n\n${text}\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
    setShowDropdown(false);
  };

  const handleTwitter = () => {
    const tweetText = encodeURIComponent(`${text}`);
    const tweetUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
      "_blank"
    );
    setShowDropdown(false);
  };

  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs gap-1",
    md: "px-4 py-2 text-sm gap-1.5",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20",
    outline:
      "border-2 border-[#DAA520] text-[var(--color-primary)] hover:bg-[var(--color-card-bg)] hover:border-[#FFD700]",
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={handleShare}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        aria-label={label}
      >
        <Share2 className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {label}
      </button>

      {/* Dropdown fallback for desktop */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border-2 border-[#DAA520] bg-[var(--color-bg-surface,#fff)] shadow-lg shadow-amber-500/10 overflow-hidden animate-in fade-in slide-in-from-top-1">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)]">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Share via
            </span>
            <button
              onClick={() => setShowDropdown(false)}
              className="p-0.5 rounded hover:bg-[var(--color-card-bg)] text-[var(--color-text-muted)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-card-bg)] transition-colors"
          >
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>

          {/* Twitter / X */}
          <button
            onClick={handleTwitter}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-card-bg)] transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter / X
          </button>

          {/* Divider */}
          <div className="border-t border-[var(--color-border)]" />

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-card-bg)] transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5 text-[var(--color-text-muted)]" />
                Copy Link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
