"use client";

import React, { useId, useState } from "react";
import { Navbar } from "@/components/Navbar";

// ── Types ─────────────────────────────────────────────────────────────────────

type GlassId = "coupe" | "old-fashioned" | "highball" | "nick-nora" | "margarita";

type Glass = {
  id: GlassId;
  imgSrc: string;
  name: string;
  sub: string;
  style: string;
  // sidebar shape
  glassClass: string;
  spiritClass: string;
  showStem: boolean;
};

type Spirit = {
  id: string;
  name: string;
  subTag: string;
  subTagStyle?: string;
  note: string;
  desc: string;
  price: number;
  icon: string;
  iconHoverClass?: string;
  profile: string;
  outOfStock?: boolean;
  liquidColors: [string, string, string];
  tint: number;
};

// ── Data ──────────────────────────────────────────────────────────────────────

const GLASSES: Glass[] = [
  {
    id: "coupe",
    imgSrc: "/icons/glasses/coupe.svg",
    name: "COUPE",
    sub: "Saplı · Aromatik",
    style: "Klasik & Zarif",
    glassClass: "w-44 h-40 rounded-b-[64px]",
    spiritClass: "rounded-b-[52px]",
    showStem: true,
  },
  {
    id: "old-fashioned",
    imgSrc: "/icons/glasses/rocks.svg",
    name: "OLD FASHIONED",
    sub: "Ağır Taban · Lowball",
    style: "Güçlü & Yoğun",
    glassClass: "w-44 h-28 rounded-b-lg",
    spiritClass: "rounded-b",
    showStem: false,
  },
  {
    id: "highball",
    imgSrc: "/icons/glasses/highball.svg",
    name: "HIGHBALL",
    sub: "Uzun · Ferahlatıcı",
    style: "Ferah & Uzun",
    glassClass: "w-28 h-56 rounded-b-lg",
    spiritClass: "rounded-b",
    showStem: false,
  },
  {
    id: "nick-nora",
    imgSrc: "/icons/glasses/martini-glass.svg",
    name: "NICK & NORA",
    sub: "Klasik · İçki Yoğun",
    style: "Narin & Sofistike",
    glassClass: "w-40 h-48 rounded-b-[36px]",
    spiritClass: "rounded-b-[28px]",
    showStem: true,
  },
  {
    id: "margarita",
    imgSrc: "/icons/glasses/margarita-glass.svg",
    name: "MARGARITA",
    sub: "Geniş Ağız · Tuzlu Rim",
    style: "Canlı & Egzotik",
    glassClass: "w-48 h-36 rounded-b-[48px]",
    spiritClass: "rounded-b-[36px]",
    showStem: true,
  },
];

