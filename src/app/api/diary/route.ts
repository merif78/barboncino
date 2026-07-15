import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { diaryFormSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dogId = searchParams.get("dogId");

  const entries = await prisma.diary.findMany({
    where: {
      userId: session.user.id,
      ...(dogId ? { dogId } : {}),
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = diaryFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { date, ...rest } = parsed.data;

    const entry = await prisma.diary.create({
      data: {
        ...rest,
        date: new Date(date),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio della voce" }, { status: 500 });
  }
}
