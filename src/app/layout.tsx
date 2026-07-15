import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://barboncino.it"),
  title: {
    default: "Barboncino.it — Il portale italiano dedicato al barboncino",
    template: "%s | Barboncino.it",
  },
  description:
    "Guide, consigli e strumenti per prenderti cura del tuo barboncino: alimentazione, salute, toelettatura ed educazione.",
  keywords: ["barboncino", "poodle", "cani", "toelettatura", "alimentazione cani", "salute cani"],
  openGraph: {
    title: "Barboncino.it",
    description: "Il portale italiano dedicato interamente al mondo del barboncino.",
    url: "https://barboncino.it",
    siteName: "Barboncino.it",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
