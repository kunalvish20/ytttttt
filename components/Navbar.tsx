import Link from "next/link";
import BuyButton from "./BuyButton";
import { siteConfig } from "@/lib/site";

export default function Navbar() {
  return (
    <header className="navWrap">
      <nav className="nav container">
        <Link href="/" className="logo">
          <span className="logoMark">G</span>
          <span>{siteConfig.creator}</span>
        </Link>
        <div className="navLinks">
          <Link href="/#learn">What you'll learn</Link>
          <Link href="/#modules">Modules</Link>
          <Link href="/#faq">FAQ</Link>
        </div>
        <BuyButton label="BUY COURSE" className="navBuy" />
      </nav>
    </header>
  );
}