const SPIRITS: Spirit[] = [
  {
    id: "bulleit",
    name: "BULLEIT 95 RYE",
    subTag: "Baharatlı Çavdar",
    note: "100 Proof • Çavdar & Meşe",
    desc: "Yoğun baharat, yanık meşe ve kuru çavdarın güçlü dengesi.",
    price: 45,
    icon: "solar:bottle-bold",
    profile: "Yoğun & Baharatlı",
    liquidColors: ["#3b1e0a", "#92400e", "#d97706"],
    tint: 1.0,
  },
  {
    id: "roku",
    name: "ROKU CRAFT GIN",
    subTag: "Botanik",
    subTagStyle: "text-muted-foreground bg-secondary",
    note: "Sakura, Yuzu, Sencha",
    desc: "6 özel Japon botaniği ile dengelenmiş ferah çiçeksi profil.",
    price: 40,
    icon: "solar:leaf-bold",
    iconHoverClass: "group-hover:text-primary",
    profile: "Ferah & Çiçeksi",
    liquidColors: ["#334155", "#94a3b8", "#d1fae5"],
    tint: 0.28,
  },
  {
    id: "donjulio",
    name: "DON JULIO BLANCO",
    subTag: "%100 Agave",
    subTagStyle: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
    note: "Canlı Narenciye & Biber",
    desc: "Taze agave ve canlı narenciye notaları ile yüksek enerji.",
    price: 50,
    icon: "solar:sun-bold",
    iconHoverClass: "group-hover:text-amber-400",
    profile: "Narenciye Uyumlu",
    liquidColors: ["#475569", "#cbd5e1", "#f8fafc"],
    tint: 0.22,
  },
  {
    id: "mezcal",
    name: "ARTISANAL MEZCAL",
    subTag: "Tükendi",
    subTagStyle: "text-destructive bg-destructive/20 border border-destructive/30",
    note: "İsli Taş Fırın Agave",
    desc: "Yeraltı taş fırınlarında pişirilmiş yoğun is ve duman kokusu.",
    price: 70,
    icon: "solar:fire-bold",
    profile: "Akşam servisinde",
    outOfStock: true,
    liquidColors: ["#3f3f46", "#78716c", "#d6d3d1"],
    tint: 0.35,
  },
  {
    id: "havana",
    name: "HAVANA CLUB 7",
    subTag: "Añejo Rom",
    subTagStyle: "text-amber-500 bg-amber-500/10",
    note: "Vanilya, Tütün & Kakao",
    desc: "Meşe fıçılarda dinlenmiş Küba romu, karamel ve tatlı baharatlar.",
    price: 35,
    icon: "solar:cup-bold",
    iconHoverClass: "group-hover:text-amber-500",
    profile: "Tatlı & Baharatlı",
    liquidColors: ["#1c0a03", "#5a2408", "#a16207"],
    tint: 1.0,
  },
  {
    id: "greygoose",
    name: "GREY GOOSE",
    subTag: "Ultra Premium",
    subTagStyle: "text-cyan-400 bg-cyan-500/10",
    note: "Fransız Buğdayı & Saf Su",
    desc: "Pürüzsüz dokusuyla tüm şurup ve cordial aromalarını öne çıkarır.",
    price: 45,
    icon: "solar:waterdrop-bold",
    iconHoverClass: "group-hover:text-cyan-400",
    profile: "Temiz & Nötr Baz",
    liquidColors: ["#1e293b", "#64748b", "#e0f2fe"],
    tint: 0.2,
  },
];

type Mixer = {
  id: string;
  name: string;
  subTag: string;
  subTagStyle?: string;
  note: string;
  desc: string;
  price: number;
  icon: string;
  iconHoverClass?: string;
  profile: string;
  outOfStock?: boolean;
  liquidColors: [string, string, string];
  tint: number;
};

const MIXERS: Mixer[] = [
  {
    id: "fever-tonic",
    name: "FEVER-TREE TONIC",
    subTag: "İngiliz Kininli",
    subTagStyle: "text-cyan-400 bg-cyan-500/10",
    note: "Kinin & Narenciye Kabuğu",
    desc: "Kongo kinin ile hazırlanmış kuru ve ferah premium tonik.",
    price: 20,
    icon: "solar:bottle-2-bold",
    iconHoverClass: "group-hover:text-cyan-400",
    profile: "Kuru & Ferah",
    liquidColors: ["#334155", "#94a3b8", "#f1f5f9"],
    tint: 0.18,
  },
  {
    id: "ginger-beer",
    name: "GINGER BEER",
    subTag: "Baharatlı",
    subTagStyle: "text-amber-500 bg-amber-500/10",
    note: "Taze Zencefil & Kamış Şekeri",
    desc: "Yakıcı zencefil vuruşu ile kokteyle enerji katan altın rengi mikser.",
    price: 25,
    icon: "solar:fire-square-bold",
    iconHoverClass: "group-hover:text-amber-500",
    profile: "Keskin & Baharatlı",
    liquidColors: ["#7c2d12", "#b45309", "#fbbf24"],
    tint: 0.75,
  },
  {
    id: "club-soda",
    name: "CLUB SODA",
    subTag: "Sade",
    subTagStyle: "text-muted-foreground bg-secondary",
    note: "Karbonatlı Kaynak Suyu",
    desc: "Nötr ve keskin köpüklü, tüm bazları temiz şekilde uzatır.",
    price: 15,
    icon: "solar:waterdrop-bold",
    profile: "Nötr & Temiz",
    liquidColors: ["#475569", "#cbd5e1", "#f8fafc"],
    tint: 0.15,
  },
  {
    id: "grapefruit-soda",
    name: "GRAPEFRUIT SODA",
    subTag: "Narenciye",
    subTagStyle: "text-rose-400 bg-rose-500/10",
    note: "Pembe Grapefruit & Deniz Tuzu",
    desc: "Buruk pembe grapefruit dokusu, tuzlu bir vurgu ile dengelenir.",
    price: 25,
    icon: "solar:citrus-bold",
    iconHoverClass: "group-hover:text-rose-400",
    profile: "Buruk & Meyveli",
    liquidColors: ["#7f1d1d", "#e11d48", "#fecdd3"],
    tint: 0.6,
  },
  {
    id: "lemon-tonic",
    name: "LEMON TONIC",
    subTag: "Turunçgil",
    subTagStyle: "text-yellow-400 bg-yellow-500/10",
    note: "Sicilya Limonu & Kinin",
    desc: "Sicilya limonu kabuğuyla parlatılmış keskin kinin dokusu.",
    price: 22,
    icon: "solar:sun-2-bold",
    iconHoverClass: "group-hover:text-yellow-400",
    profile: "Kabuk & Kinin",
    liquidColors: ["#713f12", "#ca8a04", "#fef08a"],
    tint: 0.4,
  },
  {
    id: "cola",
    name: "COLA CLASSIC",
    subTag: "Klasik",
    subTagStyle: "text-orange-400 bg-orange-500/10",
    note: "Kola Cevizi & Karamel",
    desc: "Karamelize kamış şekeri ve baharat dokusuyla klasik kola profili.",
    price: 18,
    icon: "solar:cup-bold",
    iconHoverClass: "group-hover:text-orange-400",
    profile: "Tatlı & Baharatlı",
    liquidColors: ["#0c0a09", "#3f1d0a", "#78350f"],
    tint: 1.0,
  },
];

