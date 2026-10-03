import { Icon } from "@iconify/react";
import { InlineGroupTitle } from "./InlineGroupTitle";
import { ItemRow, AddItemBtn } from "./ItemRow";
import { DescriptionBox } from "./DescriptionBox";
import type { AGroup } from "../_lib/types";

export function GroupCard({ group, onCtxItem, onCtxGroup, onAddItem, onSaved, inner = false, style }: {
  group: AGroup;
  onCtxItem: (e: React.MouseEvent, i: import("../_lib/types").AItem) => void;
  onCtxGroup: (e: React.MouseEvent) => void;
  onAddItem: () => void;
  onSaved: () => void;
  inner?: boolean;
  style?: React.CSSProperties;
}) {
  const isMiniGrid = group.itemLayout === "grid-2col" && group.itemVariant === "mini-card";
  const is2col = group.itemLayout === "grid-2col" && !isMiniGrid;
  const hasRightEl = group.titleRightIcon || group.titleRightBadge || group.titleRightLabel;
  const isBadgeTitle = group.titleStyle === "badge-primary" || group.titleStyle === "badge-secondary";
  const badgeCls = group.titleStyle === "badge-primary"
    ? "inline-block px-3 py-1 rounded bg-primary text-primary-foreground font-font-heading uppercase text-sm tracking-wider font-bold"
    : "inline-block px-3 py-1 rounded bg-secondary text-secondary-foreground font-font-heading uppercase text-sm tracking-wider font-bold";

  const body = (
    <>
      {group.title && (
        <div className={isBadgeTitle ? "mb-3" : `${group.titleBorderBottom ? "border-b border-border/80 pb-2" : ""} mb-3`}>
          {isBadgeTitle ? (
            <InlineGroupTitle group={group} onSaved={onSaved} className={badgeCls} onOverrideClick={onCtxGroup} />
          ) : (
            <div className="flex items-center gap-1.5">
              <InlineGroupTitle group={group} onSaved={onSaved} className="font-font-heading text-xl uppercase font-bold" onOverrideClick={onCtxGroup} />
              {group.titleNote && <span className="text-xs text-muted-foreground font-font-sans font-normal">({group.titleNote})</span>}
              {hasRightEl && (
                <div className="ml-auto flex items-center gap-2">
                  {group.titleRightIcon && <Icon icon={group.titleRightIcon} className="text-primary" width={16} />}
                  {group.titleRightBadge && <span className="px-2.5 py-1 rounded bg-primary/20 text-primary font-font-mono text-xs font-bold border border-primary/40">{group.titleRightBadge}</span>}
                  {group.titleRightLabel && <span className="text-[10px] uppercase font-bold text-primary">{group.titleRightLabel}</span>}
                </div>
              )}
            </div>
          )}
          {group.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{group.subtitle}</p>}
        </div>
      )}
      {group.descriptionText && group.groupType !== "description-box" && (
        <p className="text-xs text-muted-foreground mb-3">{group.descriptionText}</p>
      )}
      <div className={
        isMiniGrid ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
        : is2col ? "grid grid-cols-2 gap-x-4 gap-y-1 text-sm"
        : "space-y-1"
      }>
        {group.items.map(item => (
          <ItemRow key={item.id} item={item} groupVariant={group.itemVariant} onCtx={onCtxItem} />
        ))}
      </div>
      <AddItemBtn onClick={onAddItem} />
    </>
  );

  if (inner) {
    return (
      <div onClick={e => onCtxGroup(e)} className="cursor-pointer flex flex-col">
        {body}
      </div>
    );
  }

  const borderClass = group.borderHighlight ? "border-primary/50 shadow-lg" : "border-border";
  return (
    <div data-card onClick={e => onCtxGroup(e)} style={style}
      className={`group/card bg-card rounded-xl border p-5 transition-colors relative overflow-hidden flex flex-col cursor-pointer ${borderClass}`}>
      {group.cornerBadge && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl">
          {group.cornerBadge}
        </div>
      )}
      {group.glowEffect && (
        <div className="absolute -right-6 -bottom-6 size-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      )}
      <div className={`absolute z-10 size-7 rounded-lg flex items-center justify-center opacity-0 group-hover/card:opacity-100 bg-background/80 border border-border/60 text-muted-foreground transition-all pointer-events-none ${group.cornerBadge ? "top-10 right-3" : "top-3 right-3"}`}>
        <Icon icon="solar:menu-dots-bold" width={14} />
      </div>
      {body}
    </div>
  );
}
