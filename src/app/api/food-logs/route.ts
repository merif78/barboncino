import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { foodLogFormSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dogId = searchParams.get("dogId");

  const logs = await prisma.foodLog.findMany({
    where: {
      userId: session.user.id,
      ...(dogId ? { dogId } : {}),
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ logs });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = foodLogFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const { date, ...rest } = parsed.data;

    const log = await prisma.foodLog.create({
      data: {
        ...rest,
        date: new Date(date),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore durante il salvataggio del pasto" }, { status: 500 });
  }
}
