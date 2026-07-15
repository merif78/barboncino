export interface DogWithOwner {
  id: string;
  name: string;
  photo: string | null;
  birthDate: Date | null;
  breed: string;
  sex: "MASCHIO" | "FEMMINA" | null;
  weight: number | null;
  height: number | null;
  color: string | null;
  microchip: string | null;
  vet: string | null;
  insurance: string | null;
  allergies: string | null;
  medications: string | null;
  conditions: string | null;
  character: string | null;
  notes: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventWithDog {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  time: string | null;
  category: string;
  priority: string;
  color: string;
  reminder: boolean;
  recurrence: string | null;
  notes: string | null;
  dogId: string;
  userId: string;
  dog?: { id: string; name: string; photo: string | null };
}

export interface ArticleWithAuthor {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  content: string;
  imageUrl: string | null;
  readingTime: number;
  publishedAt: Date;
  author: { id: string; name: string | null; image: string | null };
  category: { id: string; name: string; slug: string } | null;
  _count?: { comments: number; likes: number };
}

export const EVENT_CATEGORIES = [
  { value: "veterinario", label: "Veterinario", icon: "🩺", color: "#2f7ea8" },
  { value: "toelettatura", label: "Toelettatura", icon: "✂️", color: "#e2436c" },
  { value: "vaccino", label: "Vaccino", icon: "💉", color: "#a9824f" },
  { value: "passeggiata", label: "Passeggiata", icon: "🐾", color: "#5c3d24" },
  { value: "alimentazione", label: "Alimentazione", icon: "🍖", color: "#8f6339" },
  { value: "altro", label: "Altro", icon: "📌", color: "#432b19" },
] as const;

export const DOG_BREEDS = [
  "Barboncino Toy",
  "Barboncino Nano",
  "Barboncino Medio",
  "Barboncino Royal",
] as const;

export const MOOD_OPTIONS = [
  { value: "felice", label: "Felice", emoji: "😄" },
  { value: "eccitata", label: "Eccitato", emoji: "🤩" },
  { value: "tranquillo", label: "Tranquillo", emoji: "😌" },
  { value: "stanco", label: "Stanco", emoji: "😴" },
  { value: "ansioso", label: "Ansioso", emoji: "😟" },
  { value: "triste", label: "Triste", emoji: "😢" },
] as const;
