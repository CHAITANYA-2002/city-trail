import { motion } from "framer-motion";

interface DaySwitcherProps {
  totalDays: number;
  activeDay: number;
  onChange: (day: number) => void;
}

export function DaySwitcher({
  totalDays,
  activeDay,
  onChange,
}: DaySwitcherProps) {
  if (totalDays <= 1) return null;

  return (
    <div className="bg-white/40 backdrop-blur-2xl shadow-luxury rounded-[2rem] flex p-2 gap-2 border border-white/20 relative overflow-hidden">
      {/* Subtle Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]" />
      
      {Array.from({ length: totalDays }).map((_, i) => {
        const day = i + 1;
        const isActive = day === activeDay;
        
        return (
          <motion.button
            key={day}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(day)}
            className={`
              flex-1 py-3 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative overflow-hidden
              ${isActive 
                ? "bg-primary text-white shadow-glow border-none" 
                : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="daySwitcherGlow"
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
              />
            )}
            <span className="relative z-10">Day {day}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
