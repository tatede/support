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
};

type Message = {
  id: string;
  sender: string;
  message: string;
  created_at: string;
};

export default function SupportDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
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
      <aside style={{ width: "320px", background: "#0F172A", color: "white", display: "flex", flexDirection: "column", flexShrink: 0 }}>
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
          ) : filtered.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelected(ticket)}
              style={{
                padding: "16px 24px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: selected?.id === ticket.id ? "rgba(2,132,199,0.15)" : "transparent",
                borderLeft: selected?.id === ticket.id ? "3px solid #0284C7" : "3px solid transparent",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, fontWeight: 600, color: "white", fontSize: "0.9rem" }}>{ticket.name || "Anonymous"}</p>
                <span style={{
                  fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px",
                  background: ticket.status === "open" ? "#059669" : "#64748B",
                  color: "white"
                }}>
                  {ticket.status.toUpperCase()}
                </span>
              </div>
              <p style={{ margin: "4px 0 0", color: "#0284C7", fontSize: "0.75rem", fontWeight: 600 }}>{ticket.topic}</p>
              <p style={{ margin: "2px 0 0", color: "#64748B", fontSize: "0.75rem" }}>{ticket.email}</p>
              <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "0.7rem" }}>
                {ticket.message_count} messages · {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
            <div style={{ textAlign: "center" }}>
              <i className="fas fa-headset" style={{ fontSize: "3rem", marginBottom: "16px", color: "#CBD5E1" }}></i>
              <p style={{ fontWeight: 600, color: "#64748B" }}>Select a ticket to view</p>
            </div>
          </div>
        ) : (
          <>
            {/* Ticket header */}
            <div style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0F172A" }}>{selected.name || "Anonymous"}</h2>
                <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: "0.85rem" }}>{selected.email} · <span style={{ color: "#0284C7", fontWeight: 600 }}>{selected.topic}</span></p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => updateStatus(selected.status === "open" ? "closed" : "open")}
                  style={{
                    padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                    background: selected.status === "open" ? "#FEF2F2" : "#F0FDF4",
                    color: selected.status === "open" ? "#DC2626" : "#059669"
                  }}
                >
                  {selected.status === "open" ? "Close Ticket" : "Reopen Ticket"}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", background: "#F8FAFC", display: "flex", flexDirection: "column", gap: "12px" }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "agent" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "60%", padding: "12px 16px", borderRadius: msg.sender === "agent" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.sender === "agent" ? "#0284C7" : "white",
                    color: msg.sender === "agent" ? "white" : "#1E293B",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)", fontSize: "0.9rem"
                  }}>
                    <p style={{ margin: 0 }}>{msg.message}</p>
                    <p style={{ margin: "4px 0 0", fontSize: "0.7rem", opacity: 0.7 }}>
                      {msg.sender === "agent" ? "Support Agent" : selected.name || "Customer"} · {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <p style={{ textAlign: "center", color: "#94A3B8", fontSize: "0.85rem" }}>No messages yet</p>
              )}
            </div>

            {/* Reply box */}
            <div style={{ background: "white", padding: "16px 32px", borderTop: "1px solid #E2E8F0", display: "flex", gap: "12px" }}>
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
          </>
        )}
      </main>
    </div>
  );
}
