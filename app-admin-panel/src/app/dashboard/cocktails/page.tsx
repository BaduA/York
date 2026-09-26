"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { api, uploadImage, type Cocktail, type Ingredient, type IngredientType } from "@/lib/api";

type FormState = {
  title: string;
  maker: string;
  origin: "PREMADE" | "USER_MADE";
  imageUrl: string;
  imageFile: File | null;
  ingredientIds: string[];
};

const EMPTY_FORM: FormState = {
  title: "",
  maker: "",
  origin: "PREMADE",
  imageUrl: "",
  imageFile: null,
  ingredientIds: [],
};

function ImagePicker({
  value,
  onChange,
}: {
  value: { url: string; file: File | null };
  onChange: (url: string, file: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const preview = value.file ? URL.createObjectURL(value.file) : value.url;

  return (
    <div
      onClick={() => ref.current?.click()}
      className="relative w-full h-40 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 cursor-pointer overflow-hidden bg-secondary transition-colors group"
    >
      {preview ? (
        <Image src={preview} alt="preview" fill className="object-cover" unoptimized={!!value.file} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Icon icon="solar:camera-add-bold-duotone" width={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-xs text-muted-foreground font-medium">Add cocktail image</span>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(value.url, f); }}
      />
    </div>
  );
}

function IngredientSelector({
  selected,
  ingredients,
  types,
  onChange,
}: {
  selected: string[];
  ingredients: Ingredient[];
  types: IngredientType[];
  onChange: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);

  const filtered = ingredients.filter((i) => {
    const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = !activeType || i.typeId === activeType;
    return matchesSearch && matchesType;
  });

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Ingredients ({selected.length} selected)
      </label>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search ingredients…"
        className="w-full bg-input border border-border rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/40"
      />
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveType(null)}
          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full transition-all ${
            !activeType ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveType(activeType === t.id ? null : t.id)}
            className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full transition-all ${
              activeType === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No ingredients found</p>
        ) : (
          filtered.map((ingredient) => {
            const isSelected = selected.includes(ingredient.id);
            return (
              <button
                key={ingredient.id}
                onClick={() => toggle(ingredient.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all text-sm ${
                  isSelected ? "bg-primary/10 border border-primary/30" : "bg-secondary hover:bg-accent border border-transparent"
                }`}
              >
                <div className="relative size-7 rounded-lg overflow-hidden bg-background shrink-0">
                  {ingredient.imageUrl ? (
                    <Image src={ingredient.imageUrl} alt={ingredient.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon icon="solar:leaf-bold-duotone" width={14} className="text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{ingredient.title}</p>
                  <p className="text-[10px] text-muted-foreground">{ingredient.type.name}</p>
                </div>
                {isSelected && <Icon icon="solar:check-circle-bold" width={16} className="text-primary shrink-0" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  onSave,
  ingredients,
  types,
  initialData,
  saving,
}: {
  title: string;
  onClose: () => void;
  onSave: (form: FormState) => Promise<void>;
  ingredients: Ingredient[];
  types: IngredientType[];
  initialData?: Cocktail;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormState>(
    initialData
      ? {
          title: initialData.title,
          maker: initialData.maker,
          origin: initialData.origin,
          imageUrl: initialData.imageUrl ?? "",
          imageFile: null,
          ingredientIds: initialData.ingredients.map((i) => i.ingredient.id),
        }
      : EMPTY_FORM,
  );

  function field(key: keyof Omit<FormState, "imageFile" | "imageUrl" | "ingredientIds">, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const canSave = form.title.trim() && form.maker.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border/60 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/40 shrink-0">
          <h2 className="font-heading font-bold text-lg tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
            <Icon icon="solar:close-circle-bold" width={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <ImagePicker
            value={{ url: form.imageUrl, file: form.imageFile }}
            onChange={(url, file) => setForm((prev) => ({ ...prev, imageUrl: url, imageFile: file }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Title</label>
              <input
                value={form.title}
                onChange={(e) => field("title", e.target.value)}
                placeholder="e.g. Margarita"
                className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Maker</label>
              <input
                value={form.maker}
                onChange={(e) => field("maker", e.target.value)}
                placeholder="e.g. Classic Mexican"
                className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Origin</label>
            <div className="flex gap-2">
              {(["PREMADE", "USER_MADE"] as const).map((origin) => (
                <button
                  key={origin}
                  onClick={() => setForm((prev) => ({ ...prev, origin }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    form.origin === origin
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {origin === "PREMADE" ? "Pre-made" : "User-made"}
                </button>
              ))}
            </div>
          </div>

          <IngredientSelector
            selected={form.ingredientIds}
            ingredients={ingredients}
            types={types}
            onChange={(ids) => setForm((prev) => ({ ...prev, ingredientIds: ids }))}
          />
        </div>

        <div className="px-6 pb-6 flex gap-3 justify-end shrink-0 border-t border-border/40 pt-4">
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

export default function CocktailsPage() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [types, setTypes] = useState<IngredientType[]>([]);
  const [modal, setModal] = useState<"add" | { edit: Cocktail } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [c, i, t] = await Promise.all([
      api.cocktails.list(),
      api.ingredients.list(),
      api.ingredientTypes.list(),
    ]);
    setCocktails(c);
    setIngredients(i);
    setTypes(t);
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
        imageUrl = await uploadImage("cocktails", form.imageFile);
      }

      if (modal === "add") {
        const created = await api.cocktails.create({
          title: form.title,
          maker: form.maker,
          origin: form.origin,
          imageUrl,
          ingredientIds: form.ingredientIds,
        });
        setCocktails((prev) => [created, ...prev]);
      } else if (modal && "edit" in modal) {
        const updated = await api.cocktails.update(modal.edit.id, {
          title: form.title,
          maker: form.maker,
          origin: form.origin,
          imageUrl: imageUrl ?? null,
          ingredientIds: form.ingredientIds,
        });
        setCocktails((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      }
      setModal(null);
    } catch (err) {
      showError(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.cocktails.delete(id);
      setCocktails((prev) => prev.filter((c) => c.id !== id));
    } catch (err) { showError(err); }
  }

  return (
    <>
      <header className="h-20 border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
        <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Cocktails</span>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all"
        >
          <Icon icon="solar:add-circle-bold" width={16} />
          Add Cocktail
        </button>
      </header>

      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 bg-secondary rounded-xl flex items-center justify-center">
            <Icon icon="solar:cup-hot-bold-duotone" width={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold tracking-tight">Cocktails</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{cocktails.length} cocktail{cocktails.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20">
            {error}
          </div>
        )}

        {cocktails.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon icon="solar:cup-hot-bold-duotone" width={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm font-medium">No cocktails yet</p>
            <p className="text-xs mt-1 opacity-60">Click "Add Cocktail" to create the first one</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cocktails.map((cocktail) => (
              <div
                key={cocktail.id}
                className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-border transition-colors group"
              >
                <div className="relative h-44 bg-secondary">
                  {cocktail.imageUrl ? (
                    <Image src={cocktail.imageUrl} alt={cocktail.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon icon="solar:cup-hot-bold-duotone" width={36} className="text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        cocktail.origin === "PREMADE"
                          ? "bg-primary/90 text-primary-foreground"
                          : "bg-secondary/90 text-muted-foreground border border-border/60"
                      }`}
                    >
                      {cocktail.origin === "PREMADE" ? "Pre-made" : "User-made"}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setModal({ edit: cocktail })}
                      className="size-8 bg-card/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon icon="solar:pen-bold-duotone" width={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cocktail.id)}
                      className="size-8 bg-card/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" width={14} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold tracking-tight mb-0.5">{cocktail.title}</p>
                  <p className="text-xs text-muted-foreground mb-3">by {cocktail.maker}</p>
                  {cocktail.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cocktail.ingredients.slice(0, 4).map(({ ingredient }) => (
                        <span
                          key={ingredient.id}
                          className="text-[10px] font-semibold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full"
                        >
                          {ingredient.title}
                        </span>
                      ))}
                      {cocktail.ingredients.length > 4 && (
                        <span className="text-[10px] font-semibold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                          +{cocktail.ingredients.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={modal === "add" ? "Add Cocktail" : "Edit Cocktail"}
          onClose={() => { if (!saving) setModal(null); }}
          onSave={handleSave}
          ingredients={ingredients}
          types={types}
          initialData={modal !== "add" && "edit" in modal ? modal.edit : undefined}
          saving={saving}
        />
      )}
    </>
  );
}
