import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";

type CustomField = { id: number; label: string; type: string };
type Deal = {
  id: string; title: string; company: string; value: number;
  winProbability: number; assignee: string;
  status: "Hot" | "Warm" | "Cold" | "Closed" | null; createdAt: string;
};
type PipelineData = { [key: string]: Deal[] };

const initialData: PipelineData = {
  New: [{ id: "1", title: "Website Redesign", company: "RM Consultancy", value: 120000, winProbability: 70, assignee: "Harsh", status: null, createdAt: "2026-05-24" }],
  Proposal: [{ id: "2", title: "Mobile App", company: "Nexus Solutions", value: 85000, winProbability: 45, assignee: "Sneha", status: "Warm", createdAt: "2026-05-17" }],
  Negotiation: [{ id: "3", title: "ERP Integration", company: "InfraCore Ltd", value: 340000, winProbability: 80, assignee: "Harsh", status: "Hot", createdAt: "2026-05-26" }],
  Closed: [{ id: "4", title: "Cloud Migration", company: "CloudSpark", value: 210000, winProbability: 100, assignee: "Riya", status: "Closed", createdAt: "2026-05-29" }],
};

// ── Design tokens matching the Leads Pipeline screenshot ──
const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Hot:    { bg: "bg-red-50",    text: "text-red-500",    border: "border-red-200",    dot: "bg-red-400" },
  Warm:   { bg: "bg-amber-50",  text: "text-amber-500",  border: "border-amber-200",  dot: "bg-amber-400" },
  Cold:   { bg: "bg-sky-50",    text: "text-sky-500",    border: "border-sky-200",    dot: "bg-sky-400" },
  Closed: { bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-200",dot: "bg-emerald-400" },
};

// Column accent colors — left border stripe + dot
const COL_ACCENTS = [
  { dot: "bg-blue-500",    border: "border-l-blue-500",    header: "text-blue-600",    ring: "ring-blue-100" },
  { dot: "bg-amber-400",   border: "border-l-amber-400",   header: "text-amber-600",   ring: "ring-amber-100" },
  { dot: "bg-violet-500",  border: "border-l-violet-500",  header: "text-violet-600",  ring: "ring-violet-100" },
  { dot: "bg-emerald-500", border: "border-l-emerald-500", header: "text-emerald-600", ring: "ring-emerald-100" },
  { dot: "bg-rose-500",    border: "border-l-rose-500",    header: "text-rose-600",    ring: "ring-rose-100" },
  { dot: "bg-cyan-500",    border: "border-l-cyan-500",    header: "text-cyan-600",    ring: "ring-cyan-100" },
  { dot: "bg-fuchsia-500", border: "border-l-fuchsia-500", header: "text-fuchsia-600", ring: "ring-fuchsia-100" },
];

const PROB_COLOR = (p: number) =>
  p >= 80 ? "bg-gradient-to-r from-blue-500 to-indigo-500"
  : p >= 50 ? "bg-gradient-to-r from-amber-400 to-orange-400"
  : "bg-gradient-to-r from-yellow-300 to-yellow-400";

const AVATAR_PALETTES = [
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-blue-100",   text: "text-blue-700" },
  { bg: "bg-emerald-100",text: "text-emerald-700" },
  { bg: "bg-amber-100",  text: "text-amber-700" },
  { bg: "bg-pink-100",   text: "text-pink-700" },
  { bg: "bg-teal-100",   text: "text-teal-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
];

function getInitials(n: string) { return n.split(" ").map(x => x[0]).join("").toUpperCase().slice(0, 2); }
function getAvatarPalette(n: string) { let h = 0; for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + h * 31; return AVATAR_PALETTES[Math.abs(h) % AVATAR_PALETTES.length]; }
function formatValue(v: number) { return v >= 100000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v.toLocaleString("en-IN")}`; }
function getDealAge(c: string) { return Math.floor((Date.now() - new Date(c).getTime()) / 86400000); }

const emptyDeal = { title: "", company: "", value: "", winProbability: "50", assignee: "", status: "" as Deal["status"] | "", stage: "New" };
const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 bg-gray-50 transition-all";

// ── Avatar ──
function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const p = getAvatarPalette(name);
  const sz = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} ${p.bg} ${p.text} rounded-xl flex-shrink-0 flex items-center justify-center font-bold`}>
      {getInitials(name)}
    </div>
  );
}

