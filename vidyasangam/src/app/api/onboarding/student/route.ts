import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  await prisma.studentProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...data },
    update: { ...data },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: data.fullName, role: "STUDENT" },
  });

  return NextResponse.json({ success: true });
}
