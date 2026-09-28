"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MenuRenderer, type TSection, type TVocab } from "@/components/MenuRenderer";

type THero = {
  badgeText: string; headingMain: string; headingHighlight: string; description: string;
  pill1Icon: string; pill1Text: string; pill2Icon: string; pill2Text: string; pill3Icon: string; pill3Text: string;
};
type TCard = { slot: number; badgeLabel: string; title: string; description: string; imageUrl: string | null };
type TCta  = { badgeText: string; headingMain: string; headingHighlight: string; description: string };

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export default function MenuTestPage() {
  const [sections, setSections] = useState<TSection[]>([]);
  const [vocab,    setVocab]    = useState<TVocab[]>([]);
  const [hero,     setHero]     = useState<THero | null>(null);
  const [cards,    setCards]    = useState<TCard[]>([]);
  const [cta,      setCta]      = useState<TCta | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/menu`).then((r) => r.json()),
      fetch(`${BASE}/page-content/menu`).then((r) => r.json()),
    ])
      .then(([menuData, contentData]: [unknown, unknown]) => {
        if (Array.isArray(menuData)) setSections(menuData as TSection[]);
        const c = contentData as Record<string, unknown>;
        if (c?.sushiVocab) setVocab(c.sushiVocab as TVocab[]);
        if (c?.hero)       setHero(c.hero as THero);
        if (c?.cards)      setCards(c.cards as TCard[]);
        if (c?.cta)        setCta(c.cta as TCta);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-white font-font-sans">
      <Navbar activePage="menu" />

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-card/80 to-background border-b border-border/60 overflow-hidden py-10 sm:py-14">
        <div className="absolute inset-0 pointer-events-none opacity-15" style={{ backgroundImage: "radial-gradient(#C51F2B 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left space-y-4">
              {hero?.badgeText && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
                  <iconify-icon icon="solar:flame-bold" className="text-primary animate-pulse" width="16" height="16" />
                  {hero.badgeText}
                </div>
              )}
              {hero && (
                <h1 className="font-font-heading text-4xl sm:text-6xl font-bold tracking-tight text-foreground uppercase leading-[0.95]">
                  {hero.headingMain} <span className="text-primary">{hero.headingHighlight}</span>
                </h1>
              )}
              {hero?.description && <p className="text-muted-foreground text-sm sm:text-base max-w-xl">{hero.description}</p>}
              {hero && (
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {[
                    { icon: hero.pill1Icon, text: hero.pill1Text },
                    { icon: hero.pill2Icon, text: hero.pill2Text },
                    { icon: hero.pill3Icon, text: hero.pill3Text },
                  ].filter((p) => p.text).map((pill) => (
                    <div key={pill.text} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border">
                      <iconify-icon icon={pill.icon} className="text-primary" width="16" height="16" />
                      <span className="text-xs font-semibold">{pill.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              {cards.map((card) => (
                <div key={card.slot} className="group relative rounded-xl overflow-hidden border border-border bg-card p-4 hover:border-primary/60 transition-all shadow-lg">
                  <div className="h-36 rounded-lg overflow-hidden relative mb-3">
                    {card.imageUrl
                      ? <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full bg-muted" />}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-primary-foreground font-font-heading uppercase text-xs tracking-wider">{card.badgeLabel}</div>
                  </div>
                  <h2 className="font-font-heading text-lg font-bold uppercase tracking-wide">{card.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category nav */}
      <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3.5">
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.slug}`}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 shrink-0 transition-colors ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"}`}
              >
                <iconify-icon icon={s.icon} className={i === 0 ? "" : "text-primary"} width="16" height="16" />
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <MenuRenderer sections={sections} vocab={vocab} />

        {cta && (
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-secondary via-card to-secondary border border-primary/40 p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              {cta.badgeText && (
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs uppercase font-bold tracking-widest">{cta.badgeText}</span>
              )}
              <h2 className="font-font-heading text-3xl sm:text-5xl font-bold uppercase tracking-wider text-foreground">
                {cta.headingMain} <span className="text-primary">{cta.headingHighlight}</span>
              </h2>
              <p className="text-sm text-muted-foreground">{cta.description}</p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-card border-t border-border mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              <iconify-icon icon="solar:compass-bold-duotone" width="20" height="20" />
            </div>
            <div>
              <div className="font-font-heading text-xl font-bold uppercase tracking-wider text-foreground">York</div>
              <p className="text-xs text-muted-foreground font-font-mono">Street Food & Craft Bar</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
