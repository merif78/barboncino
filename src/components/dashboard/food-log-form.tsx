"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { foodLogFormSchema, type FoodLogFormValues } from "@/lib/validations";

interface FoodLogFormProps {
  dogId: string;
  onSuccess?: () => void;
}

export function FoodLogForm({ dogId, onSuccess }: FoodLogFormProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FoodLogFormValues>({
    resolver: zodResolver(foodLogFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      dogId,
    },
  });

  const onSubmit = async (values: FoodLogFormValues) => {
    try {
      const res = await fetch("/api/food-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Errore durante il salvataggio");
      toast({ title: "Pasto registrato", description: "Il registro alimentare è stato aggiornato." });
      reset({ date: new Date().toISOString().slice(0, 10), dogId });
      onSuccess?.();
    } catch {
      toast({ title: "Errore", description: "Impossibile salvare il pasto.", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="date">Data</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
      </div>
      <div>
        <Label htmlFor="brand">Marca del cibo</Label>
        <Input id="brand" placeholder="Es. Royal Canin" {...register("brand")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="grams">Grammi</Label>
          <Input id="grams" type="number" step="1" {...register("grams")} />
        </div>
        <div>
          <Label htmlFor="water">Acqua (ml)</Label>
          <Input id="water" type="number" step="1" {...register("water")} />
        </div>
      </div>
      <div>
        <Label htmlFor="snacks">Snack extra</Label>
        <Input id="snacks" placeholder="Es. bocconcini di pollo" {...register("snacks")} />
      </div>
      <Button type="submit" variant="pink" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvataggio..." : "Salva pasto"}
      </Button>
    </form>
  );
}
