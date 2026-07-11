import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, BarChart3, Recycle, Leaf, TrendingUp, Award, Star } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Dynamic leaderboard standings calculation
    const baseStandings = [
      { name: "EcoWarrior", points: 1250, items: 45 },
      { name: "GreenThumb", points: 980, items: 32 },
      { name: "RecycleKing", points: 850, items: 28 },
      { name: "EarthLover", points: 720, items: 21 },
      { name: "NaturePal", points: 540, items: 15 },
    ];
    baseStandings.sort((a, b) => b.points - a.points);
    setLeaderboard(baseStandings);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-fadeIn">
      {/* Premium warm glass title card */}
      <div className="glass-title-card p-6 md:p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-4 bg-emerald-100 border border-emerald-250 text-emerald-600 rounded-2xl shadow-md shrink-0 animate-float">
            <Trophy size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t("ecoDashboard")}</h1>
            <p className="text-slate-500 text-xs md:text-sm font-semibold mt-1 leading-relaxed">{t("dashboardDesc")}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white border border-emerald-500/15 rounded-2xl shrink-0 shadow-sm relative overflow-hidden">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md">
            <Trophy size={18} />
          </div>
          <div>
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wider leading-none">{t("currentRank")}</p>
            <p className="text-xs font-black text-slate-700 mt-1">{t("rankTitle")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stats and Weekly Progress Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Grid with Light Glass panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: t("pointsLabel"), value: 350, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
              { label: t("scansLabel"), value: 18, icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
              { label: t("plasticLabel"), value: "8.1", icon: Recycle, color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { label: t("co2Label"), value: "21.6", icon: Leaf, color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/20" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden"
              >
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center mb-6 shadow-sm ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Weekly Progress Chart in Light Mode style */}
          <div className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.02)_0%,transparent_50%)] pointer-events-none" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("weeklyProgress")}</h3>
              <TrendingUp className="text-emerald-600" size={16} />
            </div>
            <div className="flex items-end justify-between h-36 gap-2.5">
              {[4, 7, 5, 9, 6, 8, 5].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h * 10}%` }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.8 }}
                  className="flex-1 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-600 hover:border-emerald-500 hover:shadow-md rounded-t-xl transition-all cursor-pointer relative group"
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 uppercase tracking-widest shadow-xl">
                    {h} items
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-5 text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
              <span>{t("mon")}</span><span>{t("tue")}</span><span>{t("wed")}</span><span>{t("thu")}</span><span>{t("fri")}</span><span>{t("sat")}</span><span>{t("sun")}</span>
            </div>
          </div>

        </div>

        {/* Right Panel: Leaderboard and Podiums */}
        <div className="space-y-6">

          {/* Gamified Weekly Goals Progress Meter */}
          <div className="bg-white border border-slate-200 p-5 rounded-[2rem] shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Weekly Eco Goal</span>
              <span className="text-[8px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded uppercase">Active</span>
            </div>
            <h4 className="font-extrabold text-xs text-slate-800 mb-1.5">Perform 5 more AI scans to reach Level 2</h4>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner mb-2">
              <div className="h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20" style={{ width: '70%' }} />
            </div>
            <p className="text-[8px] font-bold text-slate-500 uppercase leading-none">14 / 20 Scans completed • +50 bonus points reward</p>
          </div>

          {/* Leaderboard Podiums & List */}
          <div className="p-6 rounded-[2rem] bg-white shadow-xl border border-slate-200 flex flex-col relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl shadow-sm">
                <Award size={18} />
              </div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("leaderboardTitle")}</h3>
            </div>

            {/* Top 3 Podiums Widget */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-end gap-3 pt-10 mb-6 relative overflow-hidden select-none shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
              
              {/* Rank 2 (Left) */}
              <div className="flex flex-col items-center flex-1 max-w-[80px]">
                <div className="relative mb-1">
                  <div className="w-11 h-11 rounded-full border-2 border-slate-300 bg-white overflow-hidden shadow-sm">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=GreenThumb" alt="Rank 2 avatar" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-400 border border-white rounded-full flex items-center justify-center text-white text-[8px] font-black">2</div>
                </div>
                <span className="text-[9px] font-black text-slate-700 truncate w-full text-center">GreenThumb</span>
                <span className="text-[8px] font-black text-emerald-600">980 Pts</span>
                <div className="w-full h-8 bg-slate-200 border-t border-slate-300 rounded-t-lg mt-2 flex items-center justify-center text-slate-500 font-bold text-[10px]">🥈</div>
              </div>

              {/* Rank 1 (Center) */}
              <div className="flex flex-col items-center flex-1 max-w-[90px] z-10 scale-105">
                <div className="relative mb-1">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm animate-float">👑</div>
                  <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-white overflow-hidden shadow-md">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=EcoWarrior" alt="Rank 1 avatar" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 border border-white rounded-full flex items-center justify-center text-white text-[8px] font-black">1</div>
                </div>
                <span className="text-[9px] font-black text-slate-800 truncate w-full text-center">EcoWarrior</span>
                <span className="text-[8px] font-black text-emerald-600">1250 Pts</span>
                <div className="w-full h-14 bg-amber-100 border-t border-amber-300 rounded-t-lg mt-2 flex items-center justify-center text-amber-600 font-bold text-[10px] shadow-sm">🥇</div>
              </div>

              {/* Rank 3 (Right) */}
              <div className="flex flex-col items-center flex-1 max-w-[80px]">
                <div className="relative mb-1">
                  <div className="w-11 h-11 rounded-full border-2 border-amber-700 bg-white overflow-hidden shadow-sm">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=RecycleKing" alt="Rank 3 avatar" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-700 border border-white rounded-full flex items-center justify-center text-white text-[8px] font-black">3</div>
                </div>
                <span className="text-[9px] font-black text-slate-700 truncate w-full text-center">RecycleKing</span>
                <span className="text-[8px] font-black text-emerald-600">850 Pts</span>
                <div className="w-full h-6 bg-amber-50 border-t border-amber-200 rounded-t-lg mt-2 flex items-center justify-center text-amber-700 font-bold text-[10px]">🥉</div>
              </div>
            </div>

            {/* Standings List below podiums */}
            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[300px] pr-1">
              {leaderboard.map((user, i) => (
                <div key={user.name} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-xs font-black text-center ${
                      i === 0 ? 'text-amber-500' : 
                      i === 1 ? 'text-slate-400' : 
                      i === 2 ? 'text-amber-700' : 
                      'text-slate-500'
                    }`}>
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-[11px] tracking-tight leading-none">{user.name}</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider mt-1">{user.items} {t("itemsText")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-600 text-xs">{user.points}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{t("pointsText")}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-wider border border-slate-200 transition-all">
              {t("viewFullRankings")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
