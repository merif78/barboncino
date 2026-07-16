-- =============================================================================
-- BARBONCINO – Schema SQL per Supabase
-- =============================================================================
-- Esegui questo script nel SQL Editor di Supabase per creare l'intero database.
-- Include: tabelle, indici, policy RLS, bucket storage e dati di esempio.
-- =============================================================================

-- Abilita estensioni necessarie
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TIPI ENUM
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "Sex" AS ENUM ('MASCHIO', 'FEMMINA');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- TABELLE
-- =============================================================================

-- Utenti
CREATE TABLE IF NOT EXISTS "User" (
  "id"            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name"          TEXT,
  "email"         TEXT        NOT NULL UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  "image"         TEXT,
  "password"      TEXT,
  "role"          "Role"      NOT NULL DEFAULT 'USER',
  "bio"           TEXT,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Account OAuth (NextAuth)
CREATE TABLE IF NOT EXISTS "Account" (
  "id"                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId"            TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type"              TEXT NOT NULL,
  "provider"          TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INTEGER,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,
  UNIQUE ("provider", "providerAccountId")
);

-- Sessioni (NextAuth – usate solo con strategy "database")
CREATE TABLE IF NOT EXISTS "Session" (
  "id"           TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "sessionToken" TEXT        NOT NULL UNIQUE,
  "userId"       TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "expires"      TIMESTAMPTZ NOT NULL
);

-- Token di verifica email
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token"      TEXT NOT NULL UNIQUE,
  "expires"    TIMESTAMPTZ NOT NULL,
  UNIQUE ("identifier", "token")
);

