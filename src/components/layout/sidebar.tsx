"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dog,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  Scale,
  Utensils,
  Footprints,
  FileText,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Panoramica", icon: LayoutDashboard },
  { href: "/dashboard/cane", label: "I miei cani", icon: Dog },
  { href: "/dashboard/calendario", label: "Calendario", icon: Calendar },
  { href: "/dashboard/album", label: "Album foto", icon: ImageIcon },
  { href: "/dashboard/diario", label: "Diario", icon: BookOpen },
  { href: "/dashboard/peso", label: "Peso e crescita", icon: Scale },
  { href: "/dashboard/alimentazione", label: "Alimentazione", icon: Utensils },
  { href: "/dashboard/attivita", label: "Attività", icon: Footprints },
  { href: "/dashboard/documenti", label: "Documenti", icon: FileText },
  { href: "/dashboard/profilo", label: "Profilo", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-beige-200 bg-cream-50 md:block dark:bg-brown-700">
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-pink-100 text-pink-500"
                  : "text-brown-600 hover:bg-beige-100 dark:text-cream-200"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
