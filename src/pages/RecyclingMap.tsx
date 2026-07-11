import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Clock, Compass, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

type PinType = "bin" | "recyclingCenter" | "userReport";

// Real waste pickup and dispense points in Kopargaon, Maharashtra
const dropOffCenters = [
  { 
    id: 1, 
    name: "Kopargaon Municipal Council Plant", 
    type: "Organic Compost & Sorting Hub", 
    pinType: "recyclingCenter" as PinType,
    address: "Station Road, near Municipal Council, Kopargaon, MH 423601", 
    lat: 19.8920, 
    lng: 74.4845, 
    phone: "+91 2423 222233", 
    hours: "8:00 AM - 6:00 PM" 
  },
  { 
    id: 2, 
    name: "Godavari Valley Waste Depot", 
    type: "Dry Plastics & Cardboard", 
    pinType: "recyclingCenter" as PinType,
    address: "Yeola Road, MIDC Industrial Area, Kopargaon, MH 423601", 
    lat: 19.8850, 
    lng: 74.4750, 
    phone: "+91 98224 55102", 
    hours: "9:00 AM - 7:00 PM" 
  },
  { 
    id: 3, 
    name: "Ganeshnagar E-Waste Vault", 
    type: "Batteries / Electronics Drop", 
    pinType: "userReport" as PinType,
    address: "Near Sangamner Road junction, Kopargaon, MH 423603", 
    lat: 19.8780, 
    lng: 74.4920, 
    phone: "+91 94222 34180", 
    hours: "24 Hours Drop Box" 
  },
  { 
    id: 4, 
    name: "Bazar Peth Organic waste Pit", 
    type: "Organic Kitchen Compost", 
    pinType: "bin" as PinType,
    address: "Subhash Chowk, Vegetable Market, Kopargaon, MH 423601", 
    lat: 19.8895, 
    lng: 74.4812, 
    phone: "+91 2423 223504", 
    hours: "6:00 AM - 8:00 PM" 
  },
  { 
    id: 5, 
    name: "Kopargaon Railway Compactor", 
    type: "Metal & Solid Scrap Compactor", 
    pinType: "recyclingCenter" as PinType,
    address: "Station Road, Railway Yard, Kopargaon, MH 423601", 
    lat: 19.9230, 
    lng: 74.4862, 
    phone: "+91 90110 88200", 
    hours: "8:00 AM - 5:00 PM" 
  }
];