-- Cani
CREATE TABLE IF NOT EXISTS "Dog" (
  "id"          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name"        TEXT        NOT NULL,
  "photo"       TEXT,
  "birthDate"   TIMESTAMPTZ,
  "breed"       TEXT        NOT NULL DEFAULT 'Barboncino',
  "sex"         "Sex",
  "weight"      NUMERIC(5,2),
  "height"      NUMERIC(5,2),
  "color"       TEXT,
  "microchip"   TEXT,
  "vet"         TEXT,
  "insurance"   TEXT,
  "allergies"   TEXT,
  "medications" TEXT,
  "conditions"  TEXT,
  "character"   TEXT,
  "notes"       TEXT,
  "userId"      TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Storico peso
CREATE TABLE IF NOT EXISTS "WeightHistory" (
  "id"        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "date"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "weight"    NUMERIC(5,2) NOT NULL,
  "height"    NUMERIC(5,2),
  "dogId"     TEXT        NOT NULL REFERENCES "Dog"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categorie articoli
CREATE TABLE IF NOT EXISTS "Category" (
  "id"   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE
);

-- Articoli
CREATE TABLE IF NOT EXISTS "Article" (
  "id"          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title"       TEXT        NOT NULL,
  "subtitle"    TEXT,
  "slug"        TEXT        NOT NULL UNIQUE,
  "content"     TEXT        NOT NULL,
  "imageUrl"    TEXT,
  "authorId"    TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "categoryId"  TEXT        REFERENCES "Category"("id") ON DELETE SET NULL,
  "readingTime" INTEGER     NOT NULL DEFAULT 5,
  "publishedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Commenti
CREATE TABLE IF NOT EXISTS "Comment" (
  "id"        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "content"   TEXT        NOT NULL,
  "articleId" TEXT        NOT NULL REFERENCES "Article"("id") ON DELETE CASCADE,
  "userId"    TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Like
CREATE TABLE IF NOT EXISTS "Like" (
  "id"        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "articleId" TEXT        NOT NULL REFERENCES "Article"("id") ON DELETE CASCADE,
  "userId"    TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("articleId", "userId")
);

-- Notifiche
CREATE TABLE IF NOT EXISTS "Notification" (
  "id"        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "message"   TEXT        NOT NULL,
  "read"      BOOLEAN     NOT NULL DEFAULT FALSE,
  "userId"    TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Galleria foto
CREATE TABLE IF NOT EXISTS "Gallery" (
  "id"        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "url"       TEXT        NOT NULL,
  "caption"   TEXT,
  "dogId"     TEXT        NOT NULL REFERENCES "Dog"("id") ON DELETE CASCADE,
  "userId"    TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Diario
CREATE TABLE IF NOT EXISTS "Diary" (
  "id"        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "date"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "content"   TEXT        NOT NULL,
  "mood"      TEXT,
  "dogId"     TEXT        NOT NULL REFERENCES "Dog"("id") ON DELETE CASCADE,
  "userId"    TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documenti
CREATE TABLE IF NOT EXISTS "Document" (
  "id"        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name"      TEXT        NOT NULL,
  "url"       TEXT        NOT NULL,
  "type"      TEXT        NOT NULL DEFAULT 'altro',
  "dogId"     TEXT        NOT NULL REFERENCES "Dog"("id") ON DELETE CASCADE,
  "userId"    TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Registro alimentazione
CREATE TABLE IF NOT EXISTS "FoodLog" (
  "id"        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "date"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "brand"     TEXT,
  "grams"     NUMERIC(7,2),
  "snacks"    TEXT,
  "water"     NUMERIC(7,2),
  "dogId"     TEXT        NOT NULL REFERENCES "Dog"("id") ON DELETE CASCADE,
  "userId"    TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Registro passeggiate
CREATE TABLE IF NOT EXISTS "Walk" (
  "id"        TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "date"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "duration"  INTEGER,
  "distance"  NUMERIC(7,3),
  "notes"     TEXT,
  "dogId"     TEXT        NOT NULL REFERENCES "Dog"("id") ON DELETE CASCADE,
  "userId"    TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calendario eventi / appuntamenti
CREATE TABLE IF NOT EXISTS "Event" (
  "id"          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title"       TEXT        NOT NULL,
  "description" TEXT,
  "date"        TIMESTAMPTZ NOT NULL,
  "time"        TEXT,
  "category"    TEXT        NOT NULL DEFAULT 'altro',
  "priority"    TEXT        NOT NULL DEFAULT 'normale',
  "color"       TEXT        NOT NULL DEFAULT '#e2436c',
  "reminder"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "recurrence"  TEXT,
  "notes"       TEXT,
  "dogId"       TEXT        NOT NULL REFERENCES "Dog"("id") ON DELETE CASCADE,
  "userId"      TEXT        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDICI
-- =============================================================================

-- User
CREATE INDEX IF NOT EXISTS idx_user_email         ON "User" ("email");
CREATE INDEX IF NOT EXISTS idx_user_role          ON "User" ("role");

-- Account
CREATE INDEX IF NOT EXISTS idx_account_userid     ON "Account" ("userId");

-- Session
CREATE INDEX IF NOT EXISTS idx_session_userid     ON "Session" ("userId");

-- Dog
CREATE INDEX IF NOT EXISTS idx_dog_userid         ON "Dog" ("userId");
CREATE INDEX IF NOT EXISTS idx_dog_breed          ON "Dog" ("breed");

-- WeightHistory
CREATE INDEX IF NOT EXISTS idx_weight_dogid       ON "WeightHistory" ("dogId");
CREATE INDEX IF NOT EXISTS idx_weight_date        ON "WeightHistory" ("date" DESC);

-- Article
CREATE INDEX IF NOT EXISTS idx_article_slug       ON "Article" ("slug");
CREATE INDEX IF NOT EXISTS idx_article_authorid   ON "Article" ("authorId");
CREATE INDEX IF NOT EXISTS idx_article_categoryid ON "Article" ("categoryId");
CREATE INDEX IF NOT EXISTS idx_article_publishedat ON "Article" ("publishedAt" DESC);
CREATE INDEX IF NOT EXISTS idx_article_search     ON "Article"
  USING GIN (to_tsvector('italian', "title" || ' ' || COALESCE("subtitle", '') || ' ' || "content"));

-- Comment
CREATE INDEX IF NOT EXISTS idx_comment_articleid  ON "Comment" ("articleId");
CREATE INDEX IF NOT EXISTS idx_comment_userid     ON "Comment" ("userId");

-- Like
CREATE INDEX IF NOT EXISTS idx_like_articleid     ON "Like" ("articleId");
CREATE INDEX IF NOT EXISTS idx_like_userid        ON "Like" ("userId");

-- Gallery
CREATE INDEX IF NOT EXISTS idx_gallery_userid     ON "Gallery" ("userId");
CREATE INDEX IF NOT EXISTS idx_gallery_dogid      ON "Gallery" ("dogId");

-- Diary
CREATE INDEX IF NOT EXISTS idx_diary_userid       ON "Diary" ("userId");
CREATE INDEX IF NOT EXISTS idx_diary_dogid        ON "Diary" ("dogId");
CREATE INDEX IF NOT EXISTS idx_diary_date         ON "Diary" ("date" DESC);

-- Document
CREATE INDEX IF NOT EXISTS idx_document_userid    ON "Document" ("userId");
CREATE INDEX IF NOT EXISTS idx_document_dogid     ON "Document" ("dogId");

-- FoodLog
CREATE INDEX IF NOT EXISTS idx_foodlog_userid     ON "FoodLog" ("userId");
CREATE INDEX IF NOT EXISTS idx_foodlog_dogid      ON "FoodLog" ("dogId");
CREATE INDEX IF NOT EXISTS idx_foodlog_date       ON "FoodLog" ("date" DESC);

-- Walk
CREATE INDEX IF NOT EXISTS idx_walk_userid        ON "Walk" ("userId");
CREATE INDEX IF NOT EXISTS idx_walk_dogid         ON "Walk" ("dogId");
CREATE INDEX IF NOT EXISTS idx_walk_date          ON "Walk" ("date" DESC);

-- Event
CREATE INDEX IF NOT EXISTS idx_event_userid       ON "Event" ("userId");
CREATE INDEX IF NOT EXISTS idx_event_dogid        ON "Event" ("dogId");
CREATE INDEX IF NOT EXISTS idx_event_date         ON "Event" ("date" ASC);

-- Notification
CREATE INDEX IF NOT EXISTS idx_notification_userid ON "Notification" ("userId");

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Le API routes usano la service_role key che bypassa RLS.
-- Le policy qui sotto proteggono l'accesso diretto tramite anon/user key.

ALTER TABLE "User"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Dog"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WeightHistory"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Event"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Gallery"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Diary"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FoodLog"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Walk"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Article"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Like"            ENABLE ROW LEVEL SECURITY;

-- Policy: ogni utente vede solo i propri dati personali
CREATE POLICY "user_own_data" ON "User"
  FOR ALL USING (auth.uid()::TEXT = "id");

CREATE POLICY "dog_own_data" ON "Dog"
  FOR ALL USING (auth.uid()::TEXT = "userId");

CREATE POLICY "weight_own_data" ON "WeightHistory"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "Dog" d WHERE d."id" = "dogId" AND d."userId" = auth.uid()::TEXT)
  );

CREATE POLICY "event_own_data" ON "Event"
  FOR ALL USING (auth.uid()::TEXT = "userId");

CREATE POLICY "gallery_own_data" ON "Gallery"
  FOR ALL USING (auth.uid()::TEXT = "userId");

CREATE POLICY "diary_own_data" ON "Diary"
  FOR ALL USING (auth.uid()::TEXT = "userId");

CREATE POLICY "document_own_data" ON "Document"
  FOR ALL USING (auth.uid()::TEXT = "userId");

CREATE POLICY "foodlog_own_data" ON "FoodLog"
  FOR ALL USING (auth.uid()::TEXT = "userId");

CREATE POLICY "walk_own_data" ON "Walk"
  FOR ALL USING (auth.uid()::TEXT = "userId");

CREATE POLICY "notification_own_data" ON "Notification"
  FOR ALL USING (auth.uid()::TEXT = "userId");

-- Policy: articoli e categorie sono pubblici in lettura
CREATE POLICY "article_public_read" ON "Article"
  FOR SELECT USING (TRUE);

CREATE POLICY "category_public_read" ON "Category"
  FOR SELECT USING (TRUE);

CREATE POLICY "comment_public_read" ON "Comment"
  FOR SELECT USING (TRUE);

CREATE POLICY "comment_own_write" ON "Comment"
  FOR INSERT WITH CHECK (auth.uid()::TEXT = "userId");

CREATE POLICY "like_public_read" ON "Like"
  FOR SELECT USING (TRUE);

CREATE POLICY "like_own_write" ON "Like"
  FOR ALL USING (auth.uid()::TEXT = "userId");

CREATE POLICY "account_own_data" ON "Account"
  FOR ALL USING (auth.uid()::TEXT = "userId");

CREATE POLICY "session_own_data" ON "Session"
  FOR ALL USING (auth.uid()::TEXT = "userId");

-- =============================================================================
-- STORAGE BUCKETS
-- =============================================================================
-- Esegui questi INSERT dopo aver creato i bucket nel pannello Supabase Storage,
-- oppure creali direttamente dall'interfaccia web.

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('gallery',   'gallery',   TRUE),
  ('documents', 'documents', FALSE),
  ('avatars',   'avatars',   TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policy storage: chiunque può leggere le foto della galleria pubblica
CREATE POLICY "gallery_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

-- Policy storage: solo il proprietario può caricare/eliminare
CREATE POLICY "gallery_own_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery' AND auth.uid()::TEXT IS NOT NULL
  );

CREATE POLICY "gallery_own_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallery' AND owner = auth.uid()
  );

CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_own_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::TEXT IS NOT NULL
  );

CREATE POLICY "documents_own_access" ON storage.objects
  FOR ALL USING (
    bucket_id = 'documents' AND owner = auth.uid()
  );

-- =============================================================================
-- DATI DI ESEMPIO (SEED)
-- =============================================================================

-- Utente demo admin
INSERT INTO "User" ("id", "name", "email", "image", "role", "bio", "createdAt", "updatedAt")
VALUES (
  'demo-user-001',
  'Marco Rossi',
  'demo@barboncino.it',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80',
  'ADMIN',
  'Appassionato di barboncini da oltre 10 anni. Vivo a Milano con i miei due cani, Fiorellino e Luna.',
  NOW(), NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Cani demo
INSERT INTO "Dog" (
  "id", "name", "photo", "birthDate", "breed", "sex", "weight", "height",
  "color", "microchip", "vet", "insurance", "allergies", "medications",
  "conditions", "character", "notes", "userId", "createdAt", "updatedAt"
) VALUES (
  'dog-fiorellino',
  'Fiorellino',
  'https://images.unsplash.com/photo-1616464478497-c9b3a92d6a2e?w=800&q=80',
  '2020-04-12',
  'Barboncino Toy',
  'MASCHIO',
  2.8, 26,
  'Apricot',
  '380271000123456',
  'Dott.ssa Elena Bianchi - Clinica Veterinaria San Rocco, Milano',
  'Assicurazione PetCare Plus',
  'Lieve intolleranza al pollo',
  'Nessuno al momento',
  'Nessuna condizione nota',
  'Vivace, giocherellone, molto legato al proprietario. Ama le passeggiate al parco e socializzare con altri cani.',
  'Adora i tappetini olfattivi e il gioco del nascondino con i bocconcini.',
  'demo-user-001',
  NOW(), NOW()
) ON CONFLICT DO NOTHING;

INSERT INTO "Dog" (
  "id", "name", "photo", "birthDate", "breed", "sex", "weight", "height",
  "color", "microchip", "vet", "insurance", "allergies", "medications",
  "conditions", "character", "notes", "userId", "createdAt", "updatedAt"
) VALUES (
  'dog-luna',
  'Luna',
  'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80',
  '2021-09-03',
  'Barboncino Nano',
  'FEMMINA',
  5.4, 32,
  'Nero',
  '380271000654321',
  'Dott.ssa Elena Bianchi - Clinica Veterinaria San Rocco, Milano',
  'Assicurazione PetCare Plus',
  'Nessuna nota',
  'Integratore articolare (glucosamina) 1 volta al giorno',
  'Lieve lussazione rotulea di grado 1, monitorata',
  'Dolce, calma, molto affettuosa con i bambini. Un po'' timida con gli sconosciuti all''inizio.',
  'Ama nuotare in piscina durante l''estate.',
  'demo-user-001',
  NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- Storico peso Fiorellino
INSERT INTO "WeightHistory" ("id", "date", "weight", "height", "dogId", "createdAt")
VALUES
  (gen_random_uuid()::TEXT, '2024-01-15', 2.6, 25, 'dog-fiorellino', NOW()),
  (gen_random_uuid()::TEXT, '2024-04-15', 2.7, 26, 'dog-fiorellino', NOW()),
  (gen_random_uuid()::TEXT, '2024-07-15', 2.8, 26, 'dog-fiorellino', NOW()),
  (gen_random_uuid()::TEXT, '2024-10-15', 2.8, 26, 'dog-fiorellino', NOW());

-- Storico peso Luna
INSERT INTO "WeightHistory" ("id", "date", "weight", "height", "dogId", "createdAt")
VALUES
  (gen_random_uuid()::TEXT, '2024-01-15', 5.1, 31, 'dog-luna', NOW()),
  (gen_random_uuid()::TEXT, '2024-04-15', 5.2, 32, 'dog-luna', NOW()),
  (gen_random_uuid()::TEXT, '2024-07-15', 5.3, 32, 'dog-luna', NOW()),
  (gen_random_uuid()::TEXT, '2024-10-15', 5.4, 32, 'dog-luna', NOW());

-- Galleria foto demo
INSERT INTO "Gallery" ("id", "url", "caption", "dogId", "userId", "createdAt")
VALUES
  (gen_random_uuid()::TEXT, 'https://images.unsplash.com/photo-1616464478497-c9b3a92d6a2e?w=800&q=80', 'Fiorellino al parco', 'dog-fiorellino', 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80', 'Luna dopo la toelettatura', 'dog-luna', 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80', 'Momento relax', 'dog-fiorellino', 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, 'https://images.unsplash.com/photo-1553736026-ec5f4d0c7cea?w=800&q=80', 'Vacanza al mare', 'dog-luna', 'demo-user-001', NOW());

-- Diario demo
INSERT INTO "Diary" ("id", "date", "content", "mood", "dogId", "userId", "createdAt", "updatedAt")
VALUES
  (
    gen_random_uuid()::TEXT,
    '2025-07-10',
    'Oggi Fiorellino ha giocato tantissimo al parco con un nuovo amico a quattro zampe. Giornata fantastica!',
    'felice',
    'dog-fiorellino',
    'demo-user-001',
    NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    '2025-07-12',
    'Luna ha nuotato per la prima volta in piscina. All''inizio un po'' titubante, poi si è divertita moltissimo.',
    'eccitata',
    'dog-luna',
    'demo-user-001',
    NOW(), NOW()
  );

-- Registro alimentazione demo
INSERT INTO "FoodLog" ("id", "date", "brand", "grams", "snacks", "water", "dogId", "userId", "createdAt")
VALUES
  (gen_random_uuid()::TEXT, NOW() - INTERVAL '1 day', 'Royal Canin Toy', 80, 'Bocconcino al pollo', 200, 'dog-fiorellino', 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, NOW() - INTERVAL '1 day', 'Hill''s Science Plan', 160, NULL, 350, 'dog-luna', 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, NOW(), 'Royal Canin Toy', 80, NULL, 180, 'dog-fiorellino', 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, NOW(), 'Hill''s Science Plan', 160, 'Osso dentale', 400, 'dog-luna', 'demo-user-001', NOW());

-- Registro passeggiate demo
INSERT INTO "Walk" ("id", "date", "duration", "distance", "notes", "dogId", "userId", "createdAt")
VALUES
  (gen_random_uuid()::TEXT, NOW() - INTERVAL '1 day', 35, 2.1, 'Parco Sempione, incontro con altri cani', 'dog-fiorellino', 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, NOW() - INTERVAL '2 days', 45, 3.0, 'Lungo il Naviglio Grande', 'dog-luna', 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, NOW(), 25, 1.5, 'Giro mattutino', 'dog-fiorellino', 'demo-user-001', NOW());

-- Documenti demo
INSERT INTO "Document" ("id", "name", "url", "type", "dogId", "userId", "createdAt")
VALUES
  (gen_random_uuid()::TEXT, 'Libretto sanitario Fiorellino', 'https://example.com/docs/libretto-fiorellino.pdf', 'sanitario', 'dog-fiorellino', 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, 'Certificato microchip Luna', 'https://example.com/docs/microchip-luna.pdf', 'microchip', 'dog-luna', 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, 'Polizza assicurativa Luna', 'https://example.com/docs/assicurazione-luna.pdf', 'assicurazione', 'dog-luna', 'demo-user-001', NOW());

-- Notifiche demo
INSERT INTO "Notification" ("id", "message", "read", "userId", "createdAt")
VALUES
  (gen_random_uuid()::TEXT, 'Benvenuto su Barboncino.it! Inizia aggiungendo il tuo cane.', FALSE, 'demo-user-001', NOW()),
  (gen_random_uuid()::TEXT, 'Ricorda: visita veterinaria di Fiorellino tra 3 giorni.', FALSE, 'demo-user-001', NOW());

-- ----
-- EVENTI
-- ----
INSERT INTO "Event" (
  "id", "title", "description", "date", "time", "category", "priority",
  "color", "reminder", "dogId", "userId", "createdAt", "updatedAt"
) VALUES
  (
    gen_random_uuid()::TEXT,
    'Visita di controllo annuale',
    'Controllo generale di salute e esami del sangue',
    '2025-08-05 10:30:00+02', '10:30', 'veterinario', 'alta',
    '#2f7ea8', TRUE, 'dog-fiorellino', 'demo-user-001', NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    'Toelettatura completa',
    'Bagno, taglio e spuntatura unghie',
    '2025-07-20 15:00:00+02', '15:00', 'toelettatura', 'normale',
    '#e2436c', TRUE, 'dog-fiorellino', 'demo-user-001', NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    'Richiamo vaccino tosse dei canili',
    'Richiamo annuale presso la clinica San Rocco',
    '2025-09-10 09:00:00+02', '09:00', 'vaccino', 'alta',
    '#a9824f', TRUE, 'dog-luna', 'demo-user-001', NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    'Passeggiata al Parco Sempione',
    'Lunga passeggiata mattutina con socializzazione',
    '2025-07-18 08:00:00+02', '08:00', 'passeggiata', 'normale',
    '#5c3d24', FALSE, 'dog-fiorellino', 'demo-user-001', NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    'Controllo rotula',
    'Visita ortopedica di controllo per la lussazione rotulea',
    '2025-08-22 11:00:00+02', '11:00', 'veterinario', 'alta',
    '#2f7ea8', TRUE, 'dog-luna', 'demo-user-001', NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    'Taglio pelo estivo',
    'Taglio più corto per affrontare il caldo estivo',
    '2025-07-25 14:30:00+02', '14:30', 'toelettatura', 'normale',
    '#e2436c', TRUE, 'dog-luna', 'demo-user-001', NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    'Sverminazione trimestrale',
    'Trattamento antiparassitario interno',
    '2025-08-01 12:00:00+02', '12:00', 'veterinario', 'normale',
    '#2f7ea8', TRUE, 'dog-fiorellino', 'demo-user-001', NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    'Corso di agility',
    'Prima lezione di prova di agility al centro cinofilo',
    '2025-08-15 16:00:00+02', '16:00', 'altro', 'normale',
    '#8f6339', FALSE, 'dog-fiorellino', 'demo-user-001', NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    'Nuoto in piscina',
    'Sessione di idroterapia per il supporto articolare',
    '2025-07-30 17:00:00+02', '17:00', 'altro', 'normale',
    '#8f6339', FALSE, 'dog-luna', 'demo-user-001', NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    'Compleanno di Fiorellino 🎉',
    '5 anni! Festeggiamo con una torta per cani',
    '2025-04-12 18:00:00+02', '18:00', 'altro', 'alta',
    '#8f6339', TRUE, 'dog-fiorellino', 'demo-user-001', NOW(), NOW()
  ),
  (
    gen_random_uuid()::TEXT,
    'Vaccino antirabbica',
    'Richiamo annuale obbligatorio per i viaggi',
    '2025-09-25 10:00:00+02', '10:00', 'vaccino', 'alta',
    '#a9824f', TRUE, 'dog-luna', 'demo-user-001', NOW(), NOW()
  );

-- ----
-- CATEGORIE ARTICOLI
-- ----
INSERT INTO "Category" ("id", "name", "slug") VALUES
  ('cat-adozione',      'Adozione',      'adozione'),
  ('cat-salute',        'Salute',        'salute'),
  ('cat-toelettatura',  'Toelettatura',  'toelettatura'),
  ('cat-razze',         'Razze',         'razze'),
  ('cat-educazione',    'Educazione',    'educazione'),
  ('cat-alimentazione', 'Alimentazione', 'alimentazione'),
  ('cat-lifestyle',     'Lifestyle',     'lifestyle'),
  ('cat-comportamento', 'Comportamento', 'comportamento'),
  ('cat-famiglia',      'Famiglia',      'famiglia'),
  ('cat-curiosita',     'Curiosità',     'curiosita'),
  ('cat-sport',         'Sport',         'sport')
ON CONFLICT ("slug") DO NOTHING;

-- ----
-- ARTICOLI (30 articoli di esempio)
-- ----
INSERT INTO "Article" ("id", "title", "subtitle", "slug", "content", "imageUrl", "authorId", "categoryId", "readingTime", "publishedAt", "createdAt", "updatedAt")
VALUES

('art-001',
 'Come scegliere il barboncino giusto per la tua famiglia',
 'Taglia, carattere ed esigenze: la guida completa per adottare in modo consapevole',
 'come-scegliere-il-barboncino-giusto-per-la-tua-famiglia',
 'Scegliere un barboncino da portare in famiglia è una decisione che va presa con calma e con la giusta informazione. Questa razza è disponibile in diverse taglie - toy, nano, medio e grande (royal) - e ciascuna ha esigenze differenti in termini di spazio, esercizio e gestione quotidiana.

Il primo passo è valutare lo spazio disponibile in casa e lo stile di vita della famiglia. Un barboncino toy o nano si adatta perfettamente a un appartamento cittadino, mentre un esemplare medio o royal ha bisogno di più movimento e, idealmente, di un giardino o di lunghe passeggiate quotidiane.

Un altro aspetto fondamentale riguarda la presenza di bambini piccoli in casa. Il barboncino è generalmente un cane affettuoso e paziente, ma le taglie più piccole possono essere più fragili e richiedono attenzione durante il gioco con i più piccoli.

Bisogna anche considerare il tempo che si può dedicare alla toelettatura: il pelo riccio e non stagionale del barboncino richiede spazzolature regolari e tagli periodici dal toelettatore.

Prima di adottare, è consigliabile visitare l''allevamento o il canile, osservare il temperamento dei genitori e chiedere informazioni sulla storia sanitaria della linea di sangue.

Con le giuste cure - alimentazione bilanciata, esercizio fisico, controlli veterinari regolari e tanto amore - il vostro barboncino sarà il compagno di vita perfetto.',
 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80',
 'demo-user-001', 'cat-adozione', 6, NOW() - INTERVAL '30 days', NOW(), NOW()),

('art-002',
 'Quanto vive un barboncino? Guida all''aspettativa di vita',
 'Fattori genetici, alimentazione e stile di vita che influenzano la longevità',
 'quanto-vive-un-barboncino-guida-allaspettativa-di-vita',
 'Il barboncino è tra le razze canine più longeve in assoluto. In media, un barboncino toy o nano può vivere dai 14 ai 18 anni, mentre le taglie medie e royal hanno un''aspettativa di vita intorno ai 12-15 anni.

Diversi fattori influenzano la longevità di questi cani. La genetica gioca un ruolo primario: scegliere un cucciolo proveniente da un allevamento serio, con genitori sani e testati per le patologie ereditarie tipiche della razza, riduce significativamente il rischio di malattie.

L''alimentazione è un altro pilastro fondamentale. Un piano nutrizionale equilibrato, adeguato all''età e alla taglia del cane, previene l''obesità - una delle principali cause di riduzione dell''aspettativa di vita.

L''attività fisica regolare mantiene il cuore e le articolazioni in salute, mentre la stimolazione mentale previene il declino cognitivo tipico della terza età. I controlli veterinari periodici permettono di individuare precocemente eventuali problemi di salute.

Anche la salute dentale merita attenzione particolare: il barboncino è predisposto a problemi di tartaro e gengivite. Con le giuste cure il vostro barboncino potrà accompagnarvi per moltissimi anni.',
 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80',
 'demo-user-001', 'cat-salute', 5, NOW() - INTERVAL '28 days', NOW(), NOW()),

('art-003',
 'Come lavare e toelettare il pelo del barboncino a casa',
 'Strumenti, tecniche e frequenza per mantenere il manto sempre in ordine',
 'come-lavare-e-toelettare-il-pelo-del-barboncino-a-casa',
 'Il pelo del barboncino è una delle sue caratteristiche più distinctive: riccio, denso e non stagionale, richiede cure costanti per restare sano e bello. La buona notizia è che, con un po'' di pratica, molte operazioni di toelettatura possono essere eseguite direttamente a casa.

Per quanto riguarda il lavaggio, la frequenza ideale è ogni 3-4 settimane, usando uno shampoo specifico per pelo riccio. Prima del bagno, è fondamentale spazzolare il pelo per eliminare i nodi.

Gli strumenti essenziali includono: spazzola a setole morbide, pettine a denti larghi, forbici arrotondate, tosaerba professionale e phon con diffusore.

La spazzolatura dovrebbe essere quotidiana o almeno 3 volte a settimana per evitare che il pelo si infeli. Il taglio vero e proprio è consigliabile affidarsi almeno inizialmente a un toelettatore professionista, che può mostrarti le tecniche base.

Le unghie vanno accorciate ogni 3-4 settimane, e le orecchie pulite regolarmente per prevenire infezioni.',
 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
 'demo-user-001', 'cat-toelettatura', 7, NOW() - INTERVAL '26 days', NOW(), NOW()),

('art-004',
 'Barboncino Toy o Nano: quale scegliere?',
 'Differenze di taglia, carattere e gestione tra le due varianti più diffuse',
 'barboncino-toy-o-nano-quale-scegliere',
 'Il barboncino toy e il barboncino nano sono le due varianti di taglia più diffuse in Italia. Pur condividendo lo stesso carattere brillante e affettuoso, presentano differenze importanti che possono influenzare la scelta.

Il barboncino toy pesa dai 2 ai 4 kg e misura fino a 28 cm al garrese. È il più piccolo e delicato, perfetto per appartamenti molto piccoli o per chi cerca un compagno da portare facilmente ovunque. Richiede attenzione nelle interazioni con bambini piccoli per via della sua fragilità ossea.

Il barboncino nano pesa dai 4 agli 8 kg e misura tra i 28 e i 38 cm. È più robusto del toy pur mantenendo dimensioni contenute. Tollera meglio le attività fisiche più vivaci ed è spesso descritto come il giusto compromesso tra taglia e robustezza.

Entrambe le varietà condividono l''intelligenza straordinaria, la docilità nell''addestramento, il pelo ipoallergenico e la longevità elevata. La scelta dipende principalmente dalle vostre abitudini di vita, dallo spazio disponibile e dalla presenza di bambini in casa.',
 'https://images.unsplash.com/photo-1616464478497-c9b3a92d6a2e?w=800&q=80',
 'demo-user-001', 'cat-razze', 5, NOW() - INTERVAL '25 days', NOW(), NOW()),

('art-005',
 'I migliori giochi per il barboncino: stimolazione mentale e fisica',
 'Attività e giocattoli per tenere impegnata la mente brillante di questa razza',
 'i-migliori-giochi-per-il-barboncino-stimolazione-mentale-e-fisica',
 'Il barboncino è considerato uno dei cani più intelligenti al mondo e ha un bisogno costante di stimolazione mentale oltre che fisica. Un barboncino annoiato può sviluppare comportamenti distruttivi o ansiosi.

I tappetini olfattivi sono tra gli strumenti più efficaci: nascondere bocconcini tra le fibre stimola il naturale istinto di ricerca e affatica mentalmente il cane molto più di una semplice passeggiata.

I giochi di problem solving, come i puzzle toys con compartimenti nascosti, sono ideali per tenere occupata la mente brillante del barboncino. Iniziate con livelli facili e aumentate progressivamente la difficoltà.

Il gioco del "trova": nascondere oggetti o bocconcini in casa e insegnare al cane a trovarli è un''attività a costo zero che diverte enormemente questa razza.

L''agility, anche in versione casalinga con slalom tra sgabelli e salti su cuscini, combina movimento fisico e concentrazione mentale.',
 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
 'demo-user-001', 'cat-educazione', 6, NOW() - INTERVAL '24 days', NOW(), NOW()),

('art-006',
 'Alimentazione estiva del barboncino: consigli pratici',
 'Come adattare la dieta e l''idratazione nei mesi più caldi dell''anno',
 'alimentazione-estiva-del-barboncino-consigli-pratici',
 'L''estate pone sfide particolari all''alimentazione del barboncino. Il caldo riduce l''appetito, aumenta il fabbisogno idrico e richiede aggiustamenti nella routine alimentare.

Il consiglio più importante è garantire sempre acqua fresca e pulita in quantità abbondante. Nei giorni più caldi, potete aggiungere cubetti di ghiaccio alla ciotola o preparare "ice lick" congelando brodo di pollo diluito con acqua.

Spostate i pasti nelle ore più fresche della giornata: la mattina presto e la sera dopo il tramonto. Evitate di somministrare il pasto subito prima o dopo attività fisiche intense.

Riducete leggermente le porzioni se il cane mangia meno del solito: è normale che l''appetito cali con il caldo. Compensate con snack idratanti come cetrioli tagliati a cubetti o carote fresche.

Evitate categoricamente cibi lasciati esposti al sole o a temperature elevate, che possono deteriorarsi rapidamente. In estate aumentate anche la frequenza dei controlli per eventuali parassiti.',
 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80',
 'demo-user-001', 'cat-alimentazione', 5, NOW() - INTERVAL '22 days', NOW(), NOW()),

('art-007',
 'Viaggiare con il barboncino: cosa sapere prima di partire',
 'Documenti, trasporto e consigli per vacanze serene con il proprio cane',
 'viaggiare-con-il-barboncino-cosa-sapere-prima-di-partire',
 'Portare il vostro barboncino in vacanza richiede un po'' di pianificazione, ma è assolutamente fattibile e può essere un''esperienza meravigliosa. Ecco tutto quello che dovete sapere.

Documenti essenziali: il passaporto europeo per animali (necessario per viaggi all''estero in UE), certificato di vaccinazione antirabbica aggiornata, libretto sanitario. Per alcuni paesi extra-UE potrebbe essere richiesto un test del titolo anticorpale.

In auto: utilizzate sempre un trasportino omologato o una cintura di sicurezza per cani. Non lasciare mai il cane in auto con temperature superiori ai 20°C. Fate soste ogni 2 ore per idratazione e bisogni.

In aereo: la maggior parte delle compagnie accetta cani in cabina se il peso totale (cane + borsa) non supera gli 8-10 kg. Il barboncino toy è quasi sempre ammesso. Prenotate sempre in anticipo e verificate le policy della compagnia.

In hotel: sempre più strutture sono pet-friendly. Usate piattaforme come BringFido o Booking con filtro pet-friendly.',
 'https://images.unsplash.com/photo-1553736026-ec5f4d0c7cea?w=800&q=80',
 'demo-user-001', 'cat-lifestyle', 6, NOW() - INTERVAL '20 days', NOW(), NOW()),

('art-008',
 'Ansia da separazione nel barboncino: cause e rimedi',
 'Come riconoscere i segnali e aiutare il cane a gestire la solitudine',
 'ansia-da-separazione-nel-barboncino-cause-e-rimedi',
 'Il barboncino è una razza particolarmente legata al proprietario e per questo può sviluppare ansia da separazione più facilmente di altre razze. Riconoscere i segnali e intervenire precocemente è fondamentale.

Segnali tipici di ansia da separazione: abbaiare o ululare eccessivo dopo la partenza del proprietario, distruzione di oggetti o mobili, eliminazione inappropriata in casa, eccessiva eccitazione al ritorno del proprietario, rifiuto di mangiare in sua assenza.

Le cause principali sono: eccessivo attaccamento sviluppato fin da cucciolo, cambiamenti improvvisi nella routine, traumi passati (abbandono, cambi di casa frequenti), mancanza di autonomia.

I rimedi più efficaci includono: desensibilizzazione graduale (uscite brevi con incremento progressivo), addestramento all''indipendenza, Kong e puzzle toys per occupare il cane durante le assenze, tecniche di rinforzo positivo per premiare il comportamento calmo, musica o TV accesa come stimolo sonoro.

Nei casi gravi è consigliabile rivolgersi a un comportamentalista.',
 'https://images.unsplash.com/photo-1583512603806-077998240c7a?w=800&q=80',
 'demo-user-001', 'cat-comportamento', 7, NOW() - INTERVAL '18 days', NOW(), NOW()),

('art-009',
 'I vaccini essenziali per il tuo barboncino',
 'Calendario vaccinale e protocolli di prevenzione consigliati dai veterinari',
 'i-vaccini-essenziali-per-il-tuo-barboncino',
 'La vaccinazione è uno degli strumenti più importanti per proteggere la salute del vostro barboncino. Ecco il calendario vaccinale standard e le informazioni essenziali.

Vaccinazioni obbligatorie o fortemente raccomandate: vaccino polivalente (cimurro, epatite, parvovirosi, parainfluenza), vaccino antirabbico (obbligatorio per viaggi all''estero e in alcune regioni italiane).

Vaccinazioni opzionali ma consigliate: vaccino contro la tosse dei canili (Bordetella), vaccino contro la leptospirosi (soprattutto per cani che frequentano aree umide).

Calendario cucciolo: prima vaccinazione a 6-8 settimane, richiamo a 10-12 settimane, seconda dose a 14-16 settimane. Dopo di che richiami annuali o triennali in base al tipo di vaccino.

Adulti: mantenere i richiami regolari e fare un check-up annuale che include esame del sangue, controllo parassiti e valutazione generale dello stato di salute.',
 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80',
 'demo-user-001', 'cat-salute', 6, NOW() - INTERVAL '17 days', NOW(), NOW()),

('art-010',
 'Come socializzare un cucciolo di barboncino',
 'Le fasi critiche dello sviluppo e le tecniche per un cane equilibrato',
 'come-socializzare-un-cucciolo-di-barboncino',
 'La socializzazione è uno dei processi più importanti nella vita di un cucciolo e ha un impatto duraturo sul carattere e sull''equilibrio del cane adulto. Il periodo critico va dalle 3 alle 14 settimane di vita.

Esperienze fondamentali da introdurre gradualmente: incontro con persone di diverse età, genere, aspetto fisico; contatto con altri cani e animali domestici; esposizione a suoni diversi (traffico, temporali, aspirapolvere); ambienti vari (parchi, negozi, trasporti pubblici, ascensori).

Il principio guida è la gradualità e il rinforzo positivo. Mai forzare il cucciolo a situazioni che lo spaventano: createte sempre associazioni positive usando premi e lodi.

Iscrivere il cucciolo a classi di puppy training è fortemente consigliato: permette di socializzare in un ambiente sicuro e controllato, e di imparare i comandi base in modo positivo.

Un barboncino ben socializzato sarà un cane adulto equilibrato, fiducioso e in grado di gestire situazioni nuove senza eccessivo stress.',
 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=800&q=80',
 'demo-user-001', 'cat-educazione', 6, NOW() - INTERVAL '16 days', NOW(), NOW()),

('art-011',
 'Il barboncino e i bambini: convivenza perfetta',
 'Consigli per costruire un rapporto sicuro e armonioso tra cane e bambini',
 'il-barboncino-e-i-bambini-convivenza-perfetta',
 'Il barboncino è tradizionalmente considerato una delle razze più adatte alla convivenza con i bambini. Dolce, paziente e giocherellone, sa adattarsi ai ritmi familiari. Tuttavia, alcune precauzioni sono fondamentali per garantire la sicurezza di entrambi.

Prima regola: non lasciare mai bambini piccoli (sotto i 6 anni) da soli con il cane, indipendentemente dal carattere dell''animale. Supervisionare sempre le interazioni.

Insegnate ai bambini il rispetto per il cane: non svegliarlo quando dorme, non disturbarlo mentre mangia, non strattonarlo per il pelo o la coda. Questi comportamenti, anche se involontari, possono portare a reazioni difensive.

Il barboncino toy è più fragile rispetto alle taglie maggiori: bambini molto vivaci possono involontariamente ferirlo. In famiglie con bambini piccoli, il barboncino nano o medio può essere una scelta più robusta.

Coinvolgere i bambini nella cura del cane (dare da mangiare sotto supervisione, spazzolatura, giochi) crea un legame speciale e insegna responsabilità e rispetto per gli animali.',
 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=800&q=80',
 'demo-user-001', 'cat-famiglia', 6, NOW() - INTERVAL '15 days', NOW(), NOW()),

('art-012',
 'Malattie comuni del barboncino e come prevenirle',
 'Le patologie più frequenti nella razza e le strategie di prevenzione',
 'malattie-comuni-del-barboncino-e-come-prevenirle',
 'Come tutte le razze, il barboncino ha alcune predisposizioni genetiche a determinate patologie. Conoscerle permette di monitorare il proprio cane e agire preventivamente.

Patologie ortopediche: la lussazione rotulea è comune nelle taglie toy e nano. Mantenere il cane in peso forma e limitare i salti da altezze eccessive aiuta a prevenirla.

Problemi oculari: atrofia progressiva della retina, cataratta giovanile, entropion. Controlli oculistici annuali e acquisto da allevatori che testano i riproduttori sono fondamentali.

Patologie dentali: il barboncino è molto predisposto a gengivite e tartaro, soprattutto nelle taglie più piccole. Spazzolare i denti regolarmente e somministrare snack dentali aiuta.

Epilessia idiopatica: presente nella razza, soprattutto nella linea toy. In caso di convulsioni, consultare immediatamente il veterinario.

Ipotiroidismo: più comune nei barboncini anziani. Sintomi: aumento di peso, letargia, perdita di pelo. Si gestisce con terapia ormonale.',
 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
 'demo-user-001', 'cat-salute', 7, NOW() - INTERVAL '14 days', NOW(), NOW()),

('art-013',
 'Addestramento base: i 10 comandi fondamentali',
 'Dal seduto al richiamo: la guida per insegnare i comandi essenziali',
 'addestramento-base-i-10-comandi-fondamentali',
 'Il barboncino è la seconda razza più intelligente al mondo secondo Stanley Coren, superato solo dal Border Collie. Apprende i comandi con estrema rapidità e ama compiacere il proprietario.

I 10 comandi fondamentali: 1) Seduto (Sit) - il primo comando da insegnare, base di tutto. 2) Terra/Giù (Down) - posizione di rilassamento. 3) Resta (Stay) - controllo dell''impulso. 4) Vieni/Qui (Come) - il richiamo, fondamentale per la sicurezza. 5) Lascia (Leave it) - per sicurezza con oggetti pericolosi. 6) Piede (Heel) - camminare al fianco senza tirare. 7) Seduto frontale (Front) - posizione di attenzione. 8) No/Basta - stop immediato di un''azione. 9) Piano (Easy) - rallentamento dell''eccitazione. 10) Cerca (Find it) - stimolazione olfattiva.

