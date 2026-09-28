import { Icon } from "@iconify/react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
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
                <p className="text-[11px] text-muted-foreground font-mono">Executive Intelligence &amp; Revenue Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-semibold border border-border hover:bg-muted transition-colors">
                <Icon icon="solar:printer-minimalistic-bold" width={14} height={14} />
                Rapor Al (PDF/XLS)
              </button>
              <div className="flex items-center gap-2.5 pl-3 border-l border-border">
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
      <div className="bg-card border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 overflow-x-auto py-2.5 text-xs">
            <Link href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
              <Icon icon="solar:chart-square-bold" width={16} height={16} />
              Genel Bakış &amp; Ciro Analitiği
            </Link>
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:menu-dots-square-bold" width={16} height={16} />
              Menü Düzenleme
            </Link>
            <Link href="/cocktail-lab" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-hot-bold" width={16} height={16} />
              Kokteyl Lab Malzemeleri
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">

        {/* Title + period filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">
              GENEL İSTATİSTİK &amp; PERFORMANS
            </h1>
            <p className="text-xs text-muted-foreground">Bilkent York finansal ciro, kokteyl lab etkileşimi ve mekan gelir dökümleri</p>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-xl">
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Bugün</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Bu Hafta</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-sm">Bu Ay (Mayıs)</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Yıllık 2025</button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3 relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-muted-foreground font-mono">Toplam Aylık Ciro</span>
              <div className="size-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                <Icon icon="solar:wallet-money-bold" width={20} height={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-foreground font-mono">1.482.350 ₺</div>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Günlük Ortalama: <strong className="text-foreground font-mono">59.200 ₺</strong></span>
              <span className="text-emerald-400 font-bold">%78 Kar Marjı</span>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 space-y-3 relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-muted-foreground font-mono">Kokteyl Lab Satışları</span>
              <div className="size-9 rounded-xl bg-secondary text-primary border border-border flex items-center justify-center">
                <Icon icon="solar:magic-stick-3-bold" width={20} height={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-foreground font-mono">2,140 <span className="text-sm font-sans font-normal text-muted-foreground">Kadeh</span></div>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Kadeh Başı Ort.: <strong className="text-foreground font-mono">420 ₺</strong></span>
              <span className="text-primary font-bold">%60.6 Bar Payı</span>
            </div>
          </div>


          <div className="bg-card rounded-2xl border border-border p-5 space-y-3 relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-muted-foreground font-mono">Uygulama / Web Trafiği</span>
              <div className="size-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                <Icon icon="solar:cup-star-bold" width={20} height={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-primary font-mono">18,940 <span className="text-sm font-sans font-normal text-muted-foreground">Ziyaret</span></div>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Reçete Oluşturma: <strong className="text-foreground font-mono">%23.4</strong></span>
              <span className="text-primary font-mono font-bold">48 Yarışmacı</span>
            </div>
          </div>
        </div>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">

            {/* Revenue chart */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">GÜNLÜK KOKTEYL LAB SATIŞ TRENDİ</h2>
                  <p className="text-xs text-muted-foreground">Mayıs ayı boyunca gün gün Kokteyl Lab satış trendi</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-primary"></span><span className="text-foreground">Kendi Kokteylini Yap</span></span>
                </div>
              </div>
              <div className="h-64 flex items-end gap-2 sm:gap-3 pt-6 pb-2 border-b border-border/80">
                {[
                  { label: "01", value: "42k", h: 50, primary: 60 },
                  { label: "03", value: "48k", h: 58, primary: 65 },
                  { label: "05", value: "74k", h: 82, primary: 70, highlight: true },
                  { label: "06", value: "92k", h: 96, primary: 72, highlight: true },
                  { label: "08", value: "38k", h: 44, primary: 60 },
                  { label: "10", value: "45k", h: 52, primary: 65 },
                  { label: "12", value: "81k", h: 88, primary: 70, highlight: true },
                  { label: "13", value: "98k", h: 100, primary: 75, highlight: true, peak: true },
                  { label: "15", value: "51k", h: 60, primary: 62 },
                  { label: "17", value: "56k", h: 65, primary: 68 },
                  { label: "19", value: "86k", h: 92, primary: 73, highlight: true },
                  { label: "Bugün", value: "84.6k", h: 90, primary: 71, today: true },
                ].map((bar) => (
                  <div key={bar.label} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5 group cursor-pointer">
                    <span className={`text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity ${bar.today ? "text-emerald-400 font-bold" : bar.highlight ? "text-primary font-bold" : "text-muted-foreground"}`}>{bar.value}</span>
                    <div className="w-full flex flex-col justify-end h-full" style={{ maxHeight: `${bar.h}%` }}>
                      <div className={`w-full h-full bg-primary rounded-sm ${bar.peak ? "shadow-lg shadow-primary/30" : ""}`}></div>
                    </div>
                    <span className={`text-[10px] font-mono ${bar.today ? "text-emerald-400 font-bold" : bar.highlight ? "text-primary font-bold" : "text-muted-foreground"}`}>{bar.label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">Haftasonu Pik Cirosu</span>
                  <span className="font-mono font-bold text-base text-foreground">98.400 ₺</span>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">Haftaiçi Ortalaması</span>
                  <span className="font-mono font-bold text-base text-foreground">46.800 ₺</span>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">En Yoğun Saat Dilimi</span>
                  <span className="font-mono font-bold text-base text-primary">21:30 - 00:45</span>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono">Adisyon Başı Ort. Sepet</span>
                  <span className="font-mono font-bold text-base text-emerald-400">880 ₺</span>
                </div>
              </div>
            </div>

            {/* Most-used bases */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">EN ÇOK TÜKETİLEN BAZLAR</h3>
                <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Bu Ay</span>
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { rank: 1, name: "Rye Whiskey 100 Proof", sub: "Kokteyl Lab Baz Seçimi", amount: "84 Şişe (42L)", highlight: true },
                  { rank: 2, name: "Japanese Botanical Gin", sub: "Kokteyl Lab Baz Seçimi", amount: "62 Şişe (31L)" },
                  { rank: 3, name: "Blanco Agave Tequila", sub: "Shot & Lab Bazı", amount: "58 Şişe (29L)" },
                  { rank: 4, name: "Yuzu & Hibiscus Cordial", sub: "Ev Yapımı Mikser", amount: "78 Litre" },
                ].map((b) => (
                  <div key={b.rank} className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                    <div className="flex items-center gap-2.5">
                      <span className={`size-6 rounded font-mono font-bold flex items-center justify-center text-[10px] ${b.highlight ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>{b.rank}</span>
                      <div>
                        <div className="font-bold text-foreground">{b.name}</div>
                        <div className="text-[10px] text-muted-foreground">{b.sub}</div>
                      </div>
                    </div>
                    <span className={`font-mono font-bold ${b.highlight ? "text-primary" : "text-foreground"}`}>{b.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-8">

            {/* Top cocktails */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
              <div className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">EN ÇOK SATAN KOKTEYLLER</h3>
                  <Icon icon="solar:cup-star-bold" className="text-primary" width={18} height={18} />
                </div>
                <p className="text-xs text-muted-foreground">Bu ay en yüksek ciro ve adet üreten 5 reçete</p>
              </div>
              <div className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-background border border-primary/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-foreground text-sm">1. THE RED ROOM</span>
                      <p className="text-[11px] text-primary font-semibold">Mayıs Lideri (Deniz Kılıç)</p>
                    </div>
                    <span className="font-mono font-bold text-primary text-sm">465 ₺</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[11px] font-mono">
                    <span className="text-foreground">624 Sipariş</span>
                    <span className="text-emerald-400 font-bold">290.160 ₺ Ciro</span>
                  </div>
                </div>
                {[
                  { rank: 2, name: "SMOKE & SOUR", sub: "Can Berk", price: "420 ₺", orders: "512 Sipariş", revenue: "215.040 ₺ Ciro" },
                  { rank: 3, name: "MIDNIGHT IN BILKENT", sub: "Badu Alp Ustagül (Admin)", price: "410 ₺", orders: "390 Sipariş", revenue: "159.900 ₺ Ciro", subColor: "text-primary font-semibold" },
                  { rank: 4, name: "ANKARA APERITIVO", sub: "Selin Arda", price: "390 ₺", orders: "348 Sipariş", revenue: "135.720 ₺ Ciro" },
                  { rank: 5, name: "CRIMSON DUSK", sub: "Geçen Ayın Şampiyonu (Kalıcı Menü)", price: "445 ₺", orders: "266 Sipariş", revenue: "118.370 ₺ Ciro" },
                ].map((c) => (
                  <div key={c.rank} className="p-3 rounded-xl bg-background border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-heading font-bold text-foreground text-sm">{c.rank}. {c.name}</span>
                        <p className={`text-[11px] ${c.subColor ?? "text-muted-foreground"}`}>{c.sub}</p>
                      </div>
                      <span className="font-mono font-bold text-foreground text-sm">{c.price}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[11px] font-mono">
                      <span className="text-foreground">{c.orders}</span>
                      <span className="text-muted-foreground">{c.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Bilkent York Operations Portal v2.4 • Yönetici: Badu Alp Ustagül (Head Executive)</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-primary transition-colors">Yedek Al</a>
            <a href="#" className="hover:text-primary transition-colors">Dışa Aktar (Excel)</a>
            <a href="#" className="hover:text-primary transition-colors">POS Entegrasyonu</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
