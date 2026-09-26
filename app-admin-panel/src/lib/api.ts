const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { headers: initHeaders, ...rest } = init ?? {};
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: { "Content-Type": "application/json", ...initHeaders },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { message?: string }).message ?? `Request failed (${res.status})`);
  return body as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type IngredientType = {
  id: string;
  name: string;
  createdAt: string;
  _count: { ingredients: number };
};

export type Ingredient = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  typeId: string;
  type: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  _count: { cocktails: number };
};

export type Cocktail = {
  id: string;
  title: string;
  maker: string;
  imageUrl: string | null;
  origin: "PREMADE" | "USER_MADE";
  createdAt: string;
  updatedAt: string;
  ingredients: { ingredient: { id: string; title: string; imageUrl: string | null; type: { id: string; name: string } } }[];
};

export type PresignResult = { uploadUrl: string; storeUrl: string };

// ─── API ──────────────────────────────────────────────────────────────────────

export const api = {
  ingredientTypes: {
    list: () => request<IngredientType[]>("/ingredient-types"),
    create: (name: string) =>
      request<IngredientType>("/ingredient-types", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    update: (id: string, data: { name?: string }) =>
      request<IngredientType>(`/ingredient-types/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/ingredient-types/${id}`, { method: "DELETE" }),
  },

  ingredients: {
    list: () => request<Ingredient[]>("/ingredients"),
    create: (data: { title: string; description: string; typeId: string; imageUrl?: string }) =>
      request<Ingredient>("/ingredients", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ title: string; description: string; typeId: string; imageUrl: string | null }>) =>
      request<Ingredient>(`/ingredients/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/ingredients/${id}`, { method: "DELETE" }),
  },

  cocktails: {
    list: () => request<Cocktail[]>("/cocktails"),
    create: (data: { title: string; maker: string; origin: "PREMADE" | "USER_MADE"; imageUrl?: string; ingredientIds?: string[] }) =>
      request<Cocktail>("/cocktails", { method: "POST", body: JSON.stringify(data) }),
    update: (
      id: string,
      data: Partial<{ title: string; maker: string; origin: "PREMADE" | "USER_MADE"; imageUrl: string | null; ingredientIds: string[] }>,
    ) => request<Cocktail>(`/cocktails/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/cocktails/${id}`, { method: "DELETE" }),
  },

  upload: {
    presign: (folder: "ingredients" | "cocktails", contentType: string) =>
      request<PresignResult>("/upload/presign", {
        method: "POST",
        body: JSON.stringify({ folder, contentType }),
      }),
  },
};

export async function uploadImage(
  folder: "ingredients" | "cocktails",
  file: File,
): Promise<string> {
  const { uploadUrl, storeUrl } = await api.upload.presign(folder, file.type);

  if (!uploadUrl) return storeUrl;

  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!res.ok) throw new Error("Image upload failed");

  return storeUrl;
}
