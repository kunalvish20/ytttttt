# Gaming YouTuber Course — PayU + GSAP

Complete Next.js course sales website with PayU Hosted Checkout and browser-specific paid course access.

## What is included

- Premium black/red animated landing page using GSAP + ScrollTrigger.
- `/buy` page with Name + Email + Phone form.
- Server-generated PayU Hosted Checkout request and SHA-512 hash.
- PayU success/failure callback with reverse-hash verification.
- Independent PayU `verify_payment` API verification before access is granted.
- Payment amount is taken only from `COURSE_PRICE_INR` on the server.
- Course transaction IDs always start with `YTC_`.
- `/opencourse` is protected server-side and is never rendered to an unpaid browser.
- Access is stored in signed HttpOnly cookies for the browser that completed payment.
- A second device/browser does not have those cookies and remains locked.
- `/course` redirects to `/opencourse` so there is only one protected course route.
- Course payment is re-verified with PayU each time `/opencourse` is rendered.
- Webhook ignores every transaction that does not start with `YTC_`, which keeps unrelated Shopify PayU transactions out of this course handler.
- No database/login/recovery flow: intentionally same-browser only.

## Important fix in this version

The older build depended on a `SameSite=Lax` pending cookie being present on PayU's cross-site POST callback. Browsers do not reliably send Lax cookies on cross-site POST navigation, which can make a real successful payment land on `payment=failed`.

This build no longer depends on that cookie. The transaction/course/amount/device state is carried through signed PayU UDF fields, included in PayU's request/response hash, then independently confirmed using PayU's Verify Payment API.

`COURSE_ACCESS_SECRET` is also separate from `PAYU_SALT`; the PayU salt is no longer reused to sign local access cookies.

## Required Vercel environment variables

```env
PAYU_KEY=YOUR_KEY
PAYU_SALT=YOUR_SALT
PAYU_ENV=live

COURSE_ACCESS_SECRET=YOUR_LONG_RANDOM_SECRET
COURSE_PRICE_INR=1

NEXT_PUBLIC_SITE_URL=https://ytcourse-henna.vercel.app
NEXT_PUBLIC_CREATOR_NAME="YOUR CHANNEL NAME"
NEXT_PUBLIC_COURSE_NAME="YouTube Gaming Blueprint"
NEXT_PUBLIC_COURSE_BADGE="GAMING CREATOR MASTERCLASS"
NEXT_PUBLIC_OLD_PRICE="₹1"
NEXT_PUBLIC_SUPPORT_EMAIL="support@yourdomain.com"
NEXT_PUBLIC_LEGAL_NAME="Your Business Name"

NEXT_PUBLIC_HERO_VIDEO_URL=
COURSE_VIDEO_URL=https://www.youtube.com/watch?v=YOUR_VIDEO_ID
```

Generate a course secret:

```bash
openssl rand -base64 32
```

Do not put `PAYU_SALT` or `COURSE_ACCESS_SECRET` in any `NEXT_PUBLIC_...` variable.

## PayU environments

Test credentials:

```env
PAYU_ENV=test
```

Checkout endpoint used by the code:

```text
https://test.payu.in/_payment
```

Live credentials:

```env
PAYU_ENV=live
```

Checkout endpoint used by the code:

```text
https://secure.payu.in/_payment
```

Live Verify Payment endpoint:

```text
https://info.payu.in/merchant/postservice.php?form=2
```

Do not mix live credentials with `PAYU_ENV=test`.

## PayU callback

The code automatically uses:

```text
https://ytcourse-henna.vercel.app/api/payu/callback
```

for both `surl` and `furl` based on `NEXT_PUBLIC_SITE_URL`.

Successful flow:

```text
/buy
  → Name + Email + Phone
  → POST /api/payu/create
  → PayU Hosted Checkout
  → POST /api/payu/callback
  → reverse hash verified
  → signed checkout state verified
  → PayU Verify Payment API
  → amount/product/txnid/status verified
  → HttpOnly access + device cookies
  → /opencourse
```

Failed/tampered/unverified payments never receive the access cookie.

## PayU webhook

Course webhook URL:

```text
https://ytcourse-henna.vercel.app/api/payu/webhook
```

If your PayU account already has a Shopify webhook, keep that Shopify integration intact. The course handler immediately ignores transactions whose `txnid` does not start with `YTC_`.

This no-database build does **not** grant a browser access from a webhook because a server-to-server webhook has no buyer browser in which to set the device-specific HttpOnly cookie. The browser callback is what grants immediate access after full verification.

## Install / run

```bash
npm install
npm run dev
```

TypeScript check:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

## Deployment test checklist

1. Add all environment variables to Vercel.
2. Redeploy after changing environment variables.
3. Open `/opencourse` in incognito before paying — it must show locked.
4. Open `/buy`, enter real Name/Email/Phone and pay ₹1.
5. PayU must return to `/api/payu/callback`.
6. Expected final URL: `/opencourse?payment=success`.
7. The paid browser should open the video.
8. Open `/opencourse` on another phone/incognito — it must stay locked.
9. Check Vercel logs for `PAYU_ACCESS_GRANTED`.
10. Do not publish until this ₹1 live test passes end-to-end.

## Course video

Set only:

```env
COURSE_VIDEO_URL=YOUR_YOUTUBE_OR_EMBED_URL
```

The URL is server-side and is only rendered into the protected page after access validation. A legitimate paid viewer can still inspect or screen-record browser-playable media; no ordinary website can fully prevent that. Use Vimeo domain restrictions or signed-streaming providers such as Mux for stronger media protection.

## Security note

Never commit `.env.local`. This project intentionally excludes it from Git. If a PayU Salt or course access secret has ever been pasted into a chat, repository, screenshot, or public place, rotate it before production use.