// ── Status Badge ──
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status];
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ── Shared Form Fields ──
function DealFormFields({ deal, setDeal, stages, onAddStage }: { deal: any; setDeal: (v: any) => void; stages: string[]; onAddStage: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="col-span-2">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Deal Name *</label>
        <input type="text" value={deal.title} onChange={e => setDeal({ ...deal, title: e.target.value })} className={inputCls} placeholder="e.g. Website Redesign" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Company</label>
        <input type="text" value={deal.company} onChange={e => setDeal({ ...deal, company: e.target.value })} className={inputCls} placeholder="Company name" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Deal Value (₹) *</label>
        <input type="number" value={deal.value} onChange={e => setDeal({ ...deal, value: e.target.value })} className={inputCls} placeholder="0" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Win Probability (%)</label>
        <input type="number" min="0" max="100" value={deal.winProbability} onChange={e => setDeal({ ...deal, winProbability: e.target.value })} className={inputCls} placeholder="50" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Assignee</label>
        <input type="text" value={deal.assignee} onChange={e => setDeal({ ...deal, assignee: e.target.value })} className={inputCls} placeholder="Your name" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status</label>
        <select value={deal.status || ""} onChange={e => setDeal({ ...deal, status: e.target.value as any })} className={inputCls}>
          <option value="">None</option>
          <option value="Hot">🔥 Hot</option>
          <option value="Warm">🌤 Warm</option>
          <option value="Cold">❄️ Cold</option>
          <option value="Closed">✅ Closed</option>
        </select>
      </div>
      <div className="col-span-2">
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pipeline Stage</label>
          <button type="button" onClick={onAddStage} className="text-violet-500 text-xs font-semibold hover:text-violet-700 transition-colors">+ Add New Stage</button>
        </div>
        <select value={deal.stage} onChange={e => setDeal({ ...deal, stage: e.target.value })} className={inputCls}>
          {stages.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}

// ── Deal Detail Panel ──
function DealDetailPanel({ deal, onClose, onEdit, onDelete }: { deal: Deal; onClose: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header with gradient accent */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0" style={{ background: "linear-gradient(135deg, #f8f7ff 0%, #fff 60%)" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={deal.title} size="lg" />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-base truncate">{deal.title}</h3>
              <p className="text-xs text-gray-400 truncate">{deal.company}</p>
              {deal.status && <div className="mt-1.5"><StatusBadge status={deal.status} /></div>}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 overflow-y-auto">
        {/* Value card */}
        <div className="rounded-2xl p-4 border border-violet-100" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)" }}>
          <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1">Deal Value</p>
          <p className="text-3xl font-bold text-violet-700">{formatValue(deal.value)}</p>
        </div>

        {/* Win probability */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Win Probability</p>
            <p className="text-sm font-bold text-gray-800">{deal.winProbability}%</p>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${PROB_COLOR(deal.winProbability)}`} style={{ width: `${deal.winProbability}%` }} />
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-3 bg-gray-50 rounded-2xl p-4">
          {[
            { label: "Assignee", isAssignee: true },
            { label: "Deal Age", value: `${getDealAge(deal.createdAt)} days` },
            { label: "Created", value: new Date(deal.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
          ].map(({ label, value, isAssignee }) => (
            <div key={label} className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
              {isAssignee ? (
                <div className="flex items-center gap-2">
                  <Avatar name={deal.assignee} size="sm" />
                  <p className="text-sm font-semibold text-gray-700">{deal.assignee}</p>
                </div>
              ) : <p className="text-sm font-medium text-gray-700">{value}</p>}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 16a2 2 0 01-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z" /></svg>
            WhatsApp
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5S9.5 13 11 14.5s4 2.5 4 2.5l1.113-1.724a1 1 0 011.21-.502l4.493 1.498A1 1 0 0123 17.72V21a2 2 0 01-2 2h-1C9.716 23 1 14.284 1 6V5z" /></svg>
            Call
          </button>
        </div>

        {/* Edit / Delete */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
          <button onClick={onEdit} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-600 text-xs font-semibold hover:bg-violet-100 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.5-6.5a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0111 16H9v-2a2 2 0 01.586-1.414z" /></svg>
            Edit Deal
          </button>
          <button onClick={onDelete} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal ──
function Modal({ children, zIndex = "z-50" }: { children: React.ReactNode; zIndex?: string }) {
  return (
    <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center ${zIndex} px-4`}>
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 8 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 8 }} className="w-full flex justify-center">
        {children}
      </motion.div>
    </div>
  );
}

