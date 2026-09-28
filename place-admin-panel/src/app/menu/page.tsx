"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type AItem = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  priceNote: string | null;
  badge: string | null;
  itemVariant: string | null;
  sortOrder: number;
  isVisible: boolean;
};

type AGroup = {
  id: string;
  title: string | null;
  subtitle: string | null;
  descriptionText: string | null;
  cornerBadge: string | null;
  titleNote: string | null;
  titleRightBadge: string | null;
  borderHighlight: boolean;
  sortOrder: number;
  isVisible: boolean;
  groupType: string;
  colStart: number;
  colSpan: number;
  glowEffect: boolean;
  titleStyle: string;
  titleRightIcon: string | null;
  titleRightLabel: string | null;
  titleBorderBottom: boolean;
  itemVariant: string;
  itemLayout: string;
  itemSize: string;
  items: AItem[];
};

type ASection = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  icon: string;
  badge: string | null;
  sortOrder: number;
  isVisible: boolean;
  gridTemplate: string | null;
  groups: AGroup[];
};

type AVocab = { id: string; term: string; translation: string; sortOrder: number };

type FormHandle = { getData: () => Record<string, unknown> };

type ModalState =
  | null
  | { type: "add-section" }
  | { type: "edit-section"; section: ASection }
  | { type: "add-group"; sectionId: string; nextSort: number }
  | { type: "edit-group"; group: AGroup }
  | { type: "add-item"; groupId: string; nextSort: number }
  | { type: "edit-item"; item: AItem }
  | { type: "add-vocab"; nextSort: number }
  | { type: "edit-vocab"; vocab: AVocab };

// ─── API ──────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

