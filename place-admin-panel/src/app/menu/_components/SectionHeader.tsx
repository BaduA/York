import { Icon } from "@iconify/react";
import type { ASection } from "../_lib/types";

function SectionIcon({ icon }: { icon: string }) {
  if (icon.startsWith("http")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={icon} alt="" className="w-full h-full object-cover" />;
  }
  return <Icon icon={icon} width={20} />;
}

export function SectionHeader({ section, onCtx }: { section: ASection | undefined; onCtx: (e: React.MouseEvent) => void }) {
  if (!section) return null;
  return (
    <button onClick={onCtx} className="group/sh w-full flex items-center justify-between border-b-2 border-primary pb-3 text-left rounded-t-lg transition-colors hover:bg-primary/5">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 transition-transform group-hover/sh:scale-110 overflow-hidden">
          <SectionIcon icon={section.icon} />
        </div>
        <div>
          <h2 className="font-font-heading text-3xl font-bold uppercase tracking-wider transition-colors group-hover/sh:text-primary">{section.title}</h2>
          {section.subtitle && <p className="text-xs text-muted-foreground">{section.subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {section.badge && <span className="text-xs font-font-mono uppercase tracking-widest text-primary font-bold">{section.badge}</span>}
        <Icon icon="solar:menu-dots-bold" width={14} className="text-muted-foreground/0 group-hover/sh:text-muted-foreground transition-colors" />
      </div>
    </button>
  );
}
