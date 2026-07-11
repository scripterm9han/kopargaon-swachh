import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Github, Twitter, Instagram } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Premium glass title card */}
      <div className="glass-title-card p-6 md:p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden mb-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
        <div className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-2xl shadow-md shrink-0 animate-float">
          <Mail size={28} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">{t("getInTouch")}</h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold mt-1 max-w-xl leading-relaxed">{t("contactDesc")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Contact Information */}
        <div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <Mail size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("emailUs")}</p>
                <p className="text-base font-bold text-slate-700 mt-1">support@kopargaonswachh.org</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("callUs")}</p>
                <p className="text-base font-bold text-slate-700 mt-1">+91 (02423) 223000</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("visitUs")}</p>
                <p className="text-base font-bold text-slate-700 mt-1">Municipal City Hall, Sector 3</p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{t("followImpact")}</h4>
            <div className="flex gap-4">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <button key={i} className="p-4 bg-white border border-slate-200/80 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-md">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-10 rounded-[3rem] border border-slate-200/80 shadow-2xl relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -mr-16 -mt-16 pointer-events-none" />
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Helpdesk ticket submitted successfully. Support team will email you soon."); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wide">{t("firstName")}</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-800" required />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wide">{t("lastName")}</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-800" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wide">{t("emailAddress")}</label>
              <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-800" required />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wide">{t("subject")}</label>
              <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-600">
                <option className="bg-white text-slate-700">{t("optGeneral")}</option>
                <option className="bg-white text-slate-700">{t("optPartner")}</option>
                <option className="bg-white text-slate-700">{t("optSupport")}</option>
                <option className="bg-white text-slate-700">{t("optFeedback")}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wide">{t("message")}</label>
              <textarea rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-800" required />
            </div>
            <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
              <Send size={16} />
              {t("sendMessage")}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
