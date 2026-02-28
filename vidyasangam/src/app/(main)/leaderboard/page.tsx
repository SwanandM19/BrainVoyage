import { prisma } from "@/lib/prisma";

export default async function LeaderboardPage() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT", studentProfile: { isNot: null } },
    orderBy: { points: "desc" },
    take: 20,
    include: { studentProfile: { select: { fullName: true, class: true, city: true } } },
  });

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold">National Leaderboard</h1>
        <p className="text-gray-500 mt-1">Top students ranked by XP earned through learning activities</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Student</div>
          <div className="col-span-2">Class</div>
          <div className="col-span-2">City</div>
          <div className="col-span-2 text-right">Points</div>
        </div>
        {students.map((student, index) => (
          <div key={student.id} className={`grid grid-cols-12 px-6 py-4 items-center border-b border-gray-100 last:border-0 hover:bg-orange-50/50 transition ${index < 3 ? "bg-gradient-to-r from-orange-50/30 to-transparent" : ""}`}>
            <div className="col-span-1 text-lg">{medals[index] ?? <span className="text-sm font-bold text-gray-400">#{index + 1}</span>}</div>
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-extrabold text-sm">
                {student.studentProfile?.fullName?.charAt(0) ?? "S"}
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">{student.studentProfile?.fullName ?? "Student"}</p>
                <p className="text-xs text-gray-400 font-medium">{student.email}</p>
              </div>
            </div>
            <div className="col-span-2 text-sm font-bold text-gray-600">Class {student.studentProfile?.class}</div>
            <div className="col-span-2 text-sm text-gray-500">{student.studentProfile?.city ?? "—"}</div>
            <div className="col-span-2 text-right">
              <span className="bg-orange-100 text-orange-600 font-extrabold text-sm px-3 py-1 rounded-full">{student.points.toLocaleString()} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
