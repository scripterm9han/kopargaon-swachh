import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Camera, MapPin, BarChart3, MessageSquare, BookOpen, Trash2, 
  Leaf, Star, ShieldAlert, Award, Recycle, Sparkles, Check, X, Info
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useLogistics } from "../context/LogisticsContext";
import { cn } from "../lib/utils";

// Bin Sorting Game Data with Translation Keys
const gameItems = [
  { 
    id: 1, 
    nameKey: "gameItem1Name", 
    type: "Blue", 
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80", 
    tipKey: "gameItem1Tip" 
  },
  { 
    id: 2, 
    nameKey: "gameItem2Name", 
    type: "Green", 
    image: "https://images.unsplash.com/photo-1579618218290-3fa8cf184fec?auto=format&fit=crop&w=400&q=80", 
    tipKey: "gameItem2Tip" 
  },
  { 
    id: 3, 
    nameKey: "gameItem3Name", 
    type: "Red", 
    image: "https://images.unsplash.com/photo-1618578531518-91b5c432700d?auto=format&fit=crop&w=400&q=80", 
    tipKey: "gameItem3Tip" 
  },
  { 
    id: 4, 
    nameKey: "gameItem4Name", 
    type: "Blue", 
    image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=400&q=80", 
    tipKey: "gameItem4Tip" 
  },
  { 
    id: 5, 
    nameKey: "gameItem5Name", 
    type: "Green", 
    image: "https://images.unsplash.com/photo-1589365278144-c9e705b843ba?auto=format&fit=crop&w=400&q=80", 
    tipKey: "gameItem5Tip" 
  },
  { 
    id: 6, 
    nameKey: "gameItem6Name", 
    type: "Red", 
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80", 
    tipKey: "gameItem6Tip" 
  }
];

