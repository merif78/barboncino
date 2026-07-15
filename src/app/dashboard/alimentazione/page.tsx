"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FoodLogForm } from "@/components/dashboard/food-log-form";
import { useDogs } from "@/hooks/use-dogs";
import { formatDate } from "@/lib/utils";

export default function AlimentazionePage() {
  const { dogs } = useDogs();
  const [selectedDog, setSelectedDog] = React.useState<string>("");
  const [logs, setLogs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (dogs.length > 0 && !selectedDog) setSelectedDog(dogs[0].id);
  }, [dogs, selectedDog]);

  const fetchLogs = React.useCallback(async (dogId: string) => {
    if (!dogId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/food-logs?dogId=${dogId}`);
      const data = await res.json();
      setLogs(data.logs ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (selectedDog) fetchLogs(selectedDog);
  }, [selectedDog, fetchLogs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brown-600">Alimentazione</h1>
        <p className="mt-1 text-brown-400">Registra pasti, snack e acqua del tuo barboncino</p>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Registro pasti</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-brown-400">Caricamento...</p>
            ) : logs.length === 0 ? (
              <p className="text-brown-400">Nessun pasto registrato ancora.</p>
            ) : (
              <ul className="space-y-2 text-sm text-brown-500">
                {logs.map((log) => (
                  <li key={log.id} className="flex flex-col border-b border-beige-100 pb-2">
                    <span className="font-medium text-brown-600">{formatDate(log.date)}</span>
                    <span>
                      {log.brand ?? "—"} · {log.grams ?? 0} g {log.snacks ? `· ${log.snacks}` : ""}{" "}
                      {log.water ? `· ${log.water} ml acqua` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuovo pasto</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDog && <FoodLogForm dogId={selectedDog} onSuccess={() => fetchLogs(selectedDog)} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
