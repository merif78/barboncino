import Link from "next/link";
import { Dog, Calendar, Utensils, Footprints } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DogCard } from "@/components/shared/dog-card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [dogs, upcomingEvents] = await Promise.all([
    userId
      ? prisma.dog.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
      : Promise.resolve([]),
    userId
      ? prisma.event.findMany({
          where: { userId, date: { gte: new Date() } },
          orderBy: { date: "asc" },
          take: 5,
          include: { dog: true },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brown-600">Ciao, {session?.user?.name ?? "amico"} 👋</h1>
        <p className="mt-1 text-brown-400">Ecco un riepilogo della vita dei tuoi barboncini</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Dog className="h-8 w-8 text-pink-400" />
            <div>
              <p className="text-2xl font-bold text-brown-600">{dogs.length}</p>
              <p className="text-xs text-brown-400">cani registrati</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Calendar className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-brown-600">{upcomingEvents.length}</p>
              <p className="text-xs text-brown-400">eventi in arrivo</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Utensils className="h-8 w-8 text-beige-500" />
            <div>
              <p className="text-2xl font-bold text-brown-600">-</p>
              <p className="text-xs text-brown-400">pasti registrati oggi</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Footprints className="h-8 w-8 text-brown-500" />
            <div>
              <p className="text-2xl font-bold text-brown-600">-</p>
              <p className="text-xs text-brown-400">passeggiate questa settimana</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-brown-600">I tuoi cani</h2>
          <Button asChild size="sm">
            <Link href="/dashboard/cane">Gestisci</Link>
          </Button>
        </div>
        {dogs.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-brown-400">
              Non hai ancora aggiunto nessun cane.{" "}
              <Link href="/dashboard/cane" className="text-pink-500 hover:underline">
                Aggiungine uno ora
              </Link>
              .
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dogs.map((dog) => (
              <DogCard
                key={dog.id}
                id={dog.id}
                name={dog.name}
                photo={dog.photo}
                breed={dog.breed}
                birthDate={dog.birthDate}
                weight={dog.weight}
                height={dog.height}
                sex={dog.sex}
              />
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prossimi eventi</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-brown-400">Nessun evento in programma.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="flex items-center justify-between border-b border-beige-100 pb-2">
                  <span className="font-medium text-brown-600">{event.title}</span>
                  <span className="text-sm text-brown-400">
                    {formatDate(event.date)} {event.dog ? `· ${event.dog.name}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
