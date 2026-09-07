import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  return (
    <LegalPage eyebrow="SUPPORT" title="CONTACT US">
      <h2>Course & payment support</h2>
      <p>For purchase, access, payment, or course questions, email <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.</p>
      <h2>When contacting us</h2>
      <p>Include your name, the contact used at checkout, and your PayU transaction ID if the question is payment-related. Never send your OTP, PIN, CVV, card password, or banking password.</p>
      <h2>Business</h2>
      <p>{siteConfig.legalName}</p>
    </LegalPage>
  );
}