// ── Main ──
export default function Deals() {
  const [data, setData] = useState<PipelineData>(initialData);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<{ deal: Deal; stage: string } | null>(null);
  const [showDeleteStageConfirm, setShowDeleteStageConfirm] = useState(false);
  const [stageToDelete, setStageToDelete] = useState<string | null>(null);
  const [hoveredColHeader, setHoveredColHeader] = useState<string | null>(null);
  const [newStage, setNewStage] = useState("");
  const [newDeal, setNewDeal] = useState({ ...emptyDeal });
  const [editDeal, setEditDeal] = useState<(Deal & { stage: string }) | null>(null);
  const [customField, setCustomField] = useState({ label: "", type: "text" });
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredDealId, setHoveredDealId] = useState<string | null>(null);
  const [previewDeal, setPreviewDeal] = useState<Deal | null>(null);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const findStage = (id: string) => Object.keys(data).find(s => data[s].find(d => d.id === id)) || "New";

  const filteredData: PipelineData = {};
  for (const col of Object.keys(data)) {
    filteredData[col] = data[col].filter(d =>
      [d.title, d.company, d.assignee].some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const allDeals = Object.values(data).flat();
  const pipelineValue = allDeals.reduce((s, d) => s + d.value, 0);
  const closedValue = (data["Closed"] || []).reduce((s, d) => s + d.value, 0);
  const hotDeals = allDeals.filter(d => d.status === "Hot").length;

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const src = result.source.droppableId, dst = result.destination.droppableId;
    const srcItems = [...data[src]], dstItems = src === dst ? srcItems : [...data[dst]];
    const [moved] = srcItems.splice(result.source.index, 1);
    if (src === dst) { srcItems.splice(result.destination.index, 0, moved); setData({ ...data, [src]: srcItems }); }
    else { dstItems.splice(result.destination.index, 0, moved); setData({ ...data, [src]: srcItems, [dst]: dstItems }); }
  };

  const handleCreateDeal = () => {
    if (!newDeal.title || !newDeal.value) return;
    const deal: Deal = { id: Date.now().toString(), title: newDeal.title, company: newDeal.company || "—", value: Number(newDeal.value), winProbability: Number(newDeal.winProbability), assignee: newDeal.assignee || "You", status: (newDeal.status as Deal["status"]) || null, createdAt: new Date().toISOString() };
    setData({ ...data, [newDeal.stage]: [...data[newDeal.stage], deal] });
    setNewDeal({ ...emptyDeal }); setShowModal(false);
  };

  const handleEditDeal = () => {
    if (!editDeal) return;
    const updated: Deal = { id: editDeal.id, title: editDeal.title, company: editDeal.company, value: Number(editDeal.value), winProbability: Number(editDeal.winProbability), assignee: editDeal.assignee, status: editDeal.status, createdAt: editDeal.createdAt };
    const oldStage = findStage(editDeal.id);
    if (oldStage === editDeal.stage) setData({ ...data, [oldStage]: data[oldStage].map(d => d.id === editDeal.id ? updated : d) });
    else setData({ ...data, [oldStage]: data[oldStage].filter(d => d.id !== editDeal.id), [editDeal.stage]: [...data[editDeal.stage], updated] });
    if (selectedDeal?.id === editDeal.id) setSelectedDeal(updated);
    setShowEditModal(false); setEditDeal(null);
  };

  const handleDeleteDeal = () => {
    if (!dealToDelete) return;
    setData({ ...data, [dealToDelete.stage]: data[dealToDelete.stage].filter(d => d.id !== dealToDelete.deal.id) });
    if (selectedDeal?.id === dealToDelete.deal.id) setSelectedDeal(null);
    setShowDeleteConfirm(false); setDealToDelete(null);
  };

  const openEdit = (deal: Deal) => { setEditDeal({ ...deal, stage: findStage(deal.id) }); setShowEditModal(true); };
  const openDelete = (deal: Deal) => { setDealToDelete({ deal, stage: findStage(deal.id) }); setShowDeleteConfirm(true); };

  const handleAddStage = () => {
    if (!newStage.trim() || data[newStage.trim()]) return;
    setData({ ...data, [newStage.trim()]: [] }); setNewStage(""); setShowStageModal(false);
  };

  const handleDeleteStage = () => {
    if (!stageToDelete) return;
    const newData = { ...data };
    delete newData[stageToDelete];
    setData(newData);
    if (selectedDeal && data[stageToDelete]?.find(d => d.id === selectedDeal.id)) setSelectedDeal(null);
    setShowDeleteStageConfirm(false);
    setStageToDelete(null);
  };

  const openDeleteStage = (stage: string) => { setStageToDelete(stage); setShowDeleteStageConfirm(true); };

  const handleAddCustomField = () => {
    if (!customField.label) return;
    setCustomFields([...customFields, { id: Date.now(), label: customField.label, type: customField.type }]);
    setCustomField({ label: "", type: "text" }); setShowCustomFieldModal(false);
  };

  const renderCustomFieldInput = (field: CustomField) => {
    const cls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 bg-gray-50";
    if (field.type === "checkbox") return <div className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4 accent-violet-500" /><span className="text-sm">{field.label}</span></div>;
    if (field.type === "textarea") return <textarea rows={2} className={cls} />;
    if (field.type === "select") return <select className={cls}><option>Select...</option></select>;
    return <input type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} className={cls} />;
  };

  const stages = Object.keys(data);

  // Stats config matching the Leads Pipeline screenshot style
  const stats = [
    {
      icon: <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m6-4a4 4 0 10-8 0 4 4 0 008 0z" /></svg>,
      iconBg: "bg-violet-100", label: "TOTAL DEALS", value: `${allDeals.length}`, sub: `${allDeals.length} shown`, valueColor: "text-gray-900"
    },
    {
      icon: <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      iconBg: "bg-emerald-100", label: "PIPELINE VALUE", value: formatValue(pipelineValue), sub: "total value", valueColor: "text-gray-900"
    },
    {
      icon: <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
      iconBg: "bg-blue-100", label: "WON REVENUE", value: formatValue(closedValue), sub: "closed deals", valueColor: "text-gray-900"
    },
    {
      icon: <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343M15 9l-6 6" /></svg>,
      iconBg: "bg-red-100", label: "HOT DEALS", value: `${hotDeals}`, sub: "need follow-up", valueColor: "text-gray-900"
    },
  ];

  return (
    <div className="flex h-screen font-sans" style={{ background: "#f0f2f8", overflow: "hidden" }}>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0" style={{ overflow: "hidden" }}>

        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-5 py-3 flex flex-wrap justify-between items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Circular icon bubble — matches Leads Pipeline style exactly */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}
            >
              {/* Briefcase / deals icon */}
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="12" strokeWidth={3} strokeLinecap="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 13h20" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Deals Pipeline</h2>
              <p className="text-xs text-gray-400">Drag cards to update stages</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Search matching screenshot */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
              <input className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 w-44 placeholder-gray-400 transition-all" placeholder="Search deals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            {/* New Deal button — purple gradient matching screenshot */}
            <button
              onClick={() => { setNewDeal({ ...emptyDeal }); setShowModal(true); }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-violet-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">New Deal</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* ── Stats Bar — matching screenshot layout ── */}
        <div className="bg-white border-b border-gray-100 px-5 py-3 flex-shrink-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{s.label}</p>
                  <p className={`text-lg font-bold ${s.valueColor} leading-tight`}>{s.value} <span className="text-xs font-normal text-gray-400">{s.sub}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── KANBAN ── */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 relative" style={{ overflow: "hidden" }}>
            <div className="absolute inset-0 overflow-x-auto overflow-y-auto" style={{ padding: "16px 20px 20px" }}>
              <div className="inline-flex gap-4 h-full items-start min-h-full">

                {Object.keys(filteredData).map((col, colIdx) => {
                  const accent = COL_ACCENTS[colIdx % COL_ACCENTS.length];
                  return (
                    <Droppable droppableId={col} key={col}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col flex-shrink-0" style={{ width: "272px" }}>

                          {/* Column header card */}
                          <div
                            className={`bg-white rounded-2xl px-4 py-3 mb-3 border border-gray-100 shadow-sm border-l-4 ${accent.border} relative group/col`}
                            onMouseEnter={() => setHoveredColHeader(col)}
                            onMouseLeave={() => setHoveredColHeader(null)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${accent.dot}`} />
                                <span className={`font-bold text-sm ${accent.header}`}>{col}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ring-1 ${accent.ring} text-gray-600 bg-white`}>{filteredData[col].length}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {/* Delete stage button — appears on hover */}
                                <AnimatePresence>
                                  {hoveredColHeader === col && (
                                    <motion.button
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{ duration: 0.15 }}
                                      onClick={() => openDeleteStage(col)}
                                      title="Delete stage"
                                      className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </motion.button>
                                  )}
                                </AnimatePresence>
                                {/* Add deal button */}
                                <button
                                  onClick={() => { setNewDeal({ ...emptyDeal, stage: col }); setShowModal(true); }}
                                  className={`w-7 h-7 rounded-lg ring-1 ${accent.ring} hover:bg-gray-50 text-gray-400 hover:text-gray-600 flex items-center justify-center text-lg leading-none transition-colors`}
                                >+</button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5 font-medium">{formatValue(data[col].reduce((s, d) => s + d.value, 0))} pipeline</p>
                          </div>

                          {/* Cards */}
                          <div
                            className={`flex flex-col gap-3 rounded-2xl p-1 -m-1 transition-all duration-200 ${snapshot.isDraggingOver ? "bg-violet-50/60" : ""}`}
                            style={{ minHeight: "60px" }}
                          >
                            {filteredData[col].map((deal, index) => (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{ ...provided.draggableProps.style, width: "272px" }}
                                    onMouseEnter={() => setHoveredDealId(deal.id)}
                                    onMouseLeave={() => setHoveredDealId(null)}
                                    className={`bg-white rounded-2xl border select-none relative transition-all duration-150
                                      ${snapshot.isDragging
                                        ? "shadow-2xl border-violet-200 rotate-1 scale-[1.02]"
                                        : hoveredDealId === deal.id
                                          ? `shadow-lg border-l-4 ${accent.border}`
                                          : "shadow-sm border-gray-100 border-l-4 border-l-transparent"
                                      }`}
                                  >
                                    {/* Hover action icons — Zoho/Bigin style */}
                                    <AnimatePresence>
                                      {hoveredDealId === deal.id && !snapshot.isDragging && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -6 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -6 }}
                                          transition={{ duration: 0.12 }}
                                          className="absolute -top-3.5 right-2 flex items-center gap-1 z-20"
                                        >
                                          {[
                                            {
                                              title: "Preview",
                                              cls: "hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600",
                                              icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
                                              fn: (e: any) => { e.stopPropagation(); setPreviewDeal(deal); }
                                            },
                                            {
                                              title: "Edit",
                                              cls: "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600",
                                              icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.5-6.5a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0111 16H9v-2a2 2 0 01.586-1.414z" /></svg>,
                                              fn: (e: any) => { e.stopPropagation(); openEdit(deal); }
                                            },
                                            {
                                              title: "Delete",
                                              cls: "hover:bg-red-50 hover:border-red-300 hover:text-red-500",
                                              icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
                                              fn: (e: any) => { e.stopPropagation(); openDelete(deal); }
                                            },
                                          ].map(btn => (
                                            <button key={btn.title} title={btn.title} onClick={btn.fn}
                                              className={`w-7 h-7 rounded-lg bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-400 transition-all ${btn.cls}`}>
                                              {btn.icon}
                                            </button>
                                          ))}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>

                                    {/* Card body */}
                                    <div className="p-4" onClick={() => { setSelectedDeal(deal); if (isMobile) setShowMobilePanel(true); }}>
                                      {/* Title row */}
                                      <div className="flex items-start gap-2.5 mb-3">
                                        <Avatar name={deal.title} />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-1 mb-0.5">
                                            <p className="font-bold text-gray-900 text-sm leading-tight truncate">{deal.title}</p>
                                            {deal.status && <StatusBadge status={deal.status} />}
                                          </div>
                                          <p className="text-xs text-gray-400 truncate">{deal.company}</p>
                                        </div>
                                      </div>

                                      {/* Value */}
                                      <div className="flex items-center gap-1.5 mb-3">
                                        <p className="text-xl font-bold text-gray-900">{formatValue(deal.value)}</p>
                                        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                          <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M7 7h10v10" /></svg>
                                        </div>
                                      </div>

                                      {/* Probability */}
                                      <div className="mb-3">
                                        <div className="flex justify-between mb-1.5">
                                          <p className="text-xs text-gray-400 font-medium">Win probability</p>
                                          <p className="text-xs font-bold text-gray-700">{deal.winProbability}%</p>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                          <div className={`h-full rounded-full ${PROB_COLOR(deal.winProbability)}`} style={{ width: `${deal.winProbability}%` }} />
                                        </div>
                                      </div>

                                      {/* Assignee + age */}
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <Avatar name={deal.assignee} size="sm" />
                                          <span className="text-xs font-medium text-gray-600 truncate">{deal.assignee}</span>
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ml-2 ${getDealAge(deal.createdAt) > 7 ? "text-orange-500" : "text-gray-400"}`}>
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2" /></svg>
                                          {getDealAge(deal.createdAt)}d
                                        </div>
                                      </div>

                                      {/* Action buttons */}
                                      <div className="flex gap-2">
                                        <button onClick={e => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors">
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 16a2 2 0 01-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z" /></svg>
                                          WhatsApp
                                        </button>
                                        <button onClick={e => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5S9.5 13 11 14.5s4 2.5 4 2.5l1.113-1.724a1 1 0 011.21-.502l4.493 1.498A1 1 0 0123 17.72V21a2 2 0 01-2 2h-1C9.716 23 1 14.284 1 6V5z" /></svg>
                                          Call
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  );
                })}

                {/* Add Stage */}
                <div className="flex-shrink-0 flex items-start pt-1" style={{ width: "160px" }}>
                  <button onClick={() => setShowStageModal(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-6 text-gray-400 hover:border-violet-300 hover:text-violet-400 text-sm font-semibold transition-all flex flex-col items-center gap-1.5 hover:bg-violet-50/50">
                    <span className="text-xl leading-none">+</span>Add Stage
                  </button>
                </div>

              </div>
            </div>
          </div>
        </DragDropContext>
      </div>

      {/* DESKTOP RIGHT PANEL */}
      <AnimatePresence>
        {selectedDeal && !isMobile && (
          <motion.div
            initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white border-l border-gray-100 flex flex-col flex-shrink-0"
            style={{ width: "300px", overflow: "hidden" }}
          >
            <DealDetailPanel deal={selectedDeal} onClose={() => setSelectedDeal(null)} onEdit={() => openEdit(selectedDeal)} onDelete={() => openDelete(selectedDeal)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM SHEET */}
      <AnimatePresence>
        {selectedDeal && isMobile && showMobilePanel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowMobilePanel(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] flex flex-col">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />
              <div className="flex-1 overflow-hidden">
                <DealDetailPanel deal={selectedDeal} onClose={() => { setShowMobilePanel(false); setSelectedDeal(null); }} onEdit={() => { setShowMobilePanel(false); openEdit(selectedDeal); }} onDelete={() => { setShowMobilePanel(false); openDelete(selectedDeal); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewDeal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900 z-40" onClick={() => setPreviewDeal(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 16 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 p-5"
              style={{ width: "min(340px, calc(100vw - 32px))" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={previewDeal.title} size="lg" />
                  <div><p className="font-bold text-gray-900">{previewDeal.title}</p><p className="text-xs text-gray-400">{previewDeal.company}</p></div>
                </div>
                <button onClick={() => setPreviewDeal(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {previewDeal.status && <div className="mb-3"><StatusBadge status={previewDeal.status} /></div>}
              <div className="rounded-2xl p-3 mb-3 border border-violet-100" style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)" }}>
                <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-0.5">Deal Value</p>
                <p className="text-2xl font-bold text-violet-700">{formatValue(previewDeal.value)}</p>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-1.5"><p className="text-xs text-gray-400 font-medium">Win Probability</p><p className="text-xs font-bold">{previewDeal.winProbability}%</p></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${PROB_COLOR(previewDeal.winProbability)}`} style={{ width: `${previewDeal.winProbability}%` }} /></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-4 bg-gray-50 rounded-xl px-3 py-2">
                <span>Assignee: <strong className="text-gray-800">{previewDeal.assignee}</strong></span>
                <span>Age: <strong className={getDealAge(previewDeal.createdAt) > 7 ? "text-orange-500" : "text-gray-800"}>{getDealAge(previewDeal.createdAt)}d</strong></span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setPreviewDeal(null); openEdit(previewDeal); }}
                  className="flex-1 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                  Edit Deal
                </button>
                <button onClick={() => { setPreviewDeal(null); openDelete(previewDeal); }} className="flex-1 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CREATE DEAL */}
      <AnimatePresence>
        {showModal && (
          <Modal>
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #fff 60%)" }}>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Create New Deal</h2>
                  <p className="text-xs text-gray-400">Fill in the details below</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5">
                <DealFormFields deal={newDeal} setDeal={setNewDeal} stages={stages} onAddStage={() => setShowStageModal(true)} />
                {customFields.length > 0 ? (
                  <div className="border-t pt-4 mb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Custom Fields</h3>
                      <button onClick={() => setShowCustomFieldModal(true)} className="text-violet-500 text-xs font-semibold hover:text-violet-700">+ Add Field</button>
                    </div>
                    {customFields.map(f => <div key={f.id}><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{f.label}</label>{renderCustomFieldInput(f)}</div>)}
                  </div>
                ) : (
                  <div className="border-t pt-4 mb-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">No custom fields yet</p>
                    <button onClick={() => setShowCustomFieldModal(true)} className="text-violet-500 text-xs font-semibold hover:text-violet-700">+ Add Custom Field</button>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleCreateDeal}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}>
                    Create Deal
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* EDIT DEAL */}
      <AnimatePresence>
        {showEditModal && editDeal && (
          <Modal>
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #fff 60%)" }}>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit Deal</h2>
                  <p className="text-xs text-gray-400">Update the deal details</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5">
                <DealFormFields deal={editDeal} setDeal={setEditDeal} stages={stages} onAddStage={() => setShowStageModal(true)} />
                <div className="flex gap-3">
                  <button onClick={() => setShowEditModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleEditDeal}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {showDeleteConfirm && dealToDelete && (
          <Modal>
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #fef2f2, #fee2e2)" }}>
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Deal?</h3>
              <p className="text-sm text-gray-500 text-center mb-6">Are you sure you want to delete <strong className="text-gray-800">"{dealToDelete.deal.title}"</strong>? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleDeleteDeal} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-red-100">Delete</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ADD STAGE */}
      <AnimatePresence>
        {showStageModal && (
          <Modal zIndex="z-[70]">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #fff 60%)" }}>
                <h2 className="text-lg font-bold text-gray-900">Add New Stage</h2>
                <button onClick={() => setShowStageModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5">
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Stage Name</label>
                <input type="text" value={newStage} onChange={e => setNewStage(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddStage()} placeholder="e.g. Discovery" className={`${inputCls} mb-5`} autoFocus />
                <div className="flex gap-3">
                  <button onClick={() => setShowStageModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleAddStage}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}>
                    Add Stage
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* CUSTOM FIELD */}
      <AnimatePresence>
        {showCustomFieldModal && (
          <Modal zIndex="z-[60]">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #fff 60%)" }}>
                <h2 className="text-lg font-bold text-gray-900">Add Custom Field</h2>
                <button onClick={() => setShowCustomFieldModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5">
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Field Label</label>
                <input type="text" value={customField.label} onChange={e => setCustomField({ ...customField, label: e.target.value })} className={`${inputCls} mb-4`} placeholder="e.g. Decision Maker" autoFocus />
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Data Type</label>
                <select value={customField.type} onChange={e => setCustomField({ ...customField, type: e.target.value })} className={`${inputCls} mb-5`}>
                  <option value="text">Single Line Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="textarea">Multi Line Text</option>
                  <option value="select">Dropdown</option>
                  <option value="checkbox">Checkbox</option>
                </select>
                <div className="flex gap-3">
                  <button onClick={() => setShowCustomFieldModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleAddCustomField}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}>
                    Add Field
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* DELETE STAGE CONFIRM */}
      <AnimatePresence>
        {showDeleteStageConfirm && stageToDelete && (
          <Modal zIndex="z-[80]">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
              {/* Red gradient header */}
              <div className="px-6 py-5 flex flex-col items-center" style={{ background: "linear-gradient(135deg, #fff1f1 0%, #fff 70%)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #fef2f2, #fee2e2)" }}>
                  <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center">Delete Stage?</h3>
                <p className="text-sm text-gray-500 text-center mt-1">
                  You're about to delete the <strong className="text-gray-800">"{stageToDelete}"</strong> stage.
                </p>
              </div>
              {/* Warning box */}
              <div className="mx-6 mb-4 mt-2">
                {data[stageToDelete]?.length > 0 ? (
                  <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xs text-amber-700 font-medium">
                      This stage has <strong>{data[stageToDelete].length} deal{data[stageToDelete].length > 1 ? "s" : ""}</strong>. All deals in this stage will be permanently deleted too.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-gray-500 font-medium">This stage is empty. It will be removed from the pipeline.</p>
                  </div>
                )}
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => { setShowDeleteStageConfirm(false); setStageToDelete(null); }}
                  className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStage}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white shadow-lg shadow-red-100 hover:opacity-90 active:scale-[0.98] transition-all"
                  style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}
                >
                  Delete Stage
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
}
