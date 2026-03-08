import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, MapPin, Send, CheckCircle2, AlertTriangle, Upload } from 'lucide-react';

export default function Report() {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCapture = () => {
    // Mock image capture
    setImage("https://picsum.photos/seed/garbage/800/600");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReporting(true);
    setTimeout(() => {
      setIsReporting(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Report Garbage</h1>
        <p className="text-stone-500">Help keep our city clean by reporting illegal dumping or overflowing bins.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-stone-100 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center p-8 text-center relative">
            {image ? (
              <>
                <img src={image} alt="Report" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20" />
                <button onClick={() => setImage(null)} className="absolute top-4 right-4 p-2 bg-white/90 rounded-full text-stone-800 shadow-lg">
                  <AlertTriangle size={18} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-stone-400 shadow-sm">
                  <Camera size={32} />
                </div>
                <div>
                  <p className="font-bold text-stone-800">Take a Photo</p>
                  <p className="text-xs text-stone-400">Capture the issue to generate a report</p>
                </div>
                <button 
                  onClick={handleCapture}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all"
                >
                  Open Camera
                </button>
              </div>
            )}
          </div>

          {location && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
              <MapPin className="text-blue-600" size={20} />
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Location Tagged</p>
                <p className="text-sm font-medium text-blue-800">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">Report Submitted!</h3>
              <p className="text-stone-500 mb-8">Thank you for your contribution. Municipal authorities have been notified.</p>
              <button onClick={() => {setSubmitted(false); setImage(null); setLocation(null);}} className="px-8 py-3 bg-stone-900 text-white rounded-xl font-bold">
                New Report
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Issue Type</label>
                <select className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Overflowing Public Bin</option>
                  <option>Illegal Dumping</option>
                  <option>Hazardous Waste Exposure</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Additional Details</label>
                <textarea 
                  rows={4}
                  placeholder="Describe the situation..."
                  className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button 
                type="submit"
                disabled={!image || isReporting}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isReporting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Submit Report
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-stone-400 font-medium">
                Your report will be automatically shared with the local municipal waste management department.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
