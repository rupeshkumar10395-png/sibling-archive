"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";

type Memory = {
  id: string;
  archiveId: string;
  type: string;
  content: any;
  position: number;
};

type Archive = {
  id: string;
  title: string;
  slug: string;
};

function ArchivePublicView() {
  const params = useParams();
  const slug = params.slug as string;

  const [archive, setArchive] = useState<Archive | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchArchiveData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Archive metadata by slug
        const archiveRes = await fetch(`${API_BASE_URL}/archives/slug/${slug}`);
        if (!archiveRes.ok) {
          throw new Error(archiveRes.status === 404 ? "Archive not found." : "Failed to load archive.");
        }
        const archiveData = await archiveRes.json();
        setArchive(archiveData);

        // 2. Fetch Memories for this archive
        const memoriesRes = await fetch(`${API_BASE_URL}/archives/${archiveData.id}/memories`);
        if (!memoriesRes.ok) {
          throw new Error("Failed to load memories.");
        }
        const memoriesData = await memoriesRes.json();
        setMemories(memoriesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArchiveData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif", color: "#666" }}>
        <p>Gathering memories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif", color: "#c62828" }}>
        <h2>Oops!</h2>
        <p>{error}</p>
        <a href="/" style={{ color: "#0070f3", textDecoration: "none", fontWeight: "bold" }}>Return Home</a>
      </div>
    );
  }

  if (!archive) return null;

  return (
    <div style={{ maxWidth: "700px", margin: "60px auto", padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#333" }}>
      <header style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "36px", color: "#222", marginBottom: "10px" }}>{archive.title}</h1>
        <div style={{ width: "60px", height: "4px", backgroundColor: "#0070f3", margin: "0 auto" }}></div>
        <p style={{ marginTop: "20px", fontSize: "18px", color: "#666", fontStyle: "italic" }}>
          A collection of memories shared between siblings.
        </p>
      </header>

      <main style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {memories.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>This archive is currently empty.</p>
        ) : (
          memories.map((m, index) => (
            <div key={m.id} style={{
              padding: "30px",
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              border: "1px solid #f0f0f0",
              position: "relative"
            }}>
              <div style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#bbb",
                textTransform: "uppercase",
                marginBottom: "15px",
                display: "block"
              }}>
                Memory #{index + 1} {m.type === "QUESTION" ? "• Q&A" : `• ${m.type}`}
              </div>
              <div style={{
                fontSize: "20px",
                lineHeight: "1.6",
                color: "#333",
                whiteSpace: "pre-wrap"
              }}>
                {typeof m.content === 'string' ? m.content : (m.content as any).answer || JSON.stringify(m.content, null, 2)}
              </div>
            </div>
          ))
        )}
      </main>

      <footer style={{ textAlign: "center", marginTop: "80px", paddingBottom: "40px", color: "#aaa", fontSize: "14px" }}>
        <p>© {new Date().getFullYear()} Sibling Archive</p>
      </footer>
    </div>
  );
}

export default function PublicArchivePage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" }}>Loading Archive...</div>}>
      <ArchivePublicView />
    </Suspense>
  );
}