Principi base dell''addestramento positivo: sessioni brevi (5-10 minuti), ricompense immediate (entro 2 secondi), mai punire fisicamente, coerenza e pazienza.',
 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
 'demo-user-001', 'cat-educazione', 7, NOW() - INTERVAL '13 days', NOW(), NOW()),

('art-014',
 'La storia del barboncino: origini e curiosità',
 'Dalle origini europee alla conquista dei salotti reali',
 'la-storia-del-barboncino-origini-e-curiosita',
 'Il barboncino è una delle razze più antiche d''Europa, con origini che risalgono al Medioevo. Contrariamente a quanto si pensa comunemente, non è affatto un cane da salotto: originariamente era un instancabile cane da riporto in acqua.

Il nome "Barboncino" deriva dall''italiano "barba" (per via del muso riccioluto) o dal francese "caniche" (dal termine "cane" riferito alla caccia agli uccelli acquatici). In inglese viene chiamato "Poodle", probabilmente dal tedesco "Pudeln" che significa "sguazzare nell''acqua".

Nel XVI e XVII secolo il barboncino divenne il cane preferito della nobiltà europea, in particolare alla corte francese di Luigi XVI. La sua intelligenza straordinaria lo rese anche protagonista dei circhi ambulanti.

Curiosità storiche: il barboncino è stato il cane preferito di artisti come Goya, Rembrandt e Renoir. Winston Churchill ne fu appassionato proprietario. Elvis Presley possedeva barboncini bianchi.',
 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80',
 'demo-user-001', 'cat-curiosita', 5, NOW() - INTERVAL '12 days', NOW(), NOW()),

