"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SUBJECTS = ["Mathematics", "Science", "English", "Hindi", "Social Science", "Physics", "Chemistry", "Biology", "History", "Geography"];
const BOARDS = ["CBSE", "ICSE", "State Board - Maharashtra", "State Board - UP", "Others"];

export default function TeacherOnboarding() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "", subject: [] as string[], qualification: "",
    experience: 1, school: "", city: "", state: "", bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function toggleSubject(sub: string) {
    setForm((f) => ({
      ...f,
      subject: f.subject.includes(sub) ? f.subject.filter((s) => s !== sub) : [...f.subject, sub],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/teacher", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      alert("Error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md shadow-sm">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-extrabold mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-6">Your teacher profile is under review. Our admin team will verify your account within 24–48 hours. We'll notify you by email.</p>
          <button onClick={() => router.push("/")} className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">👨‍🏫</div>
          <h1 className="text-2xl font-extrabold">Teacher Application</h1>
          <p className="text-gray-500 mt-1">Your profile will be reviewed and approved by our admin team</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex gap-3">
          <span className="text-orange-500 text-xl">ℹ️</span>
          <p className="text-sm text-orange-800 font-medium">After submitting, an admin will review and approve your teacher account. You'll receive an email confirmation once approved.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
            <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Your full name" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subjects You Teach *</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((sub) => (
                <button type="button" key={sub} onClick={() => toggleSubject(sub)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${form.subject.includes(sub) ? "bg-orange-500 border-orange-500 text-white" : "border-gray-300 text-gray-600 hover:border-orange-400"}`}>
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Qualification *</label>
              <input required value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="B.Ed, M.Sc, etc." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Years of Experience *</label>
              <input required type="number" min={0} max={50} value={form.experience} onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City *</label>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="City" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">State *</label>
              <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="State" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio / About You *</label>
            <textarea required value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Tell students about your teaching style, specialisation and what they'll learn from you..." />
          </div>

          <button type="submit" disabled={loading || form.subject.length === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-lg transition text-sm uppercase tracking-wide">
            {loading ? "Submitting..." : "Submit for Review →"}
          </button>
        </form>
      </div>
    </div>
  );
}
