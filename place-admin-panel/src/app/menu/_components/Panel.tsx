import { Icon } from "@iconify/react";

export function Panel({ title, onClose, onSave, onDelete, busy, children }: {
  title: string;
  onClose: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  busy: boolean;
  children: React.ReactNode;
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
