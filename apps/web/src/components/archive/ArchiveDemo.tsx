"use client";

import { useEffect, useRef } from "react";

export default function ArchiveDemo() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const fit = () => {
      try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        const height = Math.max(
          doc?.documentElement?.scrollHeight ?? 0,
          doc?.body?.scrollHeight ?? 0,
          900
        );
        frame.style.height = `${height + 12}px`;
      } catch {
        frame.style.height = window.innerWidth < 600 ? "1650px" : "1500px";
      }
    };

    frame.addEventListener("load", fit);
    const timers = [250, 900].map((ms) => window.setTimeout(fit, ms));
    window.addEventListener("resize", fit);

    return () => {
      frame.removeEventListener("load", fit);
      timers.forEach(window.clearTimeout);
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      id="siblingDemo"
      title="Rupesh × Kashish — The Sibling Archive"
      src="/archive-demo/index.html"
      loading="lazy"
      scrolling="no"
      aria-label="Interactive Rupesh and Kashish sibling archive demo"
      style={{ display: "block", width: "100%", height: "1500px", border: 0, background: "#f4ead7" }}
    />
  );
}
