import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";

export default function LegalPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="legalPage">
      <header className="courseNav container">
        <Link href="/" className="logo"><span className="logoMark">G</span><span>{siteConfig.creator}</span></Link>
        <Link href="/buy" className="legalBuy">BUY COURSE →</Link>
      </header>
      <article className="legalContent container" data-reveal="">
        <div className="sectionNo">{eyebrow}</div>
        <h1>{title}</h1>
        <div className="legalBody">{children}</div>
      </article>
    </main>
  );
}
