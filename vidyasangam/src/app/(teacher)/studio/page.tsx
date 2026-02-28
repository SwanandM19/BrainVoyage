import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudioPage() {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  const teacher = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      teacherProfile: true,
      videos: {
        include: {
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!teacher?.teacherProfile) {
    redirect("/onboarding/teacher");
  }

  const profile = teacher.teacherProfile;
  const totalViews = teacher.videos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = teacher.videos.reduce((sum, v) => sum + (v._count?.likes ?? 0), 0);

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">My Studio</h1>
        <p className="text-gray-500 mt-1">Manage your channel and videos</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Videos</p>
          <p className="text-3xl font-extrabold mt-2">{teacher.videos.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Views</p>
          <p className="text-3xl font-extrabold mt-2">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Likes</p>
          <p className="text-3xl font-extrabold mt-2">{totalLikes.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Status</p>
          <p className={`text-3xl font-extrabold mt-2 ${profile.verified ? "text-green-600" : "text-yellow-600"}`}>
            {profile.verified ? "✓" : "⏳"}
          </p>
        </div>
      </div>

      {/* Channel Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-extrabold">{profile.fullName}</h2>
            <p className="text-gray-500 text-sm mt-1">{profile.subject.join(", ")}</p>
          </div>
          <Link
            href="/settings"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
          >
            Edit Channel
          </Link>
        </div>
        {profile.bio && (
          <p className="text-gray-600 text-sm">{profile.bio}</p>
        )}
        {!profile.verified && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <p className="text-sm font-bold text-yellow-800">⏳ Verification Pending</p>
            <p className="text-xs text-yellow-700 mt-1">Your channel is being reviewed by our admin team. This typically takes 24-48 hours.</p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="mb-8">
        <Link
          href="/upload"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          + Upload New Video
        </Link>
      </div>

      {/* Videos List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {teacher.videos.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-4">📹</p>
            <p className="font-bold text-gray-600">No videos yet</p>
            <p className="text-gray-400 text-sm mt-1">Start by uploading your first video</p>
            <Link href="/upload" className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition">
              Upload Video
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {teacher.videos.map((video) => (
              <div key={video.id} className="p-4 hover:bg-gray-50 transition flex items-center gap-4">
                <div className="w-24 h-16 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-2xl">🎬</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{video.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {video.class && `Class ${video.class}`} • {video.subject} • {video.board}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>👁️ {video.views}</span>
                    <span>❤️ {video._count?.likes ?? 0}</span>
                    <span>💬 {video._count?.comments ?? 0}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Link href={`/video/${video.id}`} className="text-orange-500 hover:text-orange-600 font-bold text-sm">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
