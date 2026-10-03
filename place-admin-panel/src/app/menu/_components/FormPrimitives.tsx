import { ic } from "../_lib/constants";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export function FT({ v, s, p }: { v: string; s: (x: string) => void; p?: string }) {
  return <input className={ic} value={v} onChange={e => s(e.target.value)} placeholder={p} />;
}

export function FS({ v, s, opts, empty }: { v: string; s: (x: string) => void; opts: string[]; empty?: string }) {
  return (
    <select className={ic} value={v} onChange={e => s(e.target.value)}>
      {empty !== undefined && <option value="">{empty || "—"}</option>}
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export function FC({ label, v, s }: { label: string; v: boolean; s: (x: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={v} onChange={e => s(e.target.checked)} className="w-4 h-4 accent-primary rounded" />
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function FN({ v, s, min = 0 }: { v: number; s: (x: number) => void; min?: number }) {
  return <input type="number" className={ic} value={v} onChange={e => s(Number(e.target.value))} min={min} />;
}
