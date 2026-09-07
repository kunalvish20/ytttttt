const configuredPrice = Number(process.env.COURSE_PRICE_INR || "1");
const price = Number.isFinite(configuredPrice) && configuredPrice > 0 ? configuredPrice : 1;
export const defaultVideoUrl = "";

export const siteConfig = {
  creator: process.env.NEXT_PUBLIC_CREATOR_NAME || "YOUR CHANNEL NAME",
  badge: process.env.NEXT_PUBLIC_COURSE_BADGE || "GAMING CREATOR MASTERCLASS",
  titleTop: "TURN YOUR GAMING CHANNEL",
  titleAccent: "INTO A REAL BUSINESS.",
  description:
    "A practical course for gaming creators who want better videos, stronger thumbnails, faster growth and a repeatable YouTube system — without guessing what to upload next.",
  courseName: process.env.NEXT_PUBLIC_COURSE_NAME || "YouTube Gaming Blueprint",
  priceLabel: `₹${price.toLocaleString("en-IN")}`,
  oldPriceLabel: process.env.NEXT_PUBLIC_OLD_PRICE || "₹1",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@yourdomain.com",
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || "Your Business Name",
  guarantee: "Instant access after successful payment verification",
};

export const modules = [
  ["01", "Channel Positioning", "Pick a gaming niche, viewer promise and content angle that is actually memorable."],
  ["02", "Video Ideas That Click", "Build a repeatable idea system around trends, curiosity, challenges and searchable demand."],
  ["03", "Titles + Thumbnails", "Create packaging that earns the click without cheap clickbait."],
  ["04", "Retention Editing", "Structure intros, pacing, pattern interrupts and payoffs to hold viewers longer."],
  ["05", "Upload & Growth System", "Create a weekly operating system for publishing, studying analytics and improving."],
  ["06", "Monetisation", "Turn attention into income through sponsors, affiliates, products and community."],
] as const;
