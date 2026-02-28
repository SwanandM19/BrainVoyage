import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ApproveButton from "./ApproveButton";

export default async function AdminTeachersPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/feed");

  const pending = await prisma.teacherProfile.findMany({
    where: { verified: false },
    include: { user: { select: { id: true, email: true } } },
  });

  const approved = await prisma.teacherProfile.findMany({
    where: { verified: true },
    include: { user: { select: { id: true, email: true, _count: { select: { videos: true } } } } },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold">Teacher Management</h1>

      {/* Pending */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-extrabold uppercase text-sm tracking-wider text-gray-500">Pending Approval</h2>
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">{pending.length}</span>
        </div>
        {pending.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm">No pending applications</p>
        ) : (
          pending.map((t) => (
            <div key={t.id} className="px-6 py-4 border-b last:border-0 flex items-center justify-between">
              <div>
                <p className="font-bold">{t.fullName}</p>
                <p className="text-xs text-gray-400">{t.user.email} • {t.subject.join(", ")} • {t.experience} yrs exp</p>
                <p className="text-xs text-gray-400">{t.city}, {t.state} • {t.qualification}</p>
                {t.bio && <p className="text-sm text-gray-500 mt-1 max-w-lg">{t.bio}</p>}
              </div>
              <ApproveButton userId={t.userId} />
            </div>
          ))
        )}
      </div>

      {/* Approved */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-extrabold uppercase text-sm tracking-wider text-gray-500">Approved Teachers ({approved.length})</h2>
        </div>
        {approved.map((t) => (
          <div key={t.id} className="px-6 py-4 border-b last:border-0 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold">{t.fullName}</p>
                <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">✓ Verified</span>
              </div>
              <p className="text-xs text-gray-400">{t.user.email} • {t.subject.join(", ")}</p>
              <p className="text-xs text-gray-400">{t.user._count?.videos ?? 0} videos uploaded</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
