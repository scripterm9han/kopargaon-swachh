import React, { createContext, useContext, useState, useEffect } from 'react';
import { WasteAnalysis } from '../types';

export interface DispatchJob {
  id: string;
  facility: string;
  facilityCode: string;
  email: string;
  type: string;
  status: 'Scheduled' | 'In-Transit' | 'Collected';
  time: string;
  vehicle: string;
  weight: string;
  volume: string;
  notes: string;
  date: string;
  linkedReportId?: string;
}

export interface CitizenReport {
  id: string;
  image: string;
  lat: number;
  lng: number;
  type: string;
  details: string;
  status: 'Pending' | 'Dispatched' | 'Resolved';
  time: string;
  date: string;
}

interface LogisticsContextProps {
  scannedCargo: WasteAnalysis | null;
  setScannedCargo: (cargo: WasteAnalysis | null) => void;
  activeDispatches: DispatchJob[];
  auditLogs: DispatchJob[];
  citizenReports: CitizenReport[];
  bookDispatch: (name: string, code: string, email: string, priority: string, notes: string, weight?: string, volume?: string, linkedReportId?: string) => void;
  completeCollection: (id: string) => void;
  deleteAuditLog: (id: string) => void;
  addAuditLog: (name: string, code: string, email: string, priority: string, notes: string, weight: string, volume: string) => void;
  reportDumping: (image: string, lat: number, lng: number, type: string, details: string) => void;
  convertReportToDispatch: (reportId: string, priority: string, vehicle: string) => void;
  stats: {
    points: number;
    scans: number;
    plastic: number;
    co2: number;
  };
}

