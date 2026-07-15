"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WalkForm } from "@/components/dashboard/walk-form";
import { useDogs } from "@/hooks/use-dogs";
import { formatDate } from "@/lib/utils";

export default function AttivitaPage() {
  const { dogs } = useDogs();
  const [selectedDog, setSelectedDog] = React.useState<string>("");
  const [walks, setWalks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (dogs.length > 0 && !selectedDog) setSelectedDog(dogs[0].id);
  }, [dogs, selectedDog]);

  const fetchWalks = React.useCallback(async (dogId: string) => {
    if (!dogId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/walks?dogId=${dogId}`);
      const data = await res.json();
      setWalks(data.walks ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (selectedDog) fetchWalks(selectedDog);
  }, [selectedDog, fetchWalks]);

  const totalDistance = walks.reduce((sum, w) => sum + (w.distance ?? 0), 0);
  const totalDuration = walks.reduce((sum, w) => sum + (w.duration ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brown-600">Attività e passeggiate</h1>
        <p className="mt-1 text-brown-400">Tieni traccia dell&apos;esercizio fisico quotidiano</p>
      </div>

      {dogs.length > 0 && (
        <Select value={selectedDog} onValueChange={setSelectedDog}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Seleziona cane" />
          </SelectTrigger>
          <SelectContent>
            {dogs.map((dog: any) => (
              <SelectItem key={dog.id} value={dog.id}>
                {dog.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-brown-600">{totalDistance.toFixed(1)} km</p>
            <p className="text-sm text-brown-400">distanza totale registrata</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-brown-600">{totalDuration} min</p>
            <p className="text-sm text-brown-400">tempo totale di passeggiata</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Storico attività</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-brown-400">Caricamento...</p>
            ) : walks.length === 0 ? (
              <p className="text-brown-400">Nessuna attività registrata ancora.</p>
            ) : (
              <ul className="space-y-2 text-sm text-brown-500">
                {walks.map((walk) => (
                  <li key={walk.id} className="flex flex-col border-b border-beige-100 pb-2">
                    <span className="font-medium text-brown-600">{formatDate(walk.date)}</span>
                    <span>
                      {walk.duration ?? 0} min · {walk.distance ?? 0} km{" "}
                      {walk.notes ? `· ${walk.notes}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuova attività</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDog && <WalkForm dogId={selectedDog} onSuccess={() => fetchWalks(selectedDog)} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
