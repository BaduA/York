export type AItem = {
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

export type AGroup = {
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

export type ASection = {
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

export type MenuChangeEntry = {
  id: string;
  label: string;
  context: string;
  status: "added" | "updated" | "removed";
  details?: string[];
};

export type FormHandle = { getData: () => Record<string, unknown> };

export type ModalState =
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
  | { type: "reorder-sections" }
  | { type: "edit-card"; slot: number }
  | { type: "edit-cta" };

export type CtxMenu =
  | { target: "item"; item: AItem; groupId: string; x: number; y: number }
  | { target: "group"; group: AGroup; sectionId: string; x: number; y: number; canReorder: boolean }
  | { target: "section"; section: ASection; x: number; y: number }
  | null;

export type PageHero = {
  badgeText: string;
  headingMain: string;
  headingHighlight: string;
  description: string;
  pill1Icon: string | null;
  pill1Text: string | null;
  pill2Icon: string | null;
  pill2Text: string | null;
  pill3Icon: string | null;
  pill3Text: string | null;
};

export type PageCard = {
  slot: number;
  badgeLabel: string;
  title: string;
  description: string;
  imageUrl: string | null;
};

export type PageCta = {
  badgeText: string;
  headingMain: string;
  headingHighlight: string;
  description: string;
};

export type PageContent = {
  hero: PageHero;
  cards: PageCard[];
  cta: PageCta;
};
