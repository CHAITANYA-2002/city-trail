import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Compass, Sparkles, ChevronLeft } from "lucide-react";
import { type DayItinerary } from "@/data/jaipurItinerary";

interface ItineraryPreviewProps {
  plans: DayItinerary[];
  onBack: () => void;
  onViewMap: () => void;
  onOpenFull?: () => void;
}

export function ItineraryPreview({
  plans,
  onBack,
  onViewMap,
  onOpenFull,
}: ItineraryPreviewProps) {
  return (
    <div className="min-h-screen bg-heritage-sand flex flex-col overflow-hidden">
      <div className="px-8 pt-12 pb-8">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={onBack}
          className="flex items-center text-[10px] font-black text-primary uppercase tracking-[0.3em] italic mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
          Navigate Back
        </motion.button>

        <h1 className="font-serif text-4xl italic text-foreground mb-2">Curated Jaipur Odyssey</h1>
        <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] opacity-60">
          A bespoke day-wise voyage through the Pink City
        </p>
      </div>

      <div className="flex-1 px-8 space-y-8 overflow-y-auto pb-32 no-scrollbar">
        {plans.map((day, dIdx) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dIdx * 0.1, duration: 0.8 }}
            key={day.day} 
            className="bg-white rounded-[2.5rem] p-8 shadow-luxury border-2 border-primary/5 group hover:border-primary/20 transition-all"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-2xl italic text-foreground">
                  Day {day.day}: {day.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-10 h-0.5 bg-primary/20 rounded-full" />
                  <span className="text-[8px] font-black text-secondary uppercase tracking-widest opacity-40">Primary Phase</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 relative">
              {/* Timeline Connector */}
              <div className="absolute left-[1.1rem] top-2 bottom-2 w-px bg-dashed border-l border-primary/10" />
              
              {day.stops.map((stop, idx) => (
                <motion.div
                  whileHover={{ x: 5 }}
                  key={`${day.day}-${idx}`}
                  className="flex items-start gap-4 text-sm relative z-10"
                >
                  <div className="h-9 w-9 rounded-xl bg-foreground text-white flex items-center justify-center text-[10px] font-black shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-lg italic text-foreground leading-tight">{stop.title}</p>
                    {stop.time && (
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                         {stop.time} — Scheduled Visit
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 pt-4 bg-heritage-sand/80 backdrop-blur-xl border-t border-primary/5 space-y-3 z-50">
        {onOpenFull && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenFull}
            className="w-full h-14 bg-white border-2 border-primary/10 text-primary rounded-[1.5rem] font-black text-[10px] tracking-[0.2em] uppercase shadow-sm flex items-center justify-center gap-3"
          >
            <Sparkles className="w-4 h-4" /> Unfold Full Archive
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewMap}
          className="w-full h-16 bg-foreground text-white rounded-[2rem] font-black text-[11px] tracking-[0.4em] uppercase shadow-luxury relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
          <span className="relative z-10 flex items-center justify-center gap-4">
            View on Map <MapPin className="w-5 h-5 text-accent shadow-glow" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}