('art-015',
 'Barboncino in appartamento: tutto quello che devi sapere',
 'Spazio, routine e accortezze per una vita serena in città',
 'barboncino-in-appartamento-tutto-quello-che-devi-sapere',
 'Il barboncino, soprattutto nelle taglie toy e nano, è tra le razze più adatte alla vita in appartamento. Con le giuste accortezze, può vivere felice anche in spazi ridotti.

Lo spazio fisico non è il fattore più importante: conta molto di più la qualità del tempo trascorso con il proprietario e la ricchezza degli stimoli mentali. Un barboncino che riceve 2-3 uscite al giorno e sessioni di gioco mentale sarà molto più soddisfatto di un cane lasciato solo in un grande giardino.

Accortezze pratiche: angolo tutto suo con cuccia, ciotole e giocattoli; tappetini antiscivolo sui pavimenti lucidi; protezioni per balconi e scale; routine fissa per pasti e passeggiate.

Gestione del rumore: il barboncino non abbaia eccessivamente se correttamente educato. L''addestramento al "silenzio" è comunque consigliato in contesti condominiali.

Uscite minime consigliate: almeno 3 passeggiate al giorno, di cui una più lunga (20-30 minuti). Una sessione di gioco attivo o stimolazione mentale quotidiana completa il benessere.',
 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&q=80',
 'demo-user-001', 'cat-lifestyle', 5, NOW() - INTERVAL '11 days', NOW(), NOW()),