const MIXER_PORTIONS = ["100ml", "150ml", "200ml"];

const STEPS = [
  { n: 1, label: "Bardak" },
  { n: 2, label: "Baz Alkol" },
  { n: 3, label: "Mikser" },
  { n: 4, label: "Şurup & Cordial" },
  { n: 5, label: "Buz & Kadeh" },
  { n: 6, label: "Garnitür" },
];

const STEP_META: Record<number, { title: string; sub: string; badge: string | null }> = {
  1: { title: "Kadehini Seç", sub: "Kokteylinin servis edileceği kadehi belirle.", badge: null },
  2: { title: "Ana Baz Alkolünü Seç", sub: "Kokteylinin temel karakterini belirleyecek ana içkiyi ve porsiyonu seç.", badge: "Maks. 2 Baz Seçilebilir" },
  3: { title: "Mikserini Seç", sub: "Kokteylini tamamlayacak karıştırıcıyı belirle.", badge: null },
  4: { title: "Şurup & Cordial", sub: "Tatlılık ve renk katacak şurubu seç.", badge: null },
  5: { title: "Buz & Kadeh Tipi", sub: "Servis sıcaklığını ve buz türünü belirle.", badge: null },
  6: { title: "Garnitür", sub: "Son dokunuşu ve aromatiği ekle.", badge: null },
};

const PORTIONS = ["30ml", "50ml", "60ml"];
const BASE_PRICE = 250;

// ── Glass SVG ─────────────────────────────────────────────────────────────────

type GlassGeom = {
  // Bardağın kapalı silüeti (bowl + varsa stem + varsa base tek path).
  silhouette: string;
  // Bowl interior — liquid'in clip'lendiği kapalı alan.
  interior: string;
  interiorTop: number;
  interiorFloor: number;
  capacityMl: number;
};

const GLASS_GEOM: Record<GlassId, GlassGeom> = {
  coupe: {
    silhouette:
      "M 15,50 L 185,50 C 192,82 178,138 108,144 L 108,314 L 158,326 L 158,330 L 42,330 L 42,326 L 92,314 L 92,144 C 22,138 8,82 15,50 Z",
    interior:
      "M 22,56 L 178,56 C 184,82 172,132 108,138 L 92,138 C 28,132 16,82 22,56 Z",
    interiorTop: 56,
    interiorFloor: 138,
    capacityMl: 180,
  },
  "old-fashioned": {
    silhouette:
      "M 30,140 L 170,140 C 175,140 175,145 175,145 L 172,320 C 172,325 168,325 168,325 L 32,325 C 28,325 28,320 28,320 L 25,145 C 25,140 30,140 30,140 Z",
    interior: "M 34,148 L 166,148 L 164,314 L 36,314 Z",
    interiorTop: 148,
    interiorFloor: 314,
    capacityMl: 240,
  },
  highball: {
    silhouette:
      "M 62,30 L 138,30 C 143,30 143,35 143,35 L 141,320 C 141,325 137,325 137,325 L 63,325 C 59,325 59,320 59,320 L 57,35 C 57,30 62,30 62,30 Z",
    interior: "M 62,38 L 138,38 L 137,318 L 63,318 Z",
    interiorTop: 38,
    interiorFloor: 318,
    capacityMl: 300,
  },
  "nick-nora": {
    silhouette:
      "M 10,28 L 190,28 L 106,175 L 106,314 L 158,326 L 158,330 L 42,330 L 42,326 L 94,314 L 94,175 Z",
    interior: "M 18,34 L 182,34 L 106,168 L 94,168 Z",
    interiorTop: 34,
    interiorFloor: 168,
    capacityMl: 150,
  },
  margarita: {
    silhouette:
      "M 8,42 L 192,42 L 152,132 C 158,175 128,205 108,210 L 108,314 L 62,318 C 58,322 58,326 62,330 L 138,330 C 142,326 142,322 138,318 L 92,314 L 92,210 C 72,205 42,175 48,132 L 8,42 Z",
    interior:
      "M 22,52 L 178,52 L 148,132 C 152,170 128,200 100,204 C 72,200 48,170 52,132 L 22,52 Z",
    interiorTop: 118,
    interiorFloor: 204,
    capacityMl: 260,
  },
};

