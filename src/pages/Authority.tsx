import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Radio, ClipboardList, ShieldAlert, 
  FileText, Download, Trash2, Camera, 
  Truck, Menu, X, ArrowLeft, Recycle
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { useLanguage } from '../context/LanguageContext';

export default function Authority() {
  const { t } = useLanguage();
  const { 
    activeDispatches, 
    auditLogs, 
    citizenReports, 
    bookDispatch, 
    completeCollection, 
    deleteAuditLog, 
    addAuditLog, 
    convertReportToDispatch 
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'scheduler' | 'radar' | 'registry'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  
  const [schedulerForm, setSchedulerForm] = useState({
    name: "Shree Someshwar Paper Mill",
    code: "SSPM-MIDC",
    email: "dispatch@someshwarpaper.com",
    priority: "Routine Pick-up",
    notes: "",
    weight: "450 kg",
    volume: "2 bins"
  });

  const [registryForm, setRegistryForm] = useState({
    name: "Kopargaon MIDC Processing Hub B",
    code: "KMPH-B",
    email: "midc.processing@kopargaon.gov.in",
    type: "Shredded Paper Bales",
    notes: "",
    weight: "350 kg",
    volume: "1 container"
  });

  const [registryImage, setRegistryImage] = useState<string | null>(null);

  const [radarMap, setRadarMap] = useState<any>(null);
  const [radarMarkers, setRadarMarkers] = useState<any[]>([]);

  // Initialize Leaflet Map for Fleet Radar with Voyager light tiles
  useEffect(() => {
    if (activeTab === 'radar') {
      const L = (window as any).L;
      if (!L) {
        console.error("Leaflet not loaded");
        return;
      }

      const defaultLat = 19.889;
      const defaultLng = 74.483;

      const mapInstance = L.map('authority-radar-map', {
        zoomControl: false
      }).setView([defaultLat, defaultLng], 13);

      // Light Voyager tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(mapInstance);

      // Custom Blue Pin Icon
      const customPinIcon = L.divIcon({
        className: "custom-radar-pin",
        html: `
          <div style="
            width: 24px; height: 24px; border-radius: 50%;
            background: #3B82F6;
            border: 2px solid rgba(255,255,255,0.9);
            box-shadow: 0 0 10px 1px #3B82F650, 0 2px 6px rgba(0,0,0,0.25);
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Create markers for active dispatches
      const markersList = activeDispatches.map((job, idx) => {
        let lat = 19.889;
        let lng = 74.483;
        if (job.facility.includes("Municipal")) { lat = 19.8920; lng = 74.4845; }
        else if (job.facility.includes("Valley")) { lat = 19.8850; lng = 74.4750; }
        else if (job.facility.includes("Ganeshnagar")) { lat = 19.8780; lng = 74.4920; }
        else if (job.facility.includes("Bazar")) { lat = 19.8895; lng = 74.4812; }
        else if (job.facility.includes("Railway")) { lat = 19.9230; lng = 74.4862; }
        else {
          lat = 19.889 + 0.01 * Math.sin(idx * 2.5);
          lng = 74.483 + 0.015 * Math.cos(idx * 2.5);
        }

        const marker = L.marker([lat, lng], { icon: customPinIcon })
          .addTo(mapInstance)
          .bindPopup(`<b>${job.vehicle}</b><br/>${job.status}<br/><span style="font-size: 10px; color: #555;">${job.facility}</span>`);

        marker.on('click', () => {
          setSelectedVehicle({
            id: job.id,
            name: job.vehicle,
            type: job.type,
            address: job.facility,
            lat,
            lng,
            phone: "+91 90110 88200",
            hours: `${job.status} • ETA 10 mins`,
            originalJobId: job.id
          });
        });

        return { id: job.id, marker, lat, lng };
      });

      setRadarMap(mapInstance);
      setRadarMarkers(markersList);

      return () => {
        mapInstance.remove();
      };
    }
  }, [activeTab, activeDispatches]);

  // Center on selected vehicle marker
  useEffect(() => {
    if (radarMap && selectedVehicle) {
      const { lat, lng } = selectedVehicle;
      radarMap.setView([lat, lng], 15, { animate: true });

      const targetMarker = radarMarkers.find(m => m.id === selectedVehicle.id);
      if (targetMarker) {
        targetMarker.marker.openPopup();
      }
    }
  }, [selectedVehicle, radarMap, radarMarkers]);

  const tabItems = [
    { id: 'overview', label: "Overview", icon: LayoutDashboard },
    { id: 'reports', label: `Citizen Alerts (${citizenReports.filter(r => r.status === 'Pending').length})`, icon: ShieldAlert },
    { id: 'scheduler', label: "Scheduler Monitor", icon: ClipboardList },
    { id: 'radar', label: "Fleet Radar Map", icon: Radio },
    { id: 'registry', label: "Compliance Logs", icon: FileText }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "In-Transit": return "bg-blue-50 text-blue-600 border border-blue-200/50";
      case "Collected": case "Resolved": return "bg-emerald-50 text-emerald-600 border border-emerald-200/50";
      case "Dispatched": return "bg-indigo-50 text-indigo-600 border border-indigo-200/50";
      default: return "bg-amber-50 text-amber-600 border border-amber-200/50";
    }
  };

  const handleBookB2B = (e: React.FormEvent) => {
    e.preventDefault();
    bookDispatch(
      schedulerForm.name,
      schedulerForm.code,
      schedulerForm.email,
      schedulerForm.priority,
      schedulerForm.notes,
      schedulerForm.weight,
      schedulerForm.volume
    );
    alert("B2B Dispatch request logged successfully!");
    setSchedulerForm({ ...schedulerForm, notes: "" });
  };

  const handleManualAudit = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog(
      registryForm.name,
      registryForm.code,
      registryForm.email,
      registryForm.type,
      registryForm.notes || "Manual entry compliance manifest log",
      registryForm.weight,
      registryForm.volume
    );
    alert("Manual manifest audit recorded successfully!");
    setRegistryForm({ ...registryForm, notes: "" });
    setRegistryImage(null);
  };

  const triggerDownload = (logId: string) => {
    alert(`Generating Certified EPA Safe-Disposal PDF Receipt for ${logId}...\n\nDownloading file: ${logId}_compliance_certificate.pdf`);
  };

  const handleComplete = (jobId: string) => {
    completeCollection(jobId);
    alert(`Collection manifest ${jobId} signed and compiled into Compliance Registry.`);
    setSelectedVehicle(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4] flex flex-col md:flex-row text-[#1E2E2A] font-sans antialiased relative">
      
      {/* --- DESKTOP AUTHORITY SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/90 backdrop-blur-md border-r border-emerald-500/10 p-6 justify-between z-40 shadow-sm">
        <div className="space-y-8">
          {/* Logo brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20">
              A
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-slate-800 uppercase">Kopargaon Swachh</span>
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none mt-0.5">Admin Console</p>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex flex-col gap-1.5">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border text-left ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg border-emerald-500 glow-emerald font-black' 
                      : 'bg-transparent border-transparent text-slate-500 hover:text-emerald-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Exit Button */}
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <ArrowLeft size={12} />
            Exit to Citizen Hub
          </Link>
        </div>
      </aside>

      {/* Spacer for desktop sidebar */}
      <div className="hidden md:block w-64 shrink-0 h-screen" />

      {/* --- MOBILE TOP APP BAR & MENU --- */}
      <header className="md:hidden h-16 fixed top-0 left-0 w-full bg-white/90 border-b border-emerald-500/10 flex justify-between items-center px-4 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
            A
          </div>
          <div>
            <span className="text-xs font-black tracking-tight text-slate-800 uppercase">Kopargaon Swachh</span>
            <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Console</p>
          </div>
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-50 rounded-xl text-slate-600 hover:text-slate-900 border border-slate-200/80"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 w-full bg-white border-b border-slate-200 z-35 p-5 flex flex-col gap-3 shadow-2xl"
          >
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border text-left ${
                    isActive 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                      : 'bg-transparent border-transparent text-slate-500 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
            <div className="h-px bg-slate-100 my-2" />
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft size={10} />
              Exit to Citizen Hub
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for mobile top app bar */}
      <div className="md:hidden h-16 w-full" />

      {/* --- MAIN OPERATOR COCKPIT AREA --- */}
      <main className="flex-1 flex flex-col p-4 md:p-8 min-h-screen overflow-y-auto">
        
        {/* Cockpit Title Banner */}
        <div className="glass-title-card p-6 md:p-8 rounded-[2.5rem] border shadow-2xl relative overflow-hidden mb-8 flex justify-between items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-2xl shadow-md shrink-0 animate-float">
              <Recycle className="animate-recycle" size={28} />
            </div>
            <div>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                Terminal Node Sector 3
              </span>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 mt-1.5 uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {activeTab === 'overview' ? "Command Overview" :
                 activeTab === 'reports' ? "Citizen Incident Center" :
                 activeTab === 'scheduler' ? "Logistics Scheduler Terminal" :
                 activeTab === 'radar' ? "Fleet Location Tracker" :
                 "EPA Manifest Registry"}
              </h1>
            </div>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-[9px] font-black text-slate-600 uppercase tracking-widest hidden sm:block shadow-sm relative z-10">
            SysStatus: <span className="text-emerald-600 font-black">Online</span>
          </div>
        </div>

        {/* Tab views viewports */}
        <div className="flex-1 relative z-10">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Stats Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 rounded-3xl border border-emerald-500/10 flex flex-col justify-between min-h-[130px] relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Dispatch Fleet</span>
                    <div className="mt-4">
                      <p className="text-3xl font-black text-slate-800">{activeDispatches.length}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Trucks in Operation</p>
                    </div>
                  </div>
                  <div className="glass-card p-6 rounded-3xl border border-emerald-500/10 flex flex-col justify-between min-h-[130px] relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EPA Compliance Logs</span>
                    <div className="mt-4">
                      <p className="text-3xl font-black text-slate-800">{auditLogs.length}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Verified Manifests</p>
                    </div>
                  </div>
                  <div className="glass-card p-6 rounded-3xl border border-emerald-500/10 flex flex-col justify-between min-h-[130px] relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Citizen Reports</span>
                    <div className="mt-4">
                      <p className="text-3xl font-black text-slate-800">{citizenReports.filter(r => r.status === 'Pending').length}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Awaiting Truck Dispatch</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Citizen Reports Alert Feed */}
                  <div className="glass-card p-6 rounded-3xl shadow-xl">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Urgent Citizen Alerts</h3>
                    
                    {citizenReports.filter(r => r.status === 'Pending').length === 0 ? (
                      <div className="py-12 text-center text-slate-500 text-xs font-bold bg-white/40 border border-emerald-500/10 rounded-2xl">
                        All citizen reports resolved!
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {citizenReports.filter(r => r.status === 'Pending').slice(0, 3).map((rep) => (
                          <div key={rep.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                            <div>
                              <span className="font-extrabold text-slate-800 text-xs">{rep.id} • {rep.type}</span>
                              <p className="text-[10px] text-slate-500 font-bold mt-1 max-w-[180px] truncate">{rep.details}</p>
                            </div>
                            <button
                              onClick={() => { setActiveTab('reports'); }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider"
                            >
                              Dispatch
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Active Fleet Registry List */}
                  <div className="glass-card p-6 rounded-3xl shadow-xl">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Fleet Tracking Feed</h3>
                    
                    {activeDispatches.length === 0 ? (
                      <div className="py-12 text-center text-slate-555 text-xs font-bold bg-white/40 border border-emerald-500/10 rounded-2xl">
                        No active vehicles on routes.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activeDispatches.slice(0, 3).map((job) => (
                          <div key={job.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                            <div className="flex gap-2.5 items-center">
                              <Truck size={15} className="text-blue-500 animate-float" />
                              <div>
                                <span className="font-bold text-slate-800 text-xs">{job.vehicle}</span>
                                <p className="text-[9px] text-slate-500 font-bold mt-0.5">{job.facility}</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">{job.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CITIZEN REPORTS TAB */}
            {activeTab === 'reports' && (
              <motion.div 
                key="reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass-card p-6 rounded-3xl shadow-xl">
                  <h2 className="text-lg font-bold text-slate-800 mb-5">Pending Incident Alerts</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {citizenReports.map((report) => (
                      <div key={report.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-3.5 relative overflow-hidden shadow-sm">
                        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={report.image} alt={report.type} className="w-full h-full object-cover" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-black text-slate-700">{report.id}</span>
                            <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded uppercase ${getStatusStyle(report.status)}`}>
                              {report.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-800">{report.type}</h4>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">{report.details}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase mt-2.5">
                            GPS: {report.lat.toFixed(4)}, {report.lng.toFixed(4)} • {report.time} • {report.date}
                          </p>
                        </div>

                        {report.status === 'Pending' && (
                          <button
                            onClick={() => {
                              convertReportToDispatch(report.id, report.type, "Truck #102");
                              alert(`Citizen report ${report.id} promoted! Scheduled Truck #102 for cleanup route.`);
                            }}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/10"
                          >
                            Dispatch Cleanup Truck
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCHEDULER TAB */}
            {activeTab === 'scheduler' && (
              <motion.div 
                key="scheduler"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="glass-card p-6 rounded-3xl border border-emerald-500/10 shadow-xl relative">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Book Cargo Pickup Dispatch</h2>
                  
                  <form onSubmit={handleBookB2B} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Facility Name</label>
                        <input 
                          type="text" 
                          value={schedulerForm.name}
                          onChange={(e) => setSchedulerForm({ ...schedulerForm, name: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Facility Code</label>
                        <input 
                          type="text" 
                          value={schedulerForm.code}
                          onChange={(e) => setSchedulerForm({ ...schedulerForm, code: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800" 
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Enterprise Email</label>
                      <input 
                        type="email" 
                        value={schedulerForm.email}
                        onChange={(e) => setSchedulerForm({ ...schedulerForm, email: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800" 
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Priority/Type</label>
                        <select 
                          value={schedulerForm.priority}
                          onChange={(e) => setSchedulerForm({ ...schedulerForm, priority: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-slate-700"
                        >
                          <option value="Routine Pick-up" className="bg-white text-slate-700">Routine Pick-up</option>
                          <option value="Express Hazmat Removal" className="bg-white text-slate-700">Express Hazmat Removal</option>
                          <option value="Container Swap Request" className="bg-white text-slate-700">Container Swap Request</option>
                          <option value="Urgent Spill Cleanup" className="bg-white text-slate-700">Urgent Spill Cleanup</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Est. Weight</label>
                        <input 
                          type="text" 
                          value={schedulerForm.weight}
                          onChange={(e) => setSchedulerForm({ ...schedulerForm, weight: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800" 
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Cargo Volume Description</label>
                      <input 
                        type="text" 
                        value={schedulerForm.volume}
                        onChange={(e) => setSchedulerForm({ ...schedulerForm, volume: e.target.value })}
                        placeholder="e.g. 2 pallets, 3 crates"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800" 
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Manifest Notes</label>
                      <textarea 
                        rows={2} 
                        value={schedulerForm.notes}
                        onChange={(e) => setSchedulerForm({ ...schedulerForm, notes: e.target.value })}
                        placeholder="Enter forklift access notes, gate clearances..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800" 
                      />
                    </div>

                    <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/10">
                      Book B2B Dispatch
                    </button>
                  </form>
                </div>

                <div className="glass-card p-6 rounded-3xl shadow-xl flex flex-col h-[550px]">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Active Dispatches</h2>
                  
                  <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                    {activeDispatches.length === 0 ? (
                      <div className="py-24 text-center text-slate-500 font-bold text-xs bg-slate-50 border border-slate-200 rounded-2xl">
                        No active dispatches.
                      </div>
                    ) : (
                      activeDispatches.map((job) => (
                        <div key={job.id} className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-800 text-xs">{job.id}</span>
                              <span className={`text-[8px] font-black uppercase border px-1 rounded ${getStatusStyle(job.status)}`}>
                                {job.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-705 font-bold mt-1">{job.facility}</p>
                            <p className="text-[8px] text-slate-400 font-black uppercase mt-0.5">{job.type} • {job.vehicle}</p>
                          </div>
                          <span className="text-xs font-bold text-slate-600">{job.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* RADAR TAB */}
            {activeTab === 'radar' && (
              <motion.div 
                key="radar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-[550px] flex flex-col"
              >
                <div className="flex-1 bg-slate-50 rounded-[2rem] relative overflow-hidden border border-emerald-500/10 shadow-2xl flex">
                  
                  {/* Real Leaflet Map Container for Authority */}
                  <div className="absolute inset-0 w-full h-full z-5">
                    <div id="authority-radar-map" className="w-full h-full" />
                  </div>

                  {/* Embedded Sidebar inside map */}
                  <div className="absolute top-4 left-4 z-10 w-64 bg-white/95 border border-slate-200 backdrop-blur rounded-2xl p-4 shadow-xl max-h-[90%] overflow-y-auto">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Vehicle Fleet</h3>
                    <div className="space-y-2">
                      {activeDispatches.length === 0 ? (
                        <p className="text-[10px] font-bold text-slate-400 uppercase py-4 text-center">No active vehicles</p>
                      ) : (
                        activeDispatches.map((job, idx) => {
                          let lat = 19.889;
                          let lng = 74.483;
                          if (job.facility.includes("Municipal")) { lat = 19.8920; lng = 74.4845; }
                          else if (job.facility.includes("Valley")) { lat = 19.8850; lng = 74.4750; }
                          else if (job.facility.includes("Ganeshnagar")) { lat = 19.8780; lng = 74.4920; }
                          else if (job.facility.includes("Bazar")) { lat = 19.8895; lng = 74.4812; }
                          else if (job.facility.includes("Railway")) { lat = 19.9230; lng = 74.4862; }
                          else {
                            lat = 19.889 + 0.01 * Math.sin(idx * 2.5);
                            lng = 74.483 + 0.015 * Math.cos(idx * 2.5);
                          }
                          return (
                            <button 
                              key={job.id}
                              onClick={() => setSelectedVehicle({
                                id: job.id,
                                name: job.vehicle,
                                type: job.type,
                                address: job.facility,
                                lat,
                                lng,
                                phone: "+91 90110 88200",
                                hours: `${job.status} • ETA 10 mins`,
                                originalJobId: job.id
                              })}
                              className={`w-full p-2.5 rounded-xl border text-left text-[10px] font-bold uppercase transition-all ${
                                selectedVehicle?.id === job.id 
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {job.vehicle} • {job.status}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {selectedVehicle && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 right-4 w-72 p-5 bg-white border border-slate-200 rounded-2xl shadow-xl z-10"
                    >
                      <span className="text-[8px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                        {selectedVehicle.type}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-800 mt-2">{selectedVehicle.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-normal">{selectedVehicle.address}</p>
                      
                      <div className="flex flex-col gap-2 mt-4">
                        <button
                          onClick={() => {
                            handleComplete(selectedVehicle.originalJobId);
                            setSelectedVehicle(null);
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md"
                        >
                          Log Collection Completion
                        </button>
                        <button
                          onClick={() => alert(`Dialing VoIP connection to ${selectedVehicle.name} driver...`)}
                          className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[9px] font-bold uppercase border border-slate-200"
                        >
                          Voice Dispatcher
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* REGISTRY COMPLIANCE TAB */}
            {activeTab === 'registry' && (
              <motion.div 
                key="registry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="glass-card p-6 rounded-3xl border border-emerald-500/10 shadow-xl">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Ad-hoc Compliance Log</h2>
                  
                  <form onSubmit={handleManualAudit} className="space-y-4">
                    <div className="aspect-[16/9] bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
                      {registryImage ? (
                        <img src={registryImage} alt="Cargo Preview" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Camera className="text-slate-400" size={24} />
                          <button 
                            type="button" 
                            onClick={() => setRegistryImage("https://picsum.photos/seed/audit3/800/600")}
                            className="px-3 py-1.5 bg-white text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200"
                          >
                            Capture Photo
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Facility Branch</label>
                        <input 
                          type="text" 
                          value={registryForm.name}
                          onChange={(e) => setRegistryForm({ ...registryForm, name: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Waste Code</label>
                        <input 
                          type="text" 
                          value={registryForm.code}
                          onChange={(e) => setRegistryForm({ ...registryForm, code: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800" 
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Net Weight</label>
                        <input 
                          type="text" 
                          value={registryForm.weight}
                          onChange={(e) => setRegistryForm({ ...registryForm, weight: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">Volume Description</label>
                        <input 
                          type="text" 
                          value={registryForm.volume}
                          onChange={(e) => setRegistryForm({ ...registryForm, volume: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-800" 
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={!registryImage}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg"
                    >
                      Sign & Log Manifest
                    </button>
                  </form>
                </div>

                <div className="glass-card p-6 rounded-3xl shadow-xl flex flex-col h-[550px]">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Certified Manifests</h2>
                  
                  <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-slate-800 text-xs">{log.id}</span>
                          <button onClick={() => deleteAuditLog(log.id)} className="text-slate-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <p>Branch: <span className="text-slate-800 font-bold">{log.facility}</span></p>
                          <p>Weight: <span className="text-emerald-600 font-black">{log.weight}</span></p>
                          <p>Class: <span className="text-slate-600">{log.type}</span></p>
                          <p>Date: <span>{log.date}</span></p>
                        </div>
                        <button 
                          onClick={() => triggerDownload(log.id)}
                          className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[9px] font-black uppercase text-slate-600 flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Download size={10} />
                          Download manifest receipt
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
