"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Header from "@/components/marketing/Header";
import styles from "./page.module.css";

export default function CreateArchivePage() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(""), 2600);
  };

  const handleSubmitModified = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setStatus({ type: "error", message: "Give your archive a name first." });
      showToast("A little name first ♡");
      return;
    }
    if (trimmed.length < 2) {
      setStatus({ type: "error", message: "That name is a little too short." });
      return;
    }
    setLoading(true);
    setStatus({ type: "loading", message: "Putting the first page together..." });
    try {
      const response = await fetch(`${API_BASE}/archives`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || `Error ${response.status}`);
      }
      // Success: show simple confirmation
      setStatus({ type: "success", message: "Archive created successfully!" });
      // optionally keep data for future use
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Failed to create archive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createArchivePage}>
      <Header />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600;6..96,700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Caveat:wght@500;600&display=swap"
        rel="stylesheet"
      />

      <div className={styles.grain} />

      <main className={styles.mainContent}>
        <section className={styles.paper} aria-labelledby="page-title">
          <span className={`${styles.tape} ${styles.tapeTop}`}></span>
          <span className={`${styles.tape} ${styles.tapeSide}`}></span>

          <div className={styles.hero}>
            <div>
              <div className={styles.eyebrow}>New archive</div>
              <h1 id="page-title" className={styles.pageTitle}>
                Make a little<br />
                world of <span className={styles.accent}>yours.</span>
              </h1>
              <p className={styles.lead}>
                A private place for the photos, stories, inside jokes and tiny
                moments that belong to just the two of you.
              </p>
              <div className={styles.doodleHeart} aria-hidden="true">
                <svg viewBox="0 0 60 60" fill="none">
                  <path
                    d="M30 49C27 43 12 35 12 23C12 16 18 12 23 15C27 17 29 21 30 23C31 21 33 17 37 15C42 12 48 16 48 23C48 35 33 43 30 49Z"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.visualSpace} aria-hidden="true">
              <div className={`${styles.photo} ${styles.photoOne}`}>
                <div className={styles.photoScene}>
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=85"
                    alt="Two friends laughing together outdoors"
                  />
                </div>
                <span className={styles.photoCaption}>somewhere / 2018</span>
              </div>
              <div className={`${styles.photo} ${styles.photoTwo}`}>
                <div className={styles.photoScene}>
                  <img
                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=85"
                    alt="Friends sharing a memory"
                  />
                </div>
                <span className={styles.photoCaption}>camera roll / 2014</span>
              </div>
            </div>
          </div>

          <div className={styles.formWrap} id="archive-form">
            <div className={styles.formLayout}>
              <form id="createForm" className={styles.formPanel} onSubmit={handleSubmitModified} noValidate>
                <div className={styles.formCardLabel}>Your first page</div>
                <label className={styles.fieldLabel} htmlFor="archiveTitle">
                  What should we call this chapter?<span className={styles.fieldLabelHeart}>♡</span>
                </label>
                <input
                  className={styles.inputField}
                  id="archiveTitle"
                  name="archiveTitle"
                  type="text"
                  maxLength={80}
                  autoComplete="off"
                  placeholder="e.g. The Chaos Years"
                  aria-describedby="titleHint formStatus"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <div className={styles.fieldMeta}>
                  <span id="titleHint">Give it a name you'll smile at later.</span>
                  <span className={styles.fieldMetaPrivacy}>Private</span>
                </div>

                <div className={styles.createRow}>
                  <button
                    className={styles.createButton}
                    id="createButton"
                    type="submit"
                    disabled={loading}
                  >
                    <span className={styles.buttonText}>{loading ? "Creating..." : "Create Archive"}</span>
                    <span className={styles.arrow}>{loading ? "…" : "↗"}</span>
                  </button>

                  <div className={styles.annotation}>
                    this is just<br />
                    <span className={styles.annotationCoral}>between you two.</span> ♡
                  </div>
                </div>

                <div className={`${styles.status} ${status.type ? styles[status.type] : ""}`} id="formStatus" aria-live="polite">
                  <div className={styles.statusBox}>
                    {status.type === "loading" && (<><span className={styles.spinner} />{status.message}</>)}
                    {status.type === "success" && (<><span className={styles.successDot} />{status.message}</>)}
                    {status.type === "error" && (<><span className={styles.errorDot} />{status.message}</>)}
                  </div>
                </div>
              </form>

              <aside className={styles.note}>
                <p>
                  the little things<br />
                  no one else<br />
                  would get.
                  <span className={styles.noteMiniHearth}>♡</span>
                </p>
              </aside>
            </div>
          </div>

          <div className={styles.features}>
            <article className={styles.feature}>
              <div className={styles.icon}>♡</div>
              <div>
                <h3 className={styles.featureTitle}>Only the two of you</h3>
                <p className={styles.featureText}>Completely private. Always.</p>
              </div>
            </article>
            <article className={styles.feature}>
              <div className={styles.icon}>⌕</div>
              <div>
                <h3 className={styles.featureTitle}>You both hold the key</h3>
                <p className={styles.featureText}>Share. Build. Remember. Together.</p>
              </div>
            </article>
            <article className={styles.feature}>
              <div className={styles.icon}>✦</div>
              <div>
                <h3 className={styles.featureTitle}>Made for the weird stuff</h3>
                <p className={styles.featureText}>The funny, tiny moments that matter.</p>
              </div>
            </article>
          </div>
          <div className={styles.bottomHeart} aria-hidden="true">— ♡ —</div>
        </section>
      </main>

      <div id="toast" role="status" className={`${styles.toast} ${toastMessage ? styles.toastShow : ""}`}>
        {toastMessage}
      </div>
    </div>
  );
}
