"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";

type GlassId = "coupe" | "old-fashioned" | "highball" | "nick-nora";
type SpiritId = "bulleit" | "mezcal" | "roku" | "havana";
type MixerId = "campari" | "carpano" | "yuzu" | "ginger-beer" | "creme-de-mure" | "smoked-bitters";
type IceId = "diamond" | "straight-up" | "crushed";
type GarnishId = "orange-peel" | "rosemary" | "cherry" | "gold-leaf";

const GLASSES: { id: GlassId; icon: string; label: string; sub: string }[] = [
  { id: "coupe", icon: "ph:wine-bold", label: "Coupe", sub: "Saplı · Aromatik" },
  { id: "old-fashioned", icon: "solar:cup-bold", label: "Old Fashioned", sub: "Ağır Taban · Lowball" },
  { id: "highball", icon: "ph:pint-glass-bold", label: "Highball", sub: "Uzun · Ferahlatıcı" },
  { id: "nick-nora", icon: "ph:martini-bold", label: "Nick & Nora", sub: "Klasik · İçki Yoğun" },
];

const SPIRITS: { id: SpiritId; icon: string; name: string; tag: string | null; desc: string; ml: string; flavorKey: string; flavorIcon: string; extra: number }[] = [
  { id: "bulleit", icon: "solar:fire-bold", name: "Bulleit Kentucky Bourbon", tag: null, desc: "Smoky oak, vanilla bean, caramel spice · 45% ABV", ml: "45 ml", flavorKey: "lab.oakBody", flavorIcon: "ph:waves-bold", extra: 0 },
  { id: "mezcal", icon: "solar:leaf-bold", name: "Mezcal Verde Momento", tag: "Oaxaca", desc: "Smoky agave, campfire ember, herbal earth · 42% ABV", ml: "45 ml", flavorKey: "lab.smoky", flavorIcon: "ph:cloud-fog-bold", extra: 40 },
  { id: "roku", icon: "mdi:flower", name: "Roku Craft Japanese Gin", tag: "Tokyo", desc: "Sakura flower, yuzu peel, sansho pepper · 43% ABV", ml: "45 ml", flavorKey: "lab.floralCitrus", flavorIcon: "ph:sparkle-bold", extra: 20 },
  { id: "havana", icon: "solar:sun-2-bold", name: "Havana Club 7 Años Rum", tag: "Cuba", desc: "Tobacco leaf, rich molasses, tropical wood · 40% ABV", ml: "45 ml", flavorKey: "lab.deepSweet", flavorIcon: "ph:cookie-bold", extra: 25 },
];

const MIXERS: { id: MixerId; icon: string; name: string; sub: string; extra: number; ml: string; always: boolean }[] = [
  { id: "campari", icon: "ph:sparkle-fill", name: "Campari Milano", sub: "Acı Portakal & Bitkiler", extra: 0, ml: "25ml", always: true },
  { id: "carpano", icon: "ph:wine-fill", name: "Carpano Antica", sub: "Tatlı Vermut & Vanilya", extra: 30, ml: "25ml", always: false },
  { id: "yuzu", icon: "ph:citrus-bold", name: "House Yuzu Cordial", sub: "Ekşi Narenciye & Çiçek", extra: 35, ml: "20ml", always: false },
  { id: "ginger-beer", icon: "ph:bubble-bold", name: "Fermented Ginger Beer", sub: "Ateşli Karbonasyon & Lime", extra: 25, ml: "60ml", always: false },
  { id: "creme-de-mure", icon: "ph:tree-evergreen-bold", name: "Crème de Mûre", sub: "Yaban Karası Zenginliği", extra: 30, ml: "20ml", always: false },
  { id: "smoked-bitters", icon: "ph:eyedropper-sample-bold", name: "Smoked Barrel Bitters", sub: "Aromatik Kınakına & Karanfil", extra: 15, ml: "3 damla", always: false },
];

const ICE_TYPES: { id: IceId; icon: string; labelKey: string; subKey: string }[] = [
  { id: "diamond", icon: "ph:cube-bold", labelKey: "lab.clearDiamond", subKey: "lab.slowMelt" },
  { id: "straight-up", icon: "ph:circle-notch-bold", labelKey: "lab.straightUp", subKey: "lab.coupeChilled" },
  { id: "crushed", icon: "ph:asterisk-simple-bold", labelKey: "lab.crushedMountain", subKey: "lab.frostyCold" },
];

