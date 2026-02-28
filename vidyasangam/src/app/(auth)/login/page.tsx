

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

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  async function handleSendOTP() {
    if (!email) return setError("Please enter an email");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setOtpSent(true);
    } catch (e: any) {
      setError(e?.message ?? "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    if (!otp) return setError("Please enter the OTP");
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        otp,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(result.error === "CredentialsSignin" ? "Invalid or expired OTP" : result.error);
      }
      if (!result?.ok) throw new Error("Login failed");
      router.push("/onboarding/student");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-lg">V</div>
            <span className="font-extrabold text-xl">VIDYA<span className="text-orange-500">SANGAM</span></span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to continue your learning journey</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {/* Dev Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6 flex gap-2 items-start">
            <span className="text-yellow-500 text-lg">🔧</span>
            <div>
              <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Dev Mode</p>
              <p className="text-xs text-yellow-700 mt-0.5">Use OTP <strong>000000</strong> for all emails (auto-generated)</p>
            </div>
          </div>

          <div className="space-y-4">
            {!otpSent ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleSendOTP()}
                    disabled={loading}
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  onClick={handleSendOTP}
                  disabled={!email || loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition text-sm uppercase tracking-wide"
                >
                  {loading ? "Sending..." : "Send OTP →"}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    OTP Code
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    We sent an OTP to <strong>{email}</strong>
                  </p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-center tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleVerifyOTP()}
                    disabled={loading}
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  onClick={handleVerifyOTP}
                  disabled={!otp || loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition text-sm uppercase tracking-wide"
                >
                  {loading ? "Verifying..." : "Verify & Sign In →"}
                </button>

                <button
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 font-bold py-2 text-sm"
                >
                  ← Change Email
                </button>
              </>
            )}

            <p className="text-center text-xs text-gray-400 pt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
