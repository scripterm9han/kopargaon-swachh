import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Trash2, Zap, Leaf, HelpCircle, ShieldAlert, ArrowRight, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

export default function Guide() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = ["All", "Organic", "Recyclable", "E-Waste", "Hazardous"];

  const guideItems = [
    {
      title: t("plastic"),
      category: "Recyclable",
      icon: Package,
      color: "bg-blue-50 text-blue-600 border-blue-200/60",
      examples: t("plasticEx").split(", "),
      instruction: t("plasticInst"),
    },
    {
      title: t("paper"),
      category: "Recyclable",
      icon: Package,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200/60",
      examples: t("paperEx").split(", "),
      instruction: t("paperInst"),
    },
    {
      title: t("organic"),
      category: "Organic",
      icon: Leaf,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
      examples: t("organicEx").split(", "),
      instruction: t("organicInst"),
    },
    {
      title: t("ewaste"),
      category: "E-Waste",
      icon: Zap,
      color: "bg-red-50 text-red-600 border-red-200/60",
      examples: t("ewasteEx").split(", "),
      instruction: t("ewasteInst"),
    },
    {
      title: t("glass"),
      category: "Recyclable",
      icon: HelpCircle,
      color: "bg-teal-50 text-teal-600 border-teal-200/60",
      examples: t("glassEx").split(", "),
      instruction: t("glassInst"),
    },
    {
      title: t("metal"),
      category: "Recyclable",
      icon: Trash2,
      color: "bg-amber-50 text-amber-600 border-amber-200/60",
      examples: t("metalEx").split(", "),
      instruction: t("metalInst"),
    },
  ];

  const filteredItems = guideItems.filter(item => 
    selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fadeIn">
      {/* Premium warm glass title card */}
      <div className="glass-title-card p-6 md:p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
        <div className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-2xl shadow-md shrink-0 animate-float">
          <Package size={28} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">{t("guideTitle")}</h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold mt-1 max-w-xl leading-relaxed">{t("guideDesc")}</p>
        </div>
      </div>

      {/* SWIPEABLE TABS PILL BAR */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none select-none">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setExpandedIndex(null);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border shrink-0",
                isSelected
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-md glow-emerald"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Guide Cards Accordions Stack */}
      <div className="flex flex-col gap-4 mb-12">
        {filteredItems.map((item, index) => {
          const Icon = item.icon;
          const isExpanded = expandedIndex === index;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
              
              {/* Accordion header click wrapper */}
              <div 
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${item.color} shadow-sm bg-white shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 leading-none">{item.title}</h3>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1 block">{item.category}</span>
                  </div>
                </div>

                <div className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-full">
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {/* Expandable Accordion Body content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4">
                      {/* Examples row */}
                      <div>
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">{t("commonExamples")}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {item.examples.map((ex, i) => (
                            <span key={i} className="text-[9px] font-extrabold px-2.5 py-1 bg-white text-slate-600 rounded-full border border-slate-200">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Instructions row */}
                      <div className="pt-3 border-t border-slate-100">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5">{t("disposalInstruction")}</h4>
                        <p className="text-slate-500 text-xs font-semibold leading-relaxed">{item.instruction}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          );
        })}
      </div>

      {/* Kopargaon Municipal Notice Card */}
      <div className="glass-card p-6 rounded-[2rem] border border-emerald-500/10 shadow-xl mb-8 relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-transparent">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          📢 KMC Municipal Sanitation Notice
        </h3>
        <p className="text-slate-600 text-xs font-semibold leading-relaxed">
          Kopargaon Municipal Council collects segregated waste daily via **"Ghanta Gadi" (घंटा गाडी)** vans starting from 6:30 AM across all wards. Wet organic scraps must go into green bins for the Gandhinagar composting facility, and recyclables into blue bins. Mixed waste dumping is subject to municipality fines.
        </p>
      </div>

      {/* Unidentified Cargo / Bottom Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Run scan banner */}
        <div className="md:col-span-2 glass-card p-6 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 pointer-events-none" />
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-2">{t("stillUnsure")}</h3>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-6">{t("stillUnsureDesc")}</p>
          </div>
          <button
            onClick={() => navigate('/scanner')}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10 self-start"
          >
            {t("tryScanner")}
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Hazard compliance advisory warning */}
        <div className="glass-card p-6 rounded-[2rem] border border-red-200/50 shadow-xl flex flex-col justify-between bg-gradient-to-br from-red-500/5 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 text-red-600 border border-red-200/50 rounded-xl">
              <ShieldAlert size={18} className="animate-pulse" />
            </div>
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">{t("hazardous")}</h3>
          </div>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-6">{t("hazardousDesc")}</p>
          
          <div className="flex items-center gap-2 text-[9px] font-black text-red-600 uppercase tracking-widest bg-red-50 border border-red-200/50 px-3 py-2 rounded-xl">
            <Flame size={14} />
            <span>{t("checkLabels")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