export default function Home() {
  const { t } = useLanguage();
  const { citizenReports } = useLogistics();

  // 1. Eco-Transformation Lab State
  const [labState, setLabState] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [bonusPoints, setBonusPoints] = useState(0);

  // 2. Bin Game State
  const [currentGameIdx, setCurrentGameIdx] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const startEcoTransform = () => {
    setLabState('processing');
    setTimeout(() => {
      setLabState('completed');
      setBonusPoints(prev => prev + 15);
    }, 2000);
  };

  const handleSortItem = (binColor: string) => {
    const currentItem = gameItems[currentGameIdx];
    if (currentItem.type === binColor) {
      setGameFeedback('correct');
      setScore(prev => prev + 10);
      setTimeout(() => {
        setGameFeedback(null);
        setCurrentGameIdx((currentGameIdx + 1) % gameItems.length);
      }, 1500);
    } else {
      setGameFeedback('incorrect');
      setTimeout(() => {
        setGameFeedback(null);
      }, 2500);
    }
  };

  // Citizen Quick Action Cards - Enlarged for all-age accessibility
  const quickActions = [
    { name: t("scanner"), subtitle: "Camera Scan", path: "/scanner", icon: Camera, color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-500 shadow-sm" },
    { name: t("guide"), subtitle: "Disposal Info", path: "/guide", icon: BookOpen, color: "bg-blue-5 text-blue-600 border-blue-200 hover:border-blue-500 shadow-sm" },
    { name: t("map"), subtitle: "View Bins Map", path: "/map", icon: MapPin, color: "bg-indigo-5 text-indigo-600 border-indigo-200 hover:border-indigo-500 shadow-sm" },
    { name: t("report"), subtitle: "Report Litter", path: "/report", icon: MessageSquare, color: "bg-amber-5 text-amber-600 border-amber-200 hover:border-amber-550 shadow-sm" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-6 px-4">
      
      {/* 1. Header Welcome Banner */}
      <div className="flex justify-between items-center glass-title-card p-6 rounded-[2rem] border shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-blue-500/10 pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Recycle size={12} className="animate-recycle text-emerald-500" />
            {t("futureRecycling")}
          </span>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 mt-3 leading-tight uppercase tracking-tight">
            {t("heroTitlePart1")}<span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">{t("heroTitlePart2")}</span>{t("heroTitlePart3")}
          </h1>
          <p className="text-slate-500 text-[10px] mt-1.5 font-semibold max-w-md leading-relaxed">
            {t("heroDesc")}
          </p>
        </div>
      </div>

      <div className="godavari-wave -my-4 opacity-75 select-none" />

      {/* 2. Unified Eco Progress Wallet */}
      <div className="bg-white/80 border border-emerald-500/10 p-5 rounded-3xl shadow-sm relative overflow-hidden flex items-center justify-between gap-4">
        {/* Left Side: Circular Score Progress Gauge */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                className="stroke-slate-100"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                className="stroke-emerald-500 transition-all duration-550"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - Math.min((350 + bonusPoints + score), 500) / 500)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Award className="text-emerald-600 animate-float" size={18} />
              <span className="text-[9px] font-black text-slate-450 uppercase mt-0.5 leading-none">Rank 1</span>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{t("pointsLabel")}</span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">{350 + bonusPoints + score} <span className="text-[10px] font-bold text-slate-400">/ 500 Pts</span></h2>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Tier 2 unlocks at 500</p>
          </div>
        </div>

        {/* Right Side: Stacked Metric Capsules */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="bg-blue-500/10 border border-blue-500/15 px-3 py-1.5 rounded-2xl flex items-center gap-2">
            <Camera className="text-blue-500" size={13} />
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase leading-none">{t("scansLabel")}</p>
              <p className="text-xs font-black text-slate-700 mt-0.5">18 Items</p>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/15 px-3 py-1.5 rounded-2xl flex items-center gap-2">
            <Leaf className="text-amber-600" size={13} />
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase leading-none">{t("co2Label")}</p>
              <p className="text-xs font-black text-slate-700 mt-0.5">21.6 kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Eco-Transformation Lab */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/10 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-emerald-600" size={18} />
          <h3 className="text-xs font-black text-slate-455 uppercase tracking-widest">{t("labTitle")}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5">{t("labDesc")}</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {t("labDetails")}
            </p>
            <div className="mt-5 flex gap-2">
              {labState === 'idle' && (
                <button
                  type="button"
                  onClick={startEcoTransform}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
                >
                  {t("labAction")}
                </button>
              )}
              {labState === 'processing' && (
                <button type="button" disabled className="px-5 py-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  {t("labProgress")}
                </button>
              )}
              {labState === 'completed' && (
                <button
                  type="button"
                  onClick={() => setLabState('idle')}
                  className="px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-emerald-200/50"
                >
                  {t("labReset")}
                </button>
              )}
            </div>
          </div>

          {/* Visualization Container */}
          <div className="bg-white/40 border border-emerald-500/10 rounded-2xl p-6 min-h-[150px] flex items-center justify-center relative overflow-hidden shadow-inner">
            <AnimatePresence mode="wait">
              {labState === 'idle' && (
                <motion.div
                  key="idle-visual"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex gap-6 text-3xl select-none"
                >
                  <span className="animate-float">🥫</span>
                  <span className="animate-float" style={{ animationDelay: '1s' }}>🧴</span>
                  <span className="animate-float" style={{ animationDelay: '2s' }}>🍎</span>
                </motion.div>
              )}

              {labState === 'processing' && (
                <motion.div
                  key="processing-visual"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="text-4xl select-none"
                >
                  🌀
                </motion.div>
              )}

              {labState === 'completed' && (
                <motion.div
                  key="completed-visual"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <span className="text-4xl animate-bounce">🌳</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={12} />
                    {t("labSuccess")}
                  </span>
                  <p className="text-[9px] text-slate-450 font-bold uppercase mt-1">{t("labBonus")}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 4. Bin Sorting Mini-Game with Real Images */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/10 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-5">
          <Recycle className="text-emerald-600 animate-recycle" size={18} />
          <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest">{t("gameTitle")}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Card to sort */}
          <div className="relative bg-white/40 border border-emerald-500/10 rounded-3xl p-4 min-h-[220px] flex flex-col items-center justify-center text-center shadow-inner overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGameIdx}
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -60, opacity: 0 }}
                className="w-full flex flex-col items-center gap-3"
              >
                {/* Real Image container card */}
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-white relative shadow-sm max-w-[220px]">
                  <img 
                    src={gameItems[currentGameIdx].image} 
                    alt={t(gameItems[currentGameIdx].nameKey)} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800">{t(gameItems[currentGameIdx].nameKey)}</h4>
                  <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-0.5">{t("gameSubtitle")}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Game Feedback Overlay */}
            <AnimatePresence>
              {gameFeedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center text-white z-20",
                    gameFeedback === 'correct' ? 'bg-emerald-600/95 backdrop-blur-sm' : 'bg-red-500/95 backdrop-blur-sm'
                  )}
                >
                  {gameFeedback === 'correct' ? (
                    <>
                      <Check size={32} className="animate-bounce text-white" />
                      <p className="text-xs font-black uppercase mt-2.5 tracking-widest">{t("pointsBonus")}</p>
                    </>
                  ) : (
                    <>
                      <X size={32} className="animate-bounce text-white" />
                      <p className="text-xs font-black uppercase mt-1 tracking-widest">{t("pointsError")}</p>
                      <p className="text-[10px] px-6 mt-3 font-semibold text-center leading-relaxed max-w-[240px] text-red-50">
                        {t(gameItems[currentGameIdx].tipKey)}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Three bins selection */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
              <Info size={14} className="text-emerald-600" />
              {t("gameDesc")}
            </h4>
            
            <button
              type="button"
              onClick={() => handleSortItem("Blue")}
              className="w-full py-3 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/15 text-blue-750 font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-left px-4 flex items-center justify-between shadow-sm"
            >
              <span>{t("blueBin")}</span>
              <span className="text-lg select-none">🥫 Blue (सूखा)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSortItem("Green")}
              className="w-full py-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/15 text-emerald-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-left px-4 flex items-center justify-between shadow-sm"
            >
              <span>{t("greenBin")}</span>
              <span className="text-lg select-none">🍎 Green (गीला)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSortItem("Red")}
              className="w-full py-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 text-red-755 font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-left px-4 flex items-center justify-between shadow-sm"
            >
              <span>{t("redBin")}</span>
              <span className="text-lg select-none">🔋 Red (खतरनाक)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Quick Actions */}
      <div>
        <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest mb-3.5 ml-1">Quick Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="flex flex-col items-center justify-center p-5 glass-card rounded-3xl hover:border-emerald-500/30 hover:shadow-md transition-all text-center group"
            >
              <div className={`p-4 rounded-2xl border ${action.color} mb-3 group-hover:scale-105 transition-transform`}>
                <action.icon size={22} />
              </div>
              <span className="text-xs font-extrabold text-slate-700 group-hover:text-emerald-600 transition-colors">
                {action.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 6. Incident tracking card */}
      {citizenReports.length > 0 && (
        <div className="glass-card p-6 rounded-3xl shadow-xl border border-emerald-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 pointer-events-none" />
          <h3 className="text-xs font-black text-slate-455 uppercase tracking-widest mb-4">Your Incident Reports Status</h3>
          
          <div className="space-y-3">
            {citizenReports.slice(0, 2).map((rep) => (
              <div key={rep.id} className="p-4 bg-white/50 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 shrink-0">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-800 text-xs">{rep.id} • {rep.type}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{rep.details}</p>
                  </div>
                </div>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                  rep.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                  rep.status === 'Dispatched' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                  'bg-amber-500/10 text-amber-600 border-amber-500/20'
                }`}>
                  {rep.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Daily Sustainability Tip Banner */}
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/10 shadow-xl relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-transparent">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-black text-emerald-650 uppercase tracking-widest">{t("dailyTip")}</h4>
          <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider">{t("ecoTipFooter")}</span>
        </div>
        <h3 className="font-bold text-slate-800 text-sm mb-1">{t("todayInsight")}</h3>
        <p className="text-slate-500 text-xs leading-relaxed font-semibold">
          {t("tipText")}
        </p>
      </div>
    </div>
  );
}
