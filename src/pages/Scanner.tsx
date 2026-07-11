import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, RefreshCw, Trash2, Leaf, Info, AlertTriangle, Recycle, CheckCircle2, Mic, MicOff, Zap, ClipboardList, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeWasteImage, askVoiceAssistant } from '../services/gemini';
import { WasteAnalysis } from '../types';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useLogistics } from '../context/LogisticsContext';

const CATEGORY_STYLES: Record<string, { color: string; icon: any; bg: string; border: string; binKey: string; nameKey: string; emoji: string }> = {
  plastic: { 
    color: 'text-blue-600', 
    bg: 'bg-blue-500/5', 
    border: 'border-blue-500/15',
    binKey: 'blueBin',
    nameKey: 'recyclable',
    icon: Recycle,
    emoji: '🧴 Plastic'
  },
  paper: { 
    color: 'text-indigo-600', 
    bg: 'bg-indigo-500/5', 
    border: 'border-indigo-500/15',
    binKey: 'blueBin',
    nameKey: 'recyclable',
    icon: Recycle,
    emoji: '📦 Paper'
  },
  glass: { 
    color: 'text-teal-600', 
    bg: 'bg-teal-500/5', 
    border: 'border-teal-500/15',
    binKey: 'blueBin',
    nameKey: 'recyclable',
    icon: Recycle,
    emoji: '🥛 Glass'
  },
  metal: { 
    color: 'text-amber-600', 
    bg: 'bg-amber-500/5', 
    border: 'border-amber-500/15',
    binKey: 'blueBin',
    nameKey: 'recyclable',
    icon: Recycle,
    emoji: '🥫 Metal'
  },
  'e-waste': { 
    color: 'text-red-600', 
    bg: 'bg-red-500/5', 
    border: 'border-red-500/15',
    binKey: 'redBin',
    nameKey: 'ewasteCategory',
    icon: Zap,
    emoji: '🔌 E-Waste'
  },
  organic: { 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-500/5', 
    border: 'border-emerald-500/15',
    binKey: 'greenBin',
    nameKey: 'organicCategory',
    icon: Leaf,
    emoji: '🍎 Organic'
  },
  mixed: { 
    color: 'text-slate-600', 
    bg: 'bg-slate-500/5', 
    border: 'border-slate-500/15',
    binKey: 'blackBin',
    nameKey: 'nonRecyclable',
    icon: Trash2,
    emoji: '🗑️ Mixed Garbage'
  },
  other: { 
    color: 'text-slate-600', 
    bg: 'bg-slate-500/5', 
    border: 'border-slate-500/15',
    binKey: 'blackBin',
    nameKey: 'nonRecyclable',
    icon: Trash2,
    emoji: '🗑️ Other'
  }
};

const getCategoryStyle = (cat: string) => {
  const key = cat?.toLowerCase() || 'other';
  return CATEGORY_STYLES[key] || CATEGORY_STYLES.other;
};

