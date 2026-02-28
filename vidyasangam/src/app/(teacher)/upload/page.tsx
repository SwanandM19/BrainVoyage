"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

const SUBJECTS = ["Mathematics", "Science", "English", "Hindi", "Social Science", "Physics", "Chemistry", "Biology"];
const BOARDS = ["CBSE", "ICSE", "State Board - Maharashtra", "State Board - UP", "Other"];

export default function UploadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", description: "", class: 8, board: "CBSE", subject: "Mathematics", tags: "",
  });
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"upload" | "details">("upload");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!videoUrl) return alert("Please upload a video first");
    setLoading(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          url: videoUrl,
          thumbnail: thumbnailUrl || undefined,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const video = await res.json();
      router.push(`/video/${video.id}`);
    } catch {
      alert("Failed to publish video. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold">Upload Video</h1>
        <p className="text-gray-500 mt-1">Share your knowledge with students across India</p>
      </div>

      {step === "upload" ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition">
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="font-bold text-gray-700 mb-2">Upload Your Video</h3>
            <p className="text-sm text-gray-400 mb-4">MP4, MOV, AVI up to 1GB</p>
            <UploadButton<OurFileRouter, "videoUploader">
              endpoint="videoUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]) { setVideoUrl(res[0].url); setStep("details"); }
              }}
              onUploadError={(error) => alert(`Upload Error: ${error.message}`)}
              appearance={{
                button: "bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg text-sm uppercase tracking-wide transition",
              }}
            />
          </div>

          {videoUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <p className="text-sm font-bold text-green-800">Video uploaded successfully!</p>
              <button onClick={() => setStep("details")} className="ml-auto bg-green-500 text-white font-bold px-4 py-2 rounded text-xs uppercase">
                Add Details →
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <span className="text-green-500">✅</span>
            <span className="text-sm font-bold text-green-800">Video uploaded! Now add the details below.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Video Title *</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. How to solve quadratic equations in 5 minutes" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Describe what students will learn..." />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class *</label>
              <select value={form.class} onChange={(e) => setForm({ ...form, class: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Board *</label>
              <select value={form.board} onChange={(e) => setForm({ ...form, board: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {BOARDS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject *</label>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Thumbnail (optional)</label>
            <UploadButton<OurFileRouter, "thumbnailUploader">
              endpoint="thumbnailUploader"
              onClientUploadComplete={(res) => { if (res?.[0]) setThumbnailUrl(res[0].url); }}
              onUploadError={() => {}}
              appearance={{ button: "bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded text-xs transition" }}
            />
            {thumbnailUrl && <p className="text-xs text-green-600 font-bold mt-2">✅ Thumbnail uploaded</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="fractions, maths tricks, shortcuts" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-lg transition text-sm uppercase tracking-wide">
            {loading ? "Publishing..." : "🚀 Publish Video"}
          </button>
        </form>
      )}
    </div>
  );
}
