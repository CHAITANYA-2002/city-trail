import { motion } from "framer-motion";
import { Compass, ArrowRight, Sparkles, Globe } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-end px-8 pb-16 overflow-hidden bg-[#0C1218]">
      {/* Cinematic Background Layer */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/images/welcome-bg.png" 
          alt="Cinematic Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1218] via-[#0C1218]/40 to-transparent" />
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
            <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 rotate-12 rotate-[-12deg]">
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
          <h1 className="text-6xl font-serif text-white mb-4 tracking-tight">
            City<span className="text-primary italic">Trail</span>
          </h1>
          <p className="text-lg text-white/70 font-sans leading-relaxed mb-12 max-w-sm mx-auto">
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
            { icon: Compass, label: "Expert Guided" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <item.icon className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{item.label}</span>
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
            className="group w-full relative flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl transition-all active:scale-95 overflow-hidden"
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

      {/* Bottom Visual Accent */}
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent z-0"
      />
    </div>
  );
}
