import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cake, Scale, Ruler, Palette, Stethoscope, ShieldCheck } from "lucide-react";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { calculateAge, formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const { data: dog } = await supabaseAdmin
    .from("Dog")
    .select("*, weightHistory:WeightHistory(*), events:Event(*)")
    .eq("id", id)
    .eq("userId", session?.user?.id ?? "")
    .maybeSingle();

  if (!dog) notFound();

  // Ordina lo storico peso e gli eventi nel componente
  const weightHistory = (dog.weightHistory ?? []).sort(
    (a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const upcomingEvents = (dog.events ?? [])
    .filter((e: { date: string }) => new Date(e.date) >= new Date())
    .sort((a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "I miei cani", href: "/dashboard/cane" }, { label: dog.name }]} />

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl bg-beige-100">
          {dog.photo ? (
            <Image src={dog.photo} alt={dog.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🐩</div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-brown-600">{dog.name}</h1>
            {dog.sex && <Badge variant={dog.sex === "FEMMINA" ? "pink" : "blue"}>{dog.sex}</Badge>}
          </div>
          <p className="mt-1 text-brown-400">{dog.breed}</p>
          {dog.character && <p className="mt-3 max-w-xl text-brown-500">{dog.character}</p>}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-brown-500">
            {dog.birthDate && (
              <span className="flex items-center gap-1">
                <Cake className="h-4 w-4" /> {calculateAge(dog.birthDate)}
              </span>
            )}
            {dog.weight && (
              <span className="flex items-center gap-1">
                <Scale className="h-4 w-4" /> {dog.weight} kg
              </span>
            )}
            {dog.height && (
              <span className="flex items-center gap-1">
                <Ruler className="h-4 w-4" /> {dog.height} cm
              </span>
            )}
            {dog.color && (
              <span className="flex items-center gap-1">
                <Palette className="h-4 w-4" /> {dog.color}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="h-5 w-5 text-pink-400" /> Salute
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-brown-500">
            <p>
              <strong>Veterinario:</strong> {dog.vet ?? "Non specificato"}
            </p>
            <p>
              <strong>Allergie:</strong> {dog.allergies ?? "Nessuna"}
            </p>
            <p>
              <strong>Farmaci:</strong> {dog.medications ?? "Nessuno"}
            </p>
            <p>
              <strong>Condizioni:</strong> {dog.conditions ?? "Nessuna"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-blue-400" /> Identificazione
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-brown-500">
            <p>
              <strong>Microchip:</strong> {dog.microchip ?? "Non registrato"}
            </p>
            <p>
              <strong>Assicurazione:</strong> {dog.insurance ?? "Nessuna"}
            </p>
          </CardContent>
        </Card>
      </div>

      {weightHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Andamento peso e altezza</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChart data={weightHistory} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Prossimi eventi</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-brown-400">Nessun evento in programma.</p>
          ) : (
            <ul className="space-y-2">
              {upcomingEvents.map((event: { id: string; title: string; date: string }) => (
                <li key={event.id} className="flex justify-between border-b border-beige-100 pb-2 text-sm">
                  <span className="font-medium text-brown-600">{event.title}</span>
                  <span className="text-brown-400">{formatDate(event.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {dog.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Note</CardTitle>
          </CardHeader>
          <CardContent className="text-brown-500">{dog.notes}</CardContent>
        </Card>
      )}

      <Link href="/dashboard/cane" className="text-sm text-pink-500 hover:underline">
        ← Torna ai miei cani
      </Link>
    </div>
  );
}
