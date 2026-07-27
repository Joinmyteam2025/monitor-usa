import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import {
  Home, Plus, MapPin, Shield, ShieldCheck, ShieldAlert,
  Unlock, Moon, Building2, ChevronRight, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Link } from "react-router-dom";

const BRAND = {
  navy: "#0B1B2B", navyLight: "#0F2A42", navyDark: "#060F1A",
  cyan: "#00D4FF", electric: "#0088FF",
  green: "#22C55E", red: "#EF4444", amber: "#F59E0B", gray: "#94A3B8",
};

const STATUS_CONFIG = {
  armed: { icon: ShieldCheck, label: "Armed", color: BRAND.green },
  disarmed: { icon: Unlock, label: "Disarmed", color: BRAND.gray },
  away: { icon: ShieldAlert, label: "Away", color: BRAND.cyan },
  night: { icon: Moon, label: "Night", color: BRAND.electric },
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

export function PropertiesPage() {
  useDocumentTitle("My Properties");
  const properties = useQuery(api.properties.list) ?? [];
  const addProperty = useMutation(api.properties.add);
  const updateStatus = useMutation(api.properties.updateStatus);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "", address: "", city: "", state: "AZ", zip: "",
    type: "residential" as "residential" | "commercial",
    plan: "ai_protect" as "smart_watch" | "ai_protect" | "total_command",
  });

  const handleAdd = async () => {
    if (!form.name || !form.address || !form.city || !form.zip) return;
    await addProperty(form);
    setForm({ name: "", address: "", city: "", state: "AZ", zip: "", type: "residential", plan: "ai_protect" });
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen" style={{ background: BRAND.navy }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">My Properties</h1>
            <p className="text-sm mt-1" style={{ color: BRAND.gray }}>
              {properties.length} propert{properties.length === 1 ? "y" : "ies"} monitored
            </p>
          </div>
          <Button onClick={() => setShowAdd(true)}
            className="gap-2 font-semibold"
            style={{ background: BRAND.cyan, color: BRAND.navy }}>
            <Plus className="size-4" /> Add Property
          </Button>
        </div>

        {/* Add Property Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="rounded-2xl p-6 w-full max-w-lg" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add Property</h2>
                <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X className="size-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/70 mb-1 block">Property Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Main Residence" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[#00D4FF]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70 mb-1 block">Street Address</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="123 Main St" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[#00D4FF]" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-1 block">City</label>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-[#00D4FF]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-1 block">State</label>
                    <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-3 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-[#00D4FF]">
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-1 block">ZIP</label>
                    <input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      className="w-full px-3 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-[#00D4FF]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-1 block">Type</label>
                    <div className="flex gap-2">
                      {(["residential", "commercial"] as const).map(t => (
                        <button key={t} onClick={() => setForm({ ...form, type: t })}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all"
                          style={{
                            background: form.type === t ? `${BRAND.cyan}15` : "rgba(255,255,255,0.03)",
                            border: form.type === t ? `1px solid ${BRAND.cyan}40` : "1px solid rgba(255,255,255,0.06)",
                            color: form.type === t ? BRAND.cyan : BRAND.gray,
                          }}>
                          {t === "residential" ? <Home className="size-4" /> : <Building2 className="size-4" />}
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-1 block">Plan</label>
                    <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value as typeof form.plan })}
                      className="w-full px-3 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-[#00D4FF]">
                      <option value="smart_watch">Smart Watch — $14.99/mo</option>
                      <option value="ai_protect">AI Protect — $24.99/mo</option>
                      <option value="total_command">Total Command — $34.99/mo</option>
                    </select>
                  </div>
                </div>
                <Button onClick={handleAdd} className="w-full py-3 font-semibold text-base mt-2" style={{ background: BRAND.cyan, color: BRAND.navy }}>
                  <Shield className="size-4 mr-2" /> Add & Start Monitoring
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
            <Home className="size-16 mx-auto mb-4" style={{ color: BRAND.cyan }} />
            <h2 className="text-2xl font-bold text-white mb-3">No Properties Yet</h2>
            <p style={{ color: BRAND.gray }} className="mb-6 max-w-md mx-auto">
              Add your first property to start 24/7 AI-powered monitoring. Our AI agents begin watching the moment you connect.
            </p>
            <Button onClick={() => setShowAdd(true)} className="gap-2 font-semibold" style={{ background: BRAND.cyan, color: BRAND.navy }}>
              <Plus className="size-4" /> Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {properties.map((prop) => {
              const cfg = STATUS_CONFIG[prop.status];
              const StatusIcon = cfg.icon;
              const planLabel = prop.plan === "smart_watch" ? "Smart Watch" : prop.plan === "ai_protect" ? "AI Protect" : "Total Command";
              return (
                <div key={prop._id} className="rounded-2xl overflow-hidden group" style={{ background: BRAND.navyLight, border: `1px solid ${cfg.color}20` }}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {prop.type === "commercial" ? <Building2 className="size-5" style={{ color: BRAND.cyan }} /> : <Home className="size-5" style={{ color: BRAND.cyan }} />}
                          {prop.name}
                        </h3>
                        <p className="text-sm mt-1 flex items-center gap-1" style={{ color: BRAND.gray }}>
                          <MapPin className="size-3.5" /> {prop.address}, {prop.city}, {prop.state} {prop.zip}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
                        <StatusIcon className="size-4" style={{ color: cfg.color }} />
                        <span className="text-sm font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs px-2 py-1 rounded" style={{ background: `${BRAND.cyan}15`, color: BRAND.cyan }}>{planLabel}</span>
                      <span className="text-xs" style={{ color: BRAND.gray }}>{prop.type}</span>
                    </div>

                    <div className="flex gap-2 mb-4">
                      {(["armed", "disarmed", "away", "night"] as const).map((s) => {
                        const sc = STATUS_CONFIG[s];
                        const active = prop.status === s;
                        return (
                          <button key={s} onClick={() => updateStatus({ id: prop._id, status: s })}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all"
                            style={{
                              background: active ? `${sc.color}20` : "rgba(255,255,255,0.03)",
                              border: active ? `1px solid ${sc.color}40` : "1px solid rgba(255,255,255,0.06)",
                              color: active ? sc.color : BRAND.gray,
                            }}>
                            <sc.icon className="size-3.5" /> {sc.label}
                          </button>
                        );
                      })}
                    </div>

                    <Link to={`/devices?property=${prop._id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-sm text-white/70">View Devices & Alerts</span>
                      <ChevronRight className="size-4" style={{ color: BRAND.gray }} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
