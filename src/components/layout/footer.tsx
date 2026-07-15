import Link from "next/link";
import { PawPrint, Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-beige-200 bg-cream-100 dark:bg-brown-700">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold text-brown-600 dark:text-cream-100">
            <PawPrint className="h-6 w-6 text-pink-400" />
            <span className="text-lg">Barboncino</span>
          </Link>
          <p className="mt-3 text-sm text-brown-500 dark:text-cream-200">
            Il portale italiano dedicato interamente al mondo del barboncino: salute, alimentazione,
            toelettatura ed educazione per una vita felice insieme.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="text-brown-500 hover:text-pink-500">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-brown-500 hover:text-pink-500">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="YouTube" className="text-brown-500 hover:text-pink-500">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-brown-600 dark:text-cream-100">Esplora</h3>
          <ul className="space-y-2 text-sm text-brown-500 dark:text-cream-200">
            <li><Link href="/blog" className="hover:text-pink-500">Blog</Link></li>
            <li><Link href="/community" className="hover:text-pink-500">Community</Link></li>
            <li><Link href="/faq" className="hover:text-pink-500">FAQ</Link></li>
            <li><Link href="/cerca" className="hover:text-pink-500">Cerca</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-brown-600 dark:text-cream-100">Account</h3>
          <ul className="space-y-2 text-sm text-brown-500 dark:text-cream-200">
            <li><Link href="/auth/login" className="hover:text-pink-500">Accedi</Link></li>
            <li><Link href="/auth/register" className="hover:text-pink-500">Registrati</Link></li>
            <li><Link href="/dashboard" className="hover:text-pink-500">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-brown-600 dark:text-cream-100">Contatti</h3>
          <ul className="space-y-2 text-sm text-brown-500 dark:text-cream-200">
            <li><Link href="/contatti" className="hover:text-pink-500">Scrivici</Link></li>
            <li>info@barboncino.it</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-beige-200 py-4">
        <p className="text-center text-xs text-brown-500 dark:text-cream-300">
          © {new Date().getFullYear()} Barboncino.it — Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
