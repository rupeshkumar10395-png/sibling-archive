export default function FinalCTA() {
  const html = '<section class="final">\n  <div class="container">\n    <div class="section-kicker">For the person who remembers too</div>\n    <h2>Keep your version of growing up.</h2>\n    <p>Because someday the details get fuzzy. The archive is a small way of saying: we were here. We remember.</p>\n    <a class="primary" href="#start">Make our archive <span>↗</span></a>\n  </div>\n</section>';
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
