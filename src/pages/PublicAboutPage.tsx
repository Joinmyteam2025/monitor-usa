import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Users, Award, Target, Heart } from "lucide-react";

const ACCENT = "#3B82F6";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About — MonitorUSA";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "AI-powered home security alarm monitoring platform. Smart, affordable home security with professional monitoring and instant alerts.";
    
    // Organization JSON-LD
    const schema = {"@context": "https://schema.org", "@type": "Organization", "name": "MonitorUSA", "url": "https://monitorusa.ai", "description": "AI-powered home security alarm monitoring platform. Smart, affordable home security with professional monitoring and instant alerts.", "foundingDate": "2024", "founder": {"@type": "Person", "name": "Zach Garner", "url": "https://iamzachgarner.com"}, "logo": {"@type": "ImageObject", "url": "https://monitorusa.ai/og-image.png"}, "address": {"@type": "PostalAddress", "addressCountry": "US"}, "sameAs": ["https://garnerfinancialpartners.com", "https://iamzachgarner.com"]};
    let script = document.getElementById("about-jsonld") as HTMLScriptElement;
    if (!script) { script = document.createElement("script"); script.id = "about-jsonld"; script.type = "application/ld+json"; document.head.appendChild(script); }
    script.textContent = JSON.stringify(schema);
    return () => { script?.remove(); };
  }, []);

  const values = [
    { icon: Shield, title: "Trust & Security", desc: "Enterprise-grade security protecting every piece of your data. Your privacy is our foundation." },
    { icon: Zap, title: "AI-Powered Innovation", desc: "Cutting-edge artificial intelligence that works for you 24/7, automating and optimizing everything." },
    { icon: Users, title: "Community First", desc: "A growing community of members who support each other's success. You're never in this alone." },
    { icon: Award, title: "Expert-Led Education", desc: "Content created and reviewed by industry experts, updated daily to stay ahead of the curve." },
    { icon: Target, title: "Results-Driven", desc: "Every feature, tool, and resource is designed with one goal: delivering real, measurable results for you." },
    { icon: Heart, title: "Genuine Care", desc: "We succeed when you succeed. Our team is personally invested in every member's journey." },
  ];

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: "rgba(10,22,40,0.92)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-extrabold text-lg">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}cc)` }}>
              M
            </div>
            <span className="hidden sm:inline">MonitorUSA</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
            <Link to="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link>
            <Link to="/signup" className="px-5 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: ACCENT }}>Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}>
            About Us
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ letterSpacing: "-0.03em" }}>
            About <span style={{ color: ACCENT }}>MonitorUSA</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            AI-powered home security alarm monitoring platform. Smart, affordable home security with professional monitoring and instant alerts.
          </p>
        </div>

        {/* Mission */}
        <div className="rounded-2xl border border-white/10 p-8 md:p-12 mb-16" style={{ background: `linear-gradient(135deg, ${ACCENT}08, transparent)` }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            We believe everyone deserves access to world-class home security tools, education, and resources — not just the wealthy or well-connected. MonitorUSA leverages AI and expert knowledge to democratize access and deliver real results for every member.
          </p>
        </div>

        {/* Values Grid */}
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What We Stand For</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {values.map((v, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/10 transition-colors">
              <v.icon className="w-8 h-8 mb-4" style={{ color: ACCENT }} />
              <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Founder */}
        <div className="rounded-2xl border border-white/10 p-8 md:p-12 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Founded by Zach Garner</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Zach Garner is an AI implementation expert, serial entrepreneur, and the visionary behind Garner Financial Partners and the entire suite of platforms including NexSuite™, GTG Freight, Solar Warranty USA, MonitorUSA, and Garner Health Group.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            With a mission to leverage artificial intelligence for real-world business impact, Zach has built an ecosystem of platforms that serve athletes, veterans, families, businesses, and professionals across every industry.
          </p>
          <a href="https://iamzachgarner.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition-colors hover:opacity-80" style={{ color: ACCENT }}>
            Learn more about Zach <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* CTA */}
        <div className="text-center rounded-2xl border border-white/10 p-10" style={{ background: `linear-gradient(135deg, ${ACCENT}10, ${ACCENT}05)` }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">Join thousands of members already building their future with MonitorUSA.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-[1.02]" style={{ backgroundColor: ACCENT, boxShadow: `0 4px 20px ${ACCENT}44` }}>
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