type GlassSVGProps = {
  glassId: GlassId;
  hasSpirit?: boolean;
  hasMixer?: boolean;
  spiritColors?: [string, string, string];
  mixerColors?: [string, string, string];
  spiritTint?: number;
  mixerTint?: number;
  portionMl?: number;
  mixerPortionMl?: number;
};

const DEFAULT_SPIRIT_COLORS: [string, string, string] = ["#78350f", "#b45309", "#f59e0b"];
const DEFAULT_MIXER_COLORS: [string, string, string] = ["#475569", "#cbd5e1", "#f8fafc"];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

type LiquidComponent = {
  colors: [string, string, string];
  tint: number;
  volumeMl: number;
};

// Beer-Lambert-lite subtractive mixing: each liquid absorbs light proportional to
// (255 - channelValue) × tint. Total absorbance is volume-weighted, then inverted
// back to displayable color. Clear liquids (low tint) barely absorb — they dilute
// pigmented liquids toward transparency, they don't drag colors toward gray.
function blendLiquids(components: LiquidComponent[]): [string, string, string] {
  const totalVolume = components.reduce((s, c) => s + c.volumeMl, 0);
  if (totalVolume === 0) return components[0]?.colors ?? DEFAULT_SPIRIT_COLORS;

  const out: [string, string, string] = ["#000000", "#000000", "#000000"];
  for (let stop = 0; stop < 3; stop++) {
    let absR = 0;
    let absG = 0;
    let absB = 0;
    for (const c of components) {
      const [r, g, b] = hexToRgb(c.colors[stop]);
      const w = c.tint * c.volumeMl;
      absR += (255 - r) * w;
      absG += (255 - g) * w;
      absB += (255 - b) * w;
    }
    absR /= totalVolume;
    absG /= totalVolume;
    absB /= totalVolume;
    out[stop] = rgbToHex(255 - absR, 255 - absG, 255 - absB);
  }
  return out;
}