const GARNISHES: { id: GarnishId; icon: string; label: string; extra: number }[] = [
  { id: "orange-peel", icon: "solar:fire-bold", label: "Flamed Orange Peel", extra: 0 },
  { id: "rosemary", icon: "solar:leaf-linear", label: "Torched Rosemary Sprig", extra: 0 },
  { id: "cherry", icon: "ph:circle-duotone", label: "Brandied Luxardo Cherry", extra: 0 },
  { id: "gold-leaf", icon: "ph:sparkle-bold", label: "24k Gold Leaf Rim", extra: 30 },
];

const BASE_PRICE = 380;

const SPIRIT_FLAVOR: Record<SpiritId, number> = { bulleit: 0.55, mezcal: 0.72, roku: 0.22, havana: 0.38 };

const SPIRIT_LAYER_COLOR: Record<SpiritId, string> = {
  bulleit: "bg-primary/60",
  mezcal: "bg-amber-700/60",
  roku: "bg-cyan-500/40",
  havana: "bg-amber-500/60",
};

const GLASS_SHAPE: Record<GlassId, string> = {
  "coupe":         "h-52 w-48 rounded-b-[5rem]",
  "old-fashioned": "h-36 w-48 rounded-b",
  "highball":      "h-64 w-32 rounded-b",
  "nick-nora":     "h-48 w-40 rounded-b-3xl",
};

const MIXER_LAYER_COLOR: Record<MixerId, string> = {
  campari: "bg-destructive/60",
  carpano: "bg-secondary/80",
  yuzu: "bg-yellow-400/40",
  "ginger-beer": "bg-orange-400/30",
  "creme-de-mure": "bg-purple-700/50",
  "smoked-bitters": "bg-accent/40",
};

