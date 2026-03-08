import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Search, Navigation, Info, Phone, Clock } from 'lucide-react';

// Mock locations
const locations = [
  { id: 1, name: "Green City Recycling Center", type: "General", address: "123 Eco Way, Metro City", lat: 40.7128, lng: -74.0060, phone: "555-0123", hours: "8am - 6pm" },
  { id: 2, name: "E-Waste Solutions", type: "Electronic", address: "45 Tech Park, North District", lat: 40.7306, lng: -73.9352, phone: "555-0456", hours: "9am - 5pm" },
  { id: 3, name: "Organic Compost Hub", type: "Organic", address: "88 Garden Lane, South Hill", lat: 40.7589, lng: -73.9851, phone: "555-0789", hours: "7am - 4pm" },
  { id: 4, name: "Scrap Metal Dealers", type: "Metal", address: "12 Industrial Blvd", lat: 40.7829, lng: -73.9654, phone: "555-0999", hours: "8am - 8pm" },
];

export default function RecyclingMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log("Geolocation permission denied")
      );
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Recycling Map</h1>
          <p className="text-stone-500">Find nearby collection points and recycling centers.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by area or waste type..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto pr-2">
          {locations.map((loc) => (
            <motion.button
              key={loc.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedLocation(loc)}
              className={`p-5 rounded-3xl border text-left transition-all ${
                selectedLocation?.id === loc.id 
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200" 
                  : "bg-white border-stone-100 hover:border-emerald-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                  selectedLocation?.id === loc.id ? "bg-white/20" : "bg-stone-100 text-stone-500"
                }`}>
                  {loc.type}
                </span>
                <Navigation size={16} className={selectedLocation?.id === loc.id ? "text-white" : "text-stone-300"} />
              </div>
              <h3 className="font-bold text-lg mb-1">{loc.name}</h3>
              <p className={`text-sm mb-3 ${selectedLocation?.id === loc.id ? "text-emerald-50" : "text-stone-500"}`}>
                {loc.address}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1 text-xs">
                  <Clock size={12} />
                  <span>{loc.hours}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Phone size={12} />
                  <span>{loc.phone}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="flex-1 bg-stone-100 rounded-[3rem] relative overflow-hidden border border-stone-200">
          {/* In a real app, we'd use Google Maps here. For this demo, we'll create a stylized visual placeholder */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
          
          {/* Mock Markers */}
          {locations.map((loc) => (
            <motion.div
              key={loc.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute cursor-pointer group"
              style={{ 
                top: `${30 + (loc.lat - 40.7) * 500}%`, 
                left: `${50 + (loc.lng + 74) * 500}%` 
              }}
              onClick={() => setSelectedLocation(loc)}
            >
              <div className={`p-2 rounded-full shadow-xl transition-all ${
                selectedLocation?.id === loc.id ? "bg-emerald-600 scale-125" : "bg-white group-hover:bg-emerald-50"
              }`}>
                <MapPin size={20} className={selectedLocation?.id === loc.id ? "text-white" : "text-emerald-600"} />
              </div>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {loc.name}
              </div>
            </motion.div>
          ))}

          {/* User Location Marker */}
          {userLocation && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-xl animate-pulse" />
            </div>
          )}

          {/* Info Card Overlay */}
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-6 right-6 md:left-auto md:w-80 p-6 bg-white rounded-3xl shadow-2xl border border-stone-100"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-stone-800">{selectedLocation.name}</h3>
                <button onClick={() => setSelectedLocation(null)} className="text-stone-400 hover:text-stone-600">
                  <Info size={20} />
                </button>
              </div>
              <p className="text-sm text-stone-500 mb-4">{selectedLocation.address}</p>
              <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                <Navigation size={18} />
                Get Directions
              </button>
            </motion.div>
          )}

          <div className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur rounded-2xl border border-white/20 text-[10px] font-bold text-stone-500 shadow-sm">
            MAP VIEW: METRO CITY
          </div>
        </div>
      </div>
    </div>
  );
}
