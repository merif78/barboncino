import { PrismaClient } from "@prisma/client";
import { articles } from "./seed-articles";

const prisma = new PrismaClient();

async function main() {
  console.log("Inizio seeding del database...");

  // Utente demo
  const user = await prisma.user.upsert({
    where: { email: "demo@barboncino.it" },
    update: {},
    create: {
      name: "Marco Rossi",
      email: "demo@barboncino.it",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80",
      role: "ADMIN",
      bio: "Appassionato di barboncini da oltre 10 anni. Vivo a Milano con i miei due cani, Fiorellino e Luna.",
    },
  });

  // Cani demo
  const fiorellino = await prisma.dog.upsert({
    where: { id: "dog-fiorellino" },
    update: {},
    create: {
      id: "dog-fiorellino",
      name: "Fiorellino",
      photo: "https://images.unsplash.com/photo-1616464478497-c9b3a92d6a2e?w=800&q=80",
      birthDate: new Date("2020-04-12"),
      breed: "Barboncino Toy",
      sex: "MASCHIO",
      weight: 2.8,
      height: 26,
      color: "Apricot",
      microchip: "380271000123456",
      vet: "Dott.ssa Elena Bianchi - Clinica Veterinaria San Rocco, Milano",
      insurance: "Assicurazione PetCare Plus",
      allergies: "Lieve intolleranza al pollo",
      medications: "Nessuno al momento",
      conditions: "Nessuna condizione nota",
      character: "Vivace, giocherellone, molto legato al proprietario. Ama le passeggiate al parco e socializzare con altri cani.",
      notes: "Adora i tappetini olfattivi e il gioco del nascondino con i bocconcini.",
      userId: user.id,
    },
  });

  const luna = await prisma.dog.upsert({
    where: { id: "dog-luna" },
    update: {},
    create: {
      id: "dog-luna",
      name: "Luna",
      photo: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80",
      birthDate: new Date("2021-09-03"),
      breed: "Barboncino Nano",
      sex: "FEMMINA",
      weight: 5.4,
      height: 32,
      color: "Nero",
      microchip: "380271000654321",
      vet: "Dott.ssa Elena Bianchi - Clinica Veterinaria San Rocco, Milano",
      insurance: "Assicurazione PetCare Plus",
      allergies: "Nessuna nota",
      medications: "Integratore articolare (glucosamina) 1 volta al giorno",
      conditions: "Lieve lussazione rotulea di grado 1, monitorata",
      character: "Dolce, calma, molto affettuosa con i bambini. Un po' timida con gli sconosciuti all'inizio.",
      notes: "Ama nuotare in piscina durante l'estate.",
      userId: user.id,
    },
  });

  // Storico peso
  await prisma.weightHistory.createMany({
    data: [
      { dogId: fiorellino.id, date: new Date("2024-01-15"), weight: 2.6, height: 25 },
      { dogId: fiorellino.id, date: new Date("2024-04-15"), weight: 2.7, height: 26 },
      { dogId: fiorellino.id, date: new Date("2024-07-15"), weight: 2.8, height: 26 },
      { dogId: fiorellino.id, date: new Date("2024-10-15"), weight: 2.8, height: 26 },
      { dogId: luna.id, date: new Date("2024-01-15"), weight: 5.1, height: 31 },
      { dogId: luna.id, date: new Date("2024-04-15"), weight: 5.2, height: 32 },
      { dogId: luna.id, date: new Date("2024-07-15"), weight: 5.3, height: 32 },
      { dogId: luna.id, date: new Date("2024-10-15"), weight: 5.4, height: 32 },
    ],
  });

  // Eventi
  const eventCategories = [
    { category: "veterinario", color: "#2f7ea8", emoji: "🩺" },
    { category: "toelettatura", color: "#e2436c", emoji: "✂️" },
    { category: "vaccino", color: "#a9824f", emoji: "💉" },
    { category: "passeggiata", color: "#5c3d24", emoji: "🐾" },
    { category: "altro", color: "#8f6339", emoji: "📌" },
  ];

  await prisma.event.createMany({
    data: [
      {
        title: "Visita di controllo annuale",
        description: "Controllo generale di salute e esami del sangue",
        date: new Date("2025-08-05"),
        time: "10:30",
        category: "veterinario",
        priority: "alta",
        color: "#2f7ea8",
        reminder: true,
        dogId: fiorellino.id,
        userId: user.id,
      },
      {
        title: "Toelettatura completa",
        description: "Bagno, taglio e spuntatura unghie",
        date: new Date("2025-07-20"),
        time: "15:00",
        category: "toelettatura",
        priority: "normale",
        color: "#e2436c",
        reminder: true,
        dogId: fiorellino.id,
        userId: user.id,
      },
      {
        title: "Richiamo vaccino tosse dei canili",
        description: "Richiamo annuale presso la clinica San Rocco",
        date: new Date("2025-09-10"),
        time: "09:00",
        category: "vaccino",
        priority: "alta",
        color: "#a9824f",
        reminder: true,
        dogId: luna.id,
        userId: user.id,
      },
      {
        title: "Passeggiata al Parco Sempione",
        description: "Lunga passeggiata mattutina con socializzazione",
        date: new Date("2025-07-18"),
        time: "08:00",
        category: "passeggiata",
        priority: "normale",
        color: "#5c3d24",
        reminder: false,
        dogId: fiorellino.id,
        userId: user.id,
      },
      {
        title: "Controllo rotula",
        description: "Visita ortopedica di controllo per la lussazione rotulea",
        date: new Date("2025-08-22"),
        time: "11:00",
        category: "veterinario",
        priority: "alta",
        color: "#2f7ea8",
        reminder: true,
        dogId: luna.id,
        userId: user.id,
      },
      {
        title: "Taglio pelo estivo",
        description: "Taglio più corto per affrontare il caldo estivo",
        date: new Date("2025-07-25"),
        time: "14:30",
        category: "toelettatura",
        priority: "normale",
        color: "#e2436c",
        reminder: true,
        dogId: luna.id,
        userId: user.id,
      },
      {
        title: "Sverminazione trimestrale",
        description: "Trattamento antiparassitario interno",
        date: new Date("2025-08-01"),
        time: "12:00",
        category: "veterinario",
        priority: "normale",
        color: "#2f7ea8",
        reminder: true,
        dogId: fiorellino.id,
        userId: user.id,
      },
      {
        title: "Corso di agility",
        description: "Prima lezione di prova di agility al centro cinofilo",
        date: new Date("2025-08-15"),
        time: "16:00",
        category: "altro",
        priority: "normale",
        color: "#8f6339",
        reminder: false,
        dogId: fiorellino.id,
        userId: user.id,
      },
      {
        title: "Nuoto in piscina",
        description: "Sessione di idroterapia per il supporto articolare",
        date: new Date("2025-07-30"),
        time: "17:00",
        category: "altro",
        priority: "normale",
        color: "#8f6339",
        reminder: false,
        dogId: luna.id,
        userId: user.id,
      },
      {
        title: "Compleanno di Fiorellino 🎉",
        description: "5 anni! Festeggiamo con una torta per cani",
        date: new Date("2025-04-12"),
        time: "18:00",
        category: "altro",
        priority: "alta",
        color: "#8f6339",
        reminder: true,
        dogId: fiorellino.id,
        userId: user.id,
      },
      {
        title: "Vaccino antirabbica",
        description: "Richiamo annuale obbligatorio per i viaggi",
        date: new Date("2025-09-25"),
        time: "10:00",
        category: "vaccino",
        priority: "alta",
        color: "#a9824f",
        reminder: true,
        dogId: luna.id,
        userId: user.id,
      },
    ],
  });

  // Categorie articoli
  const categoryNames = [
    "Adozione",
    "Salute",
    "Toelettatura",
    "Razze",
    "Educazione",
    "Alimentazione",
    "Lifestyle",
    "Comportamento",
    "Famiglia",
    "Curiosità",
    "Sport",
  ];

  const categoryMap: Record<string, string> = {};
  for (const name of categoryNames) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
    const cat = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    categoryMap[name] = cat.id;
  }

  // Articoli
  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        title: article.title,
        subtitle: article.subtitle,
        slug: article.slug,
        content: article.content,
        imageUrl: article.imageUrl,
        readingTime: article.readingTime,
        authorId: user.id,
        categoryId: categoryMap[article.category] ?? null,
      },
    });
  }

  // Galleria foto
  await prisma.gallery.createMany({
    data: [
      { url: "https://images.unsplash.com/photo-1616464478497-c9b3a92d6a2e?w=800&q=80", caption: "Fiorellino al parco", dogId: fiorellino.id, userId: user.id },
      { url: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80", caption: "Luna dopo la toelettatura", dogId: luna.id, userId: user.id },
      { url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80", caption: "Momento relax", dogId: fiorellino.id, userId: user.id },
      { url: "https://images.unsplash.com/photo-1553736026-ec5f4d0c7cea?w=800&q=80", caption: "Vacanza al mare", dogId: luna.id, userId: user.id },
    ],
  });

  // Diario
  await prisma.diary.createMany({
    data: [
      {
        date: new Date("2025-07-10"),
        content: "Oggi Fiorellino ha giocato tantissimo al parco con un nuovo amico a quattro zampe. Giornata fantastica!",
        mood: "felice",
        dogId: fiorellino.id,
        userId: user.id,
      },
      {
        date: new Date("2025-07-12"),
        content: "Luna ha nuotato per la prima volta in piscina. All'inizio un po' titubante, poi si è divertita moltissimo.",
        mood: "eccitata",
        dogId: luna.id,
        userId: user.id,
      },
    ],
  });

  console.log("Seeding completato con successo!");
  console.log(`- 1 utente creato: ${user.email}`);
  console.log(`- 2 cani creati: ${fiorellino.name}, ${luna.name}`);
  console.log(`- ${articles.length} articoli creati`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
