"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";

export default function MenuPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-white font-font-sans">
      <Navbar activePage="menu" />

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
      <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3.5">
            <a href="#promo-bar" className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-primary text-primary-foreground flex items-center gap-2 shrink-0">
              <iconify-icon icon="solar:fire-bold" width="16" height="16"></iconify-icon>Promolar &amp; Bar
            </a>
            <a href="#sushi-bar" className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border flex items-center gap-2 shrink-0 transition-colors">
              <iconify-icon icon="mdi:fish" className="text-primary" width="16" height="16"></iconify-icon>Sushi &amp; Roll
            </a>
            <a href="#bentolar" className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border flex items-center gap-2 shrink-0 transition-colors">
              <iconify-icon icon="solar:box-bold" className="text-primary" width="16" height="16"></iconify-icon>Bentolar
            </a>
            <a href="#noodles-rice" className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border flex items-center gap-2 shrink-0 transition-colors">
              <iconify-icon icon="tabler:bowl-spoon" className="text-primary" width="16" height="16"></iconify-icon>Noodle &amp; Rice
            </a>
            <a href="#main-kitchen" className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border flex items-center gap-2 shrink-0 transition-colors">
              <iconify-icon icon="solar:chef-hat-bold" className="text-primary" width="16" height="16"></iconify-icon>Ana Yemekler
            </a>
            <a href="#aperatifler" className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border flex items-center gap-2 shrink-0 transition-colors">
              <iconify-icon icon="solar:tuning-bold" className="text-primary" width="16" height="16"></iconify-icon>Aperatif &amp; Salata
            </a>
            <a href="#burgerler" className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border flex items-center gap-2 shrink-0 transition-colors">
              <iconify-icon icon="solar:hamburger-menu-line-duotone" className="text-primary" width="16" height="16"></iconify-icon>Burgerler
            </a>
            <a href="#coffee-soft" className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border flex items-center gap-2 shrink-0 transition-colors">
              <iconify-icon icon="solar:cup-hot-bold" className="text-primary" width="16" height="16"></iconify-icon>Kahve &amp; Tatlı
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Promo & Bar */}
        <section id="promo-bar" className="space-y-6 scroll-mt-36">
          <div className="flex items-center justify-between border-b-2 border-primary pb-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <iconify-icon icon="mdi:beer" width="20" height="20"></iconify-icon>
              </div>
              <div>
                <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider text-foreground">PROMO &amp; BAR</h2>
                <p className="text-xs text-muted-foreground">Fıçı Biralar, Şişeler, Shot Menüleri ve Günün Balığı</p>
              </div>
            </div>
            <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">{t("menu.yorkSpecials")}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Beer */}
            <div className="bg-card rounded-xl border border-border p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-6 -bottom-6 size-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="inline-block px-3 py-1 rounded bg-primary text-primary-foreground font-font-heading uppercase text-sm tracking-wider font-bold mb-3">Buzzz Gibi Bira</div>
                <div className="space-y-3 mt-2">
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <div>
                      <div className="font-bold text-sm text-foreground">Bud Fıçı</div>
                      <div className="text-xs text-muted-foreground">33 cl / 50 cl</div>
                    </div>
                    <div className="text-right font-font-mono font-bold text-foreground">
                      <div>245 ₺</div>
                      <div className="text-primary text-xs">275 ₺</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <div>
                      <div className="font-bold text-sm text-foreground">Efes Fıçı</div>
                      <div className="text-xs text-muted-foreground">33 cl / 50 cl</div>
                    </div>
                    <div className="text-right font-font-mono font-bold text-foreground">
                      <div>240 ₺</div>
                      <div className="text-primary text-xs">270 ₺</div>
                    </div>
                  </div>
                  <div className="pt-2 space-y-2">
                    <div className="text-xs uppercase font-bold tracking-wider text-primary">Kova Fırsatları</div>
                    <div className="flex justify-between text-xs text-muted-foreground py-1">
                      <span>4&apos;lü Kova</span><span className="font-font-mono font-bold text-foreground">1.150 ₺</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground py-1">
                      <span>5&apos;li Kova</span><span className="font-font-mono font-bold text-foreground">1.380 ₺</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground py-1">
                      <span>6&apos;lı Kova</span><span className="font-font-mono font-bold text-foreground">1.650 ₺</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Wine & Shot */}
            <div className="bg-card rounded-xl border border-border p-5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded bg-primary text-primary-foreground font-font-heading uppercase text-sm tracking-wider font-bold mb-3">Wine &amp; Shot</div>
                <div className="space-y-3 mt-2">
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <div>
                      <div className="font-bold text-sm text-foreground">5+1 Tekila</div>
                      <div className="text-xs text-muted-foreground line-through opacity-70">1.560 ₺</div>
                    </div>
                    <div className="font-font-mono font-bold text-primary text-base">1.450 ₺</div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <div>
                      <div className="font-bold text-sm text-foreground">5+1 Jäger</div>
                      <div className="text-xs text-muted-foreground line-through opacity-70">1.620 ₺</div>
                    </div>
                    <div className="font-font-mono font-bold text-primary text-base">1.500 ₺</div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <div>
                      <div className="font-bold text-sm text-foreground">5+1 Viski</div>
                      <div className="text-xs text-muted-foreground line-through opacity-70">1.680 ₺</div>
                    </div>
                    <div className="font-font-mono font-bold text-primary text-base">1.550 ₺</div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-background border border-primary/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase text-foreground">1 Şişe Şarap</div>
                      <div className="text-[11px] text-muted-foreground">Kırmızı / Rose / Beyaz</div>
                    </div>
                    <span className="font-font-mono font-bold text-primary">1.550 ₺</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Günün Balığı */}
            <div className="bg-card rounded-xl border border-primary/50 p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl">Sadece 675 ₺</div>
              <div>
                <div className="inline-block px-3 py-1 rounded bg-secondary text-secondary-foreground font-font-heading uppercase text-sm tracking-wider font-bold mb-3">Günün Balığı</div>
                <p className="text-xs text-muted-foreground mb-3">Her gün taze deniz ürünleri servisi:</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40"><span className="text-muted-foreground font-medium">Pazartesi</span><span className="font-bold text-foreground">Somon Izgara</span></div>
                  <div className="flex justify-between py-1 border-b border-border/40"><span className="text-muted-foreground font-medium">Salı</span><span className="font-bold text-foreground">Levrek Izgara</span></div>
                  <div className="flex justify-between py-1 border-b border-border/40"><span className="text-muted-foreground font-medium">Çarşamba</span><span className="font-bold text-foreground">Çipura Izgara</span></div>
                  <div className="flex justify-between py-1 border-b border-border/40"><span className="text-muted-foreground font-medium">Perşembe</span><span className="font-bold text-foreground">Fish &amp; Chips</span></div>
                  <div className="flex justify-between py-1 border-b border-border/40"><span className="text-muted-foreground font-medium">Cuma</span><span className="font-bold text-foreground">Levrek Izgara</span></div>
                  <div className="flex justify-between py-1 text-primary font-bold"><span>Cmt / Pzr</span><span>Tüm Balık Çeşitleri</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sushi Bar */}
        <section id="sushi-bar" className="space-y-6 scroll-mt-36">
          <div className="flex items-center justify-between border-b-2 border-primary pb-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <iconify-icon icon="boxicons:dish" width="20" height="20"></iconify-icon>
              </div>
              <div>
                <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider text-foreground">SUSHI BAR</h2>
                <p className="text-xs text-muted-foreground">Taze Somon, Yılan Balığı, Tempura Karides &amp; Roll Çeşitleri</p>
              </div>
            </div>
            <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">{t("menu.handcraftedDaily")}</span>
          </div>
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
              {/* Sashimi & Nigiri */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3 border-b border-border/80 pb-2">
                  <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">Sashimi <span className="text-xs text-muted-foreground font-font-sans font-normal">(4 pcs)</span></h3>
                  <iconify-icon icon="solar:fire-square-bold" className="text-primary" width="16" height="16"></iconify-icon>
                </div>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between items-center"><span>Sake Sashimi (Somon)</span><span className="font-font-mono font-bold text-primary">440 ₺</span></div>
                  <div className="flex justify-between items-center"><span>Suzuki Sashimi (Levrek)</span><span className="font-font-mono font-bold text-primary">430 ₺</span></div>
                </div>
                <div className="flex items-center justify-between mb-3 border-b border-border/80 pb-2">
                  <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">Nigiri <span className="text-xs text-muted-foreground font-font-sans font-normal">(2 pcs)</span></h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center"><span>Sake Nigiri</span><span className="font-font-mono font-bold text-primary">335 ₺</span></div>
                  <div className="flex justify-between items-center"><span>Suzuki Nigiri</span><span className="font-font-mono font-bold text-primary">355 ₺</span></div>
                  <div className="flex justify-between items-center"><span>Ebi Nigiri</span><span className="font-font-mono font-bold text-primary">345 ₺</span></div>
                  <div className="flex justify-between items-center"><span>Kani Nigiri</span><span className="font-font-mono font-bold text-primary">335 ₺</span></div>
                  <div className="flex justify-between items-center"><span>Unagi Nigiri (Tütsülenmiş Yılan Balığı)</span><span className="font-font-mono font-bold text-primary">435 ₺</span></div>
                </div>
              </div>
              {/* Maki */}
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3 border-b border-border/80 pb-2">
                  <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">Maki <span className="text-xs text-muted-foreground font-font-sans font-normal">(8 pcs)</span></h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[
                    ["Kappa Maki (Salatalık)", "340 ₺"],
                    ["Sake Maki (Somon)", "345 ₺"],
                    ["Kani Maki (Yengeç)", "335 ₺"],
                    ["Avocado Maki", "320 ₺"],
                    ["Kani Ebi Maki", "370 ₺"],
                    ["Ebi Avocado Maki", "365 ₺"],
                    ["Sake Avocado Maki", "370 ₺"],
                    ["Unagi Maki", "480 ₺"],
                    ["Ebi Tempura Maki", "370 ₺"],
                    ["Suzuki Tempura Maki", "375 ₺"],
                  ].map(([name, price]) => (
                    <div key={name} className="flex justify-between py-1 border-b border-border/30">
                      <span>{name}</span><span className="font-font-mono font-bold text-primary">{price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 border-b border-border/30 sm:col-span-2">
                    <span>Kani Tempura Maki</span><span className="font-font-mono font-bold text-primary">360 ₺</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Special Uramaki */}
            <div className="lg:col-span-7 bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-2">
                <div>
                  <h3 className="font-font-heading text-2xl uppercase font-bold text-foreground">Special Uramaki Rolls <span className="text-xs text-muted-foreground font-font-sans font-normal">(8 pcs)</span></h3>
                  <p className="text-xs text-muted-foreground">Tüm rulo sosları ve malzemeleri şefin özel reçetesidir</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-primary/20 text-primary font-font-mono text-xs font-bold border border-primary/40">{t("menu.signatureLabel")}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["Mi-Sake Roll", "555 ₺", "İçi: Tempura Somon, Salatalık, Krem Peynir, Avokado | Dışı: Krispi ve Trüflü Mayonez"],
                  ["Dragon Roll", "655 ₺", "İçi: Tempura Yengeç, Salatalık, Krem Peynir, Avokado | Dışı: Tütsülenmiş Yılan Balığı, Unagi Sos"],
                  ["Tiger Roll", "565 ₺", "İçi: Tempura Karides, Salatalık, Krem Peynir, Avokado | Dışı: Balık Yumurtası, Kibrit Patates, Teriyaki Sos"],
                  ["Crunchy Roll", "555 ₺", "İçi: Somon, Yengeç, Balık Yumurtası, Salatalık | Dışı: Tempura Panko, Spicy Sos, Teriyaki"],
                  ["Philadelphia Roll", "555 ₺", "İçi: Yengeç Surimi, Salatalık, Krem Peynir, Avokado | Dışı: Taze Somon"],
                  ["Rainbow Roll", "555 ₺", "İçi: Yengeç Surimi, Salatalık, Krem Peyniri, Avokado | Dışı: Somon, Levrek, Karides, Avokado"],
                  ["Ebi Ten Roll", "565 ₺", "İçi: Tempura Karides, Salatalık, Krem Peynir, Avokado | Dışı: Krispy Kaplama, Teriyaki Sos"],
                  ["Vegas Roll", "555 ₺", "İçi: Tempura Karides, Yengeç, Salatalık, Krem Peynir | Dışı: Tütsülenmiş Somon, Cornflakes, Unagi Sos"],
                  ["Sesame California", "530 ₺", "İçi: Yengeç Surimi, Salatalık, Krem Peynir, Avokado, Karides | Dışı: Susam"],
                  ["Midori Veggie Roll", "515 ₺", "İçi: Salatalık, Havuç, Avokado | Dışı: Dilim Avokado (Vejetaryen)"],
                ].map(([name, price, desc]) => (
                  <div key={name} className="p-3.5 rounded-lg bg-background/70 border border-border/60 hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-sm text-foreground">{name}</h4>
                      <span className="font-font-mono font-bold text-primary text-sm">{price}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bentolar */}
        <section id="bentolar" className="space-y-6 scroll-mt-36">
          <div className="flex items-center justify-between border-b-2 border-primary pb-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <iconify-icon icon="solar:box-minimalistic-bold" width="20" height="20"></iconify-icon>
              </div>
              <div>
                <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider text-foreground">BENTOLAR</h2>
                <p className="text-xs text-muted-foreground">Kombine Asya Menüleri (Noodle + Ana Yemek + Roll Çeşitleri)</p>
              </div>
            </div>
            <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">{t("menu.bestValue")}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["BENTO 1", "570 ₺", "Tavuklu Noodle, Moğol İşi Tavuk, Sesame California Roll (4 pcs)"],
              ["BENTO 2", "620 ₺", "Dana Etli Noodle, Moğol İşi Tavuk, Sesame California Roll (4 pcs)"],
              ["BENTO 3 (VEGGIE)", "555 ₺", "Sebzeli Noodle, Haşlanmış Sebze, Veggie Roll (4 pcs)"],
              ["BENTO 4", "595 ₺", "General Tavuk, Sebzeli Noodle, Sesame California Roll (4 pcs)"],
              ["BENTO 6", "575 ₺", "Moğol İşi Tavuk, Sebzeli Noodle, Sesame California Roll (4 pcs)"],
              ["BENTO 10 (SUSHI MIX)", "720 ₺", "Sesame California (4 pcs), Philadelphia (4 pcs), Kappa Maki (4 pcs), Sake Maki (4 pcs), Ön Salata"],
            ].map(([name, price, desc]) => (
              <div key={name} className="bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-font-heading text-lg font-bold text-foreground">{name}</span>
                    <span className="font-font-mono font-bold text-primary">{price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Noodles & Rice */}
        <section id="noodles-rice" className="space-y-6 scroll-mt-36">
          <div className="flex items-center justify-between border-b-2 border-primary pb-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <iconify-icon icon="solar:fire-square-bold" width="20" height="20"></iconify-icon>
              </div>
              <div>
                <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider text-foreground">NOODLE & PİRİNÇ</h2>
                <p className="text-xs text-muted-foreground">Egg Noodle, Japon Udon, Tayland Pad Thai ve Yakimeshi Pirinçleri</p>
              </div>
            </div>
            <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">{t("menu.wokSizzled")}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">Egg Noodle</h3>
                <span className="text-[10px] uppercase font-bold text-primary">Yumurtalı Buğday</span>
              </div>
              <div className="space-y-2 text-sm">
                {[["Sebzeli","440 ₺"],["Tavuklu","470 ₺"],["Dana Etli","555 ₺"],["Karidesli","570 ₺"],["Deniz Mix","575 ₺"],["Katsu Tavuklu","470 ₺"]].map(([n,p]) => (
                  <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">Udon Noodle</h3>
                <span className="text-[10px] uppercase font-bold text-primary">Kalın Japon Eriştesi</span>
              </div>
              <div className="space-y-2 text-sm">
                {[["Sebzeli","545 ₺"],["Tavuklu","575 ₺"],["Dana Etli","645 ₺"],["Karidesli","615 ₺"],["Deniz Mix Udon","635 ₺"]].map(([n,p]) => (
                  <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">Pad Thai</h3>
                <span className="text-[10px] uppercase font-bold text-primary">Pirinç Eriştesi</span>
              </div>
              <div className="space-y-2 text-sm">
                {[["Tavuklu Pad Thai","505 ₺"],["Dana Etli Pad Thai","570 ₺"],["Karidesli Pad Thai","565 ₺"],["Deniz Mix Pad Thai","570 ₺"]].map(([n,p]) => (
                  <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">Özel Pirinçler</h3>
                <span className="text-[10px] uppercase font-bold text-primary">Wok Fried</span>
              </div>
              <div className="space-y-2 text-sm">
                {[["Sade / Sebzeli Rice","265 - 315 ₺"],["Tavuklu Yakimeshi","425 ₺"],["Dana Etli Yakimeshi","520 ₺"],["Tavuklu Bangkok Rice","445 ₺"],["Karidesli Bangkok Rice","545 ₺"]].map(([n,p]) => (
                  <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Kitchen & Burgers */}
        <section id="main-kitchen" className="space-y-6 scroll-mt-36">
          <div className="flex items-center justify-between border-b-2 border-primary pb-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <iconify-icon icon="solar:chef-hat-heart-bold" width="20" height="20"></iconify-icon>
              </div>
              <div>
                <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider text-foreground">ANA MUTFAK & BURGERLER</h2>
                <p className="text-xs text-muted-foreground">Wok Tavukları, Izgara Etler, Deniz Mahsulleri ve Özel Burgerler</p>
              </div>
            </div>
            <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">{t("menu.chefsKitchen")}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="burgerler">
            {/* Tavuk & Etler */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="font-font-heading text-xl uppercase font-bold text-foreground border-b border-border pb-2">Tavuk &amp; Kırmızı Etler</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Moğol İşi Tavuk","Özel Moğol sos, taze soğan","485 ₺"],
                  ["General Tavuk","Tatlı acı zencefil glaze","550 ₺"],
                  ["Tatlı Ekşi Soslu Tavuk","Ananas ve renkli biberler","550 ₺"],
                  ["Katsu Tavuk","Panko kaplı çıtır göğüs","530 ₺"],
                  ["Yeşil Biberli Dana Eti","Wokta sotelenmiş dana bonfile","740 ₺"],
                  ["Mantarlı Dana Eti","Kültür mantarı ve soya glaze","755 ₺"],
                ].map(([name, desc, price]) => (
                  <div key={name} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                    <div><div className="font-bold">{name}</div><div className="text-xs text-muted-foreground">{desc}</div></div>
                    <span className="font-font-mono font-bold text-primary shrink-0 ml-2">{price}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Balık & Deniz */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="font-font-heading text-xl uppercase font-bold text-foreground border-b border-border pb-2">Balık &amp; Deniz Ürünleri</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Çıtır Balık","Tempura dil balığı","505 ₺"],
                  ["Fish Taco","Tempura levrek & salsa","460 ₺"],
                  ["Kalamar Tava","Tartar sos ile","580 ₺"],
                  ["Fish & Chips","Klasik pub usulü çıtır balık","670 ₺"],
                  ["Izgara Norveç Somon","Haşlanmış sebzeler ile","750 ₺"],
                  ["Izgara Levrek / Çipura","Taze baharat soslu fileto","740 - 750 ₺"],
                ].map(([name, desc, price]) => (
                  <div key={name} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                    <div><div className="font-bold">{name}</div><div className="text-xs text-muted-foreground">{desc}</div></div>
                    <span className="font-font-mono font-bold text-primary shrink-0 ml-2">{price}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Burgerler */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="font-font-heading text-xl uppercase font-bold text-foreground border-b border-border pb-2">Bilkent Burgerler</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-background/80 border border-border">
                  <div className="flex justify-between items-baseline font-bold text-foreground">
                    <span>Peaky Burger</span><span className="font-font-mono text-primary text-xs">120g: 540₺ | 240g: 730₺</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Domates, Köz Soğan, Füme Kaburga, Peaky Sos</p>
                </div>
                <div className="p-3 rounded-lg bg-background/80 border border-border">
                  <div className="flex justify-between items-baseline font-bold text-foreground">
                    <span>Last Penny Burger</span><span className="font-font-mono text-primary text-xs">120g: 515₺ | 240g: 705₺</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Domates, Iceberg, Köz Soğan, Turşu, Penny Sos</p>
                </div>
                <div className="p-3 rounded-lg bg-background/80 border border-border">
                  <div className="flex justify-between items-baseline font-bold text-foreground">
                    <span>Kajun Burger</span><span className="font-font-mono text-primary">505 ₺</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Kajun baharatlı çıtır tavuk, domates, iceberg</p>
                </div>
                <div className="p-3 rounded-lg bg-background/80 border border-border">
                  <div className="flex justify-between items-baseline font-bold text-foreground">
                    <span>Fish Burger</span><span className="font-font-mono text-primary">525 ₺</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Çıtır balık fileto, roka, turşu, tartar sos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Aperatif, Salata & Çorba */}
        <section id="aperatifler" className="space-y-6 scroll-mt-36">
          <div className="flex items-center justify-between border-b-2 border-primary pb-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <iconify-icon icon="solar:slider-vertical-bold" width="20" height="20"></iconify-icon>
              </div>
              <div>
                <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider text-foreground">APERATİF, SALATA &amp; ÇORBA</h2>
                <p className="text-xs text-muted-foreground">Başlangıç Sepetleri, Edamame, Karides Cipsi ve Taze Salatalar</p>
              </div>
            </div>
            <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">Paylaşmak İçin</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-font-heading text-xl uppercase font-bold text-foreground mb-3 pb-2 border-b border-border">Aperatifler</h3>
              <div className="space-y-2 text-sm">
                {[["Karides Cipsi","230 ₺"],["Edamame (Kaya Tuzlu)","295 ₺"],["Çin Böreği (Spring Rolls)","290 ₺"],["Mısır Tempura","330 ₺"],["Rockn Roll Soslu Karides","695 ₺"],["Aperatif Mix Sepeti","590 ₺"],["Aperatif Balık Sepeti","720 ₺"]].map(([n,p]) => (
                  <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-font-heading text-xl uppercase font-bold text-foreground mb-3 pb-2 border-b border-border">Salatalar</h3>
              <div className="space-y-2 text-sm">
                {[["Kinoa Akdeniz Salata","390 ₺"],["Mozerella Akdeniz Salata","415 ₺"],["Izgara Tavuklu Salata","435 ₺"],["Bonfile Dilimli Salata","480 ₺"],["Izgara Balıklı Salata","495 ₺"],["Katsu Tavuk Salata","455 ₺"]].map(([n,p]) => (
                  <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <div>
                <h3 className="font-font-heading text-xl uppercase font-bold text-foreground mb-2 pb-1 border-b border-border">Çorbalar</h3>
                <div className="space-y-1.5 text-sm">
                  {[["Acılı Ekşili Çorba","310 ₺"],["Balık Çorbası","325 ₺"],["Tavuklu Mısır Çorbası","290 ₺"]].map(([n,p]) => (
                    <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-font-heading text-xl uppercase font-bold text-foreground mb-2 pb-1 border-b border-border">Kids York</h3>
                <div className="space-y-1.5 text-sm">
                  {[["1/2 Balık ve Haşlanmış Sebze","420 ₺"],["Hamyorgel & Patates","455 ₺"],["Pişmiş Sushi & Karides Cipsi","575 ₺"]].map(([n,p]) => (
                    <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coffee & Desserts */}
        <section id="coffee-soft" className="space-y-6 scroll-mt-36">
          <div className="flex items-center justify-between border-b-2 border-primary pb-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <iconify-icon icon="solar:cup-hot-bold" width="20" height="20"></iconify-icon>
              </div>
              <div>
                <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider text-foreground">KAHVE & TATLILAR</h2>
                <p className="text-xs text-muted-foreground">Sıcak/Soğuk Kahveler, Bitki Çayları, Alkolsüz Kokteyller ve Asya Tatlıları</p>
              </div>
            </div>
            <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">Kahve, Sıcak Bir Kucaklaşmadır</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-font-heading text-lg uppercase font-bold text-foreground border-b border-border pb-2 mb-3">Sıcak Kahveler</h3>
              <div className="space-y-2 text-sm">
                {[["Espresso","140 ₺"],["Espresso Macchiato","170 ₺"],["Cappuccino / Latte","205 ₺"],["Flat White","205 ₺"],["White Chocolate Mocha","215 ₺"],["Americano","180 ₺"],["Türk Kahvesi","165 ₺"]].map(([n,p]) => (
                  <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-font-heading text-lg uppercase font-bold text-foreground border-b border-border pb-2 mb-3">Soğuk Kahveler</h3>
              <div className="space-y-2 text-sm">
                {[["Ice Americano","175 ₺"],["Ice Latte","205 ₺"],["Ice Mocha","215 ₺"],["Ice Macchiato Vanilya","215 ₺"],["Ice Macchiato Caramel","215 ₺"]].map(([n,p]) => (
                  <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-font-heading text-lg uppercase font-bold text-foreground border-b border-border pb-2 mb-3">Çaylar (Fincan)</h3>
              <div className="space-y-2 text-sm">
                {[["Siyah Çay (Bildiğimiz Çay)","80 ₺"],["Papatya / Yeşil Çay","90 ₺"],["Hibiscus (Mayhoş)","90 ₺"],["Yasemin / Rezene","90 ₺"],["Energic Fruits (Yaban Mersini)","90 ₺"]].map(([n,p]) => (
                  <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-font-heading text-lg uppercase font-bold text-foreground border-b border-border pb-2 mb-3">Tatlılar &amp; Soft</h3>
              <div className="space-y-2 text-sm">
                {[["Balda Kızarmış Muz","270 ₺"],["Kızarmış Dondurma","295 ₺"],["Mochi (2 Adet Seçmeli)","290 ₺"],["Alkolsüz Ekşi Kokteyl","360 ₺"],["Çilekli Limonata","195 ₺"],["Pepsi / 7Up / Ice Tea","145 ₺"]].map(([n,p]) => (
                  <div key={n} className="flex justify-between py-1 border-b border-border/20 last:border-0"><span>{n}</span><span className="font-font-mono font-bold text-primary">{p}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-secondary via-card to-secondary border border-primary/40 p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs uppercase font-bold tracking-widest">{t("menu.monthlyCocktailContest")}</span>
            <h2 className="font-font-heading text-3xl sm:text-5xl font-bold uppercase tracking-wider text-foreground">
              {t("menu.ctaHeading")} <span className="text-primary">{t("menu.ctaHighlight")}</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("menu.ctaDesc")}
            </p>
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
    </div>
  );
}
