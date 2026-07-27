import { useConvexAuth, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  Shield,
  ShieldCheck,
  Eye,
  Phone,
  Flame,
  Droplets,
  Wind,
  Camera,
  Lock,
  Cpu,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
  Bot,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/* ─── Brand Colors ─── */
const BRAND = {
  navy: "#0B1B2B",
  navyLight: "#0F2A42",
  cyan: "#00D4FF",
  cyanDark: "#00A3CC",
  electric: "#0088FF",
  white: "#FFFFFF",
  gray: "#94A3B8",
  grayLight: "#CBD5E1",
  grayDark: "#334155",
  red: "#EF4444",
  green: "#22C55E",
  amber: "#F59E0B",
};

/* ─── Pricing ─── */
const PLANS = [
  {
    name: "Smart Watch",
    price: "$14.99",
    period: "/mo",
    description: "Self-monitor with AI-powered alerts & app control",
    badge: null,
    features: [
      "MonitorUSA AI App (iOS & Android)",
      "Real-time push notifications",
      "Camera & doorbell live feeds",
      "AI motion detection & alerts",
      "30-day event history",
      "Arm/disarm remotely",
      "Object detection (person, vehicle, package)",
      "No long-term contract",
    ],
    excluded: [
      "24/7 AI Pro Monitoring",
      "Emergency dispatch",
      "Smart home automation",
    ],
    cta: "Start Smart Watch",
    highlight: false,
    priceId: "price_1Tte0vDal1LtHX1Vfcl42U9K",
  },
  {
    name: "AI Protect",
    price: "$24.99",
    period: "/mo",
    description: "24/7 AI agents monitoring & dispatching for you",
    badge: "MOST POPULAR",
    features: [
      "Everything in Smart Watch, plus:",
      "24/7 AI Pro Monitoring",
      "AI-powered emergency dispatch",
      "Intrusion, fire, CO, flood monitoring",
      "AI Messenger™ — false alarm reduction",
      "Cellular backup connection",
      "Emergency contact notifications",
      "AI chat & voice support 24/7",
      "No long-term contract",
    ],
    excluded: [
      "Video verification",
      "Smart home automation",
    ],
    cta: "Start AI Protect",
    highlight: true,
    priceId: "price_1Tte0vDal1LtHX1V13waLHxt",
  },
  {
    name: "Total Command",
    price: "$34.99",
    period: "/mo",
    description: "Complete AI security with smart home & video verification",
    badge: "BEST VALUE",
    features: [
      "Everything in AI Protect, plus:",
      "AI video verification",
      "24/7 live camera view",
      "Intelligent AI threat analysis",
      "Smart home automation",
      "Device control & scenes",
      "Air quality monitoring",
      "Priority AI response",
      "Predictive threat analysis",
      "No long-term contract",
    ],
    excluded: [],
    cta: "Start Total Command",
    highlight: false,
    priceId: "price_1Tte0wDal1LtHX1ViIQuxxTT",
  },
];

const FEATURES = [
  {
    icon: Eye,
    title: "AI Intrusion Detection",
    description: "Advanced AI analyzes camera feeds in real-time to detect unauthorized entry, suspicious behavior, and potential threats before they escalate.",
    color: BRAND.cyan,
  },
  {
    icon: Flame,
    title: "Fire & Smoke Detection",
    description: "Instant smoke and heat detection triggers AI emergency protocols — automatically calling fire departments and alerting your contacts.",
    color: BRAND.red,
  },
  {
    icon: Wind,
    title: "CO & Gas Leak Alerts",
    description: "Carbon monoxide and gas sensors monitored 24/7 by AI. Life-threatening situations get immediate emergency dispatch.",
    color: BRAND.amber,
  },
  {
    icon: Droplets,
    title: "Flood & Water Detection",
    description: "Sensors detect water leaks and flooding early. AI alerts you instantly so you can prevent thousands in water damage.",
    color: BRAND.electric,
  },
  {
    icon: Camera,
    title: "Smart Camera Integration",
    description: "Connect any camera or doorbell. AI watches your feeds 24/7 with person, vehicle, and package detection.",
    color: BRAND.cyan,
  },
  {
    icon: Bot,
    title: "AI Emergency Response",
    description: "No human call center delays. AI agents assess threats instantly and dispatch police, fire, or EMS in seconds — not minutes.",
    color: BRAND.green,
  },
];

const FAQ_ITEMS = [
  {
    q: "How does AI monitoring replace a traditional call center?",
    a: "Our AI agents process alarm signals and camera feeds instantly — no hold times, no human delays. When a threat is verified, AI dispatches emergency services directly and contacts your emergency contacts simultaneously. Response time is measured in seconds, not minutes.",
  },
  {
    q: "What equipment do I need?",
    a: "MonitorUSA.ai works with most existing alarm panels, cameras, and sensors. We support Ring, Nest, Arlo, SimpliSafe panels, Honeywell, DSC, and many more. If you're starting fresh, we'll recommend compatible devices for your setup.",
  },
  {
    q: "Is there a long-term contract?",
    a: "No. All MonitorUSA.ai plans are month-to-month. Cancel or switch plans anytime from your dashboard. No cancellation fees, no hidden charges.",
  },
  {
    q: "What happens when an alarm is triggered?",
    a: "Our AI immediately: 1) Analyzes all sensor data and camera feeds, 2) Assesses the threat level and type, 3) Contacts you via app, call, and text, 4) If you can't be reached or confirm the threat, dispatches the appropriate emergency service (police, fire, or EMS), and 5) Notifies all your emergency contacts.",
  },
  {
    q: "Can the AI really call the police?",
    a: "Yes. Our AI integrates directly with emergency dispatch systems. Verified alarms are prioritized with local 911 centers for faster response times. AI-verified calls also reduce false alarm fines — our AI Messenger™ technology has reduced false alarms by over 50%.",
  },
  {
    q: "How much can I save vs. ADT?",
    a: "Our AI Protect plan ($24.99/mo) includes 24/7 professional-grade monitoring, emergency dispatch, and AI-powered threat verification — features that cost $34.99-$39.99/mo with traditional providers. You save $120-$180/year with better technology.",
  },
  {
    q: "What if I lose internet connection?",
    a: "AI Protect and Total Command plans include cellular backup. If your internet goes down, monitoring continues over cellular with no interruption in protection.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-lg font-medium text-white pr-4 group-hover:text-cyan-400 transition-colors">{q}</span>
        {open ? <ChevronUp className="size-5 text-cyan-400 shrink-0" /> : <ChevronDown className="size-5 text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="pb-5 text-slate-300 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

type LandingPageViewProps = {
  isAuthenticated: boolean;
  isLoading: boolean;
  showAuthActions: boolean;
};

function LandingPageView({
  isAuthenticated,
  isLoading,
  showAuthActions,
}: LandingPageViewProps) {
  const checkout = useAction(api.stripeCheckout.createCheckoutSession);
  const [loadingPlan, setLoadingPlan] = useState("");

  const handleCheckout = async (priceId: string) => {
    if (!isAuthenticated) return;
    setLoadingPlan(priceId);
    try {
      const result = await checkout({ priceId });
      if (result?.url) window.location.href = result.url;
    } catch (e: any) {
      toast.error(e.message || "Checkout failed");
    }
    setLoadingPlan("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BRAND.navy }}>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center" style={{ background: BRAND.navy }}>
        {/* Cinematic Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/85 via-[#0a1628]/70 to-[#0a1628]/92" />
        {/* Cyan accent glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.10),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 mb-8">
              <div className="size-2 rounded-full animate-pulse" style={{ background: BRAND.green }} />
              <span className="text-sm font-medium" style={{ color: BRAND.cyan }}>
                AI-Powered • No Contracts • Cancel Anytime
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-white mb-6">
              Your Home. Protected by{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Artificial Intelligence
                </span>
              </span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: BRAND.grayLight }}>
              MonitorUSA.ai replaces outdated call centers with AI agents that detect threats, assess situations, and dispatch emergency services — all in seconds.{" "}
              <span style={{ color: BRAND.cyan }}>Starting at just $14.99/mo.</span>
            </p>

            {showAuthActions && !isAuthenticated && !isLoading && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="text-base h-13 px-8 rounded-xl font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all" asChild
                  style={{ background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy }}>
                  <Link to="/signup">
                    Get Protected Now
                    <ArrowRight className="size-5 ml-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base h-13 px-8 rounded-xl font-semibold border-white/20 text-white bg-transparent hover:bg-white/5 hover:border-white/40" asChild>
                  <Link to="#pricing">View Plans</Link>
                </Button>
              </div>
            )}
            {showAuthActions && isAuthenticated && (
              <div className="pt-2">
                <Button size="lg" className="text-base h-13 px-8 rounded-xl font-semibold" asChild
                  style={{ background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy }}>
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="size-5 ml-1" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Trust bar */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-10 text-sm" style={{ color: BRAND.gray }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4" style={{ color: BRAND.green }} />
                <span>No contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="size-4" style={{ color: BRAND.cyan }} />
                <span>AI responds in seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" style={{ color: BRAND.amber }} />
                <span>24/7 monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="size-4" style={{ color: BRAND.electric }} />
                <span>Works with existing devices</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW AI MONITORING WORKS ═══ */}
      <section className="py-20 md:py-28 border-t border-white/5" style={{ background: `linear-gradient(180deg, ${BRAND.navyLight} 0%, ${BRAND.navy} 100%)` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: BRAND.cyan }}>
              How AI Monitoring Works
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Behind-the-scenes protection that <span style={{ color: BRAND.cyan }}>never sleeps</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg" style={{ color: BRAND.gray }}>
              Traditional monitoring relies on human operators. We use AI that processes threats instantly — no hold times, no delays, no missed calls.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                icon: AlertTriangle,
                title: "AI Detects",
                desc: "When your system is triggered, our AI analyzes all sensor data, camera feeds, and environmental readings instantly to identify the threat type.",
                color: BRAND.red,
              },
              {
                step: "02",
                icon: Cpu,
                title: "AI Assesses",
                desc: "Advanced algorithms verify the threat, reducing false alarms by 50%+. The AI determines severity and the appropriate emergency response.",
                color: BRAND.amber,
              },
              {
                step: "03",
                icon: Phone,
                title: "AI Takes Action",
                desc: "AI dispatches police, fire, or EMS directly. Simultaneously contacts you and your emergency contacts. All within seconds.",
                color: BRAND.green,
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center group">
                <div className="inline-flex items-center justify-center size-20 rounded-2xl mb-6 transition-transform group-hover:scale-110"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                  <item.icon className="size-9" style={{ color: item.color }} />
                </div>
                <div className="text-xs font-bold tracking-widest mb-2" style={{ color: item.color }}>
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="leading-relaxed" style={{ color: BRAND.gray }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-20 md:py-28 border-t border-white/5" style={{ background: BRAND.navy }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: BRAND.cyan }}>
              Complete Protection
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Every threat. <span style={{ color: BRAND.cyan }}>Covered.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg" style={{ color: BRAND.gray }}>
              From break-ins to gas leaks, our AI monitors everything traditional systems do — and more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title}
                className="group rounded-2xl p-6 md:p-8 transition-all hover:scale-[1.02] cursor-default"
                style={{ background: `${BRAND.navyLight}`, border: `1px solid ${feat.color}15` }}
              >
                <div className="inline-flex items-center justify-center size-12 rounded-xl mb-5"
                  style={{ background: `${feat.color}15` }}>
                  <feat.icon className="size-6" style={{ color: feat.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: BRAND.gray }}>{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI vs TRADITIONAL COMPARISON ═══ */}
      <section className="py-20 md:py-28 border-t border-white/5" style={{ background: BRAND.navyLight }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: BRAND.cyan }}>
              Why Switch to AI
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              MonitorUSA.ai vs Traditional Monitoring
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional */}
            <div className="rounded-2xl p-8" style={{ background: BRAND.navy, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Phone className="size-5 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Traditional Call Center</h3>
              </div>
              {[
                "Human operators can miss calls",
                "Hold times during high-volume events",
                "Slower emergency response times",
                "False alarm fines up to $500+",
                "Long-term contracts (2-3 years)",
                "$30-$60+/month for basic monitoring",
                "Limited hours for customer support",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 py-2">
                  <div className="size-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-400 text-xs">✕</span>
                  </div>
                  <span className="text-sm" style={{ color: BRAND.gray }}>{item}</span>
                </div>
              ))}
            </div>

            {/* AI */}
            <div className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${BRAND.navyLight}, ${BRAND.navy})`, border: `1px solid ${BRAND.cyan}30` }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${BRAND.cyan}, transparent)` }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: `${BRAND.cyan}15` }}>
                    <Bot className="size-5" style={{ color: BRAND.cyan }} />
                  </div>
                  <h3 className="text-lg font-bold text-white">MonitorUSA.ai</h3>
                </div>
                {[
                  "AI agents never miss an alert",
                  "Instant response — zero hold time",
                  "Emergency dispatch in seconds",
                  "50%+ false alarm reduction",
                  "No contracts — cancel anytime",
                  "Starting at $14.99/month",
                  "24/7 AI chat & voice support",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 py-2">
                    <CheckCircle2 className="size-5 shrink-0 mt-0.5" style={{ color: BRAND.green }} />
                    <span className="text-sm text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-20 md:py-28 border-t border-white/5 scroll-mt-20" style={{ background: BRAND.navy }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: BRAND.cyan }}>
              Monitoring Plans
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Plans that secure your home <span style={{ color: BRAND.cyan }}>your way</span>
            </h2>
            <p className="max-w-xl mx-auto text-lg" style={{ color: BRAND.gray }}>
              No long-term contracts. Cancel or switch anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {PLANS.map((plan) => (
              <div key={plan.name}
                className="relative rounded-2xl p-8 flex flex-col transition-transform hover:scale-[1.02]"
                style={{
                  background: plan.highlight ? `linear-gradient(135deg, ${BRAND.navyLight}, ${BRAND.navy})` : BRAND.navyLight,
                  border: plan.highlight ? `2px solid ${BRAND.cyan}` : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wider"
                    style={{ background: plan.highlight ? BRAND.cyan : BRAND.electric, color: BRAND.navy }}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm mb-4" style={{ color: BRAND.gray }}>{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold" style={{ color: plan.highlight ? BRAND.cyan : BRAND.white }}>{plan.price}</span>
                    <span className="text-lg mb-1" style={{ color: BRAND.gray }}>{plan.period}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5">
                      <Check className="size-4 shrink-0 mt-0.5" style={{ color: BRAND.green }} />
                      <span className="text-sm text-white/90">{feat}</span>
                    </div>
                  ))}
                  {plan.excluded.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 opacity-40">
                      <span className="size-4 shrink-0 mt-0.5 text-center text-xs text-slate-500">—</span>
                      <span className="text-sm line-through">{feat}</span>
                    </div>
                  ))}
                </div>

                {showAuthActions && (
                  isAuthenticated ? (
                    <Button size="lg" className="w-full rounded-xl font-semibold h-12"
                      style={plan.highlight
                        ? { background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy }
                        : { background: "rgba(255,255,255,0.08)", color: BRAND.white }}
                      onClick={() => handleCheckout(plan.priceId)}
                      disabled={!!loadingPlan}>
                      {loadingPlan === plan.priceId ? "Loading..." : plan.cta}
                      {loadingPlan !== plan.priceId && <ArrowRight className="size-4 ml-1" />}
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full rounded-xl font-semibold h-12" asChild
                      style={plan.highlight
                        ? { background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy }
                        : { background: "rgba(255,255,255,0.08)", color: BRAND.white }}>
                      <Link to="/signup">
                        {plan.cta}
                        <ArrowRight className="size-4 ml-1" />
                      </Link>
                    </Button>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 md:py-28 border-t border-white/5" style={{ background: BRAND.navyLight }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: BRAND.cyan }}>FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Common Questions
            </h2>
          </div>
          <div>
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 md:py-28 border-t border-white/5" style={{ background: BRAND.navy }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl mb-6" style={{ background: `${BRAND.cyan}15` }}>
            <Shield className="size-8" style={{ color: BRAND.cyan }} />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to let AI protect your home?
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: BRAND.gray }}>
            Join thousands of homeowners who trust MonitorUSA.ai. Set up takes 10 minutes. No contracts, no hidden fees.
          </p>
          {showAuthActions && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-base h-13 px-8 rounded-xl font-semibold shadow-lg shadow-cyan-500/25" asChild
                style={{ background: `linear-gradient(135deg, ${BRAND.cyan}, ${BRAND.electric})`, color: BRAND.navy }}>
                <Link to="/signup">
                  Get Protected Now — $14.99/mo
                  <ArrowRight className="size-5 ml-1" />
                </Link>
              </Button>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm" style={{ color: BRAND.gray }}>
            <span className="flex items-center gap-1.5"><Check className="size-4" style={{ color: BRAND.green }} /> No contracts</span>
            <span className="flex items-center gap-1.5"><Check className="size-4" style={{ color: BRAND.green }} /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><Check className="size-4" style={{ color: BRAND.green }} /> 30-day money-back guarantee</span>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 border-t border-white/5" style={{ background: BRAND.navy }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="size-5" style={{ color: BRAND.cyan }} />
              <span className="font-bold text-white">MonitorUSA<span style={{ color: BRAND.cyan }}>.ai</span></span>
            </div>
            <p className="text-sm" style={{ color: BRAND.grayDark }}>
              © {new Date().getFullYear()} MonitorUSA.ai — AI-Powered Home Security Monitoring. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function LandingPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <LandingPageView
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      showAuthActions
    />
  );
}
