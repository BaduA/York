"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useState, useMemo } from "react";

type OrderStatus = "order" | "done" | "cancelled";

type Ingredient = {
  label: string;
  value: string;
  ml?: string;
  highlight?: boolean;
};

type Order = {
  id: string;
  table: string;
  orderNum: string;
  guest: string;
  cocktailName: string;
  glass: string;
  status: OrderStatus;
  timer?: string;
  price: string;
  ingredients: Ingredient[];
  cancelNote?: string;
};

const ORDERS: Order[] = [
  {
    id: "2041",
    table: "MASA 08",
    orderNum: "#2041",
    guest: "Badu Alp Ustagül",
    cocktailName: "Bilkent Midnight Fire",
    glass: "Old Fashioned",
    status: "order",
    timer: "03:45",
    price: "425 ₺",
    ingredients: [
      { label: "1. Baz:", value: "Bulleit Rye", ml: "50 ml" },
      { label: "2. Mikser:", value: "Fever-Tree Tonik", ml: "100 ml" },
      { label: "3. Şurup:", value: "Hibiscus Cordial", ml: "25 ml" },
      { label: "4. Buz:", value: "Elmas Kesim Kristal Blok" },
      { label: "5. Garnitür:", value: "🔥 Tütsülenmiş Biberiye", highlight: true },
    ],
  },
  {
    id: "2040",
    table: "MASA 03",
    orderNum: "#2040",
    guest: "Zeynep Kaya",
    cocktailName: "Tokyo Botanical Fizz",
    glass: "Highball Glass",
    status: "order",
    timer: "01:20",
    price: "385 ₺",
    ingredients: [
      { label: "1. Baz:", value: "Roku Gin", ml: "50 ml" },
      { label: "2. Mikser:", value: "Pink Grapefruit Soda", ml: "100 ml" },
      { label: "3. Şurup:", value: "Lavanta & Vanilya", ml: "15 ml" },
      { label: "4. Buz:", value: "Kırık Frappé Buz" },
      { label: "5. Garnitür:", value: "Dehidre Kan Portakalı" },
    ],
  },
  {
    id: "2038",
    table: "MASA 11",
    orderNum: "#2038",
    guest: "Ali Yılmaz",
    cocktailName: "Crimson Sour",
    glass: "Coupe",
    status: "order",
    timer: "00:50",
    price: "350 ₺",
    ingredients: [
      { label: "1. Baz:", value: "Woodford Reserve", ml: "45 ml" },
      { label: "2. Mikser:", value: "Limon & Grenadine", ml: "60 ml" },
      { label: "3. Şurup:", value: "Kırmızı Meyveler", ml: "20 ml" },
      { label: "4. Buz:", value: "Elmas Kristal Blok" },
      { label: "5. Garnitür:", value: "Kiraz & Portakal Kabuğu" },
    ],
  },
  {
    id: "2037",
    table: "MASA 05",
    orderNum: "#2037",
    guest: "Mert Demir",
    cocktailName: "Velvet Espresso Martini",
    glass: "Coupe Kadeh",
    status: "done",
    price: "390 ₺",
    ingredients: [
      { label: "1. Baz:", value: "Grey Goose Vodka", ml: "50 ml" },
      { label: "2. Karışım:", value: "Kahlúa + Cold Brew", ml: "60 ml" },
      { label: "3. Garnitür:", value: "3 Adet Kavrulmuş Kahve Çekirdeği" },
    ],
  },
  {
    id: "2036",
    table: "MASA 01",
    orderNum: "#2036",
    guest: "Ayşe Demir",
    cocktailName: "Sakura Sling",
    glass: "Highball Glass",
    status: "done",
    price: "410 ₺",
    ingredients: [
      { label: "1. Baz:", value: "Tanqueray Gin", ml: "50 ml" },
      { label: "2. Mikser:", value: "Vişne + Limon Suyu", ml: "60 ml" },
      { label: "3. Garnitür:", value: "Kiraz Çiçeği & Limon" },
    ],
  },
  {
    id: "2039",
    table: "BAR TABURE 02",
    orderNum: "#2039",
    guest: "Can Demir",
    cocktailName: "Smoky Jalisco Mule",
    glass: "Copper Mug",
    status: "cancelled",
    price: "370 ₺",
    cancelNote: "Misafir vazgeçti",
    ingredients: [
      { label: "1. Baz:", value: "Don Julio Blanco", ml: "60 ml" },
      { label: "2. Mikser:", value: "Ginger Beer + Lime" },
    ],
  },
];

