import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { videoId, content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Empty comment" }, { status: 400 });

  const comment = await prisma.comment.create({
    data: { content: content.trim(), userId: session.user.id, videoId },
    include: { user: { select: { id: true, name: true, studentProfile: { select: { fullName: true, avatar: true } } } } },
  });

  // Award points
  await prisma.user.update({ where: { id: session.user.id }, data: { points: { increment: 5 } } });

  return NextResponse.json(comment, { status: 201 });
}
