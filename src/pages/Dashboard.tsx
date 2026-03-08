import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, BarChart3, Recycle, Zap, Leaf, TrendingUp, Award, Star } from 'lucide-react';
import { LeaderboardEntry } from '../types';

export default function Dashboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState({
    points: 0,
    scans: 0,
    plastic: 0,
    co2: 0
  });

  useEffect(() => {
    // Fetch leaderboard
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data));

    // Load user stats from localStorage
    const savedPoints = parseInt(localStorage.getItem('ecoPoints') || '0');
    const savedScans = parseInt(localStorage.getItem('totalScans') || '0');
    
    setStats({
      points: savedPoints,
      scans: savedScans,
      plastic: savedScans * 0.5, // Mock calculation
      co2: savedScans * 1.2 // Mock calculation
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Eco Dashboard</h1>
          <p className="text-stone-500">Track your impact and compete with the community.</p>
        </div>
        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-3xl border border-emerald-100">
          <div className="p-3 bg-emerald-600 rounded-2xl text-white">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Current Rank</p>
            <p className="text-xl font-bold text-stone-800">#12 Eco-Warrior</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Total Eco Points", value: stats.points, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Items Scanned", value: stats.scans, icon: BarChart3, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Plastic Recycled (kg)", value: stats.plastic.toFixed(1), icon: Recycle, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "CO₂ Saved (kg)", value: stats.co2.toFixed(1), icon: Leaf, color: "text-indigo-500", bg: "bg-indigo-50" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-white border border-stone-100 shadow-sm flex flex-col justify-between"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-stone-400 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-stone-800 tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          ))}

          {/* Impact Chart Placeholder */}
          <div className="sm:col-span-2 p-8 rounded-[2rem] bg-stone-900 text-white overflow-hidden relative">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Weekly Progress</h3>
              <TrendingUp className="text-emerald-400" />
            </div>
            <div className="flex items-end justify-between h-32 gap-2">
              {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                  className="flex-1 bg-emerald-500/40 hover:bg-emerald-500 rounded-t-lg transition-colors cursor-pointer relative group"
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-stone-900 text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="p-8 rounded-[2rem] bg-white border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Award size={20} />
            </div>
            <h3 className="text-xl font-bold text-stone-800">Leaderboard</h3>
          </div>

          <div className="space-y-4">
            {leaderboard.map((user, i) => (
              <div key={user.name} className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`w-6 text-sm font-black ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-stone-400' : i === 2 ? 'text-amber-700' : 'text-stone-300'}`}>
                    {i + 1}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                  </div>
                  <div>
                    <p className="font-bold text-stone-800 text-sm">{user.name}</p>
                    <p className="text-[10px] text-stone-400 font-bold uppercase">{user.items} Items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-600">{user.points}</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Points</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-4 bg-stone-50 text-stone-600 rounded-2xl font-bold text-sm hover:bg-stone-100 transition-colors">
            View Full Rankings
          </button>
        </div>
      </div>
    </div>
  );
}