type FilterTab = "all" | OrderStatus;

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  const markDone = (id: string) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "done" as OrderStatus, timer: undefined } : o)));

  const markCancelled = (id: string) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" as OrderStatus, timer: undefined } : o)));

  const markOrder = (id: string) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "order" as OrderStatus } : o)));

  const counts = useMemo(() => ({
    order: orders.filter((o) => o.status === "order").length,
    done: orders.filter((o) => o.status === "done").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }), [orders]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (activeTab !== "all" && o.status !== activeTab) return false;
      if (!q) return true;
      return o.table.toLowerCase().includes(q) || o.orderNum.includes(q) || o.guest.toLowerCase().includes(q) || o.cocktailName.toLowerCase().includes(q);
    });
  }, [orders, activeTab, search]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-white pb-12">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-card border border-border text-foreground flex items-center justify-center shadow-sm">
              <Icon icon="solar:cup-paper-bold" width={22} height={22} className="text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-base sm:text-lg tracking-wider uppercase text-foreground">Bilkent York</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border">KDS / Bar Panel</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">Barmen &amp; Garson Sipariş İstasyonu</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border font-mono text-xs">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 font-bold border border-rose-800/40">
                <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                {counts.order} ORDER
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 font-bold border border-emerald-800/40">
                <span className="size-2 rounded-full bg-emerald-500" />
                {counts.done} DONE
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground font-bold border border-border">
                <span className="size-2 rounded-full bg-muted-foreground" />
                {counts.cancelled} CANCELLED
              </span>
            </div>
            <button
              onClick={() => setOrders(ORDERS)}
              className="px-3.5 py-2 rounded-xl bg-card hover:bg-secondary text-foreground border border-border font-mono text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Icon icon="solar:restart-bold" width={14} height={14} className="text-rose-400" />
              <span className="hidden md:inline">Yenile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-card border-b border-border/80 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 overflow-x-auto py-2.5 text-xs">
            <Link href="/" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:chart-square-bold" width={16} height={16} />Genel Bakış
            </Link>
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:menu-dots-square-bold" width={16} height={16} />Menü
            </Link>
            <Link href="/cocktail-lab" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-hot-bold" width={16} height={16} />Kokteyl Lab
            </Link>
            <Link href="/leaderboard" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-star-bold" width={16} height={16} />Liderlik Tablosu
            </Link>
            <Link href="/orders" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
              <Icon icon="solar:bill-list-bold" width={16} height={16} />Siparişler
            </Link>
          </nav>
        </div>
      </div>

      {/* Filter bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="grid grid-cols-4 sm:flex items-center gap-2 bg-card p-1.5 rounded-2xl border border-border w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${activeTab === "all" ? "bg-secondary text-foreground border border-border shadow-sm" : "text-muted-foreground border border-transparent hover:bg-secondary hover:border-border"}`}
            >
              <span>Tümü</span>
              <span className={`px-1.5 rounded text-[10px] font-bold ${activeTab === "all" ? "bg-muted text-foreground" : "bg-secondary text-muted-foreground"}`}>{orders.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("order")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${activeTab === "order" ? "bg-rose-950/80 text-rose-200 border border-rose-800/60 shadow-sm" : "text-muted-foreground hover:text-rose-300 border border-transparent hover:border-rose-900/30"}`}
            >
              <span className={`size-2 rounded-full bg-rose-500 ${activeTab === "order" ? "animate-pulse" : ""}`} />
              <span>ORDER</span>
              <span className={`px-1.5 rounded text-[10px] font-bold ${activeTab === "order" ? "bg-black/40 text-rose-300" : "bg-secondary text-muted-foreground"}`}>{counts.order}</span>
            </button>
            <button
              onClick={() => setActiveTab("done")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${activeTab === "done" ? "bg-emerald-950/60 text-emerald-200 border border-emerald-800/50 shadow-sm" : "text-emerald-400 border border-transparent hover:border-emerald-800/40 hover:bg-emerald-950/30"}`}
            >
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>DONE</span>
              <span className={`px-1.5 rounded text-[10px] font-bold ${activeTab === "done" ? "bg-black/30 text-emerald-300" : "bg-secondary text-muted-foreground"}`}>{counts.done}</span>
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all ${activeTab === "cancelled" ? "bg-secondary text-foreground border border-border shadow-sm" : "text-muted-foreground border border-transparent hover:bg-secondary hover:border-border"}`}
            >
              <span className="size-2 rounded-full bg-muted-foreground" />
              <span>CANCELLED</span>
              <span className="px-1.5 rounded bg-secondary text-muted-foreground text-[10px] font-bold">{counts.cancelled}</span>
            </button>
          </div>
          <div className="relative sm:w-64">
            <Icon icon="solar:magnifer-linear" width={14} height={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Masa veya Kokteyl Ara..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-rose-500 font-mono transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex-1 w-full">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <Icon icon="solar:bill-list-bold" width={48} height={48} className="opacity-20" />
            <p className="font-mono text-sm">Sipariş bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((order) => (
              <OrderCard key={order.id} order={order} onDone={markDone} onCancel={markCancelled} onRevert={markOrder} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function OrderCard({ order, onDone, onCancel, onRevert }: {
  order: Order;
  onDone: (id: string) => void;
  onCancel: (id: string) => void;
  onRevert: (id: string) => void;
}) {
  const isOrder = order.status === "order";
  const isDone = order.status === "done";
  const isCancelled = order.status === "cancelled";

  if (isOrder) {
    return (
      <div className="bg-card rounded-2xl border border-rose-900/60 shadow-lg shadow-black/40 overflow-hidden flex flex-col justify-between transition-all">
        <div className="bg-rose-950/30 border-b border-rose-900/40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-heading font-black text-xl text-rose-100">{order.table}</span>
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-black/40 border border-rose-900/50 text-rose-300">{order.orderNum}</span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-rose-900/60 border border-rose-700/60 text-rose-200 font-mono font-bold text-xs flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-rose-400 animate-pulse" />
            ORDER ({order.timer})
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-heading font-black text-lg text-foreground leading-tight">&ldquo;{order.cocktailName}&rdquo;</h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {order.guest} · <span className="text-foreground font-semibold">{order.glass}</span>
              </p>
            </div>
            <span className="font-mono font-bold text-xs text-rose-300 bg-rose-950/50 border border-rose-900/50 px-2 py-1 rounded-lg shrink-0">{order.price}</span>
          </div>

          <div className="bg-secondary/40 rounded-xl p-3 border border-border space-y-2 text-xs font-mono">
            {order.ingredients.map((ing, i) => {
              const isLast = i === order.ingredients.length - 1;
              if (ing.highlight) {
                return (
                  <div key={i} className="flex items-center justify-between pt-1 border-t border-border/60">
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <Icon icon="solar:flame-bold" width={12} height={12} />
                      {ing.label}
                    </span>
                    <span className="font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">{ing.value}</span>
                  </div>
                );
              }
              return (
                <div key={i} className={`flex items-center justify-between ${isLast && !order.ingredients.some(x => x.highlight) ? "pt-1 border-t border-border/60" : ""}`}>
                  <span className="text-muted-foreground">{ing.label}</span>
                  <span className="font-bold text-foreground">
                    {ing.value}{ing.ml && <span className="text-muted-foreground"> ({ing.ml})</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-secondary/20 border-t border-border flex items-center gap-2">
          <button
            onClick={() => onDone(order.id)}
            className="flex-1 py-3 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-rose-950 transition-all"
          >
            <Icon icon="solar:check-circle-bold" width={16} height={16} />
            HAZIRLA &amp; TAMAMLA (DONE)
          </button>
          <button
            onClick={() => onCancel(order.id)}
            className="px-3.5 py-3 rounded-xl bg-secondary hover:bg-rose-950/40 text-muted-foreground hover:text-rose-300 border border-border transition-colors font-mono font-bold text-xs"
            title="Siparişi İptal Et (Cancelled)"
          >
            <Icon icon="solar:close-circle-bold" width={16} height={16} />
          </button>
        </div>
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="bg-card rounded-2xl border border-emerald-900/60 shadow-md shadow-black/30 overflow-hidden flex flex-col justify-between transition-all">
        <div className="bg-emerald-950/30 border-b border-emerald-900/40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-heading font-black text-xl text-emerald-300">{order.table}</span>
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-black/40 border border-emerald-900/50 text-emerald-400">{order.orderNum}</span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-emerald-200 font-mono font-bold text-xs flex items-center gap-1.5">
            <Icon icon="solar:check-circle-bold" width={12} height={12} className="text-emerald-400" />
            DONE
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-lg text-foreground leading-tight">&ldquo;{order.cocktailName}&rdquo;</h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {order.guest} · <span className="text-foreground font-semibold">{order.glass}</span>
              </p>
            </div>
            <span className="font-mono font-bold text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-900/50 px-2 py-1 rounded-lg shrink-0">{order.price}</span>
          </div>

          <div className="bg-secondary/30 rounded-xl p-3 border border-border space-y-1.5 text-xs font-mono text-muted-foreground">
            {order.ingredients.map((ing, i) => (
              <p key={i}>• {ing.value}{ing.ml ? ` (${ing.ml})` : ""}</p>
            ))}
          </div>
        </div>

        <div className="p-3 bg-emerald-950/20 border-t border-emerald-900/30 flex items-center justify-between">
          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
            <Icon icon="solar:verified-check-bold" width={14} height={14} />
            Masaya Teslim Edildi
          </span>
          <button
            onClick={() => onRevert(order.id)}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-mono font-semibold transition-colors"
          >
            Geri Al
          </button>
        </div>
      </div>
    );
  }

  // cancelled
  return (
    <div className="bg-card/40 rounded-2xl border border-border overflow-hidden flex flex-col justify-between opacity-60 hover:opacity-100 transition-all">
      <div className="bg-secondary/60 border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-heading font-black text-xl text-muted-foreground line-through">{order.table}</span>
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-muted-foreground">{order.orderNum}</span>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground font-mono font-bold text-xs flex items-center gap-1.5 border border-border">
          <Icon icon="solar:close-circle-bold" width={12} height={12} />
          CANCELLED
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h2 className="font-heading font-bold text-base text-muted-foreground line-through leading-tight">&ldquo;{order.cocktailName}&rdquo;</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {order.guest}{order.cancelNote ? ` · ${order.cancelNote}` : ""}
          </p>
        </div>
        <div className="bg-secondary/20 rounded-xl p-3 border border-border text-xs font-mono text-muted-foreground">
          <p>{order.ingredients.map(i => `${i.value}${i.ml ? ` (${i.ml})` : ""}`).join(" + ")}</p>
        </div>
      </div>

      <div className="p-3 bg-secondary/10 border-t border-border flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">İptal Edildi</span>
        <button
          onClick={() => onRevert(order.id)}
          className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground text-[11px] font-mono font-semibold transition-colors"
        >
          Yeniden Aç
        </button>
      </div>
    </div>
  );
}
