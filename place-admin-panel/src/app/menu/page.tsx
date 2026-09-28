import { Icon } from "@iconify/react";
import Link from "next/link";

const products = [
  { id: 1, name: "Dragon Roll (12 parça)", category: "Sushi", price: "485", stock: "Stokta", featured: true, new: true },
  { id: 2, name: "Spicy Tuna Uramaki", category: "Sushi", price: "420", stock: "Stokta", featured: false, new: false },
  { id: 3, name: "Pad Thai – Karidesli", category: "Wok/Noodle", price: "565", stock: "Stokta", featured: true, new: false },
  { id: 4, name: "Wagyu Bento Box", category: "Bento", price: "720", stock: "Stokta", featured: true, new: true },
  { id: 5, name: "Wok Fried Dana Noodle", category: "Wok/Noodle", price: "545", stock: "Stokta", featured: false, new: false },
  { id: 6, name: "Köri Tavuk Bento", category: "Bento", price: "480", stock: "Stokta", featured: false, new: false },
  { id: 7, name: "Espresso Martini", category: "Bar", price: "320", stock: "Sınırlı", featured: true, new: false },
  { id: 8, name: "Sakura Latte", category: "Kahve", price: "185", stock: "Tükendi", featured: false, new: false },
];

export default function MenuPage() {
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
                <p className="text-[11px] text-muted-foreground font-mono">Menü &amp; Ürün Yönetim Paneli</p>
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
                Yeni Ürün Ekle
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
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
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
            <Link href="/settings" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:settings-bold" width={16} height={16} />
              Sistem Ayarları
            </Link>
          </nav>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">

        {/* Title + category filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">
              MENÜ &amp; ÜRÜN YÖNETİMİ
            </h1>
            <p className="text-xs text-muted-foreground">Tüm ürünlerin fiyat, stok durumu ve öne çıkarma ayarlarını yönetin</p>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-xl flex-wrap">
            <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-sm">Tüm Menü <span className="opacity-60 font-mono">118</span></button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Sushi <span className="opacity-60 font-mono">34</span></button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Wok/Noodle/Bento <span className="opacity-60 font-mono">28</span></button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Ana Mutfak <span className="opacity-60 font-mono">22</span></button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Bar <span className="opacity-60 font-mono">18</span></button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground hover:text-foreground">Kahve <span className="opacity-60 font-mono">16</span></button>
          </div>
        </div>

        {/* Promo cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl border border-primary/30 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Icon icon="solar:star-bold" width={16} height={16} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold uppercase text-foreground">Günün Balığı Fırsatı</h3>
                  <p className="text-[10px] text-muted-foreground font-mono">Günlük Özel Promo</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Aktif</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="block text-muted-foreground font-mono uppercase text-[10px]">Ürün Adı</label>
                <input defaultValue="Günün Balığı Sashimi" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-xs font-mono focus:outline-none focus:border-primary/60" />
              </div>
              <div className="space-y-1">
                <label className="block text-muted-foreground font-mono uppercase text-[10px]">Promo Fiyatı</label>
                <input defaultValue="380 ₺" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-primary font-mono font-bold text-xs focus:outline-none focus:border-primary/60" />
              </div>
              <div className="space-y-1">
                <label className="block text-muted-foreground font-mono uppercase text-[10px]">Normal Fiyat</label>
                <input defaultValue="520 ₺" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-xs font-mono focus:outline-none focus:border-primary/60" />
              </div>
              <div className="space-y-1">
                <label className="block text-muted-foreground font-mono uppercase text-[10px]">Stok Adedi</label>
                <input defaultValue="12 porsiyon" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-xs font-mono focus:outline-none focus:border-primary/60" />
              </div>
            </div>
            <button className="w-full py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 text-xs font-semibold hover:bg-primary/30 transition-colors">
              Güncelleştir
            </button>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-secondary text-foreground flex items-center justify-center">
                  <Icon icon="solar:cup-bold" width={16} height={16} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold uppercase text-foreground">Bar &amp; Fıçı Promosyonları</h3>
                  <p className="text-[10px] text-muted-foreground font-mono">Haftalık Bira Kampanyası</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-muted-foreground border border-border">Pasif</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="block text-muted-foreground font-mono uppercase text-[10px]">Kampanya Adı</label>
                <input defaultValue="Cuma Fıçı Gecesi" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-xs font-mono focus:outline-none focus:border-primary/60" />
              </div>
              <div className="space-y-1">
                <label className="block text-muted-foreground font-mono uppercase text-[10px]">İndirim Oranı</label>
                <input defaultValue="%25 İndirim" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-xs font-mono focus:outline-none focus:border-primary/60" />
              </div>
              <div className="space-y-1">
                <label className="block text-muted-foreground font-mono uppercase text-[10px]">Geçerli Saatler</label>
                <input defaultValue="19:00 – 22:00" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-xs font-mono focus:outline-none focus:border-primary/60" />
              </div>
              <div className="space-y-1">
                <label className="block text-muted-foreground font-mono uppercase text-[10px]">Geçerli Günler</label>
                <input defaultValue="Cuma, Cumartesi" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-xs font-mono focus:outline-none focus:border-primary/60" />
              </div>
            </div>
            <button className="w-full py-2 rounded-lg bg-secondary text-foreground border border-border text-xs font-semibold hover:bg-muted transition-colors">
              Aktifleştir &amp; Kaydet
            </button>
          </div>
        </div>

        {/* Product table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border">
            <div>
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">ÜRÜN LİSTESİ</h2>
              <p className="text-xs text-muted-foreground">Inline fiyat düzenleme, stok ve öne çıkarma kontrolü</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Icon icon="solar:magnifier-bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width={14} height={14} />
                <input defaultValue="" placeholder="Ürün ara..." className="pl-8 pr-3 py-2 bg-input border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 w-48" />
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
                  <th className="text-left px-5 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Ürün Adı</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Kategori</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Fiyat (₺)</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Stok</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">Öne Çıkar</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-mono uppercase text-[10px] font-bold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p.id} className={`border-b border-border/40 hover:bg-background/60 transition-colors ${idx % 2 === 0 ? "" : "bg-background/20"}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{p.name}</span>
                        {p.new && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase">Yeni</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full bg-secondary text-muted-foreground font-mono text-[10px] border border-border">{p.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <input defaultValue={p.price} className="w-20 bg-input border border-border rounded-lg px-2 py-1.5 text-primary font-mono font-bold text-xs focus:outline-none focus:border-primary/60 text-center" />
                        <span className="text-muted-foreground font-mono">₺</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold font-mono ${
                        p.stock === "Stokta" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                        p.stock === "Sınırlı" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                        "bg-destructive/20 text-destructive border border-destructive/30"
                      }`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className={`size-7 rounded-lg flex items-center justify-center mx-auto transition-colors ${p.featured ? "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30" : "bg-secondary text-muted-foreground border border-border hover:text-foreground"}`}>
                        <Icon icon={p.featured ? "solar:star-bold" : "solar:star-linear"} width={14} height={14} />
                      </button>
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

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-background/20">
            <span className="text-xs text-muted-foreground font-mono">118 üründen 1–8 gösteriliyor</span>
            <div className="flex items-center gap-1">
              <button className="size-7 rounded-lg bg-secondary border border-border text-muted-foreground flex items-center justify-center text-xs hover:text-foreground transition-colors">
                <Icon icon="solar:arrow-left-bold" width={12} height={12} />
              </button>
              {[1, 2, 3, "...", 15].map((p, i) => (
                <button key={i} className={`size-7 rounded-lg text-xs font-mono transition-colors ${p === 1 ? "bg-primary text-primary-foreground font-bold" : "bg-secondary border border-border text-muted-foreground hover:text-foreground"}`}>{p}</button>
              ))}
              <button className="size-7 rounded-lg bg-secondary border border-border text-muted-foreground flex items-center justify-center text-xs hover:text-foreground transition-colors">
                <Icon icon="solar:arrow-right-bold" width={12} height={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick add form */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <div className="border-b border-border pb-4">
            <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">HIZLI ÜRÜN EKLE</h3>
            <p className="text-xs text-muted-foreground">Yeni menü ürününü hızlıca listeye ekleyin</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs text-muted-foreground font-mono uppercase">Ürün Adı</label>
              <input defaultValue="" placeholder="Ürün adını girin..." className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs text-muted-foreground font-mono uppercase">Kategori</label>
              <select className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs focus:outline-none focus:border-primary/60 appearance-none cursor-pointer">
                <option value="">Kategori seç...</option>
                <option>Sushi</option>
                <option>Wok/Noodle</option>
                <option>Bento</option>
                <option>Ana Mutfak</option>
                <option>Bar</option>
                <option>Kahve</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs text-muted-foreground font-mono uppercase">Fiyat (₺)</label>
              <input defaultValue="" placeholder="0" className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 font-mono" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs text-muted-foreground font-mono uppercase">Stok Durumu</label>
              <select className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs focus:outline-none focus:border-primary/60 appearance-none cursor-pointer">
                <option>Stokta</option>
                <option>Sınırlı</option>
                <option>Tükendi</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs text-muted-foreground font-mono uppercase">İçerikler / Açıklama</label>
            <textarea defaultValue="" placeholder="Ürün içeriklerini veya açıklamasını girin..." rows={3} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 resize-none" />
          </div>
          <div className="flex items-center justify-end gap-3">
            <button className="px-4 py-2 rounded-lg bg-secondary text-foreground border border-border text-xs font-semibold hover:bg-muted transition-colors">
              İptal
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-accent transition-colors flex items-center gap-1.5">
              <Icon icon="solar:add-circle-bold" width={14} height={14} />
              Ürünü Kaydet
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Bilkent York Operations Portal v2.4 • Yönetici: Badu Alp Ustagül (Head Executive)</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-primary transition-colors">Menü Dışa Aktar</a>
            <a href="#" className="hover:text-primary transition-colors">Fiyat Geçmişi</a>
            <a href="#" className="hover:text-primary transition-colors">POS Entegrasyonu</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
