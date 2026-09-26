"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";

export default function LeaderboardPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-white font-font-sans">
      <Navbar activePage="leaderboard" />

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-card/90 to-background border-b border-border/60 overflow-hidden py-10 sm:py-14">
        <div className="absolute inset-0 pointer-events-none opacity-15" style={{ backgroundImage: "radial-gradient(#C51F2B 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
        <div className="absolute top-0 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
                <iconify-icon icon="solar:cup-star-bold" className="text-primary animate-pulse" width="16" height="16"></iconify-icon>
                Mayıs 2025 Şampiyonası
              </div>
              <h1 className="font-font-heading text-4xl sm:text-6xl font-bold tracking-tight text-foreground uppercase leading-[0.95]">
                AYLIK <span className="text-primary">KOKTEYL LİGİ</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
                Bilkent York misafirlerinin kendi yarattığı kokteyller kapışıyor. Ay sonunda <strong className="text-foreground">1. olan reçete</strong>, Bilkent York&apos;un basılı resmi menüsüne girer ve barımızda servis edilir!
              </p>
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-card border border-primary/40 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0">
                    <iconify-icon icon="solar:crown-star-bold" width="22" height="22"></iconify-icon>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Büyük Ödül</p>
                    <p className="text-xs font-bold text-foreground leading-tight">Menüye Giriş &amp; İsim Hakkı</p>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-secondary text-primary border border-border flex items-center justify-center shrink-0">
                    <iconify-icon icon="solar:clock-circle-bold" width="22" height="22"></iconify-icon>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Kalan Süre</p>
                    <p className="text-xs font-bold text-foreground font-font-mono leading-tight">6 Gün 14 Saat</p>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-secondary text-primary border border-border flex items-center justify-center shrink-0">
                    <iconify-icon icon="solar:users-group-two-rounded-bold" width="22" height="22"></iconify-icon>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Toplam Katılım</p>
                    <p className="text-xs font-bold text-foreground font-font-mono leading-tight">12.490 Oy</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary/60 bg-card shadow-2xl shadow-primary/20 group">
                <img src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/9OmvoZba0MY.jpeg" alt="Winning Cocktail Hero" className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground font-font-heading uppercase text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-md">
                  <iconify-icon icon="solar:cup-star-bold" width="14" height="14"></iconify-icon>Şu Anki #1 Lider
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-font-mono font-bold text-primary tracking-widest">Reçete #01</span>
                      <h3 className="font-font-heading text-2xl sm:text-3xl font-bold uppercase text-foreground">THE RED ROOM</h3>
                      <p className="text-xs text-muted-foreground font-medium">Yaratıcı: <span className="text-foreground font-bold">Deniz Kılıç</span> • Rye Whiskey, Vişne Likörü, Füme Meşe</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-font-mono font-bold text-primary leading-none">2,840</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-font-mono">Oy Aldı</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 flex-1">
        {/* Top 3 Podium */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-primary pb-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <iconify-icon icon="solar:medal-ribbon-bold" width="20" height="20"></iconify-icon>
              </div>
              <div>
                <h2 className="font-font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">ZİRVEDEKİ KOKTEYLLER</h2>
                <p className="text-xs text-muted-foreground">Mayıs ayı boyunca en çok sipariş edilen ve oylanan ilk 3 kokteyl</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Filtrele:</span>
              <select className="bg-card border border-border text-foreground text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary">
                <option>Bu Ay (Mayıs 2025)</option>
                <option>Geçen Ay (Nisan 2025)</option>
                <option>Tüm Zamanlar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* #2 */}
            <div className="relative bg-card rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-border/90 transition-all shadow-md md:order-1 order-2">
              <div className="absolute -top-3.5 left-6 px-3 py-0.5 rounded-full bg-muted text-foreground border border-border text-xs font-font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <iconify-icon icon="solar:medal-star-bold" className="text-zinc-400" width="14" height="14"></iconify-icon>#2 İkinci Sıra
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Can Berk" className="size-11 rounded-full border-2 border-zinc-400 object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Can Berk</h4>
                      <p className="text-[11px] text-muted-foreground">Bilkent Mezun</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-font-mono text-xl font-bold text-foreground">2,410</span>
                    <span className="text-[10px] block uppercase text-muted-foreground font-font-mono">Oy</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-background/80 border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-font-heading text-lg font-bold text-foreground">SMOKE &amp; SOUR</span>
                    <span className="text-[11px] font-font-mono text-primary font-bold">420 ₺</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Bourbon Viski • Taze Limon Suyu • İsli Biberiye Şurubu • Angostura Bitter</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-font-mono font-medium">Viski Bazlı</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-font-mono font-medium">Rocks Bardak</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-font-mono font-medium">%18 ABV</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex items-center gap-2">
                <button className="flex-1 py-2.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-font-heading uppercase text-xs font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5">
                  <iconify-icon icon="solar:heart-bold" width="14" height="14"></iconify-icon>Oy Ver
                </button>
                <button className="p-2.5 rounded-lg bg-secondary text-foreground hover:bg-muted border border-border transition-colors">
                  <iconify-icon icon="solar:share-bold" width="16" height="16"></iconify-icon>
                </button>
              </div>
            </div>

            {/* #1 */}
            <div className="relative bg-card rounded-2xl border-2 border-primary p-6 flex flex-col justify-between shadow-xl shadow-primary/25 md:order-2 order-1 md:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                <iconify-icon icon="solar:crown-bold" className="text-yellow-300" width="16" height="16"></iconify-icon>#1 MENÜ ADAYI
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Deniz Kılıç" className="size-14 rounded-full border-2 border-primary object-cover" />
                      <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-foreground">Deniz Kılıç</h4>
                      <p className="text-xs text-primary font-semibold">{t("lb.currentCrownHolder")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-font-mono text-3xl font-bold text-primary">2,840</span>
                    <span className="text-[10px] block uppercase text-muted-foreground font-font-mono">Oy</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-background border border-primary/40 space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 size-20 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-font-heading text-xl font-bold text-foreground">THE RED ROOM</span>
                    <span className="text-sm font-font-mono text-primary font-bold">465 ₺</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Rye Whiskey • Kiraz İnfüzyonu • Taze Nar • Tütsülenmiş Meşe Talaşı &amp; Kırmızı Biber Tuzu</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-font-mono font-bold">Rye Bazlı</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-font-mono font-bold">Coupe Bardak</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-font-mono font-bold">%22 ABV</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2 text-xs text-primary">
                  <iconify-icon icon="solar:verified-check-bold" width="18" height="18" className="shrink-0"></iconify-icon>
                  <span>Bar şefimiz tarafından reçete doğrulandı ve onaylandı.</span>
                </div>
              </div>
              <div className="pt-4 flex items-center gap-2">
                <button className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-font-heading uppercase text-xs font-bold tracking-wider hover:bg-primary/90 shadow-md shadow-primary/30 transition-all flex items-center justify-center gap-2">
                  <iconify-icon icon="solar:check-circle-bold" width="16" height="16"></iconify-icon>Oylandı (Geri Çek)
                </button>
                <button className="p-3 rounded-lg bg-secondary text-foreground hover:bg-muted border border-border transition-colors">
                  <iconify-icon icon="solar:share-bold" width="16" height="16"></iconify-icon>
                </button>
              </div>
            </div>

            {/* #3 */}
            <div className="relative bg-card rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-border/90 transition-all shadow-md md:order-3 order-3">
              <div className="absolute -top-3.5 left-6 px-3 py-0.5 rounded-full bg-muted text-foreground border border-border text-xs font-font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <iconify-icon icon="solar:medal-star-bold" className="text-amber-600" width="14" height="14"></iconify-icon>#3 Üçüncü Sıra
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Selin Arda" className="size-11 rounded-full border-2 border-amber-600 object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Selin Arda</h4>
                      <p className="text-[11px] text-muted-foreground">Bilkent Tasarım</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-font-mono text-xl font-bold text-foreground">1,980</span>
                    <span className="text-[10px] block uppercase text-muted-foreground font-font-mono">Oy</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-background/80 border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-font-heading text-lg font-bold text-foreground">ANKARA APERITIVO</span>
                    <span className="text-[11px] font-font-mono text-primary font-bold">390 ₺</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Cin Botanik • Campari • Greyfurt Sodası • Taze Biberiye &amp; Kurutulmuş Portakal</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-font-mono font-medium">Cin Bazlı</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-font-mono font-medium">Highball Bardak</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-font-mono font-medium">%14 ABV</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex items-center gap-2">
                <button className="flex-1 py-2.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-font-heading uppercase text-xs font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5">
                  <iconify-icon icon="solar:heart-bold" width="14" height="14"></iconify-icon>Oy Ver
                </button>
                <button className="p-2.5 rounded-lg bg-secondary text-foreground hover:bg-muted border border-border transition-colors">
                  <iconify-icon icon="solar:share-bold" width="16" height="16"></iconify-icon>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Full rankings */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h3 className="font-font-heading text-2xl font-bold uppercase tracking-wider text-foreground">TÜM KATILIMCILAR SIRALAMASI</h3>
              <p className="text-xs text-muted-foreground">Reçeteleri incele, içerik detaylarını gör ve favori kokteyline oy ver</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <iconify-icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="16" height="16"></iconify-icon>
                <input type="text" placeholder="Kokteyl veya yaratıcı ara..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              </div>
              <button className="px-3.5 py-2 rounded-lg bg-card border border-border text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <iconify-icon icon="solar:filter-bold" width="14" height="14"></iconify-icon>Filtrele
              </button>
            </div>
          </div>

          {/* Your entry highlight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/15 via-card to-card border border-primary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold font-font-mono">#4</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Senin Reçeten</span>
                  <span className="size-1.5 rounded-full bg-primary"></span>
                  <span className="text-xs font-font-mono text-muted-foreground">1,740 Oy Toplandı</span>
                </div>
                <h4 className="font-font-heading text-lg font-bold text-foreground">MIDNIGHT IN BILKENT</h4>
                <p className="text-xs text-muted-foreground">Vodka Premium, Yaban Mersini Püresi, Mürver Çiçeği, Taze Lime</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-font-heading uppercase text-xs font-bold tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                <iconify-icon icon="solar:share-bold" width="14" height="14"></iconify-icon>Arkadaşlarınla Paylaş
              </button>
              <button className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground hover:bg-muted text-xs font-semibold">Reçeteyi Düzenle</button>
            </div>
          </div>

          {/* Rank list */}
          <div className="space-y-3">
            {/* #4 — own entry */}
            <div className="p-4 rounded-xl bg-card border-2 border-primary/50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary transition-all">
              <div className="flex items-center gap-4">
                <span className="font-font-heading text-2xl font-bold text-primary w-8 text-center font-font-mono">04</span>
                <img src="https://lh3.googleusercontent.com/a/ACg8ocJCxwMUJaUR_K6XCsiAdpE7nvLNJBzBaXmv3EjdUs_F69FMRS4=s96-c" alt="Badu Alp Ustagül" className="size-10 rounded-full border border-primary object-cover shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-font-heading text-lg font-bold text-foreground">MIDNIGHT IN BILKENT</span>
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase">Senin Kaydın</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Badu Alp Ustagül • Vodka, Yaban Mersini, Mürver Çiçeği</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                <div className="text-right">
                  <span className="font-font-mono text-base font-bold text-foreground">1,740</span>
                  <span className="text-[10px] block uppercase text-muted-foreground font-font-mono">Oy</span>
                </div>
                <span className="text-xs font-font-mono font-bold text-primary px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/30">#4. Sıradasın</span>
              </div>
            </div>

            {/* #5 */}
            <div className="p-4 rounded-xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-all">
              <div className="flex items-center gap-4">
                <span className="font-font-heading text-2xl font-bold text-muted-foreground w-8 text-center font-font-mono">05</span>
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Kerem Yılmaz" className="size-10 rounded-full border border-border object-cover shrink-0" />
                <div>
                  <h4 className="font-font-heading text-lg font-bold text-foreground">YORK BOTANICAL FIZZ</h4>
                  <p className="text-xs text-muted-foreground">Kerem Yılmaz • Hendrick&apos;s Gin, Salatalık Özü, Taze Nane, Tonic</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                <div className="text-right">
                  <span className="font-font-mono text-base font-bold text-foreground">1,520</span>
                  <span className="text-[10px] block uppercase text-muted-foreground font-font-mono">Oy</span>
                </div>
                <button className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-font-heading uppercase text-xs font-bold tracking-wider transition-colors flex items-center gap-1.5">
                  <iconify-icon icon="solar:heart-bold" width="14" height="14"></iconify-icon>Oy Ver
                </button>
              </div>
            </div>

            {/* #6 */}
            <div className="p-4 rounded-xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-all">
              <div className="flex items-center gap-4">
                <span className="font-font-heading text-2xl font-bold text-muted-foreground w-8 text-center font-font-mono">06</span>
                <img src="https://randomuser.me/api/portraits/women/22.jpg" alt="Ece Tan" className="size-10 rounded-full border border-border object-cover shrink-0" />
                <div>
                  <h4 className="font-font-heading text-lg font-bold text-foreground">SPICY TOKYO MULE</h4>
                  <p className="text-xs text-muted-foreground">Ece Tan • Sake, Taze Zencefil, Misket Limonu, Ginger Beer, Chili Flakes</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                <div className="text-right">
                  <span className="font-font-mono text-base font-bold text-foreground">1,380</span>
                  <span className="text-[10px] block uppercase text-muted-foreground font-font-mono">Oy</span>
                </div>
                <button className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-font-heading uppercase text-xs font-bold tracking-wider transition-colors flex items-center gap-1.5">
                  <iconify-icon icon="solar:heart-bold" width="14" height="14"></iconify-icon>Oy Ver
                </button>
              </div>
            </div>

            {/* #7 */}
            <div className="p-4 rounded-xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-all">
              <div className="flex items-center gap-4">
                <span className="font-font-heading text-2xl font-bold text-muted-foreground w-8 text-center font-font-mono">07</span>
                <img src="https://randomuser.me/api/portraits/men/52.jpg" alt="Emre Korkmaz" className="size-10 rounded-full border border-border object-cover shrink-0" />
                <div>
                  <h4 className="font-font-heading text-lg font-bold text-foreground">DRAGON PASSION SOUR</h4>
                  <p className="text-xs text-muted-foreground">Emre Korkmaz • Gold Rom, Çarkıfelek Meyvesi, Ejder Meyvesi Köpüğü, Angostura</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                <div className="text-right">
                  <span className="font-font-mono text-base font-bold text-foreground">1,190</span>
                  <span className="text-[10px] block uppercase text-muted-foreground font-font-mono">Oy</span>
                </div>
                <button className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-font-heading uppercase text-xs font-bold tracking-wider transition-colors flex items-center gap-1.5">
                  <iconify-icon icon="solar:heart-bold" width="14" height="14"></iconify-icon>Oy Ver
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Hall of Fame */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b-2 border-primary pb-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <iconify-icon icon="solar:star-fall-bold" width="20" height="20"></iconify-icon>
              </div>
              <div>
                <h2 className="font-font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">EFSANELER KÜRSÜSÜ</h2>
                <p className="text-xs text-muted-foreground">Geçmiş ayların birincileri ve şu an Bilkent York resmi menüsünde yer alan şampiyonlar</p>
              </div>
            </div>
            <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">Resmi Menüde</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { month: "Nisan 2025 Şampiyonu", price: "445 ₺", name: "CRIMSON DUSK", author: "Mert Yılmaz", desc: "Hibiscus infüze Cin, Italicus, taze lime suyu, pembe greyfurt ve biberiye tütsüsü.", votes: "3,420" },
              { month: "Mart 2025 Şampiyonu", price: "460 ₺", name: "YORK GHOST", author: "Ece Soydan", desc: "Mezcal, Yuzu suyu, Agave nektarı, acı jalapeño yağı ve siyah lav tuzu kenarlığı.", votes: "3,890" },
              { month: "Şubat 2025 Şampiyonu", price: "435 ₺", name: "SMOKED ANKARA", author: "Tolga Er", desc: "Islay Single Malt, Aperol, çilek sirkesi shrub ve ceviz bitteri.", votes: "2,950" },
            ].map(({ month, price, name, author, desc, votes }) => (
              <div key={name} className="bg-card rounded-xl border border-border p-5 space-y-3 relative overflow-hidden group hover:border-primary/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-secondary text-primary font-font-mono text-xs font-bold border border-border">{month}</span>
                  <span className="text-xs font-font-mono font-bold text-foreground">{price}</span>
                </div>
                <div>
                  <h4 className="font-font-heading text-xl font-bold uppercase text-foreground">{name}</h4>
                  <p className="text-xs text-primary font-medium">Reçete Sahibi: {author}</p>
                </div>
                <p className="text-xs text-muted-foreground">{desc}</p>
                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <iconify-icon icon="solar:check-circle-bold" className="text-primary"></iconify-icon>Fiziksel Menüde Aktif
                  </span>
                  <span className="font-font-mono">{votes} Oy</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rules */}
        <section className="rounded-2xl bg-card border border-border p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-font-heading text-2xl font-bold uppercase tracking-wider text-foreground">YARIŞMA KURALLARI &amp; İŞLEYİŞ</h3>
            <p className="text-xs text-muted-foreground">Bilkent York kokteyl liginde adil puanlama ve menüye geçiş süreci</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              ["1", "Reçeteni Tasarla", "Kokteyl Lab'e gir, baz içki, mikser, buz ve garnitürünü seçip kokteyline bir isim ver."],
              ["2", "Oyları Topla", "Arkadaşlarınla paylaş, barda sipariş verildikçe adisyon fişindeki kod ile x2 puan kazan."],
              ["3", "Menüye Gir & Ücretsiz İç", "Ayın 1.si yeni basılan resmi menüye basılır ve 1 ay boyunca kendi kokteylini ücretsiz içer!"],
            ].map(([num, title, desc]) => (
              <div key={num} className="text-center space-y-2 p-4 rounded-xl bg-background border border-border/60">
                <div className="size-10 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center mx-auto font-font-heading font-bold text-base">{num}</div>
                <h4 className="font-bold text-sm text-foreground uppercase">{title}</h4>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-secondary via-card to-secondary border border-primary/40 p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs uppercase font-bold tracking-widest">Senin Sıran</span>
            <h2 className="font-font-heading text-3xl sm:text-5xl font-bold uppercase tracking-wider text-foreground">
              SIRADAKİ EFSANE <span className="text-primary">SEN OLABİLİRSİN</span>
            </h2>
            <p className="text-sm text-muted-foreground">Bilkent York barmenlerinin malzemeleri hazır. Kendi damak tadına özel reçeteni hemen oluştur ve yarışmaya katıl!</p>
            <div className="pt-2">
              <a href="/" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-font-heading tracking-wider uppercase text-base font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                <iconify-icon icon="solar:magic-stick-3-bold" width="20" height="20"></iconify-icon>Kokteyl Lab&apos;e Git &amp; Karıştır
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
            <a href="/leaderboard" className="hover:text-primary transition-colors font-bold text-primary">{t("footer.leaderboard")}</a>
            <a href="#" className="hover:text-primary transition-colors">{t("footer.hallOfFame")}</a>
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
