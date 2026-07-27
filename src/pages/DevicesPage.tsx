import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Camera, Plus, Wifi, WifiOff, BatteryLow, X,
  Video, Bell as Doorbell, Activity, DoorOpen, Square,
  Flame, Wind, Droplets, Thermometer, Lock,
  AlertTriangle, Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { Id } from "../../convex/_generated/dataModel";

const BRAND = {
  navy: "#0B1B2B", navyLight: "#0F2A42",
  cyan: "#00D4FF", green: "#22C55E", red: "#EF4444", amber: "#F59E0B", gray: "#94A3B8",
};

const DEVICE_ICONS: Record<string, typeof Camera> = {
  camera: Video, doorbell: Doorbell, motion_sensor: Activity,
  door_sensor: DoorOpen, window_sensor: Square, smoke_detector: Flame,
  co_detector: Wind, flood_sensor: Droplets, air_quality: Wind,
  glass_break: AlertTriangle, alarm_panel: Radio, thermostat: Thermometer,
  smart_lock: Lock,
};

const STATUS_COLORS: Record<string, string> = {
  online: BRAND.green, offline: BRAND.red, low_battery: BRAND.amber, triggered: BRAND.red,
};

const DEVICE_TYPES = [
  "camera","doorbell","motion_sensor","door_sensor","window_sensor",
  "smoke_detector","co_detector","flood_sensor","air_quality",
  "glass_break","alarm_panel","thermostat","smart_lock",
] as const;

export function DevicesPage() {
  useDocumentTitle("Devices");
  const [searchParams] = useSearchParams();
  const propertyFilter = searchParams.get("property") as Id<"properties"> | null;

  const properties = useQuery(api.properties.list) ?? [];
  const allDevices = useQuery(api.devices.listAll) ?? [];
  const addDevice = useMutation(api.devices.add);

  const [showAdd, setShowAdd] = useState(false);
  const [selectedProp, setSelectedProp] = useState<string>(propertyFilter ?? "");
  const [form, setForm] = useState({
    propertyId: propertyFilter ?? "",
    name: "", type: "camera" as typeof DEVICE_TYPES[number], location: "",
  });

  // Filter devices if a property is selected
  const devices = propertyFilter
    ? allDevices.filter(d => d.propertyId === propertyFilter)
    : selectedProp
      ? allDevices.filter(d => d.propertyId === selectedProp)
      : allDevices;

  const online = devices.filter(d => d.status === "online").length;
  const offline = devices.filter(d => d.status === "offline").length;
  const lowBat = devices.filter(d => d.status === "low_battery").length;

  const handleAdd = async () => {
    if (!form.propertyId || !form.name || !form.location) return;
    await addDevice({
      propertyId: form.propertyId as Id<"properties">,
      name: form.name,
      type: form.type,
      location: form.location,
    });
    setForm({ propertyId: form.propertyId, name: "", type: "camera", location: "" });
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen" style={{ background: BRAND.navy }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Devices</h1>
            <p className="text-sm mt-1" style={{ color: BRAND.gray }}>
              {online} online · {offline > 0 ? `${offline} offline · ` : ""}{lowBat > 0 ? `${lowBat} low battery` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {properties.length > 1 && (
              <select value={selectedProp} onChange={e => setSelectedProp(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none">
                <option value="">All Properties</option>
                {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            )}
            <Button onClick={() => setShowAdd(true)} className="gap-2 font-semibold" style={{ background: BRAND.cyan, color: BRAND.navy }}>
              <Plus className="size-4" /> Add Device
            </Button>
          </div>
        </div>

        {/* Add Device Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add Device</h2>
                <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X className="size-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/70 mb-1 block">Property</label>
                  <select value={form.propertyId} onChange={e => setForm({ ...form, propertyId: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-[#00D4FF]">
                    <option value="">Select property…</option>
                    {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70 mb-1 block">Device Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Front Door Camera" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[#00D4FF]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70 mb-1 block">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as typeof form.type })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-[#00D4FF]">
                    {DEVICE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70 mb-1 block">Location</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Front Door, Living Room" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[#00D4FF]" />
                </div>
                <Button onClick={handleAdd} className="w-full py-3 font-semibold mt-2" style={{ background: BRAND.cyan, color: BRAND.navy }}>
                  <Camera className="size-4 mr-2" /> Add Device
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Devices Grid */}
        {devices.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
            <Camera className="size-16 mx-auto mb-4" style={{ color: BRAND.cyan }} />
            <h2 className="text-2xl font-bold text-white mb-3">No Devices Connected</h2>
            <p style={{ color: BRAND.gray }} className="mb-6">Add cameras, sensors, and smart locks to start AI-powered monitoring.</p>
            <Button onClick={() => setShowAdd(true)} className="gap-2 font-semibold" style={{ background: BRAND.cyan, color: BRAND.navy }}>
              <Plus className="size-4" /> Add Your First Device
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => {
              const DevIcon = DEVICE_ICONS[device.type] || Camera;
              const statusColor = STATUS_COLORS[device.status] || BRAND.gray;
              const StatusIcon = device.status === "online" ? Wifi : device.status === "low_battery" ? BatteryLow : WifiOff;
              return (
                <div key={device._id} className="rounded-xl p-5" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-12 rounded-xl flex items-center justify-center" style={{ background: `${BRAND.cyan}10` }}>
                      <DevIcon className="size-6" style={{ color: BRAND.cyan }} />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30` }}>
                      <StatusIcon className="size-3" style={{ color: statusColor }} />
                      <span className="text-xs font-medium" style={{ color: statusColor }}>{device.status.replace("_", " ")}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold">{device.name}</h3>
                  <p className="text-xs mt-1" style={{ color: BRAND.gray }}>{device.location}</p>
                  {device.batteryLevel != null && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full" style={{
                          width: `${device.batteryLevel}%`,
                          background: device.batteryLevel > 20 ? BRAND.green : BRAND.red,
                        }} />
                      </div>
                      <span className="text-xs" style={{ color: BRAND.gray }}>{device.batteryLevel}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
