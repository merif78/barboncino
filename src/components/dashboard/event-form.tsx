"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { eventFormSchema, type EventFormValues } from "@/lib/validations";
import { EVENT_CATEGORIES } from "@/types";

interface EventFormProps {
  dogs: { id: string; name: string }[];
  defaultDogId?: string;
  onSuccess?: () => void;
}

export function EventForm({ dogs, defaultDogId, onSuccess }: EventFormProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      category: "altro",
      priority: "normale",
      color: "#e2436c",
      reminder: false,
      dogId: defaultDogId ?? dogs[0]?.id ?? "",
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Errore durante il salvataggio");
      toast({ title: "Evento creato", description: "L'evento è stato aggiunto al calendario." });
      reset();
      onSuccess?.();
    } catch {
      toast({ title: "Errore", description: "Impossibile creare l'evento.", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Titolo</Label>
        <Input id="title" placeholder="Es. Visita veterinaria" {...register("title")} />
        {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Descrizione</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" {...register("date")} />
        </div>
        <div>
          <Label htmlFor="time">Ora</Label>
          <Input id="time" type="time" {...register("time")} />
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
                <SelectValue placeholder="Seleziona un cane" />
              </SelectTrigger>
              <SelectContent>
                {dogs.map((dog) => (
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
        <Label>Categoria</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona categoria" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label>Priorità</Label>
        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona priorità" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bassa">Bassa</SelectItem>
                <SelectItem value="normale">Normale</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="reminder"
          render={({ field }) => (
            <Checkbox checked={field.value} onCheckedChange={field.onChange} id="reminder" />
          )}
        />
        <Label htmlFor="reminder">Attiva promemoria</Label>
      </div>

      <Button type="submit" variant="pink" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvataggio..." : "Crea evento"}
      </Button>
    </form>
  );
}
