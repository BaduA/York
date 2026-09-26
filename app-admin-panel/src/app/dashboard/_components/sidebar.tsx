"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const NAV = [
  { href: "/dashboard", icon: "solar:home-bold-duotone", label: "Overview", exact: true },
  { href: "/dashboard/ingredient-types", icon: "solar:tag-bold-duotone", label: "Ingredient Types", exact: false },
  { href: "/dashboard/ingredients", icon: "solar:leaf-bold-duotone", label: "Ingredients", exact: false },
  { href: "/dashboard/cocktails", icon: "solar:cup-hot-bold-duotone", label: "Cocktails", exact: false },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border/60 flex flex-col fixed h-full z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="size-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <Icon icon="solar:cup-star-bold-duotone" width={20} className="text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Maketail
          </span>
        </div>

        <nav className="space-y-1">
          {NAV.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon icon={item.icon} width={20} />
                <span className="tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border/60">
        <p className="text-[11px] text-muted-foreground font-mono text-center">Admin Panel v1</p>
      </div>
    </aside>
  );
}
