import { useNavigate, Navigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { JAIPUR_ITINERARY } from "@/data/jaipurItinerary";
import { MapPin, ArrowLeft, Clock, Trash2, Sparkles, Settings2, SearchX, BookOpen, Compass, ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrip } from "@/contexts/TripContext";
import { CATEGORIES, type CategoryType } from "@shared/schema";
import { CategoryFilters } from "@/components/CategoryFilters";
import { useQuery } from "@tanstack/react-query";
import { type Location } from "@shared/schema";

export default function ItineraryPage() {
  const navigate = useNavigate();
  const { 
    city, days, setDays, 
    exploreMode, setExploreMode, 
    customItinerary, dayPlan,
    removeLocation, reorderStops,
    selectedCategory, setSelectedCategory
  } = useTrip();

  const [showChangePlan, setShowChangePlan] = useState(false);

  const isCustomMode = exploreMode === "custom" || (dayPlan && dayPlan.length > 0);
  const aiPlans = (days && JAIPUR_ITINERARY[days]) ? JAIPUR_ITINERARY[days] : [];

  const { data: dbLocations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations", { cityId: city?.id }],
    queryFn: async () => {
      const res = await fetch(`/api/locations?cityId=${city?.id}`);
      if (!res.ok) throw new Error("Failed to fetch locations");
      return res.json();
    },
    enabled: !!city,
  });

  if (!city) {
    return <Navigate to="/cities" replace />;
  }

  const handleMoveStop = (dayIndex: number, stopIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? stopIndex - 1 : stopIndex + 1;
    reorderStops(dayIndex, stopIndex, toIndex);
  };

  function inferCategoryFromTitle(title?: string): CategoryType {
    const t = (title || "").toLowerCase();
    if (t.includes("fort") || t.includes("palace") || t.includes("jantar") || t.includes("hawa") || t.includes("monument") || t.includes("museum")) return "history";
    if (t.includes("dinner") || t.includes("lunch") || t.includes("restaurant") || t.includes("food") || t.includes("chowk")) return "food";
    if (t.includes("bazaar") || t.includes("market") || t.includes("mall") || t.includes("shopping")) return "shopping";
    if (t.includes("garden") || t.includes("circle") || t.includes("park")) return "nature";
    if (t.includes("temple") || t.includes("spiritiual") || t.includes("gate")) return "culture";
    return "popular";
  }

  const filteredDayPlan = useMemo(() => {
    if (!selectedCategory || !dayPlan) return dayPlan || [];
    return dayPlan.map(d => ({
      ...d,
      stops: d.stops.filter((s: any) => {
        const cat = s.type?.toLowerCase() || inferCategoryFromTitle(s.title);
        return cat === selectedCategory;
      })
    }));
  }, [dayPlan, selectedCategory]);

  const filteredCustomItin = useMemo(() => {
    if (!selectedCategory || !customItinerary) return customItinerary || [];
    return customItinerary.filter(l => l.category === selectedCategory);
  }, [customItinerary, selectedCategory]);

  const filteredAIPlans = useMemo(() => {
    if (!selectedCategory || !aiPlans) return aiPlans || [];
    return aiPlans.map(d => ({
      ...d,
      stops: d.stops.filter((s: any) => {
        const cat = s.type?.toLowerCase() || inferCategoryFromTitle(s.title);
        return cat === selectedCategory;
      })
    }));
  }, [aiPlans, selectedCategory]);

  const hasAnyResults = useMemo(() => {
    if (!selectedCategory) return true;
    if (isCustomMode) {
      return (filteredDayPlan?.some(d => d.stops.length > 0)) || (filteredCustomItin?.length > 0);
    }
    return (filteredAIPlans?.some(d => d.stops.length > 0)) || (filteredCustomItin?.length > 0);
  }, [isCustomMode, filteredDayPlan, filteredCustomItin, filteredAIPlans, selectedCategory]);

  const activePlan = isCustomMode ? filteredDayPlan : filteredAIPlans;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-48 selection:bg-primary/20">
      <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-primary/10">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate("/map")}
              className="group flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Manifest
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowChangePlan(true)}
              className="p-3 rounded-full hover:bg-primary/5 transition-colors text-primary"
            >
              <Settings2 className="w-5 h-5" />
            </motion.button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-baseline gap-3 mb-1">
              <h1 className="text-4xl font-serif text-foreground">
                The {isCustomMode ? <span className="text-primary italic">Curated</span> : <span className="text-primary italic">Legacy</span>} Trail
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">{city.name}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">• {activePlan.length} Chapters</span>
            </div>
          </motion.div>

          <div className="mt-8">
            <CategoryFilters />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-12">
        <AnimatePresence mode="wait">
          {!hasAnyResults ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="py-32 text-center">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <SearchX className="w-10 h-10 text-primary/30" />
              </div>
              <h3 className="text-3xl font-serif text-foreground mb-4">A Quiet Chapter</h3>
              <p className="text-muted-foreground font-sans max-w-xs mx-auto mb-10 leading-relaxed">
                Your current filters have veiled these paths. Reveal them by adjusting your categories.
              </p>
              <button onClick={() => setSelectedCategory(null)} className="px-8 py-4 bg-secondary text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-luxury">
                Reveal All Chapters
              </button>
            </motion.div>
          ) : (
            <motion.div key="content" className="space-y-24">
              {activePlan.map((day, dayIdx) => day.stops.length > 0 && (
                <motion.section 
                  key={`chapter-${day.day}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative"
                >
                  <div className="flex items-center gap-6 mb-12">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white font-serif text-3xl shadow-luxury rotate-[-8deg]">
                        {day.day}
                      </div>
                      <div className="absolute -inset-2 border border-primary/20 rounded-3xl rotate-6 pointer-events-none" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-serif text-foreground italic">{day.title || `Chapter ${day.day}`}</h2>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">The Curator's Selection</p>
                    </div>
                  </div>

                  {day.overview && !selectedCategory && (
                    <div className="mb-12 border-l-2 border-accent/30 pl-8">
                      <p className="text-lg font-serif italic text-muted-foreground/80 leading-relaxed">
                        "{day.overview}"
                      </p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {day.stops.map((stop: any, idx: number) => {
                      const stopTitle = stop.name || stop.title;
                      const stopCat = stop.type?.toLowerCase() || inferCategoryFromTitle(stopTitle);
                      const category = CATEGORIES.find(c => c.id === stopCat);
                      const dbMatch = dbLocations.find(l => l.name === stopTitle);

                      return (
                        <motion.div 
                          key={`${stopTitle}-${idx}`}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1, duration: 0.8 }}
                          className="group relative pl-12"
                        >
                          <div className="absolute left-4 top-0 bottom-0 w-px bg-primary/10 group-last:h-4" />
                          <div className="absolute left-2.5 top-4 w-3 h-3 rounded-full border-2 border-primary bg-[#FDFBF7] z-10" />

                          <div className="bg-white rounded-[2rem] border border-primary/5 overflow-hidden shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all duration-500 group">
                            {/* Location photo banner */}
                            {dbMatch?.imageUrl && (
                              <div className="relative h-36 overflow-hidden">
                                <img
                                  src={dbMatch.imageUrl}
                                  alt={stopTitle}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                                {/* Time badge on the image */}
                                {stop.time && (
                                  <div className="absolute bottom-3 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                                    {stop.time}
                                  </div>
                                )}
                                {/* Stop number badge */}
                                <div className="absolute top-3 left-4 w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-serif font-bold text-sm shadow-lg">
                                  {idx + 1}
                                </div>
                              </div>
                            )}

                            <div className="p-6">
                              <div className="flex justify-between items-start gap-4 mb-3">
                                <h3 className="text-xl font-serif text-foreground group-hover:text-primary transition-colors leading-tight">
                                  {stopTitle}
                                </h3>

                                {isCustomMode && (
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {idx > 0 && (
                                      <button onClick={() => handleMoveStop(dayIdx, idx, "up")} className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"><ArrowUp className="w-3.5 h-3.5" /></button>
                                    )}
                                    {idx < day.stops.length - 1 && (
                                      <button onClick={() => handleMoveStop(dayIdx, idx, "down")} className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"><ArrowDown className="w-3.5 h-3.5" /></button>
                                    )}
                                    <button onClick={() => removeLocation(stopTitle)} className="p-2 hover:bg-primary/10 rounded-full text-muted-foreground hover:text-primary transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                )}
                              </div>

                              <p className="text-sm font-sans text-muted-foreground/80 leading-relaxed mb-5 line-clamp-2 italic">
                                {stop.description || dbMatch?.shortDescription || "A chapter waiting to be experienced..."}
                              </p>

                              {stop.notes && (
                                <div className="mb-5 pl-3 border-l-2 border-accent/30">
                                  <p className="text-[11px] font-medium text-muted-foreground/70 italic leading-relaxed">
                                    ✦ {stop.notes}
                                  </p>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-3">
                                {category && (
                                  <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ backgroundColor: `${category.color}10`, color: category.color }}>
                                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: category.color }} />
                                    {category.name}
                                  </span>
                                )}
                                {stop.duration && (
                                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    <Clock className="w-3 h-3 text-accent" /> {stop.duration}m
                                  </span>
                                )}
                                {dbMatch?.entryFee && (
                                  <span className="ml-auto text-[9px] font-black text-secondary/50 uppercase tracking-widest">
                                    {dbMatch.entryFee}
                                  </span>
                                )}
                                {!dbMatch?.imageUrl && stop.time && (
                                  <span className="ml-auto text-[10px] font-black text-accent/40 uppercase tracking-[0.2em]">
                                    {stop.time}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              ))}

              {filteredCustomItin.length > 0 && (
                <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-secondary/5 rounded-[3rem] p-10 border border-secondary/10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white shadow-lg">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-serif text-secondary italic">Personal Epilogues</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {filteredCustomItin.map((stop, idx) => (
                      <div key={`gem-${idx}`} className="flex items-center gap-6 p-0 bg-white rounded-3xl border border-secondary/5 group hover:border-secondary/20 transition-all overflow-hidden">
                        {stop.imageUrl ? (
                          <div className="w-20 h-20 shrink-0 overflow-hidden bg-muted">
                            <img src={stop.imageUrl} alt={stop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 shrink-0 bg-secondary/10 flex items-center justify-center text-secondary font-black text-xl rounded-l-3xl">{idx + 1}</div>
                        )}
                        <div className="flex-1 min-w-0 py-4">
                          <h3 className="font-serif text-lg text-foreground mb-1 truncate">{stop.name}</h3>
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest truncate">{stop.address || stop.category}</p>
                        </div>
                        <div className="pr-5">
                          <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${stop.latitude},${stop.longitude}`, "_blank")} className="px-5 py-2.5 rounded-full border border-secondary/20 text-[10px] font-black text-secondary uppercase tracking-widest hover:bg-secondary hover:text-white transition-all active:scale-95">Path</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showChangePlan && (
          <div className="fixed inset-0 z-[100] bg-[#0C1218]/80 backdrop-blur-md flex items-end justify-center px-4 pb-8">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="w-full max-w-md bg-[#FDFBF7] rounded-[3rem] shadow-2xl overflow-hidden p-10">
              <div className="w-12 h-1.5 bg-primary/10 rounded-full mx-auto mb-10" />
              <h3 className="text-3xl font-serif text-foreground mb-2">Diary Settings</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-12">Rewrite your journey</p>
              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Temporal Alignment</p>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4].map((d) => (
                      <button key={d} onClick={() => { setDays(d); setExploreMode("itinerary"); setShowChangePlan(false); }} className={`flex-1 py-5 rounded-3xl text-sm font-black transition-all duration-300 ${d === days && exploreMode === 'itinerary' ? 'bg-primary text-white shadow-luxury' : 'bg-white border-2 border-primary/5 text-muted-foreground'}`}>{d}D</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 'itinerary', title: 'Guided Legacy', subtitle: 'Optimized by local experts', icon: Sparkles, color: 'text-primary' },
                    { id: 'custom', title: 'Personal Curated', subtitle: 'A hand-crafted roadmap', icon: BookOpen, color: 'text-secondary' }
                  ].map((mode) => (
                    <button key={mode.id} onClick={() => { setExploreMode(mode.id as any); setShowChangePlan(false); }} className={`w-full p-6 rounded-[2.5rem] border-2 text-left flex items-center gap-6 transition-all duration-300 ${exploreMode === mode.id ? 'border-primary bg-primary/5' : 'border-primary/5'}`}>
                      <div className={`h-12 w-12 rounded-2xl bg-white border border-primary/10 flex items-center justify-center ${mode.color}`}><mode.icon className="w-6 h-6" /></div>
                      <div>
                        <p className="text-lg font-serif italic text-foreground leading-tight">{mode.title}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{mode.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="pt-6 space-y-4">
                  <button onClick={() => navigate('/cities')} className="w-full py-6 bg-white border-2 border-primary/10 text-primary rounded-[2rem] font-black text-[10px] tracking-[0.2em] active:scale-95 transition-all uppercase">Reselect Sanctum</button>
                  <button onClick={() => setShowChangePlan(false)} className="w-full py-6 bg-foreground text-white rounded-[2rem] font-black text-[10px] tracking-[0.2em] active:scale-95 transition-all uppercase shadow-luxury">Continue Journey</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent pointer-events-none z-30" />
    </div>
  );
}