('art-016',
 'Come scegliere il veterinario giusto per il tuo barboncino',
 'Criteri di scelta, domande da fare e come costruire un rapporto di fiducia',
 'come-scegliere-il-veterinario-giusto-per-il-tuo-barboncino',
 'Il veterinario è il partner più importante nella salute del vostro barboncino. Scegliere quello giusto richiede tempo e attenzione, ma è un investimento fondamentale.

Cosa cercare in un buon veterinario: esperienza con razze di piccola taglia, disponibilità a rispondere alle domande, approccio calmo e rispettoso con gli animali, struttura pulita e attrezzata, disponibilità per emergenze o collaborazione con una clinica di guardia.

Domande utili da fare al primo incontro: quali sono i protocolli vaccinali consigliati? Con che frequenza raccomanda i check-up? Ha esperienza con barboncini? Quali sono le patologie più comuni che tratta nella razza?

Segnali di allerta: veterinario frettoloso, che non risponde alle domande, che prescrive farmaci senza visita, che non coinvolge il proprietario nelle decisioni.

Il check-up annuale è fondamentale anche per i cani giovani e apparentemente sani: permette di costruire una storia clinica del cane e di identificare precocemente eventuali problemi.',
 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80',
 'demo-user-001', 'cat-salute', 5, NOW() - INTERVAL '10 days', NOW(), NOW()),

