"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function approve(approved: boolean) {
    setLoading(true);
    await fetch("/api/admin/approve-teacher", {
      method: "POST",
      body: JSON.stringify({ userId, approved }),
      headers: { "Content-Type": "application/json" },
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => approve(true)} disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition disabled:opacity-50">
        ✓ Approve
      </button>
      <button onClick={() => approve(false)} disabled={loading}
        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-lg transition disabled:opacity-50">
        ✗ Reject
      </button>
    </div>
  );
}
