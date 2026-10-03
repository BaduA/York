import { Icon } from "@iconify/react";
import type { AItem } from "../_lib/types";

const baseRow = "flex items-center cursor-pointer hover:bg-primary/10 hover:text-primary rounded px-1.5 -mx-1.5 transition-colors";

export function ItemRow({ item, groupVariant, onCtx }: { item: AItem; groupVariant: string; onCtx: (e: React.MouseEvent, i: AItem) => void }) {
  const variant = item.itemVariant ?? groupVariant ?? "simple";

  if (variant === "mini-card") {
    return (
      <div onClick={e => onCtx(e, item)}
        className="p-3.5 rounded-lg bg-background/70 border border-border/60 hover:border-primary hover:bg-primary/10 cursor-pointer transition-colors">
        <div className="flex items-baseline gap-2">
          <h4 className="font-bold text-sm flex-1">{item.name}</h4>
          <div className="flex items-baseline gap-1 shrink-0">
            {item.priceNote && <span className="text-[10px] text-muted-foreground line-through font-mono">{item.priceNote}</span>}
            <span className="font-font-mono font-bold text-primary text-sm">{item.price}</span>
          </div>
        </div>
        {item.description && <p className="text-[11px] text-muted-foreground mt-1">{item.description}</p>}
        {item.badge && <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">{item.badge}</span>}
      </div>
    );
  }

  if (variant === "group-title") {
    return (
      <div onClick={e => onCtx(e, item)}
        className={`${baseRow} col-span-full py-1.5 border-b border-border/60 mt-2`}>
        <span className="font-font-heading text-base uppercase font-bold text-muted-foreground flex-1">{item.name}</span>
        {item.description && <span className="text-xs text-muted-foreground font-font-sans font-normal ml-1.5">({item.description})</span>}
      </div>
    );
  }

  if (variant === "sub-header") {
    return (
      <div onClick={e => onCtx(e, item)}
        className={`${baseRow} col-span-full pt-3 pb-1`}>
        <span className="text-xs uppercase font-bold tracking-wider text-primary">{item.name}</span>
      </div>
    );
  }

  if (variant === "compact-muted") {
    return (
      <div onClick={e => onCtx(e, item)} className={`${baseRow} text-xs text-muted-foreground py-1 gap-2`}>
        <span className="flex-1">{item.name}</span>
        <span className="font-font-mono font-bold text-foreground">{item.price}</span>
      </div>
    );
  }

  if (variant === "property") {
    return (
      <div onClick={e => onCtx(e, item)} className={`${baseRow} py-2 border-b border-border/40 last:border-0 gap-2 text-xs`}>
        <span className="text-muted-foreground font-medium flex-1">{item.name}</span>
        <span className="font-bold">{item.description}</span>
      </div>
    );
  }

  if (variant === "with-pricenote-strikethrough") {
    return (
      <div onClick={e => onCtx(e, item)}
        className={`${baseRow} items-start py-2.5 border-b border-border/20 last:border-0 gap-3`}>
        <div className="flex-1">
          <div className="font-bold text-sm">{item.name}</div>
          {item.priceNote && <div className="text-xs text-muted-foreground line-through font-mono mt-0.5">{item.priceNote}</div>}
        </div>
        <span className="font-font-mono font-bold text-primary text-sm shrink-0 mt-0.5">{item.price}</span>
      </div>
    );
  }

  if (variant === "with-pricenote-below") {
    return (
      <div onClick={e => onCtx(e, item)}
        className={`${baseRow} py-1.5 border-b border-border/20 last:border-0 gap-2`}>
        <div className="flex-1">
          <div className="font-bold text-sm">{item.name}</div>
          {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
        </div>
        <div className="shrink-0 text-right">
          <div className="flex items-baseline justify-end gap-1.5">
            {item.priceNote && <span className="text-[10px] text-muted-foreground line-through font-mono">{item.priceNote}</span>}
            <span className="font-mono font-bold text-primary text-sm">{item.price}</span>
          </div>
          {item.price2 && (
            <div className="flex items-baseline justify-end gap-1.5">
              {item.priceNote2 && <span className="text-[10px] text-muted-foreground line-through font-mono">{item.priceNote2}</span>}
              <span className="font-mono font-bold text-primary text-xs">{item.price2}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div onClick={e => onCtx(e, item)}
      className={`${baseRow} py-1 ${variant !== "simple-borderless" ? "border-b border-border/20 last:border-0" : ""} gap-2`}>
      <div className="flex-1">
        <div className="font-bold text-sm">{item.name}</div>
        {variant === "with-description" && item.description &&
          <div className="text-xs text-muted-foreground">{item.description}</div>}
      </div>
      <div className="flex items-baseline gap-1.5 shrink-0">
        {(variant === "simple" || variant === "simple-borderless") && item.priceNote &&
          <span className="text-xs text-muted-foreground line-through font-mono">{item.priceNote}</span>}
        <div className="font-font-mono font-bold text-primary text-sm">{item.price}</div>
      </div>
    </div>
  );
}

export function CardItem({ item, onCtx }: { item: AItem; onCtx: (e: React.MouseEvent, i: AItem) => void }) {
  return (
    <div onClick={e => onCtx(e, item)}
      className="bg-card rounded-xl border border-border p-4 hover:border-primary hover:bg-primary/10 cursor-pointer transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-font-heading text-lg font-bold flex-1">{item.name}</span>
        <span className="font-font-mono font-bold text-primary shrink-0">{item.price}</span>
      </div>
      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
    </div>
  );
}

export function AddLine({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick(); }}
      className="group/add w-full flex items-center gap-2 py-2 transition-opacity">
      <div className="flex-1 h-px bg-border/40 group-hover/add:bg-primary/50 transition-colors" />
      <span className="text-muted-foreground/40 group-hover/add:text-primary text-sm leading-none transition-colors select-none">+</span>
      <div className="flex-1 h-px bg-border/40 group-hover/add:bg-primary/50 transition-colors" />
    </button>
  );
}

export function AddItemBtn({ onClick }: { onClick: () => void }) {
  return <AddLine onClick={onClick} />;
}
