export default function Footer() {
  const html = '<footer>\n  <div class="container footer">\n    <div><strong>WE WERE HERE</strong> — the sibling archive</div>\n    <div class="mono">made for two · 2026</div>\n  </div>\n</footer>';
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
