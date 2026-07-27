import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Camera,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Wifi,
  WifiOff,
  BatteryLow,
  Flame,
  Droplets,
  Wind,
  Eye,
  Lock,
  Unlock,
  Moon,
  Home,
  Clock,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const BRAND = {
  navy: "#0B1B2B",
  navyLight: "#0F2A42",
  cyan: "#00D4FF",
  electric: "#0088FF",
  green: "#22C55E",
  red: "#EF4444",
  amber: "#F59E0B",
  gray: "#94A3B8",
};

const STATUS_CONFIG = {
  armed: { icon: ShieldCheck, label: "Armed", color: BRAND.green, bg: `${BRAND.green}15` },
  disarmed: { icon: Unlock, label: "Disarmed", color: BRAND.gray, bg: "rgba(255,255,255,0.05)" },
  away: { icon: ShieldAlert, label: "Away", color: BRAND.cyan, bg: `${BRAND.cyan}15` },
  night: { icon: Moon, label: "Night", color: BRAND.electric, bg: `${BRAND.electric}15` },
};

const ALERT_ICONS: Record<string, typeof AlertTriangle> = {
  intrusion: Eye,
  fire: Flame,
  co_leak: Wind,
  gas_leak: Wind,
  flood: Droplets,
  motion: Activity,
  door_open: Lock,
  camera_offline: WifiOff,
  low_battery: BatteryLow,
  panic: AlertTriangle,
  system_test: CheckCircle2,
  air_quality: Wind,
  glass_break: AlertTriangle,
};

const SEVERITY_COLORS = {
  critical: BRAND.red,
  warning: BRAND.amber,
  info: BRAND.cyan,
};

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - ts;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
}

