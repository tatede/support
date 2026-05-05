"use client";
import { useEffect, useState } from "react";

type Ticket = {
  id: string;
  topic: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  message_count: number;
  last_message_at: string;
  // Student fields
  student_id: string | null;
  student_username: string | null;
  student_display_name: string | null;
  student_coins: number | null;
  student_lesson_progress: number | null;
  student_grade: string | null;
  student_is_premium: boolean | null;
  student_created_at: string | null;
  class_name: string | null;
  teacher_name: string | null;
  teacher_email_from_class: string | null;
  // Teacher fields
  teacher_email: string | null;
  teacher_direct_name: string | null;
};

type Message = {
  id: string;
  sender: string;
  message: string;
  created_at: string;
};

function UserInfoPanel({ ticket }: { ticket: Ticket }) {
  const isStudent = !!ticket.student_id;
  const isTeacher = !!ticket.teacher_email && !ticket.student_id;

  if (isStudent) {
    const displayName = ticket.student_display_name || ticket.student_username || ticket.name || "Unknown";
    const accountAge = ticket.student_created_at
      ? Math.floor((Date.now() - new Date(ticket.student_created_at).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <aside style={{
        width: "260px", flexShrink: 0, background: "#0F172A", borderLeft: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569" }}>User Profile</p>
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: "linear-gradient(135deg, #0284C7, #0D9488)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", flexShrink: 0
            }}>🦈</div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "white", fontSize: "0.9rem" }}>{displayName}</p>
              {ticket.student_username && ticket.student_username !== displayName && (
                <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: "0.75rem" }}>@{ticket.student_username}</p>
              )}
              {ticket.student_is_premium && (
                <span style={{
                  display: "inline-block", marginTop: "4px",
                  background: "linear-gradient(90deg, #92400E, #F59E0B)",
                  color: "white", fontSize: "0.6rem", fontWeight: 800,
                  padding: "2px 8px", borderRadius: "999px", letterSpacing: "0.05em"
                }}>ORCA GOLD 👑</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <StatCard label="Grade" value={ticket.student_grade ? `Grade ${ticket.student_grade}` : "—"} icon="🎓" color="#0284C7" />
          <StatCard label="Lesson" value={ticket.student_lesson_progress ? `#${ticket.student_lesson_progress}` : "—"} icon="📖" color="#0D9488" />
          <StatCard label="Coins" value={ticket.student_coins != null ? ticket.student_coins.toLocaleString() : "—"} icon="🪙" color="#F59E0B" />
          <StatCard label="Member for" value={accountAge != null ? `${accountAge}d` : "—"} icon="📅" color="#7C3AED" />
        </div>

        {/* Class info */}
        {(ticket.class_name || ticket.teacher_name) && (
          <InfoSection title="Classroom">
            {ticket.class_name && <InfoRow label="Class" value={ticket.class_name} />}
            {ticket.teacher_name && <InfoRow label="Teacher" value={ticket.teacher_name} />}
            {ticket.teacher_email_from_class && <InfoRow label="Teacher Email" value={ticket.teacher_email_from_class} small />}
          </InfoSection>
        )}

        {/* Contact */}
        <InfoSection title="Contact">
          <InfoRow label="Type" value="Student" badge />
          {ticket.email && <InfoRow label="Email" value={ticket.email} small />}
        </InfoSection>

        {/* Quick context */}
        <div style={{ padding: "0 20px 20px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569" }}>Quick Context</p>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "12px", fontSize: "0.8rem", color: "#94A3B8", lineHeight: 1.5 }}>
            Student is on lesson <strong style={{ color: "white" }}>{ticket.student_lesson_progress ?? "?"}</strong> of 18
            {ticket.class_name && <>, in <strong style={{ color: "white" }}>{ticket.class_name}</strong></>}
            {ticket.student_grade && <> (Grade {ticket.student_grade})</>}.
            {ticket.student_is_premium ? " Premium member." : " Free account."}
          </div>
        </div>
      </aside>
    );
  }

  if (isTeacher) {
    const displayName = ticket.teacher_direct_name || ticket.name || "Unknown Teacher";
    return (
      <aside style={{
        width: "260px", flexShrink: 0, background: "#0F172A", borderLeft: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", overflowY: "auto"
      }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569" }}>User Profile</p>
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED, #0284C7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", flexShrink: 0
            }}>🧑‍🏫</div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "white", fontSize: "0.9rem" }}>{displayName}</p>
              <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: "0.75rem" }}>Teacher Account</p>
            </div>
          </div>
        </div>

        <InfoSection title="Contact">
          <InfoRow label="Type" value="Teacher" badge color="#7C3AED" />
          <InfoRow label="Email" value={ticket.teacher_email || ticket.email || "—"} small />
        </InfoSection>

        <InfoSection title="Topic">
          <InfoRow label="Category" value={ticket.topic} />
          <InfoRow label="Submitted" value={new Date(ticket.created_at).toLocaleDateString()} />
        </InfoSection>
      </aside>
    );
  }

  // Guest / unknown
  return (
    <aside style={{
      width: "260px", flexShrink: 0, background: "#0F172A", borderLeft: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ padding: "20px" }}>
        <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569" }}>User Profile</p>
        <div style={{ marginTop: "32px", textAlign: "center", color: "#475569" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>👤</div>
          <p style={{ margin: 0, fontSize: "0.85rem" }}>No account linked</p>
          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#334155" }}>Guest submission</p>
        </div>
        {ticket.email && (
          <InfoSection title="Contact">
            <InfoRow label="Email" value={ticket.email} small />
          </InfoSection>
        )}
      </div>
    </aside>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "10px 12px",
      border: `1px solid rgba(255,255,255,0.06)`
    }}>
      <p style={{ margin: 0, fontSize: "0.65rem", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{icon} {label}</p>
      <p style={{ margin: "4px 0 0", fontSize: "0.95rem", fontWeight: 700, color: color }}>{value}</p>
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "0 20px 16px" }}>
      <p style={{ margin: "0 0 8px", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569" }}>{title}</p>
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, small, badge, color }: { label: string; value: string; small?: boolean; badge?: boolean; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 500 }}>{label}</span>
      {badge ? (
        <span style={{
          fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px",
          background: color ? `${color}22` : "#0284C722", color: color ?? "#0284C7"
        }}>{value}</span>
      ) : (
        <span style={{
          fontSize: small ? "0.7rem" : "0.78rem", fontWeight: 600, color: "white",
          maxWidth: "140px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap",
          textAlign: "right"
        }} title={value}>{value}</span>
      )}
    </div>
  );
}

