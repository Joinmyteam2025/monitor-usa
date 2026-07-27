import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import {
  AlertTriangle, CheckCircle2, Clock, Bot, Eye,
  Flame, Wind, Droplets, Activity, Lock, WifiOff, BatteryLow,
  ShieldCheck, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const BRAND = {
  navy: "#0B1B2B", navyLight: "#0F2A42",
  cyan: "#00D4FF", green: "#22C55E", red: "#EF4444", amber: "#F59E0B", gray: "#94A3B8",
};

const ALERT_ICONS: Record<string, typeof AlertTriangle> = {
  intrusion: Eye, fire: Flame, co_leak: Wind, gas_leak: Wind,
  flood: Droplets, motion: Activity, door_open: Lock,
  camera_offline: WifiOff, low_battery: BatteryLow,
  panic: AlertTriangle, system_test: CheckCircle2,
  air_quality: Wind, glass_break: AlertTriangle,
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: BRAND.red, warning: BRAND.amber, info: BRAND.cyan,
};

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

type FilterType = "all" | "active" | "resolved";

export function AlertsPage() {
  useDocumentTitle("Alerts");
  const recentAlerts = useQuery(api.alerts.listRecent) ?? [];
  const activeAlerts = useQuery(api.alerts.listActive) ?? [];
  const resolveAlert = useMutation(api.alerts.resolve);
  const acknowledgeAlert = useMutation(api.alerts.acknowledge);
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "active"
    ? recentAlerts.filter(a => a.status === "active" || a.status === "dispatched")
    : filter === "resolved"
      ? recentAlerts.filter(a => a.status === "resolved" || a.status === "acknowledged")
      : recentAlerts;

  return (
    <div className="min-h-screen" style={{ background: BRAND.navy }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Alerts</h1>
            <p className="text-sm mt-1" style={{ color: BRAND.gray }}>
              {activeAlerts.length > 0
                ? <span className="flex items-center gap-2"><AlertTriangle className="size-4" style={{ color: BRAND.red }} /> {activeAlerts.length} active alert{activeAlerts.length > 1 ? "s" : ""}</span>
                : <span className="flex items-center gap-2"><ShieldCheck className="size-4" style={{ color: BRAND.green }} /> All clear — no active alerts</span>
              }
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="size-4" style={{ color: BRAND.gray }} />
          {(["all", "active", "resolved"] as FilterType[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === f ? `${BRAND.cyan}15` : "transparent",
                border: filter === f ? `1px solid ${BRAND.cyan}30` : "1px solid transparent",
                color: filter === f ? BRAND.cyan : BRAND.gray,
              }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
            <ShieldCheck className="size-16 mx-auto mb-4" style={{ color: BRAND.green }} />
            <h2 className="text-2xl font-bold text-white mb-3">All Clear</h2>
            <p style={{ color: BRAND.gray }}>No alerts to show. Your AI security system is monitoring 24/7.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="divide-y divide-white/5">
              {filtered.map((alert) => {
                const AlertIcon = ALERT_ICONS[alert.type] || AlertTriangle;
                const sevColor = SEVERITY_COLORS[alert.severity] || BRAND.gray;
                const isActive = alert.status === "active" || alert.status === "dispatched";
                return (
                  <div key={alert._id} className="flex items-start gap-4 p-5 hover:bg-white/[0.02] transition-colors">
                    <div className="size-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sevColor}15` }}>
                      <AlertIcon className="size-5" style={{ color: sevColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{alert.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${sevColor}15`, color: sevColor }}>
                          {alert.severity}
                        </span>
                        {alert.status === "dispatched" && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${BRAND.red}15`, color: BRAND.red }}>
                            {alert.dispatchedTo ? `Dispatched: ${alert.dispatchedTo}` : "Dispatched"}
                          </span>
                        )}
                        {alert.status === "resolved" && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${BRAND.green}15`, color: BRAND.green }}>
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: BRAND.gray }}>{alert.description}</p>
                      {alert.aiResponse && (
                        <p className="text-xs mt-2 flex items-center gap-1.5 p-2 rounded-lg" style={{ background: `${BRAND.cyan}08`, color: BRAND.cyan }}>
                          <Bot className="size-3.5 shrink-0" /> {alert.aiResponse}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs flex items-center gap-1" style={{ color: BRAND.gray }}>
                        <Clock className="size-3" /> {formatTime(alert.createdAt)}
                      </span>
                      {isActive && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs h-7 border-white/10 text-white hover:bg-white/5"
                            onClick={() => acknowledgeAlert({ id: alert._id })}>
                            Acknowledge
                          </Button>
                          <Button size="sm" className="text-xs h-7 font-medium"
                            style={{ background: BRAND.green, color: "#fff" }}
                            onClick={() => resolveAlert({ id: alert._id })}>
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
