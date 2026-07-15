import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-brown-400">
      <Link href="/" className="flex items-center hover:text-pink-500">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.href ? (
            <Link href={item.href} className="hover:text-pink-500">
              {item.label}
            </Link>
          ) : (
            <span className="text-brown-600">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
