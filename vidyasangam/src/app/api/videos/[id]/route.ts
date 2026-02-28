import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  const video = await prisma.video.findUnique({
    where: { id: params.id },
    include: {
      teacher: {
        select: {
          id: true,
          teacherProfile: true,
          _count: { select: { followers: true, videos: true } },
        },
      },
      comments: {
        include: {
          user: { select: { id: true, name: true, image: true, studentProfile: { select: { fullName: true, avatar: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { likes: true } },
    },
  });

  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Increment view count
  await prisma.video.update({ where: { id: params.id }, data: { views: { increment: 1 } } });

  // Update watch history if logged in
  if (session?.user.id) {
    await prisma.watchHistory.upsert({
      where: { userId_videoId: { userId: session.user.id, videoId: params.id } },
      create: { userId: session.user.id, videoId: params.id, progress: 0 },
      update: {},
    });
  }

  return NextResponse.json(video);
}
