import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle } from "lucide-react";

const ACCENT = "#3B82F6";

export default function FaqPage() {
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    document.title = "FAQ — MonitorUSA";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "Frequently asked questions about MonitorUSA. Find answers to common questions about our platform, pricing, features, and more.";
    
    // FAQ JSON-LD
    const schema = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What is estate planning?", "acceptedAnswer": {"@type": "Answer", "text": "Estate planning is the process of arranging how your assets will be managed and distributed during your lifetime and after death. It includes wills, trusts, powers of attorney, and healthcare directives."}}, {"@type": "Question", "name": "What is a living trust?", "acceptedAnswer": {"@type": "Answer", "text": "A living trust (revocable trust) is a legal document that places your assets into a trust during your lifetime. Unlike a will, it avoids probate, maintains privacy, and can include instructions for incapacity."}}, {"@type": "Question", "name": "Why do I need a living trust instead of just a will?", "acceptedAnswer": {"@type": "Answer", "text": "A will goes through probate (public court process), can take 6-18 months, and costs 3-7% of estate value. A living trust avoids all of this \u2014 it's private, immediate, and typically much less expensive overall."}}, {"@type": "Question", "name": "What documents are included in estate planning?", "acceptedAnswer": {"@type": "Answer", "text": "MonitorUSA helps you create all essential documents: Living Trust, Pour-Over Will, Financial Power of Attorney, Healthcare Power of Attorney, Living Will, HIPAA Authorization, Trust Certification, Assignment of Assets, and more."}}, {"@type": "Question", "name": "How much does estate planning through MonitorUSA cost?", "acceptedAnswer": {"@type": "Answer", "text": "Traditional estate planning with attorneys costs $3,000-$10,000+. MonitorUSA provides all the same documents for just $97/month or $970/year (save $194), plus ongoing education and tools."}}, {"@type": "Question", "name": "Is online estate planning legally valid?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Documents created through our platform are state-specific and follow all legal requirements. We generate documents customized for your state's laws with proper witness and notarization instructions."}}, {"@type": "Question", "name": "What is a power of attorney?", "acceptedAnswer": {"@type": "Answer", "text": "A power of attorney (POA) is a legal document that gives someone you trust the authority to act on your behalf in financial or healthcare matters if you become unable to do so yourself."}}, {"@type": "Question", "name": "What is asset protection?", "acceptedAnswer": {"@type": "Answer", "text": "Asset protection strategies shield your wealth from creditors, lawsuits, and excessive taxation. MonitorUSA teaches proven strategies including trusts, LLCs, and insurance structures."}}, {"@type": "Question", "name": "Do I need to update my estate plan?", "acceptedAnswer": {"@type": "Answer", "text": "Yes \u2014 you should review your estate plan every 3-5 years or after major life events (marriage, divorce, birth of children, significant asset changes, moving to a new state)."}}, {"@type": "Question", "name": "How does the CVA Strategy work?", "acceptedAnswer": {"@type": "Answer", "text": "The Cash Value Accumulation (CVA) Strategy uses permanent life insurance as a financial tool for tax-advantaged growth, supplemental retirement income, and estate planning benefits \u2014 all while providing a death benefit."}}, {"@type": "Question", "name": "What is MonitorUSA?", "acceptedAnswer": {"@type": "Answer", "text": "MonitorUSA \u2014 AI-powered home security alarm monitoring platform. Smart, affordable home security with professional monitoring and instant alerts."}}, {"@type": "Question", "name": "How do I sign up for MonitorUSA?", "acceptedAnswer": {"@type": "Answer", "text": "Visit monitorusa.ai/signup to create your account. The signup process takes less than 2 minutes, and you'll get immediate access to the platform."}}, {"@type": "Question", "name": "Is MonitorUSA mobile-friendly?", "acceptedAnswer": {"@type": "Answer", "text": "Yes! MonitorUSA is fully responsive and works on any device \u2014 desktop, tablet, or smartphone. Access all features from anywhere."}}, {"@type": "Question", "name": "Is my data secure on MonitorUSA?", "acceptedAnswer": {"@type": "Answer", "text": "Absolutely. MonitorUSA uses enterprise-grade encryption, secure authentication, and follows industry best practices for data protection. Your personal information is never shared without your consent."}}, {"@type": "Question", "name": "Can I cancel my subscription?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, you can cancel anytime from your account settings. There are no long-term contracts or cancellation fees."}}, {"@type": "Question", "name": "Does MonitorUSA offer customer support?", "acceptedAnswer": {"@type": "Answer", "text": "Yes! We offer AI-powered instant support through our chatbot, email support, and you can book a personal consultation call through the platform."}}, {"@type": "Question", "name": "What makes MonitorUSA different from competitors?", "acceptedAnswer": {"@type": "Answer", "text": "MonitorUSA combines cutting-edge AI technology with expert-curated content and practical tools. Our platform is continuously updated with the latest strategies and best practices."}}, {"@type": "Question", "name": "Is there a free trial?", "acceptedAnswer": {"@type": "Answer", "text": "Visit monitorusa.ai/signup to see current offerings. We regularly offer introductory pricing and trial periods for new members."}}, {"@type": "Question", "name": "How often is content updated?", "acceptedAnswer": {"@type": "Answer", "text": "New articles, resources, and tools are added daily. Our AI-powered content engine publishes fresh, expert-reviewed content every single day."}}, {"@type": "Question", "name": "Can I share MonitorUSA with my family/team?", "acceptedAnswer": {"@type": "Answer", "text": "We offer family and team plans. Contact us for details on group pricing and multi-user access."}}]};
    let script = document.getElementById("faq-jsonld") as HTMLScriptElement;
    if (!script) { script = document.createElement("script"); script.id = "faq-jsonld"; script.type = "application/ld+json"; document.head.appendChild(script); }
    script.textContent = JSON.stringify(schema);
    return () => { script?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: "rgba(10,22,40,0.92)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-extrabold text-lg">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}cc)` }}>
              M
            </div>
            <span className="hidden sm:inline">MonitorUSA</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
            <Link to="/signup" className="px-5 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: ACCENT }}>Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}>
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ letterSpacing: "-0.03em" }}>Frequently Asked Questions</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to know about MonitorUSA. Can't find what you're looking for? <Link to="/signup" className="underline" style={{ color: ACCENT }}>Contact us</Link>.</p>
        </div>

        <div className="space-y-3">
          
          <div key={"0"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 0 ? -1 : 0)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">What is estate planning?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 0 ? "rotate-180" : ""}`} />
            </button>
            {open === 0 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Estate planning is the process of arranging how your assets will be managed and distributed during your lifetime and after death. It includes wills, trusts, powers of attorney, and healthcare directives.
              </div>
            )}
          </div>
          <div key={"1"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 1 ? -1 : 1)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">What is a living trust?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 1 ? "rotate-180" : ""}`} />
            </button>
            {open === 1 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                A living trust (revocable trust) is a legal document that places your assets into a trust during your lifetime. Unlike a will, it avoids probate, maintains privacy, and can include instructions for incapacity.
              </div>
            )}
          </div>
          <div key={"2"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 2 ? -1 : 2)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">Why do I need a living trust instead of just a will?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 2 ? "rotate-180" : ""}`} />
            </button>
            {open === 2 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                A will goes through probate (public court process), can take 6-18 months, and costs 3-7% of estate value. A living trust avoids all of this — it\'s private, immediate, and typically much less expensive overall.
              </div>
            )}
          </div>
          <div key={"3"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 3 ? -1 : 3)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">What documents are included in estate planning?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 3 ? "rotate-180" : ""}`} />
            </button>
            {open === 3 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                MonitorUSA helps you create all essential documents: Living Trust, Pour-Over Will, Financial Power of Attorney, Healthcare Power of Attorney, Living Will, HIPAA Authorization, Trust Certification, Assignment of Assets, and more.
              </div>
            )}
          </div>
          <div key={"4"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 4 ? -1 : 4)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">How much does estate planning through MonitorUSA cost?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 4 ? "rotate-180" : ""}`} />
            </button>
            {open === 4 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Traditional estate planning with attorneys costs $3,000-$10,000+. MonitorUSA provides all the same documents for just $97/month or $970/year (save $194), plus ongoing education and tools.
              </div>
            )}
          </div>
          <div key={"5"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 5 ? -1 : 5)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">Is online estate planning legally valid?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 5 ? "rotate-180" : ""}`} />
            </button>
            {open === 5 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Yes. Documents created through our platform are state-specific and follow all legal requirements. We generate documents customized for your state\'s laws with proper witness and notarization instructions.
              </div>
            )}
          </div>
          <div key={"6"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 6 ? -1 : 6)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">What is a power of attorney?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 6 ? "rotate-180" : ""}`} />
            </button>
            {open === 6 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                A power of attorney (POA) is a legal document that gives someone you trust the authority to act on your behalf in financial or healthcare matters if you become unable to do so yourself.
              </div>
            )}
          </div>
          <div key={"7"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 7 ? -1 : 7)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">What is asset protection?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 7 ? "rotate-180" : ""}`} />
            </button>
            {open === 7 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Asset protection strategies shield your wealth from creditors, lawsuits, and excessive taxation. MonitorUSA teaches proven strategies including trusts, LLCs, and insurance structures.
              </div>
            )}
          </div>
          <div key={"8"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 8 ? -1 : 8)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">Do I need to update my estate plan?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 8 ? "rotate-180" : ""}`} />
            </button>
            {open === 8 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Yes — you should review your estate plan every 3-5 years or after major life events (marriage, divorce, birth of children, significant asset changes, moving to a new state).
              </div>
            )}
          </div>
          <div key={"9"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 9 ? -1 : 9)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">How does the CVA Strategy work?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 9 ? "rotate-180" : ""}`} />
            </button>
            {open === 9 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                The Cash Value Accumulation (CVA) Strategy uses permanent life insurance as a financial tool for tax-advantaged growth, supplemental retirement income, and estate planning benefits — all while providing a death benefit.
              </div>
            )}
          </div>
          <div key={"10"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 10 ? -1 : 10)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">What is MonitorUSA?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 10 ? "rotate-180" : ""}`} />
            </button>
            {open === 10 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                MonitorUSA — AI-powered home security alarm monitoring platform. Smart, affordable home security with professional monitoring and instant alerts.
              </div>
            )}
          </div>
          <div key={"11"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 11 ? -1 : 11)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">How do I sign up for MonitorUSA?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 11 ? "rotate-180" : ""}`} />
            </button>
            {open === 11 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Visit monitorusa.ai/signup to create your account. The signup process takes less than 2 minutes, and you\'ll get immediate access to the platform.
              </div>
            )}
          </div>
          <div key={"12"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 12 ? -1 : 12)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">Is MonitorUSA mobile-friendly?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 12 ? "rotate-180" : ""}`} />
            </button>
            {open === 12 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Yes! MonitorUSA is fully responsive and works on any device — desktop, tablet, or smartphone. Access all features from anywhere.
              </div>
            )}
          </div>
          <div key={"13"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 13 ? -1 : 13)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">Is my data secure on MonitorUSA?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 13 ? "rotate-180" : ""}`} />
            </button>
            {open === 13 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Absolutely. MonitorUSA uses enterprise-grade encryption, secure authentication, and follows industry best practices for data protection. Your personal information is never shared without your consent.
              </div>
            )}
          </div>
          <div key={"14"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 14 ? -1 : 14)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">Can I cancel my subscription?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 14 ? "rotate-180" : ""}`} />
            </button>
            {open === 14 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Yes, you can cancel anytime from your account settings. There are no long-term contracts or cancellation fees.
              </div>
            )}
          </div>
          <div key={"15"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 15 ? -1 : 15)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">Does MonitorUSA offer customer support?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 15 ? "rotate-180" : ""}`} />
            </button>
            {open === 15 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Yes! We offer AI-powered instant support through our chatbot, email support, and you can book a personal consultation call through the platform.
              </div>
            )}
          </div>
          <div key={"16"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 16 ? -1 : 16)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">What makes MonitorUSA different from competitors?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 16 ? "rotate-180" : ""}`} />
            </button>
            {open === 16 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                MonitorUSA combines cutting-edge AI technology with expert-curated content and practical tools. Our platform is continuously updated with the latest strategies and best practices.
              </div>
            )}
          </div>
          <div key={"17"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 17 ? -1 : 17)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">Is there a free trial?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 17 ? "rotate-180" : ""}`} />
            </button>
            {open === 17 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                Visit monitorusa.ai/signup to see current offerings. We regularly offer introductory pricing and trial periods for new members.
              </div>
            )}
          </div>
          <div key={"18"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 18 ? -1 : 18)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">How often is content updated?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 18 ? "rotate-180" : ""}`} />
            </button>
            {open === 18 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                New articles, resources, and tools are added daily. Our AI-powered content engine publishes fresh, expert-reviewed content every single day.
              </div>
            )}
          </div>
          <div key={"19"} className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
            <button onClick={() => setOpen(open === 19 ? -1 : 19)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="text-white font-semibold text-sm md:text-base pr-4">Can I share MonitorUSA with my family/team?</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === 19 ? "rotate-180" : ""}`} />
            </button>
            {open === 19 && (
              <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                We offer family and team plans. Contact us for details on group pricing and multi-user access.
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center rounded-2xl border border-white/10 p-10" style={{ background: `linear-gradient(135deg, ${ACCENT}08, ${ACCENT}03)` }}>
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-gray-400 mb-6">Join MonitorUSA today and get access to our full platform, AI assistant, and expert support.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold transition-all hover:scale-[1.02]" style={{ backgroundColor: ACCENT, boxShadow: `0 4px 20px ${ACCENT}44` }}>
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
