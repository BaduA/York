import { Icon } from "@iconify/react";
import Link from "next/link";

const contestants = [
  {
    rank: 1,
    name: "THE RED ROOM",
    author: "Deniz Kılıç",
    authorRef: "#REC-104",
    authorColor: "text-primary",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    avatarBorder: "border-primary/50",
    recipe: "Bulleit Rye, Hibiscus & Yuzu Cordial, Elmas Buz, Tütsü Biberiye",
    price: "465 ₺",
    orders: "624 Adet",
    earnings: "289.440 ₺",
    earningsColor: "text-primary",
    rowClass: "bg-primary/5",
    rankClass: "bg-primary text-primary-foreground shadow-sm",
  },
  {
    rank: 2,
    name: "SMOKE & SOUR",
    author: "Can Berk",
    authorRef: "#REC-109",
    authorColor: "text-muted-foreground",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    avatarBorder: "border-border",
    recipe: "Mezcal Espadin, Taze Misket Limonu, Agave, Kurutulmuş Portakal",
    price: "385 ₺",
    orders: "512 Adet",
    earnings: "197.120 ₺",
    earningsColor: "text-foreground",
    rowClass: "",
    rankClass: "bg-secondary text-foreground",
  },
  {
    rank: 3,
    name: "MIDNIGHT IN BILKENT",
    author: "Badu Alp Ustagül (Admin)",
    authorRef: "#REC-115",
    authorColor: "text-primary",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocJCxwMUJaUR_K6XCsiAdpE7nvLNJBzBaXmv3EjdUs_F69FMRS4=s96-c",
    avatarBorder: "border-primary/50",
    recipe: "Botanical Gin, Böğürtlen Cordial, Tonik, Taze Nane & Biberiye",
    price: "406 ₺",
    orders: "390 Adet",
    earnings: "158.340 ₺",
    earningsColor: "text-foreground",
    rowClass: "",
    rankClass: "bg-secondary text-foreground",
  },
  {
    rank: 4,
    name: "ANKARA APERITIVO",
    author: "Selin Arda",
    authorRef: "#REC-088",
    authorColor: "text-muted-foreground",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    avatarBorder: "border-border",
    recipe: "Campari, Kırmızı Vermut, Greyfurt Köpüğü, Prosecco",
    price: "365 ₺",
    orders: "348 Adet",
    earnings: "126.972 ₺",
    earningsColor: "text-foreground",
    rowClass: "",
    rankClass: "bg-secondary text-muted-foreground",
  },
  {
    rank: 5,
    name: "CHILLI INFERNO 100",
    author: "Uyarı: Yüksek Acı & 3x Alkol",
    authorRef: "",
    authorColor: "text-destructive font-bold",
    avatar: "https://randomuser.me/api/portraits/men/71.jpg",
    avatarBorder: "border-destructive/50",
    recipe: "Absente, 100 Proof Rye, Jalapeno Bitter, Tabasco",
    price: "490 ₺",
    orders: "12 Adet",
    earnings: "5.880 ₺",
    earningsColor: "text-muted-foreground",
    rowClass: "bg-red-950/15",
    rankClass: "bg-destructive/30 text-destructive",
  },
];

export default function LeaderboardPage() {
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
                <p className="text-[11px] text-muted-foreground font-mono">Liderlik Tablosu, Oylar &amp; Menüye Aktarım</p>
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
              Genel Bakış
            </Link>
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:menu-dots-square-bold" width={16} height={16} />
              Menü
            </Link>
            <Link href="/cocktail-lab" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-hot-bold" width={16} height={16} />
              Kokteyl Lab
            </Link>
            <Link href="/leaderboard" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
              <Icon icon="solar:cup-star-bold" width={16} height={16} />
              Liderlik Tablosu
            </Link>
            <Link href="/orders" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:bill-list-bold" width={16} height={16} />
              Siparişler
            </Link>
          </nav>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">AYIN KOKTEYLİ SIRALAMASI</h3>
              <p className="text-xs text-muted-foreground">Mayıs 2025 — Yarışmaya katılan 48 reçete</p>
            </div>
            <div className="flex items-center gap-2">
              <select defaultValue="Mayıs 2025 (Aktif Sezon)" className="bg-secondary border border-border text-foreground text-xs rounded-xl px-3 py-2 font-mono font-semibold focus:border-primary focus:outline-none">
                <option>Mayıs 2025 (Aktif Sezon)</option>
                <option>Nisan 2025 (Crimson Dusk Kazandı)</option>
                <option>Mart 2025 (Velvet Smoke Kazandı)</option>
              </select>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold font-heading uppercase tracking-wider shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
                <Icon icon="solar:cup-star-bold" width={14} height={14} />
                Menüye Aktar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse table-fixed">
              <colgroup>
                <col className="w-14" />
                <col className="w-[22%]" />
                <col />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-32" />
              </colgroup>
              <thead>
                <tr className="border-b border-border text-[11px] font-mono uppercase text-muted-foreground bg-background/50">
                  <th className="py-3 px-3 font-semibold text-center">Sıra</th>
                  <th className="py-3 px-3 font-semibold">Kokteyl Adı &amp; Oluşturan</th>
                  <th className="py-3 px-3 font-semibold">Reçete Özeti</th>
                  <th className="py-3 px-3 font-semibold text-right">Fiyat</th>
                  <th className="py-3 px-3 font-semibold text-right">Sipariş Sayısı</th>
                  <th className="py-3 px-3 font-semibold text-right">Toplam Kazanç</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {contestants.map((c) => (
                  <tr key={c.rank} className={`hover:bg-muted/30 transition-colors ${c.rowClass}`}>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex size-7 rounded-lg font-mono font-bold items-center justify-center text-xs ${c.rankClass}`}>
                        {c.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.avatar} className={`size-8 rounded-full border object-cover ${c.avatarBorder}`} alt={c.author} />
                        <div>
                          <div className="font-bold text-foreground text-sm font-heading">{c.name}</div>
                          <div className={`text-[10px] font-mono ${c.authorColor}`}>
                            {c.author}{c.authorRef ? ` • ${c.authorRef}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground">
                      <span className="line-clamp-2 leading-relaxed">{c.recipe}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-foreground">
                      {c.price}
                    </td>
                    <td className={`py-3.5 px-3 text-right font-mono font-bold ${c.rank === 5 ? "text-muted-foreground" : "text-foreground"}`}>
                      {c.orders}
                    </td>
                    <td className={`py-3.5 px-3 text-right font-mono font-bold text-sm ${c.earningsColor}`}>
                      {c.earnings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