('art-017',
 'I migliori accessori per il barboncino del 2024',
 'Dalla cuccia al guinzaglio: la guida agli acquisti essenziali e non',
 'i-migliori-accessori-per-il-barboncino-del-2024',
 'Scegliere i giusti accessori per il vostro barboncino migliora la qualità della vita di entrambi. Ecco una guida pratica agli acquisti essenziali e a quelli che vale la pena considerare.

Essenziali: cuccia con sponde morbide (dimensione M per toy/nano), ciotole in acciaio inox con base antiscivolo, guinzaglio di 2 metri in nylon o pelle, pettorina regolabile (mai collare di forza per i toy), trasportino omologato per auto.

Per la toelettatura: spazzola a pin per pelo riccio, pettine a denti larghi, forbici arrotondate, asciugamano in microfibra, shampoo ipoallergenico specifico per pelo riccio.

Per la stimolazione mentale: Kong classico (taglia S), tappetino olfattivo, puzzle toys livello base e intermedio, palline da tennis, giocattoli da mordere in gomma naturale.

Accessori smart: fontanella d''acqua (i barboncini preferiscono l''acqua corrente), GPS tracker per la sicurezza in spazi aperti, telecamera pet per monitorare il cane durante le assenze.',
 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
 'demo-user-001', 'cat-lifestyle', 6, NOW() - INTERVAL '9 days', NOW(), NOW()),

('art-018',
 'Barboncino e clima freddo: come proteggerlo d''inverno',
 'Cappottini, routine invernale e precauzioni per i mesi freddi',
 'barboncino-e-clima-freddo-come-proteggerlo-dinverno',
 'Il barboncino, soprattutto nelle taglie toy e nano, può risentire del freddo invernale. Il suo pelo riccio offre una certa protezione, ma alcune accortezze sono necessarie nei mesi più rigidi.

Quando è necessario un cappottino: temperature sotto i 5°C, vento forte, pioggia o neve. I barboncini toy sotto i 3 kg hanno maggiore dispersione termica e necessitano di protezione anche a temperature più miti. Privilegiate cappotti impermeabili con fodera interna in pile.

Protezione delle zampe: il sale usato per lo scioglimento del ghiaccio sui marciapiedi può irritare i polpastrelli. Usate cera protettiva sulle zampe prima delle uscite e lavatele sempre al rientro.

Attenzione all''ipotermia: sintomi includono tremori, letargia, andatura instabile. In caso di sospetta ipotermia, riscaldate il cane gradualmente e consultate il veterinario.

In casa: posizionate la cuccia lontano da correnti d''aria e pavimenti freddi. Un tappetino termico può essere un ottimo investimento per i cuccioli anziani.',
 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&q=80',
 'demo-user-001', 'cat-salute', 5, NOW() - INTERVAL '8 days', NOW(), NOW()),

('art-019',
 'Il barboncino anziano: cure e attenzioni speciali',
 'Come adattare la routine e la cura con l''avanzare dell''età',
 'il-barboncino-anziano-cure-e-attenzioni-speciali',
 'Il barboncino entra nella "terza età" intorno ai 10-12 anni per le taglie nano e medio, e intorno ai 12-14 per il toy. Con le giuste cure, questi anni possono essere sereni e di qualità.

Cambiamenti fisiologici attesi: rallentamento generale, riduzione dell''attività fisica, cambiamenti nel sonno, possibile declino sensoriale (vista, udito), tendenza all''aumento di peso.

Adattamenti nella routine: ridurre la lunghezza delle passeggiate mantenendo la frequenza, aumentare le pause durante le attività, evitare sforzi intensi nelle ore più calde, adattare il letto con supporti ortopedici.

Alimentazione senile: passare a un alimento specifico per cani senior, ricco di antiossidanti, con meno calorie ma più proteine di qualità. Integratori come glucosamina e omega-3 possono supportare la salute articolare.

Controlli veterinari: aumentare la frequenza a ogni 6 mesi. Esami del sangue completi per monitorare funzionalità renale, epatica e tiroidea.',
 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80',
 'demo-user-001', 'cat-salute', 7, NOW() - INTERVAL '7 days', NOW(), NOW()),

