import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Guide from './pages/Guide';
import RecyclingMap from './pages/RecyclingMap';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/map" element={<RecyclingMap />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<Report />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-stone-100 py-12 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-emerald-600 rounded-lg">
                  <svg className="text-white w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C10 14.52 12 13 13 12"/></svg>
                </div>
                <span className="font-bold text-xl tracking-tight text-stone-800">SmartWaste</span>
              </div>
              <p className="text-stone-500 max-w-sm mb-6">
                Empowering communities to manage waste smarter through AI and real-time data. Together for a greener tomorrow.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-stone-800 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><a href="/scanner" className="hover:text-emerald-600 transition-colors">AI Scanner</a></li>
                <li><a href="/guide" className="hover:text-emerald-600 transition-colors">Waste Guide</a></li>
                <li><a href="/map" className="hover:text-emerald-600 transition-colors">Recycling Map</a></li>
                <li><a href="/report" className="hover:text-emerald-600 transition-colors">Report Issue</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-stone-800 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><a href="/contact" className="hover:text-emerald-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">About Mission</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-400">© 2026 Smart Waste Segregation Assistant. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-stone-400">
              <a href="#" className="hover:text-stone-600">Twitter</a>
              <a href="#" className="hover:text-stone-600">Instagram</a>
              <a href="#" className="hover:text-stone-600">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
