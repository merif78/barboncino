"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormValues {
  name: string;
  bio: string;
  image: string;
}

export default function ProfiloPage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<ProfileFormValues>({
    values: {
      name: session?.user?.name ?? "",
      bio: (session?.user as any)?.bio ?? "",
      image: session?.user?.image ?? "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      await update();
      toast({ title: "Profilo aggiornato" });
    } catch {
      toast({ title: "Errore", description: "Impossibile aggiornare il profilo.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brown-600">Il tuo profilo</h1>
        <p className="mt-1 text-brown-400">Gestisci le informazioni del tuo account</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback>{session?.user?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{session?.user?.name}</CardTitle>
            <p className="text-sm text-brown-400">{session?.user?.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} />
            </div>
            <div>
              <Label htmlFor="image">URL immagine profilo</Label>
              <Input id="image" placeholder="https://..." {...register("image")} />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} placeholder="Racconta qualcosa di te..." {...register("bio")} />
            </div>
            <Button type="submit">Salva modifiche</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Esci</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
            Disconnetti
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
