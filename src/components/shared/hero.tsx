"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PawPrint, Heart, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white py-20 dark:from-brown-700 dark:via-brown-700 dark:to-background">
      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-1.5 text-sm font-medium text-pink-500 dark:bg-brown-600"
        >
          <Sparkles className="h-4 w-4" />
          Il portale italiano dedicato al barboncino
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-4xl font-bold tracking-tight text-brown-600 sm:text-6xl dark:text-cream-50"
        >
          Tutto quello che serve per far felice il tuo{" "}
          <span className="text-pink-500">barboncino</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-brown-500 dark:text-cream-200"
        >
          Guide, consigli pratici e una dashboard personale per gestire la salute, l'alimentazione e i
          momenti più belli con il tuo compagno a quattro zampe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/auth/register">
            <Button size="lg" variant="pink" className="gap-2">
              <PawPrint className="h-5 w-5" />
              Inizia gratis
            </Button>
          </Link>
          <Link href="/blog">
            <Button size="lg" variant="outline" className="gap-2">
              <Heart className="h-5 w-5" />
              Scopri il blog
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-pink-100/60 blur-3xl dark:bg-pink-500/10" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-500/10" />
    </section>
  );
}
