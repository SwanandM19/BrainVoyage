import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, approved } = await req.json();

  await prisma.teacherProfile.update({
    where: { userId },
    data: { verified: approved, verifiedAt: approved ? new Date() : null },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { role: approved ? "TEACHER" : "STUDENT" },
  });

  return NextResponse.json({ success: true });
}
