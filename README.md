# 🐩 Barboncino

> **Tutto il mondo del Barboncino in un unico posto.**

Portale professionale dedicato al Barboncino, realizzato con Next.js 15 App Router, React 19, TypeScript e Tailwind CSS.

## 🚀 Stack tecnologico

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Auth**: Auth.js v5 (NextAuth) — Google, Email, GitHub
- **ORM**: Prisma
- **Database**: PostgreSQL (Supabase)
- **Storage**: Vercel Blob
- **Analytics**: Vercel Analytics
- **Charts**: Recharts

## 📦 Setup locale

### Prerequisiti

- Node.js >= 18
- PostgreSQL (locale o Supabase)
- Account Vercel (opzionale per deploy)

### Installazione

```bash
# Clona il repository
git clone https://github.com/merif78/barboncino.git
cd barboncino

# Installa le dipendenze
npm install

# Copia le variabili d'ambiente
cp .env.example .env.local
# Modifica .env.local con i tuoi valori
```

### Variabili d'ambiente

Crea un file `.env.local` con le seguenti variabili:

```env
# Database (Supabase o PostgreSQL locale)
DATABASE_URL="******localhost:5432/barboncino"

# NextAuth
AUTH_SECRET="genera-un-segreto-con: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (opzionali)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# Vercel Blob
BLOB_READ_WRITE_TOKEN=""

# Vercel Analytics (opzionale)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=""
```

### Database

```bash
# Genera il client Prisma
npm run db:generate

# Crea le tabelle nel database
npm run db:push

# Popola il database con dati di esempio
npm run db:seed
```

### Avvia il server di sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 📜 Script disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Avvia il server di sviluppo |
| `npm run build` | Build di produzione |
| `npm run start` | Avvia il server di produzione |
| `npm run lint` | Linting del codice |
| `npm run format` | Formattazione del codice con Prettier |
| `npm run db:generate` | Genera il client Prisma |
| `npm run db:push` | Sincronizza lo schema con il database |
| `npm run db:migrate` | Esegue le migrazioni Prisma |
| `npm run db:seed` | Popola il database con dati di esempio |
| `npm run db:studio` | Apre Prisma Studio |

## 🗂️ Struttura del progetto

```
barboncino/
├── prisma/
│   ├── schema.prisma        # Schema database
│   └── seed.ts              # Dati di seed (30 articoli, 2 cani, ecc.)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # Route API REST
│   │   ├── auth/            # Login / Register
│   │   ├── blog/            # Lista e dettaglio articoli
│   │   ├── cerca/           # Ricerca globale
│   │   ├── community/       # Community utenti
│   │   ├── contatti/        # Contatti e form
│   │   ├── dashboard/       # Dashboard utente (protetta)
│   │   │   ├── album/       # Album fotografico
│   │   │   ├── alimentazione/ # Log alimentazione
│   │   │   ├── attivita/    # Passeggiate
│   │   │   ├── calendario/  # Calendario eventi
│   │   │   ├── cane/        # Gestione cani
│   │   │   ├── diario/      # Diario giornaliero
│   │   │   ├── documenti/   # Documenti
│   │   │   ├── peso/        # Storico peso/altezza
│   │   │   └── profilo/     # Profilo utente
│   │   ├── faq/             # FAQ
│   │   ├── page.tsx         # Home page
│   │   ├── sitemap.ts       # Sitemap dinamica
│   │   └── robots.ts        # robots.txt
│   ├── components/
│   │   ├── dashboard/       # Componenti dashboard
│   │   ├── layout/          # Navbar, Footer, Sidebar
│   │   ├── shared/          # Componenti riutilizzabili
│   │   └── ui/              # Componenti UI base (shadcn)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities, auth, prisma
│   ├── middleware.ts         # Middleware protezione route
│   └── types/               # TypeScript types
└── .env.example             # Template variabili d'ambiente
```

## 🔐 Autenticazione

L'autenticazione è gestita da Auth.js v5 con supporto per:
- **Credentials** (email + password)
- **Google OAuth**
- **GitHub OAuth**

Le route `/dashboard/*` sono protette dal middleware. Gli utenti non autenticati vengono reindirizzati a `/auth/login`.

**Account demo:**
- Email: `demo@barboncino.it`
- Password: `demo1234`

## 🗄️ Database

Il progetto utilizza **Prisma ORM** con **PostgreSQL** (consigliato: [Supabase](https://supabase.com/)).

**Modelli principali:**
- `User` — Utenti registrati
- `Dog` — Profilo cani dell'utente
- `Event` — Calendario eventi (vaccini, visite, ecc.)
- `Article` — Articoli blog
- `Category` — Categorie articoli
- `Comment` / `Like` — Community
- `WeightHistory` — Storico peso/altezza
- `Gallery` — Album fotografico
- `Diary` — Diario giornaliero
- `Document` — Documenti
- `FoodLog` — Log alimentazione
- `Walk` — Attività passeggiate

## 🚀 Deploy su Vercel

1. Fork il repository
2. Connetti a Vercel: [vercel.com/new](https://vercel.com/new)
3. Aggiungi le variabili d'ambiente nel dashboard Vercel
4. Deploy automatico ad ogni push su `main`

**Vercel Storage:**
- Database: usa [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) o [Supabase](https://supabase.com/)
- File: usa [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)

## 📝 Contenuti

Il seed include:
- **30 articoli** completi in italiano su tutte le tematiche del barboncino
- **2 cani** demo (Fiorellino e Luna)
- **Categorie** articoli
- **Eventi** calendario di esempio

## 🤝 Contribuire

Contribuzioni benvenute! Apri una issue o una pull request.

## 📄 Licenza

MIT — Vedi [LICENSE](LICENSE) per i dettagli.
