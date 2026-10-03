import { Extension } from "@tiptap/core";

export const FontFamily = Extension.create({
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

export const FontSize = Extension.create({
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
