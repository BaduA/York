"use client";

import React, { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { MenuRenderer, type TSection, type TVocab } from "@/components/MenuRenderer";

// ─── Page-content types ───────────────────────────────────────────────────────

type THero = {
  badgeText: string; headingMain: string; headingHighlight: string; description: string;
  pill1Icon: string; pill1Text: string; pill2Icon: string; pill2Text: string; pill3Icon: string; pill3Text: string;
};
type TCard = { slot: number; badgeLabel: string; title: string; description: string; imageUrl: string | null };
type TCta  = { badgeText: string; headingMain: string; headingHighlight: string; description: string };

// ─── Types ────────────────────────────────────────────────────────────────────

type MenuItemData = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  priceNote: string | null;
  badge: string | null;
  sortOrder: number;
};

type MenuGroupData = {
  id: string;
  title: string | null;
  subtitle: string | null;
  note: string | null;
  price: string | null;
  columnIndex: number | null;
  sortOrder: number;
  items: MenuItemData[];
};

type MenuSectionData = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  icon: string;
  badge: string | null;
  sortOrder: number;
  groups: MenuGroupData[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

function sec(sections: MenuSectionData[], slug: string) {
  return sections.find((s) => s.slug === slug);
}

function grp(section: MenuSectionData | undefined, title: string) {
  return section?.groups.find((g) => g.title === title);
}

function items(group: MenuGroupData | undefined): MenuItemData[] {
  return group?.items ?? [];
}

function groupsByCol(section: MenuSectionData | undefined, col: number): MenuGroupData[] {
  return section?.groups.filter((g) => g.columnIndex === col) ?? [];
}

// ─── Section renderers ────────────────────────────────────────────────────────

function SectionHeader({ section, badgeLabel }: { section: MenuSectionData | undefined; badgeLabel?: string }) {
  if (!section) return null;
  return (
    <div className="flex items-center justify-between border-b-2 border-primary pb-3">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
          <iconify-icon icon={section.icon} width="20" height="20"></iconify-icon>
        </div>
        <div>
          <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider text-foreground">{section.title}</h2>
          {section.subtitle && <p className="text-xs text-muted-foreground">{section.subtitle}</p>}
        </div>
      </div>
      {(section.badge || badgeLabel) && (
        <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">{section.badge ?? badgeLabel}</span>
      )}
    </div>
  );
}

function PriceRow({ name, price, description, priceNote }: { name: string; price: string; description?: string | null; priceNote?: string | null }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/60 last:border-0">
      <div>
        <div className="font-bold text-sm text-foreground">{name}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
        {priceNote && <div className="text-xs text-muted-foreground line-through opacity-70">{priceNote}</div>}
      </div>
      <div className="font-font-mono font-bold text-foreground shrink-0 ml-3">{price}</div>
    </div>
  );
}

function GenericItemList({ items: itemList }: { items: MenuItemData[] }) {
  return (
    <div className="space-y-1 text-sm">
      {itemList.map((item) => (
        <div key={item.id} className="flex justify-between py-1 border-b border-border/20 last:border-0">
          <div>
            <span>{item.name}</span>
            {item.description && <span className="text-xs text-muted-foreground ml-2">{item.description}</span>}
          </div>
          <span className="font-font-mono font-bold text-primary shrink-0 ml-2">{item.price}</span>
        </div>
      ))}
    </div>
  );
}

