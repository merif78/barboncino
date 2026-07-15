import type { Metadata } from "next";
import Link from "next/link";
import {
  Ruler,
  Utensils,
  Scissors,
  HeartPulse,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

import { Hero } from "@/components/shared/hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Scopri tutto sul barboncino: taglie, alimentazione, toelettatura, salute ed educazione. La guida completa in italiano.",
};

const breeds = [
  {
    name: "Toy",
    height: "fino a 28 cm",
    weight: "1,5 - 3 kg",
    description:
      "La taglia più piccola, ideale per appartamenti e vita cittadina. Estremamente affettuoso e legato al proprietario.",
  },
  {
    name: "Nano",
    height: "28 - 35 cm",
    weight: "4 - 7 kg",
    description:
      "Un compromesso perfetto tra dimensioni contenute e robustezza fisica, adatto anche alle famiglie con bambini.",
  },
  {
    name: "Medio",
    height: "35 - 45 cm",
    weight: "8 - 15 kg",
    description:
      "Più energico e resistente, richiede maggiore attività fisica quotidiana ma mantiene un carattere equilibrato.",
  },
  {
    name: "Grande (Royal)",
    height: "oltre 45 cm",
    weight: "20 - 30 kg",
    description:
      "La variante originaria da riporto acquatico. Atletico, intelligente e perfetto per famiglie con spazi ampi.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="container py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-brown-600 dark:text-cream-50">Le taglie del barboncino</h2>
          <p className="mt-2 text-brown-500 dark:text-cream-200">
            Scopri le quattro varianti riconosciute della razza
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {breeds.map((breed) => (
            <Card key={breed.name} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-2xl">
                  🐩
                </div>
                <CardTitle className="text-xl">{breed.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 flex items-center justify-center gap-1 text-sm text-brown-400">
                  <Ruler className="h-4 w-4" /> {breed.height} · {breed.weight}
                </p>
                <p className="text-sm text-brown-500">{breed.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-cream-100 py-16 dark:bg-brown-700">
        <div className="container grid gap-10 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2 text-pink-500">
              <Utensils className="h-6 w-6" />
              <h2 className="text-2xl font-bold text-brown-600 dark:text-cream-50">Alimentazione</h2>
            </div>
            <p className="text-brown-500 dark:text-cream-200">
              Una dieta equilibrata, calibrata sulla taglia e sull'età del cane, è la base per una vita
              lunga e sana. Scopri le nostre guide su crocchette, dieta casalinga e snack sicuri.
            </p>
            <Link href="/blog" className="mt-4 inline-flex items-center gap-1 font-medium text-pink-500">
              Leggi le guide <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-pink-500">
              <Scissors className="h-6 w-6" />
              <h2 className="text-2xl font-bold text-brown-600 dark:text-cream-50">Toelettatura</h2>
            </div>
            <p className="text-brown-500 dark:text-cream-200">
              Il pelo riccio del barboncino richiede cure costanti: spazzolatura regolare, bagni mensili
              e tagli professionali ogni 6-8 settimane per mantenerlo sano e in ordine.
            </p>
            <Link href="/blog" className="mt-4 inline-flex items-center gap-1 font-medium text-pink-500">
              Scopri come <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2 text-pink-500">
              <HeartPulse className="h-6 w-6" />
              <h2 className="text-2xl font-bold text-brown-600 dark:text-cream-50">Salute</h2>
            </div>
            <p className="text-brown-500 dark:text-cream-200">
              Vaccinazioni, controlli veterinari regolari e prevenzione delle patologie tipiche della
              razza aiutano il tuo barboncino a vivere fino a 18 anni in piena forma.
            </p>
            <Link href="/blog" className="mt-4 inline-flex items-center gap-1 font-medium text-pink-500">
              Approfondisci <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-pink-500">
              <GraduationCap className="h-6 w-6" />
              <h2 className="text-2xl font-bold text-brown-600 dark:text-cream-50">Educazione</h2>
            </div>
            <p className="text-brown-500 dark:text-cream-200">
              Grazie alla sua intelligenza, il barboncino impara rapidamente comandi e trucchi. Scopri i
              nostri consigli per un addestramento basato sul rinforzo positivo.
            </p>
            <Link href="/blog" className="mt-4 inline-flex items-center gap-1 font-medium text-pink-500">
              Inizia ad addestrare <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-pink-50 py-16 dark:bg-brown-600">
        <div className="container flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-brown-600 dark:text-cream-50">
            Gestisci tutto in un unico posto
          </h2>
          <p className="mt-2 max-w-xl text-brown-500 dark:text-cream-200">
            Crea un account gratuito e accedi alla tua dashboard personale: calendario eventi, diario,
            peso, alimentazione e molto altro.
          </p>
          <Link href="/auth/register" className="mt-6">
            <Button size="lg" variant="pink">
              Crea il tuo account
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
