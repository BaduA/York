"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { api } from "@/lib/api";

type Stats = {
  ingredientTypes: number;
  ingredients: number;
  cocktails: number;
  premade: number;
  userMade: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      api.ingredientTypes.list(),
      api.ingredients.list(),
      api.cocktails.list(),
    ]).then(([types, ingredients, cocktails]) => {
      setStats({
        ingredientTypes: types.length,
        ingredients: ingredients.length,
        cocktails: cocktails.length,
        premade: cocktails.filter((c) => c.origin === "PREMADE").length,
        userMade: cocktails.filter((c) => c.origin === "USER_MADE").length,
      });
    });
  }, []);

  const tiles = [
    { label: "Ingredient Types", value: stats?.ingredientTypes, icon: "solar:tag-bold-duotone", href: "/dashboard/ingredient-types" },
    { label: "Ingredients", value: stats?.ingredients, icon: "solar:leaf-bold-duotone", href: "/dashboard/ingredients" },
    { label: "Total Cocktails", value: stats?.cocktails, icon: "solar:cup-hot-bold-duotone", href: "/dashboard/cocktails" },
    { label: "Pre-made", value: stats?.premade, icon: "solar:stars-bold-duotone", href: "/dashboard/cocktails" },
    { label: "User-made", value: stats?.userMade, icon: "solar:user-bold-duotone", href: "/dashboard/cocktails" },
  ];

  return (
    <>
      <header className="h-20 border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
        <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Overview</span>
      </header>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening in your cocktail library</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {tiles.map((tile) => (
            <a
              key={tile.label}
              href={tile.href}
              className="bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/40 hover:bg-card/80 transition-all group"
            >
              <div className="size-10 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <Icon icon={tile.icon} width={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-3xl font-heading font-bold tracking-tight text-foreground">
                {tile.value ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{tile.label}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
