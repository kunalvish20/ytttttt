import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/site";

export default function TermsPage() {
  return (
    <LegalPage eyebrow="LEGAL — 01" title="TERMS & CONDITIONS">
      <h2>1. Digital course purchase</h2>
      <p>By purchasing {siteConfig.courseName}, you receive a personal, non-transferable right to access the digital course content made available by {siteConfig.legalName}.</p>
      <h2>2. Paid access</h2>
      <p>Course access is provided only after the payment has been successfully verified. Access may be withheld when a payment is failed, reversed, refunded, disputed, fraudulent, or cannot be verified.</p>
      <h2>3. Personal use only</h2>
      <p>You may not resell, redistribute, publicly upload, screen-record for redistribution, share paid lesson links, or provide your access credentials or entitlement to another person.</p>
      <h2>4. Educational information</h2>
      <p>The course is educational material. Results on YouTube or any other platform are not guaranteed and depend on execution, market conditions, platform changes, and other factors outside our control.</p>
      <h2>5. Platform availability</h2>
      <p>We may update lessons, technology, hosting, or course structure. Temporary interruptions may occur for maintenance, provider outages, security verification, or technical issues.</p>
      <h2>6. Contact</h2>
      <p>Questions about these terms can be sent to <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.</p>
    </LegalPage>
  );
}
