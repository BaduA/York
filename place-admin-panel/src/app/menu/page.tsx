"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLoading } from "@/components/LoadingBar";
import { hashData } from "@/lib/hash";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Extension } from "@tiptap/core";
import {
  DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, arrayMove, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const FontFamily = Extension.create({
  name: "fontFamily",
  addOptions() { return { types: ["textStyle"] }; },
  addGlobalAttributes() {
    return [{ types: this.options.types, attributes: {
      fontFamily: {
        default: null,
        parseHTML: el => (el as HTMLElement).style.fontFamily || null,
        renderHTML: attrs => attrs.fontFamily ? { style: `font-family: ${attrs.fontFamily}` } : {},
      },
      letterSpacing: {
        default: null,
        parseHTML: el => (el as HTMLElement).style.letterSpacing || null,
        renderHTML: attrs => attrs.letterSpacing ? { style: `letter-spacing: ${attrs.letterSpacing}` } : {},
      },
      textTransform: {
        default: null,
        parseHTML: el => (el as HTMLElement).style.textTransform || null,
        renderHTML: attrs => attrs.textTransform ? { style: `text-transform: ${attrs.textTransform}` } : {},
      },
    }}];
  },
});

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() { return { types: ["textStyle"] }; },
  addGlobalAttributes() {
    return [{ types: this.options.types, attributes: { fontSize: {
      default: null,
      parseHTML: el => (el as HTMLElement).style.fontSize || null,
      renderHTML: attrs => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
    }}}];
  },
  addCommands() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFontSize: (size: string) => ({ chain }: any) => chain().setMark("textStyle", { fontSize: size }).run(),
    };
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

type AItem = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  priceNote: string | null;
  price2: string | null;
  priceNote2: string | null;
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
  cardGroup: string | null;
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

type MenuChangeEntry = { id: string; label: string; context: string; status: 'added' | 'updated' | 'removed'; details?: string[] };

type FormHandle = { getData: () => Record<string, unknown> };

type ModalState =
  | null
  | { type: "add-section" }
  | { type: "edit-section"; section: ASection }
  | { type: "add-group"; sectionId: string; nextSort: number }
  | { type: "edit-group"; group: AGroup }
  | { type: "add-item"; groupId: string; nextSort: number }
  | { type: "edit-item"; item: AItem }
  | { type: "simple-edit-item"; item: AItem }
  | { type: "desc-edit-item"; item: AItem }
  | { type: "dual-price-edit-item"; item: AItem }
  | { type: "property-edit-item"; item: AItem }
  | { type: "reorder-items"; group: AGroup }
  | { type: "reorder-groups"; section: ASection; colStart: number; cardGroup: string | null }
  | { type: "reorder-sections" };