async function api(method: string, path: string, body?: unknown): Promise<unknown> {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(`${r.status}: ${await r.text()}`);
  if (r.status === 204) return null;
  return r.json();
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEM_VARIANTS = [
  "simple", "simple-borderless", "compact-muted", "group-title",
  "with-description", "with-pricenote-below", "with-pricenote-strikethrough",
  "property", "sub-header", "mini-card",
];
const GROUP_TYPES = ["card", "card-item", "description-box"];
const TITLE_STYLES = ["plain", "badge-primary", "badge-secondary"];
const ITEM_LAYOUTS = ["rows", "grid-2col"];
const ITEM_SIZES = ["normal", "compact"];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

function sec(ss: ASection[], slug: string) { return ss.find(s => s.slug === slug); }
function grp(s: ASection | undefined, title: string) { return s?.groups.find(g => g.title === title); }
function itms(g: AGroup | undefined): AItem[] { return g?.items ?? []; }

// ─── Form primitives ──────────────────────────────────────────────────────────

const ic = "w-full rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
function FT({ v, s, p }: { v: string; s: (x: string) => void; p?: string }) {
  return <input className={ic} value={v} onChange={e => s(e.target.value)} placeholder={p} />;
}
function FS({ v, s, opts, empty }: { v: string; s: (x: string) => void; opts: string[]; empty?: string }) {
  return (
    <select className={ic} value={v} onChange={e => s(e.target.value)}>
      {empty !== undefined && <option value="">{empty || "—"}</option>}
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function FC({ label, v, s }: { label: string; v: boolean; s: (x: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={v} onChange={e => s(e.target.checked)} className="w-4 h-4 accent-primary rounded" />
      <span className="text-sm">{label}</span>
    </label>
  );
}
function FN({ v, s, min = 0 }: { v: number; s: (x: number) => void; min?: number }) {
  return <input type="number" className={ic} value={v} onChange={e => s(Number(e.target.value))} min={min} />;
}

// ─── Form components ──────────────────────────────────────────────────────────

const SectionForm = React.forwardRef<FormHandle, { init?: Partial<ASection> }>(({ init = {} }, ref) => {
  const [slug, setSlug] = useState(init.slug ?? "");
  const [title, setTitle] = useState(init.title ?? "");
  const [subtitle, setSubtitle] = useState(init.subtitle ?? "");
  const [icon, setIcon] = useState(init.icon ?? "");
  const [badge, setBadge] = useState(init.badge ?? "");
  const [gridTemplate, setGridTemplate] = useState(init.gridTemplate ?? "");
  const [sortOrder, setSortOrder] = useState(init.sortOrder ?? 0);
  const [isVisible, setIsVisible] = useState(init.isVisible ?? true);
  React.useImperativeHandle(ref, () => ({
    getData: () => ({ slug: slug || undefined, title, subtitle: subtitle || undefined, icon: icon || undefined, badge: badge || undefined, gridTemplate: gridTemplate || undefined, sortOrder, isVisible }),
  }), [slug, title, subtitle, icon, badge, gridTemplate, sortOrder, isVisible]);
  return (
    <>
      <Field label="Slug"><FT v={slug} s={setSlug} p="promo-bar" /></Field>
      <Field label="Başlık"><FT v={title} s={setTitle} p="Promo & Bar" /></Field>
      <Field label="Alt Başlık"><FT v={subtitle} s={setSubtitle} /></Field>
      <Field label="İkon (iconify)"><FT v={icon} s={setIcon} p="solar:cup-bold" /></Field>
      <Field label="Rozet"><FT v={badge} s={setBadge} /></Field>
      <Field label="Grid Template (CSS)"><FT v={gridTemplate} s={setGridTemplate} p="1fr 1fr 1fr" /></Field>
      <Field label="Sıra No"><FN v={sortOrder} s={setSortOrder} /></Field>
      <FC label="Görünür" v={isVisible} s={setIsVisible} />
    </>
  );
});
SectionForm.displayName = "SectionForm";

const GroupForm = React.forwardRef<FormHandle, { init?: Partial<AGroup> }>(({ init = {} }, ref) => {
  const [title, setTitle] = useState(init.title ?? "");
  const [subtitle, setSubtitle] = useState(init.subtitle ?? "");
  const [descText, setDescText] = useState(init.descriptionText ?? "");
  const [sortOrder, setSortOrder] = useState(init.sortOrder ?? 0);
  const [isVisible, setIsVisible] = useState(init.isVisible ?? true);
  const [groupType, setGroupType] = useState(init.groupType ?? "card");
  const [colStart, setColStart] = useState(init.colStart ?? 1);
  const [colSpan, setColSpan] = useState(init.colSpan ?? 1);
  const [borderHighlight, setBorderHighlight] = useState(init.borderHighlight ?? false);
  const [cornerBadge, setCornerBadge] = useState(init.cornerBadge ?? "");
  const [glowEffect, setGlowEffect] = useState(init.glowEffect ?? false);
  const [titleStyle, setTitleStyle] = useState(init.titleStyle ?? "plain");
  const [titleNote, setTitleNote] = useState(init.titleNote ?? "");
  const [titleRightIcon, setTitleRightIcon] = useState(init.titleRightIcon ?? "");
  const [titleRightLabel, setTitleRightLabel] = useState(init.titleRightLabel ?? "");
  const [titleRightBadge, setTitleRightBadge] = useState(init.titleRightBadge ?? "");
  const [titleBorderBottom, setTitleBorderBottom] = useState(init.titleBorderBottom ?? false);
  const [itemVariant, setItemVariant] = useState(init.itemVariant ?? "simple");
  const [itemLayout, setItemLayout] = useState(init.itemLayout ?? "rows");
  const [itemSize, setItemSize] = useState(init.itemSize ?? "normal");
  React.useImperativeHandle(ref, () => ({
    getData: () => ({
      title: title || undefined, subtitle: subtitle || undefined,
      descriptionText: descText || undefined,
      sortOrder, isVisible, groupType, colStart, colSpan,
      borderHighlight, cornerBadge: cornerBadge || undefined, glowEffect,
      titleStyle, titleNote: titleNote || undefined,
      titleRightIcon: titleRightIcon || undefined, titleRightLabel: titleRightLabel || undefined,
      titleRightBadge: titleRightBadge || undefined, titleBorderBottom,
      itemVariant, itemLayout, itemSize,
    }),
  }), [title, subtitle, descText, sortOrder, isVisible, groupType, colStart, colSpan,
    borderHighlight, cornerBadge, glowEffect, titleStyle, titleNote, titleRightIcon,
    titleRightLabel, titleRightBadge, titleBorderBottom, itemVariant, itemLayout, itemSize]);
  return (
    <>
      <div className="text-[11px] font-bold text-primary uppercase tracking-wider">Temel</div>
      <Field label="Başlık"><FT v={title} s={setTitle} p="Buzzz Gibi Bira" /></Field>
      <Field label="Alt Başlık"><FT v={subtitle} s={setSubtitle} /></Field>
      <Field label="Sıra No"><FN v={sortOrder} s={setSortOrder} /></Field>
      <FC label="Görünür" v={isVisible} s={setIsVisible} />
      <div className="border-t border-border/40 pt-3 text-[11px] font-bold text-primary uppercase tracking-wider">Grid Yerleşim</div>
      <Field label="Grup Tipi"><FS v={groupType} s={setGroupType} opts={GROUP_TYPES} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Col Start"><FN v={colStart} s={setColStart} min={1} /></Field>
        <Field label="Col Span"><FN v={colSpan} s={setColSpan} min={1} /></Field>
      </div>
      <div className="border-t border-border/40 pt-3 text-[11px] font-bold text-primary uppercase tracking-wider">Başlık Görünümü</div>
      <Field label="Başlık Stili"><FS v={titleStyle} s={setTitleStyle} opts={TITLE_STYLES} /></Field>
      <Field label="Başlık Notu"><FT v={titleNote} s={setTitleNote} p="(4 pcs)" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sağ Etiket"><FT v={titleRightLabel} s={setTitleRightLabel} /></Field>
        <Field label="Sağ Rozet"><FT v={titleRightBadge} s={setTitleRightBadge} /></Field>
      </div>
      <Field label="Sağ İkon"><FT v={titleRightIcon} s={setTitleRightIcon} /></Field>
      <FC label="Alt Çizgi (titleBorderBottom)" v={titleBorderBottom} s={setTitleBorderBottom} />
      <div className="border-t border-border/40 pt-3 text-[11px] font-bold text-primary uppercase tracking-wider">Kart Görünümü</div>
      <FC label="Kenarlık Vurgu" v={borderHighlight} s={setBorderHighlight} />
      <FC label="Parıltı Efekti" v={glowEffect} s={setGlowEffect} />
      <Field label="Köşe Rozeti"><FT v={cornerBadge} s={setCornerBadge} p="Sadece 675₺" /></Field>
      <div className="border-t border-border/40 pt-3 text-[11px] font-bold text-primary uppercase tracking-wider">Ürün Ayarları</div>
      <Field label="Ürün Varyantı (varsayılan)"><FS v={itemVariant} s={setItemVariant} opts={ITEM_VARIANTS} /></Field>
      <Field label="Ürün Düzeni"><FS v={itemLayout} s={setItemLayout} opts={ITEM_LAYOUTS} /></Field>
      <Field label="Ürün Boyutu"><FS v={itemSize} s={setItemSize} opts={ITEM_SIZES} /></Field>
      <div className="border-t border-border/40 pt-3 text-[11px] font-bold text-primary uppercase tracking-wider">Description Box</div>
      <Field label="Açıklama Metni"><textarea className={ic} value={descText} onChange={e => setDescText(e.target.value)} rows={2} /></Field>
    </>
  );
});
GroupForm.displayName = "GroupForm";

const ItemForm = React.forwardRef<FormHandle, { init?: Partial<AItem> }>(({ init = {} }, ref) => {
  const [name, setName] = useState(init.name ?? "");
  const [description, setDescription] = useState(init.description ?? "");
  const [price, setPrice] = useState(init.price ?? "");
  const [priceNote, setPriceNote] = useState(init.priceNote ?? "");
  const [badge, setBadge] = useState(init.badge ?? "");
  const [itemVariant, setItemVariant] = useState(init.itemVariant ?? "");
  const [sortOrder, setSortOrder] = useState(init.sortOrder ?? 0);
  const [isVisible, setIsVisible] = useState(init.isVisible ?? true);
  React.useImperativeHandle(ref, () => ({
    getData: () => ({ name, description: description || undefined, price, priceNote: priceNote || undefined, badge: badge || undefined, itemVariant: itemVariant || undefined, sortOrder, isVisible }),
  }), [name, description, price, priceNote, badge, itemVariant, sortOrder, isVisible]);
  return (
    <>
      <Field label="Ad"><FT v={name} s={setName} p="Sake Nigiri" /></Field>
      <Field label="Açıklama"><FT v={description} s={setDescription} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fiyat"><FT v={price} s={setPrice} p="335 ₺" /></Field>
        <Field label="Fiyat Notu"><FT v={priceNote} s={setPriceNote} p="360 ₺" /></Field>
      </div>
      <Field label="Rozet"><FT v={badge} s={setBadge} /></Field>
      <Field label="Ürün Varyantı (override)">
        <FS v={itemVariant} s={setItemVariant} opts={ITEM_VARIANTS} empty="Grup Varsayılanı" />
      </Field>
      <Field label="Sıra No"><FN v={sortOrder} s={setSortOrder} /></Field>
      <FC label="Görünür" v={isVisible} s={setIsVisible} />
    </>
  );
});
ItemForm.displayName = "ItemForm";

const VocabForm = React.forwardRef<FormHandle, { init?: Partial<AVocab> }>(({ init = {} }, ref) => {
  const [term, setTerm] = useState(init.term ?? "");
  const [translation, setTranslation] = useState(init.translation ?? "");
  const [sortOrder, setSortOrder] = useState(init.sortOrder ?? 0);
  React.useImperativeHandle(ref, () => ({
    getData: () => ({ term, translation, sortOrder }),
  }), [term, translation, sortOrder]);
  return (
    <>
      <Field label="Terim"><FT v={term} s={setTerm} p="Sake" /></Field>
      <Field label="Çeviri"><FT v={translation} s={setTranslation} p="Somon" /></Field>
      <Field label="Sıra No"><FN v={sortOrder} s={setSortOrder} /></Field>
    </>
  );
});
VocabForm.displayName = "VocabForm";

// ─── Slide panel ──────────────────────────────────────────────────────────────

function Panel({ title, onClose, onSave, onDelete, busy, children }: {
  title: string; onClose: () => void; onSave: () => void; onDelete?: () => void; busy: boolean; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-card border-l border-border flex flex-col overflow-hidden shadow-2xl">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between shrink-0">
          <h2 className="font-font-heading text-base font-bold uppercase tracking-wider">{title}</h2>
          <button onClick={onClose} className="size-7 rounded flex items-center justify-center text-muted-foreground hover:bg-muted">
            <Icon icon="solar:close-square-bold" width={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>
        <div className="border-t border-border px-5 py-4 flex gap-3 shrink-0">
          <button onClick={onSave} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {busy ? "Kaydediliyor..." : "Kaydet"}
          </button>
          {onDelete && (
            <button onClick={onDelete} disabled={busy}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-colors border border-red-500/20">
              Sil
            </button>
          )}
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-bold text-sm hover:bg-secondary">
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inline add buttons ───────────────────────────────────────────────────────

function AddItemBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-1.5 rounded border border-dashed border-border/50 text-[11px] text-muted-foreground/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">
      <Icon icon="solar:add-circle-bold" width={12} /> Yeni Ürün Ekle
    </button>
  );
}

function AddGroupBtn({ onClick, label = "Yeni Grup Ekle" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border/40 text-xs font-bold uppercase tracking-wider text-muted-foreground/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">
      <Icon icon="solar:add-square-bold" width={16} /> {label}
    </button>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ section, onEdit }: { section: ASection | undefined; onEdit: () => void }) {
  if (!section) return null;
  return (
    <button onClick={onEdit} className="w-full flex items-center justify-between border-b-2 border-primary pb-3 hover:bg-primary/10 hover:text-primary rounded-t-xl px-3 -mx-3 transition-colors text-left">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
          <Icon icon={section.icon} width={20} />
        </div>
        <div>
          <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider">{section.title}</h2>
          {section.subtitle && <p className="text-xs text-muted-foreground">{section.subtitle}</p>}
        </div>
      </div>
      {section.badge && <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">{section.badge}</span>}
    </button>
  );
}

// ─── Generic item list ────────────────────────────────────────────────────────

function ItemList({ items, onEdit, onAdd }: {
  items: AItem[];
  onEdit: (item: AItem) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-1 text-sm">
      {items.map(item => (
        <div key={item.id} onClick={() => onEdit(item)}
          className="flex items-center py-1 border-b border-border/20 last:border-0 cursor-pointer hover:bg-primary/10 hover:text-primary rounded px-1.5 -mx-1.5 transition-colors">
          <div className="flex-1">
            <span>{item.name}</span>
            {item.description && <span className="text-xs text-muted-foreground ml-2">{item.description}</span>}
          </div>
          <span className="font-font-mono font-bold text-primary shrink-0">{item.price}</span>
        </div>
      ))}
      <AddItemBtn onClick={onAdd} />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const [sections, setSections] = useState<ASection[]>([]);
  const [vocab, setVocab] = useState<AVocab[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<FormHandle | null>(null);

  const reloadSections = () => {
    fetch(`${BASE}/menu/admin`, { headers: { "x-admin-key": ADMIN_KEY } })
      .then(r => r.json())
      .then((d: unknown) => { if (Array.isArray(d)) setSections(d as ASection[]); })
      .catch(() => {});
  };
  const reloadVocab = () => {
    fetch(`${BASE}/page-content/menu`, { headers: { "x-admin-key": ADMIN_KEY } })
      .then(r => r.json())
      .then((d: unknown) => {
        const v = (d as Record<string, unknown>)?.vocab;
        if (Array.isArray(v)) setVocab(v as AVocab[]);
      })
      .catch(() => {});
  };
  const reload = () => { reloadSections(); reloadVocab(); };

  useEffect(reload, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    if (!modal) return;
    const data = formRef.current?.getData() ?? {};
    setBusy(true);
    try {
      if (modal.type === "add-section") await api("POST", "/menu/sections", data);
      else if (modal.type === "edit-section") await api("PATCH", `/menu/sections/${modal.section.id}`, data);
      else if (modal.type === "add-group") await api("POST", `/menu/sections/${modal.sectionId}/groups`, { ...data, sortOrder: modal.nextSort });
      else if (modal.type === "edit-group") await api("PATCH", `/menu/groups/${modal.group.id}`, data);
      else if (modal.type === "add-item") await api("POST", `/menu/groups/${modal.groupId}/items`, { ...data, sortOrder: modal.nextSort });
      else if (modal.type === "edit-item") await api("PATCH", `/menu/items/${modal.item.id}`, data);
      else if (modal.type === "add-vocab") await api("POST", "/page-content/menu/sushi-vocab", { ...data, sortOrder: modal.nextSort });
      else if (modal.type === "edit-vocab") await api("PATCH", `/page-content/menu/sushi-vocab/${modal.vocab.id}`, data);
      setModal(null);
      reload();
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
      if (modal.type === "edit-item") await api("DELETE", `/menu/items/${modal.item.id}`);
      else if (modal.type === "edit-group") await api("DELETE", `/menu/groups/${modal.group.id}`);
      else if (modal.type === "edit-section") await api("DELETE", `/menu/sections/${modal.section.id}`);
      else if (modal.type === "edit-vocab") await api("DELETE", `/page-content/menu/sushi-vocab/${modal.vocab.id}`);
      setModal(null);
      reload();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  const isEditModal = modal?.type === "edit-item" || modal?.type === "edit-group" || modal?.type === "edit-section" || modal?.type === "edit-vocab";

  function editItem(item: AItem) { setModal({ type: "edit-item", item }); }
  function editGroup(group: AGroup) { setModal({ type: "edit-group", group }); }
  function editSection(section: ASection) { setModal({ type: "edit-section", section }); }
  function addItem(groupId: string, count: number) { setModal({ type: "add-item", groupId, nextSort: count }); }
  function addGroup(sectionId: string, count: number) { setModal({ type: "add-group", sectionId, nextSort: count }); }

  // Lookup helpers
  const promoSec = sec(sections, "promo-bar");
  const sushiSec = sec(sections, "sushi-bar");
  const bentoSec = sec(sections, "bentolar");
  const noodleSec = sec(sections, "noodles-rice");
  const kitchenSec = sec(sections, "main-kitchen");
  const aperSec = sec(sections, "aperatifler");
  const coffeeSec = sec(sections, "coffee-soft");

  const biraGroup = grp(promoSec, "Buzzz Gibi Bira");
  const biraItems = (biraGroup?.items ?? []).filter(i => i.itemVariant === "with-pricenote-below" || !i.itemVariant);
  const kovaItems = (biraGroup?.items ?? []).filter(i => i.itemVariant === "compact-muted");
  const shotGroup = grp(promoSec, "Wine & Shot");
  const shotItems = itms(shotGroup);
  const balikGroup = grp(promoSec, "Günün Balığı");

  const sashimiGroup = grp(sushiSec, "Sashimi");
  const allSashimi = sashimiGroup?.items ?? [];
  const nigiriIdx = allSashimi.findIndex(i => i.itemVariant === "group-title");
  const sashimiItems = nigiriIdx >= 0 ? allSashimi.slice(0, nigiriIdx) : allSashimi;
  const nigiriItems = nigiriIdx >= 0 ? allSashimi.slice(nigiriIdx + 1) : [];
  const makiGroup = grp(sushiSec, "Maki");
  const uramakiGroup = grp(sushiSec, "Special Uramaki Rolls");

  const bentoItems = itms(bentoSec?.groups[0]);
  const eggGrp = grp(noodleSec, "Egg Noodle");
  const udonGrp = grp(noodleSec, "Udon Noodle");
  const padthaiGrp = grp(noodleSec, "Pad Thai");
  const riceGrp = grp(noodleSec, "Özel Pirinçler");

  const tavukGrp = grp(kitchenSec, "Tavuk & Kırmızı Etler");
  const balikKitchenGrp = grp(kitchenSec, "Balık & Deniz Ürünleri");
  const burgerGrp = grp(kitchenSec, "Bilkent Burgerler");

  const aperatifGrp = grp(aperSec, "Aperatifler");
  const salataGrp = grp(aperSec, "Salatalar");
  const corbaGroup = grp(aperSec, "Çorbalar");
  const allCorba = corbaGroup?.items ?? [];
  const kidsIdx = allCorba.findIndex(i => i.itemVariant === "group-title");
  const corbaItems = kidsIdx >= 0 ? allCorba.slice(0, kidsIdx) : allCorba;
  const kidsItems = kidsIdx >= 0 ? allCorba.slice(kidsIdx + 1) : [];

  const sicakGrp = grp(coffeeSec, "Sıcak Kahveler");
  const sogukGrp = grp(coffeeSec, "Soğuk Kahveler");
  const cayGrp = grp(coffeeSec, "Çaylar (Fincan)");
  const tatliGrp = grp(coffeeSec, "Tatlılar & Soft");

  const knownSlugs = ["promo-bar", "sushi-bar", "bentolar", "noodles-rice", "main-kitchen", "aperatifler", "coffee-soft"];

  const row = "flex items-center cursor-pointer hover:bg-primary/10 hover:text-primary rounded px-1.5 -mx-1.5 transition-colors";
  const ghdr = "cursor-pointer hover:text-primary transition-colors";

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
              <Icon icon="solar:chart-square-bold" width={16} /> Genel Bakış &amp; Ciro Analitiği
            </Link>
            <Link href="/menu" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shrink-0 shadow-sm">
              <Icon icon="solar:menu-dots-square-bold" width={16} /> Menü Düzenleme
            </Link>
            <Link href="/cocktail-lab" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-hot-bold" width={16} /> Kokteyl Lab
            </Link>
            <Link href="/leaderboard" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:cup-star-bold" width={16} /> Liderlik Tablosu
            </Link>
            <Link href="/settings" className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted font-medium flex items-center gap-2 shrink-0 transition-colors">
              <Icon icon="solar:settings-bold" width={16} /> Sistem Ayarları
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
            </div>
            <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div className="group relative rounded-xl overflow-hidden border border-border bg-card p-4 hover:border-primary/60 transition-all shadow-lg">
                <div className="h-36 rounded-lg overflow-hidden relative mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/AAIvuxGxRFa.jpeg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-primary-foreground font-font-heading uppercase text-xs tracking-wider">Sushi Bar</div>
                </div>
                <h2 className="font-font-heading text-lg font-bold uppercase tracking-wide">Taze Sushi &amp; Rolls</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Uramaki, Maki, Nigiri &amp; Sashimi spesiyalleri</p>
              </div>
              <div className="group relative rounded-xl overflow-hidden border border-border bg-card p-4 hover:border-primary/60 transition-all shadow-lg">
                <div className="h-36 rounded-lg overflow-hidden relative mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/ZMi4cF0X5kb/components/Qryfgpi8vmj.jpeg" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-primary-foreground font-font-heading uppercase text-xs tracking-wider">Bar &amp; Promo</div>
                </div>
                <h2 className="font-font-heading text-lg font-bold uppercase tracking-wide">Fıçı &amp; 5+1 Shotlar</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Bud, Efes, Kovalar, Tekila &amp; Jäger paketleri</p>
              </div>
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
                <Icon icon={s.icon} className={i === 0 ? "" : "text-primary"} width={16} />
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        {/* Promo & Bar */}
        {promoSec && (
          <section id="promo-bar" className="space-y-6 scroll-mt-[120px]">
            <SectionHeader section={promoSec} onEdit={() => editSection(promoSec)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bira */}
              <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -right-6 -bottom-6 size-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <button onClick={() => biraGroup && editGroup(biraGroup)} className={`${ghdr} inline-block px-3 py-1 rounded bg-primary text-primary-foreground font-font-heading uppercase text-sm tracking-wider font-bold mb-3`}>
                    Buzzz Gibi Bira
                  </button>
                  <div className="space-y-3 mt-2">
                    {biraItems.map(item => (
                      <div key={item.id} onClick={() => editItem(item)} className={`${row} py-2 border-b border-border/60 last:border-0 gap-2`}>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{item.name}</div>
                          {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                        </div>
                        <div className="text-right font-font-mono font-bold shrink-0">
                          <div>{item.price}</div>
                          {item.priceNote && <div className="text-primary text-xs">{item.priceNote}</div>}
                        </div>
                      </div>
                    ))}
                    {kovaItems.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <div className="text-xs uppercase font-bold tracking-wider text-primary">Kova Fırsatları</div>
                        {kovaItems.map(item => (
                          <div key={item.id} onClick={() => editItem(item)} className={`${row} text-xs text-muted-foreground py-1 gap-2`}>
                            <span className="flex-1">{item.name}</span>
                            <span className="font-font-mono font-bold text-foreground">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {biraGroup && <AddItemBtn onClick={() => addItem(biraGroup.id, biraGroup.items.length)} />}
              </div>
              {/* Wine & Shot */}
              <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors flex flex-col justify-between">
                <div>
                  <button onClick={() => shotGroup && editGroup(shotGroup)} className={`${ghdr} inline-block px-3 py-1 rounded bg-primary text-primary-foreground font-font-heading uppercase text-sm tracking-wider font-bold mb-3`}>
                    Wine &amp; Shot
                  </button>
                  <div className="space-y-3 mt-2">
                    {shotItems.map(item => (
                      <div key={item.id} onClick={() => editItem(item)} className={`${row} py-2 border-b border-border/60 last:border-0 gap-2`}>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{item.name}</div>
                          {item.priceNote && <div className="text-xs text-muted-foreground line-through opacity-70">{item.priceNote}</div>}
                        </div>
                        <div className="font-font-mono font-bold text-primary text-base shrink-0">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {shotGroup && <AddItemBtn onClick={() => addItem(shotGroup.id, shotGroup.items.length)} />}
              </div>
              {/* Günün Balığı */}
              <div className="bg-card rounded-xl border border-primary/50 p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
                {balikGroup?.cornerBadge && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl">
                    Sadece {balikGroup.cornerBadge}
                  </div>
                )}
                <div>
                  <button onClick={() => balikGroup && editGroup(balikGroup)} className={`${ghdr} inline-block px-3 py-1 rounded bg-secondary text-secondary-foreground font-font-heading uppercase text-sm tracking-wider font-bold mb-3`}>
                    Günün Balığı
                  </button>
                  <p className="text-xs text-muted-foreground mb-3">Her gün taze deniz ürünleri servisi:</p>
                  <div className="space-y-1.5 text-xs">
                    {itms(balikGroup).map(item => (
                      <div key={item.id} onClick={() => editItem(item)} className={`${row} py-1 border-b border-border/40 last:border-0 gap-2`}>
                        <span className="text-muted-foreground font-medium flex-1">{item.name}</span>
                        <span className="font-bold">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {balikGroup && <AddItemBtn onClick={() => addItem(balikGroup.id, balikGroup.items.length)} />}
              </div>
            </div>
            <AddGroupBtn onClick={() => addGroup(promoSec.id, promoSec.groups.length)} />
          </section>
        )}

        {/* Sushi Bar */}
        {sushiSec && (
          <section id="sushi-bar" className="space-y-6 scroll-mt-[120px]">
            <SectionHeader section={sushiSec} onEdit={() => editSection(sushiSec)} />
            <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors flex flex-wrap items-center gap-3 text-xs">
              <span className="font-font-heading text-primary text-sm font-bold uppercase tracking-wider shrink-0">Sushi Sözlüğü:</span>
              <div className="flex items-center gap-2 flex-wrap flex-1">
                {vocab.map((v, i) => (
                  <React.Fragment key={v.id}>
                    {i > 0 && <span className="text-muted-foreground/40 select-none">•</span>}
                    <span onClick={() => setModal({ type: "edit-vocab", vocab: v })}
                      className="cursor-pointer hover:bg-primary/10 hover:text-primary rounded px-1.5 py-0.5 -mx-1.5 transition-colors text-muted-foreground">
                      <strong className="text-foreground">{v.term}:</strong> {v.translation}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <button onClick={() => setModal({ type: "add-vocab", nextSort: vocab.length })}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded border border-dashed border-border/60 text-muted-foreground/50 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <Icon icon="solar:add-circle-bold" width={12} /> Terim Ekle
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-6">
                {/* Sashimi + Nigiri */}
                <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-3 border-b border-border/80 pb-2">
                    <button onClick={() => sashimiGroup && editGroup(sashimiGroup)} className={`${ghdr} flex items-center gap-1`}>
                      <h3 className="font-font-heading text-xl uppercase font-bold">Sashimi <span className="text-xs text-muted-foreground font-font-sans font-normal">(4 pcs)</span></h3>
                    </button>
                    <Icon icon="solar:fire-square-bold" className="text-primary" width={16} />
                  </div>
                  <div className="space-y-2 mb-6 text-sm">
                    {sashimiItems.map(item => (
                      <div key={item.id} onClick={() => editItem(item)} className={`${row} gap-2`}>
                        <span className="flex-1">{item.name}</span>
                        <span className="font-font-mono font-bold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 mb-3 border-b border-border/80 pb-2">
                    <h3 className="font-font-heading text-xl uppercase font-bold">Nigiri <span className="text-xs text-muted-foreground font-font-sans font-normal">(2 pcs)</span></h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    {nigiriItems.map(item => (
                      <div key={item.id} onClick={() => editItem(item)} className={`${row} gap-2`}>
                        <span className="flex-1">{item.name}</span>
                        <span className="font-font-mono font-bold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  {sashimiGroup && <AddItemBtn onClick={() => addItem(sashimiGroup.id, sashimiGroup.items.length)} />}
                </div>
                {/* Maki */}
                <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-1.5 mb-3 border-b border-border/80 pb-2">
                    <button onClick={() => makiGroup && editGroup(makiGroup)} className={ghdr}>
                      <h3 className="font-font-heading text-xl uppercase font-bold">Maki <span className="text-xs text-muted-foreground font-font-sans font-normal">(8 pcs)</span></h3>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {itms(makiGroup).map(item => (
                      <div key={item.id} onClick={() => editItem(item)} className={`${row} py-1 border-b border-border/30 gap-2`}>
                        <span className="flex-1">{item.name}</span>
                        <span className="font-font-mono font-bold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  {makiGroup && <AddItemBtn onClick={() => addItem(makiGroup.id, makiGroup.items.length)} />}
                </div>
              </div>
              {/* Special Uramaki */}
              <div className="lg:col-span-7 bg-card rounded-xl border border-border p-6 space-y-4 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <button onClick={() => uramakiGroup && editGroup(uramakiGroup)} className={`${ghdr} text-left`}>
                    <h3 className="font-font-heading text-2xl uppercase font-bold">
                      {uramakiGroup?.title ?? "Special Uramaki Rolls"}{" "}
                      {uramakiGroup?.titleNote && <span className="text-xs text-muted-foreground font-font-sans font-normal">({uramakiGroup.titleNote})</span>}
                    </h3>
                    {uramakiGroup?.subtitle && <p className="text-xs text-muted-foreground">{uramakiGroup.subtitle}</p>}
                  </button>
                  <span className="px-2.5 py-1 rounded bg-primary/20 text-primary font-font-mono text-xs font-bold border border-primary/40">İmza</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {itms(uramakiGroup).map(item => (
                    <div key={item.id} onClick={() => editItem(item)}
                      className="p-3.5 rounded-lg bg-background/70 border border-border/60 hover:border-primary hover:bg-primary/10 cursor-pointer transition-colors">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-bold text-sm flex-1">{item.name}</h4>
                        <span className="font-font-mono font-bold text-primary text-sm shrink-0">{item.price}</span>
                      </div>
                      {item.description && <p className="text-[11px] text-muted-foreground mt-1">{item.description}</p>}
                    </div>
                  ))}
                </div>
                {uramakiGroup && <AddItemBtn onClick={() => addItem(uramakiGroup.id, uramakiGroup.items.length)} />}
              </div>
            </div>
            <AddGroupBtn onClick={() => addGroup(sushiSec.id, sushiSec.groups.length)} />
          </section>
        )}

        {/* Bentolar */}
        {bentoSec && (
          <section id="bentolar" className="space-y-6 scroll-mt-[120px]">
            <SectionHeader section={bentoSec} onEdit={() => editSection(bentoSec)} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bentoItems.map(item => (
                <div key={item.id} onClick={() => editItem(item)}
                  className="bg-card rounded-xl border border-border p-4 hover:border-primary hover:bg-primary/10 cursor-pointer transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-font-heading text-lg font-bold flex-1">{item.name}</span>
                    <span className="font-font-mono font-bold text-primary shrink-0">{item.price}</span>
                  </div>
                  {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Noodle & Rice */}
        {noodleSec && (
          <section id="noodles-rice" className="space-y-6 scroll-mt-[120px]">
            <SectionHeader section={noodleSec} onEdit={() => editSection(noodleSec)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[eggGrp, udonGrp, padthaiGrp, riceGrp].filter(Boolean).map(g => (
                <div key={g!.id} className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                    <button onClick={() => editGroup(g!)} className={ghdr}>
                      <h3 className="font-font-heading text-xl uppercase font-bold">{g!.title}</h3>
                    </button>
                    {g!.subtitle && <span className="text-[10px] uppercase font-bold text-primary">{g!.subtitle}</span>}
                  </div>
                  <div className="space-y-2 text-sm">
                    {g!.items.map(item => (
                      <div key={item.id} onClick={() => editItem(item)} className={`${row} py-1 border-b border-border/20 last:border-0 gap-2`}>
                        <span className="flex-1">{item.name}</span>
                        <span className="font-font-mono font-bold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <AddItemBtn onClick={() => addItem(g!.id, g!.items.length)} />
                </div>
              ))}
            </div>
            <AddGroupBtn onClick={() => addGroup(noodleSec.id, noodleSec.groups.length)} />
          </section>
        )}

        {/* Ana Mutfak */}
        {kitchenSec && (
          <section id="main-kitchen" className="space-y-6 scroll-mt-[120px]">
            <SectionHeader section={kitchenSec} onEdit={() => editSection(kitchenSec)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { g: tavukGrp, label: "Tavuk & Kırmızı Etler" },
                { g: balikKitchenGrp, label: "Balık & Deniz Ürünleri" },
                { g: burgerGrp, label: "Bilkent Burgerler" },
              ].map(({ g, label }) => (
                <div key={label} className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-border pb-2">
                    <button onClick={() => g && editGroup(g)} className={`${ghdr} flex-1 text-left`}>
                      <h3 className="font-font-heading text-xl uppercase font-bold">{label}</h3>
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    {itms(g).map(item => (
                      <div key={item.id} onClick={() => editItem(item)} className={`${row} py-1 border-b border-border/30 last:border-0 gap-2`}>
                        <div className="flex-1">
                          <div className="font-bold">{item.name}</div>
                          {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                        </div>
                        <span className="font-font-mono font-bold text-primary shrink-0">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  {g && <AddItemBtn onClick={() => addItem(g.id, g.items.length)} />}
                </div>
              ))}
            </div>
            <AddGroupBtn onClick={() => addGroup(kitchenSec.id, kitchenSec.groups.length)} />
          </section>
        )}

        {/* Aperatif, Salata & Çorba */}
        {aperSec && (
          <section id="aperatifler" className="space-y-6 scroll-mt-[120px]">
            <SectionHeader section={aperSec} onEdit={() => editSection(aperSec)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
                <button onClick={() => aperatifGrp && editGroup(aperatifGrp)} className={`${ghdr} w-full text-left mb-3 pb-2 border-b border-border`}>
                  <h3 className="font-font-heading text-xl uppercase font-bold">Aperatifler</h3>
                </button>
                <ItemList items={itms(aperatifGrp)} onEdit={editItem} onAdd={() => aperatifGrp && addItem(aperatifGrp.id, aperatifGrp.items.length)} />
              </div>
              <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
                <button onClick={() => salataGrp && editGroup(salataGrp)} className={`${ghdr} w-full text-left mb-3 pb-2 border-b border-border`}>
                  <h3 className="font-font-heading text-xl uppercase font-bold">Salatalar</h3>
                </button>
                <ItemList items={itms(salataGrp)} onEdit={editItem} onAdd={() => salataGrp && addItem(salataGrp.id, salataGrp.items.length)} />
              </div>
              <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors space-y-4">
                <div>
                  <button onClick={() => corbaGroup && editGroup(corbaGroup)} className={`${ghdr} w-full text-left mb-2 pb-1 border-b border-border`}>
                    <h3 className="font-font-heading text-xl uppercase font-bold">Çorbalar</h3>
                  </button>
                  <ItemList items={corbaItems} onEdit={editItem} onAdd={() => corbaGroup && addItem(corbaGroup.id, corbaGroup.items.length)} />
                </div>
                <div>
                  <div className="mb-2 pb-1 border-b border-border">
                    <h3 className="font-font-heading text-xl uppercase font-bold">Kids York</h3>
                  </div>
                  <ItemList items={kidsItems} onEdit={editItem} onAdd={() => corbaGroup && addItem(corbaGroup.id, corbaGroup.items.length)} />
                </div>
              </div>
            </div>
            <AddGroupBtn onClick={() => addGroup(aperSec.id, aperSec.groups.length)} />
          </section>
        )}

        {/* Kahve & Tatlılar */}
        {coffeeSec && (
          <section id="coffee-soft" className="space-y-6 scroll-mt-[120px]">
            <SectionHeader section={coffeeSec} onEdit={() => editSection(coffeeSec)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[sicakGrp, sogukGrp, cayGrp, tatliGrp].filter(Boolean).map(g => (
                <div key={g!.id} className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
                  <button onClick={() => editGroup(g!)} className={`${ghdr} w-full text-left border-b border-border pb-2 mb-3`}>
                    <h3 className="font-font-heading text-lg uppercase font-bold">{g!.title}</h3>
                  </button>
                  <ItemList items={g!.items} onEdit={editItem} onAdd={() => addItem(g!.id, g!.items.length)} />
                </div>
              ))}
            </div>
            <AddGroupBtn onClick={() => addGroup(coffeeSec.id, coffeeSec.groups.length)} />
          </section>
        )}

        {/* Bilinmeyen bölümler */}
        {sections.filter(s => !knownSlugs.includes(s.slug)).map(s => (
          <section key={s.id} id={s.slug} className="space-y-6 scroll-mt-[120px]">
            <SectionHeader section={s} onEdit={() => editSection(s)} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {s.groups.map(g => (
                <div key={g.id} className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
                  {g.title && (
                    <button onClick={() => editGroup(g)} className={`${ghdr} w-full text-left border-b border-border/80 pb-2 mb-3`}>
                      <h3 className="font-font-heading text-xl uppercase font-bold">{g.title}</h3>
                    </button>
                  )}
                  <ItemList items={g.items} onEdit={editItem} onAdd={() => addItem(g.id, g.items.length)} />
                </div>
              ))}
            </div>
            <AddGroupBtn onClick={() => addGroup(s.id, s.groups.length)} />
          </section>
        ))}

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-secondary via-card to-secondary border border-primary/40 p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs uppercase font-bold tracking-widest">Aylık Kokteyl Yarışması</span>
            <h2 className="font-font-heading text-3xl sm:text-5xl font-bold uppercase tracking-wider">
              Kendi Kokteylini Yarat, <span className="text-primary">Menüye İsmini Yazdır</span>
            </h2>
            <p className="text-sm text-muted-foreground">Her ay en çok oyu alan özel reçete Bilkent York resmi menüsüne girsin!</p>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Bilkent York Operations Portal v2.4 • Yönetici: Badu Alp Ustagül (Head Executive)</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-primary">Menü Dışa Aktar</a>
            <a href="#" className="hover:text-primary">Fiyat Geçmişi</a>
          </div>
        </div>
      </footer>

      {/* Panel */}
      {modal && (
        <Panel
          title={modal.type === "add-section" ? "Yeni Bölüm" : modal.type === "edit-section" ? "Bölüm Düzenle" : modal.type === "add-group" ? "Yeni Grup" : modal.type === "edit-group" ? "Grup Düzenle" : modal.type === "add-item" ? "Yeni Ürün" : modal.type === "edit-item" ? "Ürün Düzenle" : modal.type === "add-vocab" ? "Yeni Terim" : "Terim Düzenle"}
          onClose={() => setModal(null)} onSave={save} onDelete={isEditModal ? del : undefined} busy={busy}
        >
          {modal.type === "add-section" && <SectionForm ref={formRef} />}
          {modal.type === "edit-section" && <SectionForm ref={formRef} init={modal.section} />}
          {modal.type === "add-group" && <GroupForm ref={formRef} />}
          {modal.type === "edit-group" && <GroupForm ref={formRef} init={modal.group} />}
          {modal.type === "add-item" && <ItemForm ref={formRef} />}
          {modal.type === "edit-item" && <ItemForm ref={formRef} init={modal.item} />}
          {modal.type === "add-vocab" && <VocabForm ref={formRef} />}
          {modal.type === "edit-vocab" && <VocabForm ref={formRef} init={modal.vocab} />}
        </Panel>
      )}
    </div>
  );
}
