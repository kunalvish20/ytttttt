"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SiteMotion() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-item], [data-reveal], [data-stagger] > *, [data-hero-video], [data-parallax]", {
          clearProps: "all",
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
        if (heroItems.length) {
          gsap.fromTo(
            heroItems,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.95, stagger: 0.09, ease: "power3.out", clearProps: "transform" },
          );
        }

        const nav = document.querySelector<HTMLElement>(".navWrap");
        if (nav) {
          gsap.fromTo(nav, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" });
        }

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          const direction = element.dataset.reveal;
          const x = direction === "left" ? -28 : direction === "right" ? 28 : 0;
          const y = direction === "left" || direction === "right" ? 0 : 34;

          gsap.fromTo(
            element,
            { opacity: 0, x, y, scale: 0.985 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: element,
                start: "top 86%",
                once: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
          const children = Array.from(group.children) as HTMLElement[];
          if (!children.length) return;

          gsap.fromTo(
            children,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.72,
              stagger: 0.075,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: group,
                start: "top 84%",
                once: true,
              },
            },
          );
        });

        const finalButton = document.querySelector<HTMLElement>(".finalCta .buyButton");
        if (finalButton) {
          gsap.fromTo(
            finalButton,
            { scale: 0.94 },
            {
              scale: 1,
              duration: 0.8,
              ease: "back.out(1.7)",
              scrollTrigger: { trigger: finalButton, start: "top 88%", once: true },
            },
          );
        }
      });

      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const video = document.querySelector<HTMLElement>("[data-hero-video]");
        if (video) {
          gsap.fromTo(
            video,
            {
              rotationX: 7.5,
              rotationY: -4,
              scale: 0.91,
              y: 54,
              z: -80,
              transformOrigin: "50% 100%",
            },
            {
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              y: 0,
              z: 0,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: ".heroVideoStage",
                start: "top 94%",
                end: "top 24%",
                scrub: 0.85,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
          const amount = Number(element.dataset.parallax || 10);
          gsap.fromTo(
            element,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: element.parentElement || element,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        });
      });

      mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const video = document.querySelector<HTMLElement>("[data-hero-video]");
        if (video) {
          gsap.fromTo(
            video,
            { scale: 0.975, y: 16 },
            {
              scale: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".heroVideoStage",
                start: "top 93%",
                end: "top 58%",
                scrub: 0.5,
              },
            },
          );
        }
      });
    }, document.body);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      mm.revert();
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
