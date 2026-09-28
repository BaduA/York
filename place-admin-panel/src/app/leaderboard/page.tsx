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
    orders: "624 Adet",
    votes: "3,840",
    voteToday: "+180 bugün",
    voteTodayColor: "text-emerald-400",
    voteColor: "text-primary",
    approval: "Onaylandı",
    approvalClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    rowClass: "bg-primary/5",
    rankClass: "bg-primary text-primary-foreground shadow-sm",
    actions: "menu",
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
    orders: "512 Adet",
    votes: "2,910",
    voteToday: "+92 bugün",
    voteTodayColor: "text-emerald-400",
    voteColor: "text-foreground",
    approval: "Onaylandı",
    approvalClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    rowClass: "",
    rankClass: "bg-secondary text-foreground",
    actions: "edit",
  },
  {
    rank: 3,
    name: "MIDNIGHT IN BILKENT",
    author: "Badu Alp Ustagül (Admin)",
    authorRef: "#REC-115",
    authorColor: "text-primary",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocJCxwMUJaUR_K6XCsiAdpE7nvLNJBzBaXmv3EjdUs_F69FMRS4=s96-c",
    avatarBorder: "border-primary/50",
    recipe: "Japanese Botanical Gin, Böğürtlen Cordial, Tonik, Taze Nane & Biberiye",
    orders: "390 Adet",
    votes: "2,150",
    voteToday: "+44 bugün",
    voteTodayColor: "text-muted-foreground",
    voteColor: "text-foreground",
    approval: "Onaylandı",
    approvalClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    rowClass: "",
    rankClass: "bg-secondary text-foreground",
    actions: "edit",
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
    orders: "348 Adet",
    votes: "1,780",
    voteToday: "+29 bugün",
    voteTodayColor: "text-muted-foreground",
    voteColor: "text-foreground",
    approval: "Onaylandı",
    approvalClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    rowClass: "",
    rankClass: "bg-secondary text-muted-foreground",
    actions: "edit",
  },
  {
    rank: 5,
    name: "CHILLI INFERNO 100",
    author: "Uyarı: Yüksek Acı & 3x Alkol",
    authorRef: "",
    authorColor: "text-destructive font-bold",
    avatar: "https://randomuser.me/api/portraits/men/71.jpg",
    avatarBorder: "border-destructive/50",
    recipe: "Absente, 100 Proof Rye, Jalapeno Bitter, Tabasco (İçilebilirlik Düşük)",
    orders: "12 Adet",
    votes: "1,240",
    voteToday: "Şüpheli Oy Artışı",
    voteTodayColor: "text-destructive",
    voteColor: "text-foreground",
    approval: "Barmen Reddetti",
    approvalClass: "bg-destructive/20 text-destructive border-destructive/40",
    rowClass: "bg-red-950/15",
    rankClass: "bg-destructive/30 text-destructive",
    actions: "disqualify",
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
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30">Admin Suite</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">Liderlik Tablosu, Oylar &amp; Menüye Aktarım</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-foreground">Mayıs 2025 Yarışması: <strong className="text-emerald-400">Canlı Oylamada</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border">
                <Icon icon="solar:clock-circle-bold" className="text-primary" />
                <span className="text-foreground">Kapanışa Kalan: <strong className="text-primary font-mono">6 Gün 14 Saat</strong></span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold font-heading uppercase tracking-wider shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
                <Icon icon="solar:cup-star-bold" width={16} height={16} />
                Şampiyonu Menüye Aktar
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
            <Link href="/leaderboard" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
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

        {/* Title + season selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">
              AYIN KOKTEYLİ YARIŞMASI &amp; OYLAMA DENETİMİ
            </h1>
            <p className="text-xs text-muted-foreground">
              Müşterilerin oluşturduğu kokteylleri denetleyin, hileli oyları engelleyin ve 1. olan reçeteyi doğrudan resmi menüye aktarın
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select defaultValue="Mayıs 2025 (Aktif Sezon)" className="bg-card border border-border text-foreground text-xs rounded-xl px-3 py-2 font-mono font-semibold focus:border-primary focus:outline-none">
              <option>Mayıs 2025 (Aktif Sezon)</option>
              <option>Nisan 2025 (Crimson Dusk Kazandı)</option>
              <option>Mart 2025 (Velvet Smoke Kazandı)</option>
            </select>
            <button className="px-3.5 py-2 rounded-xl bg-secondary border border-border hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Icon icon="solar:refresh-linear" width={14} height={14} />
              Oyları Yenile
            </button>
          </div>
        </div>

        {/* #1 Leader featured card */}
        <div className="bg-card rounded-2xl border-2 border-primary/60 p-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold font-mono tracking-wider flex items-center gap-1 shadow-md">
                  <Icon icon="solar:cup-star-bold" width={16} height={16} />
                  #1 MEVCUT LİDER • MENÜ ADAYI
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  Barmen Onaylı (%94 İçilebilirlik)
                </span>
              </div>
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">THE RED ROOM</h2>
                <div className="flex items-center gap-2 mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" className="size-6 rounded-full border border-primary/40 object-cover" alt="Deniz Kılıç" />
                  <p className="text-xs text-muted-foreground">
                    Oluşturan: <strong className="text-foreground">Deniz Kılıç</strong> (Bilkent Öğrenci No: #2210492) • 12 Mayıs 2025
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono">
                  <strong className="text-primary font-bold">Baz:</strong> Bulleit Rye Whiskey (50ml)
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono">
                  <strong className="text-amber-400 font-bold">Mikser:</strong> Hibiscus Redüksiyonu &amp; Yuzu (30ml)
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono">
                  <strong className="text-blue-400 font-bold">Buz:</strong> Elmas Kesim Kristal Buz
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono">
                  <strong className="text-emerald-400 font-bold">Sunum:</strong> Tütsülenmiş Biberiye &amp; Altın Tozu
                </span>
              </div>
            </div>
            <div className="lg:col-span-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-muted-foreground">Toplam Onaylı Oy:</span>
                <span className="font-bold text-primary text-base">3,840 Oy (%30.7)</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-muted-foreground">Mekan İçi Sipariş:</span>
                <span className="font-bold text-foreground">624 Kadeh</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-muted-foreground">Önerilen Menü Satış:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">465 ₺ (%81 Marj)</span>
              </div>
              <div className="pt-2">
                <button className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-heading uppercase font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all">
                  <Icon icon="solar:diskette-bold" width={16} height={16} />
                  Haziran Menüsüne Resmen Ekle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full competition table */}
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">TÜM YARIŞMACI KOKTEYLLER &amp; OYLAMA SIRALAMASI</h3>
              <p className="text-xs text-muted-foreground">Mayıs ayı boyunca oluşturulup yarışmaya katılan 48 reçete</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground text-xs font-semibold border border-border">
                Bot/Çift Oy Taraması Yap
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground text-xs font-semibold border border-border">
                CSV Olarak Dışa Aktar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-mono uppercase text-muted-foreground bg-background/50">
                  <th className="py-3 px-3 font-semibold text-center w-16">Sıra</th>
                  <th className="py-3 px-3 font-semibold">Kokteyl Adı &amp; Oluşturan</th>
                  <th className="py-3 px-3 font-semibold">Reçete Özeti</th>
                  <th className="py-3 px-3 font-semibold text-right">Lab Siparişi</th>
                  <th className="py-3 px-3 font-semibold text-right">Doğrulanmış Oy</th>
                  <th className="py-3 px-3 font-semibold text-center">Barmen Onayı</th>
                  <th className="py-3 px-3 font-semibold text-right">İşlemler</th>
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
                    <td className="py-3.5 px-3 text-muted-foreground max-w-xs truncate">{c.recipe}</td>
                    <td className={`py-3.5 px-3 text-right font-mono font-bold ${c.rank === 5 ? "text-muted-foreground" : "text-foreground"}`}>
                      {c.orders}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className={`font-mono font-bold text-sm ${c.voteColor}`}>{c.votes}</div>
                      <div className={`text-[10px] font-mono ${c.voteTodayColor}`}>{c.voteToday}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${c.approvalClass}`}>
                        {c.approval}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.actions === "menu" && (
                          <>
                            <button className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground font-semibold text-[11px]">
                              Menüye Ekle
                            </button>
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border">
                              <Icon icon="solar:eye-bold" width={14} height={14} />
                            </button>
                          </>
                        )}
                        {c.actions === "edit" && (
                          <>
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border">
                              <Icon icon="solar:pen-bold" width={14} height={14} />
                            </button>
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border">
                              <Icon icon="solar:eye-bold" width={14} height={14} />
                            </button>
                          </>
                        )}
                        {c.actions === "disqualify" && (
                          <button className="px-2 py-1 rounded-lg bg-destructive text-primary-foreground font-semibold text-[11px]">
                            Diskalifiye
                          </button>
                        )}
                      </div>
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
