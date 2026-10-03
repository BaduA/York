"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLoading } from "@/components/LoadingBar";
import { hashData } from "@/lib/hash";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  DndContext, closestCenter, type DragEndEvent, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, arrayMove, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BASE, ADMIN_KEY, api } from "../_lib/api";
import { pickItemFields, pickGroupFields, pickSectionFields } from "../_lib/field-pickers";
import type { AItem, AGroup, ASection, MenuChangeEntry, FormHandle, ModalState, CtxMenu, PageHero, PageCta, PageContent } from "../_lib/types";
import { SectionHeader } from "./SectionHeader";
import { SectionForm } from "./SectionForm";
import { SectionEditor } from "./SectionEditor";
import { GroupForm } from "./GroupForm";
import { ItemForm } from "./ItemForm";
import { GroupCard } from "./GroupCard";
import { CardItem, AddLine } from "./ItemRow";
import { DescriptionBox } from "./DescriptionBox";
import { Panel } from "./Panel";
import { CtxMenuPopup } from "./CtxMenuPopup";
import { ReorderItems, ReorderGroups } from "./ReorderPanels";
import { SimpleItemEditor } from "./SimpleItemEditor";
import { DualPriceItemEditor } from "./DualPriceItemEditor";
import { PropertyItemEditor } from "./PropertyItemEditor";
import { WithDescItemEditor } from "./WithDescItemEditor";
import { InlineHeroBadge } from "./InlineHeroBadge";
import { HeroHeadingBox } from "./HeroHeadingBox";
import { InlineHeroDescription } from "./InlineHeroDescription";
import { CardEditor } from "./CardEditor";
import { CtaEditor } from "./CtaEditor";

