"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DogCard } from "@/components/shared/dog-card";
import { DogForm } from "@/components/dashboard/dog-form";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useDogs } from "@/hooks/use-dogs";

export default function CanePage() {
  const { dogs, isLoading, refresh } = useDogs();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brown-600">I miei cani</h1>
          <p className="mt-1 text-brown-400">Gestisci i profili dei tuoi barboncini</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Aggiungi cane
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuovo cane</DialogTitle>
            </DialogHeader>
            <DogForm
              onSuccess={() => {
                setOpen(false);
                refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : dogs.length === 0 ? (
        <p className="py-16 text-center text-brown-400">
          Non hai ancora aggiunto nessun cane. Clicca su &quot;Aggiungi cane&quot; per iniziare.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dogs.map((dog: any) => (
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
  );
}
