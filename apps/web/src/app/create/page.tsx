"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateArchivePage() {
  const [title, setTitle] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${API_BASE_URL}/archives`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `Error ${response.status}: Failed to create archive`);
      }

      if (!data.archive?.id || !data.editToken) {
        throw new Error("API response missing required archive ID or edit token.");
      }

      window.location.href = `/test-edit?archiveId=${encodeURIComponent(data.archive.id)}&token=${encodeURIComponent(data.editToken)}`;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Create Test Archive</h1>
      <p>This page generates a new archive and a secure edit token for Phase 4 testing.</p>

      <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Archive Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Chaos Years"
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold" }}
        >
          {loading ? "Creating..." : "Create Archive"}
        </button>
      </form>

      {error && (
        <div style={{ padding: "15px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "4px", marginBottom: "20px", border: "1px solid #ef9a9a" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
