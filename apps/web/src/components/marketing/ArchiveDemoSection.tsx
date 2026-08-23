import ArchiveDemo from "@/components/archive/ArchiveDemo";

export default function ArchiveDemoSection() {
  const before = '<div class="demo-intro">\n      <div>\n        <div class="section-kicker">A real finished archive</div>\n        <h2 class="section-title">This is what it becomes.</h2>\n        <p class="section-lead">Not a dashboard. Not a profile. Not a folder full of uploads. A little world made out of the two of you.</p>\n      </div>\n      <div class="hand-note">Scroll through the actual Rupesh × Kashish demo →</div>\n    </div>\n\n    ';
  const after = '\n    <div class="demo-caption">\n      <span>Rupesh × Kashish / archive 2011 → 2026</span>\n      <span>the complete demo lives right here</span>\n    </div>';

  return (
    <section className="demo-wrap" id="archive">
      <div className="container">
        <div dangerouslySetInnerHTML={{ __html: before }} />
        <div className="demo-frame">
          <ArchiveDemo />
        </div>
        <div dangerouslySetInnerHTML={{ __html: after }} />
      </div>
    </section>
  );
}