// Preset Items data matching the new skill JSON schema
const PRESET_ITEMS = [
  {
    name: "Empty Soda Can",
    icon: "🥫",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80",
    data: {
      item_name: "Aluminum Soda Can",
      material_type: "metal",
      recyclable: true,
      confidence: 0.95,
      disposal_instructions: "Rinse out residual beverage. Crush the can to save space, and place it in the Blue Recycling Bin.",
      hazard_flag: false,
      notes: "Recycling aluminum saves 95% of the energy needed to make new aluminum from raw bauxite ore!"
    }
  },
  {
    name: "Banana Peel Scraps",
    icon: "🍌",
    image: "https://images.unsplash.com/photo-1579618218290-3fa8cf184fec?auto=format&fit=crop&w=400&q=80",
    data: {
      item_name: "Organic Banana Peel Scraps",
      material_type: "organic",
      recyclable: false,
      confidence: 0.92,
      disposal_instructions: "Dispose of food scraps in the Green Compost Bin. Do not mix plastic carrier wraps.",
      hazard_flag: false,
      notes: "Organic scraps create nutrient-dense compost soil that locks carbon back into agricultural ground."
    }
  },
  {
    name: "Used AA Battery",
    icon: "🔋",
    image: "https://images.unsplash.com/photo-1618578531518-91b5c432700d?auto=format&fit=crop&w=400&q=80",
    data: {
      item_name: "Alkaline Battery Cell",
      material_type: "e-waste",
      recyclable: false,
      confidence: 0.88,
      disposal_instructions: "Place expired household batteries in the specialized Red E-Waste Vault. Never throw in landfill bins.",
      hazard_flag: true,
      notes: "Keeping chemical cells out of trash landfills prevents heavy mercury/lead poisoning from seeping into groundwater."
    }
  },
  {
    name: "Flattened Pizza Box",
    icon: "📦",
    image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=400&q=80",
    data: {
      item_name: "Cardboard Packaging",
      material_type: "paper",
      recyclable: true,
      confidence: 0.94,
      disposal_instructions: "Flatten the box. Remove any heavily grease-stained card bottoms before placing in the Blue Bin.",
      hazard_flag: false,
      notes: "Recycling cardboard packaging reduces timber demands, preserving native forests from industrial logging."
    }
  }
];

