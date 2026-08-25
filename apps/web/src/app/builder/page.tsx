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

function ArchiveBuilderContent() {
  const searchParams = useSearchParams();
  const archiveId = searchParams.get("archiveId") || "";
  const token = searchParams.get("token") || "";

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

  // Final Link State
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchCatalogue();
    loadMemories();
  }, []);

  const fetchCatalogue = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/memories/default-questions`);
      if (!res.ok) throw new Error("Failed to fetch starter prompts");
      const data = await res.json();
      setCatalogue(data);
    } catch (err) {
      console.error("Catalogue fetch failed", err);
    }
  };

  const loadMemories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/archives/${archiveId}/memories`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (err) {
      console.error("Load memories failed", err);
    } finally {
      setLoading(false);
    }
  };

  const createMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
      if (res.ok) {
        setContent("");
        setSelectedDefaultQuestionId(null);
        loadMemories();
      }
    } catch (err) {
      console.error("Create memory failed", err);
    }
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/archives/${archiveId}/memories/${memoryId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) loadMemories();
    } catch (err) {
      console.error("Delete memory failed", err);
    }
  };

  const startEditing = (m: Memory) => {
    const contentString = typeof m.content === 'string' ? m.content : (m.content as any).answer || JSON.stringify(m.content);
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
      if (res.ok) {
        setEditingMemory(null);
        loadMemories();
      }
    } catch (err) {
      console.error("Save edit failed", err);
    }
  };

  const generateLink = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/archives/${archiveId}`);
      if (res.ok) {
        const data = await res.json();
        // In V1, the generated link is the builder link to allow both viewing and editing
        setPublicLink(`/builder?archiveId=${encodeURIComponent(data.id)}&token=${encodeURIComponent(token)}`);
      }
    } catch (err) {
      console.error("Generate link failed", err);
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = () => {
    if (!publicLink) return;
    const fullUrl = `${window.location.origin}${publicLink}`;
    navigator.clipboard.writeText(fullUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "60px auto", padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#444" }}>
      <header style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "32px", color: "#222", marginBottom: "10px" }}>Archive Builder</h1>
        <p style={{ fontSize: "18px", color: "#666" }}>Gather the memories that define your sibling bond.</p>
      </header>

      {publicLink && (
        <div style={{
          backgroundColor: "#e3f2fd",
          padding: "20px",
          borderRadius: "12px",
          border: "2px dashed #2196f3",
          marginBottom: "40px",
          textAlign: "center"
        }}>
          <h3 style={{ marginTop: 0, color: "#1565c0" }}>✨ Your Archive is Ready!</h3>
          <p style={{ marginBottom: "15px" }}>Share this link with your siblings to view the collection.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
            <code style={{ backgroundColor: "#fff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #bbdefb", fontSize: "14px" }}>
              {window.location.origin}{publicLink}
            </code>
            <button
              onClick={copyLink}
              style={{ padding: "8px 16px", backgroundColor: "#2196f3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
        <section style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
          <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "22px" }}>Add a New Memory</h2>
          <form onSubmit={createMemory} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Memory Type</label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    if (e.target.value !== "QUESTION") setSelectedDefaultQuestionId(null);
                  }}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
                >
                  <option value="QUESTION">Question & Answer</option>
                  <option value="PHOTO">Photo</option>
                  <option value="SCREENSHOT">Screenshot</option>
                  <option value="BEFORE_AFTER">Before/After</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Order / Position</label>
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(parseInt(e.target.value))}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
                />
              </div>
            </div>

            {type === "QUESTION" && (
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Pick a Starter Prompt</label>
                <select
                  value={selectedDefaultQuestionId || ""}
                  onChange={(e) => {
                    const q = catalogue.find(item => item.id === e.target.value);
                    setSelectedDefaultQuestionId(e.target.value);
                    if (q) setContent(q.defaultAnswer);
                  }}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", marginBottom: "15px" }}
                >
                  <option value="">-- Write your own question... --</option>
                  {catalogue.map((q) => (
                    <option key={q.id} value={q.id}>{q.question}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                {type === "QUESTION" && selectedDefaultQuestionId
                  ? "Your Answer"
                  : "Content / Details"}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={type === "QUESTION" ? "Write the memory here..." : "Enter details about this memory..."}
                style={{ width: "100%", height: "120px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", resize: "vertical" }}
                required
              />
            </div>

            <button
              type="submit"
              style={{ padding: "14px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", transition: "background 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#005bc1"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#0070f3"}
            >
              Save Memory
            </button>
          </form>
        </section>

        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "22px", margin: 0 }}>Saved Memories</h2>
            <button
              onClick={generateLink}
              disabled={generating || memories.length === 0}
              style={{
                padding: "10px 20px",
                backgroundColor: "#fff",
                color: "#0070f3",
                border: "2px solid #0070f3",
                borderRadius: "8px",
                cursor: generating ? "not-allowed" : "pointer",
                fontWeight: "bold",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                if (!generating && memories.length > 0) {
                  e.currentTarget.style.backgroundColor = "#0070f3";
                  e.currentTarget.style.color = "white";
                }
              }}
              onMouseOut={(e) => {
                if (!generating && memories.length > 0) {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.color = "#0070f3";
                }
              }}
            >
              {generating ? "Generating..." : "Generate Archive"}
            </button>
          </div>

          {editingMemory && (
            <section style={{ backgroundColor: "#fdfdfd", padding: "25px", borderRadius: "16px", border: "1px solid #d0e3ff", marginBottom: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <h3 style={{ marginTop: 0, fontSize: "18px", marginBottom: "15px" }}>Edit Memory</h3>
              <form onSubmit={saveEdit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <textarea
                  value={editingMemory.content}
                  onChange={(e) => setEditingMemory({ ...editingMemory, content: e.target.value })}
                  style={{ width: "100%", height: "100px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
                  required
                />
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setEditingMemory(null)}
                    style={{ padding: "8px 16px", backgroundColor: "#eee", color: "#666", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "8px 16px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {loading && <p style={{ textAlign: "center", color: "#888" }}>Loading memories...</p>}
            {!loading && memories.length === 0 && <p style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>No memories saved yet. Start by adding one above!</p>}
            {!loading && memories.map((m) => (
              <div key={m.id} style={{
                padding: "20px",
                backgroundColor: "#fff",
                border: "1px solid #eee",
                borderRadius: "12px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
                position: "relative",
                transition: "transform 0.2s",
                cursor: "default"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#aaa",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {m.type} &bull; Position {m.position}
                  </span>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => startEditing(m)}
                      style={{ color: "#0070f3", border: "none", background: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMemory(m.id)}
                      style={{ color: "#ff4d4f", border: "none", background: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  color: "#333",
                  fontStyle: m.type === "QUESTION" ? "normal" : "italic"
                }}>
                  {typeof m.content === 'string' ? m.content : (m.content as any).answer || JSON.stringify(m.content, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" }}>Loading Builder...</div>}>
      <ArchiveBuilderContent />
    </Suspense>
  );
}
