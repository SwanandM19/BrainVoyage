"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReactPlayer from "react-player";
import Link from "next/link";

export default function VideoPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [video, setVideo] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/videos/${params.id}`).then((r) => r.json()).then((d) => { setVideo(d); setLoading(false); });
  }, [params.id]);

  async function handleLike() {
    if (!session) return;
    const res = await fetch("/api/likes", { method: "POST", body: JSON.stringify({ videoId: params.id }), headers: { "Content-Type": "application/json" } });
    const data = await res.json();
    setLiked(data.liked);
  }

  async function handleFollow() {
    if (!session || !video) return;
    const res = await fetch("/api/follow", { method: "POST", body: JSON.stringify({ teacherId: video.teacher.id }), headers: { "Content-Type": "application/json" } });
    const data = await res.json();
    setFollowing(data.following);
  }

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !comment.trim()) return;
    const res = await fetch("/api/comments", { method: "POST", body: JSON.stringify({ videoId: params.id, content: comment }), headers: { "Content-Type": "application/json" } });
    const newComment = await res.json();
    setVideo((v: any) => ({ ...v, comments: [newComment, ...v.comments] }));
    setComment("");
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!video) return <div className="text-center py-20 text-gray-400">Video not found</div>;

  const teacher = video.teacher?.teacherProfile;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Player */}
        <div className="bg-black rounded-xl overflow-hidden aspect-video">
          <ReactPlayer url={video.url} width="100%" height="100%" controls playing={false} />
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded uppercase">{video.subject}</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase">Class {video.class}</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">{video.board}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{video.title}</h1>
          {video.description && <p className="text-gray-500 text-sm leading-relaxed mb-4">{video.description}</p>}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{video.views} views</span>
            <button onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${liked ? "bg-red-50 text-red-500 border border-red-200" : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"}`}>
              ❤️ {liked ? "Liked" : "Like"} ({video._count?.likes ?? 0})
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-extrabold mb-4 uppercase text-sm tracking-wider text-gray-500">Comments ({video.comments?.length ?? 0})</h3>
          {session && (
            <form onSubmit={postComment} className="flex gap-3 mb-6">
              <input value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <button type="submit" className="bg-orange-500 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition">Post</button>
            </form>
          )}
          <div className="space-y-4">
            {video.comments?.map((c: any) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs flex-shrink-0">
                  {(c.user?.studentProfile?.fullName ?? c.user?.name ?? "U").charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">{c.user?.studentProfile?.fullName ?? c.user?.name ?? "User"}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Sidebar */}
      <aside>
        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">About the Teacher</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-extrabold text-xl">
              {teacher?.fullName?.charAt(0) ?? "T"}
            </div>
            <div>
              <p className="font-extrabold">{teacher?.fullName}</p>
              <p className="text-xs text-gray-500">{teacher?.subject?.join(", ")}</p>
            </div>
          </div>
          {teacher?.bio && <p className="text-sm text-gray-500 mb-4 leading-relaxed">{teacher.bio}</p>}
          <div className="flex gap-4 text-center mb-4">
            <div>
              <p className="font-extrabold text-lg">{video.teacher?._count?.videos ?? 0}</p>
              <p className="text-xs text-gray-400 font-bold uppercase">Videos</p>
            </div>
            <div>
              <p className="font-extrabold text-lg">{video.teacher?._count?.followers ?? 0}</p>
              <p className="text-xs text-gray-400 font-bold uppercase">Followers</p>
            </div>
          </div>
          {session && session.user.role === "STUDENT" && (
            <button onClick={handleFollow}
              className={`w-full py-2.5 rounded-lg text-sm font-bold transition ${following ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-orange-500 text-white hover:bg-orange-600"}`}>
              {following ? "✓ Following" : "+ Follow Teacher"}
            </button>
          )}
          <Link href={`/teacher/${video.teacher?.id}`} className="block text-center text-xs text-orange-500 hover:underline font-bold mt-3 uppercase tracking-wide">
            View Full Channel →
          </Link>
        </div>
      </aside>
    </div>
  );
}
