import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className="container nav">
        <Link href="/" className="logo" aria-label="WE WERE HERE home">
          <span className="logo-mark">W</span>
          <span className="logo-name">WE WERE HERE</span>
          <span className="logo-sub">the sibling archive</span>
        </Link>
        <nav className="nav-center">
          <Link href="#why">Why this exists</Link>
          <Link href="#how">How it works</Link>
          <Link href="#archive">See an archive</Link>
        </nav>
        <Link className="nav-cta" href="/create"><span>Make ours ↗</span></Link>
      </div>
    </header>
  );
}
