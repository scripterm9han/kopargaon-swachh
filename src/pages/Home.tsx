import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Recycle, Globe, ShieldCheck, Zap, Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-emerald-700 uppercase bg-emerald-100 rounded-full">
              The Future of Recycling
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 mb-6 tracking-tight">
              Smart Waste <span className="text-emerald-600">Segregation</span> Assistant
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-stone-600 mb-10 leading-relaxed">
              Join the movement towards a cleaner planet. Use our AI-powered scanner to identify waste instantly and learn how to dispose of it properly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/scanner"
                className="group flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105"
              >
                Start Scanning
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/guide"
                className="px-8 py-4 bg-white text-stone-800 border border-stone-200 rounded-full font-bold text-lg hover:bg-stone-50 transition-all"
              >
                View Waste Guide
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-200/20 rounded-full blur-3xl -z-0" />
      </section>

      {/* Importance Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Why Waste Segregation Matters?</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Proper waste management is the first step towards a sustainable future. Here's how we help.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Reduce Landfill Waste",
                desc: "By separating recyclables and organics, we significantly decrease the volume of trash sent to landfills.",
                icon: Recycle,
                color: "bg-blue-100 text-blue-600",
              },
              {
                title: "Conserve Resources",
                desc: "Recycling materials saves energy and raw materials needed to produce new products.",
                icon: Globe,
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                title: "Protect Biodiversity",
                desc: "Proper disposal of hazardous waste prevents soil and water contamination, protecting wildlife.",
                icon: ShieldCheck,
                color: "bg-amber-100 text-amber-600",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-stone-100 bg-stone-50/50 hover:bg-white hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">{feature.title}</h3>
                <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Tips Preview */}
      <section className="py-20 px-4 bg-stone-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Daily Sustainability Tip</h2>
            <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-amber-400" />
                <span className="text-amber-400 font-bold uppercase tracking-wider text-sm">Today's Insight</span>
              </div>
              <p className="text-xl italic leading-relaxed mb-6">
                "Did you know that recycling a single aluminum can saves enough energy to power a TV for three hours? Always rinse your cans before recycling!"
              </p>
              <div className="flex items-center gap-2 text-stone-400 text-sm">
                <Leaf size={16} />
                <span>Eco-Tip #142</span>
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="aspect-square bg-emerald-600 rounded-3xl flex items-center justify-center p-6 text-center">
                <p className="font-bold text-lg">90% Accuracy</p>
              </div>
              <div className="aspect-[3/4] bg-stone-800 rounded-3xl border border-white/10 overflow-hidden">
                <img src="https://picsum.photos/seed/recycle/400/600" alt="Recycle" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-stone-800 rounded-3xl border border-white/10 overflow-hidden">
                <img src="https://picsum.photos/seed/nature/400/600" alt="Nature" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square bg-emerald-500 rounded-3xl flex items-center justify-center p-6 text-center">
                <p className="font-bold text-lg">10k+ Scans</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
