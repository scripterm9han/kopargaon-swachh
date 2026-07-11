import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, Send, CheckCircle2, AlertTriangle, Trash2, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLogistics } from '../context/LogisticsContext';
import { cn } from '../lib/utils';

export default function Report() {
  const { t } = useLanguage();
  const { reportDumping } = useLogistics();

  const [step, setStep] = useState(0); // 0: Photo, 1: Map Pin, 2: Details
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    type: "Overflowing Public Bin",
    notes: ""
  });

  const [map, setMap] = useState<any>(null);

  // Initialize Leaflet Map for Pin Dropper with Voyager light tiles
  useEffect(() => {
    if (step === 1) {
      const L = (window as any).L;
      if (!L) {
        console.error("Leaflet not loaded");
        return;
      }

      const defaultLat = 19.889;
      const defaultLng = 74.483;

      // Start centered on Kopargaon
      const mapInstance = L.map('report-pin-map', {
        zoomControl: false
      }).setView([location?.lat || defaultLat, location?.lng || defaultLng], 14);

      // Light Voyager tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(mapInstance);

      // Custom Amber Pin Icon
      const customPinIcon = L.divIcon({
        className: "custom-report-pin",
        html: `
          <div style="
            width: 24px; height: 24px; border-radius: 50%;
            background: #F59E0B;
            border: 2px solid rgba(255,255,255,0.9);
            box-shadow: 0 0 10px 1px #F59E0B50, 0 2px 6px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Create draggable pin
      let initialMarker = L.marker([location?.lat || defaultLat, location?.lng || defaultLng], {
        draggable: true,
        icon: customPinIcon
      }).addTo(mapInstance);

      if (!location) {
        setLocation({ lat: defaultLat, lng: defaultLng });
      }

      // Sync pin drag coordinates
      initialMarker.on('dragend', () => {
        const position = initialMarker.getLatLng();
        setLocation({ lat: position.lat, lng: position.lng });
      });

      // Sync pin click coordinates
      mapInstance.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        initialMarker.setLatLng([lat, lng]);
      });

      setMap(mapInstance);

      return () => {
        mapInstance.remove();
      };
    }
  }, [step]);

  const handleCapture = () => {
    setImage("https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80"); // Real public dump litter photo
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    setIsReporting(true);
    setTimeout(() => {
      // Log report globally
      reportDumping(
        image,
        location ? location.lat : 19.889,
        location ? location.lng : 74.483,
        formData.type,
        formData.notes || "No description provided."
      );
      setIsReporting(false);
      setSubmitted(true);
    }, 1500);
  };

  const resetForm = () => {
    setSubmitted(false);
    setImage(null);
    setLocation(null);
    setStep(0);
    setFormData({ type: "Overflowing Public Bin", notes: "" });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Premium glass title card */}
      <div className="glass-title-card p-6 md:p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
        <div className="p-4 bg-amber-100 border border-amber-200 text-amber-600 rounded-2xl shadow-md shrink-0 animate-float">
          <AlertTriangle size={28} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">{t("reportTitle")}</h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold mt-1 max-w-xl leading-relaxed">{t("reportDesc")}</p>
        </div>
      </div>

      {/* STEP STEPS PROGRESS BAR */}
      {!submitted && (
        <div className="flex justify-between items-center bg-white border border-emerald-500/10 p-4 rounded-2xl shadow-sm mb-8 select-none">
          {[
            { label: "Capture Photo", stepIdx: 0 },
            { label: "Pin Geotag", stepIdx: 1 },
            { label: "Review Details", stepIdx: 2 }
          ].map((s, idx) => {
            const isCompleted = step > s.stepIdx;
            const isCurrent = step === s.stepIdx;
            return (
              <div key={s.label} className="flex items-center gap-2 flex-1 justify-center first:justify-start last:justify-end">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all",
                  isCompleted ? "bg-emerald-600 border-emerald-600 text-white" :
                  isCurrent ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 glow-emerald" :
                  "bg-slate-55 border-slate-200 text-slate-405"
                )}>
                  {isCompleted ? <Check size={12} /> : s.stepIdx + 1}
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider hidden sm:inline",
                  isCurrent ? "text-slate-800 font-extrabold" : "text-slate-400"
                )}>
                  {s.label}
                </span>
                {idx < 2 && <div className="h-px bg-slate-200 flex-1 mx-2 max-w-[40px] hidden sm:block" />}
              </div>
            );
          })}
        </div>
      )}

      {submitted ? (
        <div className="glass-card p-8 rounded-[2rem] border border-emerald-500/10 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-10"
          >
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{t("reportSubmitted")}</h3>
            <p className="text-slate-500 mb-8 text-xs font-semibold leading-relaxed max-w-[280px]">{t("reportSuccessDesc")}</p>
            <button 
              onClick={resetForm} 
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/15"
            >
              {t("newReport")}
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          
          {/* STEP 0: PHOTO CAPTURE */}
          {step === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-3xl border border-emerald-500/10 shadow-xl flex flex-col gap-6"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-8 text-center shadow-inner">
                {image ? (
                  <>
                    <img src={image} alt="Public Litter" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/10" />
                    <button 
                      onClick={() => setImage(null)} 
                      className="absolute top-4 right-4 p-2 bg-white/95 rounded-full text-slate-700 border border-slate-200 shadow-lg hover:bg-slate-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-sm animate-pulse">
                      <Camera size={32} />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-sm">{t("takePhoto")}</p>
                      <p className="text-xs text-slate-400 font-semibold mt-1">{t("captureReportDesc")}</p>
                    </div>
                    <button 
                      onClick={handleCapture}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg text-xs uppercase tracking-wider transition-colors"
                    >
                      {t("openCamera")}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  disabled={!image}
                  onClick={() => setStep(1)}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/10"
                >
                  Continue to Map Pinning
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: LEAFLET MAP PIN SELECTOR */}
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-3xl border border-emerald-500/10 shadow-xl flex flex-col gap-6"
            >
              <div>
                <h3 className="font-bold text-slate-850 text-sm flex items-center gap-1.5">
                  <MapPin size={16} className="text-emerald-600" />
                  Drag the Pin to Dump Location
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Click anywhere on the Kopargaon map or drag the pin to tag the garbage site coordinates.</p>
              </div>

              {/* Leaflet map frame with voyager light tiles */}
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-10 bg-slate-50">
                <div id="report-pin-map" className="w-full h-full" />
              </div>

              {location && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-[10px] font-black text-slate-600 uppercase">Geotag Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(0)}
                  className="px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-slate-200"
                >
                  <ArrowLeft size={14} />
                  Back to Photo
                </button>
                <button
                  disabled={!location}
                  onClick={() => setStep(2)}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-500/15"
                >
                  Continue to Details
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: INCIDENT DETAILS & SUBMIT */}
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-3xl border border-emerald-500/10 shadow-xl flex flex-col gap-6"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2.5 uppercase tracking-wide">{t("issueType")}</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-800"
                  >
                    <option value="Overflowing Public Bin" className="bg-white text-slate-700">{t("optOverflow")}</option>
                    <option value="Illegal Public Dumping" className="bg-white text-slate-700">{t("optDumping")}</option>
                    <option value="Hazardous Waste Spillage" className="bg-white text-slate-700">{t("optExposure")}</option>
                    <option value="Other Garbage Accumulation" className="bg-white text-slate-700">{t("optOther")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2.5 uppercase tracking-wide">{t("additionalDetails")}</label>
                  <textarea 
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={t("describeSituation")}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-850 placeholder-slate-400"
                  />
                </div>

                <div className="flex justify-between items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-slate-200"
                  >
                    <ArrowLeft size={14} />
                    Back to Map
                  </button>
                  <button 
                    type="submit"
                    disabled={isReporting}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xl shadow-emerald-500/15 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                  >
                    {isReporting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={14} />
                        {t("submitReport")}
                      </>
                    )}
                  </button>
                </div>
                
                <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                  {t("reportShareNotice")}
                </p>
              </form>
            </motion.div>
          )}

        </div>
      )}
    </div>
  );
}
