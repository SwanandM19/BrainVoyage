

// "use client";

// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isTeacher, setIsTeacher] = useState(false);
//   const router = useRouter();

//   async function handleDummyLogin() {
//     if (!email) return setError("Please enter an email");
//     setLoading(true);
//     setError("");
//     try {
//       // Ensure OTP exists (creates dummy 000000)
//       await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const result = await signIn("credentials", {
//         email,
//         otp: "000000",
//         redirect: false,
//       });
//       if (result?.error) throw new Error(result.error === "CredentialsSignin" ? "Invalid or expired OTP" : result.error);
//       if (!result?.ok) throw new Error("Login failed");
//       router.push(isTeacher ? "/onboarding/teacher" : "/onboarding/student");
//       router.refresh();
//     } catch (e: any) {
//       setError(e?.message ?? "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-flex items-center gap-2 mb-6">
//             <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold">V</div>
//             <span className="font-extrabold text-xl">VIDYA<span className="text-orange-500">SANGAM</span></span>
//           </Link>
//           <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
//           <p className="text-gray-500 mt-1">Sign in to continue your learning journey</p>
//         </div>

//         <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">

//           {/* DEV NOTICE */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6 flex gap-2 items-start">
//             <span className="text-yellow-500 text-lg">🔧</span>
//             <div>
//               <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Dev Mode — Dummy Login</p>
//               <p className="text-xs text-yellow-700 mt-0.5">Enter any email address and click Sign In. No OTP required.</p>
//             </div>
//           </div>

//           {/* Role Toggle */}
//           <div className="flex rounded-lg border border-gray-200 p-1 mb-6">
//             <button
//               onClick={() => setIsTeacher(false)}
//               className={`flex-1 py-2 rounded text-sm font-bold transition ${!isTeacher ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-700"}`}
//             >
//               I'm a Student
//             </button>
//             <button
//               onClick={() => setIsTeacher(true)}
//               className={`flex-1 py-2 rounded text-sm font-bold transition ${isTeacher ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-700"}`}
//             >
//               I'm a Teacher
//             </button>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 onKeyDown={(e) => e.key === "Enter" && handleDummyLogin()}
//               />
//             </div>

//             {error && (
//               <p className="text-red-500 text-sm font-medium">{error}</p>
//             )}

//             <button
//               onClick={handleDummyLogin}
//               disabled={!email || loading}
//               className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition text-sm uppercase tracking-wide"
//             >
//               {loading ? "Signing In..." : "Sign In →"}
//             </button>

//             <p className="text-center text-xs text-gray-400 pt-2">
//               Use <strong>admin@vidyasangam.in</strong> for admin access<br />
//               (after manually setting role to ADMIN in Prisma Studio)
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-lg">V</div>
            <span className="font-extrabold text-xl">VIDYA<span className="text-orange-500">SANGAM</span></span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Choose Your Role</h1>
          <p className="text-gray-500 mt-1">Select how you want to access the platform</p>
        </div>

        {/* Dev Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 flex gap-2 items-start">
          <span className="text-yellow-500 text-lg mt-0.5">🔧</span>
          <div>
            <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Dev Mode — Auth Disabled</p>
            <p className="text-xs text-yellow-700 mt-0.5">Click any role below to access that side directly. No login required.</p>
          </div>
        </div>

        {/* Role Cards */}
        <div className="space-y-4">

          {/* Student */}
          <button
            onClick={() => router.push("/feed")}
            className="w-full bg-white border-2 border-gray-200 hover:border-orange-500 hover:shadow-md rounded-2xl p-6 text-left flex items-center gap-5 transition-all group"
          >
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-3xl group-hover:bg-orange-500 transition-colors">
              <span className="group-hover:scale-110 transition-transform inline-block">🎓</span>
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-gray-900 text-lg">I'm a Student</p>
              <p className="text-sm text-gray-500 mt-0.5">Watch videos, earn XP, climb the leaderboard</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Teacher */}
          <button
            onClick={() => router.push("/studio")}
            className="w-full bg-white border-2 border-gray-200 hover:border-orange-500 hover:shadow-md rounded-2xl p-6 text-left flex items-center gap-5 transition-all group"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl group-hover:bg-orange-500 transition-colors">
              <span className="group-hover:scale-110 transition-transform inline-block">👨‍🏫</span>
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-gray-900 text-lg">I'm a Teacher</p>
              <p className="text-sm text-gray-500 mt-0.5">Upload videos, manage your channel, track views</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Admin */}
          <button
            onClick={() => router.push("/admin")}
            className="w-full bg-white border-2 border-gray-200 hover:border-gray-400 rounded-2xl p-6 text-left flex items-center gap-5 transition-all group"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl group-hover:bg-gray-800 transition-colors">
              <span className="group-hover:scale-110 transition-transform inline-block">⚙️</span>
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-gray-900 text-lg">Admin Panel</p>
              <p className="text-sm text-gray-500 mt-0.5">Approve teachers, manage platform</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Auth will be enabled when going to production
        </p>
      </div>
    </div>
  );
}
