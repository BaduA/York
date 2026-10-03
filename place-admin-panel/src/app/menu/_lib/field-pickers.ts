import type { AItem, AGroup, ASection } from "./types";

export function pickItemFields(i: AItem) {
  return {
    name: i.name, description: i.description, price: i.price,
    priceNote: i.priceNote, price2: i.price2, priceNote2: i.priceNote2,
    badge: i.badge, itemVariant: i.itemVariant, sortOrder: i.sortOrder, isVisible: i.isVisible,
  };
}

export function pickGroupFields(g: AGroup) {
  return {
    title: g.title, subtitle: g.subtitle, descriptionText: g.descriptionText,
    sortOrder: g.sortOrder, isVisible: g.isVisible, groupType: g.groupType,
    colStart: g.colStart, colSpan: g.colSpan, borderHighlight: g.borderHighlight,
    cornerBadge: g.cornerBadge, glowEffect: g.glowEffect, titleStyle: g.titleStyle,
    titleNote: g.titleNote, titleRightIcon: g.titleRightIcon, titleRightLabel: g.titleRightLabel,
    titleRightBadge: g.titleRightBadge, titleBorderBottom: g.titleBorderBottom,
    itemVariant: g.itemVariant, itemLayout: g.itemLayout, itemSize: g.itemSize, cardGroup: g.cardGroup,
  };
}

export function pickSectionFields(s: ASection) {
  return {
    title: s.title, subtitle: s.subtitle, icon: s.icon,
    badge: s.badge, sortOrder: s.sortOrder, isVisible: s.isVisible,
  };
}
