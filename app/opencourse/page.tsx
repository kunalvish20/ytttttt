import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import VideoFrame from "@/components/VideoFrame";
import {
  ACCESS_COOKIE,
  COURSE_SLUG,
  DEVICE_COOKIE,
  readSignedToken,
  type CourseAccessToken,
} from "@/lib/access";
import {
  payUPaymentIsActiveSuccess,
  payUPaymentMatchesCourse,
  verifyPayUPayment,
} from "@/lib/payu";
import { modules, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const courseVideos = [
  {
    number: "01",
    title: "Complete Gaming Channel Growth System",
    description: "Start here and watch the full training from beginning to end.",
    url: "https://youtu.be/IAU1iMMfzV8?si=5pvqCjXMAWsSERhc",
    duration: "FULL LESSON",
  },
] as const;

export const metadata: Metadata = {
  title: `Course | ${siteConfig.courseName}`,
  robots: { index: false, follow: false, nocache: true },
};

function LockedCourse({ message }: { message?: string }) {
  return (
    <main className="lockedPage">
      <div className="lockedCard" data-reveal="">
        <div className="lockBadge">PAID ACCESS ONLY</div>
        <div className="lockIcon" aria-hidden="true">LOCK</div>
        <span className="sectionNo">PROTECTED COURSE AREA</span>
        <h1>THIS CONTENT IS <em>LOCKED.</em></h1>
        <p>{message || "This browser does not have a verified paid course entitlement. Complete payment on this device to unlock the course."}</p>
        <Link className="buyButton" href="/buy"><span>UNLOCK THE COURSE</span><span>-&gt;</span></Link>
        <Link className="backHome" href="/">Back to website</Link>
      </div>
    </main>
  );
}

function VerificationUnavailable() {
  return (
    <main className="lockedPage">
      <div className="lockedCard" data-reveal="">
        <div className="lockBadge warning">SECURE VERIFICATION</div>
        <span className="sectionNo">ACCESS NOT RENDERED</span>
        <h1>WE COULDN&apos;T VERIFY <em>ACCESS.</em></h1>
        <p>For security, the course stays hidden whenever PayU verification is temporarily unavailable. Try again in a moment.</p>
        <Link className="buyButton" href="/opencourse"><span>TRY AGAIN</span><span>RELOAD</span></Link>
        <Link className="backHome" href="/contact">Need help? Contact support</Link>
      </div>
    </main>
  );
}

export default async function OpenCoursePage() {
  const cookieStore = await cookies();
  const access = readSignedToken<CourseAccessToken>(cookieStore.get(ACCESS_COOKIE)?.value);
  const deviceId = cookieStore.get(DEVICE_COOKIE)?.value || "";

  if (!access || access.v !== 2 || access.course !== COURSE_SLUG || !deviceId || access.deviceId !== deviceId) {
    return <LockedCourse />;
  }

  let payment;
  try {
    payment = await verifyPayUPayment(access.orderId);
  } catch (error) {
    console.error("COURSE_PAYMENT_RECHECK_FAILED", error instanceof Error ? error.message : error);
    return <VerificationUnavailable />;
  }

  if (!payUPaymentMatchesCourse(payment, { txnid: access.orderId, amount: access.amount })) {
    return <LockedCourse message="The stored entitlement does not match the verified PayU transaction." />;
  }

  if (!payUPaymentIsActiveSuccess(payment)) {
    return <LockedCourse message="This PayU transaction is not currently a successful active payment, so course access remains locked." />;
  }

  return (
    <main className="coursePage">
      <header className="courseNav container">
        <Link href="/" className="logo"><span className="logoMark">G</span><span>{siteConfig.creator}</span></Link>
        <div><span className="accessDot" /> VERIFIED PAID ACCESS</div>
      </header>

      <section className="courseHero container" data-reveal="">
        <div className="sectionNo">WELCOME TO THE COURSE</div>
        <h1>YOUR GAMING CHANNEL<br /><em>GROWTH SYSTEM.</em></h1>
        <p>This course is unlocked only in the browser that completed the verified PayU payment. Keep this browser data intact to retain access.</p>
        <div className="courseAccessMeta">
          <span>PAYMENT VERIFIED</span>
          <span>THIS BROWSER ONLY</span>
          <span>PRIVATE COURSE AREA</span>
        </div>
      </section>

      <section className="singleCourse container" data-reveal="">
        <div className="singleCourseMeta">
          <span className="sectionNo">COMPLETE COURSE VIDEO</span>
          <h2>{siteConfig.courseName}</h2>
          <p>Watch the lesson below, then use the module map as your implementation checklist.</p>
        </div>

        <div className="courseVideoList" data-stagger="">
          {courseVideos.map((video) => (
            <article className="courseVideoCard" key={video.number}>
              <div className="courseVideoCardTop">
                <span>{video.number}</span>
                <small>{video.duration}</small>
              </div>
              <div className="courseVideoShell">
                <div className="videoTopbar">
                  <div className="dots" aria-hidden="true"><i /><i /><i /></div>
                  <span>PRIVATE LESSON PLAYER</span>
                  <b>VERIFIED</b>
                </div>
                <VideoFrame url={video.url} title={video.title} locked />
              </div>
              <div className="courseVideoText">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="courseOutline container" data-stagger="">
        {modules.map(([num, title, desc]) => (
          <article className="courseOutlineItem" key={num}>
            <span>{num}</span>
            <div><h3>{title}</h3><p>{desc}</p></div>
          </article>
        ))}
      </section>

      <section className="courseFooter container" data-reveal="">
        <div>
          <span className="sectionNo">YOU&apos;VE GOT THE SYSTEM</span>
          <h2>NOW GO <em>SHIP.</em></h2>
        </div>
        <Link href="/" className="backHome">Back to main website</Link>
      </section>
    </main>
  );
}
