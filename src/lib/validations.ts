import { z } from "zod";

export const dogFormSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio").max(50),
  photo: z.string().optional().or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  breed: z.string().default("Barboncino"),
  sex: z.enum(["MASCHIO", "FEMMINA"]).optional(),
  weight: z.coerce.number().positive().optional(),
  height: z.coerce.number().positive().optional(),
  color: z.string().optional().or(z.literal("")),
  microchip: z.string().optional().or(z.literal("")),
  vet: z.string().optional().or(z.literal("")),
  insurance: z.string().optional().or(z.literal("")),
  allergies: z.string().optional().or(z.literal("")),
  medications: z.string().optional().or(z.literal("")),
  conditions: z.string().optional().or(z.literal("")),
  character: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type DogFormValues = z.infer<typeof dogFormSchema>;

export const eventFormSchema = z.object({
  title: z.string().min(1, "Il titolo è obbligatorio").max(100),
  description: z.string().optional().or(z.literal("")),
  date: z.string().min(1, "La data è obbligatoria"),
  time: z.string().optional().or(z.literal("")),
  category: z.enum(["veterinario", "toelettatura", "vaccino", "passeggiata", "alimentazione", "altro"]),
  priority: z.enum(["bassa", "normale", "alta"]).default("normale"),
  color: z.string().default("#e2436c"),
  reminder: z.boolean().default(false),
  recurrence: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  dogId: z.string().min(1, "Seleziona un cane"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const foodLogFormSchema = z.object({
  date: z.string().min(1),
  brand: z.string().optional().or(z.literal("")),
  grams: z.coerce.number().nonnegative().optional(),
  snacks: z.string().optional().or(z.literal("")),
  water: z.coerce.number().nonnegative().optional(),
  dogId: z.string().min(1),
});

export type FoodLogFormValues = z.infer<typeof foodLogFormSchema>;

export const walkFormSchema = z.object({
  date: z.string().min(1),
  duration: z.coerce.number().nonnegative().optional(),
  distance: z.coerce.number().nonnegative().optional(),
  notes: z.string().optional().or(z.literal("")),
  dogId: z.string().min(1),
});

export type WalkFormValues = z.infer<typeof walkFormSchema>;

export const diaryFormSchema = z.object({
  date: z.string().min(1),
  content: z.string().min(1, "Scrivi qualcosa nel diario"),
  mood: z.string().optional().or(z.literal("")),
  dogId: z.string().min(1),
});

export type DiaryFormValues = z.infer<typeof diaryFormSchema>;

export const weightFormSchema = z.object({
  date: z.string().min(1),
  weight: z.coerce.number().positive("Il peso deve essere positivo"),
  height: z.coerce.number().positive().optional(),
  dogId: z.string().min(1),
});

export type WeightFormValues = z.infer<typeof weightFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email("Inserisci un indirizzo email valido"),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
    email: z.string().email("Inserisci un indirizzo email valido"),
    password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Il nome è obbligatorio"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  subject: z.string().min(2, "L'oggetto è obbligatorio"),
  message: z.string().min(10, "Il messaggio deve avere almeno 10 caratteri"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
