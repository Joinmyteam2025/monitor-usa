import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, Shield, Loader2 } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const BRAND = {
  navy: "#0B1B2B", navyLight: "#0F2A42",
  cyan: "#00D4FF", green: "#22C55E", gray: "#94A3B8",
};

export function AISupportPage() {
  useDocumentTitle("AI Support");
  const messages = useQuery(api.chatMessages.list) ?? [];
  const sendMessage = useMutation(api.chatMessages.send);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      await sendMessage({ content: text });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BRAND.navy }}>
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: `${BRAND.cyan}15` }}>
              <Bot className="size-6" style={{ color: BRAND.cyan }} />
            </div>
            AI Support
          </h1>
          <p className="text-sm mt-2" style={{ color: BRAND.gray }}>
            Your AI security assistant is here 24/7. Ask about your system, alerts, devices, or home security tips.
          </p>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef}
          className="flex-1 rounded-2xl p-6 overflow-y-auto space-y-4 mb-4"
          style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)", maxHeight: "calc(100vh - 280px)" }}>
          
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center size-20 rounded-2xl mb-6" style={{ background: `${BRAND.cyan}10` }}>
                <Shield className="size-10" style={{ color: BRAND.cyan }} />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">MonitorUSA AI Assistant</h2>
              <p className="text-sm max-w-md mx-auto mb-6" style={{ color: BRAND.gray }}>
                I can help you with your security system, explain alerts, troubleshoot devices, and provide home safety recommendations.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "How do I arm my system?",
                  "What should I do if I get a false alarm?",
                  "How does AI monitoring work?",
                  "Tips for better home security",
                ].map(q => (
                  <button key={q} onClick={() => { setInput(q); }}
                    className="px-4 py-2 rounded-lg text-sm transition-all hover:bg-white/[0.08]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: BRAND.cyan }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg._id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="size-8 rounded-lg flex items-center justify-center shrink-0 mt-1" style={{ background: `${BRAND.cyan}15` }}>
                  <Bot className="size-4" style={{ color: BRAND.cyan }} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"}`}
                style={{
                  background: msg.role === "user" ? BRAND.cyan : "rgba(255,255,255,0.05)",
                  color: msg.role === "user" ? BRAND.navy : "white",
                }}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex gap-3">
              <div className="size-8 rounded-lg flex items-center justify-center shrink-0 mt-1" style={{ background: `${BRAND.cyan}15` }}>
                <Bot className="size-4" style={{ color: BRAND.cyan }} />
              </div>
              <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <Loader2 className="size-4 animate-spin" style={{ color: BRAND.cyan }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="rounded-xl flex items-center gap-3 p-2"
          style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.1)" }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask your AI security assistant..."
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/30 outline-none" />
          <button onClick={handleSend} disabled={!input.trim() || sending}
            className="size-10 rounded-lg flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
            style={{ background: BRAND.cyan }}>
            <Send className="size-4" style={{ color: BRAND.navy }} />
          </button>
        </div>
      </div>
    </div>
  );
}