type CtxMenu = {
  target: "item"; item: AItem; groupId: string; x: number; y: number;
} | {
  target: "group"; group: AGroup; sectionId: string; x: number; y: number; canReorder: boolean;
} | {
  target: "section"; section: ASection; x: number; y: number;
} | null;

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
    getData: () => ({ slug: slug || undefined, title, subtitle: subtitle || null, icon: icon || null, badge: badge || null, gridTemplate: gridTemplate || null, sortOrder, isVisible }),
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
  const [titleBorderBottom, setTitleBorderBottom] = useState(init.titleBorderBottom ?? false);
  const [titleNote, setTitleNote] = useState(init.titleNote ?? "");
  const [titleRightIcon, setTitleRightIcon] = useState(init.titleRightIcon ?? "");
  const [titleRightLabel, setTitleRightLabel] = useState(init.titleRightLabel ?? "");
  const [titleRightBadge, setTitleRightBadge] = useState(init.titleRightBadge ?? "");
  const VALID_GROUP_VARIANTS = ["simple", "with-description", "with-pricenote-below", "with-pricenote-strikethrough", "property", "sub-header", "mini-card"];
  const [itemVariant, setItemVariant] = useState(() => {
    const v = init.itemVariant ?? "simple";
    return VALID_GROUP_VARIANTS.includes(v) ? v : "simple";
  });
  const [itemLayout, setItemLayout] = useState(init.itemLayout ?? "rows");
  const [itemSize, setItemSize] = useState(init.itemSize ?? "normal");

  const titleKey = titleStyle === "plain" ? (titleBorderBottom ? "plain-border" : "plain") : titleStyle;
  function applyTitleKey(k: string) {
    if (k === "plain")         { setTitleStyle("plain"); setTitleBorderBottom(false); }
    else if (k === "plain-border") { setTitleStyle("plain"); setTitleBorderBottom(true); }
    else                       { setTitleStyle(k); setTitleBorderBottom(false); }
  }

  React.useImperativeHandle(ref, () => ({
    getData: () => ({
      title: title || undefined, subtitle: subtitle || null,
      descriptionText: descText || null,
      sortOrder, isVisible, groupType, colStart, colSpan,
      borderHighlight, cornerBadge: cornerBadge || null, glowEffect,
      titleStyle, titleNote: titleNote || null,
      titleRightIcon: titleRightIcon || null,
      titleRightLabel: titleRightLabel || null,
      titleRightBadge: titleRightBadge || null,
      titleBorderBottom, itemVariant, itemLayout, itemSize,
    }),
  }), [title, subtitle, descText, sortOrder, isVisible, groupType, colStart, colSpan,
    borderHighlight, cornerBadge, glowEffect, titleStyle, titleNote, titleRightIcon,
    titleRightLabel, titleRightBadge, titleBorderBottom, itemVariant, itemLayout, itemSize]);

  const isInner = !!init.cardGroup;
  const previewTitle = title || "Başlık";

  const TITLE_STYLE_OPTS = [
    {
      key: "plain",
      label: "Düz",
      preview: <span className="text-[11px] font-font-heading font-bold uppercase tracking-wider">{previewTitle}</span>,
    },
    {
      key: "plain-border",
      label: "Alt Çizgili",
      preview: <span className="text-[11px] font-font-heading font-bold uppercase tracking-wider border-b border-border/70 pb-0.5">{previewTitle}</span>,
    },
    {
      key: "badge-primary",
      label: "Kırmızı Rozet",
      preview: <span className="inline-block px-2 py-0.5 rounded bg-primary text-primary-foreground font-font-heading uppercase text-[10px] tracking-wider font-bold">{previewTitle}</span>,
    },
    {
      key: "badge-secondary",
      label: "Koyu Rozet",
      preview: <span className="inline-block px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-font-heading uppercase text-[10px] tracking-wider font-bold">{previewTitle}</span>,
    },
  ];

  return (
    <div className="space-y-5">

      {/* ── Temel ── */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Temel</p>
        <Field label="Başlık"><FT v={title} s={setTitle} p="Buzzz Gibi Bira" /></Field>
        <Field label="Başlık Notu — başlığın yanında (4 pcs)"><FT v={titleNote} s={setTitleNote} p="4 pcs" /></Field>
        <Field label="Alt Başlık — başlığın altında küçük yazı"><FT v={subtitle} s={setSubtitle} p="Her gün taze..." /></Field>
        <FC label="Görünür" v={isVisible} s={setIsVisible} />
      </div>

      {/* ── Başlık Türü ── */}
      <div className="space-y-3 border-t border-border/40 pt-4">
        <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Başlık Türü</p>
        <div className="grid grid-cols-2 gap-2">
          {TITLE_STYLE_OPTS.map(opt => (
            <button key={opt.key} type="button" onClick={() => applyTitleKey(opt.key)}
              className={`p-2.5 rounded-xl border text-left transition-all ${titleKey === opt.key ? "border-primary bg-primary/10 ring-1 ring-primary/40" : "border-border bg-background/40 hover:border-primary/40 hover:bg-primary/5"}`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${titleKey === opt.key ? "text-primary" : "text-muted-foreground"}`}>{opt.label}</div>
              <div className="rounded-lg bg-card min-h-[1.75rem] flex items-center px-2 py-1 overflow-hidden">{opt.preview}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Sağ Taraf ── */}
      {(() => {
        const current = titleRightIcon ? "icon" : titleRightLabel ? "label" : titleRightBadge ? "badge" : "none";
        function pick(type: string) {
          setTitleRightIcon(""); setTitleRightLabel(""); setTitleRightBadge("");
        }
        return (
          <div className="space-y-3 border-t border-border/40 pt-4">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Sağ Taraf</p>
            <div className="flex gap-2">
              {[
                { k: "none", label: "Yok" },
                { k: "icon", label: "İkon" },
                { k: "label", label: "Yazı" },
                { k: "badge", label: "Rozet" },
              ].map(opt => (
                <button key={opt.k} type="button"
                  onClick={() => pick(opt.k)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${current === opt.k ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40" : "border-border bg-background/40 text-muted-foreground hover:border-primary/40"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
            {current === "icon"  && <input className={ic} value={titleRightIcon}  onChange={e => setTitleRightIcon(e.target.value)}  placeholder="solar:fire-bold" autoFocus />}
            {current === "label" && <input className={ic} value={titleRightLabel} onChange={e => setTitleRightLabel(e.target.value)} placeholder="Yumurtalı Buğday" autoFocus />}
            {current === "badge" && <input className={ic} value={titleRightBadge} onChange={e => setTitleRightBadge(e.target.value)} placeholder="İmza" autoFocus />}
          </div>
        );
      })()}

      {/* ── Başlık altı not ── */}
      {groupType !== "description-box" && (
        <div className="space-y-2 border-t border-border/40 pt-4">
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Başlık Altı Not</p>
          <p className="text-[11px] text-muted-foreground">Başlıktan sonra, itemlardan önce çıkan küçük açıklama satırı.</p>
          <textarea className={ic} value={descText} onChange={e => setDescText(e.target.value)} rows={2} placeholder="Her gün taze deniz ürünleri servisi — boşsa yok" />
        </div>
      )}

      {/* ── Ürün Türü ── */}
      <div className="space-y-3 border-t border-border/40 pt-4">
        <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Ürün Türü</p>
        <VariantPicker value={itemVariant} onChange={setItemVariant} only={["simple", "with-description", "with-pricenote-below", "with-pricenote-strikethrough", "property", "sub-header", "mini-card"]} />
        <div className="flex gap-2">
          {[{ v: "rows", label: "Tek Sıra" }, { v: "grid-2col", label: "Çift Sıra" }].map(opt => (
            <button key={opt.v} type="button" onClick={() => setItemLayout(opt.v)}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all ${itemLayout === opt.v ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40" : "border-border bg-background/40 text-muted-foreground hover:border-primary/40"}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Kart & Grid — sadece standalone kartlarda ── */}
      {!isInner && (
        <div className="space-y-3 border-t border-border/40 pt-4">
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Kart & Grid</p>
          <Field label="Grup Tipi"><FS v={groupType} s={setGroupType} opts={GROUP_TYPES} /></Field>
          <div className="flex gap-4 flex-wrap">
            <FC label="Kenarlık Vurgu" v={borderHighlight} s={setBorderHighlight} />
            <FC label="Parıltı" v={glowEffect} s={setGlowEffect} />
          </div>
          <Field label="Köşe Rozeti"><FT v={cornerBadge} s={setCornerBadge} p="Sadece 675₺ — boşsa yok" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Col Start"><FN v={colStart} s={setColStart} min={1} /></Field>
            <Field label="Col Span"><FN v={colSpan} s={setColSpan} min={1} /></Field>
          </div>
          <Field label="Sıra No"><FN v={sortOrder} s={setSortOrder} /></Field>
        </div>
      )}

    </div>
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
  const [sortOrder] = useState(init.sortOrder ?? 0);
  const [isVisible, setIsVisible] = useState(init.isVisible ?? true);
  React.useImperativeHandle(ref, () => ({
    getData: () => ({ name, description: description || null, price, priceNote: priceNote || null, badge: badge || null, itemVariant: itemVariant || null, sortOrder, isVisible }),
  }), [name, description, price, priceNote, badge, itemVariant, sortOrder, isVisible]);
  return (
    <>
      {/* Visibility toggle */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-background/60 border border-border/60">
        <div>
          <div className="text-sm font-bold">Stokta Var</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Kapalıysa menüde "Stokta Yok" olarak görünür</div>
        </div>
        <button type="button" onClick={() => setIsVisible(v => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${isVisible ? "bg-primary" : "bg-muted"}`}>
          <div className={`absolute top-0.5 size-5 bg-white rounded-full shadow-sm transition-transform ${isVisible ? "translate-x-[1.375rem]" : "translate-x-0.5"}`} />
        </button>
      </div>

      <Field label="Ürün Adı"><FT v={name} s={setName} p="Sake Nigiri" /></Field>

      <Field label="Açıklama (opsiyonel)"><FT v={description} s={setDescription} p="Malzeme, tarif notu..." /></Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Fiyat"><FT v={price} s={setPrice} p="150 ₺" /></Field>
        <Field label="İndirim / Eski Fiyat"><FT v={priceNote} s={setPriceNote} p="200 ₺" /></Field>
      </div>

      <Field label="Etiket (opsiyonel)"><FT v={badge} s={setBadge} p="Yeni · Öneririz · Acı" /></Field>

      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Görünüm Tipi</label>
        <VariantPicker value={itemVariant} onChange={setItemVariant} />
      </div>
    </>
  );
});
ItemForm.displayName = "ItemForm";

// ─── Simple item editor (name · price · discount only) ───────────────────────

function SimpleItemEditor({ item, onClose, onSaved }: {
  item: AItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [discount, setDiscount] = useState(item.priceNote ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api("PATCH", `/menu/items/${item.id}`, {
        name: name.trim(),
        price: price.trim(),
        priceNote: discount.trim() || null,
      });
      onSaved();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="modal-enter relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Live preview */}
        <div className="px-6 pt-6 pb-5 border-b border-border/50">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-bold text-xl leading-tight flex-1 break-words">
              {name.trim() || <span className="text-muted-foreground italic text-base">İsim</span>}
            </span>
            <div className="text-right shrink-0">
              {discount.trim() && (
                <div className="text-xs text-muted-foreground line-through font-mono">{discount.trim()}</div>
              )}
              <span className="font-mono font-bold text-primary text-lg">{price.trim() || "—"}</span>
            </div>
          </div>
        </div>
        {/* Inputs */}
        <div className="p-5 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İsim</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && save()}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Ürün adı"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Fiyat</label>
            <input
              value={price} onChange={e => setPrice(e.target.value)}
              onKeyDown={e => e.key === "Enter" && save()}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary transition-colors"
              placeholder="150 ₺"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İndirim / Eski Fiyat</label>
              {discount && (
                <button onClick={() => setDiscount("")}
                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors">
                  Kaldır
                </button>
              )}
            </div>
            <input
              value={discount} onChange={e => setDiscount(e.target.value)}
              onKeyDown={e => e.key === "Enter" && save()}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary transition-colors"
              placeholder="Opsiyonel — 200 ₺"
            />
          </div>
        </div>
        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={save} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {busy ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-bold text-sm hover:bg-secondary transition-colors">
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dual-price item editor (name · desc · price1 · discount1 · price2 · discount2) ─

function DualPriceItemEditor({ item, onClose, onSaved }: {
  item: AItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(item.price);
  const [priceNote, setPriceNote] = useState(item.priceNote ?? "");
  const [price2, setPrice2] = useState(item.price2 ?? "");
  const [priceNote2, setPriceNote2] = useState(item.priceNote2 ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api("PATCH", `/menu/items/${item.id}`, {
        name: name.trim(),
        description: description.trim() || null,
        price: price.trim(),
        priceNote: priceNote.trim() || null,
        price2: price2.trim() || null,
        priceNote2: priceNote2.trim() || null,
      });
      onSaved();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="modal-enter relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Live preview */}
        <div className="px-6 pt-6 pb-5 border-b border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base leading-tight">
                {name.trim() || <span className="text-muted-foreground italic">İsim</span>}
              </div>
              {description.trim() && <div className="text-xs text-muted-foreground mt-0.5">{description.trim()}</div>}
            </div>
            <div className="shrink-0 text-right">
              <div className="flex items-baseline justify-end gap-1.5">
                {priceNote.trim() && <span className="text-[10px] text-muted-foreground line-through font-mono">{priceNote.trim()}</span>}
                <span className="font-mono font-bold text-primary text-base">{price.trim() || "—"}</span>
              </div>
              {price2.trim() && (
                <div className="flex items-baseline justify-end gap-1.5">
                  {priceNote2.trim() && <span className="text-[10px] text-muted-foreground line-through font-mono">{priceNote2.trim()}</span>}
                  <span className="font-mono font-bold text-primary text-xs">{price2.trim()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Inputs */}
        <div className="p-5 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İsim</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Ürün adı" autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Açıklama</label>
            <input value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Opsiyonel" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">1. Fiyat</label>
              <input value={price} onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                placeholder="150 ₺" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İndirim 1</label>
                {priceNote && <button onClick={() => setPriceNote("")} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Kaldır</button>}
              </div>
              <input value={priceNote} onChange={e => setPriceNote(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                placeholder="Eski fiyat" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">2. Fiyat</label>
              <input value={price2} onChange={e => setPrice2(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                placeholder="Opsiyonel" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İndirim 2</label>
                {priceNote2 && <button onClick={() => setPriceNote2("")} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Kaldır</button>}
              </div>
              <input value={priceNote2} onChange={e => setPriceNote2(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                placeholder="Opsiyonel" />
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={save} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {busy ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-bold text-sm hover:bg-secondary transition-colors">
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Property item editor (left text · right text) ───────────────────────────

function PropertyItemEditor({ item, onClose, onSaved }: {
  item: AItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [left, setLeft] = useState(item.name);
  const [right, setRight] = useState(item.description ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api("PATCH", `/menu/items/${item.id}`, {
        name: left.trim(),
        description: right.trim() || null,
      });
      onSaved();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="modal-enter relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Live preview */}
        <div className="px-6 pt-6 pb-5 border-b border-border/50">
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="text-muted-foreground font-medium flex-1">
              {left.trim() || <span className="italic opacity-40">Sol yazı</span>}
            </span>
            <span className="font-bold shrink-0">
              {right.trim() || <span className="italic opacity-40">Sağ yazı</span>}
            </span>
          </div>
        </div>
        {/* Inputs */}
        <div className="p-5 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sol Yazı</label>
            <input
              value={left} onChange={e => setLeft(e.target.value)}
              onKeyDown={e => e.key === "Enter" && save()}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Pazartesi"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sağ Yazı</label>
            <input
              value={right} onChange={e => setRight(e.target.value)}
              onKeyDown={e => e.key === "Enter" && save()}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Levrek"
            />
          </div>
        </div>
        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={save} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {busy ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-bold text-sm hover:bg-secondary transition-colors">
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── With-description item editor (name · desc · price · discount) ───────────

function WithDescItemEditor({ item, onClose, onSaved }: {
  item: AItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(item.price);
  const [discount, setDiscount] = useState(item.priceNote ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api("PATCH", `/menu/items/${item.id}`, {
        name: name.trim(),
        description: description.trim() || null,
        price: price.trim(),
        priceNote: discount.trim() || null,
      });
      onSaved();
    } catch (e) {
      alert(`Hata: ${e instanceof Error ? e.message : e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="modal-enter relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Live preview */}
        <div className="px-6 pt-6 pb-5 border-b border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xl leading-tight break-words">
                {name.trim() || <span className="text-muted-foreground italic text-base">İsim</span>}
              </div>
              {description.trim() && (
                <div className="text-xs text-muted-foreground mt-1">{description.trim()}</div>
              )}
            </div>
            <div className="text-right shrink-0 pt-0.5">
              {discount.trim() && (
                <div className="text-xs text-muted-foreground line-through font-mono">{discount.trim()}</div>
              )}
              <div className="font-mono font-bold text-primary text-lg">{price.trim() || "—"}</div>
            </div>
          </div>
        </div>
        {/* Inputs */}
        <div className="p-5 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İsim</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Ürün adı"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Açıklama</label>
            <input
              value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="Opsiyonel"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Fiyat</label>
              <input
                value={price} onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                placeholder="150 ₺"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">İndirim</label>
                {discount && (
                  <button onClick={() => setDiscount("")}
                    className="text-[10px] text-red-400 hover:text-red-300 transition-colors">
                    Kaldır
                  </button>
                )}
              </div>
              <input
                value={discount} onChange={e => setDiscount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                placeholder="Eski fiyat"
              />
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={save} disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {busy ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-bold text-sm hover:bg-secondary transition-colors">
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Center modal ─────────────────────────────────────────────────────────────

function Panel({ title, onClose, onSave, onDelete, busy, children }: {
  title: string; onClose: () => void; onSave?: () => void; onDelete?: () => void; busy: boolean; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="modal-enter relative w-full max-w-lg bg-card border border-border rounded-2xl flex flex-col max-h-[88vh] shadow-2xl shadow-black/60">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between shrink-0">
          <h2 className="font-font-heading text-lg font-bold uppercase tracking-wider">{title}</h2>
          <button onClick={onClose} className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Icon icon="solar:close-square-bold" width={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>
        <div className="border-t border-border px-5 py-4 flex gap-3 shrink-0">
          {onSave && (
            <button onClick={onSave} disabled={busy}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {busy ? "Kaydediliyor..." : "Kaydet"}
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} disabled={busy}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-colors border border-red-500/20">
              Sil
            </button>
          )}
          <button onClick={onClose} className={`py-2.5 rounded-xl bg-muted text-muted-foreground font-bold text-sm hover:bg-secondary transition-colors ${onSave ? "px-5" : "flex-1"}`}>
            {onSave ? "İptal" : "Kapat"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Visual variant picker ────────────────────────────────────────────────────

const VARIANT_DEFS: { value: string; label: string; preview: React.ReactNode }[] = [
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

function VariantPicker({ value, onChange, only }: { value: string; onChange: (v: string) => void; only?: string[] }) {
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

// ─── Inline add buttons ───────────────────────────────────────────────────────

function AddItemBtn({ onClick }: { onClick: () => void }) {
  return <AddLine onClick={onClick} />;
}

function AddLine({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick(); }}
      className="group/add w-full flex items-center gap-2 py-2 transition-opacity">
      <div className="flex-1 h-px bg-border/40 group-hover/add:bg-primary/50 transition-colors" />
      <span className="text-muted-foreground/40 group-hover/add:text-primary text-sm leading-none transition-colors select-none">+</span>
      <div className="flex-1 h-px bg-border/40 group-hover/add:bg-primary/50 transition-colors" />
    </button>
  );
}

// ─── Rich text description box ───────────────────────────────────────────────

const COLORS = ["#ffffff", "#a1a1aa", "#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#c084fc"];

function DescriptionBox({ group, onSave }: {
  group: AGroup;
  onSave: (groupId: string, html: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [, setTick] = useState(0);

  const editor = useEditor({
    onTransaction: () => setTick(t => t + 1),
    onSelectionUpdate: () => setTick(t => t + 1),
    extensions: [
      StarterKit.configure({ paragraph: { HTMLAttributes: { style: "margin: 0" } } }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: group.descriptionText ?? "",
    editable: editing,
    editorProps: {
      attributes: { class: "outline-none text-xs focus:outline-none" },
    },
  });

  useEffect(() => {
    editor?.setEditable(editing);
    if (editing) editor?.commands.focus("end");
  }, [editing, editor]);

  const handleSave = async () => {
    const html = editor?.getHTML() ?? "";
    setEditing(false);
    await onSave(group.id, html);
  };

  return (
    <div className={`rounded-xl bg-card border transition-colors ${editing ? "border-primary/60 ring-2 ring-primary/20" : "border-border hover:border-primary/50 hover:bg-primary/10"}`}>
      {editing && (
        <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-border/60">
          <select onMouseDown={e => e.stopPropagation()}
            value={editor?.getAttributes("textStyle").fontFamily ? "heading" : ""}
            onChange={e => {
              if (e.target.value === "heading") {
                editor?.chain().focus().setMark("textStyle", { fontFamily: "var(--font-bebas)", letterSpacing: "0.05em", textTransform: "uppercase" }).run();
              } else {
                editor?.chain().focus().setMark("textStyle", { fontFamily: null, letterSpacing: null, textTransform: null }).run();
              }
            }}
            className="h-6 rounded bg-muted border-0 text-xs text-foreground px-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40">
            <option value="">Sans</option>
            <option value="heading" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.05em" }}>Heading</option>
          </select>
          <div className="w-px h-4 bg-border/60 mx-0.5" />
          <select onMouseDown={e => e.stopPropagation()}
            value={editor?.getAttributes("textStyle").fontSize ?? ""}
            onChange={e => { e.target.value ? editor?.chain().focus().setMark("textStyle", { fontSize: e.target.value }).run() : editor?.chain().focus().unsetMark("textStyle").run(); }}
            className="h-6 rounded bg-muted border-0 text-xs text-foreground px-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40">
            <option value="">—</option>
            {["10px","11px","12px","13px","14px","16px","18px","20px","24px","28px","32px","36px"].map(s => (
              <option key={s} value={s}>{s.replace("px","")}</option>
            ))}
          </select>
          <div className="w-px h-4 bg-border/60 mx-0.5" />
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }}
            className={`px-2 py-1 rounded text-xs font-bold transition-all ${editor?.isActive("bold") ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>B</button>
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }}
            className={`px-2 py-1 rounded text-xs italic transition-all ${editor?.isActive("italic") ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>I</button>
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleUnderline().run(); }}
            className={`px-2 py-1 rounded text-xs underline transition-all ${editor?.isActive("underline") ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>U</button>
          <div className="w-px h-4 bg-border/60 mx-0.5" />
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().setTextAlign("left").run(); }}
            className={`px-2 py-1 rounded text-xs transition-all ${editor?.isActive({ textAlign: "left" }) ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <Icon icon="solar:align-left-bold" width={12} /></button>
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().setTextAlign("center").run(); }}
            className={`px-2 py-1 rounded text-xs transition-all ${editor?.isActive({ textAlign: "center" }) ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <Icon icon="solar:align-center-bold" width={12} /></button>
          <button onMouseDown={e => { e.preventDefault(); editor?.chain().focus().setTextAlign("right").run(); }}
            className={`px-2 py-1 rounded text-xs transition-all ${editor?.isActive({ textAlign: "right" }) ? "bg-primary text-primary-foreground ring-1 ring-primary/60" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <Icon icon="solar:align-right-bold" width={12} /></button>
          <div className="w-px h-4 bg-border/60 mx-0.5" />
          {COLORS.map(c => (
            <button key={c} onMouseDown={e => { e.preventDefault(); editor?.chain().focus().setColor(c).run(); }}
              className={`size-4 rounded-full transition-all ${editor?.isActive("textStyle", { color: c }) ? "scale-125 ring-2 ring-white/70 ring-offset-1 ring-offset-card" : "border border-white/10 hover:scale-110"}`}
              style={{ background: c }} />
          ))}
          <div className="flex-1" />
          <button onMouseDown={e => { e.preventDefault(); handleSave(); }}
            className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
            Kaydet
          </button>
          <button onMouseDown={e => { e.preventDefault(); setEditing(false); editor?.commands.setContent(group.descriptionText ?? ""); }}
            className="px-3 py-1 rounded bg-muted text-muted-foreground text-xs hover:bg-secondary transition-colors">
            İptal
          </button>
        </div>
      )}
      <div onClick={() => !editing && setEditing(true)} className={`px-4 py-5 ${!editing ? "cursor-pointer" : "cursor-text"}`}>
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <span className="text-xs opacity-35">Tıkla ve düzenle…</span>
        )}
      </div>
    </div>
  );
}

// ─── Context menu popup ───────────────────────────────────────────────────────

function CtxMenuPopup({ ctx, onEdit, onReorder, onDelete, onToggleStock, onClose }: {
  ctx: NonNullable<CtxMenu>;
  onEdit: () => void;
  onReorder: () => void;
  onDelete?: () => void;
  onToggleStock?: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const id = window.setTimeout(() => window.addEventListener("click", onClose), 0);
    window.addEventListener("scroll", onClose, { passive: true });
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("click", onClose);
      window.removeEventListener("scroll", onClose);
    };
  }, [onClose]);

  const x = Math.min(ctx.x + 8, window.innerWidth - 185);
  const y = Math.min(ctx.y - 10, window.innerHeight - 130);
  const isOutOfStock = ctx.target === "item" && !ctx.item.isVisible;

  const btn = "flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -6 }}
      transition={{ duration: 0.13, ease: [0.16, 1, 0.3, 1] }}
      className="fixed z-[60] bg-card border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden min-w-[175px] py-1"
      style={{ left: x, top: y }}
      onClick={e => e.stopPropagation()}
    >
      <button onClick={onEdit} className={`${btn} hover:bg-primary/10 hover:text-primary`}>
        <Icon icon="solar:pen-bold" width={14} /> Düzenle
      </button>
      {(ctx.target === "item" || ctx.target === "section" || ctx.canReorder) && (
        <button onClick={onReorder} className={`${btn} hover:bg-primary/10 hover:text-primary`}>
          <Icon icon="solar:sort-vertical-bold" width={14} /> Yerini Değiştir
        </button>
      )}
      {onToggleStock && (
        <>
          <div className="h-px bg-border/40 mx-3" />
          <button onClick={onToggleStock} className={`${btn} hover:bg-amber-500/10 hover:text-amber-400`}>
            <Icon icon={isOutOfStock ? "solar:box-bold" : "solar:box-minimalistic-bold"} width={14} />
            {isOutOfStock ? "Stokta Var" : "Stokta Bitti"}
          </button>
        </>
      )}
      {onDelete && (
        <>
          <div className="h-px bg-border/40 mx-3" />
          <button onClick={onDelete} className={`${btn} hover:bg-red-500/10 hover:text-red-400`}>
            <Icon icon="solar:trash-bin-trash-bold" width={14} /> Sil
          </button>
        </>
      )}
    </motion.div>
  );
}

// ─── Reorder panels (dnd-kit) ─────────────────────────────────────────────────

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

function ReorderItems({ group, onDone }: { group: AGroup; onDone: () => void }) {
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

function ReorderGroups({ section, colStart, cardGroup, onDone }: { section: ASection; colStart: number; cardGroup: string | null; onDone: () => void }) {
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

function ReorderSections({ sections, onDone }: { sections: ASection[]; onDone: () => void }) {
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

// ─── Inline group title ───────────────────────────────────────────────────────

function InlineGroupTitle({ group, className, onSaved, onOverrideClick }: {
  group: AGroup; className: string; onSaved: () => void;
  onOverrideClick?: (e: React.MouseEvent) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(group.title ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const commit = async () => {
    setEditing(false);
    const trimmed = value.trim();
    if (!trimmed || trimmed === group.title) return;
    await api("PATCH", `/menu/groups/${group.id}`, { title: trimmed }).catch(() => {});
    onSaved();
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === "Enter") { e.preventDefault(); void commit(); }
          if (e.key === "Escape") { setValue(group.title ?? ""); setEditing(false); }
        }}
        onClick={e => e.stopPropagation()}
        className={`${className} bg-transparent border-b border-primary/60 outline-none`}
        style={{ width: `${Math.max(value.length, 4)}ch` }}
      />
    );
  }

  return (
    <span
      onClick={e => {
        if (onOverrideClick) { onOverrideClick(e); return; }
        e.stopPropagation();
        setEditing(true);
      }}
      className={`${className} ${onOverrideClick ? "cursor-pointer" : "cursor-text hover:opacity-70"} transition-opacity`}
    >
      {group.title ?? "—"}
    </span>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ section, onCtx }: { section: ASection | undefined; onCtx: (e: React.MouseEvent) => void }) {
  if (!section) return null;
  return (
    <button onClick={onCtx} className="w-full flex items-center justify-between border-b-2 border-primary pb-3 text-left px-3 -mx-3">
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


// ─── Item row (variant-aware) ──────────────────────────────────────────────────

const baseRow = "flex items-center cursor-pointer hover:bg-primary/10 hover:text-primary rounded px-1.5 -mx-1.5 transition-colors";

function ItemRow({ item, groupVariant, onCtx }: { item: AItem; groupVariant: string; onCtx: (e: React.MouseEvent, i: AItem) => void }) {
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

  // simple / with-description / with-pricenote-below / simple-borderless
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

function CardItem({ item, onCtx }: { item: AItem; onCtx: (e: React.MouseEvent, i: AItem) => void }) {
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

function GroupCard({ group, onCtxItem, onCtxGroup, onAddItem, onSaved, inner = false, style }: {
  group: AGroup;
  onCtxItem: (e: React.MouseEvent, i: AItem) => void;
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

  const titleOverride = onCtxGroup;

  const body = (
    <>
      {group.title && (
        <div className={isBadgeTitle ? "mb-3" : `${group.titleBorderBottom ? "border-b border-border/80 pb-2" : ""} mb-3`}>
          {isBadgeTitle ? (
            <InlineGroupTitle group={group} onSaved={onSaved} className={badgeCls} onOverrideClick={titleOverride} />
          ) : (
            <div className="flex items-center gap-1.5">
              <InlineGroupTitle group={group} onSaved={onSaved} className="font-font-heading text-xl uppercase font-bold" onOverrideClick={titleOverride} />
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

// ─── Field pickers (DTO-safe, strips id/createdAt/updatedAt/parent keys) ──────

function pickItemFields(i: AItem) {
  return { name: i.name, description: i.description, price: i.price, priceNote: i.priceNote, price2: i.price2, priceNote2: i.priceNote2, badge: i.badge, itemVariant: i.itemVariant, sortOrder: i.sortOrder, isVisible: i.isVisible };
}

function pickGroupFields(g: AGroup) {
  return { title: g.title, subtitle: g.subtitle, descriptionText: g.descriptionText, sortOrder: g.sortOrder, isVisible: g.isVisible, groupType: g.groupType, colStart: g.colStart, colSpan: g.colSpan, borderHighlight: g.borderHighlight, cornerBadge: g.cornerBadge, glowEffect: g.glowEffect, titleStyle: g.titleStyle, titleNote: g.titleNote, titleRightIcon: g.titleRightIcon, titleRightLabel: g.titleRightLabel, titleRightBadge: g.titleRightBadge, titleBorderBottom: g.titleBorderBottom, itemVariant: g.itemVariant, itemLayout: g.itemLayout, itemSize: g.itemSize, cardGroup: g.cardGroup };
}

function pickSectionFields(s: ASection) {
  return { title: s.title, subtitle: s.subtitle, icon: s.icon, badge: s.badge, sortOrder: s.sortOrder, isVisible: s.isVisible };
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const withLoading = useLoading();
  const [sections, setSections] = useState<ASection[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [ctx, setCtx] = useState<CtxMenu>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<FormHandle | null>(null);

  const [publishState, setPublishState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [changesList, setChangesList] = useState<MenuChangeEntry[] | null>(null);
  const [showChanges, setShowChanges] = useState(false);
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);
  const pubFlatMap = useRef<Map<string, { label: string; context: string; raw: unknown }>>(new Map());

  const hasChanges = changesList === null || changesList.length > 0;

  const recomputeMenuDiff = useCallback((current: ASection[], snapshot: ASection[]) => {
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
    setChangesList(result);
  }, []);

  const handlePublish = async () => {
    setPublishState("loading");
    try {
      await withLoading(async () => {
        const freshRes = await fetch(`${BASE}/menu/admin`, { headers: { "x-admin-key": ADMIN_KEY }, cache: "no-store" });
        const freshData = await freshRes.json();
        const hash = hashData(freshData);
        await fetch(`${BASE}/site-config`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
          body: JSON.stringify({ menuHash: hash, menuSnapshot: JSON.stringify(freshData) }),
        });
        fetch(
          `${process.env.NEXT_PUBLIC_WEB_URL}/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}&tag=menu`,
          { method: "POST" },
        ).catch(() => {});
        // Sync published snapshot refs
        recomputeMenuDiff(freshData as ASection[], freshData as ASection[]); // same = zero diff
      });
      setPublishState("ok");
      setShowChanges(false);
    } catch {
      setPublishState("err");
    }
    setTimeout(() => setPublishState("idle"), 3000);
  };

  const pubSnapshotRef = useRef<ASection[]>([]);

  const reload = () => {
    withLoading(async () => {
      const [menuRes, cfgRes] = await Promise.all([
        fetch(`${BASE}/menu/admin`, { headers: { "x-admin-key": ADMIN_KEY }, cache: "no-store" }),
        fetch(`${BASE}/site-config`, { cache: "no-store" }),
      ]);
      const data = await menuRes.json();
      const cfg = cfgRes.ok ? await cfgRes.json() : null;
      if (Array.isArray(data)) {
        setSections(data as ASection[]);
        if (cfg?.menuSnapshot) {
          pubSnapshotRef.current = JSON.parse(cfg.menuSnapshot) as ASection[];
          recomputeMenuDiff(data as ASection[], pubSnapshotRef.current);
        } else {
          pubSnapshotRef.current = [];
          setChangesList(null);
        }
        setSnapshotLoaded(true);
      }
    }).catch(() => {});
  };

  const reloadAndMark = () => { reload(); };
  const handleReset = async () => {
    if (!pubSnapshotRef.current.length) { reload(); return; }
    try {
      await withLoading(async () => {
        const ops: Promise<unknown>[] = [];

        // ── Items ──────────────────────────────────────────────────────────
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

        // ── Groups ─────────────────────────────────────────────────────────
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

        // ── Sections ───────────────────────────────────────────────────────
        const pubSections = new Map(pubSnapshotRef.current.map(s => [s.id, s]));
        const curSections = new Map((sections as ASection[]).map(s => [s.id, s]));
        for (const [id, pub] of pubSections) {
          const cur = curSections.get(id);
          if (!cur) continue;
          if (hashData(pickSectionFields(cur)) === hashData(pickSectionFields(pub))) continue;
          ops.push(api("PATCH", `/menu/sections/${id}`, pickSectionFields(pub)));
        }

        await Promise.all(ops);
        reload();
      });
    } catch (e) {
      alert(`Sıfırla hatası: ${e instanceof Error ? e.message : e}`);
    }
  };

  useEffect(reload, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    if (!modal) return;
    const data = formRef.current?.getData() ?? {};
    setBusy(true);
    try {
      await withLoading(async () => {
        if (modal.type === "add-section") await api("POST", "/menu/sections", data);
        else if (modal.type === "edit-section") await api("PATCH", `/menu/sections/${modal.section.id}`, data);
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
      setModal({ type: "reorder-sections" });
    } else if (ctx.target === "item") {
      for (const s of sections) {
        const g = s.groups.find(g => g.id === ctx.groupId);
        if (g) { setModal({ type: "reorder-items", group: g }); break; }
      }
    } else {
      const s = sections.find(s => s.id === ctx.sectionId);
      if (s) setModal({ type: "reorder-groups", section: s, colStart: ctx.group.colStart, cardGroup: ctx.group.cardGroup });
    }
    setCtx(null);
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

        {sections.map(section => (
          <section key={section.id} id={section.slug} data-sect className="space-y-6 scroll-mt-[120px]">
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

              // card-item: items are the grid cells themselves (e.g. bento)
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

              // Build render units grouped by column. Each column becomes one grid cell
              // containing a flex-col stack of cards — this way grid equalizes column heights
              // without forcing individual cards in different rows to match each other.
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

              // Group units by colStart so each visual column is one grid cell
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

      {/* Panel */}
      {modal && modal.type !== "simple-edit-item" && modal.type !== "desc-edit-item" && modal.type !== "dual-price-edit-item" && modal.type !== "property-edit-item" && (
        <Panel
          title={
            modal.type === "add-section" ? "Yeni Bölüm"
            : modal.type === "edit-section" ? "Bölüm Düzenle"
            : modal.type === "add-group" ? "Yeni Grup"
            : modal.type === "edit-group" ? "Grup Düzenle"
            : modal.type === "add-item" ? "Yeni Ürün"
            : modal.type === "edit-item" ? "Ürün Düzenle"
            : modal.type === "reorder-sections" ? "Bölüm Sıralaması"
          : modal.type === "reorder-items" ? `Sıralama — ${modal.group.title ?? "Grup"}`
            : `Sıralama — ${modal.section.title}`
          }
          onClose={() => setModal(null)}
          onSave={modal.type !== "reorder-items" && modal.type !== "reorder-groups" && modal.type !== "reorder-sections" ? save : undefined}
          onDelete={isEditModal ? del : undefined}
          busy={busy}
        >
          {modal.type === "add-section" && <SectionForm ref={formRef} />}
          {modal.type === "edit-section" && <SectionForm ref={formRef} init={modal.section} />}
          {modal.type === "add-group" && <GroupForm ref={formRef} />}
          {modal.type === "edit-group" && <GroupForm ref={formRef} init={modal.group} />}
          {modal.type === "add-item" && <ItemForm ref={formRef} />}
          {modal.type === "edit-item" && <ItemForm ref={formRef} init={modal.item} />}
          {modal.type === "reorder-sections" && <ReorderSections sections={sections} onDone={reloadAndMark} />}
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

      {/* Overlay to close changes panel on outside click */}
      {showChanges && (
        <div className="fixed inset-0 z-[49]" onClick={() => setShowChanges(false)} />
      )}

      {/* Fixed publish bar — always visible */}
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
