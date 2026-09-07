import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { modules, siteConfig } from "@/lib/site";

export default function BuyPage() {
  return (
    <main className="checkoutPage">
      <div className="checkoutNav container">
        <Link href="/" className="logo"><span className="logoMark">G</span><span>{siteConfig.creator}</span></Link>
        <span>SECURE PAYU CHECKOUT</span>
      </div>
      <div className="checkoutLayout container">
        <section className="checkoutLeft" data-reveal="left">
          <div className="eyebrow"><span /> ONE STEP AWAY</div>
          <h1>GET INSTANT ACCESS TO<br /><em>{siteConfig.courseName.toUpperCase()}</em></h1>
          <p>Enter your details and continue to PayU. After PayU confirms the payment, our server independently verifies it and unlocks the course only in this browser.</p>
          <div className="checkoutBenefits">
            {modules.slice(0, 4).map(([num, title]) => <div key={num}><b>{num}</b><span>{title}</span><i>✓</i></div>)}
          </div>
        </section>
        <aside className="orderCard" data-reveal="right">
          <span className="orderLabel">YOUR ORDER</span>
          <h2>{siteConfig.courseName}</h2>
          <p>Complete gaming creator growth system</p>
          <div className="orderLine"><span>Course access</span><span>{siteConfig.priceLabel}</span></div>
          <div className="orderLine muted"><span>Access type</span><span>This browser only</span></div>
          <div className="orderTotal"><span>Total</span><strong>{siteConfig.priceLabel}</strong></div>
          <CheckoutButton courseName={siteConfig.courseName} priceLabel={siteConfig.priceLabel} />
          <div className="secureNote">🔒 PayU handles payment details. The course unlocks only after server-side hash + transaction verification.</div>
          <div className="checkoutLegal">By paying, you agree to our <Link href="/terms">Terms</Link> and <Link href="/refund">Refund Policy</Link>.</div>
          <Link className="alreadyAccess" href="/opencourse">Already paid on this browser? Open course →</Link>
        </aside>
      </div>
    </main>
  );
}
