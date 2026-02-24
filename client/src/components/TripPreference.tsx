import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Map, List, Sparkles, History as HistoryIcon, Utensils, ShoppingBag, TreePine, Landmark, Star, Gem, Calendar, Crown, Compass, Check } from "lucide-react";
import { useTrip } from "@/contexts/TripContext";
import { CATEGORIES } from "@shared/schema";

interface TripPreferenceProps {
  cityName: string;
  onBack: () => void;
  onContinue: () => void;
}

const INTERESTS = [
  ...CATEGORIES.map(c => ({ id: c.id, name: c.name, icon: c.icon }))
];

export function TripPreference({
  cityName,
  onBack,
  onContinue,
}: TripPreferenceProps) {
  const { days, setDays, exploreMode, setExploreMode, interests, setInterests } = useTrip();
  
  const toggleInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter(i => i !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  const getIcon = (name: string) => {
    const iconClass = "w-4 h-4";
    switch (name) {
      case "History": return <HistoryIcon className={iconClass} />;
      case "Food Trails": return <Utensils className={iconClass} />;
      case "Shopping": return <ShoppingBag className={iconClass} />;
      case "Nature": return <TreePine className={iconClass} />;
      case "Culture & Experiences": return <Landmark className={iconClass} />;
      case "Popular Places": return <Star className={iconClass} />;
      case "Hidden Gems": return <Gem className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  const canContinue = exploreMode === "map" || (days !== null && exploreMode !== null);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Heritage Accents */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="px-8 pt-12 pb-6 z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          SANCTUARY
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl font-serif text-foreground mb-2 leading-tight">
            Curate your <span className="text-primary italic">sojourn</span> in {cityName}
          </h1>
          <p className="text-sm font-sans text-muted-foreground/60 tracking-wider font-medium uppercase">
            Designed for the Discerning Traveler
          </p>
        </motion.div>
      </header>

      {/* Content */}
      <div className="flex-1 px-8 space-y-12 mt-4 overflow-y-auto pb-48 z-10 scrollbar-none">
        {/* Section: Duration */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif text-foreground flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              Temporal Span
            </h2>
            <span className="text-[9px] font-black tracking-widest text-accent uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20">Essential</span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`relative py-6 rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                  days === d
                    ? "border-primary bg-primary/5 shadow-luxury"
                    : "border-border/50 bg-white/50 dark:bg-black/10 hover:border-primary/30"
                }`}
              >
                <span className={`relative z-10 text-lg font-black tracking-tighter ${days === d ? 'text-primary' : 'text-muted-foreground'}`}>
                  {d}D
                </span>
                {days === d && (
                  <motion.div 
                    layoutId="day-accent"
                    className="absolute inset-0 bg-primary/5"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Section: Interests */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center gap-3">
            <Crown className="w-5 h-5 text-accent" />
            Vignettes & Interests
          </h2>
          <div className="flex flex-wrap gap-3">
            {INTERESTS.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-full border-2 text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                  interests.includes(interest.id)
                    ? "border-accent bg-accent/5 text-accent shadow-luxury"
                    : "border-border/50 bg-white/50 dark:bg-black/10 text-muted-foreground/80 hover:border-accent/30"
                }`}
              >
                {getIcon(interest.name)}
                {interest.name}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Section: Explore Mode */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center gap-3">
            <Compass className="w-5 h-5 text-secondary" />
            Guidance Mode
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {[
              { id: 'itinerary', title: 'The Guided Odyssey', desc: 'A meticulously curated, logic-driven path optimized by local experts.', icon: List, color: 'text-primary' },
              { id: 'custom', title: 'The Bespoke Curation', desc: 'Hand-craft your journey from a library of historic gems.', icon: Sparkles, color: 'text-secondary' },
              { id: 'map', title: 'The Free Wanderer', desc: 'Unstructured exploration at your own pace.', icon: Map, color: 'text-accent' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setExploreMode(mode.id as any)}
                className={`group relative flex items-center gap-8 p-8 rounded-[3rem] border-2 transition-all duration-700 overflow-hidden ${
                  exploreMode === mode.id
                    ? "border-primary bg-primary/5 shadow-2xl scale-[1.02]"
                    : "border-border/50 bg-white/50 dark:bg-black/10 hover:border-primary/30"
                }`}
              >
                <div className={`shrink-0 w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 ${
                  exploreMode === mode.id 
                    ? "bg-foreground text-white rotate-[-8deg] scale-110 shadow-xl shadow-foreground/30" 
                    : "bg-muted/50 text-muted-foreground"
                }`}>
                  <mode.icon className={`w-10 h-10 ${exploreMode === mode.id ? mode.color : ''}`} />
                </div>
                <div className="text-left flex-1">
                  <p className={`text-xl font-serif transition-colors ${exploreMode === mode.id ? 'text-foreground font-bold' : 'text-foreground font-medium'}`}>
                    {mode.title}
                  </p>
                  <p className="text-sm font-sans text-muted-foreground/60 mt-2 max-w-[240px] leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
                {exploreMode === mode.id && (
                  <motion.div 
                    layoutId="mode-check"
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-luxury"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Premium CTA Anchor */}
      <AnimatePresence>
        {canContinue && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-12 left-8 right-8 z-[1002]"
          >
            <button
              onClick={onContinue}
              className="w-full relative group flex items-center justify-center gap-4 bg-primary text-white py-7 rounded-[2.5rem] font-black text-sm tracking-[0.3em] overflow-hidden shadow-2xl transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center gap-4 uppercase">
                MANIFEST EXPERIENCE <Sparkles className="w-4 h-4" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[1001]" />
    </div>
  );
}
