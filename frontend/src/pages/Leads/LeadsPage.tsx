import { useState } from "react";
import {
  Search, Plus, Phone, MessageCircle, X,
  TrendingUp, Users, DollarSign, Target,
  ChevronRight, Flame, Clock, Sparkles, ArrowUpRight,
  Settings2, GripVertical, Trash2, Check, Pencil,
  Type, Hash, Calendar, List, ToggleLeft, Mail, Link, AlignLeft,
  ChevronDown, Eye, UserCog, Shield, Send, AlertTriangle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

type FieldType = "text" | "number" | "date" | "select" | "boolean" | "phone" | "email" | "url" | "textarea";

interface CustomFieldDef {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
}

interface PipelineStage {
  id: string;
  label: string;
  color: string;
  bg: string;
  bar: string;
}

interface Lead {
  id: number;
  name: string;
  company: string;
  phone: string;
  stage: string;
  value: number;
  owner: string;
  probability: number;
  aging: number;
  tag: string;
  customValues?: Record<string, any>;
}

interface TeamUser {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Edit" | "View";
  active: boolean;
}

// ─────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────

const FIELD_TYPE_OPTIONS: { type: FieldType; label: string; icon: any; desc: string }[] = [
  { type: "text",     label: "Short Text",  icon: Type,        desc: "Single line" },
  { type: "textarea", label: "Long Text",   icon: AlignLeft,   desc: "Multi-line" },
  { type: "number",   label: "Number",      icon: Hash,        desc: "Integer / decimal" },
  { type: "phone",    label: "Phone",       icon: Phone,       desc: "Phone number" },
  { type: "email",    label: "Email",       icon: Mail,        desc: "Email address" },
  { type: "url",      label: "URL",         icon: Link,        desc: "Website link" },
  { type: "date",     label: "Date",        icon: Calendar,    desc: "Date picker" },
  { type: "select",   label: "Dropdown",    icon: List,        desc: "Pick from options" },
  { type: "boolean",  label: "Yes / No",    icon: ToggleLeft,  desc: "Toggle switch" },
];

const STAGE_PALETTE = [
  { color: "#6366f1", bg: "#eef2ff", bar: "from-indigo-400 to-indigo-600" },
  { color: "#f59e0b", bg: "#fffbeb", bar: "from-amber-400 to-amber-500"   },
  { color: "#3b82f6", bg: "#eff6ff", bar: "from-blue-400 to-blue-600"     },
  { color: "#10b981", bg: "#ecfdf5", bar: "from-emerald-400 to-emerald-600" },
  { color: "#ec4899", bg: "#fdf2f8", bar: "from-pink-400 to-pink-600"     },
  { color: "#8b5cf6", bg: "#f5f3ff", bar: "from-violet-400 to-violet-600" },
  { color: "#ef4444", bg: "#fef2f2", bar: "from-red-400 to-red-600"       },
  { color: "#14b8a6", bg: "#f0fdfa", bar: "from-teal-400 to-teal-600"     },
];

const DEFAULT_STAGES: PipelineStage[] = [
  { id: "new",       label: "New",       ...STAGE_PALETTE[0] },
  { id: "contacted", label: "Contacted", ...STAGE_PALETTE[1] },
  { id: "qualified", label: "Qualified", ...STAGE_PALETTE[2] },
  { id: "won",       label: "Won",       ...STAGE_PALETTE[3] },
];

const INITIAL_LEADS: Lead[] = [
  { id: 1, name: "Rahul Mehta",  company: "RM Consultancy", phone: "+91 9876543210", stage: "new",       value: 120000, owner: "Harsh", probability: 70,  aging: 5,  tag: "Hot"    },
  { id: 2, name: "Priya Sharma", company: "Nexus Solutions", phone: "+91 9823456780", stage: "contacted", value: 85000,  owner: "Sneha", probability: 45,  aging: 12, tag: "Warm"   },
  { id: 3, name: "Amit Verma",   company: "InfraCore Ltd",   phone: "+91 9812345670", stage: "qualified", value: 340000, owner: "Harsh", probability: 80,  aging: 3,  tag: "Hot"    },
  { id: 4, name: "Neha Joshi",   company: "CloudSpark",      phone: "+91 9901234560", stage: "won",       value: 210000, owner: "Riya",  probability: 100, aging: 0,  tag: "Closed" },
];

const INITIAL_USERS: TeamUser[] = [
  { id: 1, name: "Harsh Patel", email: "harsh@company.com", role: "Admin", active: true  },
  { id: 2, name: "Sneha Rao",   email: "sneha@company.com", role: "Edit",  active: true  },
  { id: 3, name: "Riya Mehta",  email: "riya@company.com",  role: "View",  active: true  },
  { id: 4, name: "Dev Kumar",   email: "dev@company.com",   role: "View",  active: false },
];

const TAG_COLORS: Record<string, string> = {
  Hot:    "bg-rose-50 text-rose-600",
  Warm:   "bg-amber-50 text-amber-600",
  Cold:   "bg-slate-100 text-slate-500",
  Closed: "bg-emerald-50 text-emerald-600",
};

const ROLE_COLORS: Record<string, string> = {
  Admin: "bg-violet-50 text-violet-700",
  Edit:  "bg-sky-50 text-sky-700",
  View:  "bg-emerald-50 text-emerald-700",
};

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
];

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ─────────────────────────────────────────────────────────
// SUB-COMPONENT: Field Type Picker dropdown
// ─────────────────────────────────────────────────────────

