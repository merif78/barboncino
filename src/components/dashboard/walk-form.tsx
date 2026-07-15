"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { walkFormSchema, type WalkFormValues } from "@/lib/validations";

interface WalkFormProps {
  dogId: string;
  onSuccess?: () => void;
}

export function WalkForm({ dogId, onSuccess }: WalkFormProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WalkFormValues>({
    resolver: zodResolver(walkFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      dogId,
    },
  });

  const onSubmit = async (values: WalkFormValues) => {
    try {
      const res = await fetch("/api/walks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Errore durante il salvataggio");
      toast({ title: "Attività registrata", description: "La passeggiata è stata aggiunta." });
      reset({ date: new Date().toISOString().slice(0, 10), dogId });
      onSuccess?.();
    } catch {
      toast({ title: "Errore", description: "Impossibile salvare l'attività.", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="date">Data</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Durata (minuti)</Label>
          <Input id="duration" type="number" step="1" {...register("duration")} />
        </div>
        <div>
          <Label htmlFor="distance">Distanza (km)</Label>
          <Input id="distance" type="number" step="0.1" {...register("distance")} />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Note</Label>
        <Textarea id="notes" placeholder="Com'è andata la passeggiata?" {...register("notes")} />
      </div>
      <Button type="submit" variant="pink" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvataggio..." : "Salva attività"}
      </Button>
    </form>
  );
}
