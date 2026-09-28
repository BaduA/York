import { Icon } from "@iconify/react";
import Link from "next/link";

export default function SettingsPage() {
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
                <p className="text-[11px] text-muted-foreground font-mono">Sistem Ayarları, POS &amp; Güvenlik Konfigürasyonu</p>
              </div>
            </div>
<div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
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
            <Link href="/" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:chart-square-bold" width={16} height={16} />
              Genel Bakış &amp; Ciro Analitiği
            </Link>
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:menu-dots-square-bold" width={16} height={16} />
              Menü Düzenleme (Fiyat &amp; Stok)
            </Link>
            <Link href="/cocktail-lab" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-hot-bold" width={16} height={16} />
              Kokteyl Lab Malzemeleri
            </Link>
            <Link href="/leaderboard" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-star-bold" width={16} height={16} />
              Liderlik Tablosu &amp; Oylar
            </Link>
            <Link href="/settings" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
              <Icon icon="solar:settings-bold" width={16} height={16} />
              Sistem Ayarları
            </Link>
          </nav>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">

        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">
            BİLKENT YORK SİSTEM &amp; MEKAN AYARLARI
          </h1>
          <p className="text-xs text-muted-foreground">
            POS kasa entegrasyonu, masa QR kodları, çalışma saatleri, KDV ve personel yetkilendirmeleri
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Mekan & Çalışma Saatleri */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <div className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                <Icon icon="solar:shop-bold" width={18} height={18} />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold uppercase text-foreground">MEKAN &amp; ÇALIŞMA SAATLERİ</h2>
                <p className="text-[11px] text-muted-foreground">Bilkent York şube detayları ve sipariş kabul saatleri</p>
              </div>
            </div>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Mekan Ticari Ünvanı</label>
                  <input type="text" defaultValue="Bilkent York Food & Drink Co." className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-medium focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Konum / Şube</label>
                  <input type="text" defaultValue="Bilkent Center, Ankara" className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-medium focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Haftaiçi Açılış - Kapanış</label>
                  <input type="text" defaultValue="12:00 - 02:00" className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Cuma - Cumartesi Kapanış</label>
                  <input type="text" defaultValue="12:00 - 04:00" className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-border text-xs">
                <div>
                  <span className="font-bold text-foreground block">Dijital Sipariş Kabulü (Online/Masa)</span>
                  <span className="text-[11px] text-muted-foreground">Kapatıldığında müşteriler sadece menüyü inceleyebilir</span>
                </div>
                <button className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs">
                  Açık (Sipariş Alınıyor)
                </button>
              </div>
            </div>
          </div>

          {/* POS Kasa & Ödeme */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <div className="size-8 rounded-lg bg-secondary text-primary border border-border flex items-center justify-center font-bold">
                <Icon icon="solar:card-2-bold" width={18} height={18} />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold uppercase text-foreground">POS KASA &amp; ÖDEME SİSTEMİ</h2>
                <p className="text-[11px] text-muted-foreground">Adisyon entegrasyonu, KDV oranları ve sanal pos</p>
              </div>
            </div>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Adisyon POS Yazılımı</label>
                  <select defaultValue="SambaPOS Pro Entegrasyonu (Canlı)" className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:border-primary focus:outline-none">
                    <option>SambaPOS Pro Entegrasyonu (Canlı)</option>
                    <option>Adisyo Cloud POS</option>
                    <option>Omni Vectron</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Varsayılan KDV Oranı (%)</label>
                  <input type="number" defaultValue="10" className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground font-mono focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Masa Başı Apple Pay / Kredi Kartı Ödemesi</span>
                  <span className="text-[10px] text-muted-foreground">Müşteri masadan kalkmadan tek tıkla adisyonu ödeyebilir</span>
                </div>
                <button className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs">Aktif</button>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button className="py-2 rounded-lg bg-secondary border border-border text-foreground font-semibold hover:bg-muted text-xs flex items-center justify-center gap-1.5">
                  <Icon icon="solar:refresh-linear" width={14} height={14} />
                  POS Bağlantısını Test Et
                </button>
                <button className="py-2 rounded-lg bg-secondary border border-border text-foreground font-semibold hover:bg-muted text-xs flex items-center justify-center gap-1.5">
                  <Icon icon="solar:printer-minimalistic-bold" width={14} height={14} />
                  Bar Yazıcılarını Kontrol Et
                </button>
              </div>
            </div>
          </div>

          {/* Kokteyl Lab & Anti-Bot */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <div className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                <Icon icon="solar:shield-check-bold" width={18} height={18} />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold uppercase text-foreground">KOKTEYL LAB &amp; ANTİ-BOT GÜVENLİĞİ</h2>
                <p className="text-[11px] text-muted-foreground">Liderlik tablosu hile engelleme ve oylama doğrulama kuralları</p>
              </div>
            </div>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                <div>
                  <span className="font-bold text-foreground block">SMS / Telefon Doğrulaması ile Oy Verme</span>
                  <span className="text-[10px] text-muted-foreground">1 telefon numarası ayda sadece 1 kokteyle oy verebilir</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono font-bold text-[10px]">Zorunlu</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                <div>
                  <span className="font-bold text-foreground block">Mekanda Sipariş Edenlere 3x Oy Ağırlığı</span>
                  <span className="text-[10px] text-muted-foreground">Barda kadehi fiziksel olarak içenlerin oyu 3 kat değer taşır</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 font-mono font-bold text-[10px]">Aktif (3x)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                <div>
                  <span className="font-bold text-foreground block">Barmen Güvenlik Onayı Filtresi</span>
                  <span className="text-[10px] text-muted-foreground">Sağlığa zararlı veya dengesiz karışımlar menüye girmeden elenir</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono font-bold text-[10px]">Aktif</span>
              </div>
            </div>
          </div>

          {/* Personel & Erişim */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <div className="size-8 rounded-lg bg-secondary text-foreground border border-border flex items-center justify-center font-bold">
                <Icon icon="solar:users-group-two-rounded-bold" width={18} height={18} />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold uppercase text-foreground">PERSONEL &amp; ERİŞİM YÖNETİMİ</h2>
                <p className="text-[11px] text-muted-foreground">Barmenler, mutfak şefi ve yönetici hesapları</p>
              </div>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-primary/40">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://lh3.googleusercontent.com/a/ACg8ocJCxwMUJaUR_K6XCsiAdpE7nvLNJBzBaXmv3EjdUs_F69FMRS4=s96-c" className="size-8 rounded-lg border border-primary object-cover" alt="Badu Alp Ustagül" />
                  <div>
                    <div className="font-bold text-foreground">Badu Alp Ustagül</div>
                    <div className="text-[10px] text-primary font-mono font-bold">Head Executive (Tam Yetki)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold">Sahip</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://randomuser.me/api/portraits/men/52.jpg" className="size-8 rounded-lg border border-border object-cover" alt="Bar Şefi" />
                  <div>
                    <div className="font-bold text-foreground">Barış Demir</div>
                    <div className="text-[10px] text-muted-foreground font-mono">Head Mixologist (Kokteyl &amp; Reçete)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground text-[10px] font-bold">Bar Yetkilisi</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://randomuser.me/api/portraits/women/33.jpg" className="size-8 rounded-lg border border-border object-cover" alt="Mutfak Şefi" />
                  <div>
                    <div className="font-bold text-foreground">Ceren Yılmaz</div>
                    <div className="text-[10px] text-muted-foreground font-mono">Executive Chef (Mutfak &amp; Sushi)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground text-[10px] font-bold">Mutfak Yetkilisi</span>
              </div>
              <div className="pt-1">
                <button className="w-full py-2 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border font-semibold text-xs flex items-center justify-center gap-1.5">
                  <Icon icon="solar:user-plus-bold" width={14} height={14} />
                  Yeni Personel Hesabı Tanımla
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold font-heading uppercase tracking-wider shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
            <Icon icon="solar:diskette-bold" width={16} height={16} />
            Ayarları Kaydet
          </button>
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
