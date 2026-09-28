import { Icon } from "@iconify/react";
import Link from "next/link";

const ingredients = [
  { id: 1, name: "Rye Whiskey 100 Proof", brand: "Rittenhouse / High West", category: "Baz İçki", price: "85", stock: 42, active: true },
  { id: 2, name: "Japanese Botanical Gin", brand: "Roku / Nikka Coffey", category: "Baz İçki", price: "90", stock: 28, active: true },
  { id: 3, name: "Blanco Agave Tequila", brand: "Olmeca Altos / El Jimador", category: "Baz İçki", price: "80", stock: 34, active: true },
  { id: 4, name: "Yuzu & Hibiscus Cordial", brand: "Ev Yapımı – Haftalık", category: "Mikser & Şurup", price: "25", stock: 18, active: true },
  { id: 5, name: "Sparkling Elderflower", brand: "Fever-Tree", category: "Mikser & Şurup", price: "20", stock: 60, active: true },
  { id: 6, name: "Carved Ice Sphere (60mm)", brand: "Buz Fabrikası", category: "Buz Formatı", price: "15", stock: 120, active: true },
  { id: 7, name: "Dried Citrus Wheel", brand: "Mekan Yapımı", category: "Garnitür", price: "8", stock: 200, active: false },
];

const categoryBadgeClass: Record<string, string> = {
  "Baz İçki": "bg-primary/20 text-primary border-primary/30",
  "Mikser & Şurup": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Buz Formatı": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Garnitür": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function CocktailLabPage() {
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
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30">Admin Suite</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">Kokteyl Lab Malzeme &amp; İçerik Düzenleme</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-foreground">POS Kasa: <strong className="text-emerald-400">Online</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border">
                <span className="size-2 rounded-full bg-emerald-500"></span>
                <span className="text-foreground">Kokteyl Lab: <strong className="text-emerald-400">Canlı</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border">
                <Icon icon="solar:calendar-date-bold" className="text-primary" />
                <span className="text-foreground">Dönem: <strong className="text-primary font-mono">Mayıs 2025</strong></span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:bg-accent transition-colors">
                <Icon icon="solar:add-circle-bold" width={14} height={14} />
                Yeni Malzeme Ekle
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
            <Link href="/" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:chart-square-bold" width={16} height={16} />
              Genel Bakış &amp; Ciro Analitiği
            </Link>
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:menu-dots-square-bold" width={16} height={16} />
              Menü Düzenleme
            </Link>
            <Link href="/cocktail-lab" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
              <Icon icon="solar:cup-hot-bold" width={16} height={16} />
              Kokteyl Lab Malzemeleri (Customizer)
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

        {/* Title + step filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">
              KOKTEYL LAB MALZEMELERİ
            </h1>
            <p className="text-xs text-muted-foreground">Customizer kategorilerini, malzeme fiyatlarını ve stok durumlarını yönetin</p>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-xl flex-wrap">
            <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-sm">Baz İçkiler</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Mikser &amp; Sular</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Şurup &amp; Bitter</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Buz &amp; Bardaklar</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Garnitür &amp; Sunum</button>
          </div>
        </div>

        {/* Global settings */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">GLOBAL LAB AYARLARI</h2>
              <p className="text-xs text-muted-foreground">Tüm Kokteyl Lab deneyimini etkileyen temel parametreler</p>
            </div>
            <Icon icon="solar:settings-bold" className="text-muted-foreground" width={20} height={20} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Icon icon="solar:wallet-money-bold" width={16} height={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Baz Kokteyl Fiyatı</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Lab başlangıç ücreti</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input defaultValue="250" className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-primary font-mono font-bold text-sm focus:outline-none focus:border-primary/60 text-center" />
                <span className="text-muted-foreground font-mono text-sm">₺</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Her siparişe ek malzeme fiyatları eklenir</p>
            </div>

            <div className="bg-background rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-secondary text-foreground flex items-center justify-center">
                  <Icon icon="solar:cup-hot-bold" width={16} height={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Maksimum Baz Seçimi</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Misafir başına baz limiti</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input defaultValue="2" className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-foreground font-mono font-bold text-sm focus:outline-none focus:border-primary/60 text-center" />
                <span className="text-muted-foreground font-mono text-sm">adet</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Kombine reçeteler için max. iki baz</p>
            </div>

            <div className="bg-background rounded-xl border border-primary/30 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Icon icon="solar:cup-star-bold" width={16} height={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Otomatik Yarışmaya Gönder</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Yeni reçeteler için</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Otomatik Yarışma Kaydı</span>
                <div className="w-10 h-5 rounded-full bg-primary relative cursor-pointer">
                  <div className="size-4 rounded-full bg-white absolute top-0.5 right-0.5 shadow-sm"></div>
                </div>
              </div>
              <p className="text-[10px] text-primary font-semibold">Aktif — yeni reçeteler otomatik eklenir</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-accent transition-colors flex items-center gap-1.5">
              <Icon icon="solar:check-circle-bold" width={14} height={14} />
              Global Ayarları Kaydet
            </button>
          </div>
        </div>

        {/* Ingredients table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border">
            <div>
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">MALZEMELİK LİSTESİ</h2>
              <p className="text-xs text-muted-foreground">Customizer'da görünen tüm malzemeler — fiyat ve stok kontrolü</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Icon icon="solar:magnifier-bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width={14} height={14} />
                <input defaultValue="" placeholder="Malzeme ara..." className="pl-8 pr-3 py-2 bg-input border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 w-44" />
              </div>
              <button className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:bg-accent transition-colors">
                <Icon icon="solar:add-circle-bold" width={14} height={14} />
                Ekle
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-background/40">
                  <th className="text-left px-5 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Malzeme Adı</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Marka / Kaynak</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Kategori</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Ek Fiyat (₺)</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Stok</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Aktif</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing, idx) => (
                  <tr key={ing.id} className={`border-b border-border/40 hover:bg-background/60 transition-colors ${idx % 2 === 0 ? "" : "bg-background/20"}`}>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-foreground">{ing.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground font-mono text-[10px]">{ing.brand}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${categoryBadgeClass[ing.category] ?? "bg-secondary text-muted-foreground border-border"}`}>
                        {ing.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <input defaultValue={ing.price} className="w-16 bg-input border border-border rounded-lg px-2 py-1.5 text-primary font-mono font-bold text-xs focus:outline-none focus:border-primary/60 text-center" />
                        <span className="text-muted-foreground font-mono">₺</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-mono font-bold text-xs ${ing.stock > 50 ? "text-emerald-400" : ing.stock > 20 ? "text-amber-400" : "text-destructive"}`}>
                        {ing.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className={`w-9 h-5 rounded-full relative cursor-pointer mx-auto transition-colors ${ing.active ? "bg-primary" : "bg-secondary border border-border"}`}>
                        <div className={`size-3.5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${ing.active ? "right-0.5" : "left-0.5"}`}></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <button className="size-7 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors">
                          <Icon icon="solar:pen-bold" width={13} height={13} />
                        </button>
                        <button className="size-7 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 flex items-center justify-center transition-colors">
                          <Icon icon="solar:trash-bin-trash-bold" width={13} height={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick add form */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <div className="border-b border-border pb-4">
            <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">HIZLI MALZEME EKLE</h3>
            <p className="text-xs text-muted-foreground">Yeni lab malzemesini Kokteyl Customizer listesine ekleyin</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs text-muted-foreground font-mono uppercase">Malzeme Adı</label>
              <input defaultValue="" placeholder="Malzeme adını girin..." className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs text-muted-foreground font-mono uppercase">Kategori</label>
              <select className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs focus:outline-none focus:border-primary/60 appearance-none cursor-pointer">
                <option value="">Kategori seç...</option>
                <option>Baz İçkiler</option>
                <option>Mikser &amp; Sular</option>
                <option>Şurup &amp; Bitter</option>
                <option>Buz &amp; Bardaklar</option>
                <option>Garnitür &amp; Sunum</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs text-muted-foreground font-mono uppercase">Ek Fiyat (₺)</label>
              <input defaultValue="" placeholder="0" className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 font-mono" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs text-muted-foreground font-mono uppercase">Marka / Kaynak</label>
              <input defaultValue="" placeholder="Tedarikçi veya kaynak..." className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs text-muted-foreground font-mono uppercase">Başlangıç Stok Miktarı</label>
              <input defaultValue="" placeholder="0" className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 font-mono" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs text-muted-foreground font-mono uppercase">Açıklama / Not</label>
              <input defaultValue="" placeholder="Opsiyonel açıklama..." className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button className="px-4 py-2 rounded-lg bg-secondary text-foreground border border-border text-xs font-semibold hover:bg-muted transition-colors">
              İptal
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-accent transition-colors flex items-center gap-1.5">
              <Icon icon="solar:add-circle-bold" width={14} height={14} />
              Malzemeyi Kaydet
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Bilkent York Operations Portal v2.4 • Yönetici: Badu Alp Ustagül (Head Executive)</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-primary transition-colors">Lab Reçeteleri</a>
            <a href="#" className="hover:text-primary transition-colors">Malzeme Geçmişi</a>
            <a href="#" className="hover:text-primary transition-colors">POS Entegrasyonu</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
