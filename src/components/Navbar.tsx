import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Leaf, Camera, MapPin, BarChart3, BookOpen, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "Home", path: "/", icon: Leaf },
  { name: "Scanner", path: "/scanner", icon: Camera },
  { name: "Guide", path: "/guide", icon: BookOpen },
  { name: "Map", path: "/map", icon: MapPin },
  { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { name: "Report", path: "/report", icon: MessageSquare },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-600 rounded-lg">
                <Leaf className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-stone-800 hidden sm:block">
                SmartWaste
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
                  location.pathname === item.path
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-stone-600 hover:text-emerald-600 hover:bg-stone-50"
                )}
              >
                <item.icon size={16} />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-stone-600 hover:text-emerald-600 hover:bg-stone-50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-white border-b border-stone-100"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3",
                location.pathname === item.path
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-stone-600 hover:text-emerald-600 hover:bg-stone-50"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
