import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import {
  Users, Plus, Phone, Mail, Trash2, X, Shield, UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { Id } from "../../convex/_generated/dataModel";

const BRAND = {
  navy: "#0B1B2B", navyLight: "#0F2A42",
  cyan: "#00D4FF", green: "#22C55E", red: "#EF4444", gray: "#94A3B8",
};

export function EmergencyContactsPage() {
  useDocumentTitle("Emergency Contacts");
  const properties = useQuery(api.properties.list) ?? [];
  const [selectedProp, setSelectedProp] = useState<string>("");
  const contacts = useQuery(
    api.emergencyContacts.listByProperty,
    selectedProp ? { propertyId: selectedProp as Id<"properties"> } : "skip"
  ) ?? [];
  const addContact = useMutation(api.emergencyContacts.add);
  const removeContact = useMutation(api.emergencyContacts.remove);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", relationship: "", priority: 1,
  });

  // Auto-select first property
  const activeProp = selectedProp || (properties.length > 0 ? properties[0]._id : "");
  if (!selectedProp && properties.length > 0 && activeProp !== selectedProp) {
    setSelectedProp(activeProp);
  }

  const handleAdd = async () => {
    if (!activeProp || !form.name || !form.phone) return;
    await addContact({
      propertyId: activeProp as Id<"properties">,
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      relationship: form.relationship,
      priority: form.priority,
    });
    setForm({ name: "", phone: "", email: "", relationship: "", priority: contacts.length + 1 });
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen" style={{ background: BRAND.navy }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Emergency Contacts</h1>
            <p className="text-sm mt-1" style={{ color: BRAND.gray }}>
              People to notify when AI detects a security event
            </p>
          </div>
          <div className="flex items-center gap-3">
            {properties.length > 1 && (
              <select value={selectedProp} onChange={e => setSelectedProp(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none">
                {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            )}
            <Button onClick={() => setShowAdd(true)} disabled={!activeProp}
              className="gap-2 font-semibold" style={{ background: BRAND.cyan, color: BRAND.navy }}>
              <Plus className="size-4" /> Add Contact
            </Button>
          </div>
        </div>

        {/* Add Contact Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add Emergency Contact</h2>
                <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X className="size-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/70 mb-1 block">Full Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[#00D4FF]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70 mb-1 block">Phone Number</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="(555) 555-1234" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[#00D4FF]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70 mb-1 block">Email (optional)</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[#00D4FF]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-1 block">Relationship</label>
                    <input value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })}
                      placeholder="Spouse, Neighbor…" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-[#00D4FF]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-1 block">Priority</label>
                    <select value={form.priority} onChange={e => setForm({ ...form, priority: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-[#00D4FF]">
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n === 1 ? "1 — Primary" : n === 2 ? "2 — Secondary" : `${n}`}</option>)}
                    </select>
                  </div>
                </div>
                <Button onClick={handleAdd} className="w-full py-3 font-semibold mt-2" style={{ background: BRAND.cyan, color: BRAND.navy }}>
                  <UserPlus className="size-4 mr-2" /> Add Contact
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Contact List */}
        {properties.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
            <Shield className="size-16 mx-auto mb-4" style={{ color: BRAND.cyan }} />
            <h2 className="text-2xl font-bold text-white mb-3">Add a Property First</h2>
            <p style={{ color: BRAND.gray }}>You need at least one property to add emergency contacts.</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
            <Users className="size-16 mx-auto mb-4" style={{ color: BRAND.cyan }} />
            <h2 className="text-2xl font-bold text-white mb-3">No Emergency Contacts</h2>
            <p style={{ color: BRAND.gray }} className="mb-6">Add contacts who should be notified when your AI detects a security event.</p>
            <Button onClick={() => setShowAdd(true)} className="gap-2 font-semibold" style={{ background: BRAND.cyan, color: BRAND.navy }}>
              <Plus className="size-4" /> Add Your First Contact
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts
              .sort((a, b) => a.priority - b.priority)
              .map((contact) => (
                <div key={contact._id} className="rounded-xl p-5 flex items-center gap-5"
                  style={{ background: BRAND.navyLight, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="size-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ background: `${BRAND.cyan}15`, color: BRAND.cyan }}>
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{contact.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${BRAND.cyan}15`, color: BRAND.cyan }}>
                        Priority {contact.priority}
                      </span>
                      <span className="text-xs" style={{ color: BRAND.gray }}>{contact.relationship}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm flex items-center gap-1" style={{ color: BRAND.gray }}>
                        <Phone className="size-3.5" /> {contact.phone}
                      </span>
                      {contact.email && (
                        <span className="text-sm flex items-center gap-1" style={{ color: BRAND.gray }}>
                          <Mail className="size-3.5" /> {contact.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => removeContact({ id: contact._id })}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: BRAND.red }}>
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
