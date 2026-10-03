import React, { useState } from "react";
import { Field, FT, FN, FC } from "./FormPrimitives";
import type { ASection, FormHandle } from "../_lib/types";

export const SectionForm = React.forwardRef<FormHandle, { init?: Partial<ASection> }>(({ init = {} }, ref) => {
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
