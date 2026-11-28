import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { LangProvider, dict } from "@/lib/i18n";
import { Nav } from "@/components/peaq/Nav";
import { Hero } from "@/components/peaq/Hero";
import { Marquee } from "@/components/peaq/Marquee";
import { HowItWorks } from "@/components/peaq/HowItWorks";
import { AppScreens } from "@/components/peaq/AppScreens";
import { StickyCta } from "@/components/peaq/Cta";
import { Leagues } from "@/components/peaq/Leagues";
import { Stages } from "@/components/peaq/Stages";
import { RaceDay } from "@/components/peaq/RaceDay";
import { Rankings } from "@/components/peaq/Rankings";
import { Community } from "@/components/peaq/Community";
import { FirstRace } from "@/components/peaq/FirstRace";
import { FinalCta } from "@/components/peaq/FinalCta";
import { Footer } from "@/components/peaq/Footer";
import { ScrollTrigger } from "@/components/peaq/core";

const SITE = "https://peaqrace.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: dict.it.meta.title },
      { name: "description", content: dict.it.meta.description },
      { property: "og:title", content: dict.it.meta.title },
      { property: "og:description", content: dict.it.meta.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      // The picture shown when the link is shared (public/og.jpg, 1200 × 630). It needs the full address.
      { property: "og:url", content: SITE }, { property: "og:image", content: `${SITE}/og.jpg` },
      { property: "og:image:width", content: "1200" }, { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: `${SITE}/og.jpg` },
    ],
  }),
  component: Index,
});

/** The landing, in the look of the athlete app (white, Kanit, PEAQ blue, league colours). */
function Index() {
  // Fonts and images change the page height after the first paint: measure the scroll triggers again.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => clearTimeout(id);
  }, []);
  return (
    <LangProvider>
      <div className="theme-app theme-athlete min-h-dvh overflow-x-clip">
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <HowItWorks />
          <AppScreens />
          <Leagues />
          <Stages />
          <RaceDay />
          <Rankings />
          <Community />
          <FirstRace />
          <FinalCta />
        </main>
        <Footer />
        <StickyCta />
      </div>
    </LangProvider>
  );
}
