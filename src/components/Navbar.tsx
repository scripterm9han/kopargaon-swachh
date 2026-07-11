import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, BarChart3, MessageSquare, Phone, Camera, BookOpen, LayoutDashboard, Compass, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Tab items (max 4 on bottom nav, 5th is More)
  const tabItems = [
    { name: t("home"), path: "/", icon: LayoutDashboard },
    { name: t("scanner"), path: "/scanner", icon: Camera },
    { name: t("guide"), path: "/guide", icon: BookOpen },
    { name: t("map"), path: "/map", icon: Compass },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  return (
    <>
      {/* --- APP HEADER --- */}
      <header className="h-14 bg-[#F5F7F4]/90 backdrop-blur-md border-b border-emerald-500/10 flex justify-between items-center px-4 shrink-0 shadow-sm relative z-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
            K
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tight text-slate-800 uppercase leading-none">{t("appName")}</span>
            <span className="text-[8px] font-bold text-emerald-600 tracking-wide mt-0.5 leading-none">{t("slogan")}</span>
          </div>
        </Link>

        {/* Header Language Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-emerald-500/15 px-2.5 py-1 rounded-full">
          <Globe size={13} className="text-emerald-600" />
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="bg-transparent text-[9px] font-black text-slate-600 focus:outline-none cursor-pointer uppercase tracking-wider"
          >
            <option value="hi" className="bg-white text-slate-700 font-semibold">HI</option>
            <option value="mr" className="bg-white text-slate-700 font-semibold">MR</option>
            <option value="en" className="bg-white text-slate-700 font-semibold">EN</option>
          </select>
        </div>
      </header>

      {/* --- FLOATING APP NAVIGATION DOCK (Viewport Static) --- */}
      <nav className="absolute bottom-4 left-4 right-4 h-18 bg-white/80 backdrop-blur-lg border border-emerald-500/10 rounded-2xl flex justify-around items-center z-30 px-2 shadow-xl">
        {tabItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all",
                isActive ? "text-emerald-600 font-black animate-pulse" : "text-slate-400 hover:text-slate-700"
              )}
            >
              <item.icon size={20} className={cn("transition-transform", isActive ? "scale-110 text-emerald-600" : "text-slate-400")} />
              <span className="text-[8px] font-bold mt-1 uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all",
            isMoreOpen || ["/dashboard", "/report", "/contact"].includes(location.pathname)
              ? "text-emerald-600 font-black"
              : "text-slate-400 hover:text-slate-700"
          )}
        >
          <Menu size={20} className={cn("transition-transform", isMoreOpen ? "scale-110 text-emerald-600" : "text-slate-400")} />
          <span className="text-[8px] font-bold mt-1 uppercase tracking-wider">{t("more")}</span>
        </button>
      </nav>

      {/* --- BOTTOM SHEET DRAWER (Warm White Glass style) --- */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            {/* Backdrop overlay inside container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="absolute inset-0 bg-[#07090E]/40 backdrop-blur-sm z-40 rounded-b-[2.2rem]"
            />

            {/* Bottom Sheet content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 rounded-t-[2.2rem] z-50 px-5 pt-6 pb-8 shadow-2xl overflow-y-auto max-h-[60%]"
            >
              {/* Drawer Handle drag bar */}
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">{t("more")}</h3>
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(false)}
                  className="p-1.5 bg-slate-100 text-slate-500 hover:text-slate-800 rounded-full transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { name: t("dashboard"), path: "/dashboard", icon: BarChart3, color: "bg-blue-50 text-blue-600 border-blue-100" },
                  { name: t("report"), path: "/report", icon: MessageSquare, color: "bg-amber-50 text-amber-600 border-amber-100" },
                  { name: t("contact"), path: "/contact", icon: Phone, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                ].map((item) => {
                  const isItemActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMoreOpen(false)}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 rounded-2xl border text-left font-bold transition-all",
                        isItemActive
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-lg font-black"
                          : "bg-slate-50 border-slate-200/50 hover:bg-slate-100 text-slate-700"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl border", isItemActive ? "bg-white/10 border-white/20 text-white" : item.color)}>
                          <item.icon size={14} />
                        </div>
                        <span className="text-xs uppercase tracking-wider">{item.name}</span>
                      </span>
                    </Link>
                  );
                })}

                <div className="h-px bg-slate-100 my-1" />

                {/* Mobile Authority Portal shortcut link */}
                <Link
                  to="/authority"
                  onClick={() => setIsMoreOpen(false)}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/85 rounded-2xl text-slate-700 font-bold hover:bg-emerald-600 hover:text-white transition-all text-xs uppercase tracking-wider"
                >
                  <span className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600">
                      <Shield size={14} />
                    </div>
                    <span>Authority Portal</span>
                  </span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
