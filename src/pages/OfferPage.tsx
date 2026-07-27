import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  ArrowRight, CheckCircle2, Shield, Star, Clock, Zap,
  Bot, Camera, Lock, Cpu,
  Flame, Phone, AlertTriangle, Smartphone, Wifi, Home,
} from "lucide-react";
import { useOfferTracking } from "../hooks/useOfferTracking";
import { useUnmute, UnmuteButton, VslEnhancementStyles } from "../components/VslEnhancements";

/* ═══════════════════════════════════════════════════════════
   MONITORUSA.AI OFFER PAGE — AI-Powered Home Security VSL
   monitorusa.ai/offer
   ═══════════════════════════════════════════════════════════ */

const BRAND = {
  navy: "#0B1B2B",
  navyLight: "#0F2A42",
  navyDark: "#06111D",
  cyan: "#00D4FF",
  cyanDark: "#00A3CC",
  electric: "#0088FF",
  white: "#FFFFFF",
};

const OUTCOMES = [
  "How AI monitors your home 24/7 with zero hold times and instant dispatch",
  "Why AI-powered threat verification eliminates 50%+ of false alarms",
  "How smart home automation integrates with security for total control",
  "Why our AI Messenger™ contacts your emergency contacts instantly",
  "How video verification gives first responders real-time intel",
  "Why MonitorUSA.ai costs less than traditional monitoring — with better tech",
];

const TRUST_STATS = [
  { value: "24/7", label: "AI Monitoring" },
  { value: "50", label: "% Fewer False Alarms" },
  { value: "3", label: "Seconds Avg Response" },
  { value: "100", label: "% Month-to-Month" },
];

const VALUE_STACK = [
  { icon: Shield, name: "24/7 AI Professional Monitoring", value: "$29.99/mo" },
  { icon: Bot, name: "AI Messenger™ — False Alarm Reduction", value: "$14.99/mo" },
  { icon: Camera, name: "Video Verification & Smart Cameras", value: "$19.99/mo" },
  { icon: Phone, name: "Instant Emergency Dispatch", value: "$9.99/mo" },
  { icon: Home, name: "Full Smart Home Automation", value: "$14.99/mo" },
  { icon: Smartphone, name: "Client Portal & Mobile Dashboard", value: "$9.99/mo" },
  { icon: Wifi, name: "Cellular Backup — Never Go Offline", value: "$7.99/mo" },
  { icon: Lock, name: "Intrusion, Fire, CO, Flood Protection", value: "$19.99/mo" },
];

const SOCIAL_PROOF_ENTRIES = [
  { name: "Robert Torres", initials: "RT", action: "just activated AI monitoring", location: "Phoenix, AZ" },
  { name: "Lisa Chang", initials: "LC", action: "just upgraded to Total Command", location: "Houston, TX" },
  { name: "David Morales", initials: "DM", action: "just signed up for AI Protect", location: "Atlanta, GA" },
  { name: "Jennifer Walsh", initials: "JW", action: "just connected 8 smart devices", location: "Miami, FL" },
  { name: "Chris Patterson", initials: "CP", action: "just set up video verification", location: "Denver, CO" },
  { name: "Ashley Grant", initials: "AG", action: "just activated her dashboard", location: "Dallas, TX" },
  { name: "Kevin Nguyen", initials: "KN", action: "just enrolled in Smart Watch", location: "Las Vegas, NV" },
  { name: "Brittany Lewis", initials: "BL", action: "just got her first AI alert", location: "San Diego, CA" },
];

/* ─── Reusable animated components ─── */

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function CountUpStat({ value, label, run }: { value: string; label: string; run: boolean }) {
  const numMatch = value.match(/^(\d+)/);
  const num = numMatch ? parseInt(numMatch[1]) : 0;
  const suffix = numMatch ? value.slice(numMatch[1].length) : value;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!run || !num) return;
    let frame = 0;
    const frames = 40;
    const step = () => { frame++; setDisplay(Math.min(Math.round((frame / frames) * num), num)); if (frame < frames) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [run, num]);
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-black" style={{ color: BRAND.cyan }}>{num ? `${display}${suffix}` : value}</div>
      <div className="text-xs text-white/50 mt-1 font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

