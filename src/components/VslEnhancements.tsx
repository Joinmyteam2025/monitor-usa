import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   VSL Enhancement Components
   - UnmuteOverlay: pulsing "🔊 Tap to unmute" + click-anywhere unmute
   - ExitIntentPopup: fires when mouse moves toward close/back
   ═══════════════════════════════════════════════════════════ */

/**
 * UnmuteOverlay — renders a pulsing unmute button on top of a muted video.
 * Also attaches a document-level click listener to unmute on first interaction.
 */
export function useUnmute(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [isMuted, setIsMuted] = useState(true);

  const unmute = useCallback(() => {
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  }, [videoRef]);

  useEffect(() => {
    const handler = () => {
      unmute();
      document.removeEventListener("click", handler);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [unmute]);

  return { isMuted, unmute };
}

export function UnmuteButton({ onUnmute }: { onUnmute: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onUnmute();
      }}
      className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
      style={{ animation: "unmute-pulse 2s ease-in-out infinite" }}
    >
      <span className="text-base">🔊</span>
      <span className="text-sm font-medium">Tap to unmute</span>
    </button>
  );
}

/**
 * ExitIntentPopup — shows a last-chance CTA when the user's mouse
 * moves toward the top of the viewport (desktop only).
 */
export function ExitIntentPopup({
  headline,
  body,
  ctaText,
  onCtaClick,
  accentColor = "#DC2626",
}: {
  headline: string;
  body: string;
  ctaText: string;
  onCtaClick: () => void;
  accentColor?: string;
}) {
  const [show, setShow] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fired.current) return;
      if (e.clientY < 10) {
        fired.current = true;
        setShow(true);
      }
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShow(false)}
      />
      {/* Modal */}
      <div
        className="relative bg-[#0C0A09] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
        style={{ animation: "exit-popup-in 0.4s ease-out" }}
      >
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="size-5" />
        </button>
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-black text-white mb-3">{headline}</h3>
        <p className="text-white/60 text-sm leading-relaxed mb-6">{body}</p>
        <button
          onClick={() => {
            setShow(false);
            onCtaClick();
          }}
          className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          {ctaText}
        </button>
        <p className="text-white/30 text-xs mt-3">No credit card required</p>
      </div>
    </div>
  );
}

/**
 * VslEnhancementStyles — inject the CSS animations needed by the components.
 * Render once at the top of any page using these components.
 */
export function VslEnhancementStyles() {
  return (
    <style>{`
      @keyframes unmute-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.85; transform: scale(1.05); }
      }
      @keyframes exit-popup-in {
        from { opacity: 0; transform: scale(0.9) translateY(20px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
    `}</style>
  );
}
