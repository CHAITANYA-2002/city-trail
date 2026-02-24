import { motion } from "framer-motion";
import { Compass, ArrowRight, Sparkles, Globe } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

// Beautiful Jaipur cityscape / heritage images for the background carousel
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1400&q=90", // Hawa Mahal
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1400&q=90", // Amber Fort
  "https://images.unsplash.com/photo-1598441916403-05e9c52a6855?w=1400&q=90", // Nahargarh
];

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-end px-8 pb-16 overflow-hidden bg-[#0C1218]">

      {/* Cinematic Background — Jaipur Hero Image */}
      <motion.div
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0 z-0"
      >
        <img
          src={HERO_IMAGES[0]}
          alt="Jaipur — The Pink City"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Multi-layer gradient for cinematic look */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1218] via-[#0C1218]/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1218]/40 via-transparent to-[#0C1218]/40" />
        {/* Warm terracotta color grading */}
        <div className="absolute inset-0 bg-[rgba(188,74,60,0.08)] mix-blend-multiply" />
      </motion.div>

      {/* Floating Image Accent — top right corner peek */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute top-8 right-8 z-10 hidden sm:block"
      >
        <div className="w-32 h-44 rounded-[2rem] overflow-hidden border-2 border-white/20 shadow-2xl rotate-3">
          <img
            src={HERO_IMAGES[1]}
            alt="Amber Fort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 rotate-[-12deg]">
              <Compass className="w-10 h-10 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-white/10 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-6xl font-serif text-white mb-4 tracking-tight drop-shadow-lg">
            City<span className="text-primary italic">Trail</span>
          </h1>
          <p className="text-lg text-white/80 font-sans leading-relaxed mb-12 max-w-sm mx-auto drop-shadow">
            Experience the heartbeat of India's most vibrant cities through curated paths and hidden wonders.
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { icon: Globe, label: "Heritage" },
            { icon: Sparkles, label: "Immersive" },
            { icon: Compass, label: "Expert Guided" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <item.icon className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <button
            onClick={onGetStarted}
            className="group w-full relative flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/40 transition-all active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            START YOUR JOURNEY
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-8 text-[11px] font-bold text-white/30 tracking-[0.2em] uppercase">
            Curated by Travel Connoisseurs
          </p>
        </motion.div>
      </div>

      {/* Bottom glow accent */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent z-0"
      />
    </div>
  );
}