// Wraps a section in drag-and-drop sortable context for inline reorder mode
function SortableSectionWrap({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      data-sect-reorder
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative select-none cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50 scale-[0.99]" : ""}`}
      {...attributes}
      {...listeners}
    >
      <div className="absolute -inset-2 z-10 rounded-[1.25rem] border-2 border-dashed border-primary/70 bg-primary/30 backdrop-blur-[2px] pointer-events-none flex items-center justify-center">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/95 border border-primary/40 shadow-lg text-primary text-xs font-bold backdrop-blur-sm transition-transform ${isDragging ? "scale-110" : ""}`}>
          <Icon icon="solar:sort-vertical-bold" width={14} />
          Sürükle
        </div>
      </div>
      {children}
    </div>
  );
}

export default function MenuPage() {
  const withLoading = useLoading();
  const [sections, setSections] = useState<ASection[]>([]);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [ctx, setCtx] = useState<CtxMenu>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(true);
    toastTimer.current = setTimeout(() => setToast(false), 2500);
  }, []);
  const formRef = useRef<FormHandle | null>(null);

  const [publishState, setPublishState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [changesList, setChangesList] = useState<MenuChangeEntry[] | null>(null);
  const [showChanges, setShowChanges] = useState(false);
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);

  // Inline section reorder mode
  const [reorderSectionsMode, setReorderSectionsMode] = useState(false);
  const [localSections, setLocalSections] = useState<ASection[]>([]);
  const reorderSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));


  const hasChanges = changesList === null || changesList.length > 0;

  const recomputeMenuDiff = useCallback((
    current: ASection[], snapshot: ASection[],
    currentPc?: PageContent | null, pubPc?: PageContent | null,
  ) => {
    type FlatEntry = { id: string; label: string; context: string; raw: unknown; kind: 'section' | 'group' | 'item' };
    const flatten = (sections: ASection[]): FlatEntry[] => sections.flatMap(s => [
      { id: s.id, label: s.title, context: 'Bölüm', raw: pickSectionFields(s), kind: 'section' as const },
      ...s.groups.flatMap(g => [
        ...(g.title ? [{ id: g.id, label: g.title, context: s.title, raw: pickGroupFields(g), kind: 'group' as const }] : []),
        ...g.items.map(item => ({ id: item.id, label: item.name, context: s.title, raw: pickItemFields(item), kind: 'item' as const })),
      ]),
    ]);
    const curFlat = flatten(current);
    const pubFlat = flatten(snapshot);
    const pubMap = new Map(pubFlat.map(x => [x.id, x]));
    const curMap = new Map(curFlat.map(x => [x.id, x]));
    const result: MenuChangeEntry[] = [];
    for (const [id, cur] of curMap) {
      const pub = pubMap.get(id);
      if (!pub) { result.push({ id, label: cur.label, context: cur.context, status: 'added' }); continue; }
      if (hashData(cur.raw) === hashData(pub.raw)) continue;
      let details: string[] = [];
      if (cur.kind === 'item') {
        const pi = pub.raw as AItem; const ci = cur.raw as AItem;
        if (pi.isVisible !== ci.isVisible) details.push(`Durum: ${pi.isVisible ? 'Görünür' : 'Gizli'} → ${ci.isVisible ? 'Görünür' : 'Gizli'}`);
        if (pi.name !== ci.name) details.push(`İsim: ${pi.name} → ${ci.name}`);
        if (pi.price !== ci.price) details.push(`Fiyat: ${pi.price} → ${ci.price}`);
        if ((pi.priceNote ?? '') !== (ci.priceNote ?? '')) details.push(`İndirim: ${pi.priceNote ?? '—'} → ${ci.priceNote ?? '—'}`);
        if ((pi.price2 ?? '') !== (ci.price2 ?? '')) details.push(`2. Fiyat: ${pi.price2 ?? '—'} → ${ci.price2 ?? '—'}`);
        if ((pi.badge ?? '') !== (ci.badge ?? '')) details.push(`Rozet: ${pi.badge ?? '—'} → ${ci.badge ?? '—'}`);
      } else if (cur.kind === 'group') {
        const pg = pub.raw as AGroup; const cg = cur.raw as AGroup;
        if (pg.isVisible !== cg.isVisible) details.push(`Görünürlük: ${pg.isVisible ? 'Görünür' : 'Gizli'} → ${cg.isVisible ? 'Görünür' : 'Gizli'}`);
        if ((pg.title ?? '') !== (cg.title ?? '')) details.push(`Başlık: ${pg.title ?? '—'} → ${cg.title ?? '—'}`);
        if (pg.borderHighlight !== cg.borderHighlight) details.push(`Kenarlık: ${pg.borderHighlight ? 'Var' : 'Yok'} → ${cg.borderHighlight ? 'Var' : 'Yok'}`);
        if (pg.glowEffect !== cg.glowEffect) details.push(`Parıltı: ${pg.glowEffect ? 'Var' : 'Yok'} → ${cg.glowEffect ? 'Var' : 'Yok'}`);
      } else if (cur.kind === 'section') {
        const ps = pub.raw as ASection; const cs = cur.raw as ASection;
        if (ps.isVisible !== cs.isVisible) details.push(`Görünürlük: ${ps.isVisible ? 'Görünür' : 'Gizli'} → ${cs.isVisible ? 'Görünür' : 'Gizli'}`);
        if (ps.title !== cs.title) details.push(`Başlık: ${ps.title} → ${cs.title}`);
        if ((ps.badge ?? '') !== (cs.badge ?? '')) details.push(`Rozet: ${ps.badge ?? '—'} → ${cs.badge ?? '—'}`);
      }
      result.push({ id, label: cur.label, context: cur.context, status: 'updated', details });
    }
    for (const [id, pub] of pubMap) {
      if (!curMap.has(id)) result.push({ id, label: pub.label, context: pub.context, status: 'removed' });
    }

    if (currentPc && !pubPc) {
      result.push({ id: 'pc-new', label: 'Sayfa İçeriği', context: 'Hero & Kartlar & CTA', status: 'added', details: ['İlk kez snapshot\'a dahil edilecek'] });
    } else if (currentPc && pubPc) {
      const heroRaw = (h: PageHero) => ({ badgeText: h.badgeText, headingMain: h.headingMain, headingHighlight: h.headingHighlight, description: h.description, pill1Icon: h.pill1Icon, pill1Text: h.pill1Text, pill2Icon: h.pill2Icon, pill2Text: h.pill2Text, pill3Icon: h.pill3Icon, pill3Text: h.pill3Text });
      if (hashData(heroRaw(currentPc.hero)) !== hashData(heroRaw(pubPc.hero))) {
        const ph = pubPc.hero; const ch = currentPc.hero;
        const d: string[] = [];
        if (ph.badgeText !== ch.badgeText) d.push(`Rozet: ${ph.badgeText} → ${ch.badgeText}`);
        if (ph.headingMain !== ch.headingMain || ph.headingHighlight !== ch.headingHighlight) d.push(`Başlık güncellendi`);
        if (ph.description !== ch.description) d.push(`Açıklama güncellendi`);
        result.push({ id: 'pc-hero', label: 'Hero', context: 'Sayfa İçeriği', status: 'updated', details: d });
      }
      for (const slot of [1, 2] as const) {
        const cur = currentPc.cards.find(c => c.slot === slot);
        const pub = pubPc.cards.find(c => c.slot === slot);
        if (cur && pub && hashData(cur) !== hashData(pub)) {
          const d: string[] = [];
          if (pub.title !== cur.title) d.push(`Başlık: ${pub.title} → ${cur.title}`);
          if (pub.badgeLabel !== cur.badgeLabel) d.push(`Rozet: ${pub.badgeLabel} → ${cur.badgeLabel}`);
          if (pub.imageUrl !== cur.imageUrl) d.push(`Görsel güncellendi`);
          result.push({ id: `pc-card-${slot}`, label: `Kart ${slot}`, context: 'Sayfa İçeriği', status: 'updated', details: d });
        }
      }
      const ctaRaw = (c: PageCta) => ({ badgeText: c.badgeText, headingMain: c.headingMain, headingHighlight: c.headingHighlight, description: c.description });
      if (hashData(ctaRaw(currentPc.cta)) !== hashData(ctaRaw(pubPc.cta))) {
        const pc = pubPc.cta; const cc = currentPc.cta;
        const d: string[] = [];
        if (pc.headingMain !== cc.headingMain || pc.headingHighlight !== cc.headingHighlight) d.push(`Başlık güncellendi`);
        if (pc.description !== cc.description) d.push(`Açıklama güncellendi`);
        result.push({ id: 'pc-cta', label: 'CTA', context: 'Sayfa İçeriği', status: 'updated', details: d });
      }
    }

    setChangesList(result);
  }, []);

  const handlePublish = async () => {
    setPublishState("loading");
    try {
      await withLoading(async () => {
        const [freshMenuRes, freshPcRes] = await Promise.all([
          fetch(`${BASE}/menu/admin`, { headers: { "x-admin-key": ADMIN_KEY }, cache: "no-store" }),
          fetch(`${BASE}/page-content/menu`, { headers: { "x-admin-key": ADMIN_KEY }, cache: "no-store" }),
        ]);
        const freshData = await freshMenuRes.json();
        const freshPc: PageContent | null = freshPcRes.ok ? await freshPcRes.json() : null;
        const hash = hashData(freshData);
        await fetch(`${BASE}/site-config`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
          body: JSON.stringify({
            menuHash: hash,
            menuSnapshot: JSON.stringify(freshData),
            ...(freshPc ? { pageContentSnapshot: JSON.stringify(freshPc) } : {}),
          }),
        });
        fetch(
          `${process.env.NEXT_PUBLIC_WEB_URL}/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}&tag=menu`,
          { method: "POST" },
        ).catch(() => {});
        pubSnapshotRef.current = freshData as ASection[];
        pubPageContentRef.current = freshPc;
        recomputeMenuDiff(freshData as ASection[], freshData as ASection[], freshPc, freshPc);
      });
      setPublishState("ok");
      setShowChanges(false);
    } catch {
      setPublishState("err");
    }
    setTimeout(() => setPublishState("idle"), 3000);
  };

  const pubSnapshotRef = useRef<ASection[]>([]);
  const pubPageContentRef = useRef<PageContent | null>(null);
  const preEditPageContentRef = useRef<PageContent | null>(null);

  const reload = () => {
    withLoading(async () => {
      const [menuRes, cfgRes, pcRes] = await Promise.all([
        fetch(`${BASE}/menu/admin`, { headers: { "x-admin-key": ADMIN_KEY }, cache: "no-store" }),
        fetch(`${BASE}/site-config`, { cache: "no-store" }),
        fetch(`${BASE}/page-content/menu`, { headers: { "x-admin-key": ADMIN_KEY }, cache: "no-store" }),
      ]);
      const data = await menuRes.json();
      const cfg = cfgRes.ok ? await cfgRes.json() : null;
      const pc: PageContent | null = pcRes.ok ? await pcRes.json() : null;
      if (pc) {
        setPageContent(pc);
        if (!preEditPageContentRef.current) preEditPageContentRef.current = pc;
      }
      if (Array.isArray(data)) {
        setSections(data as ASection[]);
        if (cfg?.menuSnapshot) {
          pubSnapshotRef.current = JSON.parse(cfg.menuSnapshot) as ASection[];
          const pubPc: PageContent | null = cfg.pageContentSnapshot ? JSON.parse(cfg.pageContentSnapshot) : null;
          pubPageContentRef.current = pubPc;
          recomputeMenuDiff(data as ASection[], pubSnapshotRef.current, pc, pubPc);
        } else {
          pubSnapshotRef.current = [];
          pubPageContentRef.current = null;
          setChangesList(null);
        }
        setSnapshotLoaded(true);
      }
    }).catch(() => {});
  };

  const reloadAndMark = () => { reload(); };

  const handleReset = async () => {
    if (!pubSnapshotRef.current.length && !pubPageContentRef.current && !preEditPageContentRef.current) { reload(); return; }
    try {
      await withLoading(async () => {
        const ops: Promise<unknown>[] = [];

        const pubItems = new Map(
          pubSnapshotRef.current.flatMap(s => s.groups.flatMap(g => g.items.map(i => [i.id, i] as [string, AItem])))
        );
        const curItems = new Map(
          (sections as ASection[]).flatMap(s => s.groups.flatMap(g => g.items.map(i => [i.id, i] as [string, AItem])))
        );
        for (const [id, pub] of pubItems) {
          const cur = curItems.get(id);
          if (!cur) continue;
          if (hashData(pickItemFields(cur)) === hashData(pickItemFields(pub))) continue;
          ops.push(api("PATCH", `/menu/items/${id}`, pickItemFields(pub)));
        }
        for (const [id] of curItems) {
          if (!pubItems.has(id)) ops.push(api("DELETE", `/menu/items/${id}`));
        }

        const pubGroups = new Map(
          pubSnapshotRef.current.flatMap(s => s.groups.map(g => [g.id, g] as [string, AGroup]))
        );
        const curGroups = new Map(
          (sections as ASection[]).flatMap(s => s.groups.map(g => [g.id, g] as [string, AGroup]))
        );
        for (const [id, pub] of pubGroups) {
          const cur = curGroups.get(id);
          if (!cur) continue;
          if (hashData(pickGroupFields(cur)) === hashData(pickGroupFields(pub))) continue;
          ops.push(api("PATCH", `/menu/groups/${id}`, pickGroupFields(pub)));
        }

        const pubSections = new Map(pubSnapshotRef.current.map(s => [s.id, s]));
        const curSections = new Map((sections as ASection[]).map(s => [s.id, s]));
        for (const [id, pub] of pubSections) {
          const cur = curSections.get(id);
          if (!cur) continue;
          if (hashData(pickSectionFields(cur)) === hashData(pickSectionFields(pub))) continue;
          ops.push(api("PATCH", `/menu/sections/${id}`, pickSectionFields(pub)));
        }

        const effectivePubPc = pubPageContentRef.current ?? preEditPageContentRef.current;
        if (effectivePubPc && pageContent) {
          const heroRaw = (h: PageHero) => ({ badgeText: h.badgeText, headingMain: h.headingMain, headingHighlight: h.headingHighlight, description: h.description, pill1Icon: h.pill1Icon, pill1Text: h.pill1Text, pill2Icon: h.pill2Icon, pill2Text: h.pill2Text, pill3Icon: h.pill3Icon, pill3Text: h.pill3Text });
          if (hashData(heroRaw(pageContent.hero)) !== hashData(heroRaw(effectivePubPc.hero))) {
            ops.push(api("PATCH", "/page-content/menu/hero", heroRaw(effectivePubPc.hero)));
          }
          for (const slot of [1, 2] as const) {
            const cur = pageContent.cards.find(c => c.slot === slot);
            const pub = effectivePubPc.cards.find(c => c.slot === slot);
            if (cur && pub && hashData(cur) !== hashData(pub)) {
              ops.push(api("PATCH", `/page-content/menu/cards/${slot}`, { badgeLabel: pub.badgeLabel, title: pub.title, description: pub.description, imageUrl: pub.imageUrl }));
            }
          }
          const ctaRaw = (c: PageCta) => ({ badgeText: c.badgeText, headingMain: c.headingMain, headingHighlight: c.headingHighlight, description: c.description });
          if (hashData(ctaRaw(pageContent.cta)) !== hashData(ctaRaw(effectivePubPc.cta))) {
            ops.push(api("PATCH", "/page-content/menu/cta", ctaRaw(effectivePubPc.cta)));
          }
        }

        await Promise.all(ops);
        reload();
      });
    } catch (e) {
      alert(`Sıfırla hatası: ${e instanceof Error ? e.message : e}`);
    }
  };

  useEffect(reload, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ESC + click-outside to exit section reorder mode
  useEffect(() => {
    if (!reorderSectionsMode) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setReorderSectionsMode(false); };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-sect-reorder]")) setReorderSectionsMode(false);
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => document.addEventListener("click", onClick), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.removeEventListener("click", onClick);
    };
  }, [reorderSectionsMode]);

  function enterSectionReorderMode() {
    setLocalSections([...sections].sort((a, b) => a.sortOrder - b.sortOrder));
    setReorderSectionsMode(true);
    setCtx(null);
  }

  async function handleSectionDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const next = arrayMove(localSections, localSections.findIndex(s => s.id === active.id), localSections.findIndex(s => s.id === over.id));
    setLocalSections(next);
    await api("PATCH", "/menu/sections/reorder", { items: next.map((s, i) => ({ id: s.id, sortOrder: i + 1 })) }).catch(() => {});
    reload();
  }

  async function save() {
    if (!modal) return;
    const data = formRef.current?.getData() ?? {};
    setBusy(true);
    try {
      await withLoading(async () => {
        if (modal.type === "add-section") await api("POST", "/menu/sections", data);
        else if (modal.type === "add-group") await api("POST", `/menu/sections/${modal.sectionId}/groups`, { ...data, sortOrder: modal.nextSort });
        else if (modal.type === "edit-group") await api("PATCH", `/menu/groups/${modal.group.id}`, data);
        else if (modal.type === "add-item") await api("POST", `/menu/groups/${modal.groupId}/items`, { ...data, sortOrder: modal.nextSort });
        else if (modal.type === "edit-item") await api("PATCH", `/menu/items/${modal.item.id}`, data);
      });
      reload();
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast(true);
      toastTimer.current = setTimeout(() => setToast(false), 2500);
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  async function del() {
    if (!modal) return;
    let msg = "Silinsin mi?";
    if (modal.type === "edit-item") msg = `"${modal.item.name}" silinsin mi?`;
    else if (modal.type === "edit-group") msg = `"${modal.group.title ?? "grup"}" silinsin mi?`;
    else if (modal.type === "edit-section") msg = `"${modal.section.title}" silinsin mi?`;
    if (!confirm(msg)) return;
    setBusy(true);
    try {
      await withLoading(async () => {
        if (modal.type === "edit-item") await api("DELETE", `/menu/items/${modal.item.id}`);
        else if (modal.type === "edit-group") await api("DELETE", `/menu/groups/${modal.group.id}`);
        else if (modal.type === "edit-section") await api("DELETE", `/menu/sections/${modal.section.id}`);
      });
      setModal(null);
      reload();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  const isEditModal = modal?.type === "edit-item" || modal?.type === "edit-group" || modal?.type === "edit-section";

  async function saveDescriptionBox(groupId: string, html: string) {
    await withLoading(() => api("PATCH", `/menu/groups/${groupId}`, { descriptionText: html })).catch(() => {});
    reload();
  }

  function editItem(item: AItem) { setModal({ type: "edit-item", item }); }
  function editGroup(group: AGroup) { setModal({ type: "edit-group", group }); }
  function editSection(section: ASection) { setModal({ type: "edit-section", section }); }
  function addItem(groupId: string, count: number) { setModal({ type: "add-item", groupId, nextSort: count }); }

  function openItemCtx(e: React.MouseEvent, item: AItem, groupId: string) {
    e.stopPropagation();
    setCtx({ target: "item", item, groupId, x: e.clientX, y: e.clientY });
  }
  function openGroupCtx(e: React.MouseEvent, group: AGroup, sectionId: string, canReorder = true) {
    e.stopPropagation();
    setCtx({ target: "group", group, sectionId, x: e.clientX, y: e.clientY, canReorder });
  }
  function openSectionCtx(e: React.MouseEvent, section: ASection) {
    e.stopPropagation();
    setCtx({ target: "section", section, x: e.clientX, y: e.clientY });
  }
  function handleCtxEdit() {
    if (!ctx) return;
    if (ctx.target === "section") {
      editSection(ctx.section);
    } else if (ctx.target === "item") {
      let effectiveVariant = ctx.item.itemVariant;
      let groupType = "";
      for (const s of sections) {
        const g = s.groups.find(g => g.id === ctx.groupId);
        if (g) { if (!effectiveVariant) effectiveVariant = g.itemVariant; groupType = g.groupType; break; }
      }
      const variant = effectiveVariant ?? "simple";
      if (variant === "simple" || variant === "simple-borderless" || variant === "with-pricenote-strikethrough" || variant === "compact-muted") {
        setModal({ type: "simple-edit-item", item: ctx.item });
      } else if (variant === "with-description" || variant === "mini-card" || groupType === "card-item") {
        setModal({ type: "desc-edit-item", item: ctx.item });
      } else if (variant === "with-pricenote-below") {
        setModal({ type: "dual-price-edit-item", item: ctx.item });
      } else if (variant === "property") {
        setModal({ type: "property-edit-item", item: ctx.item });
      } else {
        editItem(ctx.item);
      }
    } else {
      editGroup(ctx.group);
    }
    setCtx(null);
  }
  function handleCtxReorder() {
    if (!ctx) return;
    if (ctx.target === "section") {
      enterSectionReorderMode();
    } else if (ctx.target === "item") {
      for (const s of sections) {
        const g = s.groups.find(g => g.id === ctx.groupId);
        if (g) { setModal({ type: "reorder-items", group: g }); break; }
      }
      setCtx(null);
    } else {
      setCtx(null);
    }
  }
  function handleCtxDelete() {
    if (!ctx || ctx.target !== "item") return;
    if (!confirm(`"${ctx.item.name}" silinsin mi?`)) return;
    const id = ctx.item.id;
    setCtx(null);
    api("DELETE", `/menu/items/${id}`).then(() => reload()).catch(e => alert(`Hata: ${e}`));
  }
  function handleCtxToggleStock() {
    if (!ctx || ctx.target !== "item") return;
    const { id, isVisible } = ctx.item;
    setCtx(null);
    api("PATCH", `/menu/items/${id}`, { isVisible: !isVisible }).then(() => reload()).catch(e => alert(`Hata: ${e}`));
  }
  function addGroup(sectionId: string, count: number) { setModal({ type: "add-group", sectionId, nextSort: count }); }

  const sectionsToShow = reorderSectionsMode ? localSections : sections;

  const sectionList = sectionsToShow.map(section => {
    const inner = (
      <section
        key={section.id}
        id={section.slug}
        data-sect
        className={`space-y-6 scroll-mt-[120px] ${reorderSectionsMode ? "pointer-events-none" : ""}`}
      >
        <SectionHeader section={section} onCtx={e => openSectionCtx(e, section)} />

        {section.groups
          .filter(g => g.groupType === "description-box")
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(g => (
            <DescriptionBox key={g.id} group={g} onSave={saveDescriptionBox} />
          ))}

        {(() => {
          const nonDesc = section.groups
            .filter(g => g.groupType !== "description-box")
            .sort((a, b) => a.sortOrder - b.sortOrder);
          const gridStyle = { "--menu-grid-cols": section.gridTemplate ?? "repeat(auto-fit, minmax(260px, 1fr))", gridAutoFlow: "row dense" } as React.CSSProperties;

          if (nonDesc.some(g => g.groupType === "card-item")) {
            return (
              <div className="menu-grid grid gap-6" style={gridStyle}>
                {nonDesc.flatMap((g): React.ReactElement[] => [
                  ...g.items.map(item => <CardItem key={item.id} item={item} onCtx={(e, it) => openItemCtx(e, it, g.id)} />),
                  <div key={`add-${g.id}`} onClick={() => addItem(g.id, g.items.length)}
                    className="rounded-xl border-2 border-dashed border-border/30 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-colors flex items-center justify-center min-h-[80px] text-muted-foreground/30 hover:text-primary text-2xl">
                    +
                  </div>,
                ])}
              </div>
            );
          }

          type RenderUnit =
            | { kind: "single"; group: AGroup }
            | { kind: "shared"; cardGroup: string; groups: AGroup[] };

          const seen = new Set<string>();
          const allUnits: RenderUnit[] = [];
          for (const g of nonDesc) {
            if (g.cardGroup) {
              if (seen.has(g.cardGroup)) continue;
              seen.add(g.cardGroup);
              allUnits.push({ kind: "shared", cardGroup: g.cardGroup, groups: nonDesc.filter(x => x.cardGroup === g.cardGroup) });
            } else {
              allUnits.push({ kind: "single", group: g });
            }
          }

          const colMap = new Map<number, { colSpan: number; units: RenderUnit[] }>();
          for (const unit of allUnits) {
            const col = unit.kind === "single" ? unit.group.colStart : unit.groups[0].colStart;
            const span = unit.kind === "single" ? unit.group.colSpan : unit.groups[0].colSpan;
            if (!colMap.has(col)) colMap.set(col, { colSpan: span, units: [] });
            colMap.get(col)!.units.push(unit);
          }

          return (
            <div className="grid gap-6" style={gridStyle}>
              {[...colMap.entries()].sort((a, b) => a[0] - b[0]).map(([colStart, { colSpan, units: colUnits }]) => (
                <div key={colStart} className="flex flex-col gap-6"
                  style={{ gridColumn: `${colStart} / span ${colSpan}` }}>
                  {colUnits.map(unit => {
                    if (unit.kind === "single") {
                      const g = unit.group;
                      return (
                        <GroupCard key={g.id} group={g}
                          onCtxItem={(e, it) => openItemCtx(e, it, g.id)}
                          onCtxGroup={e => openGroupCtx(e, g, section.id, false)}
                          onAddItem={() => addItem(g.id, g.items.length)}
                          onSaved={reload}
                          style={colUnits.length === 1 ? { flex: 1 } : undefined} />
                      );
                    }
                    const canReorder = unit.groups.length > 1;
                    return (
                      <div data-card key={unit.cardGroup}
                        className={`bg-card rounded-xl border border-border p-5 flex flex-col${colUnits.length === 1 ? " flex-1" : ""}`}>
                        {unit.groups.map((g) => (
                          <React.Fragment key={g.id}>
                            <GroupCard group={g} inner
                              onCtxItem={(e, it) => openItemCtx(e, it, g.id)}
                              onCtxGroup={e => openGroupCtx(e, g, section.id, canReorder)}
                              onAddItem={() => addItem(g.id, g.items.length)}
                              onSaved={reload} />
                          </React.Fragment>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}

        <AddLine onClick={() => addGroup(section.id, section.groups.length)} />
      </section>
    );

    if (reorderSectionsMode) {
      return <SortableSectionWrap key={section.id} id={section.id}>{inner}</SortableSectionWrap>;
    }
    return inner;
  });

  const mainContent = (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {sectionList}

      {/* CTA */}
      <div
        onClick={() => pageContent && setModal({ type: "edit-cta" })}
        className={`group/cta relative rounded-2xl bg-gradient-to-r from-secondary via-card to-secondary border border-primary/40 p-8 text-center overflow-hidden shadow-2xl transition-colors ${pageContent ? "hover:border-primary/70 cursor-pointer" : ""}`}
      >
        <button
          onClick={e => { e.stopPropagation(); pageContent && setModal({ type: "edit-cta" }); }}
          disabled={!pageContent}
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/90 border border-border text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/60 backdrop-blur-sm transition-all opacity-0 group-hover/cta:opacity-100 disabled:hidden"
        >
          <Icon icon="solar:pen-bold" width={14} />
          CTA Düzenle
        </button>
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs uppercase font-bold tracking-widest">
            {pageContent?.cta.badgeText ?? "Aylık Kokteyl Yarışması"}
          </span>
          <h2 className="font-font-heading text-3xl sm:text-5xl font-bold uppercase tracking-wider">
            {pageContent?.cta.headingMain ?? "Kendi Kokteylini Yarat,"}{" "}
            <span className="text-primary">{pageContent?.cta.headingHighlight ?? "Menüye İsmini Yazdır"}</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            {pageContent?.cta.description ?? "Her ay en çok oyu alan özel reçete Bilkent York resmi menüsüne girsin!"}
          </p>
        </div>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/20">
                <Icon icon="solar:shield-star-bold" width={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wider">Bilkent York</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30">Admin Panel</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">Menü &amp; Ürün Yönetim Paneli</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://lh3.googleusercontent.com/a/ACg8ocJCxwMUJaUR_K6XCsiAdpE7nvLNJBzBaXmv3EjdUs_F69FMRS4=s96-c" alt="" className="size-8 rounded-lg border border-primary/50 object-cover" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold leading-none">Badu Alp Ustagül</p>
                <p className="text-[10px] text-primary font-mono">Head Executive</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Top nav */}
      <div className="bg-card border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 overflow-x-auto py-2.5 text-xs">
            <Link href="/" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:chart-square-bold" width={16} /> Genel Bakış
            </Link>
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
              <Icon icon="solar:menu-dots-square-bold" width={16} /> Menü
            </Link>
            <Link href="/cocktail-lab" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-hot-bold" width={16} /> Kokteyl Lab
            </Link>
            <Link href="/leaderboard" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-star-bold" width={16} /> Liderlik Tablosu
            </Link>
            <Link href="/orders" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:bill-list-bold" width={16} /> Siparişler
            </Link>
            <Link href="/page-content" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:document-text-bold" width={16} height={16} />Sayfa İçeriği
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-card/80 to-background border-b border-border/60 overflow-hidden py-10 sm:py-14">
        <div className="absolute inset-0 pointer-events-none opacity-15" style={{ backgroundImage: "radial-gradient(#C51F2B 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left space-y-4">
              {pageContent ? (
                <>
                  <InlineHeroBadge
                    value={pageContent.hero.badgeText}
                    onSave={async v => { await api("PATCH", "/page-content/menu/hero", { badgeText: v }); reload(); showToast(); }}
                  />
                  <HeroHeadingBox
                    hero={pageContent.hero}
                    onSave={async html => { await api("PATCH", "/page-content/menu/hero", { headingMain: html, headingHighlight: "" }); reload(); showToast(); }}
                  />
                  <InlineHeroDescription
                    value={pageContent.hero.description}
                    onSave={async v => { await api("PATCH", "/page-content/menu/hero", { description: v }); reload(); showToast(); }}
                  />
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
                    <Icon icon="solar:flame-bold" className="animate-pulse" width={16} />
                    Bilkent&apos;in Asya &amp; Sokak Lezzetleri Buluşma Noktası
                  </div>
                  <h1 className="font-font-heading text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95]">
                    STREET FOOD <span className="text-primary">&amp; CRAFT BAR</span>
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
                    Taze Sushi, Wok Noodle, Bento kutuları, özel burgerler ve gecenin ritmini tutan buz gibi fıçı biralar ile kendi kokteylini tasarlayabileceğin interaktif bar deneyimi.
                  </p>
                </>
              )}
            </div>
            <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              {([1, 2] as const).map(slot => {
                const card = pageContent?.cards.find(c => c.slot === slot);
                const fallback = slot === 1
                  ? { badgeLabel: "Sushi Bar", title: "Taze Sushi & Rolls", description: "Uramaki, Maki, Nigiri & Sashimi spesiyalleri", imageUrl: "https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/AAIvuxGxRFa.jpeg" }
                  : { badgeLabel: "Bar & Promo", title: "Fıçı & 5+1 Shotlar", description: "Bud, Efes, Kovalar, Tekila & Jäger paketleri", imageUrl: "https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/Qryfgpi8vmj.jpeg" };
                const c = card ?? fallback;
                return (
                  <div key={slot}
                    onClick={() => pageContent && setModal({ type: "edit-card", slot })}
                    className={`group group/editcard relative rounded-xl overflow-hidden border border-border bg-card p-4 transition-all shadow-lg ${pageContent ? "hover:border-primary/60 cursor-pointer" : ""}`}>
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover/editcard:opacity-100 transition-opacity pointer-events-none">
                      <div className="size-7 rounded-lg flex items-center justify-center bg-background/90 border border-border text-muted-foreground shadow-sm">
                        <Icon icon="solar:pen-bold" width={12} />
                      </div>
                    </div>
                    <div className="h-36 rounded-lg overflow-hidden relative mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.imageUrl ?? ""} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {c.badgeLabel ? (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-primary-foreground font-font-heading uppercase text-xs tracking-wider">{c.badgeLabel}</div>
                      ) : card ? (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded border border-dashed border-white/40 font-font-heading uppercase text-xs tracking-wider flex items-center gap-1 text-white/50"
                          style={{ background: "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.06) 3px, rgba(255,255,255,0.06) 6px)" }}>
                          <Icon icon="solar:add-circle-bold" width={10} />
                          Ekle
                        </div>
                      ) : null}
                    </div>
                    <h2 className="font-font-heading text-lg font-bold uppercase tracking-wide">{c.title}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Category nav */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3.5">
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.slug}`}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 shrink-0 transition-colors ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"}`}>
                <Icon icon={s.icon.startsWith("http") ? "solar:image-bold" : s.icon} className={i === 0 ? "" : "text-primary"} width={16} />
                {s.title}
              </a>
            ))}
            <button onClick={() => setModal({ type: "add-section" })}
              className="px-3 py-2 rounded-lg border border-dashed border-border/60 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-muted-foreground/50 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors flex items-center gap-1.5 shrink-0">
              <Icon icon="solar:add-circle-bold" width={14} /> Yeni Bölüm
            </button>
          </div>
        </div>
      </div>

      {/* Main content — optionally wrapped in DndContext for reorder mode */}
      {reorderSectionsMode ? (
        <DndContext sensors={reorderSensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={localSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {mainContent}
          </SortableContext>
        </DndContext>
      ) : mainContent}

      <footer className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Bilkent York Operations Portal v2.4 • Yönetici: Badu Alp Ustagül (Head Executive)</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-primary">Menü Dışa Aktar</a>
            <a href="#" className="hover:text-primary">Fiyat Geçmişi</a>
          </div>
        </div>
      </footer>

      {/* Section editor (dedicated modal) */}
      {modal?.type === "edit-section" && (
        <SectionEditor
          section={modal.section}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); reload(); showToast(); }}
        />
      )}

      {/* Simple item editor */}
      {modal?.type === "simple-edit-item" && (
        <SimpleItemEditor
          item={modal.item}
          onClose={() => setModal(null)}
          onSaved={() => { reload(); if (toastTimer.current) clearTimeout(toastTimer.current); setToast(true); toastTimer.current = setTimeout(() => setToast(false), 2500); }}
        />
      )}
      {modal?.type === "desc-edit-item" && (
        <WithDescItemEditor
          item={modal.item}
          onClose={() => setModal(null)}
          onSaved={() => { reload(); if (toastTimer.current) clearTimeout(toastTimer.current); setToast(true); toastTimer.current = setTimeout(() => setToast(false), 2500); }}
        />
      )}
      {modal?.type === "dual-price-edit-item" && (
        <DualPriceItemEditor
          item={modal.item}
          onClose={() => setModal(null)}
          onSaved={() => { reload(); if (toastTimer.current) clearTimeout(toastTimer.current); setToast(true); toastTimer.current = setTimeout(() => setToast(false), 2500); }}
        />
      )}
      {modal?.type === "property-edit-item" && (
        <PropertyItemEditor
          item={modal.item}
          onClose={() => setModal(null)}
          onSaved={() => { reload(); if (toastTimer.current) clearTimeout(toastTimer.current); setToast(true); toastTimer.current = setTimeout(() => setToast(false), 2500); }}
        />
      )}

      {/* Page content editors */}
      {modal?.type === "edit-card" && pageContent && (
        <CardEditor
          card={pageContent.cards.find(c => c.slot === modal.slot) ?? { slot: modal.slot, badgeLabel: "", title: "", description: "", imageUrl: null }}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); reload(); showToast(); }}
        />
      )}
      {modal?.type === "edit-cta" && pageContent && (
        <CtaEditor
          cta={pageContent.cta}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); reload(); showToast(); }}
        />
      )}

      {/* Panel — excludes modals that have their own dedicated UI */}
      {modal && modal.type !== "edit-section" && modal.type !== "simple-edit-item" && modal.type !== "desc-edit-item" && modal.type !== "dual-price-edit-item" && modal.type !== "property-edit-item" && modal.type !== "edit-card" && modal.type !== "edit-cta" && (
        <Panel
          title={
            modal.type === "add-section" ? "Yeni Bölüm"
            : modal.type === "add-group" ? "Yeni Grup"
            : modal.type === "edit-group" ? "Grup Düzenle"
            : modal.type === "add-item" ? "Yeni Ürün"
            : modal.type === "edit-item" ? "Ürün Düzenle"
            : modal.type === "reorder-items" ? `Sıralama — ${modal.group.title ?? "Grup"}`
            : `Sıralama — ${modal.section.title}`
          }
          onClose={() => setModal(null)}
          onSave={modal.type !== "reorder-items" && modal.type !== "reorder-groups" ? save : undefined}
          onDelete={isEditModal ? del : undefined}
          busy={busy}
        >
          {modal.type === "add-section" && <SectionForm ref={formRef} />}
          {modal.type === "add-group" && <GroupForm ref={formRef} />}
          {modal.type === "edit-group" && <GroupForm ref={formRef} init={modal.group} />}
          {modal.type === "add-item" && <ItemForm ref={formRef} />}
          {modal.type === "edit-item" && <ItemForm ref={formRef} init={modal.item} />}
          {modal.type === "reorder-items" && <ReorderItems group={modal.group} onDone={reloadAndMark} />}
          {modal.type === "reorder-groups" && <ReorderGroups section={modal.section} colStart={modal.colStart} cardGroup={modal.cardGroup} onDone={reloadAndMark} />}
        </Panel>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[70] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-green-500/40 shadow-xl shadow-black/40 text-sm font-bold text-green-400"
          >
            <Icon icon="solar:check-circle-bold" width={18} className="shrink-0" />
            Kaydedildi
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context menu */}
      <AnimatePresence>
        {ctx && (
          <CtxMenuPopup
            ctx={ctx}
            onEdit={handleCtxEdit}
            onReorder={handleCtxReorder}
            onDelete={ctx.target === "item" ? handleCtxDelete : undefined}
            onToggleStock={ctx.target === "item" ? handleCtxToggleStock : undefined}
            onClose={() => setCtx(null)}
          />
        )}
      </AnimatePresence>

      {showChanges && (
        <div className="fixed inset-0 z-[49]" onClick={() => setShowChanges(false)} />
      )}

      {/* Fixed publish bar */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {showChanges && (
            <motion.div
              key="changes-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "20rem", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="w-80 bg-card border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-semibold">Yayınlanmamış Değişiklikler</span>
                  <button onClick={() => setShowChanges(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Icon icon="solar:close-circle-bold" width={16} />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {changesList === null ? (
                    <p className="px-4 py-4 text-sm text-muted-foreground">Önceki yayın bulunamadı. İlk yayın olacak.</p>
                  ) : changesList.length === 0 ? (
                    <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                      <Icon icon="solar:check-circle-bold" className="text-green-400 shrink-0" width={16} />
                      Yayınlanan ile aynı içerik.
                    </div>
                  ) : (
                    <div className="p-2 space-y-0.5">
                      {changesList.map((c) => (
                        <div key={c.id} className="px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                              c.status === 'added'   ? 'bg-green-500/20 text-green-400' :
                              c.status === 'updated' ? 'bg-amber-500/20 text-amber-400' :
                                                       'bg-red-500/20 text-red-400'
                            }`}>
                              {c.status === 'added' ? 'Yeni' : c.status === 'updated' ? 'Değişti' : 'Silindi'}
                            </span>
                            <span className="text-sm truncate flex-1">{c.label}</span>
                            <span className="text-xs text-muted-foreground shrink-0">{c.context}</span>
                          </div>
                          {c.details && c.details.length > 0 && (
                            <div className="mt-0.5 pl-3 space-y-0">
                              {c.details.map((d, i) => (
                                <p key={i} className="text-[10px] font-mono text-muted-foreground/70 leading-5">{d}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-2 w-48">
          <button
            onClick={() => setShowChanges(p => !p)}
            disabled={!snapshotLoaded}
            className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border shadow-xl transition-colors disabled:opacity-50 ${
              showChanges
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
            }`}
          >
            <Icon icon={!snapshotLoaded ? "svg-spinners:ring-resize" : "solar:eye-bold"} width={15} />
            Değişiklikleri Gör
          </button>

          <button
            onClick={handleReset}
            disabled={!hasChanges || publishState === "loading"}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground border border-border shadow-xl hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon icon="solar:restart-bold" width={15} height={15} />
            Sıfırla
          </button>

          <button
            onClick={handlePublish}
            disabled={!hasChanges || publishState === "loading"}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold font-heading uppercase tracking-wider shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              publishState === "ok"  ? "bg-emerald-600 text-white shadow-emerald-600/30" :
              publishState === "err" ? "bg-destructive text-white shadow-destructive/30" :
              "bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90"
            }`}
          >
            <Icon icon={publishState === "ok" ? "solar:check-circle-bold" : publishState === "err" ? "solar:close-circle-bold" : "solar:upload-bold"} width={18} height={18} />
            {publishState === "loading" ? "Yayınlanıyor…" : publishState === "ok" ? "Yayınlandı" : publishState === "err" ? "Hata" : "Menüyü Yayınla"}
          </button>
        </div>
      </div>
    </div>
  );
}