('art-020',
 'Come gestire la perdita del pelo nel barboncino',
 'Muta, sfrangiatura e caduta anomala: tutto quello che devi sapere',
 'come-gestire-la-perdita-del-pelo-nel-barboncino',
 'Una delle caratteristiche più apprezzate del barboncino è la scarsa perdita di pelo: questa razza non ha la classica muta stagionale e disperde pochissimi peli nell''ambiente. Tuttavia, ci sono situazioni in cui la caduta del pelo può aumentare.

Perdita normale: il barboncino perde principalmente pelo durante la spazzolatura e il bagno. Una quantità moderata è normale e non deve preoccupare.

Cause di perdita anomala: carenze nutrizionali (soprattutto zinco, biotina, omega-3), problemi ormonali (ipotiroidismo, squilibri ormonali), allergie alimentari o ambientali, infestazioni parassitarie, stress cronico, patologie dermatologiche.

Cosa fare: se notate aree di rarefazione del pelo, pelle arrossata, prurito eccessivo o cambio nella texture del pelo, consultate il veterinario. Un esame del sangue può identificare carenze o squilibri ormonali.

Prevenzione: dieta equilibrata con giusto apporto di acidi grassi omega-3, spazzolatura regolare, bagni con shampoo appropriato, trattamenti antiparassitari regolari.',
 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
 'demo-user-001', 'cat-toelettatura', 5, NOW() - INTERVAL '6 days', NOW(), NOW()),

('art-021',
 'Barboncino bianco: caratteristiche e cura del manto',
 'Come mantenere il pelo bianco brillante e senza ingiallimenti',
 'barboncino-bianco-caratteristiche-e-cura-del-manto',
 'Il barboncino bianco è forse il più iconico e riconoscibile tra i suoi "colleghi" di colore. Il suo manto candido, però, richiede attenzioni particolari per restare brillante e privo di quelle antiestetiche macchie giallastre che tendono a comparire nel tempo.

Le principali cause di ingiallimento: lacrimazione eccessiva (che macchia intorno agli occhi), saliva (che macchia intorno alla bocca e alle zampe), contatto con terreni umidi o erba, utilizzo di shampoo inadeguati.

Prevenzione dell''ingiallimento: pulire quotidianamente le lacrimazioni con dischetti di cotone inumiditi, asciugare sempre il muso dopo i pasti, evitare passeggiate su erba bagnata quando possibile.

Shampoo specifici: esistono shampoo "sbiancanti" o per pelo bianco specificamente formulati per neutralizzare le sfumature giallastre. Usateli ogni 2-3 lavaggi, non ogni volta.

Per le macchie già presenti: impacchi di succo di limone diluito (lasciare 10 minuti prima del bagno) o prodotti specifici per l''sbiancamento del pelo possono aiutare.',
 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80',
 'demo-user-001', 'cat-toelettatura', 6, NOW() - INTERVAL '5 days', NOW(), NOW()),

('art-022',
 'Gare e agility: il barboncino campione',
 'Come avvicinarsi al mondo delle competizioni cinofili',
 'gare-e-agility-il-barboncino-campione',
 'Il barboncino è uno dei cani più versatili nelle competizioni cinofili. La sua intelligenza, agilità e desiderio di compiacere il proprietario lo rendono un candidato eccellente per diverse discipline sportive.

Agility: il percorso di ostacoli è forse la disciplina più adatta al barboncino. Veloce, leggero e reattivo, eccelle nei percorsi ad alta velocità. I barboncini toy e nano competono in categorie specifiche adatte alle loro dimensioni.

Obedience: le gare di obbedienza mettono alla prova la precisione nell''esecuzione dei comandi. Il barboncino, con il suo quoziente intellettivo elevato, è naturalmente portato per questa disciplina.

Rally Obedience: più dinamico e accessibile dell''obedience tradizionale, è ottimo per iniziare il mondo delle competizioni.

Come iniziare: frequentare un centro cinofilo affiliato ENCI, partecipare a corsi base, praticare regolarmente. L''aspetto più importante è che sia un''esperienza piacevole per entrambi.',
 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
 'demo-user-001', 'cat-sport', 6, NOW() - INTERVAL '4 days', NOW(), NOW()),

('art-023',
 'Il barboncino nero: personalità e caratteristiche',
 'Tutto sul manto scuro e le particolarità di questa colorazione',
 'il-barboncino-nero-personalita-e-caratteristiche',
 'Il barboncino nero è uno degli esemplari più affascinanti della razza. Il suo manto corvino, lucido e uniforme è da sempre associato a eleganza e distinzione. Ma ci sono peculiarità che lo distinguono dagli altri colori?

Dal punto di vista caratteriale, non esistono differenze significative legate al colore del pelo. Il carattere dipende dalla linea di sangue, dalla socializzazione e dall''educazione ricevuta, non dal colore del manto.

Cura del manto nero: il pelo scuro tende a mettere in evidenza eventuali residui di forfora o polline. La spazzolatura frequente è ancora più importante. Attenzione anche ai prodotti di toelettatura: alcuni shampoo schiarenti, se usati accidentalmente, possono alterare il colore.

Esposizione al sole: come per i capi di abbigliamento, anche il pelo nero del barboncino può tendere al rossiccio se esposto prolungatamente alla luce solare diretta. Non è una malattia, ma una caratteristica da tenere presente.

Nella storia canina, il barboncino nero era particolarmente apprezzato dai cacciatori per la sua difficile visibilità nell''ambiente acquatico.',
 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80',
 'demo-user-001', 'cat-razze', 5, NOW() - INTERVAL '3 days', NOW(), NOW()),

('art-024',
 'Come scegliere il cibo migliore per il barboncino',
 'Crocchette, umido o BARF: pro e contro di ogni approccio alimentare',
 'come-scegliere-il-cibo-migliore-per-il-barboncino',
 'La nutrizione è uno dei pilastri della salute del barboncino. Con la varietà di opzioni disponibili oggi sul mercato, orientarsi può essere difficile. Ecco una guida chiara e pratica.

Crocchette di qualità: il modo più pratico e bilanciato per nutrire il vostro cane. Cercate prodotti con carne come primo ingrediente (non "farina di carne"), senza coloranti artificiali, conservanti chimici o riempitivi come mais e frumento in eccesso.

Alimentazione umida: ottima integrazione o alternativa alle crocchette, particolarmente utile per aumentare l''apporto idrico. Meno pratica da gestire e generalmente più costosa a parità di apporto nutrizionale.

BARF (Biologically Appropriate Raw Food): dieta basata su carne cruda, ossa edibili e verdure. Richiede conoscenza e pianificazione per garantire il bilanciamento nutrizionale. Consigliato solo con supporto veterinario.

Alimenti da evitare assolutamente: cioccolato, uva, uvetta, cipolla, aglio, xilitolo (dolcificante artificiale), macadamia, nocciole, avocado.',
 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80',
 'demo-user-001', 'cat-alimentazione', 6, NOW() - INTERVAL '2 days', NOW(), NOW()),

('art-025',
 'Paure e fobie nel barboncino: come aiutarlo',
 'Gestire la paura dei tuoni, dei fuochi d''artificio e degli estranei',
 'paure-e-fobie-nel-barboncino-come-aiutarlo',
 'Molti barboncini sviluppano paure o fobie nel corso della vita. Le più comuni sono la fobia dei tuoni e dei fuochi d''artificio, la paura degli estranei e la paura di oggetti o situazioni specifiche.

Riconoscere la paura: tremori, nascondersi, urinazione involontaria, abbaiare eccessivo, distruzione di oggetti, tentativo di fuga, ansimare e sbavare senza motivo apparente.

Cosa NON fare: non rassicurare eccessivamente il cane durante la crisi (rinforza l''ansia), non punirlo per i comportamenti di paura, non forzarlo ad affrontare ciò che lo spaventa.

Strategie efficaci: desensibilizzazione sistematica (esposizione graduale e controllata allo stimolo temuto), counter-conditioning (creare associazioni positive con lo stimolo), safe space (creare un rifugio sicuro dove il cane può ritirarsi), feromoni calmanti (DAP - Dog Appeasing Pheromone).

Per le fobie severe, considerare la consulenza con un comportamentalista e, nei casi più gravi, una terapia farmacologica temporanea prescritta dal veterinario.',
 'https://images.unsplash.com/photo-1583512603806-077998240c7a?w=800&q=80',
 'demo-user-001', 'cat-comportamento', 6, NOW() - INTERVAL '1 day', NOW(), NOW()),

