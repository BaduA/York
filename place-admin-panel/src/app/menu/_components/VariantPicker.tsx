export const VARIANT_DEFS: { value: string; label: string; preview: React.ReactNode }[] = [
  {
    value: "",
    label: "Grup Varsayılanı",
    preview: (
      <div className="flex justify-between items-center text-[10px] px-2 py-1 text-muted-foreground">
        <span className="italic">Grubun seçtiği stil</span>
        <span className="font-mono">—</span>
      </div>
    ),
  },
  {
    value: "simple",
    label: "Standart",
    preview: (
      <div className="flex justify-between items-center text-[10px] px-2 py-1">
        <span className="font-medium">Örnek Ürün</span>
        <span className="font-bold text-primary font-mono">150 ₺</span>
      </div>
    ),
  },
  {
    value: "with-description",
    label: "Açıklamalı",
    preview: (
      <div className="text-[10px] px-2 py-1">
        <div className="flex justify-between items-baseline gap-2">
          <span className="font-medium">Salmon Roll</span>
          <span className="font-bold text-primary font-mono shrink-0">185 ₺</span>
        </div>
        <div className="text-muted-foreground text-[9px] mt-0.5">Avokado, salatalık, cream cheese</div>
      </div>
    ),
  },
  {
    value: "with-pricenote-below",
    label: "Grup Fiyatı",
    preview: (
      <div className="text-[10px] px-2 py-1">
        <div className="flex justify-between items-baseline">
          <span className="font-medium">Bud Light</span>
          <span className="font-bold text-primary font-mono">150 ₺</span>
        </div>
        <div className="text-primary text-[9px] font-mono">360 ₺ / 6 kişilik</div>
      </div>
    ),
  },
  {
    value: "with-pricenote-strikethrough",
    label: "İndirimli",
    preview: (
      <div className="flex justify-between items-center text-[10px] px-2 py-1">
        <span className="font-medium">Özel Kokteyl</span>
        <div className="flex items-baseline gap-1">
          <span className="line-through text-muted-foreground font-mono text-[9px]">200₺</span>
          <span className="font-bold text-primary font-mono">150 ₺</span>
        </div>
      </div>
    ),
  },
  {
    value: "compact-muted",
    label: "Küçük",
    preview: (
      <div className="flex justify-between items-center text-[9px] px-2 py-1 text-muted-foreground">
        <span>Kova Paketi (3×)</span>
        <span className="font-bold font-mono text-foreground">420 ₺</span>
      </div>
    ),
  },
  {
    value: "group-title",
    label: "Bölüm Başlığı",
    preview: (
      <div className="text-[10px] px-2 py-1 font-font-heading uppercase tracking-wider font-bold border-b border-border/60 pb-1">
        Nigiri (2 pcs)
      </div>
    ),
  },
  {
    value: "property",
    label: "Özellik",
    preview: (
      <div className="flex gap-1.5 items-center text-[10px] px-2 py-1">
        <span className="text-muted-foreground">Şeker:</span>
        <span className="font-medium">Az şekerli</span>
      </div>
    ),
  },
  {
    value: "mini-card",
    label: "Mini Kart",
    preview: (
      <div className="mx-1.5 my-0.5 p-1.5 rounded-lg bg-background/80 border border-border/60 text-[10px]">
        <div className="font-bold">Spicy Tuna Roll</div>
        <div className="text-primary font-mono font-bold mt-0.5">175 ₺</div>
      </div>
    ),
  },
];

export function VariantPicker({ value, onChange, only }: { value: string; onChange: (v: string) => void; only?: string[] }) {
  const defs = only ? VARIANT_DEFS.filter(d => only.includes(d.value)) : VARIANT_DEFS;
  return (
    <div className="grid grid-cols-2 gap-2">
      {defs.map(def => (
        <button key={def.value} type="button" onClick={() => onChange(def.value)}
          className={`p-2.5 rounded-xl border text-left transition-all ${value === def.value ? "border-primary bg-primary/10 ring-1 ring-primary/40" : "border-border bg-background/40 hover:border-primary/40 hover:bg-primary/5"}`}>
          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${value === def.value ? "text-primary" : "text-muted-foreground"}`}>{def.label}</div>
          <div className="rounded-lg bg-card overflow-hidden min-h-[2rem] flex flex-col justify-center">{def.preview}</div>
        </button>
      ))}
    </div>
  );
}
