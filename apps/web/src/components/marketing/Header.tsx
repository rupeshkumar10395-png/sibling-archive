export default function Header() {
  const html = '<header>\n  <div class="container nav">\n    <a href="#" class="logo" aria-label="WE WERE HERE home">\n      <span class="logo-mark">W</span>\n      <span class="logo-name">WE WERE HERE</span>\n      <span class="logo-sub">the sibling archive</span>\n    </a>\n    <nav class="nav-center">\n      <a href="#why">Why this exists</a>\n      <a href="#how">How it works</a>\n      <a href="#archive">See an archive</a>\n    </nav>\n    <a class="nav-cta" href="#start">Make ours ↗</a>\n  </div>\n</header>';
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