('art-026',
 'Il barboncino Royal: il gigante della famiglia',
 'Caratteristiche, esigenze e personalità del barboncino di taglia grande',
 'il-barboncino-royal-il-gigante-della-famiglia',
 'Il barboncino Royal (o Standard in alcuni paesi) è la taglia originale della razza: il cane da caccia e da riporto che ha preceduto secoli di selezione verso taglie più piccole. Con la sua statura imponente (40-60 cm al garrese, 20-30 kg), è il meno comune dei quattro tipi ma possiede un fascino unico.

Carattere: mantiene tutto l''intelligenza e l''affettuosità delle taglie più piccole, ma con una maggiore stabilità temperamentale. Meno nervoso e più equilibrato, è eccellente con i bambini e con altri animali.

Esigenze fisiche: a differenza del toy o nano, il Royal ha bisogno di attività fisica abbondante: almeno 1-2 ore di esercizio al giorno. Non è adatto a piccoli appartamenti senza accesso a spazi verdi.

Sport e attività: caccia (per cui è originariamente selezionato), agility, canicross, nuoto. Eccelle nelle discipline che richiedono resistenza e lavoro.

Salute: generalmente più robusto delle taglie più piccole, ha una predisposizione alla dilatazione gastrica (GDV) comune nelle razze di taglia grande. Attenzione a non farlo correre dopo i pasti.',
 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80',
 'demo-user-001', 'cat-razze', 6, NOW(), NOW(), NOW()),

('art-027',
 'Cucciolo di barboncino: i primi 3 mesi in casa',
 'Come gestire l''arrivo del cucciolo e le prime settimane di convivenza',
 'cucciolo-di-barboncino-i-primi-3-mesi-in-casa',
 'I primi 3 mesi dopo l''arrivo di un cucciolo di barboncino sono fondamentali per gettare le basi di una convivenza armoniosa e per sviluppare le abitudini che lo accompagneranno per tutta la vita.

Prima settimana: lasciate che il cucciolo esplori casa a suo ritmo, senza forzarlo. Create uno spazio sicuro con cuccia, ciotole e area per i bisogni. Limitare le visite di estranei nei primissimi giorni.

Routine: stabilite subito orari fissi per pasti, passeggiate e riposo. I cuccioli hanno bisogno di prevedibilità per sentirsi sicuri. Pasti: 3-4 volte al giorno fino ai 6 mesi.

Educazione di base: iniziate subito con nome e richiamo, gestione del morso (il cucciolo morde per giocare: insegnategli la giusta pressione), abitudine al guinzaglio, risposta al "no".

Visite veterinarie: la prima visita entro la prima settimana dall''arrivo per un check-up completo e per impostare il calendario vaccinale.',
 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=800&q=80',
 'demo-user-001', 'cat-adozione', 7, NOW(), NOW(), NOW()),

('art-028',
 'Barboncino e allergie: è il cane giusto per gli allergici?',
 'Il pelo ipoallergenico e cosa significa davvero per chi soffre di allergie',
 'barboncino-e-allergie-e-il-cane-giusto-per-gli-allergici',
 'Il barboncino è spesso consigliato come "cane ipoallergenico" per le persone allergiche ai cani. Ma cosa significa esattamente e quanto è vera questa affermazione?

Cosa causa le allergie ai cani: contrariamente alla credenza popolare, non è il pelo in sé a causare le allergie, ma le proteine presenti nella saliva, nell''urina e nella forfora (cellule cutanee morte) del cane, chiamate Can f 1 e Can f 2.

Perché il barboncino è considerato ipoallergenico: il suo pelo riccio trattiene la forfora invece di disperderla nell''ambiente; perde pochissimi peli; produce meno forfora rispetto ad altre razze.

La realtà: non esiste un cane completamente privo di allergeni. Il barboncino produce comunque le proteine allergeniche, semplicemente le disperde meno nell''ambiente rispetto ad altre razze.

Consiglio pratico: se soffrite di allergie, trascorrete del tempo con un barboncino prima di adottarlo per valutare la vostra reazione individuale.',
 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80',
 'demo-user-001', 'cat-salute', 5, NOW(), NOW(), NOW()),

('art-029',
 'Piscina e acqua: il barboncino ama nuotare?',
 'L''istinto acquatico della razza e come introdurlo all''acqua in sicurezza',
 'piscina-e-acqua-il-barboncino-ama-nuotare',
 'Il barboncino discende da cani da riporto in acqua e molti esemplari conservano un istinto acquatico innato. Ma non tutti i barboncini amano l''acqua, e l''approccio corretto è fondamentale per creare un''esperienza positiva.

Istinto naturale: molti barboncini, soprattutto il Royal e il Medio, mostrano un''attrazione naturale per l''acqua. Il pelo riccio, originariamente selezionato proprio per proteggere il cane nelle acque fredde, assorbe molto liquido ma si asciuga relativamente in fretta.

Come introdurre il cucciolo all''acqua: mai forzarlo. Iniziate con pozze basse (acqua fino alle zampe), premiate con entusiasmo ogni approccio spontaneo all''acqua, fate bagni in compagnia di cani adulti che amano nuotare.

Sicurezza in piscina: anche i cani eccellenti nuotatori possono affaticarsi o non riuscire a trovare le scale di uscita. Supervisionate sempre, considerate un giubbotto di salvataggio per i cani inesperti.

Idroterapia: il nuoto è eccellente per la riabilitazione ortopedica, particolarmente indicato per barboncini con lussazione rotulea o artrite.',
 'https://images.unsplash.com/photo-1553736026-ec5f4d0c7cea?w=800&q=80',
 'demo-user-001', 'cat-lifestyle', 5, NOW(), NOW(), NOW()),

('art-030',
 'Barboncino Apricot: il colore più amato',
 'Caratteristiche del mantello albicocca e come mantenerlo splendente',
 'barboncino-apricot-il-colore-piu-amato',
 'Il barboncino apricot (albicocca) è diventato negli ultimi anni uno dei colori più ricercati e amati della razza. La sua tonalità calda e sfumata, che può variare dal crema pallido all''arancione intenso, gli conferisce un aspetto quasi "teddy bear".

Genetica del colore apricot: il colore albicocca è determinato da geni specifici ed è una variante che si è sviluppata nel XX secolo. Non è sempre stabile: molti barboncini apricot schiariscono significativamente con l''età, avvicinandosi al crema.

Cura del manto apricot: come per il bianco, il pelo apricot tende a mostrare le impurità. La pulizia regolare intorno agli occhi e alla bocca è essenziale. Evitate shampoo schiarenti che potrebbero alterare la tonalità.

Ingiallimento: il manto apricot può sviluppare zone più scure o più chiare con il tempo, soprattutto in prossimità delle lacrimazioni oculari. Una pulizia quotidiana e l''uso di shampoo specifici per pelo colorato aiutano a mantenere la tonalità uniforme.

Il barboncino apricot è spesso confuso con il cream o il red: in realtà sono tre colori distinti, con sfumature e caratteristiche genetiche differenti.',
 'https://images.unsplash.com/photo-1616464478497-c9b3a92d6a2e?w=800&q=80',
 'demo-user-001', 'cat-razze', 5, NOW(), NOW(), NOW())

ON CONFLICT ("slug") DO NOTHING;

-- Commenti demo sugli articoli
INSERT INTO "Comment" ("id", "content", "articleId", "userId", "createdAt")
VALUES
  (gen_random_uuid()::TEXT, 'Articolo molto utile! Ho adottato il mio barboncino toy da 2 mesi seguendo esattamente questi consigli.', 'art-001', 'demo-user-001', NOW() - INTERVAL '5 days'),
  (gen_random_uuid()::TEXT, 'Il mio Luna ha 16 anni ed è ancora in ottima salute. L''alimentazione è davvero fondamentale.', 'art-002', 'demo-user-001', NOW() - INTERVAL '3 days'),
  (gen_random_uuid()::TEXT, 'Grazie per il calendario vaccinale dettagliato! Molto chiaro e completo.', 'art-009', 'demo-user-001', NOW() - INTERVAL '1 day');

-- Like demo
INSERT INTO "Like" ("id", "articleId", "userId", "createdAt")
VALUES
  (gen_random_uuid()::TEXT, 'art-001', 'demo-user-001', NOW() - INTERVAL '10 days'),
  (gen_random_uuid()::TEXT, 'art-004', 'demo-user-001', NOW() - INTERVAL '8 days'),
  (gen_random_uuid()::TEXT, 'art-009', 'demo-user-001', NOW() - INTERVAL '5 days'),
  (gen_random_uuid()::TEXT, 'art-014', 'demo-user-001', NOW() - INTERVAL '3 days')
ON CONFLICT ("articleId", "userId") DO NOTHING;

-- =============================================================================
-- FINE SCRIPT
-- =============================================================================
-- Dopo aver eseguito questo script:
-- 1. Abilita i bucket Storage nel pannello Supabase: gallery, documents, avatars
-- 2. Copia le chiavi dal pannello Supabase (Settings > API) nelle variabili d'ambiente
-- 3. Configura le variabili d'ambiente nell'app:
--    NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
-- 4. Avvia l'applicazione con: npm run dev
-- =============================================================================
