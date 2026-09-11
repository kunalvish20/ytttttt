import BuyButton from "@/components/BuyButton";
import Navbar from "@/components/Navbar";
import VideoFrame from "@/components/VideoFrame";
import { defaultVideoUrl, modules, siteConfig } from "@/lib/site";

const proof = ["Idea Strategy", "Thumbnail Systems", "Retention Editing", "Channel Analytics"];
const outcomes = [
  ["01", "Stop guessing", "Know what kind of gaming videos to make, who they are for, and why the idea deserves the click."],
  ["02", "Package better", "Turn strong ideas into title + thumbnail combinations that create curiosity before the video even starts."],
  ["03", "Hold attention", "Use structure, pacing, pattern interrupts and payoff so viewers have a reason to keep watching."],
  ["04", "Build a system", "Replace random uploads with a weekly operating rhythm you can measure, improve and repeat."],
];

export default function Home() {
  return (
    <main id="top" className="siteShell">
      <Navbar />

      <section className="hero" aria-labelledby="hero-title">
        <div className="heroGlow heroGlowOne" data-parallax="8" aria-hidden="true" />
        <div className="heroGlow heroGlowTwo" data-parallax="5" aria-hidden="true" />

        <div className="container heroInner">
          <div className="heroContent">
            <div className="heroTopline" data-hero-item="">
              <div className="eyebrow"><span /> {siteConfig.badge}</div>
              <span className="heroEdition">2026 EDITION · 6 MODULES</span>
            </div>

            <h1 id="hero-title" data-hero-item="">
              <span>{siteConfig.titleTop}</span>
              <em>{siteConfig.titleAccent}</em>
            </h1>

            <div className="heroBottom" data-hero-item="">
              <p className="heroText">{siteConfig.description}</p>
              <div className="heroActions">
                <BuyButton label={`GET THE COURSE · ${siteConfig.priceLabel}`} />
                <span className="microcopy"><b>Secure PayU checkout.</b> One-time payment. Instant verified access.</span>
              </div>
            </div>
          </div>

          <div className="heroVideoStage">
            <div className="videoAtmosphere" aria-hidden="true" />
            <div className="heroVideoShell" data-hero-video="">
              <div className="videoTopbar">
                <div className="dots" aria-hidden="true"><i /><i /><i /></div>
                <span>COURSE PREVIEW · 02:00</span>
                <b>PLAY</b>
              </div>
              <VideoFrame url={process.env.NEXT_PUBLIC_HERO_VIDEO_URL || defaultVideoUrl} title="Gaming YouTube Course Preview" />
            </div>
            <div className="videoCaption" data-hero-item="">
              <span>SCROLL TO ENTER</span>
              <div className="videoCaptionLine" />
              <span>01 / 05</span>
            </div>
          </div>
        </div>
      </section>

      <section className="signalStrip" aria-label="Course focus areas">
        <div className="container signalInner" data-stagger="">
          {proof.map((item, index) => (
            <div className="signalItem" key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="learn" className="section systemSection">
        <div className="container">
          <div className="editorialHeading" data-reveal="">
            <div className="sectionNo">01 — THE SYSTEM</div>
            <div className="editorialGrid">
              <h2>YOU DON&apos;T NEED MORE <em>MOTIVATION.</em><br />YOU NEED A BETTER SYSTEM.</h2>
              <div className="sectionIntro">
                <p>This course turns gaming YouTube growth into practical, repeatable skills: research, ideas, packaging, retention, analytics and monetisation.</p>
                <BuyButton label="SEE WHAT'S INSIDE" />
              </div>
            </div>
          </div>

          <div className="outcomeGrid" data-stagger="">
            {outcomes.map(([num, title, body]) => (
              <article className="outcomeCard" key={num}>
                <div className="outcomeTop"><span>{num}</span><span>CORE SKILL</span></div>
                <h3>{title}</h3>
                <p>{body}</p>
                <div className="outcomeRule" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="section modulesSection">
        <div className="moduleGlow" data-parallax="6" aria-hidden="true" />
        <div className="container">
          <div className="modulesHeading" data-reveal="">
            <div>
              <div className="sectionNo">02 — COURSE MODULES</div>
              <h2>FROM RANDOM UPLOADS<br />TO A <em>GROWTH ENGINE.</em></h2>
            </div>
            <p>Six focused modules. No filler. Every lesson is built to give you something concrete to implement on your next upload.</p>
          </div>

          <div className="moduleList" data-stagger="">
            {modules.map(([num, title, desc]) => (
              <article className="moduleRow" key={num}>
                <span className="moduleNo">{num}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="moduleArrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>

          <div className="moduleFooter" data-reveal="">
            <span>6 MODULES · ACTION-FIRST CURRICULUM</span>
            <BuyButton label="UNLOCK ALL MODULES" />
          </div>
        </div>
      </section>

      <section className="section audienceSection">
        <div className="container audience">
          <div className="audienceVisual" data-reveal="left">
            <div className="audienceGrid" aria-hidden="true" />
            <img className="audiencePhoto" src="/Harvest.png" alt="Gaming creator in a red studio setup" />
            <div className="crosshair" aria-hidden="true"><span /><span /></div>
            <span className="tag tag1">CREATOR MODE</span>
            <span className="tag tag2">GAMING / YOUTUBE</span>
            <div className="bigNumber" aria-hidden="true">99</div>
            <div className="audienceSignal"><i /> SYSTEM ONLINE</div>
            <p>Uploads get easier when the system behind them gets better.</p>
          </div>

          <div className="audienceCopy" data-reveal="right">
            <div className="sectionNo">03 — WHO THIS IS FOR</div>
            <h2>BUILT FOR GAMERS<br />WHO WANT TO <em>GROW.</em></h2>
            <p className="audienceLead">Not another “go viral” checklist. This is for creators who want a more disciplined way to build better content.</p>
            <ul data-stagger="">
              <li><b>01</b><span>You already post gaming content but growth feels random.</span></li>
              <li><b>02</b><span>You want stronger video ideas, thumbnails and retention.</span></li>
              <li><b>03</b><span>You want a repeatable workflow instead of chasing hacks.</span></li>
              <li><b>04</b><span>You want to turn a channel into a long-term creator business.</span></li>
            </ul>
            <BuyButton label="START BUILDING" />
          </div>
        </div>
      </section>

      <section className="section priceSection">
        <div className="priceGlow" data-parallax="5" aria-hidden="true" />
        <div className="container priceCard" data-reveal="">
          <div className="priceCopy">
            <div className="sectionNo">04 — INSTANT ACCESS</div>
            <h2>BUILD YOUR NEXT<br /><em>BREAKOUT VIDEO.</em></h2>
            <p>Get the complete {siteConfig.courseName}, future lesson updates, and immediate access after successful server-side payment verification.</p>
            <div className="priceProof">
              <span>✓ One-time payment</span>
              <span>✓ 6 complete modules</span>
              <span>✓ Secure paid access</span>
            </div>
          </div>

          <div className="priceBox">
            <div className="priceBoxTop">
              <span>COMPLETE COURSE</span>
              <span className="pricePill">INSTANT ACCESS</span>
            </div>
            <div className="priceValue">
              <span className="oldPrice">{siteConfig.oldPriceLabel}</span>
              <strong>{siteConfig.priceLabel}</strong>
            </div>
            <small>ONE-TIME PAYMENT · NO SUBSCRIPTION</small>
            <BuyButton label="BUY THE COURSE" />
            <p>Secure checkout powered by PayU. Access unlocks only after payment verification.</p>
          </div>
        </div>
      </section>

      <section id="faq" className="section faqSection">
        <div className="container faq">
          <div className="faqHeading" data-reveal="left">
            <div className="sectionNo">05 — FAQ</div>
            <h2>QUESTIONS.<br /><em>ANSWERED.</em></h2>
            <p>Everything you need to know before you unlock the course.</p>
          </div>
          <div className="faqList" data-stagger="">
            <details open><summary><span>01</span>How do I get access?</summary><p>Complete the PayU checkout. The server verifies the PayU payment response and then unlocks the protected course area.</p></details>
            <details><summary><span>02</span>Is this a subscription?</summary><p>No. This build is configured as a one-time course purchase.</p></details>
            <details><summary><span>03</span>Can I watch on mobile?</summary><p>Yes. The landing page, checkout and course dashboard are intentionally designed for desktop, tablet and mobile.</p></details>
            <details><summary><span>04</span>Can someone open the course link without paying?</summary><p>No. The course page is server-rendered only after a signed entitlement is present and the associated PayU payment is re-checked as successful and active.</p></details>
          </div>
        </div>
      </section>

      <section className="finalCta">
        <div className="finalOrb" data-parallax="6" aria-hidden="true" />
        <div className="container" data-reveal="">
          <span>READY WHEN YOU ARE.</span>
          <h2>STOP POSTING BLIND.<br /><em>START BUILDING.</em></h2>
          <p>One system. Six modules. A better way to build your gaming channel.</p>
          <BuyButton label={`GET THE FULL COURSE · ${siteConfig.priceLabel}`} />
        </div>
      </section>

      <footer className="footer container">
        <div className="logo"><span className="logoMark">G</span><span>{siteConfig.creator}</span></div>
        <p>© 2026 · {siteConfig.courseName}</p>
        <div className="footerLinks"><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/refund">Refunds</a><a href="/contact">Contact</a></div>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>

      <div className="mobileSticky"><BuyButton label={`BUY COURSE · ${siteConfig.priceLabel}`} /></div>
    </main>
  );
}