const LogisticsContext = createContext<LogisticsContextProps | undefined>(undefined);

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scannedCargo, setScannedCargo] = useState<WasteAnalysis | null>(null);

  // Initialize Citizen Reports from localStorage
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(() => {
    const saved = localStorage.getItem('citizenReports');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "REP-901",
        image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
        lat: 19.8895,
        lng: 74.4812,
        type: "Organic Waste Overflow",
        details: "Vegetable market sorting bins overflowing near Subhash Chowk, Bazar Peth. Waste spill on road path.",
        status: "Pending",
        time: "10:30 AM",
        date: new Date().toLocaleDateString()
      },
      {
        id: "REP-902",
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
        lat: 19.8780,
        lng: 74.4920,
        type: "Illegal E-Waste Dumping",
        details: "Electronic scrap, obsolete circuit cells and copper wire coils discarded near Sangamner Road junction.",
        status: "Pending",
        time: "11:45 AM",
        date: new Date().toLocaleDateString()
      }
    ];
  });
  
  // Initialize Active Dispatches from localStorage
  const [activeDispatches, setActiveDispatches] = useState<DispatchJob[]>(() => {
    const saved = localStorage.getItem('activeDispatches');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "DISP-409",
        facility: "Godavari Valley Waste Depot",
        facilityCode: "GVWD-MIDC",
        email: "logistics@godavarivalley.com",
        type: "Plastics & Dry Waste Removal",
        status: "In-Transit",
        time: "14:15",
        vehicle: "Carrier #309",
        weight: "1.2 Tons",
        volume: "3 Pallets",
        notes: "Requires dry sorting vehicle and MIDC gate clearance permit.",
        date: new Date().toLocaleDateString(),
      },
      {
        id: "DISP-410",
        facility: "Kopargaon Municipal Council sorting vault",
        facilityCode: "KMC-SV",
        email: "sanitation@kopargaonmunicipality.gov.in",
        type: "Organic Waste Swap",
        status: "Scheduled",
        time: "15:45",
        vehicle: "Compactor #205",
        weight: "450 kg",
        volume: "2 bins",
        notes: "Vegetable market organic container exchange swap.",
        date: new Date().toLocaleDateString(),
      }
    ];
  });

  // Initialize Audit Logs from localStorage
  const [auditLogs, setAuditLogs] = useState<DispatchJob[]>(() => {
    const saved = localStorage.getItem('auditLogs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "DISP-408",
        facility: "Bazar Peth Market Sorting Station",
        facilityCode: "BPMS-01",
        email: "bazar.market@kopargaon.gov.in",
        type: "Compost Compilation",
        status: "Collected",
        time: "13:30",
        vehicle: "Truck #102",
        weight: "4.5 Tons",
        volume: "12 bales",
        notes: "Certified organic compost loaded and dispatched to municipal agricultural plant.",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
      }
    ];
  });

  const [stats, setStats] = useState({
    points: 0,
    scans: 0,
    plastic: 0,
    co2: 0,
  });

  useEffect(() => {
    localStorage.setItem('citizenReports', JSON.stringify(citizenReports));
  }, [citizenReports]);

  useEffect(() => {
    localStorage.setItem('activeDispatches', JSON.stringify(activeDispatches));
  }, [activeDispatches]);

  useEffect(() => {
    localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
    
    // Calculate B2B stats dynamically from auditLogs
    const baseScans = auditLogs.length;
    let totalWeightTons = 0;

    auditLogs.forEach(log => {
      const weightStr = log.weight.toLowerCase();
      const num = parseFloat(weightStr);
      if (!isNaN(num)) {
        if (weightStr.includes('ton')) {
          totalWeightTons += num;
        } else if (weightStr.includes('kg')) {
          totalWeightTons += (num / 1000);
        }
      }
    });

    const calculatedPoints = baseScans * 100 + Math.round(totalWeightTons * 50);
    const calculatedPlastic = totalWeightTons * 0.45;
    const calculatedCo2 = totalWeightTons * 1.6;

    setStats({
      points: calculatedPoints,
      scans: baseScans,
      plastic: calculatedPlastic,
      co2: calculatedCo2
    });
  }, [auditLogs]);

  // Book collection dispatch
  const bookDispatch = (name: string, code: string, email: string, priority: string, notes: string, weight?: string, volume?: string, linkedReportId?: string) => {
    const idNum = Math.floor(411 + Math.random() * 500);
    const timeStr = new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let assignedVehicle = "Assigning...";
    if (priority.includes("Hazmat") || priority.includes("E-Waste") || priority.includes("Chemical")) {
      assignedVehicle = "Carrier #309";
    } else if (priority.includes("Organic") || priority.includes("Compactor")) {
      assignedVehicle = "Compactor #205";
    } else if (priority.includes("Cardboard") || priority.includes("General") || priority.includes("Bulk")) {
      assignedVehicle = "Truck #102";
    } else {
      assignedVehicle = "Truck #044";
    }

    const newJob: DispatchJob = {
      id: `DISP-${idNum}`,
      facility: name,
      facilityCode: code,
      email: email,
      type: priority,
      status: "Scheduled",
      time: timeStr,
      vehicle: assignedVehicle,
      weight: weight || "250 kg",
      volume: volume || "1 unit",
      notes: notes,
      date: new Date().toLocaleDateString(),
      linkedReportId: linkedReportId
    };

    setActiveDispatches([newJob, ...activeDispatches]);
  };

  // Complete Collection
  const completeCollection = (id: string) => {
    const job = activeDispatches.find(j => j.id === id);
    if (!job) return;

    const completedJob: DispatchJob = {
      ...job,
      status: "Collected",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // If this dispatch was linked to a citizen report, resolve the citizen report!
    if (job.linkedReportId) {
      setCitizenReports(prev => prev.map(rep => 
        rep.id === job.linkedReportId ? { ...rep, status: 'Resolved' } : rep
      ));
    }

    setActiveDispatches(activeDispatches.filter(j => j.id !== id));
    setAuditLogs([completedJob, ...auditLogs]);
  };

  const deleteAuditLog = (id: string) => {
    setAuditLogs(auditLogs.filter(log => log.id !== id));
  };

  const addAuditLog = (name: string, code: string, email: string, priority: string, notes: string, weight: string, volume: string) => {
    const idNum = Math.floor(411 + Math.random() * 500);
    const newLog: DispatchJob = {
      id: `DISP-${idNum}`,
      facility: name,
      facilityCode: code,
      email: email,
      type: priority,
      status: "Collected",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vehicle: "Manual Entry",
      weight: weight || "250 kg",
      volume: volume || "1 unit",
      notes: notes,
      date: new Date().toLocaleDateString(),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Citizen reports a public dump
  const reportDumping = (image: string, lat: number, lng: number, type: string, details: string) => {
    const idNum = Math.floor(903 + Math.random() * 99);
    const newReport: CitizenReport = {
      id: `REP-${idNum}`,
      image: image,
      lat: lat,
      lng: lng,
      type: type,
      details: details,
      status: "Pending",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    };
    setCitizenReports([newReport, ...citizenReports]);
  };

  // Authority converts a report into an active dispatch truck route
  const convertReportToDispatch = (reportId: string, priority: string, vehicle: string) => {
    const report = citizenReports.find(r => r.id === reportId);
    if (!report) return;

    // Book dispatch
    bookDispatch(
      `Public Report Site (${report.id})`,
      "MUNICIPAL",
      "authority@city.gov",
      priority || report.type,
      `Citizen Report details: ${report.details}\nGPS: ${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`,
      "1.5 Tons",
      "Bulk container load",
      reportId
    );

    // Update report status
    setCitizenReports(prev => prev.map(rep => 
      rep.id === reportId ? { ...rep, status: 'Dispatched' } : rep
    ));
  };

  return (
    <LogisticsContext.Provider value={{
      scannedCargo,
      setScannedCargo,
      activeDispatches,
      auditLogs,
      citizenReports,
      bookDispatch,
      completeCollection,
      deleteAuditLog,
      addAuditLog,
      reportDumping,
      convertReportToDispatch,
      stats
    }}>
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};