export default function SupportDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [filter, setFilter] = useState("open");

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetchMessages(selected.id);
    const interval = setInterval(() => fetchMessages(selected.id), 5000);
    return () => clearInterval(interval);
  }, [selected]);

  async function fetchTickets() {
    const res = await fetch("/api/tickets");
    const data = await res.json();
    setTickets(data);
    // Keep selected in sync with latest data
    setSelected(prev => prev ? (data.find((t: Ticket) => t.id === prev.id) ?? prev) : null);
  }

  async function fetchMessages(id: string) {
    const res = await fetch(`/api/tickets/${id}`);
    const data = await res.json();
    setMessages(data.messages);
  }

  async function sendReply() {
    if (!reply.trim() || !selected) return;
    await fetch(`/api/tickets/${selected.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: reply }),
    });
    setReply("");
    fetchMessages(selected.id);
  }

  async function draftWithAI() {
    if (!selected) return;
    setAiLoading(true);
    const res = await fetch("/api/tickets/ai-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        ticketTopic: selected.topic,
        userName: selected.student_display_name || selected.student_username || selected.teacher_direct_name || selected.name || "the user",
      }),
    });
    const data = await res.json();
    if (data.reply) setReply(data.reply);
    setAiLoading(false);
  }

  async function updateStatus(status: string) {
    if (!selected) return;
    await fetch(`/api/tickets/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchTickets();
    setSelected({ ...selected, status });
  }

  const filtered = tickets.filter(t => filter === "all" || t.status === filter);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: "300px", background: "#0F172A", color: "white", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontFamily: "Orbitron", fontWeight: 800, color: "#0284C7", margin: 0, fontSize: "1.1rem" }}>Orcanomics</p>
          <p style={{ color: "#64748B", fontSize: "0.8rem", margin: "2px 0 0" }}>Support Dashboard</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "4px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {["open", "closed", "all"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flex: 1, padding: "6px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: filter === f ? "#0284C7" : "rgba(255,255,255,0.05)",
                color: filter === f ? "white" : "#94A3B8",
                fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize"
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Ticket list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <p style={{ color: "#64748B", textAlign: "center", padding: "24px", fontSize: "0.85rem" }}>No tickets</p>
          ) : filtered.map(ticket => {
            const isStudent = !!ticket.student_id;
            const isTeacher = !!ticket.teacher_email && !ticket.student_id;
            const displayName = isStudent
              ? (ticket.student_display_name || ticket.student_username || ticket.name || "Student")
              : (ticket.teacher_direct_name || ticket.name || "Teacher");

            return (
              <div
                key={ticket.id}
                onClick={() => setSelected(ticket)}
                style={{
                  padding: "14px 20px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: selected?.id === ticket.id ? "rgba(2,132,199,0.15)" : "transparent",
                  borderLeft: selected?.id === ticket.id ? "3px solid #0284C7" : "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                    <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>{isStudent ? "🦈" : isTeacher ? "🧑‍🏫" : "👤"}</span>
                    <p style={{ margin: 0, fontWeight: 600, color: "white", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {displayName}
                    </p>
                  </div>
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 700, padding: "2px 7px", borderRadius: "999px",
                    background: ticket.status === "open" ? "#059669" : "#475569",
                    color: "white", flexShrink: 0
                  }}>
                    {ticket.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", color: "#0284C7", fontSize: "0.73rem", fontWeight: 600 }}>{ticket.topic}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <p style={{ margin: 0, color: "#475569", fontSize: "0.7rem" }}>
                    {isStudent && ticket.class_name ? ticket.class_name : ticket.email || "—"}
                  </p>
                  <p style={{ margin: 0, color: "#334155", fontSize: "0.68rem" }}>
                    {ticket.message_count} msg · {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
                {isStudent && (
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                    {ticket.student_grade && (
                      <span style={{ fontSize: "0.62rem", background: "rgba(2,132,199,0.2)", color: "#38BDF8", padding: "1px 6px", borderRadius: "4px", fontWeight: 600 }}>
                        Gr. {ticket.student_grade}
                      </span>
                    )}
                    {ticket.student_lesson_progress != null && (
                      <span style={{ fontSize: "0.62rem", background: "rgba(13,148,136,0.2)", color: "#2DD4BF", padding: "1px 6px", borderRadius: "4px", fontWeight: 600 }}>
                        Lesson {ticket.student_lesson_progress}
                      </span>
                    )}
                    {ticket.student_is_premium && (
                      <span style={{ fontSize: "0.62rem", background: "rgba(245,158,11,0.2)", color: "#FCD34D", padding: "1px 6px", borderRadius: "4px", fontWeight: 600 }}>
                        GOLD
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
            <div style={{ textAlign: "center" }}>
              <i className="fas fa-headset" style={{ fontSize: "3rem", marginBottom: "16px", color: "#CBD5E1" }}></i>
              <p style={{ fontWeight: 600, color: "#64748B" }}>Select a ticket to view</p>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Chat area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              {/* Ticket header */}
              <div style={{ background: "white", padding: "16px 28px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "1.1rem" }}>
                      {selected.student_id ? "🦈" : selected.teacher_email ? "🧑‍🏫" : "👤"}
                    </span>
                    <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selected.student_id
                        ? (selected.student_display_name || selected.student_username || selected.name || "Student")
                        : (selected.teacher_direct_name || selected.name || "Teacher")}
                    </h2>
                    {selected.student_is_premium && (
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, background: "#FEF3C7", color: "#92400E", padding: "2px 8px", borderRadius: "999px", flexShrink: 0 }}>GOLD</span>
                    )}
                  </div>
                  <p style={{ margin: "3px 0 0", color: "#64748B", fontSize: "0.82rem" }}>
                    {selected.class_name ? `${selected.class_name} · ` : ""}
                    <span style={{ color: "#0284C7", fontWeight: 600 }}>{selected.topic}</span>
                    {selected.student_grade ? ` · Grade ${selected.student_grade}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => updateStatus(selected.status === "open" ? "closed" : "open")}
                  style={{
                    padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", flexShrink: 0,
                    background: selected.status === "open" ? "#FEF2F2" : "#F0FDF4",
                    color: selected.status === "open" ? "#DC2626" : "#059669"
                  }}
                >
                  {selected.status === "open" ? "Close Ticket" : "Reopen Ticket"}
                </button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", background: "#F8FAFC", display: "flex", flexDirection: "column", gap: "12px" }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "agent" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "60%", padding: "12px 16px",
                      borderRadius: msg.sender === "agent" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: msg.sender === "agent" ? "#0284C7" : "white",
                      color: msg.sender === "agent" ? "white" : "#1E293B",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)", fontSize: "0.9rem"
                    }}>
                      <p style={{ margin: 0 }}>{msg.message}</p>
                      <p style={{ margin: "4px 0 0", fontSize: "0.7rem", opacity: 0.7 }}>
                        {msg.sender === "agent" ? "Support Agent" : (selected.student_display_name || selected.student_username || selected.name || "Customer")}
                        {" · "}{new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p style={{ textAlign: "center", color: "#94A3B8", fontSize: "0.85rem" }}>No messages yet</p>
                )}
              </div>

              {/* Reply box */}
              <div style={{ background: "white", padding: "14px 28px", borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendReply()}
                    placeholder="Type your reply..."
                    style={{ flex: 1, padding: "12px 16px", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem", outline: "none" }}
                  />
                  <button
                    onClick={sendReply}
                    style={{ background: "#0284C7", color: "white", padding: "12px 24px", borderRadius: "10px", border: "none", fontWeight: 700, cursor: "pointer" }}
                  >
                    Send
                  </button>
                </div>
                <button
                  onClick={draftWithAI}
                  disabled={aiLoading}
                  style={{
                    background: aiLoading ? "#F1F5F9" : "#F8FAFC",
                    color: aiLoading ? "#94A3B8" : "#7C3AED",
                    border: "1px solid #E2E8F0",
                    borderRadius: "10px",
                    padding: "8px 16px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: aiLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    width: "fit-content",
                  }}
                >
                  {aiLoading ? "✨ Drafting..." : "✨ Draft with AI"}
                </button>
              </div>
            </div>

            {/* User info panel */}
            <UserInfoPanel ticket={selected} />
          </div>
        )}
      </main>
    </div>
  );
}
