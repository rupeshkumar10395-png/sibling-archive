"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CreateArchivePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<{ type: string; message: string }>(
    { type: "", message: "" }
  );
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef<NodeJS.Timeout | null>(null);
  const [dataArchiveId, setDataArchiveId] = useState<string>("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(""), 2600);
  };

  const handleSuccess = (id: string) => {
    setDataArchiveId(id);
    setShowOverlay(true);
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
      if (!data.archive?.id) {
        throw new Error("Missing archive ID in response");
      }
      setStatus({ type: "success", message: "Archive created successfully." });
      handleSuccess(data.archive.id);
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Failed to create archive" });
    } finally {
      setLoading(false);
    }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setStatus({ type: "", message: "" });
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600;6..96,700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Caveat:wght@500;600&display=swap");
        :root {
          --paper: #f5efe4;
          --paper-2: #fbf7ef;
          --ink: #1d1b18;
          --muted: #69645d;
          --line: rgba(29, 27, 24, 0.16);
          --coral: #ef5a4c;
          --yellow: #f3c94b;
          --pink: #f4c6c0;
          --tape: rgba(225, 191, 126, 0.48);
          --shadow: 0 28px 70px rgba(45, 35, 22, 0.13), 0 4px 12px rgba(45, 35, 22, 0.05);
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          color: var(--ink);
          background: radial-gradient(circle at 14% 24%, rgba(239, 90, 76, 0.045), transparent 23rem),
                      radial-gradient(circle at 86% 65%, rgba(243, 201, 75, 0.07), transparent 27rem),
                      var(--paper);
          font-family: "DM Sans", system-ui, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        body:before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.35;
          background-image: radial-gradient(rgba(30, 25, 18, 0.12) 0.7px, transparent 0.7px);
          background-size: 7px 7px;
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent 80%);
        }
        a { color: inherit; text-decoration: none; }
        button, input { font: inherit; }
        main { width: min(1240px, calc(100% - 44px)); margin: 0 auto; padding: clamp(54px, 8vw, 100px) 0 55px; }
        .paper {
          position: relative;
          border: 1px solid rgba(29, 27, 24, 0.09);
          border-radius: 26px;
          background: radial-gradient(circle at 25% 30%, rgba(29, 27, 24, 0.06) 0.8px, transparent 0.9px),
                      radial-gradient(circle at 75% 80%, rgba(29, 27, 24, 0.045) 0.7px, transparent 0.8px),
                      var(--paper-2);
          background-size: 11px 11px, 13px 13px, auto;
          box-shadow: var(--shadow);
          padding: clamp(42px, 6vw, 72px) clamp(26px, 6.5vw, 78px) 64px;
          min-height: 610px;
          isolation: isolate;
        }
        .paper:after { content: ""; position: absolute; inset: 13px; border: 1px solid rgba(29, 27, 24, 0.045); border-radius: 20px; pointer-events: none; }
        .tape { position: absolute; z-index: 4; width: 142px; height: 34px; background: var(--tape); filter: drop-shadow(0 2px 2px rgba(80, 50, 20, 0.07)); opacity: 0.8; }
        .tape.top { top: -17px; left: 50%; transform: translateX(-50%) rotate(-1.5deg); }
        .tape.top:after, .tape.side:after {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(90deg, transparent 0 7px, rgba(255, 255, 255, 0.18) 8px 9px);
        }
        .tape.side { width: 90px; height: 27px; right: -21px; top: 280px; transform: rotate(7deg); }
        .hero { display: grid; grid-template-columns: minmax(0, 0.88fr) minmax(390px, 1.12fr); gap: clamp(36px, 6vw, 82px); align-items: center; position: relative; z-index: 3; }
        .eyebrow { display: flex; align-items: center; gap: 10px; color: var(--coral); font: 500 12px "DM Mono", monospace; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 24px; }
        .eyebrow:before { content: ""; width: 9px; height: 9px; background: var(--coral); border-radius: 50%; }
        h1 { font-family: "Bodoni Moda", Georgia, serif; font-weight: 600; font-size: clamp(48px, 5.3vw, 76px); line-height: 0.93; letter-spacing: -0.062em; margin: 0; max-width: 620px; }
        h1 .accent { color: var(--coral); position: relative; white-space: nowrap; }
        h1 .accent:after { content: ""; position: absolute; left: 2px; right: 6px; bottom: -7px; height: 5px; background: var(--coral); opacity: 0.7; transform: rotate(-1.5deg); border-radius: 100%; }
        .lead { font-size: 17px; line-height: 1.62; color: #555149; max-width: 500px; margin: 22px 0 0; letter-spacing: -0.01em; }
        .doodle-heart { position: absolute; right: 7%; top: -12px; width: 48px; height: 48px; color: var(--coral); transform: rotate(10deg); }
        .doodle-heart svg { width: 100%; height: 100%; }
        .photo { position: absolute; width: 196px; padding: 10px 10px 38px; background: #fffdf8; box-shadow: 0 20px 34px rgba(40, 30, 18, 0.15), 0 2px 5px rgba(40, 30, 18, 0.06); z-index: 1; border: 1px solid rgba(29, 27, 24, 0.06); }
        .photo .scene { width: 100%; aspect-ratio: 1/1.08; overflow: hidden; position: relative; background: #ddd; }
        .photo .scene img { width: 100%; height: 100%; display: block; object-fit: cover; filter: saturate(0.86) contrast(0.94) sepia(0.05); }
        .photo .scene:after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 45%, rgba(25, 18, 10, 0.08)); pointer-events: none; }
        .photo .caption { position: absolute; bottom: 11px; left: 13px; font: 10px "DM Mono", monospace; letter-spacing: 0.08em; color: #585149; }
        .photo.one { right: -72px; top: 78px; transform: rotate(6.5deg); }
        .photo.two { right: 112px; top: 205px; transform: rotate(-5deg); z-index: 2; }
        .form-wrap { margin-top: 48px; position: relative; z-index: 5; border-top: 1px dashed rgba(29, 27, 24, 0.17); padding-top: 38px; }
        .form-layout { display: grid; grid-template-columns: minmax(0, 1fr) 215px; gap: 34px; align-items: end; }
        .field-label { display: block; font: 500 12px "DM Mono", monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #5d5850; margin-bottom: 13px; }
        .field-label .heart { color: var(--coral); font-size: 18px; margin-left: 5px; }
        .input { width: 100%; height: 72px; border: 1px solid rgba(29, 27, 24, 0.27); border-radius: 10px; padding: 0 20px; background: rgba(255, 255, 255, 0.42); color: var(--ink); font-size: 19px; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
        .input::placeholder { color: #97938d; }
        .input:focus { border-color: var(--ink); background: #fffdf8; box-shadow: 0 0 0 4px rgba(239, 90, 76, 0.09); }
        .hint { margin: 12px 0 0; color: #716b63; font-size: 13px; }
        .create-row { display: flex; align-items: center; gap: 23px; margin-top: 27px; }
        .create { border: 0; cursor: pointer; background: var(--ink); color: #fff; min-width: 310px; height: 60px; padding: 0 25px; border-radius: 8px; font: 500 13px "DM Mono", monospace; letter-spacing: 0.1em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 17px; box-shadow: 4px 4px 0 rgba(29, 27, 24, 0.14); transition: transform 0.2s, box-shadow 0.2s, background 0.2s; }
        .create:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 rgba(29, 27, 24, 0.14); }
        .create:active { transform: translate(0, 0); box-shadow: 2px 2px 0 rgba(29, 27, 24, 0.14); }
        .create:disabled { cursor: wait; opacity: 0.75; transform: none; }
        .arrow { font-size: 20px; line-height: 0; }
        .annotation { font-family: "Caveat", "Bradley Hand", cursive; font-size: 17px; line-height: 1.2; color: #26221e; transform: rotate(-2deg); max-width: 180px; position: relative; }
        .annotation:before { content: "↔"; position: absolute; left: -55px; top: 2px; font-family: Arial, sans-serif; font-size: 25px; }
        .annotation .coral { color: var(--coral); }
        .note { align-self: start; background: var(--pink); padding: 23px 20px 25px; min-height: 132px; box-shadow: 4px 8px 15px rgba(70, 40, 35, 0.13); transform: rotate(3deg); position: relative; }
        .note:before { content: ""; position: absolute; width: 74px; height: 20px; top: -12px; left: 50%; transform: translateX(-50%) rotate(-2deg); background: rgba(225, 191, 126, 0.53); }
        .note p { margin: 0; font-family: "Caveat", "Bradley Hand", cursive; font-size: 16px; line-height: 1.5; }
        .note .mini-heart { color: var(--coral); font-size: 21px; }
        .features { margin-top: 42px; padding-top: 24px; border-top: 1px solid var(--line); display: grid; grid-template-columns: repeat(3, 1fr); opacity: 0.9; }
        .feature { padding: 0 35px; min-height: 80px; display: grid; grid-template-columns: 42px 1fr; gap: 15px; align-items: start; border-right: 1px dashed rgba(29, 27, 24, 0.2); }
        .feature:first-child { padding-left: 0; }
        .feature:last-child { border-right: 0; padding-right: 0; }
        .icon { width: 39px; height: 39px; border: 1px solid var(--ink); border-radius: 50%; display: grid; place-items: center; font-size: 19px; background: rgba(255, 255, 255, 0.25); }
        .feature h3 { font-size: 15px; margin: 2px 0 6px; letter-spacing: -0.02em; }
        .feature p { margin: 0; font-size: 13px; line-height: 1.5; color: #716b63; }
        .bottom-heart { text-align: center; margin: 27px auto 0; color: var(--coral); font-size: 22px; font-family: cursive; }
        .status { margin-top: 18px; min-height: 0; overflow: hidden; transition: all 0.35s ease; }
        .status-box { display: none; border: 1px solid rgba(29, 27, 24, 0.16); border-radius: 10px; padding: 15px 17px; font-size: 13px; background: rgba(255, 255, 255, 0.45); }
        .status.loading .status-box, .status.success .status-box, .status.error .status-box { display: flex; align-items: center; gap: 11px; }
        .status.loading .status-box { color: #5d5850; }
        .status.success .status-box { border-color: rgba(74, 128, 83, 0.3); }
        .status.error .status-box { border-color: rgba(196, 65, 56, 0.3); color: #9b3c35; }
        .spinner { width: 17px; height: 17px; border: 2px solid rgba(29, 27, 24, 0.18); border-top-color: var(--ink); border-radius: 50%; animation: spin 0.7s linear infinite; flex: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .success-dot, .error-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
        .success-dot { background: #56875d; }
        .error-dot { background: var(--coral); }
        .toast { position: fixed; left: 50%; bottom: 25px; transform: translate(-50%, 20px); opacity: 0; pointer-events: none; background: var(--ink); color: #fff; border-radius: 999px; padding: 13px 18px; font-size: 13px; z-index: 100; transition: 0.3s ease; box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2); }
        .toast.show { opacity: 1; transform: translate(-50%, 0); }
        .success-overlay { position: fixed; inset: 0; display: none; place-items: center; background: rgba(245, 239, 228, 0.86); backdrop-filter: blur(12px); z-index: 90; padding: 20px; }
        .success-overlay.show { display: grid; }
        .success-card { width: min(520px, 100%); background: var(--paper-2); border: 1px solid rgba(29, 27, 24, 0.12); border-radius: 22px; padding: 44px; box-shadow: var(--shadow); text-align: center; position: relative; }
        .success-card:before { content: ""; position: absolute; top: -12px; left: 50%; width: 110px; height: 25px; background: var(--tape); transform: translateX(-50%) rotate(-2deg); }
        .success-symbol { width: 62px; height: 62px; border-radius: 50%; margin: 0 auto 22px; background: var(--yellow); border: 1px solid var(--ink); display: grid; place-items: center; font-size: 29px; }
        .success-card h2 { font: 600 45px/1 "Bodoni Moda", Georgia, serif; letter-spacing: -0.05em; margin: 0 0 15px; }
        .success-card p { color: var(--muted); line-height: 1.6; margin: 0 auto 26px; max-width: 390px; }
        .success-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 25px 0; }
        .success-detail { text-align: left; padding: 12px 13px; border: 1px solid rgba(29, 27, 24, 0.1); border-radius: 10px; background: rgba(255, 255, 255, 0.45); }
        .success-detail span { display: block; font: 500 9px "DM Mono", monospace; text-transform: uppercase; letter-spacing: 0.12em; color: #777067; margin-bottom: 5px; }
        .success-detail strong { font-size: 13px; font-weight: 600; }
        .success-actions { display: flex; gap: 10px; justify-content: center; }
        .primary-success, .secondary-success { border-radius: 999px; padding: 12px 18px; cursor: pointer; font-size: 13px; }
        .primary-success { background: var(--ink); color: #fff; border: 1px solid var(--ink); }
        .secondary-success { background: transparent; color: var(--ink); border: 1px solid rgba(29, 27, 24, 0.25); }
        .success-card .hand-note { font: 500 20px/1 "Caveat", "Bradley Hand", cursive; color: var(--coral); transform: rotate(-2deg); margin-top: 18px; }
        .field-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; color: #777067; font-size: 11px; font-family: "DM Mono", monospace; letter-spacing: 0.03em; }
        .field-meta .privacy { display: inline-flex; align-items: center; gap: 6px; }
        .field-meta .privacy:before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #5f8a63; }
        .form-card-label { display: inline-flex; align-items: center; gap: 8px; font: 500 10px "DM Mono", monospace; letter-spacing: 0.14em; text-transform: uppercase; color: #777067; margin-bottom: 12px; }
        .form-card-label:before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--coral); }
        .form-panel { background: rgba(255, 253, 248, 0.68); border: 1px solid rgba(29, 27, 24, 0.14); border-radius: 14px; padding: 24px 24px 22px; box-shadow: 0 10px 24px rgba(40, 30, 18, 0.055); }
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; }
          .visual-space { height: 150px; position: relative; }
          .photo.one { right: 3%; top: 10px; }
          .photo.two { right: 30%; top: 65px; }
          .doodle-heart { right: 4%; top: 0; }
          .form-layout { grid-template-columns: 1fr; }
          .note { width: min(280px, 100%); justify-self: end; }
        }
        @media (max-width: 640px) {
          main { width: calc(100% - 24px); padding: 30px 0; }
          .paper { padding: 34px 22px 35px; border-radius: 20px; min-height: auto; }
          .paper:after { inset: 9px; border-radius: 15px; }
          h1 { font-size: 54px; line-height: 0.94; }
          .lead { font-size: 16px; line-height: 1.55; }
          .photo { width: 135px; padding: 8px 8px 31px; }
          .photo .caption { font-size: 7px; bottom: 8px; left: 10px; }
          .photo.one { right: -17px; top: 128px; }
          .photo.two { right: 29%; top: 185px; }
          .visual-space { height: 190px; }
          .form-wrap { margin-top: 24px; padding-top: 32px; }
          .input { height: 60px; font-size: 17px; }
          .create-row { display: block; }
          .create { width: 100%; min-width: 0; }
          .annotation { margin: 21px 0 0 62px; }
          .annotation:before { left: -46px; }
          .note { margin-top: 8px; }
          .form-panel { padding: 20px 18px 18px; }
          .field-meta { gap: 12px; align-items: flex-start; }
          .field-meta .privacy { flex: none; }
          .success-details { grid-template-columns: 1fr; }
          .success-actions { flex-direction: column; }
          .features { grid-template-columns: 1fr; gap: 0; }
          .feature, .feature:first-child, .feature:last-child { padding: 19px 0; border-right: 0; border-bottom: 1px dashed rgba(29, 27, 24, 0.2); }
          .feature:last-child { border-bottom: 0; }
          .tape.side { right: -8px; top: 300px; }
          .success-card { padding: 36px 24px; }
          .success-card h2 { font-size: 38px; }
        }
        @media (max-width: 430px) {
          .photo { width: 120px; padding: 8px 8px 30px; }
          .photo.one { right: -10px; top: 80px; }
          .photo.two { right: 20%; top: 160px; }
          .visual-space { height: 220px; }
          h1 { font-size: 48px; }
          .lead { font-size: 15px; }
        }
      `}</style>
      <main>
        <section className="paper" aria-labelledby="page-title">
          <span className="tape top"></span>
          <span className="tape side"></span>

          <div className="hero">
            <div>
              <div className="eyebrow">New archive</div>
              <h1 id="page-title">
                Make a little<br />
                world of <span className="accent">yours.</span>
              </h1>
              <p className="lead">
                A private place for the photos, stories, inside jokes and tiny
                moments that belong to just the two of you.
              </p>
              <div className="doodle-heart" aria-hidden="true">
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

            <div className="visual-space" aria-hidden="true">
              <div className="photo one">
                <div className="scene">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=85"
                    alt="Two friends laughing together outdoors"
                  />
                </div>
                <span className="caption">somewhere / 2018</span>
              </div>
              <div className="photo two">
                <div className="scene">
                  <img
                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=85"
                    alt="Friends sharing a memory"
                  />
                </div>
                <span className="caption">camera roll / 2014</span>
              </div>
            </div>
          </div>

          <div className="form-wrap" id="archive-form">
            <div className="form-layout">
              <form id="createForm" className="form-panel" onSubmit={handleSubmitModified} noValidate>
                <div className="form-card-label">Your first page</div>
                <label className="field-label" htmlFor="archiveTitle">
                  What should we call this chapter?<span className="heart">♡</span>
                </label>
                <input
                  className="input"
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
                <div className="field-meta">
                  <span id="titleHint">Give it a name you'll smile at later.</span>
                  <span className="privacy">Private</span>
                </div>

                <div className="create-row">
                  <button
                    className="create"
                    id="createButton"
                    type="submit"
                    disabled={loading}
                  >
                    <span className="button-text">{loading ? "Creating..." : "Create Archive"}</span>
                    <span className="arrow">{loading ? "…" : "↗"}</span>
                  </button>

                  <div className="annotation">
                    this is just<br />
                    <span className="coral">between you two.</span> ♡
                  </div>
                </div>

                <div className="status" id="formStatus" aria-live="polite">
                  <div className="status-box">
                    {status.type === "loading" && (
                      <><span className="spinner" />{status.message}</>
                    )}
                    {status.type === "success" && (
                      <><span className="success-dot" />{status.message}</>
                    )}
                    {status.type === "error" && (
                      <><span className="error-dot" />{status.message}</>
                    )}
                  </div>
                </div>
              </form>

              <aside className="note">
                <p>
                  the little things<br />
                  no one else<br />
                  would get.
                  <span className="mini-heart">♡</span>
                </p>
              </aside>
            </div>
          </div>

          <div className="features">
            <article className="feature">
              <div className="icon">♡</div>
              <div>
                <h3>Only the two of you</h3>
                <p>Completely private. Always.</p>
              </div>
            </article>
            <article className="feature">
              <div className="icon">⌕</div>
              <div>
                <h3>You both hold the key</h3>
                <p>Share. Build. Remember. Together.</p>
              </div>
            </article>
            <article className="feature">
              <div className="icon">✦</div>
              <div>
                <h3>Made for the weird stuff</h3>
                <p>The funny, tiny moments that matter.</p>
              </div>
            </article>
          </div>
          <div className="bottom-heart" aria-hidden="true">— ♡ —</div>
        </section>
      </main>

      <div id="toast" role="status" className={toastMessage ? "toast show" : "toast"}>
        {toastMessage}
      </div>

      <div className={`success-overlay ${showOverlay ? "show" : ""}`} id="successOverlay" role="dialog" aria-modal="true" aria-labelledby="successTitle">
        <div className="success-card">
          <div className="success-symbol">✓</div>
          <div className="eyebrow" style={{ justifyContent: "center", marginBottom: "16px" }}>
            Archive created
          </div>
          <h2 id="successTitle">It's yours now.</h2>
          <p id="successCopy">
            Your private little corner is ready. Keep the key somewhere safe and
            start filling the pages.
          </p>

          <div className="success-details">
            <div className="success-detail">
              <span>Archive</span>
              <strong id="successArchiveName">{title}</strong>
            </div>
            <div className="success-detail">
              <span>Access</span>
              <strong>Private · Just you two</strong>
            </div>
          </div>

          <div className="success-actions">
            <button className="primary-success" onClick={() => {
              router.push(`/archive-created?archiveId=${encodeURIComponent(dataArchiveId)}`);
            }}>Open archive ↗</button>
            <button className="secondary-success" onClick={closeOverlay}>Stay here</button>
          </div>
          <div className="hand-note">the good stuff starts here. ♡</div>
        </div>
      </div>
    </>
  );
}
