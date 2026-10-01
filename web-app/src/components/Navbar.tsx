"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";

export type ActivePage = "menu" | "cocktailLab" | "leaderboard" | "music";

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      className="flex items-center px-2.5 py-1.5 border border-border bg-card text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
    >
      {lang === "tr" ? "EN" : "TR"}
    </button>
  );
}

export function Navbar({ activePage, cartCount = 0 }: { activePage: ActivePage; cartCount?: number }) {
  const { t } = useI18n();

  const navItems: { page: ActivePage; label: string; href: string; icon: string }[] = [
    { page: "menu", label: t("nav.menu"), href: "/menu", icon: "solar:menu-dots-bold" },
    { page: "cocktailLab", label: t("nav.cocktailLab"), href: "/cocktail-lab", icon: "solar:cup-hot-bold" },
    { page: "music", label: t("nav.music"), href: "/music", icon: "solar:music-note-2-bold" },
    { page: "leaderboard", label: t("nav.leaderboard"), href: "/leaderboard", icon: "solar:cup-star-bold" },
  ];

  return (
    <>
      {/* Desktop header */}
      <header className="hidden md:block sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-8">
            <a href="/" className="group flex items-center gap-3">
              <div className="flex size-10 items-center justify-center border border-primary bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <iconify-icon icon="ph:brand-cocktail-bold" width="24" height="24"></iconify-icon>
              </div>
              <div>
                <span className="block font-font-heading text-2xl uppercase tracking-wider text-foreground">Bilkent York</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{t("brand.subtitle")}</span>
              </div>
            </a>
            <nav className="flex items-center gap-1 pl-4 border-l border-border/60">
              {navItems.map(({ page, label, href }) => (
                <a
                  key={page}
                  href={href}
                  className={
                    page === activePage
                      ? "border-b-2 border-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary"
                      : "px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                  }
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <div className="flex size-9 items-center justify-center border border-border bg-card cursor-pointer hover:border-primary transition-colors">
              <iconify-icon icon="solar:bag-heart-bold" className="text-primary" width="18" height="18"></iconify-icon>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border">
        <div className="grid grid-cols-4">
          {navItems.map(({ page, label, href, icon }) => {
            const isActive = page === activePage;
            return (
              <a
                key={page}
                href={href}
                className={`flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <iconify-icon
                  icon={icon}
                  width="22"
                  height="22"
                  className={isActive ? "text-primary" : "text-muted-foreground"}
                ></iconify-icon>
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{label}</span>
                {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-t-full" />}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Mobile: floating cart button when items exist */}
      {cartCount > 0 && (
        <div className="md:hidden fixed bottom-20 right-4 z-50">
          <button className="flex size-12 items-center justify-center bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30">
            <iconify-icon icon="solar:bag-heart-bold" width="20" height="20"></iconify-icon>
            <span className="absolute -top-1 -right-1 size-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
