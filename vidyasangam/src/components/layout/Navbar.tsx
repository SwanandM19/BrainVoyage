"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/feed", label: "Feed", icon: "🏠" },
  { href: "/leaderboard", label: "Rankings", icon: "🏆" },
  { href: "/games", label: "Activities", icon: "🎮" },
];

const TEACHER_NAV = [
  { href: "/studio", label: "Studio", icon: "🎬" },
  { href: "/upload", label: "Upload", icon: "📤" },
];

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  const isTeacher = user?.role === "TEACHER";
  const isAdmin = user?.role === "ADMIN";

  const navItems = [
    ...NAV_ITEMS,
    ...(isTeacher ? TEACHER_NAV : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: "⚙️" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/feed" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-extrabold text-sm">V</div>
          <span className="font-extrabold text-lg hidden sm:block">VIDYA<span className="text-orange-500">SANGAM</span></span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors",
                pathname.startsWith(item.href)
                  ? "text-orange-500 bg-orange-50"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span className="hidden sm:block">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/settings" className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm hover:ring-2 hover:ring-orange-400 transition">
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-xs font-bold text-gray-400 hover:text-red-500 transition">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
