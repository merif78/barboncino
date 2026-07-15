import Image from "next/image";
import Link from "next/link";
import { Scale, Ruler, Cake } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateAge } from "@/lib/utils";

interface DogCardProps {
  id: string;
  name: string;
  photo?: string | null;
  breed: string;
  birthDate?: Date | string | null;
  weight?: number | null;
  height?: number | null;
  sex?: string | null;
}

export function DogCard({ id, name, photo, breed, birthDate, weight, height, sex }: DogCardProps) {
  return (
    <Link href={`/dashboard/cane/${id}`}>
      <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-48 w-full overflow-hidden bg-beige-100">
          {photo ? (
            <Image
              src={photo}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">🐩</div>
          )}
          {sex && (
            <Badge className="absolute right-3 top-3" variant={sex === "FEMMINA" ? "pink" : "blue"}>
              {sex === "FEMMINA" ? "♀ Femmina" : "♂ Maschio"}
            </Badge>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="text-xl font-semibold text-brown-600">{name}</h3>
          <p className="text-sm text-brown-400">{breed}</p>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-brown-500">
            {birthDate && (
              <span className="flex items-center gap-1">
                <Cake className="h-3.5 w-3.5" /> {calculateAge(birthDate)}
              </span>
            )}
            {weight && (
              <span className="flex items-center gap-1">
                <Scale className="h-3.5 w-3.5" /> {weight} kg
              </span>
            )}
            {height && (
              <span className="flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5" /> {height} cm
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