export default function RecyclingMap() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<any>(dropOffCenters[0]);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  const filteredCenters = dropOffCenters.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize Leaflet Map once with CartoDB Voyager light tiles
  useEffect(() => {
    const L = (window as any).L;
    if (!L) {
      console.error("Leaflet library not loaded yet.");
      return;
    }

    // Centered initially on Kopargaon
    const mapInstance = L.map('kopargaon-leaflet-map', {
      zoomControl: false // Keep controls hidden for a clean app feel
    }).setView([19.889, 74.483], 13);

    // CartoDB Voyager light tiles matches light theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(mapInstance);

    // Custom colored divIcon pin configurations
    const getPinIcon = (type: PinType) => {
      const colorByType: Record<PinType, string> = {
        bin: "#10B981",            // emerald green
        recyclingCenter: "#3B82F6", // recycle blue
        userReport: "#F59E0B",      // amber
      };

      return L.divIcon({
        className: "custom-pin",
        html: `
          <div style="
            width: 24px; height: 24px; border-radius: 50%;
            background: ${colorByType[type]};
            border: 2px solid rgba(255,255,255,0.9);
            box-shadow: 0 0 10px 1px ${colorByType[type]}50, 0 2px 6px rgba(0,0,0,0.25);
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    };

    // Add markers for all Kopargaon points
    const createdMarkers = dropOffCenters.map((loc) => {
      const marker = L.marker([loc.lat, loc.lng], { icon: getPinIcon(loc.pinType) })
        .addTo(mapInstance)
        .bindPopup(`<b>${loc.name}</b><br/><span style="font-size: 10px; color: #555;">${loc.type}</span>`);

      // Sync selection when tapping marker pin
      marker.on('click', () => {
        setSelectedCenter(loc);
      });

      return { id: loc.id, marker };
    });

    setMap(mapInstance);
    setMarkers(createdMarkers);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update map coordinates smoothly using flyTo transitions (1.0s)
  useEffect(() => {
    if (map && selectedCenter) {
      const { lat, lng } = selectedCenter;
      map.flyTo([lat, lng], 15, {
        animate: true,
        duration: 1.0
      });

      // Trigger popup automatically on focus
      const targetMarker = markers.find(m => m.id === selectedCenter.id);
      if (targetMarker) {
        targetMarker.marker.openPopup();
      }
    }
  }, [selectedCenter, map, markers]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      
      {/* 1. FLOATING SEARCH BAR (Light glass styling) */}
      <div className="absolute top-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-emerald-500/10 rounded-2xl shadow-xl flex items-center gap-2.5 px-4 py-3">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input 
          type="text" 
          placeholder="Search Kopargaon Bins & Depots..."
          className="w-full bg-transparent border-0 text-xs font-bold text-slate-700 focus:outline-none placeholder-slate-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 2. REAL INTERACTIVE LEAFLET MAP ELEMENT */}
      <div className="flex-1 w-full h-full relative z-10">
        <div id="kopargaon-leaflet-map" className="w-full h-full" style={{ background: '#EAECE9' }} />
      </div>

      {/* 3. FLOATING HORIZONTAL SWIPE CAROUSEL (Light glass card styling) */}
      <div className="absolute bottom-24 left-0 w-full z-20 flex gap-4 overflow-x-auto px-4 py-2 snap-x snap-mandatory scrollbar-none">
        {filteredCenters.length === 0 ? (
          <div className="snap-center w-[calc(100%-2rem)] mx-auto p-4 bg-white/95 backdrop-blur border border-emerald-500/15 rounded-2xl text-center text-[10px] font-black text-slate-400 uppercase tracking-wider shadow-lg">
            No matching bins found
          </div>
        ) : (
          filteredCenters.map((loc) => {
            const isSelected = selectedCenter?.id === loc.id;
            return (
              <motion.div
                key={loc.id}
                onClick={() => setSelectedCenter(loc)}
                className={cn(
                  "snap-center w-[270px] shrink-0 p-4 rounded-2xl border text-left cursor-pointer transition-all shadow-xl flex flex-col justify-between min-h-[130px] select-none",
                  isSelected 
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/15" 
                    : "bg-white/95 backdrop-blur text-slate-800 border-emerald-500/10"
                )}
              >
                <div>
                  <div className="flex justify-between items-center gap-2 mb-1.5">
                    <span className={cn(
                      "text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full truncate max-w-[150px] border",
                      isSelected 
                        ? "bg-white/20 text-white border-white/10" 
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    )}>
                      {loc.type}
                    </span>
                    <MapPin size={13} className={isSelected ? "text-white animate-bounce" : "text-emerald-600"} />
                  </div>
                  <h3 className="font-extrabold text-[11px] leading-tight mb-1 truncate">{loc.name}</h3>
                  <p className={cn("text-[9px] line-clamp-2 leading-tight font-semibold", isSelected ? "text-emerald-50" : "text-slate-500")}>
                    {loc.address}
                  </p>
                </div>
                
                <div className={cn("flex items-center justify-between gap-2 mt-2 pt-2 border-t", isSelected ? "border-white/10" : "border-slate-100")}>
                  <div className="flex items-center gap-1 text-[8px] font-black uppercase opacity-90">
                    <Clock size={10} />
                    <span>{loc.hours}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`);
                    }}
                    className={cn(
                      "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                      isSelected ? "bg-white text-emerald-700 hover:bg-slate-50 shadow-md" : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md"
                    )}
                  >
                    Go Route
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="absolute top-20 right-4 p-2 bg-white/95 backdrop-blur border border-emerald-500/10 text-[8px] font-black text-slate-500 rounded-lg shadow-lg uppercase tracking-wider z-20 select-none">
        Kopargaon Center View
      </div>
    </div>
  );
}
