"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { api, uploadImage, type Ingredient, type IngredientType } from "@/lib/api";

type FormState = {
  title: string;
  description: string;
  typeId: string;
  imageUrl: string;
  imageFile: File | null;
};

const EMPTY_FORM: FormState = { title: "", description: "", typeId: "", imageUrl: "", imageFile: null };

function ImagePicker({
  value,
  onChange,
}: {
  value: { url: string; file: File | null };
  onChange: (url: string, file: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const preview = value.file ? URL.createObjectURL(value.file) : value.url;

  function handleFile(file: File) {
    onChange(value.url, file);
  }

  return (
    <div
      onClick={() => ref.current?.click()}
      className="relative size-24 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 cursor-pointer overflow-hidden bg-secondary transition-colors group shrink-0"
    >
      {preview ? (
        <Image src={preview} alt="preview" fill className="object-cover" unoptimized={!!value.file} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <Icon icon="solar:camera-add-bold-duotone" width={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-[10px] text-muted-foreground font-medium">Add image</span>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

function Modal({
  title,
  onClose,
  onSave,
  types,
  initialData,
  saving,
}: {
  title: string;
  onClose: () => void;
  onSave: (form: FormState) => Promise<void>;
  types: IngredientType[];
  initialData?: Ingredient;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormState>(
    initialData
      ? { title: initialData.title, description: initialData.description, typeId: initialData.typeId, imageUrl: initialData.imageUrl ?? "", imageFile: null }
      : EMPTY_FORM,
  );

  function field(key: keyof Omit<FormState, "imageFile" | "imageUrl">, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const canSave = form.title.trim() && form.description.trim() && form.typeId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border/60 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/40">
          <h2 className="font-heading font-bold text-lg tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
            <Icon icon="solar:close-circle-bold" width={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <ImagePicker
              value={{ url: form.imageUrl, file: form.imageFile }}
              onChange={(url, file) => setForm((prev) => ({ ...prev, imageUrl: url, imageFile: file }))}
            />
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => field("title", e.target.value)}
                  placeholder="e.g. Lime Juice"
                  className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Type</label>
                <select
                  value={form.typeId}
                  onChange={(e) => field("typeId", e.target.value)}
                  className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                >
                  <option value="">Select type…</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
              placeholder="Describe this ingredient…"
              rows={3}
              className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/40 resize-none"
            />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!canSave || saving}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Icon icon="solar:refresh-bold" width={14} className="animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [types, setTypes] = useState<IngredientType[]>([]);
  const [modal, setModal] = useState<"add" | { edit: Ingredient } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [ing, typ] = await Promise.all([api.ingredients.list(), api.ingredientTypes.list()]);
    setIngredients(ing);
    setTypes(typ);
  }, []);

  useEffect(() => { void load(); }, [load]);

  function showError(err: unknown) {
    setError(err instanceof Error ? err.message : "Something went wrong");
    setTimeout(() => setError(null), 4000);
  }

  async function handleSave(form: FormState) {
    setSaving(true);
    try {
      let imageUrl = form.imageUrl || undefined;
      if (form.imageFile) {
        imageUrl = await uploadImage("ingredients", form.imageFile);
      }

      if (modal === "add") {
        const created = await api.ingredients.create({
          title: form.title,
          description: form.description,
          typeId: form.typeId,
          imageUrl,
        });
        setIngredients((prev) => [...prev, created].sort((a, b) => a.title.localeCompare(b.title)));
      } else if (modal && "edit" in modal) {
        const updated = await api.ingredients.update(modal.edit.id, {
          title: form.title,
          description: form.description,
          typeId: form.typeId,
          imageUrl: imageUrl ?? null,
        });
        setIngredients((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      }
      setModal(null);
    } catch (err) {
      showError(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(ingredient: Ingredient) {
    if (ingredient._count.cocktails > 0) {
      showError(`Cannot delete — used in ${ingredient._count.cocktails} cocktail(s)`);
      return;
    }
    try {
      await api.ingredients.delete(ingredient.id);
      setIngredients((prev) => prev.filter((i) => i.id !== ingredient.id));
    } catch (err) { showError(err); }
  }

  return (
    <>
      <header className="h-20 border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
        <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Ingredients</span>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all"
        >
          <Icon icon="solar:add-circle-bold" width={16} />
          Add Ingredient
        </button>
      </header>

      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 bg-secondary rounded-xl flex items-center justify-center">
            <Icon icon="solar:leaf-bold-duotone" width={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold tracking-tight">Ingredients</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20">
            {error}
          </div>
        )}

        {ingredients.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon icon="solar:leaf-bold-duotone" width={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm font-medium">No ingredients yet</p>
            <p className="text-xs mt-1 opacity-60">Click "Add Ingredient" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-border transition-colors group"
              >
                <div className="relative h-36 bg-secondary">
                  {ingredient.imageUrl ? (
                    <Image src={ingredient.imageUrl} alt={ingredient.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon icon="solar:leaf-bold-duotone" width={32} className="text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setModal({ edit: ingredient })}
                      className="size-8 bg-card/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon icon="solar:pen-bold-duotone" width={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(ingredient)}
                      className="size-8 bg-card/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" width={14} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-bold tracking-tight leading-tight">{ingredient.title}</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                      {ingredient.type.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{ingredient.description}</p>
                  {ingredient._count.cocktails > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                      Used in {ingredient._count.cocktails} cocktail{ingredient._count.cocktails !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal === "add" ? "Add Ingredient" : "Edit Ingredient"}
          onClose={() => { if (!saving) setModal(null); }}
          onSave={handleSave}
          types={types}
          initialData={modal !== "add" && "edit" in modal ? modal.edit : undefined}
          saving={saving}
        />
      )}
    </>
  );
}
