import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Github, Twitter, Instagram } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl font-bold text-stone-900 mb-6">Get in Touch</h1>
          <p className="text-lg text-stone-600 mb-12 leading-relaxed">
            Have questions about waste segregation or want to partner with us? 
            We'd love to hear from you. Our team is dedicated to building a sustainable future.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Email Us</p>
                <p className="text-lg font-bold text-stone-800">hello@smartwaste.eco</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Call Us</p>
                <p className="text-lg font-bold text-stone-800">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Visit Us</p>
                <p className="text-lg font-bold text-stone-800">42 Sustainability Blvd, Green City</p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h4 className="text-sm font-bold text-stone-800 mb-6 uppercase tracking-widest">Follow Our Impact</h4>
            <div className="flex gap-4">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <button key={i} className="p-4 bg-white border border-stone-100 rounded-2xl text-stone-400 hover:text-emerald-600 hover:border-emerald-100 transition-all">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">First Name</label>
                <input type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Last Name</label>
                <input type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
              <input type="email" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Subject</label>
              <select className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>General Inquiry</option>
                <option>Partnership Proposal</option>
                <option>Technical Support</option>
                <option>Feedback</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Message</label>
              <textarea rows={5} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
              <Send size={18} />
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
