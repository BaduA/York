import React, { useState } from "react";
import { Field, FT, FN, FC, FS } from "./FormPrimitives";
import { VariantPicker } from "./VariantPicker";
import { GROUP_TYPES, ic } from "../_lib/constants";
import type { AGroup, FormHandle } from "../_lib/types";

export const GroupForm = React.forwardRef<FormHandle, { init?: Partial<AGroup> }>(({ init = {} }, ref) => {
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
      titleBorderBottom, itemVariant, itemLayout,
    }),
  }), [title, subtitle, descText, sortOrder, isVisible, groupType, colStart, colSpan,
    borderHighlight, cornerBadge, glowEffect, titleStyle, titleNote, titleRightIcon,
    titleRightLabel, titleRightBadge, titleBorderBottom, itemVariant, itemLayout]);

  const isInner = !!init.cardGroup;
  const previewTitle = title || "Başlık";

  const TITLE_STYLE_OPTS = [
    { key: "plain", label: "Düz", preview: <span className="text-[11px] font-font-heading font-bold uppercase tracking-wider">{previewTitle}</span> },
    { key: "plain-border", label: "Alt Çizgili", preview: <span className="text-[11px] font-font-heading font-bold uppercase tracking-wider border-b border-border/70 pb-0.5">{previewTitle}</span> },
    { key: "badge-primary", label: "Kırmızı Rozet", preview: <span className="inline-block px-2 py-0.5 rounded bg-primary text-primary-foreground font-font-heading uppercase text-[10px] tracking-wider font-bold">{previewTitle}</span> },
    { key: "badge-secondary", label: "Koyu Rozet", preview: <span className="inline-block px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-font-heading uppercase text-[10px] tracking-wider font-bold">{previewTitle}</span> },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Temel</p>
        <Field label="Başlık"><FT v={title} s={setTitle} p="Buzzz Gibi Bira" /></Field>
        <Field label="Başlık Notu — başlığın yanında (4 pcs)"><FT v={titleNote} s={setTitleNote} p="4 pcs" /></Field>
        <Field label="Alt Başlık — başlığın altında küçük yazı"><FT v={subtitle} s={setSubtitle} p="Her gün taze..." /></Field>
        <FC label="Görünür" v={isVisible} s={setIsVisible} />
      </div>

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

      {(() => {
        const current = titleRightIcon ? "icon" : titleRightLabel ? "label" : titleRightBadge ? "badge" : "none";
        function pick(_type: string) { setTitleRightIcon(""); setTitleRightLabel(""); setTitleRightBadge(""); }
        return (
          <div className="space-y-3 border-t border-border/40 pt-4">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Sağ Taraf</p>
            <div className="flex gap-2">
              {[{ k: "none", label: "Yok" }, { k: "icon", label: "İkon" }, { k: "label", label: "Yazı" }, { k: "badge", label: "Rozet" }].map(opt => (
                <button key={opt.k} type="button" onClick={() => pick(opt.k)}
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

      {groupType !== "description-box" && (
        <div className="space-y-2 border-t border-border/40 pt-4">
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Başlık Altı Not</p>
          <p className="text-[11px] text-muted-foreground">Başlıktan sonra, itemlardan önce çıkan küçük açıklama satırı.</p>
          <textarea className={ic} value={descText} onChange={e => setDescText(e.target.value)} rows={2} placeholder="Her gün taze deniz ürünleri servisi — boşsa yok" />
        </div>
      )}

      <div className="space-y-3 border-t border-border/40 pt-4">
        <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Ürün Türü</p>
        <VariantPicker value={itemVariant} onChange={setItemVariant} only={VALID_GROUP_VARIANTS} />
        <div className="flex gap-2">
          {[{ v: "rows", label: "Tek Sıra" }, { v: "grid-2col", label: "Çift Sıra" }].map(opt => (
            <button key={opt.v} type="button" onClick={() => setItemLayout(opt.v)}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all ${itemLayout === opt.v ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40" : "border-border bg-background/40 text-muted-foreground hover:border-primary/40"}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

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
