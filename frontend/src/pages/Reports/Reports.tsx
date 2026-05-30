"use client";
import { useState, useEffect, useRef } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab = "ov" | "ld" | "pp" | "ac";
type Range = "7" | "30" | "90" | "365";

// ── Static data ────────────────────────────────────────────────────────────────
const RANGE_DATA: Record<Range, { leads: string; deals: string; rev: string; cvr: string }> = {
  "7":   { leads: "89",    deals: "12",  rev: "₹2.1L", cvr: "13.5%" },
  "30":  { leads: "342",   deals: "47",  rev: "₹8.4L", cvr: "13.7%" },
  "90":  { leads: "980",   deals: "134", rev: "₹24L",  cvr: "13.7%" },
  "365": { leads: "3,820", deals: "521", rev: "₹94L",  cvr: "13.6%" },
};

const SOURCES = [
  { name: "WhatsApp",  pct: 38, color: "#1D9E75" },
  { name: "Referral",  pct: 27, color: "#378ADD" },
  { name: "Website",   pct: 18, color: "#534AB7" },
  { name: "Ads",       pct: 11, color: "#EF9F27" },
  { name: "Cold call", pct: 6,  color: "#888780" },
];

const FUNNEL = [
  { label: "Visitors",  count: 1240, pct: 100,  color: "#B5D4F4" },
  { label: "Leads",     count: 342,  pct: 27.6, color: "#378ADD" },
  { label: "Qualified", count: 184,  pct: 14.8, color: "#185FA5" },
  { label: "Proposal",  count: 91,   pct: 7.3,  color: "#1D9E75" },
  { label: "Closed",    count: 47,   pct: 3.8,  color: "#3B6D11" },
];

const DEALS = [
  { co: "Reliance Jio",      val: "₹4.1L", stage: "Closing",     owner: "Vikram D", badge: "Closing",     bc: "bg-green-50 text-green-800" },
  { co: "Infosys Ltd",       val: "₹3.2L", stage: "Negotiation", owner: "Rohan K",  badge: "Hot",         bc: "bg-red-50 text-red-800" },
  { co: "Wipro Digital",     val: "₹2.8L", stage: "Proposal",    owner: "Priya M",  badge: "Warm",        bc: "bg-amber-50 text-amber-800" },
  { co: "Tata Consultancy",  val: "₹1.9L", stage: "Demo",        owner: "Amit S",   badge: "Warm",        bc: "bg-amber-50 text-amber-800" },
  { co: "HCL Technologies",  val: "₹1.4L", stage: "Prospecting", owner: "Neha R",   badge: "Cold",        bc: "bg-blue-50 text-blue-800" },
];

const ACTIVITIES = [
  { emoji: "📞", bg: "#E6F1FB", name: "Rohan called Infosys",   desc: "Follow-up · 12 min · Positive",   time: "2h ago"    },
  { emoji: "💬", bg: "#EAF3DE", name: "Priya messaged Wipro",   desc: "Sent proposal PDF via WhatsApp",  time: "4h ago"    },
  { emoji: "✉️", bg: "#FAEEDA", name: "Amit emailed TCS",       desc: "Demo invite · Opened 3×",         time: "Yesterday" },
  { emoji: "📅", bg: "#EEEDFE", name: "Meeting with Reliance",  desc: "Closing call · Confirmed",        time: "Tomorrow"  },
  { emoji: "📝", bg: "#FCEBEB", name: "Neha added note · HCL",  desc: "Budget confirmed ₹1.4L for Q3",  time: "2 days ago"},
];

// ── Tiny reusable components ───────────────────────────────────────────────────
function MetricCard({ label, value, delta, up }: { label: string; value: string; delta: string; up: boolean }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
      <p className={`text-[11px] mt-1 ${up ? "text-green-700" : "text-red-700"}`}>{up ? "↑" : "↓"} {delta}</p>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, sub, legend }: { title: string; sub?: string; legend?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {legend}
    </div>
  );
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1 text-[11px] text-gray-400">
          <span className="w-2 h-2 rounded-sm" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

