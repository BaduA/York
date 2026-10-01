"use client";

import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { MenuRenderer, type TSection } from "@/components/MenuRenderer";

// ─── Page-content types ───────────────────────────────────────────────────────

type THero = {
  badgeText: string; headingMain: string; headingHighlight: string; description: string;
  pill1Icon: string; pill1Text: string; pill2Icon: string; pill2Text: string; pill3Icon: string; pill3Text: string;
};
type TCard = { slot: number; badgeLabel: string; title: string; description: string; imageUrl: string | null };
type TCta  = { badgeText: string; headingMain: string; headingHighlight: string; description: string };

type MenuSectionData = {
  id: string;
  slug: string;
  title: string;
  icon: string;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

type MenuClientProps = {
  initialSections: MenuSectionData[];
  initialHero: THero | null;
  initialCards: TCard[];
  initialCta: TCta | null;
};

export function MenuClient({ initialSections, initialHero, initialCards, initialCta }: MenuClientProps) {
  const { t } = useI18n();
  const sections = initialSections;
  const hero     = initialHero;
  const cards    = initialCards;
  const cta      = initialCta;
  const [activeSlug, setActiveSlug] = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  const isScrollingTo = useRef(false);
  const scrollingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  function scrollToSection(slug: string) {
    const el = document.getElementById(slug);
    if (!el) return;
    setActiveSlug(slug);
    isScrollingTo.current = true;
    if (scrollingTimer.current) clearTimeout(scrollingTimer.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const start = window.scrollY;
    const targetY = el.getBoundingClientRect().top + window.scrollY - 120;
    const distance = targetY - start;
    if (Math.abs(distance) < 1) { isScrollingTo.current = false; return; }

    const duration = Math.min(Math.max(Math.abs(distance) / 1.2, 180), 550);
    const t0 = performance.now();
    function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
    function step(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      window.scrollTo(0, start + distance * easeOut(p));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else { rafRef.current = null; isScrollingTo.current = false; }
    }
    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    const OFFSET = 140;
    const KNOWN_SLUGS = ["promo-bar", "sushi-bar", "bentolar", "noodles-rice", "main-kitchen", "aperatifler", "coffee-soft"];
    function update() {
      if (isScrollingTo.current) return;
      const all = sections.length ? sections : KNOWN_SLUGS.map((s) => ({ slug: s }));
      let active = (all[0] as { slug: string }).slug;
      for (const s of all) {
        const el = document.getElementById((s as { slug: string }).slug);
        if (el && el.getBoundingClientRect().top <= OFFSET) active = (s as { slug: string }).slug;
      }
      setActiveSlug(active);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [sections]);

  useEffect(() => {
    if (!activeSlug) return;
    const pill = navRef.current?.querySelector(`[data-slug="${activeSlug}"]`) as HTMLElement | null;
    pill?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSlug]);

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
                  <iconify-icon icon="solar:flame-bold" className="text-primary animate-pulse" width="16" height="16"></iconify-icon>
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
                      <iconify-icon icon={pill.icon} className="text-primary" width="16" height="16"></iconify-icon>
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
      <div className="sticky top-0 md:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={navRef} className="flex items-center gap-2 overflow-x-auto py-3.5">
            {sections.map((s) => {
              const isActive = activeSlug === s.slug;
              return (
                <button key={s.id} data-slug={s.slug} onClick={() => scrollToSection(s.slug)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 shrink-0 transition-colors ${isActive ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"}`}
                >
                  <iconify-icon icon={s.icon} className={isActive ? "" : "text-primary"} width="16" height="16"></iconify-icon>
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <MenuRenderer sections={sections as unknown as TSection[]} />

        {/* CTA */}
        {cta && (
          <div className="rounded-2xl bg-gradient-to-r from-secondary via-card to-secondary border border-primary/40 p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              {cta.badgeText && (
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs uppercase font-bold tracking-widest">{cta.badgeText}</span>
              )}
              <h2 className="font-font-heading text-3xl sm:text-5xl font-bold uppercase tracking-wider text-foreground">
                {cta.headingMain} <span className="text-primary">{cta.headingHighlight}</span>
              </h2>
              <p className="text-sm text-muted-foreground">{cta.description}</p>
              <div className="pt-2">
                <a href="/" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-font-heading tracking-wider uppercase text-base font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                  <iconify-icon icon="solar:cup-paper-bold" width="20" height="20"></iconify-icon>
                  {t("menu.ctaBtn")}
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              <iconify-icon icon="solar:compass-bold-duotone" width="20" height="20"></iconify-icon>
            </div>
            <div>
              <div className="font-font-heading text-xl font-bold uppercase tracking-wider text-foreground">{t("brand.footer")}</div>
              <p className="text-xs text-muted-foreground font-font-mono">{t("brand.tagline")}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="/menu" className="hover:text-primary transition-colors">{t("footer.menu")}</a>
            <a href="/" className="hover:text-primary transition-colors">{t("footer.cocktailLab")}</a>
            <a href="/leaderboard" className="hover:text-primary transition-colors">{t("footer.leaderboard")}</a>
            <a href="#" className="hover:text-primary transition-colors">{t("footer.reservations")}</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="size-9 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
              <iconify-icon icon="mdi:instagram" width="16" height="16"></iconify-icon>
            </a>
            <a href="#" className="size-9 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
              <iconify-icon icon="mdi:whatsapp" width="16" height="16"></iconify-icon>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
