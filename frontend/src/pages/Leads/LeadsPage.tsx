import { useState, useContext, createContext, useRef, useEffect } from "react";
import {
  Search, Plus, Phone, MessageCircle, X,
  TrendingUp, Users, DollarSign, Target,
  ChevronRight, Flame, Clock, Sparkles, ArrowUpRight,
  Settings2, GripVertical, Trash2, Check, Pencil,
  Type, Hash, Calendar, List, ToggleLeft, Mail, Link, AlignLeft,
  ChevronDown, Eye, UserCog, Shield, Send, AlertTriangle,
  Bell, Settings, ChevronLeft, Menu,
  Building2, FileText, Zap, Database, Layers, Sliders,
  Gift, MessageSquare, Smartphone, Share2,
  Lock, RefreshCw, Activity, Filter, MoreVertical,
  User, CheckCircle, Circle, Trash, AtSign, Info,
  Star, ArrowRight, LogOut, HelpCircle, Upload, Download,
  Globe, Key, Clock3, AlertCircle, CheckSquare, Square,
  BarChart2, Briefcase, PhoneCall, FileBarChart,
  ShieldCheck, UserCheck, UserX, UserPlus, Edit3,
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────

const AppContext = createContext(null);

// ─────────────────────────────────────────────────────────
// TYPES & CONSTANTS (same as original + new)
// ─────────────────────────────────────────────────────────

const FIELD_TYPE_OPTIONS = [
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

type FieldType = typeof FIELD_TYPE_OPTIONS[number]["type"];

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

const DEFAULT_STAGES = [
  { id: "new",       label: "New",       ...STAGE_PALETTE[0] },
  { id: "contacted", label: "Contacted", ...STAGE_PALETTE[1] },
  { id: "qualified", label: "Qualified", ...STAGE_PALETTE[2] },
  { id: "won",       label: "Won",       ...STAGE_PALETTE[3] },
];

const INITIAL_LEADS = [
  { id: 1, name: "Rahul Mehta",  company: "RM Consultancy",  phone: "+91 9876543210", stage: "new",       value: 120000, owner: "Harsh", probability: 70,  aging: 5,  tag: "Hot"    },
  { id: 2, name: "Priya Sharma", company: "Nexus Solutions", phone: "+91 9823456780", stage: "contacted", value: 85000,  owner: "Sneha", probability: 45,  aging: 12, tag: "Warm"   },
  { id: 3, name: "Amit Verma",   company: "InfraCore Ltd",   phone: "+91 9812345670", stage: "qualified", value: 340000, owner: "Harsh", probability: 80,  aging: 3,  tag: "Hot"    },
  { id: 4, name: "Neha Joshi",   company: "CloudSpark",      phone: "+91 9901234560", stage: "won",       value: 210000, owner: "Riya",  probability: 100, aging: 0,  tag: "Closed" },
];

const INITIAL_USERS = [
  { id: 1, name: "Harsh Patel", email: "harsh@company.com", role: "Admin",          profile: "Super Admin",    status: "Active",   phone: "+91 9876543210", avatar: null },
  { id: 2, name: "Sneha Rao",   email: "sneha@company.com", role: "Sales Manager",  profile: "Manager",        status: "Active",   phone: "+91 9823456780", avatar: null },
  { id: 3, name: "Riya Mehta",  email: "riya@company.com",  role: "Sales Exec",     profile: "Sales Executive",status: "Invited",  phone: "+91 9901234560", avatar: null },
  { id: 4, name: "Dev Kumar",   email: "dev@company.com",   role: "Support Exec",   profile: "Support",        status: "Inactive", phone: "+91 9812345670", avatar: null },
  { id: 5, name: "Arjun Singh", email: "arjun@company.com", role: "Sales Exec",     profile: "Sales Executive",status: "Active",   phone: "+91 9765432100", avatar: null },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "mention",  title: "Rahul Mehta mentioned you",    desc: "In lead #1042 — 'Can you handle this?'",            time: "2m ago",  read: false, category: "Mentions" },
  { id: 2, type: "system",   title: "Pipeline value crossed ₹10L",  desc: "Your pipeline hit a new milestone today.",           time: "15m ago", read: false, category: "System" },
  { id: 3, type: "lead",     title: "New lead assigned",            desc: "Priya Sharma was assigned to you by Admin.",         time: "1h ago",  read: false, category: "All" },
  { id: 4, type: "system",   title: "Scheduled report ready",       desc: "Your weekly sales report is ready to download.",     time: "3h ago",  read: true,  category: "System" },
  { id: 5, type: "mention",  title: "Dev Kumar tagged you",         desc: "In deal #876 — needs your approval.",               time: "5h ago",  read: true,  category: "Mentions" },
  { id: 6, type: "lead",     title: "Lead stage updated",           desc: "Amit Verma moved to Qualified by Sneha Rao.",       time: "1d ago",  read: true,  category: "All" },
  { id: 7, type: "system",   title: "Two-factor auth reminder",     desc: "Enable 2FA to secure your account.",                time: "2d ago",  read: true,  category: "System" },
];

const INITIAL_PROFILES = [
  { id: 1, name: "Super Admin",     desc: "Full system access",              created: "2024-01-01", users: 1,  perms: { leads: ["create","read","update","delete","export","import"], contacts: ["create","read","update","delete","export","import"], deals: ["create","read","update","delete","export","import"], accounts: ["create","read","update","delete","export","import"], tasks: ["create","read","update","delete"], calendar: ["create","read","update","delete"], whatsapp: ["create","read","update","delete"], reports: ["create","read","export"], settings: ["create","read","update","delete"] } },
  { id: 2, name: "Manager",         desc: "Team management access",          created: "2024-01-05", users: 1,  perms: { leads: ["create","read","update","delete","export"], contacts: ["create","read","update","delete"], deals: ["create","read","update","delete"], accounts: ["read","update"], tasks: ["create","read","update","delete"], calendar: ["create","read","update"], whatsapp: ["read","update"], reports: ["read","export"], settings: ["read"] } },
  { id: 3, name: "Sales Executive", desc: "Standard sales operations",       created: "2024-01-10", users: 2,  perms: { leads: ["create","read","update"], contacts: ["create","read","update"], deals: ["create","read","update"], accounts: ["read"], tasks: ["create","read","update"], calendar: ["create","read","update"], whatsapp: ["create","read"], reports: ["read"], settings: [] } },
  { id: 4, name: "Support",         desc: "Customer support access",         created: "2024-01-15", users: 1,  perms: { leads: ["read"], contacts: ["create","read","update"], deals: ["read"], accounts: ["read"], tasks: ["create","read","update"], calendar: ["read"], whatsapp: ["create","read"], reports: [], settings: [] } },
];

const INITIAL_ROLES = [
  { id: 1, name: "Super Admin",      level: 1, parent: "—",            users: 1, profile: "Super Admin"     },
  { id: 2, name: "Admin",            level: 2, parent: "Super Admin",  users: 1, profile: "Manager"         },
  { id: 3, name: "Manager",          level: 3, parent: "Admin",        users: 1, profile: "Manager"         },
  { id: 4, name: "Sales Executive",  level: 4, parent: "Manager",      users: 2, profile: "Sales Executive" },
  { id: 5, name: "Support Executive",level: 4, parent: "Manager",      users: 1, profile: "Support"         },
];

const AUDIT_LOGS = [
  { id: 1, user: "Harsh Patel",  action: "Updated lead",   module: "Leads",    date: "2025-05-29 14:32", ip: "192.168.1.10" },
  { id: 2, user: "Sneha Rao",    action: "Created contact",module: "Contacts", date: "2025-05-29 13:15", ip: "192.168.1.22" },
  { id: 3, user: "Dev Kumar",    action: "Login",          module: "Auth",     date: "2025-05-29 11:00", ip: "10.0.0.5"     },
  { id: 4, user: "Harsh Patel",  action: "Deleted lead",   module: "Leads",    date: "2025-05-28 17:45", ip: "192.168.1.10" },
  { id: 5, user: "Riya Mehta",   action: "Exported data",  module: "Reports",  date: "2025-05-28 15:30", ip: "192.168.1.35" },
  { id: 6, user: "Sneha Rao",    action: "Changed role",   module: "Settings", date: "2025-05-27 09:20", ip: "192.168.1.22" },
];

const ALL_MODULES = ["leads","contacts","deals","accounts","tasks","calendar","whatsapp","reports","settings"];
const ALL_PERMS   = ["create","read","update","delete","export","import"];
const PERM_COLORS = { create:"bg-emerald-50 text-emerald-700", read:"bg-sky-50 text-sky-700", update:"bg-amber-50 text-amber-700", delete:"bg-rose-50 text-rose-700", export:"bg-violet-50 text-violet-700", import:"bg-indigo-50 text-indigo-700" };

const TAG_COLORS = { Hot:"bg-rose-50 text-rose-600", Warm:"bg-amber-50 text-amber-600", Cold:"bg-slate-100 text-slate-500", Closed:"bg-emerald-50 text-emerald-600" };
const STATUS_COLORS = { Active:"bg-emerald-50 text-emerald-700 border-emerald-200", Inactive:"bg-slate-100 text-slate-500 border-slate-200", Invited:"bg-amber-50 text-amber-700 border-amber-200", Deleted:"bg-rose-50 text-rose-600 border-rose-200" };
const AVATAR_COLORS = ["bg-indigo-100 text-indigo-700","bg-amber-100 text-amber-700","bg-sky-100 text-sky-700","bg-rose-100 text-rose-700","bg-emerald-100 text-emerald-700","bg-violet-100 text-violet-700"];
const NOTIF_ICONS = { mention: AtSign, system: Info, lead: Target };
const NOTIF_COLORS = { mention:"bg-violet-50 text-violet-600", system:"bg-sky-50 text-sky-600", lead:"bg-indigo-50 text-indigo-600" };

const uid = () => Math.random().toString(36).slice(2, 9);
const getInitials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const formatVal = (v) => `₹${(v / 1000).toFixed(0)}K`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

// ─────────────────────────────────────────────────────────
// SETTINGS SIDEBAR ITEMS
// ─────────────────────────────────────────────────────────

const SETTINGS_SECTIONS = [
  { id: "users",       label: "Users and Controls", icon: UserCog,     hasChildren: false },
  { id: "org",         label: "Organization",       icon: Building2,   hasChildren: false },
  { id: "fields",      label: "Fields",             icon: FileText,    hasChildren: false },
  { id: "stages",      label: "Stages",             icon: Layers,      hasChildren: false },
  { id: "forms",       label: "Forms",              icon: FileText,    hasChildren: false },
  { id: "automation",  label: "Automation",         icon: Zap,         hasChildren: false },
  { id: "data",        label: "Data Administration",icon: Database,    hasChildren: false },
  { id: "toppings",    label: "Toppings",           icon: Sliders,     hasChildren: false },
  { id: "trial",       label: "Free Trial",         icon: Gift,        hasChildren: false },
  {
    id: "channels", label: "Channels", icon: Share2, hasChildren: true,
    children: [
      { id: "channels-email",    label: "Email",    icon: Mail },
      { id: "channels-messages", label: "Messages", icon: MessageSquare },
      { id: "channels-phone",    label: "Phone",    icon: PhoneCall },
      { id: "channels-social",   label: "Social",   icon: Globe },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// SMALL SHARED COMPONENTS
// ─────────────────────────────────────────────────────────

function Avatar({ name, size = "sm" }) {
  const sz = size === "sm" ? "w-8 h-8 text-[12px]" : size === "md" ? "w-10 h-10 text-[13px]" : "w-12 h-12 text-[15px]";
  return <div className={`${sz} rounded-xl font-semibold flex items-center justify-center flex-shrink-0 ${getAvatarColor(name)}`}>{getInitials(name)}</div>;
}

function StatusBadge({ status }) {
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[status] || "bg-slate-100 text-slate-500"}`}>{status}</span>;
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-slate-100 px-6 bg-white flex-shrink-0">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-all -mb-px whitespace-nowrap ${active === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-white flex-shrink-0">
      <div>
        <h2 className="text-[17px] font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-[12px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Icon size={24} className="text-slate-400" /></div>
      <p className="text-[14px] font-semibold text-slate-600 mb-1">{title}</p>
      <p className="text-[12px] text-slate-400 mb-4">{desc}</p>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// NOTIFICATION PANEL
// ─────────────────────────────────────────────────────────

function NotificationPanel({ onClose }) {
  const { notifications, setNotifications } = useContext(AppContext);
  const [cat, setCat] = useState("All");
  const cats = ["All","Unread","Mentions","System"];
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);

  const filtered = notifications.filter(n => {
    if (cat === "Unread")   return !n.read;
    if (cat === "Mentions") return n.type === "mention";
    if (cat === "System")   return n.type === "system";
    return true;
  });

  const markRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const markAll  = ()   => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const del      = (id) => setNotifications(ns => ns.filter(n => n.id !== id));
  const unread   = notifications.filter(n => !n.read).length;

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-[380px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/60 z-[200] flex flex-col overflow-hidden" style={{ maxHeight: 520 }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-slate-800">Notifications</h3>
          {unread > 0 && <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && <button onClick={markAll} className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium">Mark all read</button>}
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X size={13} className="text-slate-500" /></button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-1 px-3 py-2 border-b border-slate-100 flex-shrink-0">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all ${cat === c ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{c}</button>
        ))}
      </div>
      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-slate-300">
            <Bell size={28} className="mb-2 opacity-50" />
            <p className="text-[12px]">No notifications</p>
          </div>
        )}
        {filtered.map(n => {
          const NIcon = NOTIF_ICONS[n.type] || Info;
          return (
            <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group ${!n.read ? "bg-indigo-50/30" : ""}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${NOTIF_COLORS[n.type] || "bg-slate-100 text-slate-500"}`}><NIcon size={14} /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] leading-tight ${!n.read ? "font-semibold text-slate-800" : "font-medium text-slate-600"}`}>{n.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                <p className="text-[10px] text-slate-300 mt-1">{n.time}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {!n.read && <button onClick={() => markRead(n.id)} title="Mark read" className="w-6 h-6 rounded-md hover:bg-indigo-100 flex items-center justify-center transition-colors"><CheckCircle size={12} className="text-indigo-500" /></button>}
                <button onClick={() => del(n.id)} title="Delete" className="w-6 h-6 rounded-md hover:bg-rose-50 flex items-center justify-center transition-colors"><Trash size={12} className="text-rose-400" /></button>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// USER MODAL (Add / Edit)
// ─────────────────────────────────────────────────────────

function UserModal({ user, onClose, onSave }) {
  const isEdit = !!user;
  const [form, setForm] = useState(user ? { ...user, password: "", confirm: "" } : { name: "", email: "", phone: "", role: "Sales Exec", profile: "Sales Executive", status: "Active", password: "", confirm: "" });
  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all";
  const labelCls = "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5";
  const [err, setErr] = useState("");

  const handleSave = () => {
    if (!form.name || !form.email) { setErr("Name and email are required."); return; }
    if (!isEdit && form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    onSave({ ...form, id: user?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white w-[540px] rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div><h2 className="text-[17px] font-bold text-slate-800">{isEdit ? "Edit User" : "Add User"}</h2><p className="text-[12px] text-slate-400 mt-0.5">{isEdit ? form.email : "Fill in the user details"}</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><X size={14} className="text-slate-500" /></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {err && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[12px] text-rose-600">{err}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Full Name *</label><input value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="e.g. Harsh Patel" className={inputCls} /></div>
            <div><label className={labelCls}>Email *</label><input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="user@company.com" className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Phone</label><input value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} placeholder="+91 98765 43210" className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Role</label><select value={form.role} onChange={e => setForm({...form,role:e.target.value})} className={inputCls}>{["Admin","Sales Manager","Sales Exec","Support Exec"].map(r=><option key={r}>{r}</option>)}</select></div>
            <div><label className={labelCls}>Profile</label><select value={form.profile} onChange={e => setForm({...form,profile:e.target.value})} className={inputCls}>{["Super Admin","Manager","Sales Executive","Support"].map(p=><option key={p}>{p}</option>)}</select></div>
          </div>
          <div><label className={labelCls}>Status</label>
            <div className="flex gap-2">{["Active","Inactive","Invited"].map(s=><button key={s} onClick={()=>setForm({...form,status:s})} className={`px-3 py-1.5 rounded-xl text-[12px] font-medium border-2 transition-all ${form.status===s?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-slate-200 text-slate-500 hover:border-slate-300"}`}>{s}</button>)}</div>
          </div>
          {!isEdit && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div><label className={labelCls}>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" className={inputCls} /></div>
              <div><label className={labelCls}>Confirm Password</label><input type="password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} placeholder="••••••••" className={inputCls} /></div>
            </div>
          )}
        </div>
        <div className="px-5 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium flex items-center justify-center gap-2"><Check size={14}/>{isEdit?"Save Changes":"Add User"}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// USERS TAB
// ─────────────────────────────────────────────────────────

function UsersTab() {
  const { crmUsers, setCrmUsers } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const statuses = ["All","Active","Inactive","Invited","Deleted"];
  const filtered = crmUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const saveUser = (data) => {
    if (editingUser) setCrmUsers(us => us.map(u => u.id === data.id ? data : u));
    else setCrmUsers(us => [...us, data]);
    setShowModal(false); setEditingUser(null);
  };
  const deactivate = (id) => setCrmUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
  const del = (id) => setCrmUsers(us => us.filter(u => u.id !== id));

  return (
    <div className="flex flex-col h-full">
      {/* Actions */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users…" className="pl-9 pr-4 py-2 text-[13px] rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-400 w-full" />
        </div>
        <div className="flex gap-1.5">
          {statuses.map(s => (
            <button key={s} onClick={()=>setStatusFilter(s)} className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all ${statusFilter===s?"bg-indigo-600 text-white":"bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{s}</button>
          ))}
        </div>
        <button onClick={()=>{setEditingUser(null);setShowModal(true);}} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-xl ml-auto shadow-sm transition-all">
          <UserPlus size={14}/> New User
        </button>
      </div>
      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
            <tr>{["User","Email","Role","Profile","Status","Actions"].map(h=><th key={h} className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-[13px]">No users found</td></tr>
            )}
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} size="sm" />
                    <div><p className="text-[13px] font-semibold text-slate-800">{u.name}</p><p className="text-[11px] text-slate-400">{u.phone}</p></div>
                  </div>
                </td>
                <td className="px-6 py-3 text-[13px] text-slate-600">{u.email}</td>
                <td className="px-6 py-3 text-[13px] text-slate-700 font-medium">{u.role}</td>
                <td className="px-6 py-3"><span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{u.profile}</span></td>
                <td className="px-6 py-3"><StatusBadge status={u.status}/></td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>{setEditingUser(u);setShowModal(true);}} title="Edit" className="w-7 h-7 rounded-lg hover:bg-sky-50 hover:text-sky-600 text-slate-400 flex items-center justify-center transition-colors"><Edit3 size={13}/></button>
                    <button onClick={()=>deactivate(u.id)} title={u.status==="Active"?"Deactivate":"Activate"} className="w-7 h-7 rounded-lg hover:bg-amber-50 hover:text-amber-600 text-slate-400 flex items-center justify-center transition-colors"><UserX size={13}/></button>
                    <button onClick={()=>del(u.id)} title="Delete" className="w-7 h-7 rounded-lg hover:bg-rose-50 hover:text-rose-500 text-slate-400 flex items-center justify-center transition-colors"><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <UserModal user={editingUser} onClose={()=>{setShowModal(false);setEditingUser(null);}} onSave={saveUser}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PROFILES TAB
// ─────────────────────────────────────────────────────────

function ProfilePermMatrix({ profile, onSave, onClose }) {
  const [perms, setPerms] = useState({ ...profile.perms });
  const toggle = (mod, perm) => setPerms(p => ({ ...p, [mod]: p[mod]?.includes(perm) ? p[mod].filter(x=>x!==perm) : [...(p[mod]||[]), perm] }));
  const has = (mod, perm) => perms[mod]?.includes(perm);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white w-[680px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div><h2 className="text-[17px] font-bold text-slate-800">Permissions — {profile.name}</h2><p className="text-[12px] text-slate-400 mt-0.5">Check boxes to grant permissions</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><X size={14} className="text-slate-500"/></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-slate-50 rounded-xl">
                <th className="text-left px-3 py-2 text-slate-500 font-semibold uppercase tracking-wider">Module</th>
                {ALL_PERMS.map(p=><th key={p} className={`px-3 py-2 font-semibold uppercase tracking-wider`}><span className={`px-2 py-0.5 rounded-full text-[10px] ${PERM_COLORS[p]}`}>{p}</span></th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ALL_MODULES.map(mod=>(
                <tr key={mod} className="hover:bg-slate-50/50">
                  <td className="px-3 py-2.5 font-medium text-slate-700 capitalize">{mod}</td>
                  {ALL_PERMS.map(perm=>(
                    <td key={perm} className="px-3 py-2.5 text-center">
                      <button onClick={()=>toggle(mod,perm)} className={`w-5 h-5 rounded flex items-center justify-center mx-auto border-2 transition-all ${has(mod,perm)?"bg-indigo-600 border-indigo-600":"border-slate-300 hover:border-indigo-400"}`}>
                        {has(mod,perm)&&<Check size={11} className="text-white"/>}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={()=>onSave({...profile,perms})} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium flex items-center justify-center gap-2"><Check size={14}/> Save Permissions</button>
        </div>
      </div>
    </div>
  );
}

function ProfilesTab() {
  const { profiles, setProfiles } = useContext(AppContext);
  const [editPerms, setEditPerms] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newProfile, setNewProfile] = useState({ name: "", desc: "" });

  const addProfile = () => {
    if (!newProfile.name) return;
    setProfiles(ps => [...ps, { id: Date.now(), ...newProfile, created: new Date().toISOString().split("T")[0], users: 0, perms: {} }]);
    setAddModal(false); setNewProfile({name:"",desc:""});
  };
  const del = (id) => setProfiles(ps => ps.filter(p => p.id !== id));
  const savePerms = (updated) => { setProfiles(ps => ps.map(p => p.id === updated.id ? updated : p)); setEditPerms(null); };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
        <p className="text-[13px] text-slate-500">{profiles.length} profiles</p>
        <button onClick={()=>setAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-xl shadow-sm transition-all"><Plus size={14}/> Add Profile</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
            <tr>{["Profile Name","Description","Created","Users","Actions"].map(h=><th key={h} className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {profiles.map(p=>(
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><ShieldCheck size={15} className="text-indigo-600"/></div>
                    <p className="text-[13px] font-semibold text-slate-800">{p.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-500">{p.desc}</td>
                <td className="px-6 py-4 text-[12px] text-slate-400">{fmtDate(p.created)}</td>
                <td className="px-6 py-4"><span className="text-[12px] font-medium text-slate-700">{p.users} user{p.users!==1?"s":""}</span></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>setEditPerms(p)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-medium transition-colors"><Shield size={11}/>Permissions</button>
                    <button onClick={()=>del(p.id)} className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center transition-colors"><Trash2 size={13} className="text-slate-400 hover:text-rose-500"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editPerms && <ProfilePermMatrix profile={editPerms} onSave={savePerms} onClose={()=>setEditPerms(null)}/>}
      {addModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white w-[400px] rounded-2xl shadow-2xl">
            <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-slate-800">Add Profile</h2>
              <button onClick={()=>setAddModal(false)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center"><X size={13}/></button>
            </div>
            <div className="p-5 space-y-3">
              <div><label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Profile Name</label><input value={newProfile.name} onChange={e=>setNewProfile({...newProfile,name:e.target.value})} placeholder="e.g. Field Agent" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400"/></div>
              <div><label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Description</label><input value={newProfile.desc} onChange={e=>setNewProfile({...newProfile,desc:e.target.value})} placeholder="Brief description" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400"/></div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button onClick={()=>setAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium">Cancel</button>
              <button onClick={addProfile} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-medium">Add Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ROLES TAB
// ─────────────────────────────────────────────────────────

function RolesTab() {
  const { roles, setRoles } = useContext(AppContext);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ name:"", level:"4", parent:"Manager", profile:"Sales Executive" });

  const addRole = () => {
    if (!form.name) return;
    setRoles(rs => [...rs, { id: Date.now(), ...form, level: Number(form.level), users: 0 }]);
    setAddModal(false); setForm({name:"",level:"4",parent:"Manager",profile:"Sales Executive"});
  };
  const del = (id) => setRoles(rs => rs.filter(r => r.id !== id));
  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400";
  const labelCls = "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5";

  const levelColors = { 1:"bg-rose-50 text-rose-600", 2:"bg-orange-50 text-orange-600", 3:"bg-amber-50 text-amber-600", 4:"bg-sky-50 text-sky-600", 5:"bg-slate-100 text-slate-500" };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
        <p className="text-[13px] text-slate-500">{roles.length} roles defined</p>
        <button onClick={()=>setAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-xl shadow-sm"><Plus size={14}/> Add Role</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
            <tr>{["Role Name","Level","Parent Role","Profile","Users","Actions"].map(h=><th key={h} className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {roles.map(r=>(
              <tr key={r.id} className="hover:bg-slate-50/50 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center"><Star size={13} className="text-slate-500"/></div>
                    <p className="text-[13px] font-semibold text-slate-800">{r.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4"><span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${levelColors[r.level]||"bg-slate-100 text-slate-500"}`}>L{r.level}</span></td>
                <td className="px-6 py-4 text-[13px] text-slate-500">{r.parent}</td>
                <td className="px-6 py-4"><span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{r.profile}</span></td>
                <td className="px-6 py-4 text-[13px] text-slate-700 font-medium">{r.users}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded-lg hover:bg-sky-50 flex items-center justify-center"><Edit3 size={12} className="text-slate-400 hover:text-sky-600"/></button>
                    <button onClick={()=>del(r.id)} className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center"><Trash2 size={12} className="text-slate-400 hover:text-rose-500"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white w-[420px] rounded-2xl shadow-2xl">
            <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-slate-800">Add Role</h2>
              <button onClick={()=>setAddModal(false)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center"><X size={13}/></button>
            </div>
            <div className="p-5 space-y-3">
              <div><label className={labelCls}>Role Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Field Agent" className={inputCls}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Level</label><input type="number" min="1" max="10" value={form.level} onChange={e=>setForm({...form,level:e.target.value})} className={inputCls}/></div>
                <div><label className={labelCls}>Parent Role</label><select value={form.parent} onChange={e=>setForm({...form,parent:e.target.value})} className={inputCls}>{roles.map(r=><option key={r.id}>{r.name}</option>)}</select></div>
              </div>
              <div><label className={labelCls}>Assign Profile</label><select value={form.profile} onChange={e=>setForm({...form,profile:e.target.value})} className={inputCls}>{["Super Admin","Manager","Sales Executive","Support"].map(p=><option key={p}>{p}</option>)}</select></div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button onClick={()=>setAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium">Cancel</button>
              <button onClick={addRole} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-medium">Add Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// COMPLIANCE TAB
// ─────────────────────────────────────────────────────────

function ComplianceTab() {
  const [policies, setPolicies] = useState({ minPassLen: 8, specialChar: true, passExpiry: 90, twoFA: false, maxLoginAttempts: 5, sessionTimeout: 30, deviceRestrictions: false });
  const [auditFilter, setAuditFilter] = useState({ user: "", module: "" });

  const Toggle = ({ value, onChange }) => (
    <button onClick={()=>onChange(!value)} className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${value?"bg-indigo-500":"bg-slate-200"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value?"translate-x-5":"translate-x-0.5"}`}/>
    </button>
  );

  const SRow = ({ label, children }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <p className="text-[13px] text-slate-700">{label}</p>
      {children}
    </div>
  );

  const filteredLogs = AUDIT_LOGS.filter(l =>
    (!auditFilter.user || l.user.toLowerCase().includes(auditFilter.user.toLowerCase())) &&
    (!auditFilter.module || l.module.toLowerCase().includes(auditFilter.module.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-6 space-y-5">
        {/* Password Policies */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4"><Lock size={15} className="text-indigo-600"/><h3 className="text-[14px] font-bold text-slate-800">Password Policies</h3></div>
          <SRow label="Minimum Password Length">
            <input type="number" min="6" max="32" value={policies.minPassLen} onChange={e=>setPolicies({...policies,minPassLen:Number(e.target.value)})} className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-[13px] text-center outline-none focus:border-indigo-400"/>
          </SRow>
          <SRow label="Special Character Required"><Toggle value={policies.specialChar} onChange={v=>setPolicies({...policies,specialChar:v})}/></SRow>
          <SRow label="Password Expiry (days)">
            <input type="number" min="0" value={policies.passExpiry} onChange={e=>setPolicies({...policies,passExpiry:Number(e.target.value)})} className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-[13px] text-center outline-none focus:border-indigo-400"/>
          </SRow>
          <SRow label="Two-Factor Authentication"><Toggle value={policies.twoFA} onChange={v=>setPolicies({...policies,twoFA:v})}/></SRow>
        </div>

        {/* Login Policies */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4"><ShieldCheck size={15} className="text-indigo-600"/><h3 className="text-[14px] font-bold text-slate-800">Login Policies</h3></div>
          <SRow label="Max Login Attempts">
            <input type="number" min="1" max="20" value={policies.maxLoginAttempts} onChange={e=>setPolicies({...policies,maxLoginAttempts:Number(e.target.value)})} className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-[13px] text-center outline-none focus:border-indigo-400"/>
          </SRow>
          <SRow label="Session Timeout (minutes)">
            <input type="number" min="5" value={policies.sessionTimeout} onChange={e=>setPolicies({...policies,sessionTimeout:Number(e.target.value)})} className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-[13px] text-center outline-none focus:border-indigo-400"/>
          </SRow>
          <SRow label="Device Restrictions"><Toggle value={policies.deviceRestrictions} onChange={v=>setPolicies({...policies,deviceRestrictions:v})}/></SRow>
        </div>

        {/* Audit Logs */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2"><Activity size={15} className="text-indigo-600"/><h3 className="text-[14px] font-bold text-slate-800">Audit Logs</h3></div>
            <div className="flex gap-2">
              <input placeholder="Filter by user…" value={auditFilter.user} onChange={e=>setAuditFilter({...auditFilter,user:e.target.value})} className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12px] outline-none focus:border-indigo-400 w-36"/>
              <input placeholder="Filter by module…" value={auditFilter.module} onChange={e=>setAuditFilter({...auditFilter,module:e.target.value})} className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12px] outline-none focus:border-indigo-400 w-36"/>
            </div>
          </div>
          <table className="w-full text-[12px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["User","Action","Module","Date","IP Address"].map(h=><th key={h} className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-2.5 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map(l=>(
                <tr key={l.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-2.5 font-medium text-slate-700">{l.user}</td>
                  <td className="px-5 py-2.5 text-slate-600">{l.action}</td>
                  <td className="px-5 py-2.5"><span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{l.module}</span></td>
                  <td className="px-5 py-2.5 text-slate-400">{l.date}</td>
                  <td className="px-5 py-2.5 font-mono text-slate-400">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-200"><Check size={14}/> Save Compliance Settings</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// USERS & CONTROLS PAGE
// ─────────────────────────────────────────────────────────

function UsersAndControlsPage() {
  const [activeTab, setActiveTab] = useState("users");
  const tabs = [
    { id: "users",      label: "Users"      },
    { id: "profiles",   label: "Profiles"   },
    { id: "roles",      label: "Roles"      },
    { id: "compliance", label: "Compliance" },
  ];
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SectionHeader title="Users and Controls" subtitle="Manage team members, roles, profiles and compliance" action={undefined} />
      <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        {activeTab === "users"      && <UsersTab />}
        {activeTab === "profiles"   && <ProfilesTab />}
        {activeTab === "roles"      && <RolesTab />}
        {activeTab === "compliance" && <ComplianceTab />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PLACEHOLDER SETTINGS PAGES
// ─────────────────────────────────────────────────────────

function PlaceholderPage({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SectionHeader title={title} subtitle={desc} action={undefined} />
      <div className="flex-1 flex items-center justify-center">
        <EmptyState icon={Icon} title={`${title} settings`} desc="This module is coming soon. Stay tuned!" action={undefined} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SETTINGS SIDEBAR
// ─────────────────────────────────────────────────────────

function SettingsSidebar({ active, onChange, collapsed, onToggle }) {
  const [expanded, setExpanded] = useState({ channels: true });

  const toggleSection = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className={`flex flex-col bg-white border-r border-slate-100 transition-all duration-200 flex-shrink-0 ${collapsed ? "w-16" : "w-60"} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 flex-shrink-0">
        {!collapsed && <p className="text-[13px] font-bold text-slate-800">Settings</p>}
        <button onClick={onToggle} className={`w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-colors ${collapsed?"mx-auto":""}`}>
          {collapsed ? <ChevronRight size={14} className="text-slate-500"/> : <ChevronLeft size={14} className="text-slate-500"/>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {SETTINGS_SECTIONS.map(section => (
          <div key={section.id}>
            {section.hasChildren ? (
              <>
                <button onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${collapsed?"justify-center":""}`}>
                  <section.icon size={16} className="text-slate-500 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-[13px] font-medium text-slate-600">{section.label}</span>
                      <ChevronDown size={12} className={`text-slate-400 transition-transform ${expanded[section.id]?"rotate-180":""}`} />
                    </>
                  )}
                </button>
                {!collapsed && expanded[section.id] && section.children?.map(child => (
                  <button key={child.id} onClick={() => onChange(child.id)}
                    className={`w-full flex items-center gap-3 pl-10 pr-4 py-2 text-left transition-colors ${active === child.id ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-50 text-slate-500"}`}>
                    <child.icon size={14} className="flex-shrink-0" />
                    <span className="text-[12px] font-medium">{child.label}</span>
                  </button>
                ))}
              </>
            ) : (
              <button onClick={() => onChange(section.id)}
                title={collapsed ? section.label : undefined}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${active === section.id ? "bg-indigo-50 border-r-2 border-indigo-600" : "hover:bg-slate-50"} ${collapsed?"justify-center":""}`}>
                <section.icon size={16} className={`flex-shrink-0 ${active === section.id ? "text-indigo-600" : "text-slate-500"}`} />
                {!collapsed && <span className={`text-[13px] font-medium ${active === section.id ? "text-indigo-700" : "text-slate-600"}`}>{section.label}</span>}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SETTINGS PAGE
// ─────────────────────────────────────────────────────────

function SettingsPage({ onBack }: { onBack: () => void }) {
  const [activeSection, setActiveSection] = useState("users");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "users":            return <UsersAndControlsPage />;
      case "org":              return <PlaceholderPage icon={Building2}  title="Organization"        desc="Configure your organization settings" />;
      case "fields":           return <PlaceholderPage icon={FileText}   title="Fields"              desc="Manage custom field definitions" />;
      case "stages":           return <PlaceholderPage icon={Layers}     title="Stages"              desc="Configure pipeline stages" />;
      case "forms":            return <PlaceholderPage icon={FileText}   title="Forms"               desc="Build and manage web forms" />;
      case "automation":       return <PlaceholderPage icon={Zap}        title="Automation"          desc="Create workflows and automation rules" />;
      case "data":             return <PlaceholderPage icon={Database}   title="Data Administration" desc="Import, export and manage your data" />;
      case "toppings":         return <PlaceholderPage icon={Sliders}    title="Toppings"            desc="Extra configurations and integrations" />;
      case "trial":            return <PlaceholderPage icon={Gift}       title="Free Trial"          desc="Manage your trial and subscription" />;
      case "channels-email":   return <PlaceholderPage icon={Mail}       title="Email Channel"       desc="Configure email sending and templates" />;
      case "channels-messages":return <PlaceholderPage icon={MessageSquare} title="Messages"        desc="Configure SMS and chat messages" />;
      case "channels-phone":   return <PlaceholderPage icon={PhoneCall}  title="Phone Channel"       desc="Configure call center and phone settings" />;
      case "channels-social":  return <PlaceholderPage icon={Globe}      title="Social Channels"     desc="Connect Facebook, Instagram and more" />;
      default:                 return <UsersAndControlsPage />;
    }
  };

  return (
    <div className="h-screen bg-[#F7F8FC] flex flex-col overflow-hidden font-sans">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-100 px-6 flex items-center gap-4 flex-shrink-0" style={{ height: 68 }}>
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
          <ChevronLeft size={18}/><span className="text-[13px] font-medium">Back to Leads</span>
        </button>
        <div className="w-px h-5 bg-slate-200"/>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center"><Settings size={14} className="text-white"/></div>
          <h1 className="text-[16px] font-bold text-slate-800">Settings</h1>
        </div>
      </header>
      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <SettingsSidebar active={activeSection} onChange={setActiveSection} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />
        <main className="flex-1 overflow-hidden flex flex-col bg-[#F7F8FC]">
          <div className="flex-1 overflow-hidden bg-white m-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ORIGINAL CRM COMPONENTS (kept intact)
// ─────────────────────────────────────────────────────────

function TypePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = FIELD_TYPE_OPTIONS.find(f => f.type === value);
  const Icon = current.icon;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(p => !p)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 text-[12px] font-medium text-slate-600 transition-all whitespace-nowrap">
        <Icon size={12} className="text-indigo-500 flex-shrink-0" />{current.label}<ChevronDown size={11} className={`ml-0.5 text-slate-400 transition-transform ${open?"rotate-180":""}`}/>
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-[60] bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 w-[210px]">
          {FIELD_TYPE_OPTIONS.map(({ type, label, icon: FIcon, desc }) => (
            <button key={type} type="button" onClick={() => { onChange(type); setOpen(false); }} className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors ${value === type ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-700"}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${value === type ? "bg-indigo-100" : "bg-slate-100"}`}><FIcon size={13} className={value === type ? "text-indigo-600" : "text-slate-500"} /></div>
              <div className="min-w-0"><p className="text-[12px] font-medium leading-tight">{label}</p><p className="text-[10px] text-slate-400">{desc}</p></div>
              {value === type && <Check size={12} className="ml-auto text-indigo-500 flex-shrink-0"/>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldDefRow({ field, onUpdate, onDelete }) {
  const [newOpt, setNewOpt] = useState("");
  return (
    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2.5">
      <div className="flex items-center gap-2">
        <GripVertical size={14} className="text-slate-300 flex-shrink-0 cursor-grab"/>
        <input placeholder="Field label…" value={field.label} onChange={e => onUpdate({...field,label:e.target.value})} className="flex-1 min-w-0 text-[13px] font-medium bg-transparent outline-none text-slate-700 placeholder:text-slate-300"/>
        <TypePicker value={field.type} onChange={t => onUpdate({...field,type:t,options:t==="select"?["Option 1"]:undefined})}/>
        <button type="button" onClick={onDelete} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:border-rose-300 hover:bg-rose-50 transition-colors flex-shrink-0"><Trash2 size={12} className="text-slate-400"/></button>
      </div>
      {field.type === "select" && (
        <div className="pl-5 space-y-1.5">
          {(field.options||[]).map((opt,i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0"/>
              <input value={opt} onChange={e => { const opts=[...(field.options||[])];opts[i]=e.target.value;onUpdate({...field,options:opts}); }} className="flex-1 text-[12px] bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300"/>
              <button type="button" onClick={() => onUpdate({...field,options:(field.options||[]).filter((_,j)=>j!==i)})} className="text-slate-300 hover:text-rose-400"><X size={11}/></button>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <input placeholder="New option…" value={newOpt} onChange={e => setNewOpt(e.target.value)} onKeyDown={e => { if(e.key==="Enter"&&newOpt.trim()){onUpdate({...field,options:[...(field.options||[]),newOpt.trim()]});setNewOpt("");} }} className="flex-1 text-[12px] bg-white border border-dashed border-slate-300 rounded-lg px-2 py-1 outline-none focus:border-indigo-300"/>
            <button type="button" onClick={() => { if(newOpt.trim()){onUpdate({...field,options:[...(field.options||[]),newOpt.trim()]});setNewOpt(""); } }} className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium">+ Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomFieldInput({ field, value, onChange }) {
  const base = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all bg-white";
  switch(field.type) {
    case "textarea": return <textarea rows={2} placeholder={`Enter ${field.label||"value"}…`} value={value||""} onChange={e=>onChange(e.target.value)} className={base+" resize-none"}/>;
    case "number":   return <input type="number" placeholder="0" value={value||""} onChange={e=>onChange(e.target.value)} className={base}/>;
    case "date":     return <input type="date" value={value||""} onChange={e=>onChange(e.target.value)} className={base}/>;
    case "boolean":  return (
      <div className="flex items-center gap-3 py-1">
        <button type="button" onClick={()=>onChange(!value)} className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${value?"bg-indigo-500":"bg-slate-200"}`}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value?"translate-x-5":"translate-x-0.5"}`}/>
        </button>
        <span className="text-[13px] text-slate-600">{value?"Yes":"No"}</span>
      </div>
    );
    case "select": return (
      <select value={value||""} onChange={e=>onChange(e.target.value)} className={base}>
        <option value="">Select…</option>
        {(field.options||[]).map(o=><option key={o}>{o}</option>)}
      </select>
    );
    default: return <input type={field.type==="email"?"email":field.type==="url"?"url":"text"} placeholder={`Enter ${field.label||"value"}…`} value={value||""} onChange={e=>onChange(e.target.value)} className={base}/>;
  }
}

function StageManagerPanel({ stages, setStages }) {
  return (
    <div className="p-5 space-y-3 max-h-[420px] overflow-y-auto">
      <div className="mb-1"><p className="text-[13px] font-semibold text-slate-700">Manage Pipeline Stages</p><p className="text-[11px] text-slate-400 mt-0.5">Rename, recolor, add or remove stages</p></div>
      {stages.map(s => (
        <div key={s.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
          <GripVertical size={14} className="text-slate-300 cursor-grab flex-shrink-0"/>
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{background:s.color}}/>
          <input value={s.label} onChange={e=>setStages(stages.map(x=>x.id===s.id?{...x,label:e.target.value}:x))} className="flex-1 min-w-0 text-[13px] font-medium bg-transparent outline-none text-slate-700"/>
          <div className="flex gap-1">{STAGE_PALETTE.map((p,i)=><button key={i} type="button" onClick={()=>setStages(stages.map(x=>x.id===s.id?{...x,...p}:x))} className="w-4 h-4 rounded-full border-2 transition-all flex-shrink-0" style={{background:p.color,borderColor:s.color===p.color?"#1e293b":"transparent"}}/>)}</div>
          {stages.length > 2 && <button type="button" onClick={()=>setStages(stages.filter(x=>x.id!==s.id))} className="w-6 h-6 rounded-lg hover:bg-rose-100 flex items-center justify-center transition-colors flex-shrink-0"><Trash2 size={12} className="text-slate-400 hover:text-rose-500"/></button>}
        </div>
      ))}
      <button type="button" onClick={()=>{const usedColors=stages.map(s=>s.color);const nextPalette=STAGE_PALETTE.find(p=>!usedColors.includes(p.color))||STAGE_PALETTE[0];setStages([...stages,{id:uid(),label:"New Stage",...nextPalette}]);}} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-[13px] font-medium text-slate-500 hover:text-indigo-600 transition-all"><Plus size={14}/> Add New Stage</button>
      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl"><p className="text-[11px] text-amber-700 leading-relaxed"><strong>Note:</strong> Stage changes apply globally. Leads in a removed stage stay there until manually moved.</p></div>
    </div>
  );
}

function NewLeadModal({ onClose, onSave, stages, setStages, customFields, setCustomFields, defaultStage }) {
  const [tab, setTab] = useState("form");
  const [showFieldPicker, setShowFieldPicker] = useState(false);
  const [form, setForm] = useState({ name:"", company:"", phone:"", value:"", tag:"Warm", stage:defaultStage||stages[0]?.id||"new" });
  const [customValues, setCustomValues] = useState({});
  const updateFieldDef = (id, updated) => setCustomFields(customFields.map(f => f.id===id?updated:f));
  const deleteFieldDef = (id) => setCustomFields(customFields.filter(f => f.id!==id));
  const addFieldDef = (type) => { setCustomFields([...customFields,{id:uid(),label:"",type,options:type==="select"?["Option 1"]:undefined}]); setShowFieldPicker(false); setTab("form"); };
  const handleSave = () => { if(!form.name||!form.phone)return; onSave({name:form.name,company:form.company,phone:form.phone,value:Number(form.value)||0,tag:form.tag,stage:form.stage,owner:"You",probability:20,aging:0,customValues}); };
  const tabCls = t => `px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all ${tab===t?"bg-indigo-600 text-white shadow-sm":"text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`;
  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all";
  const labelCls = "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5";
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-2xl shadow-2xl overflow-visible flex flex-col max-h-[90vh]">
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-4"><div><h2 className="text-[18px] font-bold text-slate-800">New Lead</h2><p className="text-[12px] text-slate-400 mt-0.5">Fill in the details below</p></div><button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X size={15} className="text-slate-500"/></button></div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button className={tabCls("form")} onClick={()=>setTab("form")}>Form</button>
            <button className={tabCls("fields")} onClick={()=>setTab("fields")}><span className="flex items-center gap-1.5"><Settings2 size={11}/>Custom Fields{customFields.length>0&&<span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center">{customFields.length}</span>}</span></button>
            <button className={tabCls("stages")} onClick={()=>setTab("stages")}>Stages</button>
          </div>
        </div>
        {tab==="form" && (
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Lead Name *</label><input placeholder="e.g. Rahul Mehta" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={inputCls}/></div>
              <div><label className={labelCls}>Company</label><input placeholder="e.g. Acme Ltd" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} className={inputCls}/></div>
            </div>
            <div><label className={labelCls}>Phone *</label><input placeholder="+91 98765 43210" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className={inputCls}/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Deal Value (₹)</label><input type="number" placeholder="e.g. 150000" value={form.value} onChange={e=>setForm({...form,value:e.target.value})} className={inputCls}/></div>
              <div><label className={labelCls}>Lead Tag</label><select value={form.tag} onChange={e=>setForm({...form,tag:e.target.value})} className={inputCls}>{["Hot","Warm","Cold"].map(t=><option key={t}>{t}</option>)}</select></div>
            </div>
            <div><label className={labelCls}>Stage</label><div className="flex flex-wrap gap-2">{stages.map(s=><button key={s.id} type="button" onClick={()=>setForm({...form,stage:s.id})} className="px-3 py-1.5 rounded-xl text-[12px] font-semibold border-2 transition-all" style={form.stage===s.id?{background:s.color,borderColor:s.color,color:"#fff"}:{background:"#fff",borderColor:"#e2e8f0",color:"#64748b"}}>{s.label}</button>)}<button type="button" onClick={()=>setTab("stages")} className="px-3 py-1.5 rounded-xl text-[12px] font-medium border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center gap-1"><Plus size={11}/> Stage</button></div></div>
            {customFields.length>0 && <div className="space-y-3 pt-2 border-t border-slate-100"><p className={labelCls}>Custom Fields</p>{customFields.map(field=><div key={field.id}><label className={labelCls}>{field.label||<span className="italic text-slate-300">Unnamed field</span>}</label><CustomFieldInput field={field} value={customValues[field.id]} onChange={v=>setCustomValues({...customValues,[field.id]:v})}/></div>)}</div>}
            <button type="button" onClick={()=>setTab("fields")} className="flex items-center gap-1.5 text-[12px] text-indigo-500 hover:text-indigo-700 font-medium transition-colors"><Plus size={13}/> Add custom field</button>
          </div>
        )}
        {tab==="fields" && (
          <div className="p-5 overflow-y-auto flex-1">
            <div className="mb-4"><p className="text-[13px] font-semibold text-slate-700">Custom Fields</p><p className="text-[11px] text-slate-400 mt-0.5">Define extra data types to capture with every lead</p></div>
            <div className="space-y-2 mb-4">
              {customFields.length===0&&<div className="text-center py-10 text-slate-300"><Settings2 size={30} className="mx-auto mb-2 opacity-40"/><p className="text-[12px]">No custom fields yet</p></div>}
              {customFields.map(field=><FieldDefRow key={field.id} field={field} onUpdate={f=>updateFieldDef(field.id,f)} onDelete={()=>deleteFieldDef(field.id)}/>)}
            </div>
            <div className="relative">
              <button type="button" onClick={()=>setShowFieldPicker(p=>!p)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-[13px] font-medium text-slate-500 hover:text-indigo-600 transition-all"><Plus size={14}/> Add Field</button>
              {showFieldPicker && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-[60]">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2 px-1">Choose data type</p>
                  <div className="grid grid-cols-3 gap-1.5">{FIELD_TYPE_OPTIONS.map(({type,label,icon:Icon})=><button key={type} type="button" onClick={()=>addFieldDef(type)} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"><div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors"><Icon size={15} className="text-slate-500 group-hover:text-indigo-600"/></div><span className="text-[11px] font-medium text-slate-600 group-hover:text-indigo-700 leading-tight text-center">{label}</span></button>)}</div>
                </div>
              )}
            </div>
          </div>
        )}
        {tab==="stages" && <div className="overflow-y-auto flex-1"><StageManagerPanel stages={stages} setStages={setStages}/></div>}
        <div className="px-5 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={handleSave} disabled={!form.name||!form.phone} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2"><Plus size={14}/> Create Lead</button>
        </div>
      </div>
    </div>
  );
}

function EditLeadModal({ lead, stages, customFields, onClose, onSave }) {
  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all";
  const labelCls = "text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5";
  const [form, setForm] = useState({name:lead.name,company:lead.company,phone:lead.phone,value:String(lead.value),tag:lead.tag,stage:lead.stage,owner:lead.owner,probability:String(lead.probability)});
  const [customValues, setCustomValues] = useState(lead.customValues||{});
  const handleSave = () => { if(!form.name||!form.phone)return; onSave({...lead,name:form.name,company:form.company,phone:form.phone,value:Number(form.value)||0,tag:form.tag,stage:form.stage,owner:form.owner,probability:Math.min(100,Math.max(0,Number(form.probability)||0)),customValues}); };
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0 flex items-center justify-between"><div><h2 className="text-[18px] font-bold text-slate-800">Edit Lead</h2><p className="text-[12px] text-slate-400 mt-0.5">{lead.name}</p></div><button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X size={15} className="text-slate-500"/></button></div>
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3"><div><label className={labelCls}>Lead Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={inputCls}/></div><div><label className={labelCls}>Company</label><input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} className={inputCls}/></div></div>
          <div><label className={labelCls}>Phone *</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className={inputCls}/></div>
          <div className="grid grid-cols-2 gap-3"><div><label className={labelCls}>Deal Value (₹)</label><input type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})} className={inputCls}/></div><div><label className={labelCls}>Owner</label><input value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})} className={inputCls}/></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className={labelCls}>Win Probability (%)</label><input type="number" min="0" max="100" value={form.probability} onChange={e=>setForm({...form,probability:e.target.value})} className={inputCls}/></div><div><label className={labelCls}>Lead Tag</label><select value={form.tag} onChange={e=>setForm({...form,tag:e.target.value})} className={inputCls}>{["Hot","Warm","Cold","Closed"].map(t=><option key={t}>{t}</option>)}</select></div></div>
          <div><label className={labelCls}>Stage</label><div className="flex flex-wrap gap-2">{stages.map(s=><button key={s.id} type="button" onClick={()=>setForm({...form,stage:s.id})} className="px-3 py-1.5 rounded-xl text-[12px] font-semibold border-2 transition-all" style={form.stage===s.id?{background:s.color,borderColor:s.color,color:"#fff"}:{background:"#fff",borderColor:"#e2e8f0",color:"#64748b"}}>{s.label}</button>)}</div></div>
          {customFields.length>0 && <div className="space-y-3 pt-2 border-t border-slate-100"><p className={labelCls}>Custom Fields</p>{customFields.map(field=><div key={field.id}><label className={labelCls}>{field.label||<span className="italic text-slate-300">Unnamed field</span>}</label><CustomFieldInput field={field} value={customValues[field.id]} onChange={v=>setCustomValues({...customValues,[field.id]:v})}/></div>)}</div>}
        </div>
        <div className="px-5 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0"><button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50">Cancel</button><button type="button" onClick={handleSave} disabled={!form.name||!form.phone} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2"><Check size={14}/> Save Changes</button></div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ lead, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-2xl shadow-2xl flex flex-col">
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"><AlertTriangle size={15} className="text-rose-500"/></div><h2 className="text-[16px] font-bold text-slate-800">Delete Lead</h2></div><button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X size={15} className="text-slate-500"/></button></div>
        <div className="p-6"><div className="p-4 bg-rose-50 border border-rose-100 rounded-xl mb-4"><p className="text-[13px] text-rose-700 leading-relaxed"><strong>{lead.name}</strong> ({lead.company}) will be permanently deleted. This action cannot be undone.</p></div><p className="text-[13px] text-slate-500">Deal value of <strong>{formatVal(lead.value)}</strong> will be removed from your pipeline.</p></div>
        <div className="px-5 py-4 border-t border-slate-100 flex gap-3"><button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50">Cancel</button><button type="button" onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-medium transition-all flex items-center justify-center gap-2"><Trash2 size={14}/> Delete Lead</button></div>
      </div>
    </div>
  );
}

function DeleteStageModal({ stage, leadCount, leadValue, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center"><Trash2 size={16} className="text-rose-500"/></div><div><h2 className="text-[16px] font-bold text-slate-800">Delete Stage?</h2><p className="text-[12px] text-slate-400 mt-0.5">This action cannot be undone</p></div></div><button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X size={14} className="text-slate-500"/></button></div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"><span className="w-3 h-3 rounded-full flex-shrink-0" style={{background:stage.color}}/><span className="text-[14px] font-semibold text-slate-700">{stage.label}</span><span className="ml-auto text-[12px] text-slate-400">{leadCount} lead{leadCount!==1?"s":""}</span></div>
          {leadCount>0 ? (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl"><AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5"/><div><p className="text-[13px] font-semibold text-amber-800 leading-tight mb-1">This stage has {leadCount} lead{leadCount!==1?"s":""}</p><p className="text-[12px] text-amber-700 leading-relaxed">Pipeline value of <strong>{formatVal(leadValue)}</strong> will be lost. All leads in this stage will be permanently deleted.</p></div></div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl"><Check size={15} className="text-slate-400 flex-shrink-0 mt-0.5"/><p className="text-[13px] text-slate-500">This stage is empty. It will be safely removed from your pipeline.</p></div>
          )}
        </div>
        <div className="px-5 pb-5 flex gap-3"><button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50">Cancel</button><button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-100"><Trash2 size={13}/> Delete Stage</button></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LEADS PAGE (original, with Settings + Bell added)
// ─────────────────────────────────────────────────────────

function LeadsPage({ onOpenSettings }) {
  const { leads, setLeads, stages, setStages, customFields, setCustomFields, notifications } = useContext(AppContext);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newLeadDefaultStage, setNewLeadDefaultStage] = useState(undefined);
  const [deletingStage, setDeletingStage] = useState(null);
  const [hoveredColId, setHoveredColId] = useState(null);
  const [search, setSearch] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);
  const { setNotifications } = useContext(AppContext);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase()));
  const totalValue = leads.reduce((s,l) => s+l.value, 0);
  const wonStageId = stages.find(s => s.label.toLowerCase()==="won")?.id;
  const wonValue = leads.filter(l => l.stage===wonStageId).reduce((s,l) => s+l.value, 0);
  const hotLeads = leads.filter(l => l.tag==="Hot").length;

  const onDragStart = (e, id) => { e.dataTransfer.setData("id",String(id)); setDraggingId(id); };
  const onDragEnd = () => setDraggingId(null);
  const onDrop = (e, stageId) => { const id=e.dataTransfer.getData("id"); setLeads(prev=>prev.map(l=>l.id===Number(id)?{...l,stage:stageId}:l)); setDraggingId(null); };
  const handleCreateLead = data => { setLeads([...leads,{...data,id:Date.now()}]); setShowModal(false); };
  const handleEditSave = updated => { setLeads(prev=>prev.map(l=>l.id===updated.id?updated:l)); if(selectedLead?.id===updated.id)setSelectedLead(updated); setEditingLead(null); };
  const handleDeleteConfirm = () => { if(!deletingLead)return; setLeads(prev=>prev.filter(l=>l.id!==deletingLead.id)); if(selectedLead?.id===deletingLead.id)setSelectedLead(null); setDeletingLead(null); };
  const moveLead = (leadId, newStageId) => { setLeads(prev=>prev.map(l=>l.id===leadId?{...l,stage:newStageId}:l)); setSelectedLead(prev=>prev?{...prev,stage:newStageId}:prev); };
  const getStageById = id => stages.find(s => s.id===id);
  const openNewLead = defaultStage => { setNewLeadDefaultStage(defaultStage); setShowModal(true); };
  const handleDeleteStage = () => { if(!deletingStage)return; setLeads(prev=>prev.filter(l=>l.stage!==deletingStage.id)); setStages(stages.filter(s=>s.id!==deletingStage.id)); if(selectedLead&&selectedLead.stage===deletingStage.id)setSelectedLead(null); setDeletingStage(null); };

  return (
    <div className="h-screen bg-[#F7F8FC] flex flex-col overflow-hidden font-sans">
      {/* TOPBAR */}
      <header className="bg-white border-b border-slate-100 px-8 flex items-center justify-between flex-shrink-0" style={{height:68}}>
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200"><Target size={18} className="text-white"/></div>
          <div><h1 className="text-[17px] font-semibold text-slate-800 tracking-tight leading-none">Leads Pipeline</h1><p className="text-[12px] text-slate-400 mt-0.5">Drag cards to update stages</p></div>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search leads…" className="pl-9 pr-4 py-2 text-[13px] rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 w-[200px] transition-all"/>
          </div>
          {/* Bell */}
          <div className="relative" ref={notifRef}>
            <button onClick={()=>setShowNotifs(p=>!p)} className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 flex items-center justify-center transition-all">
              <Bell size={16} className={showNotifs?"text-indigo-600":"text-slate-500"}/>
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>}
            </button>
            {showNotifs && <NotificationPanel onClose={()=>setShowNotifs(false)}/>}
          </div>
          {/* Settings */}
          <button onClick={onOpenSettings} className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 flex items-center justify-center transition-all" title="Settings">
            <Settings size={16} className="text-slate-500 hover:text-indigo-600"/>
          </button>
          {/* New Lead */}
          <button onClick={()=>openNewLead()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium px-4 py-2 rounded-xl shadow-sm shadow-indigo-200 transition-all">
            <Plus size={15}/> New Lead
          </button>
        </div>
      </header>

      {/* STATS BAR */}
      <div className="flex gap-4 px-8 py-3 bg-white border-b border-slate-100 flex-shrink-0">
        {[
          {icon:Users,      label:"Total Leads",    value:leads.length,        sub:`${filteredLeads.length} shown`, color:"text-indigo-500 bg-indigo-50"},
          {icon:DollarSign, label:"Pipeline Value",  value:formatVal(totalValue), sub:"total value",                 color:"text-sky-500 bg-sky-50"},
          {icon:TrendingUp, label:"Won Revenue",     value:formatVal(wonValue),   sub:"closed deals",                color:"text-emerald-500 bg-emerald-50"},
          {icon:Flame,      label:"Hot Leads",       value:hotLeads,              sub:"need follow-up",              color:"text-rose-500 bg-rose-50"},
        ].map(({icon:Icon,label,value,sub,color})=>(
          <div key={label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 flex-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}><Icon size={15}/></div>
            <div><p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">{label}</p><p className="text-[16px] font-semibold text-slate-800 leading-tight">{value}</p></div>
            <p className="text-[11px] text-slate-400 ml-auto">{sub}</p>
          </div>
        ))}
      </div>

      {/* KANBAN */}
      <div className="flex gap-5 px-8 py-5 overflow-x-auto flex-1 min-h-0">
        {stages.map(stage => {
          const colLeads = filteredLeads.filter(l => l.stage===stage.id);
          const colValue = colLeads.reduce((s,l) => s+l.value, 0);
          const isHovered = hoveredColId===stage.id;
          return (
            <div key={stage.id} onDragOver={e=>e.preventDefault()} onDrop={e=>onDrop(e,stage.id)} className="min-w-[295px] max-w-[295px] flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex-shrink-0 relative" onMouseEnter={()=>setHoveredColId(stage.id)} onMouseLeave={()=>setHoveredColId(null)}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{background:stage.color}}/>
                    <h2 className="font-semibold text-[14px] text-slate-700">{stage.label}</h2>
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">{colLeads.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {stages.length>2 && <button onClick={()=>setDeletingStage(stage)} title="Delete stage" className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-150 ${isHovered?"opacity-100 bg-rose-50 border border-rose-200 hover:bg-rose-100":"opacity-0 pointer-events-none"}`}><Trash2 size={12} className="text-rose-400"/></button>}
                    <button onClick={()=>openNewLead(stage.id)} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><Plus size={13} className="text-slate-500"/></button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">₹{(colValue/1000).toFixed(0)}K pipeline</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colLeads.length===0 && <div className="flex flex-col items-center justify-center py-10 text-slate-300"><Target size={26} className="mb-2 opacity-40"/><p className="text-[11px]">Drop leads here</p></div>}
                {colLeads.map(lead => (
                  <div key={lead.id} draggable onDragStart={e=>onDragStart(e,lead.id)} onDragEnd={onDragEnd} onMouseEnter={()=>setHoveredCardId(lead.id)} onMouseLeave={()=>setHoveredCardId(null)} onClick={()=>setSelectedLead(lead)} className={`bg-white border rounded-xl p-4 cursor-pointer transition-all select-none relative ${draggingId===lead.id?"opacity-40 scale-95 border-indigo-300":"border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50"}`}>
                    <div className={`absolute top-2.5 right-2.5 flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm transition-all z-10 ${hoveredCardId===lead.id?"opacity-100 translate-y-0":"opacity-0 -translate-y-1 pointer-events-none"}`} onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>setSelectedLead(lead)} title="Preview" className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-violet-50 hover:text-violet-600 text-slate-400 transition-colors"><Eye size={12}/></button>
                      <button onClick={()=>setEditingLead(lead)} title="Edit" className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-sky-50 hover:text-sky-600 text-slate-400 transition-colors"><Pencil size={12}/></button>
                      <button onClick={()=>setDeletingLead(lead)} title="Delete" className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 text-slate-400 transition-colors"><Trash2 size={12}/></button>
                    </div>
                    <div className="flex items-start justify-between mb-3 pr-20">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg text-[12px] font-semibold flex items-center justify-center flex-shrink-0 ${getAvatarColor(lead.name)}`}>{getInitials(lead.name)}</div>
                        <div><p className="text-[13px] font-semibold text-slate-800 leading-tight">{lead.name}</p><p className="text-[11px] text-slate-400">{lead.company}</p></div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 absolute top-4 right-4 transition-opacity ${hoveredCardId===lead.id?"opacity-0":"opacity-100"} ${TAG_COLORS[lead.tag]||"bg-slate-100 text-slate-500"}`}>{lead.tag}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3"><span className="text-[22px] font-bold text-slate-800 leading-none">₹{(lead.value/1000).toFixed(0)}K</span><ArrowUpRight size={13} className="text-emerald-500 mb-0.5"/></div>
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-400">Win probability</span><span className="font-semibold text-slate-600">{lead.probability}%</span></div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full bg-gradient-to-r ${stage.bar} transition-all`} style={{width:`${lead.probability}%`}}/></div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5"><div className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center ${getAvatarColor(lead.owner)}`}>{lead.owner[0]}</div><span className="text-[11px] text-slate-500">{lead.owner}</span></div>
                      <div className="flex items-center gap-1 text-[11px]"><Clock size={11} className={lead.aging>7?"text-rose-400":"text-slate-300"}/><span className={lead.aging>7?"text-rose-500 font-medium":"text-slate-400"}>{lead.aging}d</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button onClick={e=>e.stopPropagation()} className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[11px] font-medium transition-colors"><MessageCircle size={12}/> WhatsApp</button>
                      <button onClick={e=>e.stopPropagation()} className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-medium transition-colors"><Phone size={12}/> Call</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL DRAWER */}
      {selectedLead && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40" onClick={()=>setSelectedLead(null)}/>
          <div className="fixed right-0 top-0 w-[390px] h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-50">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3"><div className={`w-12 h-12 rounded-2xl text-[16px] font-bold flex items-center justify-center ${getAvatarColor(selectedLead.name)}`}>{getInitials(selectedLead.name)}</div><div><h2 className="font-bold text-[17px] text-slate-800">{selectedLead.name}</h2><p className="text-[12px] text-slate-400">{selectedLead.company}</p></div></div>
                <div className="flex items-center gap-1.5">
                  <button onClick={()=>{setEditingLead(selectedLead);setSelectedLead(null);}} title="Edit lead" className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-100 flex items-center justify-center transition-colors"><Pencil size={13} className="text-sky-600"/></button>
                  <button onClick={()=>{setDeletingLead(selectedLead);setSelectedLead(null);}} title="Delete lead" className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 flex items-center justify-center transition-colors"><Trash2 size={13} className="text-rose-500"/></button>
                  <button onClick={()=>setSelectedLead(null)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"><X size={15} className="text-slate-500"/></button>
                </div>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                {(()=>{const sg=getStageById(selectedLead.stage);return sg?<span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{background:sg.bg,color:sg.color}}>{sg.label}</span>:null;})()}
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${TAG_COLORS[selectedLead.tag]||"bg-slate-100 text-slate-500"}`}>{selectedLead.tag}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-4"><div className="flex items-center gap-2 mb-2"><Sparkles size={13} className="text-indigo-500"/><span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wider">AI Insight</span></div><p className="text-[13px] text-slate-700 leading-relaxed">{selectedLead.probability>=70?"High-value lead with strong close probability. Prioritize follow-up today.":selectedLead.aging>7?`Lead has been inactive for ${selectedLead.aging} days. Send a re-engagement message.`:"Steady pipeline lead. Schedule a discovery call to qualify further."}</p></div>
              <div className="grid grid-cols-2 gap-3">{[{label:"Deal Value",value:formatVal(selectedLead.value),icon:DollarSign},{label:"Win Probability",value:`${selectedLead.probability}%`,icon:TrendingUp},{label:"Lead Age",value:`${selectedLead.aging} days`,icon:Clock},{label:"Owner",value:selectedLead.owner,icon:Users}].map(({label,value,icon:Icon})=><div key={label} className="bg-slate-50 rounded-xl p-3"><div className="flex items-center gap-1.5 mb-1"><Icon size={11} className="text-slate-400"/><p className="text-[11px] text-slate-400">{label}</p></div><p className="text-[14px] font-semibold text-slate-800">{value}</p></div>)}</div>
              <div className="bg-slate-50 rounded-xl p-4"><p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-3">Contact</p><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center"><Phone size={13} className="text-slate-500"/></div><span className="text-[13px] font-medium text-slate-700">{selectedLead.phone}</span></div></div>
              {customFields.length>0&&selectedLead.customValues&&<div className="bg-slate-50 rounded-xl p-4"><p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-3">Custom Fields</p><div className="space-y-2">{customFields.map(cf=><div key={cf.id} className="flex justify-between items-start gap-3"><span className="text-[12px] text-slate-400">{cf.label||"—"}</span><span className="text-[12px] font-medium text-slate-700 text-right">{cf.type==="boolean"?selectedLead.customValues?.[cf.id]?"Yes":"No":selectedLead.customValues?.[cf.id]||"—"}</span></div>)}</div></div>}
              <div className="bg-slate-50 rounded-xl p-4"><p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-3">Move to stage</p><div className="flex gap-2 flex-wrap">{stages.filter(s=>s.id!==selectedLead.stage).map(s=><button key={s.id} onClick={()=>moveLead(selectedLead.id,s.id)} className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"><span className="w-2 h-2 rounded-full" style={{background:s.color}}/>{s.label}<ChevronRight size={11}/></button>)}</div></div>
            </div>
            <div className="p-5 border-t border-slate-100 grid grid-cols-2 gap-3 flex-shrink-0">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-medium transition-colors"><MessageCircle size={14}/> WhatsApp</button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition-colors"><Phone size={14}/> Call Now</button>
            </div>
          </div>
        </>
      )}

      {showModal && <NewLeadModal onClose={()=>setShowModal(false)} onSave={handleCreateLead} stages={stages} setStages={setStages} customFields={customFields} setCustomFields={setCustomFields} defaultStage={newLeadDefaultStage}/>}
      {editingLead && <EditLeadModal lead={editingLead} stages={stages} customFields={customFields} onClose={()=>setEditingLead(null)} onSave={handleEditSave}/>}
      {deletingLead && <DeleteConfirmModal lead={deletingLead} onClose={()=>setDeletingLead(null)} onConfirm={handleDeleteConfirm}/>}
      {deletingStage && <DeleteStageModal stage={deletingStage} leadCount={leads.filter(l=>l.stage===deletingStage.id).length} leadValue={leads.filter(l=>l.stage===deletingStage.id).reduce((s,l)=>s+l.value,0)} onClose={()=>setDeletingStage(null)} onConfirm={handleDeleteStage}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("leads"); // "leads" | "settings"
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [stages, setStages] = useState(DEFAULT_STAGES);
  const [customFields, setCustomFields] = useState([]);
  const [crmUsers, setCrmUsers] = useState(INITIAL_USERS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [roles, setRoles] = useState(INITIAL_ROLES);

  return (
    <AppContext.Provider value={{ leads, setLeads, stages, setStages, customFields, setCustomFields, crmUsers, setCrmUsers, notifications, setNotifications, profiles, setProfiles, roles, setRoles }}>
      {page === "leads" && <LeadsPage onOpenSettings={() => setPage("settings")} />}
      {page === "settings" && <SettingsPage onBack={() => setPage("leads")} />}
    </AppContext.Provider>
  );
}
