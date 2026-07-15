"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PawPrint } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginFormSchema, type LoginFormValues } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast({ title: "Accesso non riuscito", description: "Controlla email e password.", variant: "destructive" });
        return;
      }

      toast({ title: "Bentornato!", description: "Accesso effettuato con successo." });
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast({ title: "Errore", description: "Qualcosa è andato storto.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex min-h-[80vh] max-w-md items-center py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
          <PawPrint className="mx-auto mb-2 h-10 w-10 text-pink-400" />
          <CardTitle className="text-2xl">Accedi</CardTitle>
          <p className="text-sm text-brown-400">
            Usa <strong>demo@barboncino.it</strong> con qualsiasi password per la demo
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Accesso in corso..." : "Accedi"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-brown-400">
            Non hai un account?{" "}
            <Link href="/auth/register" className="font-medium text-pink-500 hover:underline">
              Registrati
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
