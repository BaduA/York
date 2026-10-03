import { useState } from "react";
import { Icon } from "@iconify/react";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api } from "../_lib/api";
import type { AGroup, ASection } from "../_lib/types";

function SortableReorderRow({ id, saving, children }: { id: string; saving: boolean; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1, zIndex: isDragging ? 10 : undefined };
  return (
    <div ref={setNodeRef} style={style}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background/60 border transition-colors ${isDragging ? "border-primary/50 shadow-lg" : "border-border/50"} ${saving ? "pointer-events-none opacity-60" : ""}`}>
      <button {...attributes} {...listeners} onClick={e => e.stopPropagation()}
        className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none shrink-0 transition-colors">
        <Icon icon="solar:hamburger-menu-bold" width={13} />
      </button>
      {children}
    </div>
  );
}

export function ReorderItems({ group, onDone }: { group: AGroup; onDone: () => void }) {
  const [items, setItems] = useState(() => [...group.items].sort((a, b) => a.sortOrder - b.sortOrder));
  const [saving, setSaving] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const next = arrayMove(items, items.findIndex(i => i.id === active.id), items.findIndex(i => i.id === over.id));
    setItems(next);
    setSaving(true);
    await api("PATCH", "/menu/items/reorder", { items: next.map((it, i) => ({ id: it.id, sortOrder: i + 1 })) }).catch(() => {});
    setSaving(false);
    onDone();
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1.5">
          {items.map(item => (
            <SortableReorderRow key={item.id} id={item.id} saving={saving}>
              <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
              {item.price && <span className="text-xs font-mono text-primary shrink-0">{item.price}</span>}
            </SortableReorderRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function ReorderGroups({ section, colStart, cardGroup, onDone }: { section: ASection; colStart: number; cardGroup: string | null; onDone: () => void }) {
  const [groups, setGroups] = useState(() =>
    [...section.groups]
      .filter(g => {
        if (g.groupType === "description-box" || g.colStart !== colStart) return false;
        return cardGroup !== null ? g.cardGroup === cardGroup : g.cardGroup === null;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [saving, setSaving] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const next = arrayMove(groups, groups.findIndex(g => g.id === active.id), groups.findIndex(g => g.id === over.id));
    setGroups(next);
    setSaving(true);
    await api("PATCH", "/menu/groups/reorder", { items: next.map((g, i) => ({ id: g.id, sortOrder: i + 1 })) }).catch(() => {});
    setSaving(false);
    onDone();
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={groups.map(g => g.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1.5">
          {groups.map(group => (
            <SortableReorderRow key={group.id} id={group.id} saving={saving}>
              <span className="flex-1 text-sm font-medium truncate">{group.title ?? "—"}</span>
            </SortableReorderRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function ReorderSections({ sections, onDone }: { sections: ASection[]; onDone: () => void }) {
  const [items, setItems] = useState(() => [...sections].sort((a, b) => a.sortOrder - b.sortOrder));
  const [saving, setSaving] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const next = arrayMove(items, items.findIndex(s => s.id === active.id), items.findIndex(s => s.id === over.id));
    setItems(next);
    setSaving(true);
    await api("PATCH", "/menu/sections/reorder", { items: next.map((s, i) => ({ id: s.id, sortOrder: i + 1 })) }).catch(() => {});
    setSaving(false);
    onDone();
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(s => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1.5">
          {items.map(s => (
            <SortableReorderRow key={s.id} id={s.id} saving={saving}>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon icon={s.icon} width={14} className="text-primary shrink-0" />
                <span className="text-sm font-medium truncate">{s.title}</span>
              </div>
            </SortableReorderRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
