"use client";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/";
    } else {
      setError("Invalid password");
    }
  }

  return (
    <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "16px", width: "100%", maxWidth: "360px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <p style={{ fontFamily: "Orbitron", fontWeight: 800, fontSize: "1.2rem", color: "#0284C7", margin: 0 }}>Orcanomics</p>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "4px" }}>Support Dashboard</p>
        </div>
        {error && (
          <div style={{ background: "#FEF2F2", color: "#DC2626", padding: "10px 16px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "16px" }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter support password"
            style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "0.9rem", outline: "none" }}
          />
          <button
            type="submit"
            style={{ background: "#0284C7", color: "white", padding: "12px", borderRadius: "10px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
