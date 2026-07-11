import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Guide from './pages/Guide';
import RecyclingMap from './pages/RecyclingMap';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Contact from './pages/Contact';
import Authority from './pages/Authority';
import { LanguageProvider } from './context/LanguageContext';
import { LogisticsProvider } from './context/LogisticsContext';

function EcoParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden select-none">
      <div className="leaf-particle-1" style={{ left: '10%', animationDelay: '0s' }}>🍃</div>
      <div className="leaf-particle-2" style={{ left: '25%', animationDelay: '4s' }}>🌿</div>
      <div className="leaf-particle-1" style={{ left: '45%', animationDelay: '8s' }}>🍂</div>
      <div className="leaf-particle-2" style={{ left: '65%', animationDelay: '2s' }}>🍃</div>
      <div className="leaf-particle-1" style={{ left: '80%', animationDelay: '12s' }}>🌿</div>
      <div className="leaf-particle-2" style={{ left: '90%', animationDelay: '6s' }}>🍀</div>
    </div>
  );
}

function CitizenAppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-[#EAECE9] flex justify-center relative z-10 overflow-hidden">
      {/* Centered Glass column simulating a clean app interface on desktop */}
      <div className="w-full max-w-[430px] h-full bg-[#F5F7F4]/90 backdrop-blur-xl border-x border-emerald-500/10 shadow-2xl flex flex-col relative overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAuthority = location.pathname.startsWith('/authority');
  const isMapPage = location.pathname === '/map';

  const content = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scanner" element={<Scanner />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/map" element={<RecyclingMap />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/report" element={<Report />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/authority" element={<Authority />} />
    </Routes>
  );

  if (isAuthority) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased relative">
        <div className="eco-blob-1" />
        <div className="eco-blob-2" />
        <div className="glass-bg-overlay" />
        <EcoParticles />
        <div className="flex-1 flex flex-col min-h-screen relative z-10">
          <main className="flex-1 w-full mx-auto">
            {content}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#EAECE9] text-[#1E2E2A] flex flex-col font-sans antialiased relative overflow-hidden">
      {/* Background Bio Blobs & Frosted Glass Overlay */}
      <div className="eco-blob-1" />
      <div className="eco-blob-2" />
      <div className="glass-bg-overlay" />

      {/* Floating ecological background particles */}
      <EcoParticles />

      <CitizenAppWrapper>
        {/* Navbar handles bottom navigation globally inside the phone frame viewport */}
        <Navbar />
        {isMapPage ? (
          <div className="flex-1 relative overflow-hidden">
            {content}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pb-24">
            {content}
          </div>
        )}
      </CitizenAppWrapper>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <LogisticsProvider>
        <Router>
          <MainLayout />
        </Router>
      </LogisticsProvider>
    </LanguageProvider>
  );
}
