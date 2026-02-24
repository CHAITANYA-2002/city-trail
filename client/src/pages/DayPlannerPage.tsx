import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Location } from "@shared/schema";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  Search,
  X,
  ChevronRight,
  Crown,
  Compass,
  Star,
  ChevronLeft,
  BookOpen
} from "lucide-react";
import { JAIPUR_ITINERARY, COORDS } from "@/data/jaipurItinerary";
import type { ItineraryStop } from "@/data/jaipurItinerary";
import { useTrip } from "@/contexts/TripContext";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PlannedDay {
  day: number;
  title: string;
  stops: ItineraryStop[];
}

// ─── All available stops (de-duped from every day plan) ─────────────────────

function getAllAvailableStops(): ItineraryStop[] {
  const seen = new Set<string>();
  const stops: ItineraryStop[] = [];
  Object.values(JAIPUR_ITINERARY).forEach((days) =>
    days.forEach((d) =>
      d.stops.forEach((s) => {
        if (!seen.has(s.title)) {
          seen.add(s.title);
          stops.push(s);
        }
      })
    )
  );
  return stops;
}

const ALL_STOPS = getAllAvailableStops();

// ─── Step 1 — Choose number of days (Heritage Style) ─────────────────────────

function StepChooseDays({
  onChoose,
}: {
  onChoose: (n: number) => void;
}) {
  return (
    <motion.div
      key="step-days"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div 
        initial={{ rotate: -10, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        className="w-24 h-24 rounded-[2rem] bg-primary/5 border-2 border-primary/10 flex items-center justify-center mb-10 shadow-sm"
      >
        <Calendar className="w-10 h-10 text-primary" />
      </motion.div>
      
      <h1 className="font-serif text-4xl italic text-foreground mb-4">The Duration of Your Odyssey</h1>
      <p className="font-black text-[10px] text-primary uppercase tracking-[0.4em] mb-12 max-w-xs leading-loose">
        Define the span of your curated Jaipur experience
      </p>

      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        {[1, 2, 3, 4].map((d) => (
          <motion.button
            key={d}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChoose(d)}
            className="group py-12 rounded-[3.5rem] border-2 border-primary/5 bg-white hover:border-accent hover:bg-accent/5 transition-all shadow-sm hover:shadow-luxury relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <span className="block text-5xl font-serif italic text-foreground group-hover:text-primary transition-colors mb-2">
              {d}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-secondary transition-colors">
              {d === 1 ? "Curated Day" : "Curated Days"}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Step 2 — Pick stops for a given day (Orchestration Style) ───────────────

function StepPickDay({
  day,
  totalDays,
  selected,
  onToggle,
  onNext,
  onBack,
}: {
  day: number;
  totalDays: number;
  selected: ItineraryStop[];
  onToggle: (stop: ItineraryStop) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const selectedTitles = new Set(selected.map((s) => s.title));

  const allTypes = useMemo(
    () => Array.from(new Set(ALL_STOPS.map((s) => s.type).filter(Boolean))) as string[],
    []
  );

  const filtered = useMemo(() => {
    return ALL_STOPS.filter((s) => {
      const matchesQ =
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description?.toLowerCase().includes(query.toLowerCase());
      const matchesType = !activeFilter || s.type === activeFilter;
      return matchesQ && matchesType;
    });
  }, [query, activeFilter]);

  return (
    <motion.div
      key={`step-day-${day}`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Cinematic header */}
      <div className="bg-foreground px-8 pt-10 pb-12 text-[#FDFBF7] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full translate-x-20 -translate-y-20 blur-3xl pointer-events-none" />
        
        <div className="relative flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Checkpoint {day}</span>
              <div className="flex-1 h-px bg-primary/20" />
            </div>
            <h2 className="font-serif text-3xl italic">Day {day} Portfolio</h2>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {selected.length === 0
                ? "Select the gems for your daily curation"
                : `${selected.length} Curated Discovery${selected.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          
          <div className="text-right shrink-0">
            <div className="flex gap-2 justify-end mb-3">
              {Array.from({ length: totalDays }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-700 ${
                    i + 1 === day ? "w-10 bg-primary shadow-[0_0_15px_rgba(188,74,60,0.5)]" : i + 1 < day ? "w-4 bg-primary/40" : "w-4 bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Curation Progress</p>
          </div>
        </div>
      </div>

      {/* Glassmorphic search + filters */}
      <div className="px-8 -mt-6 z-10 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[2rem] shadow-luxury pointer-events-none" />
          <div className="relative flex items-center p-1">
            <div className="pl-6 pr-3">
              <Search className="w-5 h-5 text-primary/40" />
            </div>
            <input
              type="text"
              placeholder="Search by monument, bazaar, or area..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent py-5 text-sm font-medium focus:outline-none placeholder:text-muted-foreground/30 placeholder:italic"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-3 mr-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1">
          <button
            onClick={() => setActiveFilter(null)}
            className={`shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
              !activeFilter
                ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/10"
                : "bg-white text-muted-foreground border-primary/5 hover:border-primary/20"
            }`}
          >
            All Destinations
          </button>
          {allTypes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveFilter(activeFilter === t ? null : t)}
              className={`shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                activeFilter === t
                  ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/10"
                  : "bg-white text-muted-foreground border-primary/5 hover:border-primary/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Heritage Stops List */}
      <div className="flex-1 overflow-y-auto px-8 py-2 space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key="empty"
              className="py-20 text-center"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-muted/30 flex items-center justify-center mx-auto mb-6">
                <Compass className="w-8 h-8 text-muted-foreground/20" />
              </div>
              <p className="font-serif text-lg italic text-muted-foreground">The horizons are empty for this search.</p>
            </motion.div>
          )}

          {filtered.map((stop, index) => {
            const isSelected = selectedTitles.has(stop.title);
            const hasCoords = !!COORDS[stop.title];

            return (
              <motion.button
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={stop.title}
                onClick={() => onToggle(stop)}
                className={`w-full text-left p-6 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden relative group ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-luxury"
                    : "border-primary/5 bg-white hover:border-primary/20"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
                )}
                
                <div className="relative flex items-start gap-5">
                  <div
                    className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                      isSelected
                        ? "bg-primary border-primary rotate-[-10deg]"
                        : "border-primary/20 bg-muted/10 group-hover:border-primary/40"
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4 text-white" /> : <div className="w-1 h-1 bg-primary/30 rounded-full" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-xl italic text-foreground truncate">
                        {stop.title}
                      </h3>
                      {stop.type && (
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-primary/5 text-primary rounded-full">
                          {stop.type}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 font-medium leading-relaxed">
                      {stop.description}
                    </p>

                    <div className="flex items-center gap-5">
                      {stop.area && (
                        <span className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest">
                          <MapPin className="w-3 h-3" /> {stop.area}
                        </span>
                      )}
                      {stop.duration && (
                        <span className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> {stop.duration} MIN
                        </span>
                      )}
                      {!hasCoords && (
                        <span className="ml-auto text-[10px] font-bold italic text-muted-foreground/30 flex items-center gap-1">
                          <Compass className="w-3 h-3" /> Non-Cartographical
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Glassmorphic Action Bar */}
      <div className="px-8 py-8 bg-heritage-sand/80 backdrop-blur-xl border-t border-primary/5 flex gap-4 shrink-0">
        <motion.button
          whileHover={{ x: -10 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-20 h-20 rounded-[2rem] bg-white border-2 border-primary/5 text-foreground flex items-center justify-center shadow-sm hover:border-primary/20 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-4 bg-foreground text-white rounded-[2.5rem] font-black text-[11px] tracking-[0.4em] uppercase shadow-luxury relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
          <span className="relative z-10 flex items-center gap-4">
            {day < totalDays ? (
              <>Orchestrate Day {day + 1} <ArrowRight className="w-5 h-5 text-accent" /></>
            ) : (
              <>Review Curated Journey <Sparkles className="w-5 h-5 text-accent" /></>
            )}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Step 3 — Review & confirm (Certificate Style) ───────────────────────────

function StepReview({
  plan,
  onConfirm,
  onBack,
}: {
  plan: PlannedDay[];
  onConfirm: () => void;
  onBack: () => void;
}) {
  const totalStops = plan.reduce((acc, d) => acc + d.stops.length, 0);

  return (
    <motion.div
      key="step-review"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex-1 flex flex-col overflow-hidden p-8"
    >
      <div className="flex-1 bg-white rounded-[4rem] shadow-luxury border-2 border-primary/5 overflow-hidden flex flex-col relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
        
        {/* Certificate Header */}
        <div className="p-10 text-center border-b border-primary/5 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-foreground text-accent mb-6 shadow-xl rotate-[-5deg]">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-4xl italic text-foreground mb-3">Odyssey Manifest</h2>
          <p className="font-black text-[10px] text-primary uppercase tracking-[0.5em] mb-4">Verification & Approval</p>
          <div className="flex items-center justify-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
            <span>{plan.length} CURATED DAYS</span>
            <span className="w-1 h-1 bg-primary/30 rounded-full" />
            <span>{totalStops} HANDPICKED GEMS</span>
          </div>
        </div>

        {/* Scrollable Summary */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
          {plan.map((dayPlan) => (
            <div key={dayPlan.day} className="relative pl-12">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-primary/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-4 border-white shadow-sm" />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="font-serif text-2xl italic text-primary">Day {dayPlan.day}</span>
                <div className="flex-1 h-px bg-primary/5" />
              </div>

              {dayPlan.stops.length === 0 ? (
                <div className="bg-primary/5 rounded-[2rem] p-6 text-center">
                  <p className="font-serif text-sm italic text-muted-foreground">A day preserved for serendipitous discovery.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dayPlan.stops.map((stop, i) => (
                    <div key={stop.title} className="flex items-center gap-6 group">
                      <span className="font-serif text-lg italic text-secondary group-hover:translate-x-1 transition-transform">{i + 1}.</span>
                      <div className="flex-1">
                        <p className="font-serif text-base text-foreground leading-tight italic">{stop.title}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                          {stop.area} {stop.duration && `• ${stop.duration} MIN`}
                        </p>
                      </div>
                      <Star className="w-4 h-4 text-accent/20 transition-all group-hover:text-accent group-hover:scale-125" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Final Actions */}
        <div className="p-10 bg-primary/5 border-t border-primary/10 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-10 py-6 rounded-[2rem] bg-white border border-primary/10 text-[10px] font-black uppercase tracking-widest shadow-sm"
          >
            Review Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-4 bg-foreground text-white py-6 rounded-[2rem] font-black text-[11px] tracking-[0.4em] uppercase shadow-luxury relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-primary translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-4">
              Authorize My Path <Check className="w-5 h-5 text-accent" />
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type Step =
  | { kind: "choose-days" }
  | { kind: "pick-day"; dayIndex: number }
  | { kind: "review" };

export default function DayPlannerPage() {
  const navigate = useNavigate();
  const { setDayPlan, setCustomItinerary, setExploreMode, setDays, city } = useTrip();

  if (!city) {
    return <Navigate to="/cities" replace />;
  }

  const { data: dbLocations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations", { cityId: city?.id }],
    queryFn: async () => {
      const res = await fetch(`/api/locations?cityId=${city?.id}`);
      if (!res.ok) throw new Error("Failed to fetch locations");
      return res.json();
    },
    enabled: !!city,
  });

  const [totalDays, setTotalDays] = useState<number>(0);
  const [step, setStep] = useState<Step>({ kind: "choose-days" });
  const [selections, setSelections] = useState<ItineraryStop[][]>([]);

  /* ── handlers ── */
  const chooseDays = (n: number) => {
    setTotalDays(n);
    setSelections(Array.from({ length: n }, () => []));
    setStep({ kind: "pick-day", dayIndex: 0 });
  };

  const toggleStop = (dayIndex: number, stop: ItineraryStop) => {
    setSelections((prev) => {
      const copy = prev.map((arr) => [...arr]);
      const day = copy[dayIndex];
      const exists = day.findIndex((s) => s.title === stop.title);
      if (exists >= 0) {
        day.splice(exists, 1);
      } else {
        day.push(stop);
      }
      return copy;
    });
  };

  const nextDay = (dayIndex: number) => {
    if (dayIndex + 1 < totalDays) {
      setStep({ kind: "pick-day", dayIndex: dayIndex + 1 });
    } else {
      setStep({ kind: "review" });
    }
  };

  const prevDay = (dayIndex: number) => {
    if (dayIndex === 0) {
      setStep({ kind: "choose-days" });
    } else {
      setStep({ kind: "pick-day", dayIndex: dayIndex - 1 });
    }
  };

  const confirmPlan = () => {
    const plan: PlannedDay[] = selections.map((stops, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      stops,
    }));

    const flatLocations = plan.flatMap((d) =>
      d.stops.map((stop) => {
        const coords = COORDS[stop.title] ?? [26.9124, 75.7873];
        return {
          id: `planner-${d.day}-${stop.title.replace(/\s+/g, "-")}`,
          name: stop.title,
          description: stop.description ?? "",
          shortDescription: stop.description ?? null,
          category: "popular",
          cityId: city?.id || "jaipur",
          latitude: coords[0],
          longitude: coords[1],
          imageUrl: dbLocations.find(l => l.name === stop.title)?.imageUrl || null,
          gallery: dbLocations.find(l => l.name === stop.title)?.gallery || [],
          rating: 4.5,
          reviewCount: 0,
          openingHours: stop.time ?? null,
          closingHours: null,
          entryFee: null,
          address: stop.area ?? null,
          phone: null,
          website: null,
          tags: [stop.type ?? ""],
          isFeatured: dbLocations.find(l => l.name === stop.title)?.isFeatured || false,
          plannerDay: d.day,
          duration: stop.duration,
        };
      })
    );

    setCustomItinerary(flatLocations as any);
    setDayPlan(plan);
    setExploreMode("custom");
    setDays(totalDays);

    navigate("/map");
  };

  return (
    <div className="flex flex-col h-screen bg-heritage-sand overflow-hidden">
      {/* Prestigious Toolbar */}
      <div className="px-8 pt-10 pb-6 bg-heritage-sand/40 backdrop-blur-xl border-b border-primary/5 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              step.kind === "choose-days"
                ? navigate(-1)
                : step.kind === "pick-day" && step.dayIndex === 0
                ? setStep({ kind: "choose-days" })
                : step.kind === "review"
                ? setStep({ kind: "pick-day", dayIndex: totalDays - 1 })
                : null
            }
            className="p-3 rounded-2xl bg-white border border-primary/10 shadow-sm hover:border-primary/30 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          
          <div>
            <h1 className="font-serif text-2xl italic leading-tight text-foreground">
              Journey Orchestrator
            </h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1 italic">Hand-crafting {city?.name || 'Your Odyssey'}</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-foreground text-accent p-3.5 rounded-2xl shadow-luxury flex items-center gap-3"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tiered Curation</span>
        </motion.div>
      </div>

      {/* Orchestration Stage */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step.kind === "choose-days" && (
            <StepChooseDays key="choose-days" onChoose={chooseDays} />
          )}

          {step.kind === "pick-day" && (
            <StepPickDay
              key={`pick-day-${step.dayIndex}`}
              day={step.dayIndex + 1}
              totalDays={totalDays}
              selected={selections[step.dayIndex] ?? []}
              onToggle={(stop) => toggleStop(step.dayIndex, stop)}
              onNext={() => nextDay(step.dayIndex)}
              onBack={() => prevDay(step.dayIndex)}
            />
          )}

          {step.kind === "review" && (
            <StepReview
              key="review"
              plan={selections.map((stops, i) => ({
                day: i + 1,
                title: `Day ${i + 1}`,
                stops,
              }))}
              onConfirm={confirmPlan}
              onBack={() =>
                setStep({ kind: "pick-day", dayIndex: totalDays - 1 })
              }
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Decorative Gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-heritage-sand to-transparent pointer-events-none z-0" />
    </div>
  );
}
