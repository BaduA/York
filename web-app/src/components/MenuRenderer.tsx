"use client";

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TItem = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  priceNote: string | null;
  itemVariant: string | null;
  sortOrder: number;
};

export type TGroup = {
  id: string;
  title: string | null;
  sortOrder: number;
  items: TItem[];
  groupType: string;
  colStart: number;
  colSpan: number;
  borderHighlight: boolean;
  cornerBadge: string | null;
  glowEffect: boolean;
  titleStyle: string;
  titleNote: string | null;
  titleRightIcon: string | null;
  titleRightLabel: string | null;
  titleRightBadge: string | null;
  titleBorderBottom: boolean;
  subtitle: string | null;
  descriptionText: string | null;
  descriptionBoxPos: string | null;
  itemVariant: string;
  itemLayout: string;
  itemSize: string;
  mergeWithPrev: boolean;
};

export type TSection = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  icon: string;
  badge: string | null;
  sortOrder: number;
  gridTemplate: string | null;
  groups: TGroup[];
};

export type TVocab = { id: string; term: string; translation: string; sortOrder: number };

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ section }: { section: TSection }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-primary pb-3">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
          <iconify-icon icon={section.icon} width="20" height="20" />
        </div>
        <div>
          <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider text-foreground">{section.title}</h2>
          {section.subtitle && <p className="text-xs text-muted-foreground">{section.subtitle}</p>}
        </div>
      </div>
      {section.badge && (
        <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">{section.badge}</span>
      )}
    </div>
  );
}

// ─── Description box ──────────────────────────────────────────────────────────

