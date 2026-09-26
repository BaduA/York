"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";

type ActivePage = "menu" | "cocktailLab" | "leaderboard";

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
  const [open, setOpen] = useState(false);

  const navItems = [
    { page: "menu" as const, label: t("nav.menu"), href: "/menu" },
    { page: "cocktailLab" as const, label: t("nav.cocktailLab"), href: "/" },
    { page: "leaderboard" as const, label: t("nav.leaderboard"), href: "/leaderboard" },
  ];

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Brand + desktop nav */}
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
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-border/60">
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Desktop only */}
          <div className="hidden md:flex items-center gap-3">
            <LangToggle />
            <div className="flex size-9 items-center justify-center border border-border bg-card cursor-pointer hover:border-primary transition-colors">
              <iconify-icon icon="solar:bag-heart-bold" className="text-primary" width="18" height="18"></iconify-icon>
            </div>
          </div>

          {/* Mobile: cart (only when items exist) + hamburger */}
          <div className={`md:hidden flex size-9 items-center justify-center border border-border bg-card cursor-pointer hover:border-primary transition-all duration-300 ${cartCount > 0 ? "opacity-100 w-9 pointer-events-auto" : "opacity-0 w-0 border-0 pointer-events-none overflow-hidden"}`}>
            <iconify-icon icon="solar:bag-heart-bold" className="text-primary" width="18" height="18"></iconify-icon>
          </div>
          <button
            className="md:hidden flex size-9 items-center justify-center border border-border bg-card hover:border-primary transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü"
          >
            <iconify-icon icon={open ? "ph:x-bold" : "ph:list-bold"} width="18" height="18"></iconify-icon>
          </button>
        </div>
      </div>

    </header>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 z-[55] bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Side drawer */}
      <div
        className={`isolate md:hidden fixed top-0 right-0 z-[60] h-full w-72 bg-card border-l border-border flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Menü</span>
          <button
            onClick={() => setOpen(false)}
            className="flex size-10 items-center justify-center border border-border bg-background hover:border-primary transition-colors"
            aria-label="Kapat"
          >
            <iconify-icon icon="ph:x-bold" width="16" height="16"></iconify-icon>
          </button>
        </div>
        <nav className="flex flex-col px-6 py-4 gap-1">
          {navItems.map(({ page, label, href }) => (
            <a
              key={page}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                setTimeout(() => { window.location.href = href; }, 300);
              }}
              className={
                page === activePage
                  ? "border-l-2 border-primary pl-4 pr-2 py-3.5 text-xs font-bold uppercase tracking-widest text-primary"
                  : "pl-4 pr-2 py-3.5 text-xs font-bold uppercase tracking-widest text-muted-foreground border-l-2 border-transparent hover:text-foreground hover:border-border transition-colors"
              }
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto px-6 py-4 border-t border-border">
          <LangToggle />
        </div>
      </div>
    </>
  );
}
