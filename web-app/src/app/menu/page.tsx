import { MenuClient } from "./MenuClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export default async function MenuPage() {
  const [sectionsRes, pageRes] = await Promise.allSettled([
    fetch(`${API_BASE}/menu`, { cache: "force-cache", next: { tags: ["menu"] } }),
    fetch(`${API_BASE}/page-content/menu`, { cache: "force-cache", next: { tags: ["menu"] } }),
  ]);

  const initialSections =
    sectionsRes.status === "fulfilled" && sectionsRes.value.ok
      ? await sectionsRes.value.json()
      : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let initialHero: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let initialCards: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let initialCta: any = null;
  if (pageRes.status === "fulfilled" && pageRes.value.ok) {
    const d = await pageRes.value.json();
    initialHero  = d?.hero  ?? null;
    initialCards = d?.cards ?? [];
    initialCta   = d?.cta   ?? null;
  }

  return (
    <MenuClient
      initialSections={initialSections}
      initialHero={initialHero}
      initialCards={initialCards}
      initialCta={initialCta}
    />
  );
}