function GlassSVG({
  glassId,
  hasSpirit = false,
  hasMixer = false,
  spiritColors = DEFAULT_SPIRIT_COLORS,
  mixerColors = DEFAULT_MIXER_COLORS,
  spiritTint = 1,
  mixerTint = 0.2,
  portionMl = 50,
  mixerPortionMl = 150,
}: GlassSVGProps) {
  const g = GLASS_GEOM[glassId];
  const rawId = useId();
  const uid = `${glassId}-${rawId.replace(/:/g, "")}`;
  const fillTransition =
    "y 850ms cubic-bezier(0.3, 0.9, 0.4, 1), height 850ms cubic-bezier(0.3, 0.9, 0.4, 1)";
  const colorTransition = "stop-color 600ms ease-in-out";

  const interiorH = g.interiorFloor - g.interiorTop;
  const spiritMl = hasSpirit ? portionMl : 0;
  const mixerMl = hasMixer ? mixerPortionMl : 0;
  const combinedMl = spiritMl + mixerMl;
  const combinedFraction = Math.min(1, Math.max(0, combinedMl / g.capacityMl));
  const combinedH = interiorH * combinedFraction;
  const combinedTopY = g.interiorFloor - combinedH;

  const components: LiquidComponent[] = [];
  if (spiritMl > 0) components.push({ colors: spiritColors, tint: spiritTint, volumeMl: spiritMl });
  if (mixerMl > 0) components.push({ colors: mixerColors, tint: mixerTint, volumeMl: mixerMl });
  const blendedColors: [string, string, string] =
    components.length === 0
      ? spiritColors
      : components.length === 1
      ? components[0].colors
      : blendLiquids(components);

  return (
    <svg
      viewBox="0 0 200 340"
      preserveAspectRatio="xMidYMax meet"
      className="h-full w-full transition-all duration-500"
      role="img"
      aria-label={`${glassId} kadeh simülasyonu`}
    >
      <defs>
        <linearGradient id={`liquid-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" style={{ stopColor: blendedColors[0], transition: colorTransition }} />
          <stop offset="50%" style={{ stopColor: blendedColors[1], transition: colorTransition }} />
          <stop offset="100%" style={{ stopColor: blendedColors[2], transition: colorTransition }} />
        </linearGradient>
        <clipPath id={`interior-${uid}`}>
          <path d={g.interior} />
        </clipPath>
      </defs>

      {/* Glass silhouette body — hafif cam tonu */}
      <path d={g.silhouette} fill="rgba(255,255,255,0.08)" />

      {/* Liquid clipped to interior bowl */}
      <g clipPath={`url(#interior-${uid})`}>
        <rect
          x="0"
          width="200"
          y={combinedMl > 0 ? combinedTopY : g.interiorFloor}
          height={combinedMl > 0 ? combinedH : 0}
          fill={`url(#liquid-${uid})`}
          style={{ transition: fillTransition }}
        />
      </g>

      {/* Silhouette outline stroke — cam çeperi */}
      <path
        d={g.silhouette}
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CocktailStudioPage() {
  const [step, setStep] = useState(1);
  const [glassId, setGlassId] = useState<GlassId>("nick-nora");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [portion, setPortion] = useState("50ml");
  const [mixerId, setMixerId] = useState<string | null>(null);
  const [mixerPortion, setMixerPortion] = useState("150ml");

  const selectedGlass = GLASSES.find((g) => g.id === glassId)!;
  const selectedSpirit = SPIRITS.find((s) => s.id === selectedId) ?? null;
  const selectedMixer = MIXERS.find((m) => m.id === mixerId) ?? null;
  const total = BASE_PRICE + (selectedSpirit ? selectedSpirit.price : 0) + (selectedMixer ? selectedMixer.price : 0);
  const meta = STEP_META[step] ?? STEP_META[1];
  const nextStepLabel = STEPS[step]?.label ?? "Tamamla";
  const portionMl = parseInt(portion, 10) || 50;
  const mixerPortionMl = parseInt(mixerPortion, 10) || 150;
  const capacityMl = GLASS_GEOM[glassId].capacityMl;
  const spiritContribution = selectedSpirit ? portionMl / capacityMl : 0;
  const mixerContribution = selectedMixer ? mixerPortionMl / capacityMl : 0;
  const fillPercent = Math.round(Math.min(1, spiritContribution + mixerContribution) * 100);

  function toggleSpirit(spirit: Spirit) {
    if (spirit.outOfStock) return;
    setSelectedId((prev) => (prev === spirit.id ? null : spirit.id));
  }

  function toggleMixer(mixer: Mixer) {
    if (mixer.outOfStock) return;
    setMixerId((prev) => (prev === mixer.id ? null : mixer.id));
  }

  function reset() {
    setGlassId("nick-nora");
    setSelectedId(null);
    setPortion("50ml");
    setMixerId(null);
    setMixerPortion("150ml");
    setStep(1);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-font-sans selection:bg-primary selection:text-white pb-36 lg:pb-32">

      <Navbar activePage="cocktailLab" />

      {/* ── Mobile glass strip ────────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-20 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-md py-2 px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative size-11 shrink-0 flex items-center justify-center">
              <span
                className={`absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-font-mono font-bold leading-none transition-colors ${
                  selectedSpirit || selectedMixer ? "text-primary" : "text-muted-foreground"
                }`}
              >
                %{fillPercent}
              </span>
              <GlassSVG
                glassId={glassId}
                hasSpirit={!!selectedSpirit}
                hasMixer={!!selectedMixer}
                spiritColors={selectedSpirit?.liquidColors}
                mixerColors={selectedMixer?.liquidColors}
                spiritTint={selectedSpirit?.tint}
                mixerTint={selectedMixer?.tint}
                portionMl={portionMl}
                mixerPortionMl={mixerPortionMl}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-foreground font-font-mono">{selectedGlass.name}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-font-mono text-muted-foreground mt-0.5">
                <span className="text-amber-400 truncate max-w-[110px]">
                  {selectedSpirit ? `${selectedSpirit.name.split(" ").slice(0, 2).join(" ")} (${portion})` : "Baz seçilmedi"}
                </span>
                {selectedMixer && (
                  <>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="text-cyan-400 truncate max-w-[110px]">
                      {`${selectedMixer.name.split(" ").slice(0, 2).join(" ")} (${mixerPortion})`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={reset}
            className="px-2 py-1 rounded-lg bg-secondary hover:bg-muted text-muted-foreground text-[10px] font-font-mono border border-border flex items-center gap-1 transition-colors"
          >
            <iconify-icon icon="solar:restart-bold" width="11" height="11" />
            Sıfırla
          </button>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-gradient-to-b from-card to-background rounded-3xl border border-primary/30 px-6 pt-2 pb-6 overflow-hidden shadow-2xl shadow-primary/10 flex flex-col items-center">
              <div className="relative w-full h-64 flex items-end justify-center">
                {/* Fill % chip */}
                <div className="absolute top-1 right-1 z-20">
                  <span
                    className={`text-[11px] font-font-mono font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                      selectedSpirit || selectedMixer
                        ? "text-primary bg-primary/10 border-primary/20"
                        : "text-muted-foreground bg-secondary border-border"
                    }`}
                  >
                    %{fillPercent}
                  </span>
                </div>

                {/* Glass SVG */}
                <GlassSVG
                  glassId={glassId}
                  hasSpirit={!!selectedSpirit}
                  hasMixer={!!selectedMixer}
                  spiritColors={selectedSpirit?.liquidColors}
                  mixerColors={selectedMixer?.liquidColors}
                  spiritTint={selectedSpirit?.tint}
                  mixerTint={selectedMixer?.tint}
                  portionMl={portionMl}
                  mixerPortionMl={mixerPortionMl}
                />
              </div>

              {/* Breakdown */}
              <div className="w-full mt-3 pt-3 border-t border-border/80 space-y-2 text-xs font-font-mono">
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-white/30" />
                    Kadeh
                  </span>
                  <span className="text-foreground font-bold">{selectedGlass.name} · {selectedGlass.sub}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-600" />
                    Baz Alkol
                  </span>
                  <span className="text-foreground font-bold">
                    {selectedSpirit ? `${selectedSpirit.name.split(" ").slice(0, 2).join(" ")} (${portion})` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-600" />
                    Şurup
                  </span>
                  <span className="text-foreground font-bold">—</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-cyan-400" />
                    Mikser
                  </span>
                  <span className="text-foreground font-bold">
                    {selectedMixer ? `${selectedMixer.name.split(" ").slice(0, 2).join(" ")} (${mixerPortion})` : "—"}
                  </span>
                </div>
              </div>

              <button
                onClick={reset}
                className="w-full mt-4 py-2 rounded-xl bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-font-mono border border-border flex items-center justify-center gap-1.5 transition-colors"
              >
                <iconify-icon icon="solar:restart-bold" width="14" height="14" />
                Kadehi Baştan Başlat
              </button>
            </div>
          </aside>

          {/* ── Step content ──────────────────────────────────────────────── */}
          <section className="lg:col-span-8 space-y-4">
            {/* Step header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 text-[10px] font-font-mono font-bold uppercase">
                    Adım {step} / {STEPS.length}
                  </span>
                  <h1 className="font-font-heading text-lg sm:text-2xl font-bold uppercase tracking-wider text-foreground">
                    {meta.title}
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{meta.sub}</p>
              </div>
              {meta.badge && (
                <span className="text-[11px] font-font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg font-bold self-start sm:self-auto">
                  {meta.badge}
                </span>
              )}
            </div>

            {/* ── Step 1: Glass selection ───────────────────────────────── */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                {GLASSES.map((glass) => {
                  const active = glassId === glass.id;
                  return (
                    <div
                      key={glass.id}
                      onClick={() => setGlassId(glass.id)}
                      className={[
                        "bg-card rounded-2xl border-2 p-5 cursor-pointer transition-all flex flex-col items-center text-center gap-3",
                        active
                          ? "border-primary shadow-md shadow-primary/5"
                          : "border-border hover:border-border/80 group",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "size-16 rounded-2xl border flex items-center justify-center transition-colors",
                          active
                            ? "bg-primary/20 border-primary/40"
                            : "bg-secondary border-border",
                        ].join(" ")}
                      >
                        <img
                          src={glass.imgSrc}
                          alt={glass.name}
                          width={36}
                          height={36}
                          className={["invert transition-opacity", active ? "opacity-100" : "opacity-50 group-hover:opacity-80"].join(" ")}
                        />
                      </div>
                      <div>
                        <h3 className="font-font-heading font-bold text-sm sm:text-base text-foreground leading-tight">
                          {glass.name}
                        </h3>
                        <p className="text-[10px] font-font-mono text-muted-foreground mt-0.5">{glass.sub}</p>
                      </div>
                      <div className="mt-auto pt-2 border-t border-border/60 w-full">
                        {active ? (
                          <span className="flex items-center justify-center gap-1.5 text-[11px] font-font-mono font-bold text-primary">
                            <iconify-icon icon="solar:check-circle-bold" width="14" height="14" />
                            Seçildi
                          </span>
                        ) : (
                          <span className="text-[11px] font-font-mono text-muted-foreground">{glass.style}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Step 2: Base spirit selection ─────────────────────────── */}
            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {SPIRITS.map((spirit) => {
                  const isSelected = selectedId === spirit.id;
                  return (
                    <div
                      key={spirit.id}
                      onClick={() => toggleSpirit(spirit)}
                      className={[
                        "bg-card rounded-2xl border-2 p-4 relative transition-all flex flex-col justify-between",
                        spirit.outOfStock ? "opacity-60 cursor-default" : "cursor-pointer",
                        isSelected
                          ? "border-primary shadow-md shadow-primary/5"
                          : "border-border hover:border-border/80 group",
                      ].join(" ")}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={[
                                "size-11 rounded-xl border flex items-center justify-center text-xl shrink-0 transition-colors",
                                isSelected
                                  ? "bg-primary/20 text-primary border-primary/40"
                                  : `bg-secondary text-muted-foreground border-border ${spirit.iconHoverClass ?? ""}`,
                              ].join(" ")}
                            >
                              <iconify-icon icon={spirit.icon} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-font-heading font-bold text-sm sm:text-base text-foreground">
                                  {spirit.name}
                                </h3>
                                <span
                                  className={[
                                    "px-1.5 py-0.5 rounded text-[9px] font-font-mono font-bold",
                                    isSelected
                                      ? "bg-primary text-primary-foreground uppercase"
                                      : spirit.subTagStyle ?? "text-muted-foreground bg-secondary",
                                  ].join(" ")}
                                >
                                  {isSelected ? "Seçildi" : spirit.subTag}
                                </span>
                              </div>
                              <span className="text-[10px] font-font-mono text-muted-foreground">
                                {spirit.note}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`font-font-mono font-bold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                              +{spirit.price} ₺
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">{spirit.desc}</p>
                      </div>

                      {isSelected ? (
                        <div className="mt-3.5 pt-3 border-t border-border/80 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-foreground">Porsiyon:</span>
                          <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border text-[11px] font-font-mono">
                            {PORTIONS.map((p) => (
                              <button
                                key={p}
                                onClick={(e) => { e.stopPropagation(); setPortion(p); }}
                                className={[
                                  "px-2 py-0.5 rounded-lg transition-colors",
                                  portion === p
                                    ? "font-bold bg-primary text-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground",
                                ].join(" ")}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3.5 pt-3 border-t border-border/80 flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">{spirit.profile}</span>
                          {spirit.outOfStock ? (
                            <button disabled className="px-3.5 py-1 rounded-xl bg-muted text-muted-foreground text-xs font-bold cursor-not-allowed">
                              Tükendi
                            </button>
                          ) : (
                            <button className="px-3.5 py-1 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-bold transition-all border border-border">
                              Kadehe Ekle
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Step 3: Mixer selection ───────────────────────────────── */}
            {step === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {MIXERS.map((mixer) => {
                  const isSelected = mixerId === mixer.id;
                  return (
                    <div
                      key={mixer.id}
                      onClick={() => toggleMixer(mixer)}
                      className={[
                        "bg-card rounded-2xl border-2 p-4 relative transition-all flex flex-col justify-between",
                        mixer.outOfStock ? "opacity-60 cursor-default" : "cursor-pointer",
                        isSelected
                          ? "border-primary shadow-md shadow-primary/5"
                          : "border-border hover:border-border/80 group",
                      ].join(" ")}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={[
                                "size-11 rounded-xl border flex items-center justify-center text-xl shrink-0 transition-colors",
                                isSelected
                                  ? "bg-primary/20 text-primary border-primary/40"
                                  : `bg-secondary text-muted-foreground border-border ${mixer.iconHoverClass ?? ""}`,
                              ].join(" ")}
                            >
                              <iconify-icon icon={mixer.icon} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-font-heading font-bold text-sm sm:text-base text-foreground">
                                  {mixer.name}
                                </h3>
                                <span
                                  className={[
                                    "px-1.5 py-0.5 rounded text-[9px] font-font-mono font-bold",
                                    isSelected
                                      ? "bg-primary text-primary-foreground uppercase"
                                      : mixer.subTagStyle ?? "text-muted-foreground bg-secondary",
                                  ].join(" ")}
                                >
                                  {isSelected ? "Seçildi" : mixer.subTag}
                                </span>
                              </div>
                              <span className="text-[10px] font-font-mono text-muted-foreground">
                                {mixer.note}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`font-font-mono font-bold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                              +{mixer.price} ₺
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">{mixer.desc}</p>
                      </div>

                      {isSelected ? (
                        <div className="mt-3.5 pt-3 border-t border-border/80 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-foreground">Porsiyon:</span>
                          <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border text-[11px] font-font-mono">
                            {MIXER_PORTIONS.map((p) => (
                              <button
                                key={p}
                                onClick={(e) => { e.stopPropagation(); setMixerPortion(p); }}
                                className={[
                                  "px-2 py-0.5 rounded-lg transition-colors",
                                  mixerPortion === p
                                    ? "font-bold bg-primary text-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground",
                                ].join(" ")}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3.5 pt-3 border-t border-border/80 flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">{mixer.profile}</span>
                          {mixer.outOfStock ? (
                            <button disabled className="px-3.5 py-1 rounded-xl bg-muted text-muted-foreground text-xs font-bold cursor-not-allowed">
                              Tükendi
                            </button>
                          ) : (
                            <button className="px-3.5 py-1 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-bold transition-all border border-border">
                              Kadehe Ekle
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Steps 4-6: placeholder ────────────────────────────────── */}
            {step > 3 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="size-16 rounded-2xl bg-secondary border border-border flex items-center justify-center text-3xl text-muted-foreground">
                  <iconify-icon icon="solar:hourglass-bold" />
                </div>
                <p className="text-sm font-font-mono text-muted-foreground">Bu adım yakında eklenecek.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── Fixed bottom bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl flex flex-col">
        {/* Step nav */}
        <div className="border-b border-border/70 py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-[11px] sm:text-xs">
            {STEPS.map((s) => {
              const isActive = step === s.n;
              return (
                <button
                  key={s.n}
                  onClick={() => setStep(s.n)}
                  className={[
                    "px-3 sm:px-4 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-secondary text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <span className={["size-4 sm:size-5 rounded-full flex items-center justify-center font-font-mono text-[9px] sm:text-[10px]", isActive ? "bg-black/30" : "bg-muted"].join(" ")}>
                    {s.n}
                  </span>
                  <span>{s.label}</span>
                  {isActive && <span className="size-1 rounded-full bg-white animate-pulse" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Total + next */}
        <div className="py-2.5 sm:py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="size-9 sm:size-10 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
                <iconify-icon icon="solar:cup-paper-bold" width="18" height="18" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-font-mono uppercase text-muted-foreground leading-none">
                  Toplam Kokteyl Tutarı
                </p>
                <p className="font-font-heading text-lg sm:text-xl font-bold text-primary font-font-mono mt-0.5 leading-none">
                  {total} ₺
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={reset}
                className="hidden sm:inline-flex px-4 py-2.5 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-muted border border-border transition-colors"
              >
                Kadehi Sıfırla
              </button>
              <button
                onClick={() => setStep((prev) => Math.min(prev + 1, STEPS.length))}
                className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold font-font-heading uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
              >
                <span>Sonraki Adım: {nextStepLabel}</span>
                <iconify-icon icon="solar:arrow-right-linear" width="16" height="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
