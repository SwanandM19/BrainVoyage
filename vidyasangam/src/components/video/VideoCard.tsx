import Link from "next/link";
import { formatDuration, formatViews } from "@/lib/utils";

export default function VideoCard({ video }: { video: any }) {
  const teacher = video.teacher?.teacherProfile;
  const teacherName = teacher?.fullName ?? "Unknown Teacher";

  return (
    <Link href={`/video/${video.id}`} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 hover:shadow-md transition group block">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
            <span className="text-4xl">🎥</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-orange-500 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
        {video.duration > 0 && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </span>
        )}
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
          Class {video.class}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">{video.subject}</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-400 font-medium">{video.board}</span>
        </div>
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-3 leading-snug">{video.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
              {teacherName.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-gray-600 truncate max-w-[120px]">{teacherName}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <span className="text-xs font-medium">{formatViews(video.views)} views</span>
            <span className="text-xs font-medium">❤️ {video._count?.likes ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
