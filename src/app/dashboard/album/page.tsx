"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PhotoGallery } from "@/components/dashboard/photo-gallery";
import { useDogs } from "@/hooks/use-dogs";
import { useToast } from "@/hooks/use-toast";

interface GalleryFormValues {
  url: string;
  caption?: string;
  dogId: string;
}

export default function AlbumPage() {
  const { dogs } = useDogs();
  const { toast } = useToast();
  const [photos, setPhotos] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, reset } = useForm<GalleryFormValues>();

  const fetchPhotos = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setPhotos(data.photos ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const onSubmit = async (values: GalleryFormValues) => {
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Foto aggiunta all'album" });
      reset();
      setOpen(false);
      fetchPhotos();
    } catch {
      toast({ title: "Errore", description: "Impossibile aggiungere la foto.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brown-600">Album foto</h1>
          <p className="mt-1 text-brown-400">I momenti più belli con il tuo barboncino</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Aggiungi foto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuova foto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="url">URL immagine</Label>
                <Input id="url" placeholder="https://images.unsplash.com/..." {...register("url", { required: true })} />
              </div>
              <div>
                <Label htmlFor="caption">Didascalia</Label>
                <Input id="caption" placeholder="Es. Passeggiata al parco" {...register("caption")} />
              </div>
              <div>
                <Label htmlFor="dogId">Cane</Label>
                <select
                  id="dogId"
                  {...register("dogId", { required: true })}
                  className="flex h-10 w-full rounded-md border border-beige-200 bg-white px-3 py-2 text-sm"
                >
                  {dogs.map((dog: any) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full">
                Salva foto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-brown-400">Caricamento...</p>
      ) : (
        <PhotoGallery photos={photos} />
      )}
    </div>
  );
}
