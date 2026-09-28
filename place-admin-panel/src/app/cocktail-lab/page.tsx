import { Icon } from "@iconify/react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type LabItem = {
  id: number;
  name: string;
  icon: string;
  description: string;
  unit: string;
  price: number;
  highlight?: string;
  active: boolean;
  outOfStock?: boolean;
};

type LabStep = {
  step: number;
  slug: string;
  anchorLabel: string;
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeClass: string;
  stepBoxClass: string;
  addLabel: string;
  items: LabItem[];
};

// ─── Static data ──────────────────────────────────────────────────────────────

const STEPS: LabStep[] = [
  {
    step: 1,
    slug: "step-1",
    anchorLabel: "1. Bazlar",
    title: "1. ADIM: BAZ ALKOLLER & RUHLAR (SPIRITS)",
    subtitle: "Müşterinin seçeceği ana baz içkiler: Whiskey, Gin, Vodka, Tequila, Mezcal, Rum",
    badgeLabel: "10 Aktif Şişe",
    badgeClass: "bg-primary/20 text-primary border-primary/30",
    stepBoxClass: "bg-primary text-primary-foreground shadow-sm",
    addLabel: "Yeni Baz İçki Ekle",
    items: [
      {
        id: 1,
        name: "BULLEIT 95 RYE WHISKEY",
        icon: "solar:bottle-bold",
        description: "Yoğun baharat, meşe, karamel ve temiz çavdar bitişi",
        unit: "50 ml",
        price: 45,
        highlight: "100 Proof • En Çok Tercih Edilen",
        active: true,
      },
      {
        id: 2,
        name: "ROKU JAPANESE BOTANICAL GIN",
        icon: "solar:bottle-bold",
        description: "Sakura çiçeği, yuzu kabuğu, sencha yeşil çay ve sansho biberi",
        unit: "50 ml",
        price: 40,
        active: true,
      },
      {
        id: 3,
        name: "ARTISANAL MEZCAL ESPADÍN",
        icon: "solar:bottle-bold",
        description: "Yoğun füme is kokusu, yeraltı taş fırın agave aroması",
        unit: "50 ml",
        price: 70,
        active: false,
        outOfStock: true,
      },
    ],
  },
  {
    step: 2,
    slug: "step-2",
    anchorLabel: "2. Mikserler",
    title: "2. ADIM: MİKSERLER, TONİKLER & TAZE SULAR",
    subtitle: "Taze sıkılmış narenciyeler, premium tonikler, ginger beer ve house miksler",
    badgeLabel: "12 Aktif Mikser",
    badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    stepBoxClass: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    addLabel: "Yeni Mikser Ekle",
    items: [
      {
        id: 4,
        name: "FEVER-TREE ELDERFLOWER TONIC",
        icon: "solar:cup-bold",
        description: "Doğal İngiliz mürver çiçeği, hafif kinin acılığı ve çiçeksi ferahlık",
        unit: "100 ml",
        price: 20,
        active: true,
      },
      {
        id: 5,
        name: "SPICY GINGER BEER (HOUSE BREWED)",
        icon: "solar:cup-bold",
        description: "Taze zencefil kökü, kireç suyu, acımsı ferahlatıcı karbonasyon",
        unit: "120 ml",
        price: 15,
        highlight: "Bilkent York Özel Yapım",
        active: true,
      },
      {
        id: 6,
        name: "TAZE SIKIŞ LİMON SUYU",
        icon: "solar:cup-bold",
        description: "Günlük taze sıkılan ekşi ve ferahlatıcı Sorrento limon suyu",
        unit: "30 ml",
        price: 10,
        active: true,
      },
    ],
  },
  {
    step: 3,
    slug: "step-3",
    anchorLabel: "3. Şuruplar",
    title: "3. ADIM: ŞURUPLAR, CORDIAL & BİTTERLER",
    subtitle: "Ev yapımı aromatik şuruplar, botanik cordial'lar ve damlalık bitterler",
    badgeLabel: "8 Aktif Şurup",
    badgeClass: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    stepBoxClass: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    addLabel: "Yeni Şurup / Bitter Ekle",
    items: [
      {
        id: 7,
        name: "HİBİSCUS & NAR REDÜKSİYONU",
        icon: "solar:dropper-bold",
        description: "Yoğun yakut kırmızısı renk, mayhoş tatlı-ekşi gövde",
        unit: "25 ml",
        price: 25,
        highlight: "The Red Room İmzası",
        active: true,
      },
      {
        id: 8,
        name: "YUZU & PASSION FRUIT CORDIAL",
        icon: "solar:dropper-bold",
        description: "Ekzotik narenciye, maracuja ve dengeli sitrik asitlik",
        unit: "30 ml",
        price: 25,
        active: true,
      },
      {
        id: 9,
        name: "ANGOSTURA AROMATIC BITTERS",
        icon: "solar:dropper-bold",
        description: "Klasik kokteyl bitterı, baharatımsı botanik derinlik ve denge",
        unit: "2 dash",
        price: 0,
        active: true,
      },
    ],
  },
  {
    step: 4,
    slug: "step-4",
    anchorLabel: "4. Buz",
    title: "4. ADIM: BUZ TİPİ",
    subtitle: "Berrak elmas kesim buzlar, kristal küreler, crushed ice seçenekleri",
    badgeLabel: "4 Aktif Tip",
    badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    stepBoxClass: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    addLabel: "Yeni Buz Tipi Ekle",
    items: [
      {
        id: 10,
        name: "ELMAS KESİM KRİSTAL BUZ BLOK",
        icon: "solar:snowflake-bold",
        description: "Yavaş eriyen, içeceği sulandırmayan kristal berrak küp blok",
        unit: "1 Blok",
        price: 0,
        highlight: "Bilkent York Clear Ice Projesi",
        active: true,
      },
      {
        id: 11,
        name: "KRİSTAL BUZ KÜRESİ (60mm)",
        icon: "solar:snowflake-bold",
        description: "El yontma küresel buz, viski ve premium spirit servisleri için",
        unit: "1 Küre",
        price: 15,
        active: true,
      },
      {
        id: 12,
        name: "CRUSHED ICE",
        icon: "solar:snowflake-bold",
        description: "İnce kırılmış buz, tiki ve tropical kokteyl sunumu için",
        unit: "Kase",
        price: 0,
        active: true,
      },
    ],
  },
  {
    step: 5,
    slug: "step-5",
    anchorLabel: "5. Garnitür",
    title: "5. ADIM: GARNİTÜR, KENARLIK (RIM) & ATEŞLİ SUNUM",
    subtitle: "Tütsülenmiş biberiye dalı, yenilebilir altın tozu, tajin acı tuz kenarlığı ve botanikler",
    badgeLabel: "6 Aktif Garnitür",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    stepBoxClass: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    addLabel: "Yeni Garnitür Ekle",
    items: [
      {
        id: 13,
        name: "TÜTSÜLENMİŞ BİBERİYE & 24K ALTIN TOZU",
        icon: "solar:stars-minimalistic-bold",
        description: "Meşe alevi ile masada tütsüleme, içecek üzerinde parıldayan altın ışıltısı",
        unit: "1 Sunum",
        price: 30,
        highlight: "Premium Ateşli Masada Sunum",
        active: true,
      },
      {
        id: 14,
        name: "TAJIN ACILI LİMON TUZU KENARLIĞI (RIM)",
        icon: "solar:stars-minimalistic-bold",
        description: "Kadehin ağzına çekilen acı-ekşi tuz katmanı ile her yudumda lezzet patlaması",
        unit: "1 Rim",
        price: 10,
        active: true,
      },
      {
        id: 15,
        name: "DEHYDRATED PORTAKAL & BİBERİYE",
        icon: "solar:stars-minimalistic-bold",
        description: "Fırında kurutulmuş portakal halkası ve taze biberiye dalı garnitürü",
        unit: "1 Adet",
        price: 8,
        active: true,
      },
    ],
  },
  {
    step: 6,
    slug: "step-6",
    anchorLabel: "6. Bardak",
    title: "6. ADIM: BARDAK STİLİ & SERVİS FORMATI",
    subtitle: "Rocks, Highball, Coupe, Nick & Nora, Martini — her bardak farklı bir deneyim sunar",
    badgeLabel: "5 Aktif Bardak",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    stepBoxClass: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    addLabel: "Yeni Bardak Stili Ekle",
    items: [
      {
        id: 16,
        name: "VINTAGE NICK & NORA KADEH",
        icon: "solar:wineglass-triangle-bold",
        description: "Dondurulmuş kristal kadehte buzsuz, yoğun içim up servis sunumu",
        unit: "1 Kadeh",
        price: 0,
        highlight: "Up Servis — Buzsuz",
        active: true,
      },
      {
        id: 17,
        name: "DOUBLE OLD FASHIONED ROCKS BARDAĞI",
        icon: "solar:wineglass-triangle-bold",
        description: "Kalın tabanlı kristal rocks, büyük buz blok ile on the rocks sunum",
        unit: "1 Bardak",
        price: 0,
        active: true,
      },
      {
        id: 18,
        name: "HIGHBALL UZUN İÇKİ BARDAĞI",
        icon: "solar:wineglass-triangle-bold",
        description: "Klasik uzun içki bardağı, highball ve long drink kokteylleri için",
        unit: "1 Bardak",
        price: 0,
        active: true,
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CocktailLabPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/20">
                <Icon icon="solar:shield-star-bold" width={20} height={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wider text-foreground">Bilkent York</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30">Admin Panel</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">Kokteyl Lab Stüdyosu &amp; Adım Adım Malzeme Mimarisi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-semibold border border-border hover:bg-muted transition-colors">
                <Icon icon="solar:eye-bold" width={15} height={15} className="text-primary" />
                Lab Önizleme
              </button>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold font-heading uppercase tracking-wider shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
                <Icon icon="solar:diskette-bold" width={16} height={16} />
                Lab&apos;i Güncelle &amp; Yayınla
              </button>
              <div className="flex items-center gap-2.5 pl-2 border-l border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://lh3.googleusercontent.com/a/ACg8ocJCxwMUJaUR_K6XCsiAdpE7nvLNJBzBaXmv3EjdUs_F69FMRS4=s96-c" alt="Badu Alp Ustagül" className="size-8 rounded-lg border border-primary/50 object-cover" />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold leading-none text-foreground">Badu Alp Ustagül</p>
                  <p className="text-[10px] text-primary font-mono">Head Executive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-card border-b border-border/80 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 overflow-x-auto py-2.5 text-xs">
            <Link href="/" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:chart-square-bold" width={16} height={16} />
              Genel Bakış &amp; Ciro Analitiği
            </Link>
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:menu-dots-square-bold" width={16} height={16} />
              Menü Düzenleme (Fiyat &amp; Stok)
            </Link>
            <Link href="/cocktail-lab" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
              <Icon icon="solar:cup-hot-bold" width={16} height={16} />
              Kokteyl Lab Malzemeleri (Adım Adım)
            </Link>
            <Link href="/leaderboard" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-star-bold" width={16} height={16} />
              Liderlik Tablosu &amp; Oylar
            </Link>
            <Link href="/settings" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:settings-bold" width={16} height={16} />
              Sistem Ayarları
            </Link>
          </nav>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 flex-1">

        {/* Page title + anchor nav */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/60">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground flex items-center gap-2.5">
              <span>KOKTEYL LAB MİMARİSİ &amp; AYARLARI</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-primary/20 text-primary border border-primary/30">Customizer Aktif</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Müşterilerin kendi kokteyllerini yapacağı 6 adımı bağımsız bölümler halinde yapılandırın: Baz Alkoller, Mikserler, Şuruplar, Buz Tipi, Garnitürler, Bardak Stili.
            </p>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <a href="#lab-rules" className="px-2.5 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-muted font-medium shrink-0 flex items-center gap-1 transition-colors">
              <Icon icon="solar:settings-linear" className="text-primary" width={14} height={14} />
              Lab Kuralları
            </a>
            {STEPS.map((s) => (
              <a key={s.slug} href={`#${s.slug}`} className="px-2.5 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-muted font-medium shrink-0 transition-colors">
                {s.anchorLabel}
              </a>
            ))}
          </div>
        </div>

        {/* Global settings */}
        <section id="lab-rules" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
                <Icon icon="solar:slider-vertical-bold" width={18} height={18} />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">
                  GENEL KOKTEYL LAB AYARLARI &amp; TABAN FİYATLANDIRMA
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Müşteri özel reçete oluştururken geçerli olacak limitler, taban kadeh ücreti ve yarışma kuralları
                </p>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5 shrink-0">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              Canlı POS Senkronize
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Base price */}
            <div className="bg-card rounded-2xl border border-primary/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground">Taban Kokteyl Ücreti</span>
                <Icon icon="solar:tag-price-bold" className="text-primary" width={16} height={16} />
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  defaultValue={380}
                  className="w-24 font-mono font-bold text-lg text-primary bg-background border border-border px-2 py-1 rounded-lg focus:border-primary focus:outline-none"
                />
                <span className="font-bold text-primary text-sm">₺</span>
              </div>
              <p className="text-[10px] text-muted-foreground">1 Standart Baz + 1 Mikser + Standart Buz &amp; Bardak dahildir.</p>
            </div>
            {/* Max base limit */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground">Maksimum Baz Alkol Limiti</span>
                <Icon icon="solar:bottle-bold" className="text-blue-400" width={16} height={16} />
              </div>
              <select className="w-full font-mono font-bold text-xs text-foreground bg-background border border-border px-2 py-1.5 rounded-lg focus:border-primary focus:outline-none">
                <option>Maksimum 2 Baz Seçimi (Max 60ml)</option>
                <option>Maksimum 1 Baz Seçimi (50ml Tek)</option>
                <option>Maksimum 3 Baz Seçimi (Özel Bar İzni)</option>
              </select>
              <p className="text-[10px] text-muted-foreground">Alkol dengesini ve reçete güvenliğini korur.</p>
            </div>
            {/* Competition auto-enroll */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground">Ayın Yarışmasına Kayıt</span>
                <Icon icon="solar:cup-star-bold" className="text-amber-400" width={16} height={16} />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-emerald-400 font-mono">Otomatik Katılım</span>
                <button className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">Açık</button>
              </div>
              <p className="text-[10px] text-muted-foreground">Her özel kadeh siparişine otomatik oylama linki üretilir.</p>
            </div>
            {/* Barmen approval */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground">Barmen Reçete Onayı</span>
                <Icon icon="solar:shield-check-bold" className="text-emerald-400" width={16} height={16} />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-foreground font-mono text-[11px]">Zorunlu İçilebilirlik Filtresi</span>
                <button className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">Aktif</button>
              </div>
              <p className="text-[10px] text-muted-foreground">Barmen onaylamadan kadeh yarışma listesinde oylamaya açılmaz.</p>
            </div>
          </div>
        </section>

        {/* Step sections */}
        {STEPS.map((step) => (
          <section key={step.slug} id={step.slug} className="space-y-3">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">

              {/* Section header */}
              <div className="p-4 bg-muted/40 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`size-9 rounded-xl flex items-center justify-center font-bold font-mono text-sm ${step.stepBoxClass}`}>
                    {step.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-base text-foreground uppercase">{step.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${step.badgeClass}`}>{step.badgeLabel}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{step.subtitle}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 shadow-sm shrink-0 hover:bg-primary/90 transition-colors">
                  <Icon icon="solar:add-circle-bold" width={14} height={14} />
                  {step.addLabel}
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-[11px] font-mono uppercase text-muted-foreground bg-background/50">
                      <th className="py-3 px-4 font-semibold w-8">#</th>
                      <th className="py-3 px-4 font-semibold">İsim &amp; İkon</th>
                      <th className="py-3 px-4 font-semibold">Açıklama</th>
                      <th className="py-3 px-4 font-semibold text-center">Ölçü</th>
                      <th className="py-3 px-4 font-semibold text-right">Fark (+₺)</th>
                      <th className="py-3 px-4 font-semibold text-center">Lab Durumu</th>
                      <th className="py-3 px-4 font-semibold text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {step.items.map((item, idx) => (
                      <tr key={item.id} className={`hover:bg-muted/20 transition-colors ${item.outOfStock ? "bg-red-950/10" : ""}`}>

                        {/* # */}
                        <td className={`py-3.5 px-4 font-mono font-bold ${item.outOfStock ? "text-destructive" : "text-muted-foreground"}`}>
                          {String(idx + 1).padStart(2, "0")}
                        </td>

                        {/* Icon + Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${item.active && !item.outOfStock ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                              <Icon icon={item.icon} width={16} height={16} />
                            </div>
                            <div>
                              <div className="font-bold text-foreground font-heading text-sm leading-tight">{item.name}</div>
                              {item.outOfStock ? (
                                <div className="text-[10px] font-mono font-bold text-destructive">Tükendi — Lab&apos;den Gizlendi</div>
                              ) : item.highlight ? (
                                <div className="text-[10px] font-mono font-bold text-primary">{item.highlight}</div>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-4 text-muted-foreground max-w-xs">
                          <span className="line-clamp-1 text-[11px]">{item.description}</span>
                        </td>

                        {/* Unit */}
                        <td className="py-3.5 px-4 text-center font-mono text-foreground font-semibold whitespace-nowrap">{item.unit}</td>

                        {/* Price */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            <span className="text-muted-foreground font-mono">+</span>
                            <input
                              type="number"
                              defaultValue={item.price}
                              className="w-16 text-right font-mono font-bold text-sm bg-background border border-border px-2 py-1 rounded-lg text-foreground focus:border-primary focus:outline-none"
                            />
                            <span className="font-bold text-primary">₺</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          {item.active && !item.outOfStock ? (
                            <button className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold whitespace-nowrap">
                              Stokta (Açık)
                            </button>
                          ) : (
                            <button className="px-2.5 py-1 rounded-full bg-destructive/20 text-destructive border border-destructive/40 text-[10px] font-bold whitespace-nowrap">
                              Kapalı / Stok Yok
                            </button>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border transition-colors">
                              <Icon icon="solar:pen-bold" width={14} height={14} />
                            </button>
                            <button className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 transition-colors">
                              <Icon icon="solar:trash-bin-trash-bold" width={14} height={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ))}

      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Bilkent York Operations Portal v2.4 • Yönetici: Badu Alp Ustagül (Head Executive)</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-primary transition-colors">Yedek Al</a>
            <a href="#" className="hover:text-primary transition-colors">Dışa Aktar (Reçeteler JSON)</a>
            <a href="#" className="hover:text-primary transition-colors">Bar POS Entegrasyonu</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