// ── SVG mini bar chart (no deps) ───────────────────────────────────────────────
function BarChart({ data, labels, colors, height = 140, horizontal = false }: {
  data: number[]; labels: string[]; colors: string | string[]; height?: number; horizontal?: boolean;
}) {
  const W = 600; const H = height;
  const PAD = { top: 8, right: 8, bottom: 28, left: horizontal ? 72 : 28 };
  const max = Math.max(...data) * 1.1;
  const w = W - PAD.left - PAD.right;
  const h = H - PAD.top - PAD.bottom;
  const col = (i: number) => Array.isArray(colors) ? colors[i % colors.length] : colors;

  if (horizontal) {
    const bH = Math.min(22, (h / data.length) - 6);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} aria-hidden="true">
        {data.map((v, i) => {
          const y = PAD.top + i * (h / data.length) + (h / data.length - bH) / 2;
          const bW = (v / max) * w;
          return (
            <g key={i}>
              <text x={PAD.left - 6} y={y + bH / 2 + 4} textAnchor="end" fontSize="10" fill="#888">{labels[i]}</text>
              <rect x={PAD.left} y={y} width={Math.max(bW, 2)} height={bH} fill={col(i)} rx="3" />
              <text x={PAD.left + bW + 4} y={y + bH / 2 + 4} fontSize="10" fill="#888">{v.toLocaleString()}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  const bW = Math.max(8, w / data.length - 4);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} aria-hidden="true">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={PAD.left} x2={W - PAD.right} y1={PAD.top + h * (1 - t)} y2={PAD.top + h * (1 - t)} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      ))}
      {data.map((v, i) => {
        const x = PAD.left + i * (w / data.length) + (w / data.length - bW) / 2;
        const bH = (v / max) * h;
        const y = PAD.top + h - bH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bW} height={bH} fill={col(i)} rx="3" />
            <text x={x + bW / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="#888">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function GroupedBarChart({ data1, data2, labels, color1, color2, height = 160 }: {
  data1: number[]; data2: number[]; labels: string[]; color1: string; color2: string; height?: number;
}) {
  const W = 600; const H = height;
  const PAD = { top: 8, right: 8, bottom: 28, left: 28 };
  const max = Math.max(...data1, ...data2) * 1.1;
  const w = W - PAD.left - PAD.right;
  const h = H - PAD.top - PAD.bottom;
  const slotW = w / labels.length;
  const bW = Math.max(6, slotW / 2 - 4);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} aria-hidden="true">
      {[0, 0.5, 1].map((t) => (
        <line key={t} x1={PAD.left} x2={W - PAD.right} y1={PAD.top + h * (1 - t)} y2={PAD.top + h * (1 - t)} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      ))}
      {labels.map((lbl, i) => {
        const cx = PAD.left + i * slotW + slotW / 2;
        const h1 = (data1[i] / max) * h; const h2 = (data2[i] / max) * h;
        return (
          <g key={i}>
            <rect x={cx - bW - 1} y={PAD.top + h - h1} width={bW} height={h1} fill={color1} rx="3" />
            <rect x={cx + 1}      y={PAD.top + h - h2} width={bW} height={h2} fill={color2} rx="3" />
            <text x={cx} y={H - 6} textAnchor="middle" fontSize="10" fill="#888">{lbl}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ data1, data2, labels, color1, color2, height = 180 }: {
  data1: number[]; data2: number[]; labels: string[]; color1: string; color2: string; height?: number;
}) {
  const W = 600; const H = height;
  const PAD = { top: 12, right: 12, bottom: 28, left: 32 };
  const allVals = [...data1, ...data2];
  const min = Math.min(...allVals) * 0.9; const max = Math.max(...allVals) * 1.05;
  const w = W - PAD.left - PAD.right; const h = H - PAD.top - PAD.bottom;
  const px = (i: number) => PAD.left + (i / (labels.length - 1)) * w;
  const py = (v: number) => PAD.top + h - ((v - min) / (max - min)) * h;
  const path = (d: number[]) => d.map((v, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} aria-hidden="true">
      {[0, 0.5, 1].map((t) => (
        <line key={t} x1={PAD.left} x2={W - PAD.right} y1={PAD.top + h * t} y2={PAD.top + h * t} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      ))}
      <path d={`${path(data2)} L${px(labels.length-1)},${PAD.top+h} L${px(0)},${PAD.top+h}Z`} fill={color1} opacity="0.08" />
      <path d={path(data2)} fill="none" stroke={color2} strokeWidth="1.5" strokeDasharray="5 4" />
      <path d={path(data1)} fill="none" stroke={color1} strokeWidth="2" />
      {data1.map((v, i) => <circle key={i} cx={px(i)} cy={py(v)} r="3" fill={color1} />)}
      {labels.map((l, i) => <text key={i} x={px(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#888">{l}</text>)}
    </svg>
  );
}

function DonutChart({ data, colors, labels, size = 120 }: {
  data: number[]; colors: string[]; labels: string[]; size?: number;
}) {
  const total = data.reduce((a, b) => a + b, 0);
  const cx = size / 2; const cy = size / 2; const r = size * 0.38; const r2 = size * 0.22;
  let angle = -Math.PI / 2;
  const slices = data.map((v, i) => {
    const sweep = (v / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle); const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle); const y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const xi1 = cx + r2 * Math.cos(angle - sweep); const yi1 = cy + r2 * Math.sin(angle - sweep);
    const xi2 = cx + r2 * Math.cos(angle); const yi2 = cy + r2 * Math.sin(angle);
    return { d: `M${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} L${xi2},${yi2} A${r2},${r2},0,${large},0,${xi1},${yi1}Z`, color: colors[i], label: labels[i], pct: Math.round(v) };
  });
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ flexShrink: 0 }}>
        {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} />)}
      </svg>
      <div className="flex flex-col gap-1.5">
        {slices.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            {s.label} — {s.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Tab panels ─────────────────────────────────────────────────────────────────
function OverviewTab({ metrics }: { metrics: typeof RANGE_DATA["30"] }) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <MetricCard label="Total leads"    value={metrics.leads} delta="+18% vs prev" up />
        <MetricCard label="Deals closed"   value={metrics.deals} delta="+9% vs prev"  up />
        <MetricCard label="Revenue"        value={metrics.rev}   delta="+22% vs prev" up />
        <MetricCard label="Conversion"     value={metrics.cvr}   delta="-2% vs prev"  up={false} />
      </div>

      <Card className="mb-3">
        <CardHeader title="Revenue over time" sub="Weekly deal revenue vs target"
          legend={<Legend items={[{ label: "Revenue", color: "#378ADD" }, { label: "Target", color: "#B5D4F4" }]} />} />
        <LineChart data1={[82,94,78,110,102,130,119,145]} data2={[100,100,100,100,100,120,120,120]}
          labels={["W1","W2","W3","W4","W5","W6","W7","W8"]} color1="#378ADD" color2="#B5D4F4" />
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Card>
          <CardHeader title="Lead sources" sub="Where leads come from" />
          <div className="flex flex-col gap-2">
            {SOURCES.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-16 flex-shrink-0 text-right">{s.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
                <span className="text-xs text-gray-400 w-7 text-right">{s.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Deals by stage"
            legend={<Legend items={[{ label: "Won", color: "#1D9E75" }, { label: "Active", color: "#378ADD" }, { label: "Lost", color: "#888780" }]} />} />
          <BarChart data={[68,42,35,24,47,19]} labels={["Prospect","Demo","Proposal","Nego","Won","Lost"]}
            colors={["#B5D4F4","#85B7EB","#378ADD","#185FA5","#1D9E75","#888780"]} height={150} />
        </Card>
      </div>
    </>
  );
}

function LeadsTab() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <MetricCard label="New leads"     value="128"  delta="+31%"    up />
        <MetricCard label="Qualified"     value="84"   delta="+14%"    up />
        <MetricCard label="Avg response"  value="2.4h" delta="faster"  up />
        <MetricCard label="Cost/lead"     value="₹480" delta="-6%"     up={false} />
      </div>

      <Card className="mb-3">
        <CardHeader title="Conversion funnel" sub="Drop-off at each stage" />
        <div className="flex flex-col gap-2">
          {FUNNEL.map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-20 flex-shrink-0 text-right">{f.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                  style={{ width: `${f.pct}%`, background: f.color }}>
                  <span className="text-[11px] font-medium text-white">{f.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card>
          <CardHeader title="Leads by day" sub="Best days for incoming leads" />
          <BarChart data={[28,52,61,44,38,12,7]} labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}
            colors="#378ADD" height={140} />
        </Card>
        <Card>
          <CardHeader title="Lead quality" sub="Score distribution" />
          <DonutChart data={[25,45,30]} colors={["#D85A30","#EF9F27","#378ADD"]}
            labels={["Hot","Warm","Cold"]} size={110} />
        </Card>
      </div>
    </>
  );
}

function PipelineTab() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <MetricCard label="Pipeline value" value="₹42L"    delta="+15%"      up />
        <MetricCard label="Avg deal size"  value="₹89K"    delta="+7%"       up />
        <MetricCard label="Avg cycle"      value="18 days" delta="3d faster" up />
        <MetricCard label="Win rate"       value="62%"     delta="+5%"       up />
      </div>

      <Card className="mb-3">
        <CardHeader title="Open deals" sub="Top opportunities" />
        <div className="flex flex-col gap-2">
          {DEALS.map((d) => (
            <div key={d.co} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
              <span className="text-gray-400 text-base">🏢</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{d.co}</p>
                <p className="text-xs text-gray-400">{d.val} · {d.stage} · {d.owner}</p>
              </div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${d.bc}`}>{d.badge}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Forecast vs actual" sub="Monthly revenue"
          legend={<Legend items={[{ label: "Forecast", color: "#B5D4F4" }, { label: "Actual", color: "#185FA5" }]} />} />
        <GroupedBarChart data1={[120,140,130,160,150]} data2={[115,148,122,171,158]}
          labels={["Jan","Feb","Mar","Apr","May"]} color1="#B5D4F4" color2="#185FA5" />
      </Card>
    </>
  );
}

function ActivityTab() {
  const actData = [214, 581, 1342, 38, 93];
  const actLabels = ["Calls", "Emails", "WhatsApp", "Meetings", "Notes"];
  const actColors = ["#378ADD", "#534AB7", "#1D9E75", "#EF9F27", "#D85A30"];
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <MetricCard label="Calls made"      value="214"   delta="+12%" up />
        <MetricCard label="Emails sent"     value="581"   delta="+8%"  up />
        <MetricCard label="WhatsApp"        value="1,342" delta="+44%" up />
        <MetricCard label="Meetings booked" value="38"    delta="+19%" up />
      </div>

      <Card className="mb-3">
        <CardHeader title="Activity breakdown" sub="Volume by channel" />
        <BarChart data={actData} labels={actLabels} colors={actColors} horizontal height={240} />
      </Card>

      <Card>
        <CardHeader title="Recent activity" />
        <div className="flex flex-col divide-y divide-gray-100">
          {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm mt-0.5"
                style={{ background: a.bg }}>{a.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
              </div>
              <span className="text-[11px] text-gray-400 flex-shrink-0 mt-1">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Reports() {
  const [tab, setTab]     = useState<Tab>("ov");
  const [range, setRange] = useState<Range>("30");
  const metrics           = RANGE_DATA[range];

  const TAB_LIST: { key: Tab; label: string }[] = [
    { key: "ov", label: "Overview"    },
    { key: "ld", label: "Lead funnel" },
    { key: "pp", label: "Pipeline"    },
    { key: "ac", label: "Activity"    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-400 mt-0.5">Updated today, 9:41 AM</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as Range)}
              className="text-sm px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">This year</option>
            </select>
            <button className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
              ↓ Export
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-5">
          {TAB_LIST.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-xl border transition-colors ${
                tab === t.key
                  ? "bg-white border-gray-200 text-gray-900 font-medium shadow-sm"
                  : "bg-transparent border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {tab === "ov" && <OverviewTab metrics={metrics} />}
        {tab === "ld" && <LeadsTab />}
        {tab === "pp" && <PipelineTab />}
        {tab === "ac" && <ActivityTab />}
      </div>
    </div>
  );
}
