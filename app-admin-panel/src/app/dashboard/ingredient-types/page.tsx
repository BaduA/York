"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { api, type IngredientType } from "@/lib/api";

function InlineEdit({
  value,
  onSave,
  onCancel,
}: {
  value: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => { e.preventDefault(); if (draft.trim()) onSave(draft.trim()); }}
    >
      <input
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onCancel()}
        className="bg-input border border-border rounded-xl px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30 w-48 text-foreground"
      />
      <button type="submit" className="text-primary hover:text-primary/80 transition-colors">
        <Icon icon="solar:check-circle-bold" width={18} />
      </button>
      <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
        <Icon icon="solar:close-circle-bold" width={18} />
      </button>
    </form>
  );
}

function AddRow({ onAdd }: { onAdd: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);

  if (!open) {
    return (
      <div className="px-5 py-3 border-t border-border/40">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon icon="solar:add-circle-bold-duotone" width={16} />
          Add type
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex items-center gap-2 px-5 py-3 border-t border-border/40"
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (trimmed) { onAdd(trimmed); setValue(""); setOpen(false); }
      }}
    >
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Escape") { setOpen(false); setValue(""); } }}
        placeholder="Type name…"
        className="bg-input border border-border rounded-xl px-3 py-1.5 text-sm font-semibold placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-primary/30 w-48 text-foreground"
      />
      <button type="submit" className="text-primary hover:text-primary/80 transition-colors">
        <Icon icon="solar:check-circle-bold" width={18} />
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setValue(""); }}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Icon icon="solar:close-circle-bold" width={18} />
      </button>
    </form>
  );
}

export default function IngredientTypesPage() {
  const [types, setTypes] = useState<IngredientType[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setTypes(await api.ingredientTypes.list());
  }, []);

  useEffect(() => { void load(); }, [load]);

  function showError(err: unknown) {
    setError(err instanceof Error ? err.message : "Something went wrong");
    setTimeout(() => setError(null), 4000);
  }

  async function handleAdd(name: string) {
    try {
      const item = await api.ingredientTypes.create(name);
      setTypes((prev) => [...prev, item].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) { showError(err); }
  }

  async function handleRename(id: string, name: string) {
    try {
      const item = await api.ingredientTypes.update(id, { name });
      setTypes((prev) => prev.map((t) => (t.id === id ? item : t)).sort((a, b) => a.name.localeCompare(b.name)));
      setEditing(null);
    } catch (err) { showError(err); }
  }

  async function handleDelete(id: string) {
    try {
      await api.ingredientTypes.delete(id);
      setTypes((prev) => prev.filter((t) => t.id !== id));
    } catch (err) { showError(err); }
  }

  return (
    <>
      <header className="h-20 border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center">
        <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Ingredient Types</span>
      </header>

      <div className="p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 bg-secondary rounded-xl flex items-center justify-center">
            <Icon icon="solar:tag-bold-duotone" width={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold tracking-tight">Ingredient Types</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Categorise your ingredients</p>
          </div>
        </div>

        {error && (
          <div className="mt-6 px-4 py-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20">
            {error}
          </div>
        )}

        <div className="mt-8 bg-card border border-border/60 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
            <p className="text-sm font-bold tracking-tight">{types.length} type{types.length !== 1 ? "s" : ""}</p>
          </div>

          <div className="divide-y divide-border/40">
            {types.length === 0 && (
              <p className="text-xs text-muted-foreground px-5 py-6 text-center">
                No ingredient types yet. Add one below.
              </p>
            )}

            {types.map((type) => {
              const isEditing = editing === type.id;
              return (
                <div key={type.id} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {isEditing ? (
                      <InlineEdit
                        value={type.name}
                        onSave={(name) => handleRename(type.id, name)}
                        onCancel={() => setEditing(null)}
                      />
                    ) : (
                      <>
                        <span className="text-sm font-semibold tracking-tight">{type.name}</span>
                        <span className="text-[11px] text-muted-foreground font-mono tabular-nums shrink-0">
                          {type._count.ingredients} ingredient{type._count.ingredients !== 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditing(type.id)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                      >
                        <Icon icon="solar:pen-bold-duotone" width={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        disabled={type._count.ingredients > 0}
                        title={type._count.ingredients > 0 ? `Used by ${type._count.ingredients} ingredient(s)` : "Delete"}
                        className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                      >
                        <Icon icon="solar:trash-bin-trash-bold-duotone" width={15} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <AddRow onAdd={handleAdd} />
        </div>
      </div>
    </>
  );
}
