"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { useDogs } from "@/hooks/use-dogs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { weightFormSchema, type WeightFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

export default function PesoPage() {
  const { dogs } = useDogs();
  const { toast } = useToast();
  const [selectedDog, setSelectedDog] = React.useState<string>("");
  const [history, setHistory] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (dogs.length > 0 && !selectedDog) {
      setSelectedDog(dogs[0].id);
    }
  }, [dogs, selectedDog]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WeightFormValues>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: { date: new Date().toISOString().slice(0, 10), dogId: selectedDog },
  });

  const fetchHistory = React.useCallback(async (dogId: string) => {
    if (!dogId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/dogs/${dogId}`);
      const data = await res.json();
      setHistory(data.dog?.weightHistory ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (selectedDog) fetchHistory(selectedDog);
  }, [selectedDog, fetchHistory]);

  const onSubmit = async (values: WeightFormValues) => {
    try {
      const res = await fetch("/api/weight-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, dogId: selectedDog }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Misurazione salvata" });
      reset({ date: new Date().toISOString().slice(0, 10), dogId: selectedDog });
      fetchHistory(selectedDog);
    } catch {
      toast({ title: "Errore", description: "Impossibile salvare la misurazione.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brown-600">Peso e crescita</h1>
        <p className="mt-1 text-brown-400">Monitora l&apos;andamento del peso e dell&apos;altezza</p>
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
            <CardTitle>Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-brown-400">Caricamento...</p>
            ) : history.length === 0 ? (
              <p className="text-brown-400">Nessuna misurazione registrata.</p>
            ) : (
              <>
                <WeightChart data={history} />
                <ul className="mt-4 space-y-1 text-sm text-brown-500">
                  {history
                    .slice()
                    .reverse()
                    .map((h) => (
                      <li key={h.id} className="flex justify-between border-b border-beige-100 py-1">
                        <span>{formatDate(h.date)}</span>
                        <span>
                          {h.weight} kg {h.height ? `· ${h.height} cm` : ""}
                        </span>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuova misurazione</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" {...register("date")} />
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" type="number" step="0.1" {...register("weight")} />
                {errors.weight && <p className="mt-1 text-xs text-red-500">{errors.weight.message}</p>}
              </div>
              <div>
                <Label htmlFor="height">Altezza (cm)</Label>
                <Input id="height" type="number" step="0.1" {...register("height")} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || !selectedDog}>
                Salva misurazione
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
