import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ documents });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, url, type, dogId } = body;

    if (!name || !url || !dogId) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const document = await prisma.document.create({
      data: { name, url, type: type || "altro", dogId, userId: session.user.id },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio del documento" }, { status: 500 });
  }
}
