import { useMemo, useState } from "react";
import type { Lead, LeadActivity, LeadNote, LeadTask, WhatsAppMessage } from "../../types/lead";

export default function LeadDetailsDrawer({ lead, onClose, onUpdate }: { lead: Lead; onClose: () => void; onUpdate: (id: string, data: Partial<Lead>) => Promise<Lead | null> }) {
  const [tab, setTab] = useState<"details" | "timeline" | "notes" | "tasks" | "chat" | "ai">("details");
  const [noteText, setNoteText] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [chatText, setChatText] = useState("");
  const [callSummary, setCallSummary] = useState("");

  const sortedActivities = useMemo(() => [...lead.activities].sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()), [lead.activities]);

  const addNote = async () => {
    if (!noteText.trim()) return;
    const nextNote: LeadNote = { id: `note-${Date.now()}`, text: noteText.trim(), createdAt: new Date().toISOString() };
    await onUpdate(lead.id, { notes: [nextNote, ...lead.notes] });
    setNoteText("");
  };

  const addTask = async () => {
    if (!taskTitle.trim()) return;
    const nextTask: LeadTask = { id: `task-${Date.now()}`, title: taskTitle.trim(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), completed: false };
    await onUpdate(lead.id, { tasks: [nextTask, ...lead.tasks] });
    setTaskTitle("");
  };

  const toggleTask = async (task: LeadTask) => {
    await onUpdate(lead.id, { tasks: lead.tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item) });
  };

  const sendMessage = async () => {
    if (!chatText.trim()) return;
    const message: WhatsAppMessage = { id: `chat-${Date.now()}`, sender: "me", text: chatText.trim(), ts: new Date().toISOString() };
    await onUpdate(lead.id, { chat: [...lead.chat, message] });
    setChatText("");
  };

  const startCall = async () => {
    if (!callSummary.trim()) return;
    const activity: LeadActivity = { id: `act-${Date.now()}`, type: "call", text: callSummary.trim(), ts: new Date().toISOString(), user: lead.owner };
    await onUpdate(lead.id, { activities: [activity, ...lead.activities] });
    setCallSummary("");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/30 px-4 py-6 sm:px-6">
      <div className="h-full w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p className="text-sm text-blue-600">Lead details</p>
            <h2 className="text-2xl font-semibold text-slate-900">{lead.firstName} {lead.lastName}</h2>
            <p className="mt-1 text-sm text-gray-500">{lead.company} • {lead.stage} • {lead.status}</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 px-3 py-2 text-gray-600 hover:bg-slate-200">Close</button>
        </div>
        <div className="flex h-full overflow-hidden">
          <aside className="w-full max-w-[280px] border-r border-gray-200 bg-slate-50 px-4 py-5">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Lead score</p>
                <p className="mt-2 text-4xl font-semibold text-blue-700">{lead.score}</p>
              </div>
              <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">Owner</div>
                <div className="font-semibold text-slate-900">{lead.owner}</div>
              </div>
              <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">Next follow-up</div>
                <div className="font-semibold text-slate-900">{lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : "Not scheduled"}</div>
              </div>
              <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">Contact</div>
                <div className="text-sm text-slate-900">{lead.email}</div>
                <div className="text-sm text-slate-900">{lead.phone}</div>
              </div>
            </div>
          </aside>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex flex-wrap gap-2">
              {(["details", "timeline", "notes", "tasks", "chat", "ai"] as const).map((item) => (
                <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === item ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
            {tab === "details" && (
              <section className="space-y-6">
                <div className="rounded-3xl bg-slate-50 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Source</p>
                      <p className="mt-2 text-sm text-slate-900">{lead.source}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Tags</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {lead.tags.map((tag) => <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{tag}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Revenue</p>
                      <p className="mt-2 text-sm text-slate-900">₹{lead.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Custom fields</p>
                      <div className="mt-2 space-y-2 text-sm text-slate-900">
                        {Object.entries(lead.custom).map(([key, value]) => <div key={key}><span className="font-semibold">{key}:</span> {value || "—"}</div>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">Recent activity</h3>
                    <div className="space-y-3">
                      {sortedActivities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="rounded-2xl bg-slate-50 p-4">
                          <div className="text-sm font-semibold text-slate-900">{activity.type.toUpperCase()}</div>
                          <p className="mt-1 text-sm text-gray-600">{activity.text}</p>
                          <div className="mt-2 text-xs text-gray-400">{new Date(activity.ts).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
            {tab === "timeline" && (
              <section className="space-y-4">
                {sortedActivities.map((activity) => (
                  <div key={activity.id} className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900">{activity.type}</span>
                      <span className="text-xs text-gray-400">{new Date(activity.ts).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{activity.text}</p>
                  </div>
                ))}
              </section>
            )}
            {tab === "notes" && (
              <section className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write a note" className="w-full rounded-3xl border border-gray-200 bg-white p-4 text-sm text-slate-900 shadow-sm" rows={3} />
                  <button onClick={addNote} className="h-12 rounded-3xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700">Add note</button>
                </div>
                <div className="space-y-3">
                  {lead.notes.map((note) => (
                    <div key={note.id} className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-900">{note.text}</p>
                      <div className="mt-2 text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {tab === "tasks" && (
              <section className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="New task" className="w-full rounded-3xl border border-gray-200 bg-white p-4 text-sm shadow-sm" />
                  <button onClick={addTask} className="h-12 rounded-3xl bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700">Add task</button>
                </div>
                <div className="space-y-3">
                  {lead.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                      <div>
                        <p className={`text-sm font-medium ${task.completed ? "line-through text-gray-400" : "text-slate-900"}`}>{task.title}</p>
                        <p className="text-xs text-gray-500">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => toggleTask(task)} className={`rounded-full px-4 py-2 text-xs font-semibold ${task.completed ? "bg-gray-200 text-slate-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                        {task.completed ? "Completed" : "Mark done"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {tab === "chat" && (
              <section className="space-y-4">
                <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                  {lead.chat.map((message) => (
                    <div key={message.id} className={`rounded-3xl p-4 ${message.sender === "me" ? "bg-blue-600 text-white self-end" : "bg-white text-slate-900"}`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className="mt-2 text-xs text-gray-300">{new Date(message.ts).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Send WhatsApp message" className="w-full rounded-3xl border border-gray-200 bg-white p-4 text-sm shadow-sm" />
                  <button onClick={sendMessage} className="h-12 rounded-3xl bg-green-600 px-6 text-sm font-semibold text-white hover:bg-green-700">Send</button>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                  <p className="text-sm font-semibold text-slate-900">Call summary</p>
                  <textarea value={callSummary} onChange={(e) => setCallSummary(e.target.value)} placeholder="Record call notes" className="mt-3 w-full rounded-3xl border border-gray-200 bg-slate-50 p-4 text-sm shadow-sm" rows={3} />
                  <button onClick={startCall} className="mt-3 rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">Log call</button>
                </div>
              </section>
            )}
            {tab === "ai" && (
              <section>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <h3 className="text-base font-semibold text-slate-900">Smart guidance</h3>
                  <p className="mt-2 text-sm text-gray-600">AI-driven suggestions based on all lead signals.</p>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
