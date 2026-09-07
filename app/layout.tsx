import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import SiteMotion from "@/components/SiteMotion";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.courseName} | ${siteConfig.creator}`,
    template: `%s | ${siteConfig.creator}`,
  },
  description: "A premium gaming YouTube growth course with secure PayU-gated access.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>
        <SiteMotion />
        {children}
      </body>
    </html>
  );
}
