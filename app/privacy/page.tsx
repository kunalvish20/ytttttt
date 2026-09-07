import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="LEGAL — 02" title="PRIVACY POLICY">
      <h2>Information processed</h2>
      <p>When you purchase the course, payment and checkout information may be processed by PayU. This website may receive payment identifiers and limited transaction data needed to verify your purchase and provide course access.</p>
      <h2>Payment information</h2>
      <p>Card, UPI, net-banking, wallet, and other sensitive payment credentials are handled by PayU&apos;s checkout. This website does not intentionally store your full card or bank credentials.</p>
      <h2>Cookies</h2>
      <p>After a valid purchase, the website stores secure HttpOnly cookies used to remember and validate paid course access. These cookies are necessary for the protected course area to work.</p>
      <h2>Sharing</h2>
      <p>We do not sell your personal information. Data may be processed by service providers used to operate the website, payment flow, hosting, analytics, or customer support.</p>
      <h2>Contact</h2>
      <p>For privacy questions, email <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.</p>
    </LegalPage>
  );
}
