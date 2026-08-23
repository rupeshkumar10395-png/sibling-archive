import Header from "@/components/marketing/Header";
import Hero from "@/components/marketing/Hero";
import Statement from "@/components/marketing/Statement";
import Ritual from "@/components/marketing/Ritual";
import SiblingMagic from "@/components/marketing/SiblingMagic";
import ArchiveDemoSection from "@/components/marketing/ArchiveDemoSection";
import Seal from "@/components/marketing/Seal";
import FinalCTA from "@/components/marketing/FinalCTA";
import Footer from "@/components/marketing/Footer";
import ArchiveDemo from "@/components/archive/ArchiveDemo";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="start">
        <Hero />
        <Statement />
        <Ritual />
        <SiblingMagic />
        <ArchiveDemoSection />
        <Seal />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

// Keep the archive demo implementation isolated in its own component.
// The visual section is preserved in ArchiveDemoSection; mount the iframe there
// when the section is converted from reference HTML to JSX markup.
