import { prisma } from "@/lib/prisma";
import VideoCard from "@/components/video/VideoCard";
import { auth } from "@/lib/auth";

export default async function FeedPage({ searchParams }: { searchParams: { class?: string; subject?: string } }) {
  const session = await auth();
  const studentProfile = session ? await prisma.studentProfile.findUnique({ where: { userId: session.user.id } }) : null;

  const classFilter = searchParams.class ? parseInt(searchParams.class) : studentProfile?.class;

  const videos = await prisma.video.findMany({
    where: {
      published: true,
      teacher: { teacherProfile: { verified: true } },
      ...(classFilter && { class: classFilter }),
      ...(searchParams.subject && { subject: searchParams.subject }),
    },
    include: {
      teacher: { select: { id: true, teacherProfile: { select: { fullName: true, avatar: true } } } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">Your Learning Feed</h1>
          {studentProfile && (
            <p className="text-gray-500 text-sm mt-1">Class {studentProfile.class} • {studentProfile.board}</p>
          )}
        </div>
        <div className="flex gap-2">
          {[null, 8, 9, 10].map((c) => (
            <a key={c ?? "all"} href={c ? `?class=${c}` : "/feed"}
              className={`px-3 py-1.5 rounded text-xs font-bold border transition ${(classFilter === c || (!classFilter && !c)) ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 text-gray-500 hover:border-orange-400"}`}>
              {c ? `Class ${c}` : "All"}
            </a>
          ))}
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <p className="font-bold text-gray-600">No videos yet for this filter</p>
          <p className="text-gray-400 text-sm mt-1">Check back once teachers start uploading!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => <VideoCard key={video.id} video={video as any} />)}
        </div>
      )}
    </div>
  );
}
