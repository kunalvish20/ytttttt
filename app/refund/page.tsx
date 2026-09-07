import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/site";

export default function RefundPage() {
  return (
    <LegalPage eyebrow="LEGAL — 03" title="REFUND POLICY">
      <h2>Digital course purchases</h2>
      <p>Refund eligibility for {siteConfig.courseName} is handled according to the refund terms displayed at the time of purchase and applicable law. Because this is digital educational content that can be accessed immediately, refund requests may be reviewed before approval.</p>
      <h2>How to request a refund</h2>
      <p>Email <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> with the email/contact used during checkout and your PayU transaction ID. Do not send card numbers, UPI PINs, OTPs, or banking passwords.</p>
      <h2>Approved refunds</h2>
      <p>If a refund is approved and the PayU payment becomes refunded, protected course access may be revoked automatically when the website re-validates the payment.</p>
      <h2>Payment failures</h2>
      <p>If money is debited but the payment does not complete, contact your payment provider or PayU as appropriate and also contact us so we can review the transaction status.</p>
    </LegalPage>
  );
}