export default function CocktailLabPage() {
  const { t } = useI18n();

  const [glass, setGlass] = useState<GlassId>("coupe");
  const [spirit, setSpirit] = useState<SpiritId>("bulleit");
  const [mixers, setMixers] = useState<MixerId[]>(["campari", "carpano"]);
  const [ice, setIce] = useState<IceId>("straight-up");
  const [garnishes, setGarnishes] = useState<GarnishId[]>(["orange-peel"]);
  const [cocktailName, setCocktailName] = useState("MIDNIGHT IN BILKENT");

  const toggleMixer = (id: MixerId) => {
    if (id === "campari") return;
    setMixers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleGarnish = (id: GarnishId) => {
    setGarnishes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedSpiritData = SPIRITS.find((s) => s.id === spirit)!;
  const selectedGlassData = GLASSES.find((g) => g.id === glass)!;
  const activeMixers = MIXERS.filter((m) => mixers.includes(m.id));

  const totalPrice =
    BASE_PRICE +
    selectedSpiritData.extra +
    activeMixers.reduce((sum, m) => sum + m.extra, 0) +
    GARNISHES.filter((g) => garnishes.includes(g.id)).reduce((sum, g) => sum + g.extra, 0);

  const rawLayers = [
    { label: selectedSpiritData.name.split(" ").slice(0, 2).join(" "), ml: "45ml", color: SPIRIT_LAYER_COLOR[spirit] },
    ...activeMixers.map((m) => ({ label: m.name.split(" ").slice(0, 2).join(" "), ml: m.ml, color: MIXER_LAYER_COLOR[m.id] })),
  ].slice(0, 4);
  const allLayers = [
    ...rawLayers,
    ...Array(Math.max(0, 4 - rawLayers.length)).fill({ label: "", ml: "", color: "bg-card/10" }),
  ];

  const flavorPos = SPIRIT_FLAVOR[spirit];
  const firstGarnish = GARNISHES.find((g) => garnishes.includes(g.id));

  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysLeft = Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const monthYear = now.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background text-foreground font-font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar activePage="cocktailLab" />

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {/* Page title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <span>Bilkent York</span>
              <span>/</span>
              <span className="text-primary">Kendi Kokteylini Tasarla</span>
            </div>
            <h1 className="font-font-heading mt-2 text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-foreground">
              {t("lab.heading")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{t("lab.subheading")}</p>
          </div>
          <div className="self-start md:self-end flex items-center gap-2 border border-border bg-card px-4 py-2.5">
            <iconify-icon icon="solar:calendar-bold" className="text-primary" width="16" height="16"></iconify-icon>
            <span className="font-font-heading text-sm text-foreground tracking-wider capitalize">{monthYear}</span>
            <span className="text-border">·</span>
            <span className="font-font-heading text-sm text-primary tracking-wider">{daysLeft} {t("lab.daysLeft")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-8">

            {/* Step 01 — Glassware */}
            <section className="border border-border bg-card p-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">01</span>
                  <div>
                    <h2 className="font-font-heading text-2xl uppercase tracking-wide text-foreground">{t("lab.step01Title")}</h2>
                    <p className="text-xs text-muted-foreground">{t("lab.step01Desc")}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-primary">{selectedGlassData.label}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {GLASSES.map((g) => {
                  const active = glass === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGlass(g.id)}
                      className={`flex flex-col items-center text-center p-3.5 border-2 transition-all group ${active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-input/40 hover:border-primary/60 text-muted-foreground hover:text-foreground"}`}
                    >
                      <div className={`size-12 flex items-center justify-center rounded mb-2.5 group-hover:scale-110 transition-transform ${active ? "bg-primary/20 text-primary" : "bg-card text-muted-foreground group-hover:text-primary"}`}>
                        <iconify-icon icon={g.icon} width="28" height="28"></iconify-icon>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">{g.label}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{g.sub}</span>
                      <span className={`mt-2 text-[10px] font-bold flex items-center gap-1 ${active ? "text-primary" : "text-muted-foreground font-semibold"}`}>
                        {active ? (
                          <><iconify-icon icon="ph:check-bold" width="12" height="12"></iconify-icon>{t("lab.active")}</>
                        ) : t("lab.select")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 02 — Base Spirit */}
            <section className="border border-border bg-card p-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">02</span>
                  <div>
                    <h2 className="font-font-heading text-2xl uppercase tracking-wide text-foreground">{t("lab.step02Title")}</h2>
                    <p className="text-xs text-muted-foreground">{t("lab.step02Desc")}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{t("lab.step02Max")}</span>
              </div>
              <div className="mt-5 space-y-3">
                {SPIRITS.map((s) => {
                  const active = spirit === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSpirit(s.id)}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-2 cursor-pointer transition-colors ${active ? "border-primary bg-primary/10" : "border-border bg-input/30 hover:border-border/80"}`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`size-10 flex items-center justify-center border shrink-0 transition-colors ${active ? "border-primary bg-primary/20 text-primary" : "border-border bg-card text-muted-foreground"}`}>
                          <iconify-icon icon={s.icon} width="20" height="20"></iconify-icon>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">{s.name}</span>
                            {active && (
                              <span className="bg-primary/30 text-primary text-[9px] font-extrabold uppercase px-1.5 py-0.5 tracking-wider">{t("lab.selectedBadge")}</span>
                            )}
                            {!active && s.tag && (
                              <span className="border border-border text-muted-foreground text-[9px] font-bold uppercase px-1.5 py-0.5 tracking-wider">{s.tag}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                          <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className={`flex items-center gap-1 ${active ? "text-primary" : ""}`}>
                              <iconify-icon icon="ph:drop-bold" width="12" height="12"></iconify-icon>
                              {s.ml}
                            </span>
                            <span className="flex items-center gap-1">
                              <iconify-icon icon={s.flavorIcon} width="12" height="12"></iconify-icon>
                              {t(s.flavorKey)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-border pt-2 sm:pt-0 shrink-0">
                        {active ? (
                          <>
                            <span className="font-font-heading text-xl text-primary">{t("lab.included")}</span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("lab.baseSpirit")}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-font-heading text-lg text-foreground">+₺{s.extra}</span>
                            <button
                              className="border border-border bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-wider hover:border-primary text-muted-foreground hover:text-foreground"
                              onClick={(e) => { e.stopPropagation(); setSpirit(s.id); }}
                            >
                              {t("lab.switchBtn")}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Step 03 — Mixers */}
            <section className="border border-border bg-card p-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">03</span>
                  <div>
                    <h2 className="font-font-heading text-2xl uppercase tracking-wide text-foreground">{t("lab.step03Title")}</h2>
                    <p className="text-xs text-muted-foreground">{t("lab.step03Desc")}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-primary">{mixers.length} {t("lab.step03Selected")}</span>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {MIXERS.map((m) => {
                  const active = mixers.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleMixer(m.id)}
                      className={`p-3.5 border-2 relative transition-colors ${m.always ? "cursor-default" : "cursor-pointer"} ${active ? "border-primary bg-primary/10" : "border-border bg-input/40 hover:border-primary/60"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`size-9 flex items-center justify-center rounded ${active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
                            <iconify-icon icon={m.icon} width="16" height="16"></iconify-icon>
                          </div>
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{m.name}</h3>
                            <span className="text-[10px] text-muted-foreground">{m.sub}</span>
                          </div>
                        </div>
                        {active
                          ? <iconify-icon icon="ph:check-circle-fill" className="text-primary shrink-0" width="16" height="16"></iconify-icon>
                          : <span className="text-xs font-bold text-foreground shrink-0">+₺{m.extra}</span>
                        }
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-primary" : "text-muted-foreground"}`}>
                          {active ? (m.extra === 0 ? t("lab.included") : `+₺${m.extra}`) : t("lab.addModifier")}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{m.ml}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Step 04 — Ice, Garnish & Finish */}
            <section className="border border-border bg-card p-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">04</span>
                  <div>
                    <h2 className="font-font-heading text-2xl uppercase tracking-wide text-foreground">{t("lab.step04Title")}</h2>
                    <p className="text-xs text-muted-foreground">{t("lab.step04Desc")}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-primary block mb-2.5">
                  <iconify-icon icon="ph:snowflake-bold" className="inline mr-1" width="14" height="14"></iconify-icon>
                  {t("lab.iceProgram")}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {ICE_TYPES.map((it) => {
                    const active = ice === it.id;
                    return (
                      <button
                        key={it.id}
                        onClick={() => setIce(it.id)}
                        className={`p-3 border-2 text-center transition-colors ${active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-input/30 hover:border-primary/60 text-muted-foreground hover:text-foreground"}`}
                      >
                        <iconify-icon icon={it.icon} className={`mx-auto mb-1 ${active ? "text-primary" : ""}`} width="20" height="20"></iconify-icon>
                        <span className="block text-xs font-bold">{t(it.labelKey)}</span>
                        <span className={`block text-[9px] ${active ? "text-primary" : "text-muted-foreground"}`}>{t(it.subKey)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6">
                <label className="text-[11px] font-bold uppercase tracking-widest text-primary block mb-2.5">
                  <iconify-icon icon="solar:flame-bold" className="inline mr-1" width="14" height="14"></iconify-icon>
                  {t("lab.garnishAromatics")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {GARNISHES.map((g) => {
                    const active = garnishes.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGarnish(g.id)}
                        className={`flex items-center gap-1.5 border-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"}`}
                      >
                        <iconify-icon icon={g.icon} width="16" height="16"></iconify-icon>
                        <span>{g.label}</span>
                        {g.extra > 0 && (
                          <span className={`text-[9px] ${active ? "text-primary-foreground/80" : "text-primary"}`}>(+₺{g.extra})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Right column — live formulation */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="border-2 border-primary/60 bg-card p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-12 -top-12 size-40 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 border border-primary bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                    {t("lab.liveFormulation")}
                  </span>
                  <p className="font-font-heading mt-2 text-2xl uppercase tracking-wider text-foreground">Bilkent York Specimen #094</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("lab.calculatedTab")}</span>
                  <p className="font-font-heading text-4xl text-primary leading-none mt-0.5">₺{totalPrice}</p>
                </div>
              </div>

              {/* Glass visualizer */}
              <div className="my-6 flex flex-col items-center justify-center py-4 bg-background/50 border border-border relative">
                <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <iconify-icon icon={selectedGlassData.icon} className="text-primary" width="16" height="16"></iconify-icon>
                  {selectedGlassData.label}
                </div>
                <div className={`relative mt-4 flex flex-col items-center justify-end border-2 border-primary/80 bg-gradient-to-t from-primary/40 via-secondary/30 to-card/60 p-2 shadow-inner overflow-hidden transition-all duration-500 ${GLASS_SHAPE[glass]}`}>
                  {firstGarnish && (
                    <div className="absolute -top-1 -right-1 flex items-center gap-1 bg-primary text-primary-foreground text-[8px] font-bold uppercase px-2 py-0.5 rounded shadow">
                      <iconify-icon icon="solar:fire-bold" width="12" height="12"></iconify-icon>
                      {firstGarnish.label.split(" ").slice(0, 2).join(" ")}
                    </div>
                  )}
                  {allLayers.map((layer, i) => (
                    <div
                      key={i}
                      className={`w-full h-1/4 ${layer.color} border-t border-white/10 flex items-center justify-between px-3 transition-all duration-300`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/80 truncate">{layer.label}</span>
                      <span className="text-[8px] text-foreground/60 shrink-0 ml-1">{layer.ml}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full max-w-xs mt-5 px-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>{t("lab.sweet")}</span>
                    <span className="text-primary">{t("lab.smokyBitter")}</span>
                    <span>{t("lab.dry")}</span>
                  </div>
                  <div className="h-2 w-full bg-input rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 h-full w-8 bg-primary rounded-full transition-all duration-500"
                      style={{ left: `calc(${flavorPos * 100}% - 16px)` }}
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients breakdown */}
              <div className="space-y-2 border-t border-border pt-4 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <iconify-icon icon="ph:check-bold" className="text-primary" width="12" height="12"></iconify-icon>
                    {selectedSpiritData.name} ({selectedSpiritData.ml})
                  </span>
                  <span className="font-semibold text-foreground shrink-0 ml-2">₺{BASE_PRICE + selectedSpiritData.extra} (Base)</span>
                </div>
                {activeMixers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <iconify-icon icon="ph:check-bold" className="text-primary" width="12" height="12"></iconify-icon>
                      {m.name} ({m.ml})
                    </span>
                    <span className="font-semibold text-foreground shrink-0 ml-2">{m.extra === 0 ? t("lab.included") : `+₺${m.extra}`}</span>
                  </div>
                ))}
                {garnishes.map((gId) => {
                  const g = GARNISHES.find((x) => x.id === gId)!;
                  return (
                    <div key={gId} className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <iconify-icon icon="ph:check-bold" className="text-primary" width="12" height="12"></iconify-icon>
                        {g.label}
                      </span>
                      <span className="font-semibold text-foreground shrink-0 ml-2">{g.extra === 0 ? t("lab.included") : `+₺${g.extra}`}</span>
                    </div>
                  );
                })}
              </div>

              {/* Name your cocktail */}
              <div className="mt-6 border-t border-border pt-4">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  <iconify-icon icon="solar:pen-bold" className="inline mr-1" width="12" height="12"></iconify-icon>
                  {t("lab.nameLabel")}
                </label>
                <div className="mt-2 relative">
                  <input
                    type="text"
                    value={cocktailName}
                    onChange={(e) => setCocktailName(e.target.value.toUpperCase())}
                    className="w-full border border-border bg-input px-4 py-3 font-font-heading text-2xl uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-primary">{t("lab.byAuthor")}</span>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">{t("lab.winMsg")}</p>
              </div>

              {/* CTA */}
              <div className="mt-6 space-y-2">
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-xs font-bold uppercase tracking-[0.22em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <iconify-icon icon="solar:card-send-bold" width="20" height="20"></iconify-icon>
                  <span>{t("lab.orderBtn")} · ₺{totalPrice}</span>
                </button>
                <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">{t("lab.tableInfo")}</p>
              </div>
            </div>

            {/* Leaderboard rules */}
            <div className="border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <iconify-icon icon="solar:cup-star-bold" className="text-primary" width="20" height="20"></iconify-icon>
                  <h3 className="font-font-heading text-lg uppercase tracking-wide text-foreground">{t("lab.rulesTitle")}</h3>
                </div>
                <a href="/leaderboard" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">{t("lab.viewRank1")}</a>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>{t("lab.rule1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>{t("lab.rule2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>{t("lab.rule3")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card/60 py-10 text-muted-foreground">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <iconify-icon icon="solar:compass-bold-duotone" width="20" height="20"></iconify-icon>
            </div>
            <div>
              <span className="block font-font-heading text-lg uppercase tracking-wider text-foreground">Bilkent York</span>
              <span className="block text-[9px] uppercase tracking-widest text-muted-foreground">{t("footer.location")}</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
            <a href="/menu" className="hover:text-primary transition-colors">{t("footer.menu")}</a>
            <a href="/" className="hover:text-primary transition-colors">{t("footer.cocktailLab")}</a>
            <a href="/leaderboard" className="hover:text-primary transition-colors">{t("footer.leaderboard")}</a>
            <a href="#" className="hover:text-primary transition-colors">{t("footer.reservations")}</a>
          </div>
          <p className="text-xs text-muted-foreground">{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
