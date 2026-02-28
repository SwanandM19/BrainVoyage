import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function GamesPage() {
  const session = await auth();

  const games = [
    {
      id: 1,
      title: "Quiz Challenge",
      description: "Test your knowledge with interactive quizzes based on video content",
      icon: "🧠",
      points: 100,
      status: "coming-soon",
    },
    {
      id: 2,
      title: "Live Coding",
      description: "Compete with other students in live coding challenges",
      icon: "💻",
      points: 250,
      status: "coming-soon",
    },
    {
      id: 3,
      title: "Speed Learning",
      description: "Complete lessons and videos in the fastest time",
      icon: "⚡",
      points: 150,
      status: "coming-soon",
    },
    {
      id: 4,
      title: "Discussion Forum",
      description: "Participate in discussions and help other students",
      icon: "💬",
      points: 50,
      status: "coming-soon",
    },
    {
      id: 5,
      title: "Daily Streak",
      description: "Watch videos daily and maintain your learning streak",
      icon: "🔥",
      points: 200,
      status: "coming-soon",
    },
    {
      id: 6,
      title: "Subject Master",
      description: "Complete all videos in a subject to unlock achievements",
      icon: "👑",
      points: 500,
      status: "coming-soon",
    },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Activities & Games</h1>
        <p className="text-gray-500 mt-1">Learn, compete, and earn XP points</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-8 flex gap-3 items-start">
        <span className="text-2xl">🚀</span>
        <div>
          <p className="font-bold text-blue-900">Games Coming Soon!</p>
          <p className="text-sm text-blue-800 mt-1">
            We're building interactive games and activities. For now, focus on watching videos and climbing the leaderboard to earn XP.
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition relative group">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">Coming Soon</span>
            </div>

            {/* Icon */}
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">{game.icon}</div>

            {/* Content */}
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">{game.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{game.description}</p>

            {/* Points */}
            <div className="flex items-center gap-2 text-orange-500 font-bold">
              <span>⭐</span>
              <span>+{game.points} XP</span>
            </div>

            {/* Button */}
            <button
              disabled
              className="w-full mt-4 bg-gray-100 text-gray-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        ))}
      </div>

      {/* Leaderboard Link */}
      <div className="mt-12 bg-linear-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-extrabold mb-2">🏆 Global Leaderboard</h2>
        <p className="mb-4">Earn XP by watching videos and climbing the rankings. Check the leaderboard to see your position!</p>
        <Link
          href="/leaderboard"
          className="inline-block bg-white text-orange-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
        >
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}
