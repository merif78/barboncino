"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiaryEntry } from "@/components/dashboard/diary-entry";
import { useDogs } from "@/hooks/use-dogs";
import { useToast } from "@/hooks/use-toast";
import { diaryFormSchema, type DiaryFormValues } from "@/lib/validations";
import { MOOD_OPTIONS } from "@/types";

export default function DiarioPage() {
  const { dogs } = useDogs();
  const { toast } = useToast();
  const [entries, setEntries] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DiaryFormValues>({
    resolver: zodResolver(diaryFormSchema),
    defaultValues: { date: new Date().toISOString().slice(0, 10) },
  });

  const fetchEntries = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/diary");
      const data = await res.json();
      setEntries(data.entries ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const onSubmit = async (values: DiaryFormValues) => {
    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Voce di diario salvata" });
      reset();
      setOpen(false);
      fetchEntries();
    } catch {
      toast({ title: "Errore", description: "Impossibile salvare la voce.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brown-600">Diario</h1>
          <p className="mt-1 text-brown-400">Racconta le giornate insieme al tuo barboncino</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuova voce
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuova voce di diario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input id="date" type="date" {...register("date")} />
                </div>
                <div>
                  <Label>Umore</Label>
                  <Controller
                    control={control}
                    name="mood"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOOD_OPTIONS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.emoji} {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div>
                <Label>Cane</Label>
                <Controller
                  control={control}
                  name="dogId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
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
                />
              </div>
              <div>
                <Label htmlFor="content">Cosa è successo oggi?</Label>
                <Textarea id="content" rows={4} {...register("content")} />
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Salva voce
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-brown-400">Caricamento...</p>
      ) : entries.length === 0 ? (
        <p className="py-16 text-center text-brown-400">Nessuna voce di diario ancora scritta.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry: any) => (
            <DiaryEntry key={entry.id} date={entry.date} content={entry.content} mood={entry.mood} />
          ))}
        </div>
      )}
    </div>
  );
}
