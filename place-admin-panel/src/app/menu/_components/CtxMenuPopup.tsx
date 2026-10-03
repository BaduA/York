import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type { CtxMenu } from "../_lib/types";

export function CtxMenuPopup({ ctx, onEdit, onReorder, onDelete, onToggleStock, onClose }: {
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
      {(ctx.target === "item" || ctx.target === "section") && (
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
