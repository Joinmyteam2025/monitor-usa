// useOfferTracking.ts — Conversion tracking hook for all offer pages
// Fires Meta Pixel + GA4 events for VSL/offer page analytics

import { useEffect, useRef, useCallback } from "react";

// Site identifier for tagging events
const getSiteName = () => {
  const host = window.location.hostname;
  if (host.includes("iamzachgarner")) return "izg";
  if (host.includes("garnerhealthgroup")) return "ghg";
  if (host.includes("gtgfreight")) return "gtg";
  if (host.includes("nexhr")) return "nexhr";
  if (host.includes("nexsuite")) return "nexsuite";
  if (host.includes("nexcrm")) return "nexcrm";
  if (host.includes("nexdial")) return "nexdial";
  if (host.includes("monitorusa")) return "monitorusa";
  if (host.includes("solarwarrantyusa")) return "solar";
  if (host.includes("garnerfinancialpartners")) return "gfp";
  return "unknown";
};

// Safe event firing
const fireEvent = (eventName: string, data: Record<string, unknown> = {}) => {
  const site = getSiteName();
  const enriched = { ...data, site, page: "/offer", timestamp: Date.now() };

  // Meta Pixel
  if (typeof window !== "undefined" && (window as any).fbq) {
    // Use standard events where possible, custom for the rest
    if (eventName === "Lead" || eventName === "ViewContent" || eventName === "InitiateCheckout") {
      (window as any).fbq("track", eventName, enriched);
    } else {
      (window as any).fbq("trackCustom", eventName, enriched);
    }
  }

  // GA4
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, enriched);
  }

  // Log for debugging
  console.log(`[GFP Track] ${eventName}`, enriched);
};

export function useOfferTracking(videoRef?: React.RefObject<HTMLVideoElement | null>) {
  const videoMilestonesRef = useRef<Set<number>>(new Set());
  const scrollMilestonesRef = useRef<Set<number>>(new Set());
  const hasTrackedViewRef = useRef(false);

  // Fire ViewContent on mount
  useEffect(() => {
    if (!hasTrackedViewRef.current) {
      fireEvent("ViewContent", { content_type: "offer_page" });
      hasTrackedViewRef.current = true;
    }
  }, []);

  // Video watch % tracking
  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const milestones = [25, 50, 75, 90, 100];

    const handleTimeUpdate = () => {
      if (!video.duration || video.duration === 0) return;
      const pct = Math.floor((video.currentTime / video.duration) * 100);

      for (const m of milestones) {
        if (pct >= m && !videoMilestonesRef.current.has(m)) {
          videoMilestonesRef.current.add(m);
          fireEvent("VSL_Watch", {
            percent: m,
            duration: Math.floor(video.duration),
            current_time: Math.floor(video.currentTime),
          });
        }
      }
    };

    const handlePlay = () => fireEvent("VSL_Play");
    const handlePause = () => {
      if (video.currentTime > 0 && video.currentTime < video.duration) {
        fireEvent("VSL_Pause", {
          percent: Math.floor((video.currentTime / video.duration) * 100),
          current_time: Math.floor(video.currentTime),
        });
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [videoRef]);

  // Scroll depth tracking
  useEffect(() => {
    const milestones = [25, 50, 75, 100];

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.floor((scrollTop / docHeight) * 100);

      for (const m of milestones) {
        if (pct >= m && !scrollMilestonesRef.current.has(m)) {
          scrollMilestonesRef.current.add(m);
          fireEvent("Scroll_Depth", { percent: m });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // CTA click tracker
  const trackCTA = useCallback((ctaName: string, destination?: string) => {
    fireEvent("Lead", {
      content_name: ctaName,
      destination: destination || "/signup",
    });
    fireEvent("CTA_Click", {
      button: ctaName,
      destination: destination || "/signup",
    });
  }, []);

  // Unmute tracker
  const trackUnmute = useCallback(() => {
    fireEvent("VSL_Unmute");
  }, []);

  return { trackCTA, trackUnmute, fireEvent };
}
