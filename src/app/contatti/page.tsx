"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";

export default function ContattiPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({ title: "Messaggio inviato!", description: "Ti risponderemo il prima possibile." });
      reset();
    } catch {
      toast({ title: "Errore", description: "Impossibile inviare il messaggio.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-brown-600">Contattaci</h1>
        <p className="mt-2 text-brown-500">Hai domande sul tuo barboncino? Scrivici, siamo felici di aiutarti.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-1">
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Mail className="h-5 w-5 text-pink-400" />
              <span className="text-sm text-brown-500">info@barboncino.it</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Phone className="h-5 w-5 text-pink-400" />
              <span className="text-sm text-brown-500">+39 02 1234 5678</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <MapPin className="h-5 w-5 text-pink-400" />
              <span className="text-sm text-brown-500">Milano, Italia</span>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="subject">Oggetto</Label>
                <Input id="subject" {...register("subject")} />
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
              </div>
              <div>
                <Label htmlFor="message">Messaggio</Label>
                <Textarea id="message" rows={5} {...register("message")} />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Invio in corso..." : "Invia messaggio"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
