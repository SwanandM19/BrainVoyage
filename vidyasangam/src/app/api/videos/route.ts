import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  url: z.string().url(),
  thumbnail: z.string().optional(),
  duration: z.number().optional(),
  class: z.number().min(1).max(12),
  board: z.string(),
  subject: z.string(),
  tags: z.array(z.string()).optional(),
});

// GET all videos (with filters)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classFilter = searchParams.get("class");
  const board = searchParams.get("board");
  const subject = searchParams.get("subject");

  const videos = await prisma.video.findMany({
    where: {
      published: true,
      teacher: { teacherProfile: { verified: true } },
      ...(classFilter && { class: parseInt(classFilter) }),
      ...(board && { board }),
      ...(subject && { subject }),
    },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          image: true,
          teacherProfile: { select: { fullName: true, avatar: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(videos);
}

// POST create video (teacher only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const video = await prisma.video.create({
      data: {
        ...data,
        tags: data.tags ?? [],
        teacherId: session.user.id,
      },
    });

    // Increment teacher total views (will be 0 initially, updated on watch)
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
}
