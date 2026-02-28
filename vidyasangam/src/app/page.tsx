// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }



import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/feed");

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-inter">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-lg">V</div>
            <span className="font-extrabold text-xl tracking-tight">VIDYA<span className="text-orange-500">SANGAM</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {["Classes", "Activities", "Rankings", "Teachers"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-orange-500 transition-colors">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-black px-4 py-2 rounded hover:bg-gray-100 transition">Sign In</Link>
            <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded shadow transition">
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-orange-600">India's First Structured Micro-Learning Platform</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Learn Smarter.<br />
            <span className="text-orange-500">Rank Higher.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Join thousands of students discovering verified teachers, short learning videos, and competitive games — all filtered by your class and board.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-4 px-10 rounded text-base shadow-md transition">
              START LEARNING FREE →
            </Link>
            <Link href="/login?role=teacher" className="bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 font-bold py-4 px-10 rounded text-base transition">
              TEACHER PORTAL
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
          {[
            { label: "Students", value: "10K+" },
            { label: "Verified Teachers", value: "500+" },
            { label: "Learning Videos", value: "2,000+" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-orange-500">{stat.value}</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-gray-200 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12">Why VidyaSangam?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎥", title: "Micro-Learning Videos", desc: "2–5 minute board-filtered videos from verified teachers across India." },
              { icon: "🏆", title: "National Leaderboard", desc: "Compete with students across India and climb the national rankings." },
              { icon: "🎮", title: "Educational Games", desc: "Memory challenges, quizzes & subject battles that make learning fun." },
            ].map((f) => (
              <div key={f.title} className="p-8 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-extrabold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes */}
      <section id="classes" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold text-center mb-4">Your Class, Your Curriculum</h2>
        <p className="text-center text-gray-500 mb-10">All content is tagged and filtered by class, board & subject</p>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3 max-w-3xl mx-auto">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((cls) => (
            <Link href="/login" key={cls} className="bg-white border border-gray-200 hover:border-orange-500 hover:shadow-sm transition p-4 rounded-lg text-center group cursor-pointer">
              <span className="block text-2xl font-extrabold text-gray-800 group-hover:text-orange-500">{cls}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Class</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold">V</div>
            <span className="font-extrabold text-lg">VIDYA<span className="text-orange-500">SANGAM</span></span>
          </div>
          <p className="text-sm text-gray-400">© 2026 VidyaSangam. India's professional educational community.</p>
        </div>
      </footer>
    </div>
  );
}
