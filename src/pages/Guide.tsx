import { motion } from "motion/react";
import { Trash2, Recycle, Zap, Leaf, Info, AlertTriangle, Package, FileText, Smartphone } from "lucide-react";

const guideItems = [
  {
    title: "Plastic",
    icon: Package,
    color: "bg-blue-100 text-blue-600",
    examples: ["Water bottles", "Food containers", "Detergent jugs"],
    instruction: "Rinse thoroughly to remove food residue. Check for recycling symbols (1-7).",
  },
  {
    title: "Paper & Cardboard",
    icon: FileText,
    color: "bg-amber-100 text-amber-600",
    examples: ["Newspapers", "Cereal boxes", "Mail", "Office paper"],
    instruction: "Keep dry. Flatten cardboard boxes. Remove plastic windows from envelopes.",
  },
  {
    title: "Organic",
    icon: Leaf,
    color: "bg-emerald-100 text-emerald-600",
    examples: ["Fruit peels", "Vegetable scraps", "Coffee grounds", "Eggshells"],
    instruction: "Compost at home if possible or use the green bin. No plastic bags.",
  },
  {
    title: "E-Waste",
    icon: Smartphone,
    color: "bg-red-100 text-red-600",
    examples: ["Old phones", "Batteries", "Chargers", "Laptops"],
    instruction: "Never throw in regular trash. Take to specialized collection points.",
  },
  {
    title: "Glass",
    icon: Info,
    color: "bg-indigo-100 text-indigo-600",
    examples: ["Glass bottles", "Jars", "Glass containers"],
    instruction: "Remove lids. Rinse. Separate by color if required locally.",
  },
  {
    title: "Metal",
    icon: Recycle,
    color: "bg-stone-100 text-stone-600",
    examples: ["Soda cans", "Food tins", "Aluminum foil"],
    instruction: "Rinse and dry. Crushing cans saves space in the recycling bin.",
  },
];

export default function Guide() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Waste Segregation Guide</h1>
        <p className="text-stone-500 max-w-2xl mx-auto">
          Understanding how to categorize your waste is the first step to effective recycling. 
          Follow these guidelines for a cleaner environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guideItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2rem] bg-white border border-stone-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">{item.title}</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Common Examples</h4>
                <div className="flex flex-wrap gap-2">
                  {item.examples.map(ex => (
                    <span key={ex} className="px-3 py-1 bg-stone-50 text-stone-600 text-xs font-medium rounded-full">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-50">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Disposal Instruction</h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {item.instruction}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-emerald-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4">Still Unsure?</h2>
          <p className="text-emerald-50 mb-8 text-lg">
            Our AI scanner can identify complex items and multi-material packaging that might be tricky to categorize.
          </p>
          <button className="px-8 py-4 bg-white text-emerald-600 rounded-full font-bold shadow-xl hover:bg-emerald-50 transition-all">
            Try AI Scanner
          </button>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="p-6 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
            <AlertTriangle className="mb-2 text-amber-300" />
            <h4 className="font-bold mb-1">Hazardous</h4>
            <p className="text-xs text-emerald-100">Paints, chemicals, and medical waste require special care.</p>
          </div>
          <div className="p-6 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
            <Recycle className="mb-2 text-blue-300" />
            <h4 className="font-bold mb-1">Check Labels</h4>
            <p className="text-xs text-emerald-100">Always look for recycling symbols on packaging.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