function SocialProofToasts({ entries }: { entries: typeof SOCIAL_PROOF_ENTRIES }) {
  const [show, setShow] = useState(false);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => { setIdx((p) => (p + 1) % entries.length); setShow(true); setTimeout(() => setShow(false), 4000); }, 8000);
    const t = setTimeout(() => { setShow(true); setTimeout(() => setShow(false), 4000); }, 5000);
    return () => { clearInterval(interval); clearTimeout(t); };
  }, [entries.length]);
  if (!show) return null;
  const e = entries[idx];
  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500 max-w-xs">
      <div className="bg-[#0B1B2B]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-3">
        <div className="size-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy }}>{e.initials}</div>
        <div><p className="text-white text-sm font-medium">{e.name} {e.action}</p><p className="text-white/40 text-xs">{e.location} • just now</p></div>
      </div>
    </div>
  );
}

function CountdownTimer() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const key = "musa_offer_timer";
    let end = parseInt(localStorage.getItem(key) || "0");
    if (!end || end < Date.now()) { end = Date.now() + 24 * 60 * 60 * 1000; localStorage.setItem(key, String(end)); }
    const tick = () => { const d = Math.max(0, end - Date.now()); setTime({ h: Math.floor(d / 3600000), m: Math.floor((d % 3600000) / 60000), s: Math.floor((d % 60000) / 1000) }); };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="flex items-center justify-center gap-2 my-6">
      {[["h", time.h], ["m", time.m], ["s", time.s]].map(([l, v]) => (
        <div key={l as string} className="flex flex-col items-center">
          <div className="text-2xl md:text-3xl font-black tabular-nums px-3 py-2 rounded-lg" style={{ background: "rgba(0,212,255,0.1)", color: BRAND.cyan }}>{String(v).padStart(2, "0")}</div>
          <span className="text-[10px] uppercase tracking-wider text-white/30 mt-1">{l === "h" ? "Hours" : l === "m" ? "Minutes" : "Seconds"}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══ MAIN COMPONENT ═══ */

export function OfferPage() {
  useDocumentTitle("Special Offer");
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { trackCTA } = useOfferTracking(videoRef);
  const { isMuted, unmute } = useUnmute(videoRef);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = videoSectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setScrolledPast(!e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsInView(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen text-white" style={{ background: BRAND.navy }}>

      {/* ═══ HEADER ═══ */}
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50" style={{ background: `${BRAND.navy}f2`, borderColor: `${BRAND.cyan}1a` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="size-7 transition-transform duration-300 group-hover:scale-110" style={{ color: BRAND.cyan }} />
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide leading-tight">
                MonitorUSA<span style={{ color: BRAND.cyan }}>.ai</span>
              </h1>
              <p className="text-[9px] tracking-[0.15em] uppercase font-medium -mt-0.5 text-white/40">
                AI-Powered Home Security
              </p>
            </div>
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy, boxShadow: `0 8px 24px ${BRAND.cyan}40` }}
           onClick={() => trackCTA("offer_cta", "/signup")}>
            Get Protected
          </Link>
        </div>
      </header>

      {/* ═══ HERO + VIDEO ═══ */}
      <section className="relative" ref={videoSectionRef}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top right, ${BRAND.cyan}08, transparent 60%)` }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at bottom left, ${BRAND.electric}08, transparent 60%)` }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <FadeInSection>
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium" style={{ background: `${BRAND.cyan}15`, border: `1px solid ${BRAND.cyan}30`, color: BRAND.cyan }}>
                <span className="size-1.5 rounded-full animate-pulse" style={{ background: BRAND.cyan }} />
                Limited Time Offer — Lock In Your Rate Today
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center leading-[1.15] mb-5 max-w-4xl mx-auto">
              Your Home Deserves{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})` }}>
                AI-Powered Security That Never Sleeps
              </span>
            </h1>
            <p className="text-white/60 text-center max-w-2xl mx-auto mb-3 text-lg leading-relaxed">
              Discover the AI-driven alarm monitoring system that responds in seconds — not minutes. Full home automation, smart maintenance management, and a private client portal. Traditional monitoring is obsolete.
            </p>

            <div className="flex items-center justify-center gap-2 mb-8 text-white/40 text-xs">
              <div className="flex -space-x-2">
                {SOCIAL_PROOF_ENTRIES.slice(0, 4).map((e, i) => (
                  <div key={i} className="size-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold" style={{ background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, borderColor: BRAND.navy, color: BRAND.navy }}>{e.initials}</div>
                ))}
              </div>
              <span>Hundreds of homes protected nationwide</span>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="max-w-4xl mx-auto">
              <VslEnhancementStyles />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ boxShadow: `0 25px 60px ${BRAND.cyan}10`, aspectRatio: "16/9" }}>
                <video
                  ref={videoRef}
                  src="https://exciting-hippopotamus-102.convex.cloud/api/storage/63c5d86f-1771-476e-b3db-006f9a823474"
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                  controls
                  controlsList="nodownload"
                  autoPlay
                  muted
                  playsInline
                  onEnded={() => {}}
                />
                {isMuted && <UnmuteButton onUnmute={unmute} />}
              </div>
              <p className="text-center text-white/30 text-xs mt-3 flex items-center justify-center gap-1.5">
                <Clock className="size-3" />
                Watch how AI protects your home 24/7
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="border-y border-white/5" style={{ background: BRAND.navyDark }}>
        <div ref={statsRef} className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_STATS.map((s, i) => (
            <CountUpStat key={i} value={s.value} label={s.label} run={statsInView} />
          ))}
        </div>
      </section>

      {/* ═══ WHAT YOU'LL DISCOVER ═══ */}
      <FadeInSection>
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Here's What You'll Discover Inside
          </h2>
          <p className="text-white/50 text-center max-w-xl mx-auto mb-10 text-sm">
            The AI-powered monitoring system that's replacing traditional call centers — with faster response, smarter detection, and zero false alarm headaches.
          </p>
          <div className="grid gap-4 max-w-2xl mx-auto">
            {OUTCOMES.map((item, i) => (
              <FadeInSection key={i} delay={i * 80}>
                <div className="flex items-start gap-3 rounded-xl px-5 py-4 hover:bg-white/[0.06] transition-colors" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <CheckCircle2 className="size-5 shrink-0 mt-0.5" style={{ color: BRAND.cyan }} />
                  <span className="text-white/80 text-sm leading-relaxed">{item}</span>
                </div>
              </FadeInSection>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ═══ WHY AI MONITORING ═══ */}
      <FadeInSection>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Why <span style={{ color: BRAND.cyan }}>AI Monitoring</span> Beats Traditional Security
          </h2>
          <p className="text-white/50 text-center max-w-xl mx-auto mb-10 text-sm">
            Traditional call centers put you on hold. Our AI responds instantly — verifying threats, dispatching help, and alerting your family in seconds.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Bot, title: "AI-Powered Monitoring", desc: "No hold times, no human delays. Our AI processes alarm signals and camera feeds instantly — threat verification in seconds, not minutes.", tag: "CORE" },
              { icon: Camera, title: "Video Verification", desc: "AI analyzes live camera feeds to verify real threats vs. false alarms. First responders get real-time intel before they arrive.", tag: "SMART" },
              { icon: AlertTriangle, title: "AI Messenger™", desc: "Instantly contacts your emergency contacts with situation details. No more generic robo-calls — AI delivers context-rich alerts.", tag: "ALERT" },
              { icon: Home, title: "Smart Home Automation", desc: "Lights, locks, thermostats, garage doors — all integrated into one dashboard. Automate routines and control everything remotely.", tag: "HOME" },
              { icon: Flame, title: "Multi-Threat Protection", desc: "Intrusion, fire, carbon monoxide, flood, freeze — every threat monitored 24/7 with AI-powered detection and instant dispatch.", tag: "PROTECT" },
              { icon: Cpu, title: "Private Client Portal", desc: "Your personal dashboard at portal.monitorusa.ai — real-time system status, camera feeds, device management, maintenance alerts, and full smart home control.", tag: "PORTAL" },
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 80}>
                <div className="rounded-xl p-6 h-full hover:bg-white/[0.06] transition-colors" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: `${BRAND.cyan}15` }}>
                      <item.icon className="size-5" style={{ color: BRAND.cyan }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${BRAND.cyan}15`, color: BRAND.cyan }}>{item.tag}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ═══ VALUE STACK ═══ */}
      <FadeInSection>
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Everything Included With MonitorUSA.ai
          </h2>
          <p className="text-white/50 text-center max-w-xl mx-auto mb-10 text-sm">
            Traditional providers charge separately for each feature. We bundle everything — AI monitoring, smart home, video verification, and your private portal — into one simple plan.
          </p>
          <div className="grid gap-3 max-w-2xl mx-auto mb-8">
            {VALUE_STACK.map((item, i) => (
              <FadeInSection key={i} delay={i * 60}>
                <div className="flex items-center justify-between rounded-xl px-5 py-4 hover:bg-white/[0.06] transition-colors" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: `${BRAND.cyan}10` }}>
                      <item.icon className="size-5" style={{ color: BRAND.cyan }} />
                    </div>
                    <span className="text-white/80 text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-white/40 text-sm line-through">{item.value}</span>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* ═══ PRICING TIERS ═══ */}
          <FadeInSection delay={500}>
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { name: "Smart Watch", price: "$14.99", desc: "Self-monitoring with smart alerts", features: ["Real-time push notifications", "AI threat detection", "Smart home automation", "Client portal access"], tag: "" },
                { name: "AI Protect", price: "$24.99", desc: "24/7 AI agents monitoring for you", features: ["Everything in Smart Watch", "24/7 AI pro monitoring", "Emergency dispatch", "AI Messenger™ alerts", "Cellular backup"], tag: "MOST POPULAR" },
                { name: "Total Command", price: "$34.99", desc: "Complete AI security + video", features: ["Everything in AI Protect", "Video verification", "Air quality monitoring", "Priority dispatch", "Smart maintenance alerts"], tag: "BEST VALUE" },
              ].map((plan, i) => (
                <div key={i} className="rounded-xl p-6 relative" style={{
                  background: i === 1 ? `linear-gradient(135deg, ${BRAND.cyan}10, ${BRAND.electric}10)` : "rgba(255,255,255,0.03)",
                  border: i === 1 ? `2px solid ${BRAND.cyan}40` : "1px solid rgba(255,255,255,0.05)",
                }}>
                  {plan.tag && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy }}>
                      {plan.tag}
                    </div>
                  )}
                  <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                  <p className="text-white/40 text-xs mb-3">{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black" style={{ color: BRAND.cyan }}>{plan.price}</span>
                    <span className="text-white/40 text-sm">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 className="size-4 shrink-0" style={{ color: BRAND.cyan }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-[1.02]"
                    style={i === 1 ? {
                      background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`,
                      color: BRAND.navy,
                      boxShadow: `0 8px 20px ${BRAND.cyan}30`,
                    } : {
                      background: "rgba(255,255,255,0.08)",
                      color: BRAND.white,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                   onClick={() => trackCTA("offer_cta", "/signup")}>
                    Get {plan.name}
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-white/30 text-xs mt-4">
              Month-to-month. No contracts. No cancellation fees. Cancel anytime.
            </p>
          </FadeInSection>
        </section>
      </FadeInSection>

      {/* ═══ CTA SECTION (shows after scrolling past video) ═══ */}
      {scrolledPast && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="rounded-2xl p-8 md:p-12 text-center shadow-2xl" style={{ background: `linear-gradient(135deg, ${BRAND.navyLight}20, ${BRAND.navyDark})`, border: `1px solid ${BRAND.cyan}20` }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6" style={{ background: `${BRAND.cyan}15`, border: `1px solid ${BRAND.cyan}20`, color: BRAND.cyan }}>
                <Zap className="size-3" />
                AI Monitoring — Active Nationwide
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-4">
                Your Home Is Always Unprotected — Until Now
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-4 text-base leading-relaxed">
                Every second without AI monitoring is a second your family is vulnerable. Traditional alarm companies put you on hold. MonitorUSA.ai responds in 3 seconds with verified threat detection and instant dispatch.
              </p>

              <CountdownTimer />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-8 text-left">
                {[
                  "AI-powered 24/7 monitoring — no hold times",
                  "Video verification with real-time intel",
                  "50%+ false alarm reduction with AI Messenger™",
                  "Smart home automation & control",
                  "Private client portal & mobile dashboard",
                  "Month-to-month — no contracts ever",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 className="size-4 shrink-0" style={{ color: BRAND.cyan }} />
                    {f}
                  </div>
                ))}
              </div>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy, boxShadow: `0 12px 30px ${BRAND.cyan}40` }}
               onClick={() => trackCTA("offer_cta", "/signup")}>
                Protect Your Home Now
                <ArrowRight className="size-5" />
              </Link>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5 text-white/40 text-xs">
                <span className="flex items-center gap-1"><Shield className="size-3" /> Starting at $14.99/mo</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1"><Clock className="size-3" /> Set up in under 15 minutes</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1"><Star className="size-3" /> No contracts — cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ FAQ / OBJECTION HANDLING ═══ */}
      <FadeInSection>
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h3 className="text-xl font-bold text-center mb-8">Common Questions</h3>
          <div className="space-y-4">
            {[
              { q: "\"How does AI monitoring replace a traditional call center?\"", a: "Our AI agents process alarm signals and camera feeds instantly — no hold times, no human delays. When a threat is verified, AI dispatches emergency services directly and contacts your emergency contacts simultaneously. Response time is measured in seconds, not minutes." },
              { q: "\"Will it work with my existing alarm system?\"", a: "MonitorUSA.ai works with most existing alarm panels, cameras, and sensors. We support Ring, Nest, Arlo, SimpliSafe panels, Honeywell, DSC, and many more. If you're starting fresh, we'll recommend compatible devices for your setup." },
              { q: "\"Is there a long-term contract?\"", a: "No. All MonitorUSA.ai plans are month-to-month. Cancel or switch plans anytime from your dashboard. No cancellation fees, no hidden charges. We earn your business every month." },
              { q: "\"What happens when an alarm is triggered?\"", a: "AI instantly analyzes the signal and any available camera feeds. If the threat is verified, AI dispatches emergency services, contacts your emergency contacts with situation details, and sends you a real-time alert — all within seconds." },
              { q: "\"Does MonitorUSA.ai dispatch police and fire?\"", a: "Yes. Our AI integrates directly with emergency dispatch systems. Verified alarms are prioritized with local 911 centers for faster response times. AI-verified calls also reduce false alarm fines — our AI Messenger™ technology has reduced false alarms by over 50%." },
              { q: "\"What's the client portal?\"", a: "Your private dashboard at portal.monitorusa.ai gives you real-time system status, live camera feeds, device management, smart home controls, maintenance alerts, and complete activity history. Manage everything from your phone or computer." },
              { q: "\"How much does it really cost compared to ADT or SimpliSafe?\"", a: "Our AI Protect plan ($24.99/mo) includes 24/7 professional-grade monitoring, emergency dispatch, and AI-powered threat verification — features that cost $34.99-$39.99/mo with traditional providers. You save $120-$180/year with better technology. And there's no installation fee or equipment markup." },
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 60}>
                <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-white/90 font-semibold text-sm mb-2">{item.q}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ═══ FINAL CTA ═══ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center">
        <FadeInSection>
          <div className="rounded-2xl p-8 md:p-12" style={{ background: `linear-gradient(135deg, ${BRAND.navyLight}20, ${BRAND.navyDark})`, border: `1px solid ${BRAND.cyan}20` }}>
            <h2 className="text-2xl sm:text-3xl font-black mb-4">
              Protect What Matters Most — <span style={{ color: BRAND.cyan }}>Your Family</span>
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
              Every night you go to sleep without AI monitoring is a risk you don't need to take. For less than the cost of a streaming subscription, get 24/7 AI-powered protection, smart home control, and the peace of mind your family deserves.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy, boxShadow: `0 12px 30px ${BRAND.cyan}40` }}
             onClick={() => trackCTA("offer_cta", "/signup")}>
              Get AI Protection Today
              <ArrowRight className="size-5" />
            </Link>
            <p className="text-white/30 text-xs mt-4">Starting at $14.99/mo • No contracts • Cancel anytime</p>
          </div>
        </FadeInSection>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-12" style={{ background: BRAND.navyDark }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="size-6" style={{ color: BRAND.cyan }} />
                <span className="text-sm font-bold" style={{ color: BRAND.cyan }}>MonitorUSA.ai</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">AI-Powered Home Security Monitoring. Protect What Matters Most.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Plans</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Smart Watch — $14.99/mo</span></li>
                <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">AI Protect — $24.99/mo</span></li>
                <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Total Command — $34.99/mo</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">AI Monitoring</span></li>
                <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Smart Home</span></li>
                <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Video Verification</span></li>
                <li><span className="hover:text-cyan-400 transition-colors cursor-pointer">Client Portal</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li><Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-white/30">© {new Date().getFullYear()} MonitorUSA.ai™ — A Garner Financial Partners™ Company. All rights reserved.</div>
            <div className="flex gap-6 text-xs text-white/30">
              <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ STICKY CTA BAR ═══ */}
      {scrolledPast && (
        <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t py-3 px-4 z-50 animate-in slide-in-from-bottom-2 duration-300" style={{ background: `${BRAND.navy}f0`, borderColor: `${BRAND.cyan}20` }}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-white/80 text-sm font-medium hidden sm:block">
              🛡️ AI-powered home security starting at $14.99/mo — no contracts.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 mx-auto sm:mx-0"
              style={{ background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy, boxShadow: `0 8px 20px ${BRAND.cyan}30` }}
             onClick={() => trackCTA("offer_cta", "/signup")}>
              Get Protected
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Social Proof Toasts */}
      <SocialProofToasts entries={SOCIAL_PROOF_ENTRIES} />
    </div>
  );
}
