import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { videoId } = await req.json();

  const existing = await prisma.like.findUnique({
    where: { userId_videoId: { userId: session.user.id, videoId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  } else {
    await prisma.like.create({ data: { userId: session.user.id, videoId } });
    // Award points to student
    await prisma.user.update({ where: { id: session.user.id }, data: { points: { increment: 2 } } });
    return NextResponse.json({ liked: true });
  }
}
