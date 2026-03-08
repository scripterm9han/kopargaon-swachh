import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, RefreshCw, Trash2, Leaf, Info, AlertTriangle, Recycle, CheckCircle2, Mic, MicOff, Zap, BarChart3 } from 'lucide-react';
import { analyzeWasteImage, askVoiceAssistant } from '../services/gemini';
import { WasteAnalysis, WasteCategory } from '../types';
import { cn } from '../lib/utils';

const CATEGORY_STYLES: Record<WasteCategory, { color: string; icon: any; bg: string; border: string; bin: string }> = {
  Recyclable: { 
    color: 'text-blue-600', 
    bg: 'bg-blue-50', 
    border: 'border-blue-200',
    bin: 'Blue Bin',
    icon: Recycle 
  },
  Organic: { 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200',
    bin: 'Green Bin',
    icon: Leaf 
  },
  'Non-Recyclable': { 
    color: 'text-stone-600', 
    bg: 'bg-stone-100', 
    border: 'border-stone-200',
    bin: 'Black Bin',
    icon: Trash2 
  },
  'E-Waste': { 
    color: 'text-red-600', 
    bg: 'bg-red-50', 
    border: 'border-red-200',
    bin: 'Red Bin (Special)',
    icon: Zap 
  },
  Hazardous: { 
    color: 'text-red-600', 
    bg: 'bg-red-50', 
    border: 'border-red-200',
    bin: 'Hazardous Collection',
    icon: AlertTriangle 
  },
};

export default function Scanner() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WasteAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech Recognition
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setIsAnalyzing(true);
        try {
          const response = await askVoiceAssistant(transcript);
          setVoiceResponse(response);
          setResult(null);
        } catch (err) {
          setError("Voice assistant failed. Please try again.");
        } finally {
          setIsAnalyzing(false);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setError("Speech recognition error. Please check permissions.");
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setError(null);
      setVoiceResponse(null);
      recognitionRef.current?.start();
      setIsListening(true);
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
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const mimeType = image.split(';')[0].split(':')[1];
      const analysis = await analyzeWasteImage(image, mimeType);
      setResult(analysis);
      // Award points (mock)
      const currentPoints = parseInt(localStorage.getItem('ecoPoints') || '0');
      localStorage.setItem('ecoPoints', (currentPoints + 10).toString());
      const currentScans = parseInt(localStorage.getItem('totalScans') || '0');
      localStorage.setItem('totalScans', (currentScans + 1).toString());
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">AI Waste Scanner</h1>
        <p className="text-stone-500">Identify your waste instantly using AI or Voice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Input Area */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden glass-card flex items-center justify-center border-2 border-dashed border-stone-200">
            <AnimatePresence mode="wait">
              {!image ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 p-8 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Camera size={40} />
                  </div>
                  <div>
                    <p className="font-bold text-stone-800">Ready to Scan</p>
                    <p className="text-sm text-stone-500">Capture or upload a photo</p>
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all"
                    >
                      <Upload size={18} />
                      Upload Photo
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
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                    {!result && !isAnalyzing && (
                      <button 
                        onClick={processImage}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold shadow-2xl hover:bg-emerald-700 transition-all"
                      >
                        Analyze Now
                      </button>
                    )}
                    <button onClick={reset} className="p-3 bg-white text-stone-800 rounded-full shadow-xl">
                      <RefreshCw size={20} className={isAnalyzing ? "animate-spin" : ""} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-bold text-emerald-800">AI is thinking...</p>
              </div>
            )}
          </div>

          {/* Voice Assistant Button */}
          <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-800">Voice Assistant</h3>
              <p className="text-sm text-stone-500">Ask: "Where do I throw paper?"</p>
            </div>
            <button 
              onClick={toggleListening}
              className={cn(
                "p-4 rounded-full transition-all shadow-lg",
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-white text-emerald-600"
              )}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
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
                  "p-8 rounded-[2rem] border-2 shadow-xl",
                  CATEGORY_STYLES[result.category].bg,
                  CATEGORY_STYLES[result.category].border
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={cn("text-xs font-black uppercase tracking-widest", CATEGORY_STYLES[result.category].color)}>
                      {result.category}
                    </span>
                    <h2 className="text-3xl font-bold text-stone-900 mt-1">{result.itemName}</h2>
                  </div>
                  <div className={cn("p-4 rounded-2xl bg-white shadow-sm", CATEGORY_STYLES[result.category].color)}>
                    {(() => {
                      const Icon = CATEGORY_STYLES[result.category].icon;
                      return <Icon size={32} />;
                    })()}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                    <div className={cn("w-4 h-4 rounded-full", 
                      result.binColor === 'Blue' ? 'bg-blue-600' :
                      result.binColor === 'Green' ? 'bg-emerald-600' :
                      result.binColor === 'Black' ? 'bg-stone-800' : 'bg-red-600'
                    )} />
                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase">Correct Bin</p>
                      <p className="font-bold text-stone-800">{CATEGORY_STYLES[result.category].bin}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-stone-700 mb-1 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      Disposal Suggestion
                    </h4>
                    <p className="text-stone-600 leading-relaxed">{result.disposalInstruction}</p>
                  </div>

                  <div className="p-4 bg-white/40 rounded-2xl border border-white/40">
                    <h4 className="text-sm font-bold text-emerald-800 mb-1 flex items-center gap-2">
                      <Info size={16} />
                      Eco Tip
                    </h4>
                    <p className="text-emerald-700 italic text-sm">"{result.environmentalTip}"</p>
                  </div>
                </div>
              </motion.div>
            ) : voiceResponse ? (
              <motion.div 
                key="voice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 rounded-[2rem] bg-emerald-600 text-white shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Mic size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Assistant Response</h3>
                </div>
                <p className="text-lg leading-relaxed mb-6">"{voiceResponse}"</p>
                <button onClick={() => setVoiceResponse(null)} className="text-white/60 text-sm font-bold hover:text-white transition-colors">
                  Dismiss
                </button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-stone-100 rounded-[2rem]">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-4">
                  <BarChart3 size={32} />
                </div>
                <h3 className="font-bold text-stone-400">Analysis Results</h3>
                <p className="text-sm text-stone-300">Scan an item or ask a question to see details here.</p>
              </div>
            )}
          </AnimatePresence>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700">
              <AlertTriangle className="shrink-0 mt-1" size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
