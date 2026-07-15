import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const photos = await prisma.gallery.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url, caption, dogId } = body;

    if (!url || !dogId) {
      return NextResponse.json({ error: "URL e cane sono obbligatori" }, { status: 400 });
    }

    const photo = await prisma.gallery.create({
      data: { url, caption, dogId, userId: session.user.id },
    });

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio della foto" }, { status: 500 });
  }
}
