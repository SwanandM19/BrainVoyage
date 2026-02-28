import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [totalUsers, totalVideos, totalTeachers, pendingTeachers] = await Promise.all([
    prisma.user.count(),
    prisma.video.count(),
    prisma.teacherProfile.count(),
    prisma.teacherProfile.count({ where: { verified: false } }),
  ]);

  const topTeachers = await prisma.user.findMany({
    where: { role: "TEACHER", teacherProfile: { verified: true } },
    include: {
      teacherProfile: true,
      _count: { select: { videos: true } },
    },
    orderBy: { teacherProfile: { totalViews: "desc" } },
    take: 5,
  });

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage platform content and users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Users</p>
          <p className="text-3xl font-extrabold mt-2">{totalUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Videos</p>
          <p className="text-3xl font-extrabold mt-2">{totalVideos.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Verified Teachers</p>
          <p className="text-3xl font-extrabold mt-2">{totalTeachers.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Approval</p>
          <p className="text-3xl font-extrabold mt-2 text-orange-500">{pendingTeachers}</p>
        </div>
      </div>

      {/* Action Links */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/teachers"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition flex items-center gap-4"
        >
          <div className="text-4xl">👨‍🏫</div>
          <div>
            <h2 className="font-bold text-lg">Manage Teachers</h2>
            <p className="text-sm text-gray-500">Approve and manage teacher accounts</p>
          </div>
          <svg className="w-6 h-6 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href="/feed"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition flex items-center gap-4"
        >
          <div className="text-4xl">📺</div>
          <div>
            <h2 className="font-bold text-lg">View Videos</h2>
            <p className="text-sm text-gray-500">Browse all videos on the platform</p>
          </div>
          <svg className="w-6 h-6 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Top Teachers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-extrabold mb-4">Top Teachers</h2>
        {topTeachers.length === 0 ? (
          <p className="text-gray-500 text-sm">No verified teachers yet</p>
        ) : (
          <div className="space-y-4">
            {topTeachers.map((teacher, index) => (
              <div
                key={teacher.id}
                className="flex items-center gap-4 pb-4 border-b last:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{teacher.teacherProfile?.fullName}</p>
                  <p className="text-sm text-gray-500">{teacher.teacherProfile?.subject.join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">{teacher._count.videos}</p>
                  <p className="text-xs text-gray-500">videos</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
