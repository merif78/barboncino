"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { FileText, Plus, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDogs } from "@/hooks/use-dogs";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface DocFormValues {
  name: string;
  url: string;
  type: string;
  dogId: string;
}

export default function DocumentiPage() {
  const { dogs } = useDogs();
  const { toast } = useToast();
  const [docs, setDocs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, reset } = useForm<DocFormValues>();

  const fetchDocs = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      setDocs(data.documents ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const onSubmit = async (values: DocFormValues) => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Documento aggiunto" });
      reset();
      setOpen(false);
      fetchDocs();
    } catch {
      toast({ title: "Errore", description: "Impossibile salvare il documento.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brown-600">Documenti</h1>
          <p className="mt-1 text-brown-400">Libretti sanitari, certificati e referti veterinari</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Aggiungi documento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuovo documento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome documento</Label>
                <Input id="name" placeholder="Es. Libretto sanitario" {...register("name", { required: true })} />
              </div>
              <div>
                <Label htmlFor="url">URL file</Label>
                <Input id="url" placeholder="https://..." {...register("url", { required: true })} />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Input id="type" placeholder="Es. libretto, certificato, referto" {...register("type")} />
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
                Salva documento
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-brown-400">Caricamento...</p>
      ) : docs.length === 0 ? (
        <p className="py-16 text-center text-brown-400">Nessun documento caricato ancora.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="font-medium text-brown-600">{doc.name}</p>
                    <p className="text-xs text-brown-400">
                      {doc.type} · {formatDate(doc.createdAt)}
                    </p>
                  </div>
                </div>
                <a href={doc.url} target="_blank" rel="noreferrer">
                  <Download className="h-5 w-5 text-brown-400 hover:text-pink-400" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