// Generic renderer for admin-added sections with unknown slug
function GenericSection({ section }: { section: MenuSectionData }) {
  return (
    <section id={section.slug} className="space-y-6 scroll-mt-36">
      <SectionHeader section={section} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {section.groups.map((group) => (
          <div key={group.id} className="bg-card rounded-xl border border-border p-5">
            {group.title && (
              <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">
                  {group.title}
                  {group.note && <span className="text-xs text-muted-foreground font-font-sans font-normal ml-1">({group.note})</span>}
                </h3>
                {group.price && <span className="text-sm font-bold text-primary">{group.price}</span>}
              </div>
            )}
            <GenericItemList items={group.items} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const { t } = useI18n();
  const [sections, setSections] = useState<MenuSectionData[]>([]);
  const [vocab,    setVocab]    = useState<TVocab[]>([]);
  const [hero,     setHero]     = useState<THero | null>(null);
  const [cards,    setCards]    = useState<TCard[]>([]);
  const [cta,      setCta]      = useState<TCta | null>(null);
  const [tab,      setTab]      = useState<"current" | "test">("current");
  const [fading,   setFading]   = useState(false);

  function switchTab(next: "current" | "test") {
    if (next === tab) return;
    setFading(true);
    setTimeout(() => { setTab(next); setFading(false); }, 200);
  }

  useEffect(() => {
    fetch(`${BASE}/menu`)
      .then((r) => r.json())
      .then((data: unknown) => { if (Array.isArray(data)) setSections(data as MenuSectionData[]); })
      .catch(() => {});
    fetch(`${BASE}/page-content/menu`)
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        if (d?.sushiVocab) setVocab(d.sushiVocab as TVocab[]);
        if (d?.hero)       setHero(d.hero as THero);
        if (d?.cards)      setCards(d.cards as TCard[]);
        if (d?.cta)        setCta(d.cta as TCta);
      })
      .catch(() => {});
  }, []);

  const KNOWN_SLUGS = ["promo-bar", "sushi-bar", "bentolar", "noodles-rice", "main-kitchen", "aperatifler", "coffee-soft"];
  const unknownSections = sections.filter((s) => !KNOWN_SLUGS.includes(s.slug));

  const promoSec = sec(sections, "promo-bar");
  const sushiSec = sec(sections, "sushi-bar");
  const bentoSec = sec(sections, "bentolar");
  const noodleSec = sec(sections, "noodles-rice");
  const kitchenSec = sec(sections, "main-kitchen");
  const aperSec = sec(sections, "aperatifler");
  const coffeeSec = sec(sections, "coffee-soft");

  // Promo section data
  const biraGroup = grp(promoSec, "Buzzz Gibi Bira");
  const biraItems = (biraGroup?.items ?? []).filter((i) => !i.itemVariant || i.itemVariant === "with-pricenote-below");
  const kovaItems = (biraGroup?.items ?? []).filter((i) => i.itemVariant === "compact-muted");
  const shotItems = items(grp(promoSec, "Wine & Shot"));
  const balikGroup = grp(promoSec, "Günün Balığı");
  const balikItems = items(balikGroup);

  // Sushi section data
  const sashimiGroup = grp(sushiSec, "Sashimi");
  const allSashimiItems = sashimiGroup?.items ?? [];
  const nigiriSubIdx = allSashimiItems.findIndex((i) => i.itemVariant === "group-title");
  const sashimiItems = nigiriSubIdx >= 0 ? allSashimiItems.slice(0, nigiriSubIdx) : allSashimiItems;
  const nigiriItems  = nigiriSubIdx >= 0 ? allSashimiItems.slice(nigiriSubIdx + 1) : [];
  const makiItems = items(grp(sushiSec, "Maki"));
  const uramakiGroup = grp(sushiSec, "Special Uramaki Rolls");
  const uramakiItems = items(uramakiGroup);

  // Bento data
  const bentoItems = items(bentoSec?.groups[0]);

  // Noodle data
  const [eggGrp, udonGrp, padthaiGrp, riceGrp] = [
    grp(noodleSec, "Egg Noodle"),
    grp(noodleSec, "Udon Noodle"),
    grp(noodleSec, "Pad Thai"),
    grp(noodleSec, "Özel Pirinçler"),
  ];

  // Kitchen data
  const tavukItems = items(grp(kitchenSec, "Tavuk & Kırmızı Etler"));
  const balikKitchenItems = items(grp(kitchenSec, "Balık & Deniz Ürünleri"));
  const burgerItems = items(grp(kitchenSec, "Bilkent Burgerler"));

  // Aperatif data
  const aperatifItems = items(grp(aperSec, "Aperatifler"));
  const salataItems = items(grp(aperSec, "Salatalar"));
  const corbaGroup = grp(aperSec, "Çorbalar");
  const allCorbaItems = corbaGroup?.items ?? [];
  const kidsIdx = allCorbaItems.findIndex((i) => i.itemVariant === "group-title");
  const corbaItems = kidsIdx >= 0 ? allCorbaItems.slice(0, kidsIdx) : allCorbaItems;
  const kidsItems  = kidsIdx >= 0 ? allCorbaItems.slice(kidsIdx + 1) : [];

  // Coffee data
  const [sicakGrp, sogukGrp, cayGrp, tatliGrp] = [
    grp(coffeeSec, "Sıcak Kahveler"),
    grp(coffeeSec, "Soğuk Kahveler"),
    grp(coffeeSec, "Çaylar (Fincan)"),
    grp(coffeeSec, "Tatlılar & Soft"),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-white font-font-sans">
      <Navbar activePage="menu" />

      {/* Tab bar — sticky below navbar */}
      <div className="sticky top-20 z-[45] h-10 bg-card border-b border-border flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center gap-1">
          <button
            onClick={() => switchTab("current")}
            className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${tab === "current" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          >
            Mevcut Görünüm
          </button>
          <button
            onClick={() => switchTab("test")}
            className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${tab === "test" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          >
            Yeni Sistem
          </button>
        </div>
      </div>

      <div className={`transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}>
      {tab === "test" ? (
        <>
          {/* Hero — backend */}
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
          <div className="sticky top-[7.5rem] z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 overflow-x-auto py-3.5">
                {sections.map((s, i) => (
                  <a key={s.id} href={`#${s.slug}`}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 shrink-0 transition-colors ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"}`}
                  >
                    <iconify-icon icon={s.icon} className={i === 0 ? "" : "text-primary"} width="16" height="16"></iconify-icon>
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sections */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
            <MenuRenderer sections={sections as unknown as TSection[]} vocab={vocab} />

            {/* CTA — backend */}
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
        </>
      ) : (
      <>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-card/80 to-background border-b border-border/60 overflow-hidden py-10 sm:py-14">
        <div className="absolute inset-0 pointer-events-none opacity-15" style={{ backgroundImage: "radial-gradient(#C51F2B 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
                <iconify-icon icon="solar:flame-bold" className="text-primary animate-pulse" width="16" height="16"></iconify-icon>
                Bilkent&apos;in Asya &amp; Sokak Lezzetleri Buluşma Noktası
              </div>
              <h1 className="font-font-heading text-4xl sm:text-6xl font-bold tracking-tight text-foreground uppercase leading-[0.95]">
                STREET FOOD <span className="text-primary">&amp; CRAFT BAR</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
                Taze Sushi, Wok Noodle, Bento kutuları, özel burgerler ve gecenin ritmini tutan buz gibi fıçı biralar ile kendi kokteylini tasarlayabileceğin interaktif bar deneyimi.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border">
                  <iconify-icon icon="solar:cup-bold" className="text-primary" width="16" height="16"></iconify-icon>
                  <span className="text-xs font-semibold">Buzzz Gibi Fıçı 240₺&apos;den Başlayan</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border">
                  <iconify-icon icon="mdi:fish" className="text-primary" width="16" height="16"></iconify-icon>
                  <span className="text-xs font-semibold">Günün Balığı Özel 675₺</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card border border-border">
                  <iconify-icon icon="solar:stars-minimalistic-bold" className="text-primary" width="16" height="16"></iconify-icon>
                  <span className="text-xs font-semibold">5+1 Shot &amp; Şişe Fırsatları</span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div className="group relative rounded-xl overflow-hidden border border-border bg-card p-4 hover:border-primary/60 transition-all shadow-lg">
                <div className="h-36 rounded-lg overflow-hidden relative mb-3">
                  <img src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/AAIvuxGxRFa.jpeg" alt="Sushi Specials" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-primary-foreground font-font-heading uppercase text-xs tracking-wider">Sushi Bar</div>
                </div>
                <h2 className="font-font-heading text-lg font-bold uppercase tracking-wide">Taze Sushi &amp; Rolls</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Uramaki, Maki, Nigiri &amp; Sashimi spesiyalleri</p>
              </div>
              <div className="group relative rounded-xl overflow-hidden border border-border bg-card p-4 hover:border-primary/60 transition-all shadow-lg">
                <div className="h-36 rounded-lg overflow-hidden relative mb-3">
                  <img src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/Qryfgpi8vmj.jpeg" alt="Craft Beer &amp; Shots" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-primary-foreground font-font-heading uppercase text-xs tracking-wider">Bar &amp; Promo</div>
                </div>
                <h2 className="font-font-heading text-lg font-bold uppercase tracking-wide">Fıçı &amp; 5+1 Shotlar</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Bud, Efes, Kovalar, Tekila &amp; Jäger paketleri</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category nav */}
      <div className="sticky top-[7.5rem] z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3.5">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.slug}`}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 shrink-0 transition-colors ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"}`}
              >
                <iconify-icon icon={s.icon} className={i === 0 ? "" : "text-primary"} width="16" height="16"></iconify-icon>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        {/* Promo & Bar */}
        {promoSec && (
          <section id="promo-bar" className="space-y-6 scroll-mt-36">
            <SectionHeader section={promoSec} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Beer */}
              <div className="bg-card rounded-xl border border-border p-5 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -right-6 -bottom-6 size-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <div className="inline-block px-3 py-1 rounded bg-primary text-primary-foreground font-font-heading uppercase text-sm tracking-wider font-bold mb-3">Buzzz Gibi Bira</div>
                  <div className="space-y-3 mt-2">
                    {biraItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/60 last:border-0">
                        <div>
                          <div className="font-bold text-sm text-foreground">{item.name}</div>
                          {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                        </div>
                        <div className="text-right font-font-mono font-bold text-foreground shrink-0 ml-2">
                          <div>{item.price}</div>
                          {item.priceNote && <div className="text-primary text-xs">{item.priceNote}</div>}
                        </div>
                      </div>
                    ))}
                    {kovaItems.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <div className="text-xs uppercase font-bold tracking-wider text-primary">Kova Fırsatları</div>
                        {kovaItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs text-muted-foreground py-1">
                            <span>{item.name}</span>
                            <span className="font-font-mono font-bold text-foreground">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Wine & Shot */}
              <div className="bg-card rounded-xl border border-border p-5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 rounded bg-primary text-primary-foreground font-font-heading uppercase text-sm tracking-wider font-bold mb-3">Wine &amp; Shot</div>
                  <div className="space-y-3 mt-2">
                    {shotItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/60 last:border-0">
                        <div>
                          <div className="font-bold text-sm text-foreground">{item.name}</div>
                          {item.priceNote && <div className="text-xs text-muted-foreground line-through opacity-70">{item.priceNote}</div>}
                        </div>
                        <div className="font-font-mono font-bold text-primary text-base shrink-0 ml-2">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Günün Balığı */}
              <div className="bg-card rounded-xl border border-primary/50 p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
                {balikGroup?.price && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl">Sadece {balikGroup.price}</div>
                )}
                <div>
                  <div className="inline-block px-3 py-1 rounded bg-secondary text-secondary-foreground font-font-heading uppercase text-sm tracking-wider font-bold mb-3">Günün Balığı</div>
                  <p className="text-xs text-muted-foreground mb-3">Her gün taze deniz ürünleri servisi:</p>
                  <div className="space-y-2.5 text-xs">
                    {balikItems.map((item) => (
                      <div key={item.id} className="flex justify-between py-1 border-b border-border/40 last:border-0">
                        <span className="text-muted-foreground font-medium">{item.name}</span>
                        <span className="font-bold text-foreground">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sushi Bar */}
        {sushiSec && (
          <section id="sushi-bar" className="space-y-6 scroll-mt-36">
            <SectionHeader section={sushiSec} />
            <div className="p-4 rounded-xl bg-card border border-border flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-font-heading text-primary text-sm font-bold uppercase tracking-wider">Sushi Sözlüğü:</span>
                <span className="text-muted-foreground"><strong className="text-foreground">Sake:</strong> Somon</span>
                •<span className="text-muted-foreground"><strong className="text-foreground">Suzuki:</strong> Levrek</span>
                •<span className="text-muted-foreground"><strong className="text-foreground">Ebi:</strong> Karides</span>
                •<span className="text-muted-foreground"><strong className="text-foreground">Kani:</strong> Yengeç Surimi</span>
                •<span className="text-muted-foreground"><strong className="text-foreground">Unagi:</strong> Yılan Balığı</span>
                •<span className="text-muted-foreground"><strong className="text-foreground">Tobiko:</strong> Uçan Balık Yumurtası</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-6">
                {/* Sashimi */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3 border-b border-border/80 pb-2">
                    <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">
                      Sashimi <span className="text-xs text-muted-foreground font-font-sans font-normal">(4 pcs)</span>
                    </h3>
                    <iconify-icon icon="solar:fire-square-bold" className="text-primary" width="16" height="16"></iconify-icon>
                  </div>
                  <div className="space-y-2 mb-6 text-sm">
                    {sashimiItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <span className="font-font-mono font-bold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-3 border-b border-border/80 pb-2">
                    <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">
                      Nigiri <span className="text-xs text-muted-foreground font-font-sans font-normal">(2 pcs)</span>
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    {nigiriItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <span className="font-font-mono font-bold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Maki */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3 border-b border-border/80 pb-2">
                    <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">
                      Maki <span className="text-xs text-muted-foreground font-font-sans font-normal">(8 pcs)</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {makiItems.map((item) => (
                      <div key={item.id} className="flex justify-between py-1 border-b border-border/30">
                        <span>{item.name}</span>
                        <span className="font-font-mono font-bold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Special Uramaki */}
              <div className="lg:col-span-7 bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <div>
                    <h3 className="font-font-heading text-2xl uppercase font-bold text-foreground">
                      {uramakiGroup?.title ?? "Special Uramaki Rolls"}{" "}
                      {uramakiGroup?.note && <span className="text-xs text-muted-foreground font-font-sans font-normal">({uramakiGroup.note})</span>}
                    </h3>
                    {uramakiGroup?.subtitle && <p className="text-xs text-muted-foreground">{uramakiGroup.subtitle}</p>}
                  </div>
                  <span className="px-2.5 py-1 rounded bg-primary/20 text-primary font-font-mono text-xs font-bold border border-primary/40">{t("menu.signatureLabel")}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uramakiItems.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-lg bg-background/70 border border-border/60 hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                        <span className="font-font-mono font-bold text-primary text-sm">{item.price}</span>
                      </div>
                      {item.description && <p className="text-[11px] text-muted-foreground mt-1">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bentolar */}
        {bentoSec && (
          <section id="bentolar" className="space-y-6 scroll-mt-36">
            <SectionHeader section={bentoSec} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bentoItems.map((item) => (
                <div key={item.id} className="bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-font-heading text-lg font-bold text-foreground">{item.name}</span>
                      <span className="font-font-mono font-bold text-primary">{item.price}</span>
                    </div>
                    {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Noodle & Rice */}
        {noodleSec && (
          <section id="noodles-rice" className="space-y-6 scroll-mt-36">
            <SectionHeader section={noodleSec} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[eggGrp, udonGrp, padthaiGrp, riceGrp].filter(Boolean).map((group) => (
                <div key={group!.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                    <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">{group!.title}</h3>
                    {group!.subtitle && <span className="text-[10px] uppercase font-bold text-primary">{group!.subtitle}</span>}
                  </div>
                  <div className="space-y-2 text-sm">
                    {group!.items.map((item) => (
                      <div key={item.id} className="flex justify-between py-1 border-b border-border/20 last:border-0">
                        <span>{item.name}</span>
                        <span className="font-font-mono font-bold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ana Mutfak & Burgerler */}
        {kitchenSec && (
          <section id="main-kitchen" className="space-y-6 scroll-mt-36">
            <SectionHeader section={kitchenSec} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="burgerler">
              {[
                { title: "Tavuk & Kırmızı Etler", items: tavukItems },
                { title: "Balık & Deniz Ürünleri", items: balikKitchenItems },
                { title: "Bilkent Burgerler", items: burgerItems },
              ].map(({ title, items: groupItems }) => (
                <div key={title} className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <h3 className="font-font-heading text-xl uppercase font-bold text-foreground border-b border-border pb-2">{title}</h3>
                  <div className="space-y-2 text-sm">
                    {groupItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                        <div>
                          <div className="font-bold">{item.name}</div>
                          {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                        </div>
                        <span className="font-font-mono font-bold text-primary shrink-0 ml-2">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Aperatif, Salata & Çorba */}
        {aperSec && (
          <section id="aperatifler" className="space-y-6 scroll-mt-36">
            <SectionHeader section={aperSec} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-font-heading text-xl uppercase font-bold text-foreground mb-3 pb-2 border-b border-border">Aperatifler</h3>
                <GenericItemList items={aperatifItems} />
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-font-heading text-xl uppercase font-bold text-foreground mb-3 pb-2 border-b border-border">Salatalar</h3>
                <GenericItemList items={salataItems} />
              </div>
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                <div>
                  <h3 className="font-font-heading text-xl uppercase font-bold text-foreground mb-2 pb-1 border-b border-border">Çorbalar</h3>
                  <GenericItemList items={corbaItems} />
                </div>
                <div>
                  <h3 className="font-font-heading text-xl uppercase font-bold text-foreground mb-2 pb-1 border-b border-border">Kids York</h3>
                  <GenericItemList items={kidsItems} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Kahve & Tatlılar */}
        {coffeeSec && (
          <section id="coffee-soft" className="space-y-6 scroll-mt-36">
            <SectionHeader section={coffeeSec} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[sicakGrp, sogukGrp, cayGrp, tatliGrp].filter(Boolean).map((group) => (
                <div key={group!.id} className="bg-card rounded-xl border border-border p-5">
                  <h3 className="font-font-heading text-lg uppercase font-bold text-foreground border-b border-border pb-2 mb-3">{group!.title}</h3>
                  <GenericItemList items={group!.items} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Unknown/admin-added sections */}
        {unknownSections.map((section) => (
          <GenericSection key={section.id} section={section} />
        ))}

        {/* CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-secondary via-card to-secondary border border-primary/40 p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs uppercase font-bold tracking-widest">{t("menu.monthlyCocktailContest")}</span>
            <h2 className="font-font-heading text-3xl sm:text-5xl font-bold uppercase tracking-wider text-foreground">
              {t("menu.ctaHeading")} <span className="text-primary">{t("menu.ctaHighlight")}</span>
            </h2>
            <p className="text-sm text-muted-foreground">{t("menu.ctaDesc")}</p>
            <div className="pt-2">
              <a href="/" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-font-heading tracking-wider uppercase text-base font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                <iconify-icon icon="solar:cup-paper-bold" width="20" height="20"></iconify-icon>
                {t("menu.ctaBtn")}
              </a>
            </div>
          </div>
        </div>
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
      </>
      )}
      </div>{/* /fade wrapper */}
    </div>
  );
}
