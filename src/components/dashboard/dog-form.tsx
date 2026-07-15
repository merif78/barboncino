"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { dogFormSchema, type DogFormValues } from "@/lib/validations";
import { DOG_BREEDS } from "@/types";

interface DogFormProps {
  defaultValues?: Partial<DogFormValues>;
  dogId?: string;
  onSuccess?: () => void;
}

export function DogForm({ defaultValues, dogId, onSuccess }: DogFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DogFormValues>({
    resolver: zodResolver(dogFormSchema),
    defaultValues: { breed: "Barboncino Toy", ...defaultValues },
  });

  const onSubmit = async (values: DogFormValues) => {
    try {
      const res = await fetch(dogId ? `/api/dogs/${dogId}` : "/api/dogs", {
        method: dogId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Errore durante il salvataggio");
      toast({ title: "Salvato", description: `Il profilo di ${values.name} è stato salvato.` });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/cane");
        router.refresh();
      }
    } catch {
      toast({ title: "Errore", description: "Impossibile salvare il profilo del cane.", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" placeholder="Es. Fiorellino" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="photo">URL foto</Label>
          <Input id="photo" placeholder="https://..." {...register("photo")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="birthDate">Data di nascita</Label>
          <Input id="birthDate" type="date" {...register("birthDate")} />
        </div>
        <div>
          <Label>Taglia / razza</Label>
          <Controller
            control={control}
            name="breed"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona taglia" />
                </SelectTrigger>
                <SelectContent>
                  {DOG_BREEDS.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label>Sesso</Label>
          <Controller
            control={control}
            name="sex"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona sesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MASCHIO">Maschio</SelectItem>
                  <SelectItem value="FEMMINA">Femmina</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input id="weight" type="number" step="0.1" {...register("weight")} />
        </div>
        <div>
          <Label htmlFor="height">Altezza (cm)</Label>
          <Input id="height" type="number" step="0.5" {...register("height")} />
        </div>
        <div>
          <Label htmlFor="color">Colore</Label>
          <Input id="color" placeholder="Es. Apricot" {...register("color")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="microchip">Microchip</Label>
          <Input id="microchip" {...register("microchip")} />
        </div>
        <div>
          <Label htmlFor="vet">Veterinario di riferimento</Label>
          <Input id="vet" {...register("vet")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="insurance">Assicurazione</Label>
          <Input id="insurance" {...register("insurance")} />
        </div>
        <div>
          <Label htmlFor="allergies">Allergie</Label>
          <Input id="allergies" {...register("allergies")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="medications">Farmaci</Label>
          <Textarea id="medications" {...register("medications")} />
        </div>
        <div>
          <Label htmlFor="conditions">Condizioni di salute</Label>
          <Textarea id="conditions" {...register("conditions")} />
        </div>
      </div>

      <div>
        <Label htmlFor="character">Carattere</Label>
        <Textarea id="character" placeholder="Descrivi il temperamento del cane..." {...register("character")} />
      </div>

      <div>
        <Label htmlFor="notes">Note aggiuntive</Label>
        <Textarea id="notes" {...register("notes")} />
      </div>

      <Button type="submit" variant="pink" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvataggio..." : dogId ? "Aggiorna profilo" : "Crea profilo"}
      </Button>
    </form>
  );
}
