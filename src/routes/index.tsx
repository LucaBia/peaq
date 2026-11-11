import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { LangProvider, dict } from "@/lib/i18n";
import { Loader } from "@/components/peaq/Loader";
import { Nav } from "@/components/peaq/Nav";
import { Hero } from "@/components/peaq/Hero";
import { Marquee } from "@/components/peaq/Marquee";
import { Disciplines } from "@/components/peaq/Disciplines";
import { AthleteBib } from "@/components/peaq/AthleteBib";
import { Rankings } from "@/components/peaq/Rankings";
import { Stats } from "@/components/peaq/Stats";
import { Events } from "@/components/peaq/Events";
import { AppReveal } from "@/components/peaq/AppReveal";
import { Waitlist } from "@/components/peaq/Waitlist";
import { Footer } from "@/components/peaq/Footer";
import { Cursor, ScrollTrigger } from "@/components/peaq/core";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: dict.it.meta.title },
      { name: "description", content: dict.it.meta.description },
      { property: "og:title", content: dict.it.meta.title },
      { property: "og:description", content: dict.it.meta.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(id);
  }, [ready]);
  return (
    <LangProvider>
      <Loader onDone={done} />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee items={["Running", "Cycling", "Identity", "Ranking", "Progress", "Community"]} />
        <Disciplines />
        <AthleteBib />
        <Rankings />
        <Stats />
        <Events />
        <AppReveal />
        <Waitlist />
      </main>
      <Footer />
    </LangProvider>
  );
}