function DescriptionBox({ vocab }: { vocab: TVocab[] }) {
  if (!vocab.length) return null;
  return (
    <div className="p-4 rounded-xl bg-card border border-border flex flex-wrap items-center gap-4 text-xs">
      <span className="font-font-heading text-primary text-sm font-bold uppercase tracking-wider shrink-0">Sushi Sözlüğü:</span>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {vocab.map((v, i) => (
          <React.Fragment key={v.id}>
            {i > 0 && <span className="text-border">•</span>}
            <span className="text-muted-foreground">
              <strong className="text-foreground">{v.term}:</strong> {v.translation}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Group title block ────────────────────────────────────────────────────────

function GroupTitle({ group }: { group: TGroup }) {
  if (!group.title) return null;
  const isBadge = group.titleStyle === "badge-primary" || group.titleStyle === "badge-secondary";
  const showBorder = group.titleBorderBottom && !isBadge;

  return (
    <div className={`flex items-center justify-between mb-3 ${showBorder ? "border-b border-border/80 pb-2" : ""}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isBadge ? (
          <div
            className={`inline-block px-3 py-1 rounded font-font-heading uppercase text-sm tracking-wider font-bold ${
              group.titleStyle === "badge-primary"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {group.title}
            {group.titleNote && (
              <span className="text-xs opacity-75 font-font-sans font-normal ml-1">({group.titleNote})</span>
            )}
          </div>
        ) : (
          <div className="flex items-baseline gap-1.5 flex-1 min-w-0">
            <h3 className="font-font-heading text-xl uppercase font-bold text-foreground shrink-0">{group.title}</h3>
            {group.titleNote && (
              <span className="text-xs text-muted-foreground font-font-sans font-normal">({group.titleNote})</span>
            )}
            {group.titleRightLabel && (
              <span className="ml-auto text-[10px] uppercase font-bold text-primary">{group.titleRightLabel}</span>
            )}
          </div>
        )}
      </div>

      {group.titleRightBadge && (
        <span className="ml-2 shrink-0 px-2.5 py-1 rounded bg-primary/20 text-primary font-font-mono text-xs font-bold border border-primary/40">
          {group.titleRightBadge}
        </span>
      )}
      {group.titleRightIcon && !group.titleRightBadge && (
        <iconify-icon icon={group.titleRightIcon} className="text-primary shrink-0 ml-2" width="16" height="16" />
      )}
    </div>
  );
}

// ─── Item variant renderers ───────────────────────────────────────────────────

function CompactMutedItem({ item }: { item: TItem }) {
  return (
    <div className="flex justify-between text-xs text-muted-foreground py-1">
      <span>{item.name}</span>
      <span className="font-font-mono font-bold text-foreground">{item.price}</span>
    </div>
  );
}

function SimpleBorderlessItem({ item }: { item: TItem }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{item.name}</span>
      <span className="font-font-mono font-bold text-primary shrink-0 ml-2 text-sm">{item.price}</span>
    </div>
  );
}

function SimpleItem({ item, compact }: { item: TItem; compact?: boolean }) {
  return (
    <div className={`flex justify-between items-center ${compact ? "py-0.5" : "py-1"} border-b border-border/20 last:border-0`}>
      <span className="text-sm">{item.name}</span>
      <span className="font-font-mono font-bold text-primary shrink-0 ml-2 text-sm">{item.price}</span>
    </div>
  );
}

function WithDescItem({ item }: { item: TItem }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
      <div className="flex-1 min-w-0 mr-2">
        <div className="font-bold text-sm text-foreground">{item.name}</div>
        {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
      </div>
      <span className="font-font-mono font-bold text-primary shrink-0 text-sm">{item.price}</span>
    </div>
  );
}

function WithPricenoteBelow({ item }: { item: TItem }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/60 last:border-0">
      <div>
        <div className="font-bold text-sm text-foreground">{item.name}</div>
        {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
      </div>
      <div className="text-right shrink-0 ml-2">
        <div className="font-font-mono font-bold text-foreground">{item.price}</div>
        {item.priceNote && <div className="text-primary text-xs font-font-mono font-bold">{item.priceNote}</div>}
      </div>
    </div>
  );
}

function WithPricenoteStrikethrough({ item }: { item: TItem }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/60 last:border-0">
      <div>
        <div className="font-bold text-sm text-foreground">{item.name}</div>
        {item.priceNote && <div className="text-xs text-muted-foreground line-through opacity-70">{item.priceNote}</div>}
      </div>
      <span className="font-font-mono font-bold text-primary text-base shrink-0 ml-2">{item.price}</span>
    </div>
  );
}

function PropertyItem({ item }: { item: TItem }) {
  return (
    <div className="flex justify-between py-1 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground font-medium text-xs">{item.name}</span>
      <span className="font-bold text-foreground text-xs">{item.description}</span>
    </div>
  );
}

function GroupTitleItem({ item }: { item: TItem }) {
  return (
    <div className="flex items-center justify-between border-b border-border/80 pb-2 pt-4">
      <h3 className="font-font-heading text-xl uppercase font-bold text-foreground">
        {item.name}
        {item.description && (
          <span className="text-xs text-muted-foreground font-font-sans font-normal ml-1.5">({item.description})</span>
        )}
      </h3>
    </div>
  );
}

function SubHeaderItem({ item }: { item: TItem }) {
  return (
    <div className="col-span-full pt-2 pb-1">
      <div className="text-xs uppercase font-bold tracking-wider text-primary">{item.name}</div>
    </div>
  );
}

function MiniCardItem({ item }: { item: TItem }) {
  return (
    <div className="p-3.5 rounded-lg bg-background/70 border border-border/60 hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-baseline">
        <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
        <span className="font-font-mono font-bold text-primary text-sm">{item.price}</span>
      </div>
      {item.description && <p className="text-[11px] text-muted-foreground mt-1">{item.description}</p>}
    </div>
  );
}

// ─── Item list ────────────────────────────────────────────────────────────────

function ItemList({ group }: { group: TGroup }) {
  const isGrid = group.itemLayout === "grid-2col";
  const isCompact = group.itemSize === "compact";

  const renderItem = (item: TItem) => {
    const variant = item.itemVariant ?? group.itemVariant;
    switch (variant) {
      case "group-title":                   return <GroupTitleItem key={item.id} item={item} />;
      case "simple-borderless":             return <SimpleBorderlessItem key={item.id} item={item} />;
      case "compact-muted":                 return <CompactMutedItem key={item.id} item={item} />;
      case "with-description":             return <WithDescItem key={item.id} item={item} />;
      case "with-pricenote-below":         return <WithPricenoteBelow key={item.id} item={item} />;
      case "with-pricenote-strikethrough": return <WithPricenoteStrikethrough key={item.id} item={item} />;
      case "property":                     return <PropertyItem key={item.id} item={item} />;
      case "sub-header":                   return <SubHeaderItem key={item.id} item={item} />;
      case "mini-card":                    return <MiniCardItem key={item.id} item={item} />;
      default:                             return <SimpleItem key={item.id} item={item} compact={isCompact} />;
    }
  };

  const gapClass =
    group.itemVariant === "with-pricenote-below" || group.itemVariant === "with-pricenote-strikethrough"
      ? "space-y-3"
      : group.itemVariant === "property"
      ? "space-y-2.5"
      : "space-y-2";

  if (isGrid) {
    return <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">{group.items.map(renderItem)}</div>;
  }
  return <div className={`${gapClass} text-sm`}>{group.items.map(renderItem)}</div>;
}

// ─── Card group ───────────────────────────────────────────────────────────────

function CardGroup({ group, style }: { group: TGroup; style?: React.CSSProperties }) {
  const isBadge = !!group.title && (group.titleStyle === "badge-primary" || group.titleStyle === "badge-secondary");
  const hasExtra = !!(group.subtitle || group.descriptionText);

  return (
    <div
      style={style}
      className={`bg-card rounded-xl border p-5 relative overflow-hidden flex flex-col ${
        group.borderHighlight ? "border-primary/50 shadow-lg" : "border-border"
      }`}
    >
      {group.glowEffect && (
        <div className="absolute -right-6 -bottom-6 size-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      )}
      {group.cornerBadge && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl">
          {group.cornerBadge}
        </div>
      )}
      <GroupTitle group={group} />
      {group.subtitle && <p className="text-xs text-muted-foreground -mt-1 mb-3">{group.subtitle}</p>}
      {group.descriptionText && <p className="text-xs text-muted-foreground mb-3">{group.descriptionText}</p>}
      <div className={isBadge && !hasExtra ? "mt-2" : undefined}>
        <ItemList group={group} />
      </div>
    </div>
  );
}

// ─── Card-item block ──────────────────────────────────────────────────────────

function CardItemBlock({ item }: { item: TItem }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="font-font-heading text-lg font-bold text-foreground">{item.name}</span>
        <span className="font-font-mono font-bold text-primary">{item.price}</span>
      </div>
      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
    </div>
  );
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function SectionRenderer({ section, vocab }: { section: TSection; vocab: TVocab[] }) {
  const descTop    = section.groups.filter((g) => g.groupType === "description-box" && g.descriptionBoxPos === "top");
  const descBottom = section.groups.filter((g) => g.groupType === "description-box" && g.descriptionBoxPos === "bottom");
  const cardGroups = section.groups.filter((g) => g.groupType === "card");
  const cardItemGroups = section.groups.filter((g) => g.groupType === "card-item");

  const colMap = new Map<number, TGroup[]>();
  for (const g of cardGroups) {
    const arr = colMap.get(g.colStart) ?? [];
    arr.push(g);
    colMap.set(g.colStart, arr);
  }

  return (
    <section id={section.slug} className="space-y-6 scroll-mt-36">
      <SectionHeader section={section} />

      {descTop.map((g) => <DescriptionBox key={g.id} vocab={vocab} />)}

      {(cardGroups.length > 0 || cardItemGroups.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: section.gridTemplate ?? "1fr", gap: "24px" }}>
          {cardItemGroups.flatMap((g) => g.items.map((item) => <CardItemBlock key={item.id} item={item} />))}

          {Array.from(colMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([colStart, groups]) => {
              const sorted = [...groups].sort((a, b) => a.sortOrder - b.sortOrder);
              const maxSpan = Math.max(...sorted.map((g) => g.colSpan));
              const colStyle: React.CSSProperties = { gridColumn: `${colStart} / span ${maxSpan}` };

              if (sorted.length === 1) {
                return <CardGroup key={sorted[0].id} group={sorted[0]} style={colStyle} />;
              }
              return (
                <div key={colStart} style={{ ...colStyle, display: "flex", flexDirection: "column", gap: "24px" }}>
                  {sorted.map((g) => <CardGroup key={g.id} group={g} />)}
                </div>
              );
            })}
        </div>
      )}

      {descBottom.map((g) => <DescriptionBox key={g.id} vocab={vocab} />)}
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function MenuRenderer({ sections, vocab }: { sections: TSection[]; vocab: TVocab[] }) {
  return (
    <div className="space-y-16">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} vocab={vocab} />
      ))}
    </div>
  );
}