export function DashboardPage() {
  useDocumentTitle("Dashboard");
  const properties = useQuery(api.properties.list) ?? [];
  const devices = useQuery(api.devices.listAll) ?? [];
  const recentAlerts = useQuery(api.alerts.listRecent) ?? [];
  const activeAlerts = useQuery(api.alerts.listActive) ?? [];
  const updateStatus = useMutation(api.properties.updateStatus);
  const resolveAlert = useMutation(api.alerts.resolve);
  // const acknowledgeAlert = useMutation(api.alerts.acknowledge);

  const onlineDevices = devices.filter(d => d.status === "online").length;
  // const offlineDevices = devices.filter(d => d.status === "offline").length;
  const lowBatteryDevices = devices.filter(d => d.status === "low_battery").length;

  const isEmpty = properties.length === 0;

  return (
    <div className="min-h-screen" style={{ background: BRAND.navy }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Monitoring Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: BRAND.gray }}>
              {activeAlerts.length > 0
                ? <span className="flex items-center gap-2"><AlertTriangle className="size-4" style={{ color: BRAND.red }} /> {activeAlerts.length} active alert{activeAlerts.length > 1 ? "s" : ""}</span>
                : <span className="flex items-center gap-2"><CheckCircle2 className="size-4" style={{ color: BRAND.green }} /> All systems normal</span>
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full animate-pulse" style={{ background: BRAND.green }} />
            <span className="text-sm font-medium" style={{ color: BRAND.green }}>AI Monitoring Active</span>
          </div>
        </div>

        {isEmpty ? (
          /* Empty state */
          <div className="rounded-2xl p-12 text-center" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="inline-flex items-center justify-center size-20 rounded-2xl mb-6" style={{ background: `${BRAND.cyan}15` }}>
              <Home className="size-10" style={{ color: BRAND.cyan }} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Welcome to MonitorUSA.ai</h2>
            <p className="text-lg mb-6 max-w-md mx-auto" style={{ color: BRAND.gray }}>
              Your AI-powered security system is ready. Add your first property to get started.
            </p>
            <p className="text-sm mb-8" style={{ color: BRAND.gray }}>
              Our AI agents will begin monitoring your home 24/7 as soon as you connect your first device.
            </p>
            <div className="inline-flex items-center gap-6 text-sm" style={{ color: BRAND.gray }}>
              <span className="flex items-center gap-2"><Shield className="size-4" style={{ color: BRAND.cyan }} /> Add your property</span>
              <span className="flex items-center gap-2"><Camera className="size-4" style={{ color: BRAND.cyan }} /> Connect devices</span>
              <span className="flex items-center gap-2"><Bot className="size-4" style={{ color: BRAND.cyan }} /> AI starts watching</span>
            </div>
          </div>
        ) : (
          <>
            {/* System Status Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="rounded-xl p-5" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: `${BRAND.green}15` }}>
                    <Wifi className="size-5" style={{ color: BRAND.green }} />
                  </div>
                  <span className="text-sm" style={{ color: BRAND.gray }}>Online Devices</span>
                </div>
                <span className="text-3xl font-bold text-white">{onlineDevices}</span>
              </div>

              <div className="rounded-xl p-5" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: `${BRAND.red}15` }}>
                    <Bell className="size-5" style={{ color: BRAND.red }} />
                  </div>
                  <span className="text-sm" style={{ color: BRAND.gray }}>Active Alerts</span>
                </div>
                <span className="text-3xl font-bold text-white">{activeAlerts.length}</span>
              </div>

              <div className="rounded-xl p-5" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: `${BRAND.amber}15` }}>
                    <BatteryLow className="size-5" style={{ color: BRAND.amber }} />
                  </div>
                  <span className="text-sm" style={{ color: BRAND.gray }}>Low Battery</span>
                </div>
                <span className="text-3xl font-bold text-white">{lowBatteryDevices}</span>
              </div>

              <div className="rounded-xl p-5" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: `${BRAND.cyan}15` }}>
                    <Home className="size-5" style={{ color: BRAND.cyan }} />
                  </div>
                  <span className="text-sm" style={{ color: BRAND.gray }}>Properties</span>
                </div>
                <span className="text-3xl font-bold text-white">{properties.length}</span>
              </div>
            </div>

            {/* Property Cards */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {properties.map((prop) => {
                const cfg = STATUS_CONFIG[prop.status];
                const StatusIcon = cfg.icon;
                return (
                  <div key={prop._id} className="rounded-2xl overflow-hidden" style={{ background: BRAND.navyLight, border: `1px solid ${cfg.color}20` }}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{prop.name}</h3>
                          <p className="text-sm" style={{ color: BRAND.gray }}>{prop.address}, {prop.city}, {prop.state} {prop.zip}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
                          <StatusIcon className="size-4" style={{ color: cfg.color }} />
                          <span className="text-sm font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {(["armed", "disarmed", "away", "night"] as const).map((s) => {
                          const sc = STATUS_CONFIG[s];
                          const active = prop.status === s;
                          return (
                            <button
                              key={s}
                              onClick={() => updateStatus({ id: prop._id, status: s })}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all"
                              style={{
                                background: active ? `${sc.color}20` : "rgba(255,255,255,0.03)",
                                border: active ? `1px solid ${sc.color}40` : "1px solid rgba(255,255,255,0.06)",
                                color: active ? sc.color : BRAND.gray,
                              }}
                            >
                              <sc.icon className="size-3.5" />
                              {sc.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Alerts */}
            <div className="rounded-2xl overflow-hidden" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between p-6 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bell className="size-5" style={{ color: BRAND.cyan }} />
                  Recent Activity
                </h2>
              </div>

              {recentAlerts.length === 0 ? (
                <div className="p-6 pt-0 text-center py-12">
                  <CheckCircle2 className="size-12 mx-auto mb-3" style={{ color: BRAND.green }} />
                  <p className="text-white font-medium">All clear</p>
                  <p className="text-sm" style={{ color: BRAND.gray }}>No recent alerts. Your AI is watching.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {recentAlerts.map((alert) => {
                    const AlertIcon = ALERT_ICONS[alert.type] || AlertTriangle;
                    const sevColor = SEVERITY_COLORS[alert.severity];
                    return (
                      <div key={alert._id} className="flex items-start gap-4 p-4 px-6 hover:bg-white/[0.02] transition-colors">
                        <div className="size-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${sevColor}15` }}>
                          <AlertIcon className="size-4.5" style={{ color: sevColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{alert.title}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{
                              background: `${sevColor}15`, color: sevColor,
                            }}>{alert.severity}</span>
                          </div>
                          <p className="text-xs mt-0.5 truncate" style={{ color: BRAND.gray }}>{alert.description}</p>
                          {alert.aiResponse && (
                            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: BRAND.cyan }}>
                              <Bot className="size-3" /> {alert.aiResponse}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs" style={{ color: BRAND.gray }}>
                            <Clock className="size-3 inline mr-1" />
                            {formatTime(alert.createdAt)}
                          </span>
                          {(alert.status === "active" || alert.status === "dispatched") && (
                            <Button size="sm" variant="outline" className="text-xs h-7 border-white/10 text-white hover:bg-white/5"
                              onClick={() => resolveAlert({ id: alert._id })}>
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