export default function Scanner() {
  const { t, language } = useLanguage();
  const { setScannedCargo } = useLogistics();
  const navigate = useNavigate();

  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WasteAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Text-To-Speech (TTS) Voice Guidance
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Voice Assistant
  const [isListening, setIsListening] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear active voice narration when page changes or resets
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';

      rec.onresult = async (event: any) => {
        const query = event.results[0][0].transcript;
        setIsListening(false);
        setIsAnalyzing(true);
        setError(null);
        setVoiceResponse(null);
        setResult(null);

        try {
          const responseText = await askVoiceAssistant(query, language);
          setVoiceResponse(responseText);
          // Speak aloud voice response instantly for accessibility
          speakInstructions(responseText);
        } catch (err: any) {
          setError(err.message || "Failed to process voice command.");
        } finally {
          setIsAnalyzing(false);
        }
      };

      rec.onerror = () => {
        setIsListening(false);
        setError("Voice input error. Try speaking clearly again.");
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported on this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      setResult(null);
      setVoiceResponse(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakInstructions = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Voice readout is not supported on this browser.");
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setVoiceResponse(null);
        setError(null);
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setIsSpeaking(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const mimeType = image.split(';')[0].split(':')[1];
      const analysis = await analyzeWasteImage(image, mimeType, language);
      setResult(analysis);
      setScannedCargo(analysis);
      
      // Auto-narrate results for elder/child accessibility
      const speechText = `${analysis.item_name}. category: ${getCategoryStyle(analysis.material_type).emoji}. bin: ${getBinLabel(analysis.recyclable, analysis.material_type, analysis.hazard_flag)}. ${analysis.disposal_instructions}`;
      speakInstructions(speechText);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setVoiceResponse(null);
    setError(null);
    setScannedCargo(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getBinLabel = (rec: boolean, type: string, hazard: boolean) => {
    if (hazard || type === 'e-waste') return t("redBin");
    if (type === 'organic') return t("greenBin");
    if (rec) return t("blueBin");
    return t("blackBin");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Premium warm glass title card - compact text sizes */}
      <div className="glass-title-card p-6 md:p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden mb-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
        <div className="p-4 bg-emerald-105 border border-emerald-200 text-emerald-600 rounded-2xl shadow-md shrink-0 animate-float">
          <Camera size={28} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-805 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent uppercase tracking-tight">{t("scannerTitle")}</h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold mt-1 max-w-xl leading-relaxed">{t("scannerSubtitle")}</p>
        </div>
      </div>

      <div className="godavari-wave -mt-8 mb-8 opacity-75 select-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Input Area */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden glass-card flex items-center justify-center border border-emerald-500/10 shadow-xl group">
            {/* Viewfinder corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-550 rounded-tl-[2rem] pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-550 rounded-tr-[2rem] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-550 rounded-bl-[2rem] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-550 rounded-br-[2rem] pointer-events-none" />

            {!image && (
              <div className="absolute inset-10 border border-dashed border-emerald-500/20 rounded-2xl pointer-events-none flex items-center justify-center z-5">
                <div className="w-16 h-16 border border-emerald-500/20 rounded-full animate-ping pointer-events-none" />
              </div>
            )}

            <AnimatePresence mode="wait">
              {!image ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 p-8 text-center relative z-5"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-600 animate-pulse">
                    <Camera size={40} />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800">{t("readyToScan")}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-1">{t("captureOrUpload")}</p>
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-[240px] mt-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/10 transition-all text-xs uppercase tracking-wider"
                    >
                      <Upload size={14} />
                      {t("uploadPhoto")}
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      capture="environment"
                      className="hidden" 
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full h-full"
                >
                  <img src={image} alt="Waste" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {isAnalyzing && <div className="scan-laser" />}
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
                    {!result && !isAnalyzing && (
                      <button 
                        onClick={processImage}
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold shadow-2xl transition-all text-xs uppercase tracking-wider"
                      >
                        {t("analyzeNow")}
                      </button>
                    )}
                    <button onClick={reset} className="p-3 bg-white text-slate-800 rounded-full shadow-xl border border-slate-205 hover:bg-slate-50 transition-colors">
                      <RefreshCw size={20} className={isAnalyzing ? "animate-spin text-emerald-600" : ""} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-extrabold text-emerald-600 text-xs tracking-widest uppercase">{t("aiThinking")}</p>
              </div>
            )}
          </div>

          {/* Preset Demo Items Grid - compact layout */}
          <div className="p-6 glass-card rounded-3xl border border-emerald-500/10 shadow-xl space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600" />
              Demo: Quick Tap Presets
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              Don't have a photo handy? Tap any item below to simulate instant high-fidelity AI classification:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_ITEMS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setImage(preset.image);
                    setIsAnalyzing(true);
                    setResult(null);
                    setVoiceResponse(null);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    setTimeout(() => {
                      setIsAnalyzing(false);
                      setResult(preset.data);
                      setScannedCargo(preset.data);
                      const speechText = `${preset.data.item_name}. category: ${getCategoryStyle(preset.data.material_type).emoji}. bin: ${getBinLabel(preset.data.recyclable, preset.data.material_type, preset.data.hazard_flag)}. ${preset.data.disposal_instructions}`;
                      speakInstructions(speechText);
                    }, 1200);
                  }}
                  className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-emerald-500/25 rounded-2xl text-left transition-all group shrink-0"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform select-none">{preset.icon}</span>
                  <span className="text-[10px] font-extrabold text-slate-700 leading-tight">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Assistant Button */}
          <div className="p-6 glass-card rounded-3xl border border-emerald-500/10 flex items-center justify-between shadow-xl relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{t("voiceAssistant")}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{t("askVoicePrompt")}</p>
            </div>
            <button 
              onClick={toggleListening}
              className={cn(
                "p-4 rounded-full transition-all shadow-lg border",
                isListening 
                  ? "bg-red-500/10 text-red-500 border-red-550/20 animate-pulse" 
                  : "bg-slate-50 text-emerald-650 border-slate-200 hover:bg-slate-100"
              )}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
        </div>

        {/* Right: Results Area */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-8 rounded-[2rem] border shadow-2xl relative overflow-hidden bg-white/90 backdrop-blur-xl border-emerald-500/10",
                  getCategoryStyle(result.material_type).border
                )}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/20 rounded-full -mr-16 -mt-16 pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-450">
                      {result.material_type}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-800 mt-1.5 leading-tight">{result.item_name}</h2>
                  </div>
                  <div className="flex gap-2">
                    {/* Speak Aloud Voice Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const speechText = `${result.item_name}. category: ${getCategoryStyle(result.material_type).emoji}. bin: ${getBinLabel(result.recyclable, result.material_type, result.hazard_flag)}. ${result.disposal_instructions}`;
                        speakInstructions(speechText);
                      }}
                      className={cn(
                        "p-3 rounded-xl border transition-all shadow-sm flex items-center justify-center",
                        isSpeaking ? "bg-emerald-600 text-white border-emerald-600 animate-pulse" : "bg-white border-slate-200 text-emerald-600 hover:bg-slate-50"
                      )}
                      title="Listen"
                    >
                      {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <div className={cn("p-3 rounded-xl bg-white border border-slate-200 shadow-sm", getCategoryStyle(result.material_type).color)}>
                      {(() => {
                        const Icon = getCategoryStyle(result.material_type).icon;
                        return <Icon size={16} />;
                      })()}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Category Banner with Large Emojis */}
                  <div className={cn("p-3.5 rounded-xl border flex items-center justify-between shadow-sm text-xs", getCategoryStyle(result.material_type).bg, getCategoryStyle(result.material_type).border)}>
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Material Type</span>
                    <span className="font-extrabold text-slate-700">{getCategoryStyle(result.material_type).emoji}</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
                    <div className={cn("w-3.5 h-3.5 rounded-full shrink-0", 
                      result.recyclable ? 'bg-blue-500 glow-blue' :
                      result.material_type === 'organic' ? 'bg-emerald-500 glow-emerald' :
                      result.hazard_flag ? 'bg-red-500' : 'bg-slate-450'
                    )} />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{t("correctBin")}</p>
                      <p className="font-extrabold text-slate-800 text-xs mt-0.5">
                        {getBinLabel(result.recyclable, result.material_type, result.hazard_flag)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Recyclable</p>
                      <p className="font-black text-slate-800 text-sm mt-0.5">{result.recyclable ? "YES" : "NO"}</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Confidence</p>
                      <p className="font-black text-slate-800 text-sm mt-0.5">{Math.round(result.confidence * 100)}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-650 mb-1.5 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      {t("disposalInstruction")}
                    </h4>
                    <p className="text-slate-500 leading-relaxed text-xs font-semibold bg-white/40 p-3.5 rounded-xl border border-slate-100">{result.disposal_instructions}</p>
                  </div>

                  {result.notes && (
                    <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
                      <h4 className="text-xs font-bold text-emerald-600 mb-1 flex items-center gap-2">
                        <Info size={14} />
                        {t("environmentalTipLabel")}
                      </h4>
                      <p className="text-slate-600 italic text-xs leading-relaxed">"{result.notes}"</p>
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/map')}
                    className="w-full py-3.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10"
                  >
                    <Recycle size={16} />
                    {t("map")}
                  </button>
                </div>
              </motion.div>
            ) : voiceResponse ? (
              <motion.div 
                key="voice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 rounded-[2rem] border border-slate-205 bg-white shadow-2xl relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{t("assistantResponse")}</span>
                    <h2 className="text-xl font-black text-slate-800 mt-1.5 leading-tight">AI Voice Answer</h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => speakInstructions(voiceResponse)}
                      className={cn(
                        "p-3 rounded-xl border transition-all shadow-sm flex items-center justify-center",
                        isSpeaking ? "bg-emerald-600 text-white border-emerald-600 animate-pulse" : "bg-white border-slate-200 text-emerald-600 hover:bg-slate-50"
                      )}
                    >
                      {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 text-emerald-650 shadow-md">
                      <Mic size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-slate-600 leading-relaxed text-xs font-semibold bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                    "{voiceResponse}"
                  </p>

                  <button 
                    onClick={reset}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-550 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10"
                  >
                    <RefreshCw size={14} />
                    Scan Another Item
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[300px] rounded-[2rem] border border-dashed border-emerald-500/15 flex flex-col items-center justify-center p-8 text-center text-slate-400"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                  <ClipboardList size={28} />
                </div>
                <h3 className="font-extrabold text-slate-700 text-sm">{t("analysisResults")}</h3>
                <p className="text-xs text-slate-450 font-semibold mt-1 max-w-xs leading-relaxed">{t("scanOrAskDesc")}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-605 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
