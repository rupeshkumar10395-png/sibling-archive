"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Memory = {
  id: string;
  archiveId: string;
  type: string;
  content: any;
  position: number;
};

type DefaultQuestion = {
  id: string;
  question: string;
  defaultAnswer: string;
};

function EditArchiveContent() {
  const searchParams = useSearchParams();

  // Security Control Panel State
  const [archiveId, setArchiveId] = useState(searchParams.get("archiveId") || "");
  const [token, setToken] = useState(searchParams.get("token") || "");

  // Memory State
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);

  // Creation Form State
  const [type, setType] = useState("QUESTION");
  const [content, setContent] = useState("");
  const [position, setPosition] = useState(0);
  const [selectedDefaultQuestionId, setSelectedDefaultQuestionId] = useState<string | null>(null);

  // Editing State
  const [editingMemory, setEditingMemory] = useState<{
    id: string;
    type: string;
    content: string;
    position: number;
  } | null>(null);

  // Catalogue State
  const [catalogue, setCatalogue] = useState<DefaultQuestion[]>([]);

  // Diagnostic State
  const [apiStatus, setApiStatus] = useState<{ status: number; message: string } | null>(null);

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const fetchCatalogue = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_BASE_URL}/memories/default-questions`);

      if (!res.ok) {
        throw new Error(`Catalogue API returned ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setCatalogue(data);
    } catch (err: any) {
      console.error("Catalogue fetch failed", err);
      setApiStatus({ status: 500, message: `Catalogue fetch failed: ${err.message}` });
    }
  };

  const loadMemories = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_BASE_URL}/archives/${archiveId}/memories`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();

      setApiStatus({ status: res.status, message: res.ok ? "Success" : (data.message || "Error") });

      if (res.ok) {
        setMemories(data);
      }
    } catch (err: any) {
      setApiStatus({ status: 500, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const createMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      // Payload construction for Q&A vs others
      const payload: any = { type, position };
      if (type === "QUESTION") {
        payload.content = { answer: content };
      } else {
        payload.content = content;
      }

      if (selectedDefaultQuestionId) {
        payload.defaultQuestionId = selectedDefaultQuestionId;
      }

      const res = await fetch(`${API_BASE_URL}/archives/${archiveId}/memories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setApiStatus({ status: res.status, message: res.ok ? "Created" : (data.message || "Error") });
      if (res.ok) {
        setContent("");
        setSelectedDefaultQuestionId(null);
        loadMemories();
      }
    } catch (err: any) {
      setApiStatus({ status: 500, message: err.message });
    }
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_BASE_URL}/archives/${archiveId}/memories/${memoryId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      setApiStatus({ status: res.status, message: res.ok ? "Deleted" : "Error" });
      if (res.ok) loadMemories();
    } catch (err: any) {
      setApiStatus({ status: 500, message: err.message });
    }
  };

  const startEditing = (m: Memory) => {
    const contentString = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
    setEditingMemory({
      id: m.id,
      type: m.type,
      content: contentString,
      position: m.position
    });
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      // Ensure payload for Q&A edit uses content object
      const payload: any = {
        type: editingMemory.type,
        position: editingMemory.position,
      };

      if (editingMemory.type === "QUESTION") {
        payload.content = { answer: editingMemory.content };
      } else {
        payload.content = editingMemory.content;
      }

      const res = await fetch(`${API_BASE_URL}/archives/${archiveId}/memories/${editingMemory.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setApiStatus({ status: res.status, message: res.ok ? "Updated" : (data.message || "Error") });
      if (res.ok) {
        setEditingMemory(null);
        loadMemories();
      }
    } catch (err: any) {
      setApiStatus({ status: 500, message: err.message });
    }
  };

  const selectTemplate = (q: DefaultQuestion) => {
    setType("QUESTION");
    setSelectedDefaultQuestionId(q.id);
    setContent(q.defaultAnswer); // Set initial content to default answer, user can edit
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif", color: "#333" }}>
      <h1>Edit Archive Dashboard (Test UI)</h1>

      {/* Security Control Panel */}
      <section style={{ backgroundColor: "#fff3cd", padding: "20px", borderRadius: "8px", border: "1px solid #ffeeba", marginBottom: "30px" }}>
        <h3 style={{ marginTop: 0 }}>Security Control Panel</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Archive ID</label>
            <input
              type="text"
              value={archiveId}
              onChange={(e) => setArchiveId(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Bearer Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        </div>
        <button
          onClick={loadMemories}
          style={{ marginTop: "15px", padding: "8px 16px", cursor: "pointer", fontWeight: "bold" }}
        >
          {loading ? "Loading..." : "Refresh Memories"}
        </button>
      </section>

      {/* API Status Bar */}
      {apiStatus && (
        <div style={{
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "4px",
          backgroundColor: apiStatus.status >= 400 ? "#f8d7da" : "#d4edda",
          color: apiStatus.status >= 400 ? "#721c24" : "#155724",
          border: "1px solid",
          borderColor: apiStatus.status >= 400 ? "#f5c6cb" : "#c3e6cb",
          fontWeight: "bold"
        }}>
          Status: {apiStatus.status} — {apiStatus.message}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "30px" }}>
        {/* Left: Memory Management */}
        <main>
          <section style={{ marginBottom: "30px" }}>
            <h2>Add Memory</h2>
            <form onSubmit={createMemory} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ width: "100%", padding: "8px" }}
                  >
                    <option value="QUESTION">Question</option>
                    <option value="PHOTO">Photo</option>
                    <option value="SCREENSHOT">Screenshot</option>
                    <option value="BEFORE_AFTER">Before/After</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Position</label>
                  <input
                    type="number"
                    value={position}
                    onChange={(e) => setPosition(parseInt(e.target.value))}
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: "100%", height: "100px", padding: "8px", fontSize: "14px" }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{ padding: "10px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                Save Memory
              </button>
            </form>
          </section>

          <section>
            <h2>Memories</h2>
            {editingMemory && (
              <section style={{ backgroundColor: "#f0f7ff", padding: "20px", borderRadius: "8px", border: "1px solid #cce3ff", marginBottom: "30px" }}>
                <h3 style={{ marginTop: 0 }}>Edit Memory: {editingMemory.id}</h3>
                <form onSubmit={saveEdit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Content</label>
                    <textarea
                      value={editingMemory.content}
                      onChange={(e) => setEditingMemory({ ...editingMemory, content: e.target.value })}
                      style={{ width: "100%", height: "100px", padding: "8px", fontSize: "14px" }}
                      required
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="submit"
                      style={{ padding: "8px 16px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMemory(null)}
                      style={{ padding: "8px 16px", backgroundColor: "#ccc", color: "#333", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {memories.length === 0 && <p>No memories found for this archive.</p>}
              {memories.map((m) => (
                <div key={m.id} style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px", position: "relative" }}>
                  <div style={{ fontSize: "11px", color: "#666", fontWeight: "bold", marginBottom: "5px" }}>
                    {m.type} | Pos: {m.position} | ID: {m.id}
                  </div>
                  <div style={{ whiteSpace: "pre-wrap", fontSize: "15px" }}>{typeof m.content === 'string' ? m.content : JSON.stringify(m.content, null, 2)}</div>
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => startEditing(m)}
                      style={{ color: "#0070f3", border: "none", background: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMemory(m.id)}
                      style={{ color: "red", border: "none", background: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right: Default Questions */}
        <aside>
          <h3 style={{ marginTop: 0 }}>Starter Prompts</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {catalogue.map((q) => (
              <button
                key={q.id}
                onClick={() => selectTemplate(q)}
                style={{
                  textAlign: "left",
                  padding: "10px",
                  fontSize: "13px",
                  cursor: "pointer",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f9f9f9"}
              >
                <strong>{q.question}</strong>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function EditArchivePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditArchiveContent />
    </Suspense>
  );
}