function TypePicker({ value, onChange }: { value: FieldType; onChange: (t: FieldType) => void }) {
  const [open, setOpen] = useState(false);
  const current = FIELD_TYPE_OPTIONS.find((f) => f.type === value)!;
  const Icon = current.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 text-[12px] font-medium text-slate-600 transition-all whitespace-nowrap"
      >
        <Icon size={12} className="text-indigo-500 flex-shrink-0" />
        {current.label}
        <ChevronDown size={11} className={`ml-0.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-[60] bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 w-[210px]">
          {FIELD_TYPE_OPTIONS.map(({ type, label, icon: FIcon, desc }) => (
            <button
              key={type}
              type="button"
              onClick={() => { onChange(type); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors ${
                value === type ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${value === type ? "bg-indigo-100" : "bg-slate-100"}`}>
                <FIcon size={13} className={value === type ? "text-indigo-600" : "text-slate-500"} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium leading-tight">{label}</p>
                <p className="text-[10px] text-slate-400">{desc}</p>
              </div>
              {value === type && <Check size={12} className="ml-auto text-indigo-500 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SUB-COMPONENT: Custom field definition row (builder)
// ─────────────────────────────────────────────────────────

function FieldDefRow({
  field,
  onUpdate,
  onDelete,
}: {
  field: CustomFieldDef;
  onUpdate: (f: CustomFieldDef) => void;
  onDelete: () => void;
}) {
  const [newOpt, setNewOpt] = useState("");

  return (
    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2.5">
      <div className="flex items-center gap-2">
        <GripVertical size={14} className="text-slate-300 flex-shrink-0 cursor-grab" />
        <input
          placeholder="Field label…"
          value={field.label}
          onChange={(e) => onUpdate({ ...field, label: e.target.value })}
          className="flex-1 min-w-0 text-[13px] font-medium bg-transparent outline-none text-slate-700 placeholder:text-slate-300"
        />
        <TypePicker
          value={field.type}
          onChange={(t) =>
            onUpdate({ ...field, type: t, options: t === "select" ? ["Option 1"] : undefined })
          }
        />
        <button
          type="button"
          onClick={onDelete}
          className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:border-rose-300 hover:bg-rose-50 transition-colors flex-shrink-0"
        >
          <Trash2 size={12} className="text-slate-400" />
        </button>
      </div>

      {field.type === "select" && (
        <div className="pl-5 space-y-1.5">
          {(field.options || []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0" />
              <input
                value={opt}
                onChange={(e) => {
                  const opts = [...(field.options || [])];
                  opts[i] = e.target.value;
                  onUpdate({ ...field, options: opts });
                }}
                className="flex-1 text-[12px] bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300"
              />
              <button
                type="button"
                onClick={() => onUpdate({ ...field, options: (field.options || []).filter((_, j) => j !== i) })}
                className="text-slate-300 hover:text-rose-400 transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <input
              placeholder="New option…"
              value={newOpt}
              onChange={(e) => setNewOpt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newOpt.trim()) {
                  onUpdate({ ...field, options: [...(field.options || []), newOpt.trim()] });
                  setNewOpt("");
                }
              }}
              className="flex-1 text-[12px] bg-white border border-dashed border-slate-300 rounded-lg px-2 py-1 outline-none focus:border-indigo-300"
            />
            <button
              type="button"
              onClick={() => {
                if (newOpt.trim()) {
                  onUpdate({ ...field, options: [...(field.options || []), newOpt.trim()] });
                  setNewOpt("");
                }
              }}
              className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium"
            >
              + Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SUB-COMPONENT: Render a custom field as a form input
// ─────────────────────────────────────────────────────────

function CustomFieldInput({
  field,
  value,
  onChange,
}: {
  field: CustomFieldDef;
  value: any;
  onChange: (v: any) => void;
}) {
  const base =
    "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all bg-white";

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          rows={2}
          placeholder={`Enter ${field.label || "value"}…`}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={base + " resize-none"}
        />
      );
    case "number":
      return (
        <input type="number" placeholder="0" value={value || ""} onChange={(e) => onChange(e.target.value)} className={base} />
      );
    case "date":
      return (
        <input type="date" value={value || ""} onChange={(e) => onChange(e.target.value)} className={base} />
      );
    case "boolean":
      return (
        <div className="flex items-center gap-3 py-1">
          <button
            type="button"
            onClick={() => onChange(!value)}
            className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${value ? "bg-indigo-500" : "bg-slate-200"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
          <span className="text-[13px] text-slate-600">{value ? "Yes" : "No"}</span>
        </div>
      );
    case "select":
      return (
        <select value={value || ""} onChange={(e) => onChange(e.target.value)} className={base}>
          <option value="">Select…</option>
          {(field.options || []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
    default:
      return (
        <input
          type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          placeholder={`Enter ${field.label || "value"}…`}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      );
  }
}

// ─────────────────────────────────────────────────────────
// SUB-COMPONENT: Stage manager (Stages tab)
// ─────────────────────────────────────────────────────────

function StageManagerPanel({
  stages,
  setStages,
}: {
  stages: PipelineStage[];
  setStages: (s: PipelineStage[]) => void;
}) {
  return (
    <div className="p-5 space-y-3 max-h-[420px] overflow-y-auto">
      <div className="mb-1">
        <p className="text-[13px] font-semibold text-slate-700">Manage Pipeline Stages</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Rename, recolor, add or remove stages</p>
      </div>

      {stages.map((s) => (
        <div key={s.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
          <GripVertical size={14} className="text-slate-300 cursor-grab flex-shrink-0" />
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
          <input
            value={s.label}
            onChange={(e) =>
              setStages(stages.map((x) => (x.id === s.id ? { ...x, label: e.target.value } : x)))
            }
            className="flex-1 min-w-0 text-[13px] font-medium bg-transparent outline-none text-slate-700"
          />
          <div className="flex gap-1">
            {STAGE_PALETTE.map((p, i) => (
              <button
                key={i}
                type="button"
                title={p.color}
                onClick={() => setStages(stages.map((x) => (x.id === s.id ? { ...x, ...p } : x)))}
                className="w-4 h-4 rounded-full border-2 transition-all flex-shrink-0"
                style={{
                  background: p.color,
                  borderColor: s.color === p.color ? "#1e293b" : "transparent",
                }}
              />
            ))}
          </div>
          {stages.length > 2 && (
            <button
              type="button"
              onClick={() => setStages(stages.filter((x) => x.id !== s.id))}
              className="w-6 h-6 rounded-lg hover:bg-rose-100 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Trash2 size={12} className="text-slate-400 hover:text-rose-500" />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          const usedColors = stages.map((s) => s.color);
          const nextPalette =
            STAGE_PALETTE.find((p) => !usedColors.includes(p.color)) || STAGE_PALETTE[0];
          setStages([...stages, { id: uid(), label: "New Stage", ...nextPalette }]);
        }}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-[13px] font-medium text-slate-500 hover:text-indigo-600 transition-all"
      >
        <Plus size={14} /> Add New Stage
      </button>

      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-[11px] text-amber-700 leading-relaxed">
          <strong>Note:</strong> Stage changes apply globally. Leads in a removed stage stay there
          until manually moved.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SUB-COMPONENT: New Lead Modal
// ─────────────────────────────────────────────────────────

function NewLeadModal({
  onClose,
  onSave,
  stages,
  setStages,
  customFields,
  setCustomFields,
  defaultStage,
}: {
  onClose: () => void;
  onSave: (lead: Omit<Lead, "id">) => void;
  stages: PipelineStage[];
  setStages: (s: PipelineStage[]) => void;
  customFields: CustomFieldDef[];
  setCustomFields: (f: CustomFieldDef[]) => void;
  defaultStage?: string;
}) {
  const [tab, setTab] = useState<"form" | "fields" | "stages">("form");
  const [showFieldPicker, setShowFieldPicker] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    value: "",
    tag: "Warm",
    stage: defaultStage || stages[0]?.id || "new",
  });
  const [customValues, setCustomValues] = useState<Record<string, any>>({});

  const updateFieldDef = (id: string, updated: CustomFieldDef) =>
    setCustomFields(customFields.map((f) => (f.id === id ? updated : f)));

  const deleteFieldDef = (id: string) =>
    setCustomFields(customFields.filter((f) => f.id !== id));

  const addFieldDef = (type: FieldType) => {
    setCustomFields([
      ...customFields,
      {
        id: uid(),
        label: "",
        type,
        options: type === "select" ? ["Option 1"] : undefined,
      },
    ]);
    setShowFieldPicker(false);
    setTab("form");
  };

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    onSave({
      name: form.name,
      company: form.company,
      phone: form.phone,
      value: Number(form.value) || 0,
      tag: form.tag,
      stage: form.stage,
      owner: "You",
      probability: 20,
      aging: 0,
      customValues,
    });
  };

  const tabCls = (t: string) =>
    `px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all ${
      tab === t
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
    }`;

  const inputCls =
    "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all";
  const labelCls =
    "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-2xl shadow-2xl overflow-visible flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[18px] font-bold text-slate-800">New Lead</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">Fill in the details below</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X size={15} className="text-slate-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button className={tabCls("form")} onClick={() => setTab("form")}>
              Form
            </button>
            <button className={tabCls("fields")} onClick={() => setTab("fields")}>
              <span className="flex items-center gap-1.5">
                <Settings2 size={11} />
                Custom Fields
                {customFields.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center">
                    {customFields.length}
                  </span>
                )}
              </span>
            </button>
            <button className={tabCls("stages")} onClick={() => setTab("stages")}>
              <span className="flex items-center gap-1.5">Stages</span>
            </button>
          </div>
        </div>

        {/* ── TAB: FORM ─────────────────────────────── */}
        {tab === "form" && (
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Lead Name *</label>
                <input
                  placeholder="e.g. Rahul Mehta"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Company</label>
                <input
                  placeholder="e.g. Acme Ltd"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Phone *</label>
              <input
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Deal Value (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Lead Tag</label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className={inputCls}
                >
                  {["Hot", "Warm", "Cold"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Stage</label>
              <div className="flex flex-wrap gap-2">
                {stages.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setForm({ ...form, stage: s.id })}
                    className="px-3 py-1.5 rounded-xl text-[12px] font-semibold border-2 transition-all"
                    style={
                      form.stage === s.id
                        ? { background: s.color, borderColor: s.color, color: "#fff" }
                        : { background: "#fff", borderColor: "#e2e8f0", color: "#64748b" }
                    }
                  >
                    {s.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setTab("stages")}
                  className="px-3 py-1.5 rounded-xl text-[12px] font-medium border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center gap-1"
                >
                  <Plus size={11} /> Stage
                </button>
              </div>
            </div>

            {customFields.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className={labelCls}>Custom Fields</p>
                {customFields.map((field) => (
                  <div key={field.id}>
                    <label className={labelCls}>
                      {field.label || <span className="italic text-slate-300">Unnamed field</span>}
                    </label>
                    <CustomFieldInput
                      field={field}
                      value={customValues[field.id]}
                      onChange={(v) => setCustomValues({ ...customValues, [field.id]: v })}
                    />
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setTab("fields")}
              className="flex items-center gap-1.5 text-[12px] text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
            >
              <Plus size={13} /> Add custom field
            </button>
          </div>
        )}

        {/* ── TAB: CUSTOM FIELDS ───────────────────── */}
        {tab === "fields" && (
          <div className="p-5 overflow-y-auto flex-1">
            <div className="mb-4">
              <p className="text-[13px] font-semibold text-slate-700">Custom Fields</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Define extra data types to capture with every lead
              </p>
            </div>

            <div className="space-y-2 mb-4">
              {customFields.length === 0 && (
                <div className="text-center py-10 text-slate-300">
                  <Settings2 size={30} className="mx-auto mb-2 opacity-40" />
                  <p className="text-[12px]">No custom fields yet</p>
                </div>
              )}
              {customFields.map((field) => (
                <FieldDefRow
                  key={field.id}
                  field={field}
                  onUpdate={(f) => updateFieldDef(field.id, f)}
                  onDelete={() => deleteFieldDef(field.id)}
                />
              ))}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFieldPicker((p) => !p)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-[13px] font-medium text-slate-500 hover:text-indigo-600 transition-all"
              >
                <Plus size={14} /> Add Field
              </button>

              {showFieldPicker && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-[60]">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2 px-1">
                    Choose data type
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {FIELD_TYPE_OPTIONS.map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addFieldDef(type)}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                          <Icon size={15} className="text-slate-500 group-hover:text-indigo-600" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-600 group-hover:text-indigo-700 leading-tight text-center">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: STAGES ──────────────────────────── */}
        {tab === "stages" && (
          <div className="overflow-y-auto flex-1">
            <StageManagerPanel stages={stages} setStages={setStages} />
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!form.name || !form.phone}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Create Lead
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SUB-COMPONENT: Edit Lead Modal
// ─────────────────────────────────────────────────────────

function EditLeadModal({
  lead,
  stages,
  customFields,
  onClose,
  onSave,
}: {
  lead: Lead;
  stages: PipelineStage[];
  customFields: CustomFieldDef[];
  onClose: () => void;
  onSave: (updated: Lead) => void;
}) {
  const inputCls =
    "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all";
  const labelCls =
    "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5";

  const [form, setForm] = useState({
    name: lead.name,
    company: lead.company,
    phone: lead.phone,
    value: String(lead.value),
    tag: lead.tag,
    stage: lead.stage,
    owner: lead.owner,
    probability: String(lead.probability),
  });
  const [customValues, setCustomValues] = useState<Record<string, any>>(lead.customValues || {});

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    onSave({
      ...lead,
      name: form.name,
      company: form.company,
      phone: form.phone,
      value: Number(form.value) || 0,
      tag: form.tag,
      stage: form.stage,
      owner: form.owner,
      probability: Math.min(100, Math.max(0, Number(form.probability) || 0)),
      customValues,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-slate-800">Edit Lead</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">{lead.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Lead Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Phone *</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Deal Value (₹)</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Owner</label>
              <input
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Win Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.probability}
                onChange={(e) => setForm({ ...form, probability: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Lead Tag</label>
              <select
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className={inputCls}
              >
                {["Hot", "Warm", "Cold", "Closed"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Stage</label>
            <div className="flex flex-wrap gap-2">
              {stages.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setForm({ ...form, stage: s.id })}
                  className="px-3 py-1.5 rounded-xl text-[12px] font-semibold border-2 transition-all"
                  style={
                    form.stage === s.id
                      ? { background: s.color, borderColor: s.color, color: "#fff" }
                      : { background: "#fff", borderColor: "#e2e8f0", color: "#64748b" }
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {customFields.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <p className={labelCls}>Custom Fields</p>
              {customFields.map((field) => (
                <div key={field.id}>
                  <label className={labelCls}>
                    {field.label || <span className="italic text-slate-300">Unnamed field</span>}
                  </label>
                  <CustomFieldInput
                    field={field}
                    value={customValues[field.id]}
                    onChange={(v) => setCustomValues({ ...customValues, [field.id]: v })}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!form.name || !form.phone}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2"
          >
            <Check size={14} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SUB-COMPONENT: Delete Confirm Modal
// ─────────────────────────────────────────────────────────

function DeleteConfirmModal({
  lead,
  onClose,
  onConfirm,
}: {
  lead: Lead;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-2xl shadow-2xl flex flex-col">
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
              <AlertTriangle size={15} className="text-rose-500" />
            </div>
            <h2 className="text-[16px] font-bold text-slate-800">Delete Lead</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl mb-4">
            <p className="text-[13px] text-rose-700 leading-relaxed">
              <strong>{lead.name}</strong> ({lead.company}) will be permanently deleted. This action cannot be undone.
            </p>
          </div>
          <p className="text-[13px] text-slate-500">
            Deal value of <strong>₹{(lead.value / 1000).toFixed(0)}K</strong> will be removed from your pipeline.
          </p>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={14} /> Delete Lead
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SUB-COMPONENT: User Permissions Modal
// ─────────────────────────────────────────────────────────

function UserPermissionsModal({
  users,
  setUsers,
  onClose,
}: {
  users: TeamUser[];
  setUsers: (u: TeamUser[]) => void;
  onClose: () => void;
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Edit" | "View">("View");

  const inputCls =
    "border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all";
  const labelCls =
    "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5";

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const name = inviteEmail
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    setUsers([
      ...users,
      { id: Date.now(), name, email: inviteEmail.trim(), role: inviteRole, active: true },
    ]);
    setInviteEmail("");
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[540px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <UserCog size={18} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-800">User Permissions</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">Manage team access to this pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Invite row */}
          <div>
            <p className={labelCls}>Invite Team Member</p>
            <div className="flex gap-2">
              <input
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                className={inputCls + " flex-1"}
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className={inputCls + " w-[100px]"}
              >
                {["Admin", "Edit", "View"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <button
                onClick={handleInvite}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition-all"
              >
                <Send size={13} /> Invite
              </button>
            </div>
          </div>

          {/* Role legend */}
          <div className="flex gap-3 p-3 bg-slate-50 rounded-xl">
            {[
              { role: "Admin", desc: "Full access", icon: Shield },
              { role: "Edit",  desc: "Add & edit leads", icon: Pencil },
              { role: "View",  desc: "Read-only", icon: Eye },
            ].map(({ role, desc, icon: Icon }) => (
              <div key={role} className="flex items-center gap-2 flex-1">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[role]}`}>
                  {role}
                </span>
                <span className="text-[11px] text-slate-400">{desc}</span>
              </div>
            ))}
          </div>

          {/* Team members list */}
          <div>
            <p className={labelCls}>Team Members ({users.length})</p>
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    user.active ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-xl text-[12px] font-semibold flex items-center justify-center flex-shrink-0 ${getAvatarColor(user.name)}`}>
                    {getInitials(user.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  {/* Role selector */}
                  <select
                    value={user.role}
                    onChange={(e) =>
                      setUsers(users.map((u) => u.id === user.id ? { ...u, role: e.target.value as any } : u))
                    }
                    className="text-[12px] font-medium border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-400 transition-all bg-white"
                  >
                    {["Admin", "Edit", "View"].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>

                  {/* Role badge */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${ROLE_COLORS[user.role]}`}>
                    {user.role}
                  </span>

                  {/* Active toggle */}
                  <button
                    onClick={() =>
                      setUsers(users.map((u) => u.id === user.id ? { ...u, active: !u.active } : u))
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${user.active ? "bg-indigo-500" : "bg-slate-200"}`}
                    title={user.active ? "Deactivate" : "Activate"}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${user.active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => setUsers(users.filter((u) => u.id !== user.id))}
                    className="w-7 h-7 rounded-lg hover:bg-rose-50 hover:border-rose-200 border border-transparent flex items-center justify-center transition-colors flex-shrink-0"
                    title="Remove user"
                  >
                    <X size={13} className="text-slate-400 hover:text-rose-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [stages, setStages] = useState<PipelineStage[]>(DEFAULT_STAGES);
  const [customFields, setCustomFields] = useState<CustomFieldDef[]>([]);
  const [users, setUsers] = useState<TeamUser[]>(INITIAL_USERS);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [newLeadDefaultStage, setNewLeadDefaultStage] = useState<string | undefined>();

  const [search, setSearch] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  // ── Derived stats ──────────────────────────────────────
  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase())
  );
  const totalValue = leads.reduce((s, l) => s + l.value, 0);
  const wonStageId = stages.find((s) => s.label.toLowerCase() === "won")?.id;
  const wonValue = leads.filter((l) => l.stage === wonStageId).reduce((s, l) => s + l.value, 0);
  const hotLeads = leads.filter((l) => l.tag === "Hot").length;

  // ── Drag & drop ────────────────────────────────────────
  const onDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("id", String(id));
    setDraggingId(id);
  };
  const onDragEnd = () => setDraggingId(null);
  const onDrop = (e: React.DragEvent, stageId: string) => {
    const id = e.dataTransfer.getData("id");
    setLeads((prev) => prev.map((l) => (l.id === Number(id) ? { ...l, stage: stageId } : l)));
    setDraggingId(null);
  };

  // ── CRUD ───────────────────────────────────────────────
  const handleCreateLead = (data: Omit<Lead, "id">) => {
    setLeads([...leads, { ...data, id: Date.now() }]);
    setShowModal(false);
  };

  const handleEditSave = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    if (selectedLead?.id === updated.id) setSelectedLead(updated);
    setEditingLead(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingLead) return;
    setLeads((prev) => prev.filter((l) => l.id !== deletingLead.id));
    if (selectedLead?.id === deletingLead.id) setSelectedLead(null);
    setDeletingLead(null);
  };

  const moveLead = (leadId: number, newStageId: string) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: newStageId } : l)));
    setSelectedLead((prev) => (prev ? { ...prev, stage: newStageId } : prev));
  };

  const getStageById = (id: string) => stages.find((s) => s.id === id);

  const openNewLead = (defaultStage?: string) => {
    setNewLeadDefaultStage(defaultStage);
    setShowModal(true);
  };

  return (
    <div className="h-screen bg-[#F7F8FC] flex flex-col overflow-hidden font-sans">

      {/* ── TOPBAR ─────────────────────────────────────── */}
      <header
        className="bg-white border-b border-slate-100 px-8 flex items-center justify-between flex-shrink-0"
        style={{ height: 68 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <Target size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[17px] font-semibold text-slate-800 tracking-tight leading-none">
              Leads Pipeline
            </h1>
            <p className="text-[12px] text-slate-400 mt-0.5">Drag cards to update stages</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Permissions Button */}
          <button
            onClick={() => setShowPermissions(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-[13px] font-medium transition-all"
            title="User Permissions"
          >
            <UserCog size={15} />
            <span className="hidden sm:inline">Permissions</span>
            {users.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center">
                {users.filter((u) => u.active).length}
              </span>
            )}
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads…"
              className="pl-9 pr-4 py-2 text-[13px] rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 w-[220px] transition-all"
            />
          </div>
          <button
            onClick={() => openNewLead()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium px-4 py-2 rounded-xl shadow-sm shadow-indigo-200 transition-all"
          >
            <Plus size={15} /> New Lead
          </button>
        </div>
      </header>

      {/* ── STATS BAR ──────────────────────────────────── */}
      <div className="flex gap-4 px-8 py-3 bg-white border-b border-slate-100 flex-shrink-0">
        {[
          { icon: Users,      label: "Total Leads",    value: leads.length,                           sub: `${filteredLeads.length} shown`, color: "text-indigo-500 bg-indigo-50" },
          { icon: DollarSign, label: "Pipeline Value",  value: `₹${(totalValue / 1000).toFixed(0)}K`, sub: "total value",                   color: "text-sky-500 bg-sky-50"       },
          { icon: TrendingUp, label: "Won Revenue",     value: `₹${(wonValue / 1000).toFixed(0)}K`,   sub: "closed deals",                  color: "text-emerald-500 bg-emerald-50"},
          { icon: Flame,      label: "Hot Leads",       value: hotLeads,                               sub: "need follow-up",                color: "text-rose-500 bg-rose-50"     },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 flex-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
              <Icon size={15} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">{label}</p>
              <p className="text-[16px] font-semibold text-slate-800 leading-tight">{value}</p>
            </div>
            <p className="text-[11px] text-slate-400 ml-auto">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── KANBAN BOARD ───────────────────────────────── */}
      <div className="flex gap-5 px-8 py-5 overflow-x-auto flex-1 min-h-0">
        {stages.map((stage) => {
          const colLeads = filteredLeads.filter((l) => l.stage === stage.id);
          const colValue = colLeads.reduce((s, l) => s + l.value, 0);

          return (
            <div
              key={stage.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, stage.id)}
              className="min-w-[295px] max-w-[295px] flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden"
            >
              {/* Column header */}
              <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                    <h2 className="font-semibold text-[14px] text-slate-700">{stage.label}</h2>
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                      {colLeads.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openNewLead(stage.id)}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <Plus size={13} className="text-slate-500" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  ₹{(colValue / 1000).toFixed(0)}K pipeline
                </p>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colLeads.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                    <Target size={26} className="mb-2 opacity-40" />
                    <p className="text-[11px]">Drop leads here</p>
                  </div>
                )}

                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, lead.id)}
                    onDragEnd={onDragEnd}
                    onMouseEnter={() => setHoveredCardId(lead.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    onClick={() => setSelectedLead(lead)}
                    className={`bg-white border rounded-xl p-4 cursor-pointer transition-all select-none relative ${
                      draggingId === lead.id
                        ? "opacity-40 scale-95 border-indigo-300"
                        : "border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50"
                    }`}
                  >
                    {/* ── Card Action Buttons (Edit / Delete / Preview) ── */}
                    <div
                      className={`absolute top-2.5 right-2.5 flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm transition-all z-10 ${
                        hoveredCardId === lead.id ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Preview */}
                      <button
                        onClick={() => setSelectedLead(lead)}
                        title="Preview"
                        className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-violet-50 hover:text-violet-600 text-slate-400 transition-colors"
                      >
                        <Eye size={12} />
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => setEditingLead(lead)}
                        title="Edit"
                        className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-sky-50 hover:text-sky-600 text-slate-400 transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => setDeletingLead(lead)}
                        title="Delete"
                        className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 text-slate-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* Top */}
                    <div className="flex items-start justify-between mb-3 pr-20">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg text-[12px] font-semibold flex items-center justify-center flex-shrink-0 ${getAvatarColor(lead.name)}`}
                        >
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800 leading-tight">
                            {lead.name}
                          </p>
                          <p className="text-[11px] text-slate-400">{lead.company}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 absolute top-4 right-4 ${
                          hoveredCardId === lead.id ? "opacity-0" : "opacity-100"
                        } transition-opacity ${TAG_COLORS[lead.tag] || "bg-slate-100 text-slate-500"}`}
                      >
                        {lead.tag}
                      </span>
                    </div>

                    {/* Value */}
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-[22px] font-bold text-slate-800 leading-none">
                        ₹{(lead.value / 1000).toFixed(0)}K
                      </span>
                      <ArrowUpRight size={13} className="text-emerald-500 mb-0.5" />
                    </div>

                    {/* Probability */}
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Win probability</span>
                        <span className="font-semibold text-slate-600">{lead.probability}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${stage.bar} transition-all`}
                          style={{ width: `${lead.probability}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center ${getAvatarColor(lead.owner)}`}
                        >
                          {lead.owner[0]}
                        </div>
                        <span className="text-[11px] text-slate-500">{lead.owner}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock size={11} className={lead.aging > 7 ? "text-rose-400" : "text-slate-300"} />
                        <span className={lead.aging > 7 ? "text-rose-500 font-medium" : "text-slate-400"}>
                          {lead.aging}d
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[11px] font-medium transition-colors"
                      >
                        <MessageCircle size={12} /> WhatsApp
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-medium transition-colors"
                      >
                        <Phone size={12} /> Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DETAIL DRAWER ──────────────────────────────── */}
      {selectedLead && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40"
            onClick={() => setSelectedLead(null)}
          />
          <div className="fixed right-0 top-0 w-[390px] h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-50">
            {/* Drawer header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl text-[16px] font-bold flex items-center justify-center ${getAvatarColor(selectedLead.name)}`}
                  >
                    {getInitials(selectedLead.name)}
                  </div>
                  <div>
                    <h2 className="font-bold text-[17px] text-slate-800">{selectedLead.name}</h2>
                    <p className="text-[12px] text-slate-400">{selectedLead.company}</p>
                  </div>
                </div>
                {/* Drawer header action buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setEditingLead(selectedLead); setSelectedLead(null); }}
                    title="Edit lead"
                    className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-100 flex items-center justify-center transition-colors"
                  >
                    <Pencil size={13} className="text-sky-600" />
                  </button>
                  <button
                    onClick={() => { setDeletingLead(selectedLead); setSelectedLead(null); }}
                    title="Delete lead"
                    className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={13} className="text-rose-500" />
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <X size={15} className="text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Stage + tag pills */}
              <div className="mt-3 flex gap-2 flex-wrap">
                {(() => {
                  const sg = getStageById(selectedLead.stage);
                  return sg ? (
                    <span
                      className="text-[11px] font-semibold px-3 py-1 rounded-full"
                      style={{ background: sg.bg, color: sg.color }}
                    >
                      {sg.label}
                    </span>
                  ) : null;
                })()}
                <span
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full ${TAG_COLORS[selectedLead.tag] || "bg-slate-100 text-slate-500"}`}
                >
                  {selectedLead.tag}
                </span>
              </div>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {/* AI insight */}
              <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={13} className="text-indigo-500" />
                  <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wider">
                    AI Insight
                  </span>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  {selectedLead.probability >= 70
                    ? "High-value lead with strong close probability. Prioritize follow-up today."
                    : selectedLead.aging > 7
                    ? `Lead has been inactive for ${selectedLead.aging} days. Send a re-engagement message.`
                    : "Steady pipeline lead. Schedule a discovery call to qualify further."}
                </p>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Deal Value",      value: `₹${(selectedLead.value / 1000).toFixed(0)}K`, icon: DollarSign },
                  { label: "Win Probability", value: `${selectedLead.probability}%`,                 icon: TrendingUp },
                  { label: "Lead Age",        value: `${selectedLead.aging} days`,                   icon: Clock      },
                  { label: "Owner",           value: selectedLead.owner,                             icon: Users      },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={11} className="text-slate-400" />
                      <p className="text-[11px] text-slate-400">{label}</p>
                    </div>
                    <p className="text-[14px] font-semibold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-3">
                  Contact
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                    <Phone size={13} className="text-slate-500" />
                  </div>
                  <span className="text-[13px] font-medium text-slate-700">{selectedLead.phone}</span>
                </div>
              </div>

              {/* Custom field values */}
              {customFields.length > 0 && selectedLead.customValues && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-3">
                    Custom Fields
                  </p>
                  <div className="space-y-2">
                    {customFields.map((cf) => (
                      <div key={cf.id} className="flex justify-between items-start gap-3">
                        <span className="text-[12px] text-slate-400">{cf.label || "—"}</span>
                        <span className="text-[12px] font-medium text-slate-700 text-right">
                          {cf.type === "boolean"
                            ? selectedLead.customValues?.[cf.id] ? "Yes" : "No"
                            : selectedLead.customValues?.[cf.id] || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Move to stage */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-3">
                  Move to stage
                </p>
                <div className="flex gap-2 flex-wrap">
                  {stages
                    .filter((s) => s.id !== selectedLead.stage)
                    .map((s) => (
                      <button
                        key={s.id}
                        onClick={() => moveLead(selectedLead.id, s.id)}
                        className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                        {s.label} <ChevronRight size={11} />
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div className="p-5 border-t border-slate-100 grid grid-cols-2 gap-3 flex-shrink-0">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-medium transition-colors">
                <MessageCircle size={14} /> WhatsApp
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition-colors">
                <Phone size={14} /> Call Now
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── NEW LEAD MODAL ──────────────────────────────── */}
      {showModal && (
        <NewLeadModal
          onClose={() => setShowModal(false)}
          onSave={handleCreateLead}
          stages={stages}
          setStages={setStages}
          customFields={customFields}
          setCustomFields={setCustomFields}
          defaultStage={newLeadDefaultStage}
        />
      )}

      {/* ── EDIT LEAD MODAL ─────────────────────────────── */}
      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          stages={stages}
          customFields={customFields}
          onClose={() => setEditingLead(null)}
          onSave={handleEditSave}
        />
      )}

      {/* ── DELETE CONFIRM MODAL ────────────────────────── */}
      {deletingLead && (
        <DeleteConfirmModal
          lead={deletingLead}
          onClose={() => setDeletingLead(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* ── USER PERMISSIONS MODAL ──────────────────────── */}
      {showPermissions && (
        <UserPermissionsModal
          users={users}
          setUsers={setUsers}
          onClose={() => setShowPermissions(false)}
        />
      )}
    </div>
  );
}
