import { useState, useMemo, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapView } from "@/components/MapView";
import { useNavigate } from "react-router-dom";
import { JAIPUR_ITINERARY, COORDS } from "@/data/jaipurItinerary";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { LocationDetail } from "@/components/LocationDetail";
import { BottomSheet } from "@/components/BottomSheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, List, Sparkles, Map as MapIcon, Compass, Crown, MapPin, ChevronLeft, BookOpen, Globe, Loader2 } from "lucide-react";
import type { Location, CategoryType } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";
import { useTrip } from "@/contexts/TripContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function MapPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    city, days, setDays, 
    exploreMode, setExploreMode,
    selectedCategory, setSelectedCategory,
    addLocation, customItinerary, dayPlan
  } = useTrip();

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showDaysPicker, setShowDaysPicker] = useState(false);
  const [globalDiscoveries, setGlobalDiscoveries] = useState<Location[]>([]);
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);

  // Redirect if no city is selected
  if (!city) return <Navigate to="/cities" />;

  /* ---------------- DATA: fetch city locations ---------------- */
  const { data: dbLocations = [], isLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations", { cityId: city.id }],
    queryFn: async () => {
      const res = await fetch(`/api/locations?cityId=${city.id}`);
      if (!res.ok) throw new Error("Failed to fetch locations");
      return res.json();
    },
    enabled: !!city,
  });

  // Build combined locations list - Memoized to prevent re-render cascades
  const combinedLocations: Location[] = useMemo(() => {
    const locationsMap = new Map<string, Location>();

    // Add database locations first
    dbLocations.forEach((loc) => {
      locationsMap.set(loc.name, loc);
    });

    // Helper to merge itinerary stops
    const mergeItineraryStops = (itinKey: string, dayPlans: any[]) => {
      dayPlans.forEach((dayPlan) => {
        dayPlan.stops.forEach((stop: any, stopIndex: number) => {
          const stopTitle = stop.name || stop.title;
          const coords = COORDS[stopTitle];
          
          if (!coords || locationsMap.has(stopTitle)) return;

          const dbMatch = dbLocations.find(l => l.name === stopTitle);

          locationsMap.set(stopTitle, {
            id: `itin-${itinKey}-${dayPlan.day}-${stopIndex}`,
            name: stopTitle,
            description: dbMatch?.description || stop.description || "",
            shortDescription: dbMatch?.shortDescription || stop.description || null,
            category: dbMatch?.category || inferCategoryFromTitle(stopTitle),
            cityId: city.id,
            latitude: coords[0],
            longitude: coords[1],
            imageUrl: dbMatch?.imageUrl || null,
            gallery: dbMatch?.gallery || [],
            rating: dbMatch?.rating || 4.5,
            reviewCount: dbMatch?.reviewCount || 100,
            openingHours: dbMatch?.openingHours || stop.time || null,
            closingHours: dbMatch?.closingHours || null,
            entryFee: dbMatch?.entryFee || null,
            address: dbMatch?.address || stop.area || null,
            phone: dbMatch?.phone || null,
            website: dbMatch?.website || null,
            tags: dbMatch?.tags || [stop.type || ""],
            isFeatured: dbMatch?.isFeatured || false,
          } as Location);
        });
      });
    };

    if (days && JAIPUR_ITINERARY[days]) {
      mergeItineraryStops(String(days), JAIPUR_ITINERARY[days]);
    }

    if (dayPlan.length > 0) {
      mergeItineraryStops("custom", dayPlan);
    }

    customItinerary.forEach((loc: Location) => {
      if (!locationsMap.has(loc.name)) {
        locationsMap.set(loc.name, loc);
      }
    });

    return Array.from(locationsMap.values());
  }, [dbLocations, days, city.id, dayPlan, customItinerary]);

  function inferCategoryFromTitle(title: string): CategoryType {
    const t = title.toLowerCase();
    if (t.includes("fort") || t.includes("palace") || t.includes("jantar") || t.includes("hawa") || t.includes("monument") || t.includes("museum")) return "history";
    if (t.includes("dinner") || t.includes("lunch") || t.includes("restaurant") || t.includes("food") || t.includes("chowk")) return "food";
    if (t.includes("bazaar") || t.includes("market") || t.includes("mall") || t.includes("shopping")) return "shopping";
    if (t.includes("garden") || t.includes("circle") || t.includes("park")) return "nature";
    if (t.includes("temple") || t.includes("spiritiual") || t.includes("gate")) return "culture";
    return "popular";
  }

  const filteredList = useMemo(() => {
    const internal = !selectedCategory ? combinedLocations : combinedLocations.filter(l => l.category === selectedCategory);
    // Merge with global discoveries if any
    return [...internal, ...globalDiscoveries];
  }, [combinedLocations, selectedCategory, globalDiscoveries]);

  const fetchGlobalDiscoveries = async (category: CategoryType) => {
    setIsSearchingGlobal(true);
    try {
      const catName = CATEGORIES.find(c => c.id === category)?.name || category;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(catName + " in " + city.name)}&limit=12`
      );
      const data = await res.json();
      
      const newLocs: Location[] = data.map((res: any) => ({
        id: `ext-${res.place_id}`,
        name: res.display_name.split(",")[0],
        description: res.display_name,
        shortDescription: res.type?.replace(/_/g, ' '),
        category: category,
        cityId: "extern",
        latitude: parseFloat(res.lat),
        longitude: parseFloat(res.lon),
        imageUrl: null,
        gallery: [],
        rating: 4.2,
        reviewCount: 0,
        address: res.display_name,
        tags: [res.type, res.class],
      }));
      
      setGlobalDiscoveries(newLocs);
      toast({
        title: "Horizons Expanded",
        description: `Found ${newLocs.length} additional ${catName.toLowerCase()} treasures.`,
      });
    } catch (e) {
      console.error("Global discovery error:", e);
    } finally {
      setIsSearchingGlobal(false);
    }
  };

  // Reset global discoveries when category changes
  useEffect(() => {
    setGlobalDiscoveries([]);
  }, [selectedCategory]);

  const fetchNearbyDiscoveries = async (loc: Location) => {
    setIsSearchingGlobal(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=amenity in Jaipur&bounded=1&viewbox=${loc.longitude-0.01},${loc.latitude+0.01},${loc.longitude+0.01},${loc.latitude-0.01}&limit=10`
      );
      const data = await res.json();
      
      const newLocs: Location[] = data.map((res: any) => ({
        id: `ext-${res.place_id}`,
        name: res.display_name.split(",")[0],
        description: res.display_name,
        shortDescription: res.type?.replace(/_/g, ' '),
        category: "popular",
        cityId: "extern",
        latitude: parseFloat(res.lat),
        longitude: parseFloat(res.lon),
        imageUrl: null,
        gallery: [],
        rating: 4.1,
        address: res.display_name,
        tags: [res.type, res.class],
      }));
      
      setGlobalDiscoveries(newLocs);
      toast({
        title: "Perimeter Scouted",
        description: `Found ${newLocs.length} nearby points of interest.`,
      });
    } catch (e) {
      console.error("Nearby discovery error:", e);
    } finally {
      setIsSearchingGlobal(false);
    }
  };

  const handleDiscoverySelect = (loc: Location) => {
    setSelectedLocation(loc);
  };

  return (
    <div className="flex flex-col h-screen bg-heritage-sand overflow-hidden">
      {/* PRESTIGIOUS HEADER OVERLAY */}
      <div className="absolute top-0 left-0 right-0 z-[1001] pointer-events-none p-6 sm:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 pointer-events-auto">
          {/* Top Navbar */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-luxury border-2 border-primary/10 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            
            <div className="flex-1">
              <SearchBar
                locations={combinedLocations}
                onSelectLocation={setSelectedLocation}
                cityContext={city.name}
              />
            </div>

            <motion.button
              whileHover={{ rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/itinerary")}
              className="bg-foreground text-white rounded-2xl p-4 shadow-luxury border-2 border-white/10 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-accent" />
            </motion.button>
          </div>

          {/* Luxury Filters & Bridge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full flex flex-col items-center gap-4"
          >
            <CategoryFilters />
            
            <AnimatePresence>
              {selectedCategory && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => fetchGlobalDiscoveries(selectedCategory)}
                  disabled={isSearchingGlobal || globalDiscoveries.length > 0}
                  className="px-8 py-3 bg-white/40 backdrop-blur-xl border border-primary/10 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-primary hover:bg-primary hover:text-white transition-all shadow-luxury disabled:opacity-50 disabled:pointer-events-none flex items-center gap-3"
                >
                  {isSearchingGlobal ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Globe className="w-3.5 h-3.5" />
                  )}
                  {globalDiscoveries.length > 0 ? "Global Discoveries Active" : `Discover More ${selectedCategory} in ${city.name}`}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* COMPASS MAP CONTAINER */}
      <div className="flex-1 relative">
        <MapView
          center={[city.latitude, city.longitude]}
          locations={combinedLocations}
          selectedCategory={selectedCategory}
          onLocationSelect={setSelectedLocation}
          selectedLoc={selectedLocation}
          onDiscoverySelected={handleDiscoverySelect}
          cityName={city.name}
          mode={exploreMode === "itinerary" ? "itinerary" : "map"}
        />
        
        {/* Cinematic Loading */}
        {isLoading && (
          <div className="absolute inset-0 bg-heritage-sand/40 backdrop-blur-md z-[1000] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 p-10 rounded-[3rem] shadow-luxury flex flex-col items-center gap-6 border-2 border-primary/10"
            >
              <div className="relative">
                <Compass className="w-16 h-16 text-primary animate-spin-slow opacity-20" />
                <MapPin className="w-8 h-8 text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl italic text-foreground mb-1">Scouting {city.name}</p>
                <p className="font-black text-[10px] text-primary uppercase tracking-[0.4em]">Aligning Curated Gems</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Heritage Empty State */}
        {selectedCategory && filteredList.length === 0 && !isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-luxury border border-primary/20 flex flex-col items-center gap-4 text-center max-w-[280px]"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-heritage-sand flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="font-serif text-xl italic text-foreground mb-1">Untouched Territory</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-loose">
                  No curated gems matched this filter in {city.name}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* EXPLORE MODE: PRESTIGIOUS CTAS */}
      {exploreMode === "map" && !selectedLocation && (
        <div className="absolute bottom-12 left-8 right-8 z-[1000] pointer-events-none">
          <div className="max-w-md mx-auto flex flex-col gap-4 pointer-events-auto">
            <motion.button 
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-20 rounded-[2.5rem] bg-foreground border-2 border-white/10 text-white shadow-luxury flex items-center justify-center gap-4 active:scale-95 transition-all overflow-hidden relative group"
              onClick={() => navigate("/planner")}
            >
              <div className="absolute inset-0 bg-primary translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-4 font-black text-[11px] tracking-[0.3em] uppercase">
                <Crown className="w-5 h-5 text-accent" />
                Forge My Custom Journey
              </span>
            </motion.button>

            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full h-16 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border-2 border-primary/10 text-primary shadow-xl flex items-center justify-center gap-3"
              onClick={() => {
                if (days) {
                  setExploreMode("itinerary");
                  navigate("/itinerary");
                } else {
                  setShowDaysPicker(true);
                }
              }}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-black text-[10px] tracking-[0.2em] uppercase italic">Summon AI Heritage Route</span>
            </motion.button>
          </div>
        </div>
      )}

      {/* DURATION PICKER: HERITAGE SHEET */}
      <BottomSheet isOpen={showDaysPicker} onClose={() => setShowDaysPicker(false)}>
        <div className="pb-16 text-center px-8">
          <div className="w-16 h-1.5 bg-muted rounded-full mx-auto mb-10" />
          <h3 className="font-serif text-4xl italic text-foreground mb-3">Odyssey Duration</h3>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-12">
            Curating {city.name} for Your Eyes Only
          </p>
          
          <div className="grid grid-cols-2 gap-6 pb-4">
            {[1, 2, 3, 4].map((d) => (
              <motion.button
                key={d}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                 onClick={() => {
                   setDays(d);
                   setExploreMode("itinerary");
                   setShowDaysPicker(false);
                   navigate("/itinerary");
                 }}
                className="py-10 rounded-[3rem] border-2 border-muted bg-white hover:border-accent hover:bg-accent/5 transition-all font-serif group relative overflow-hidden shadow-sm hover:shadow-luxury"
              >
                <div className="absolute -top-4 -right-4 blur-2xl w-12 h-12 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="block text-5xl mb-2 text-foreground group-hover:text-primary transition-colors italic">{d}</span>
                <span className="text-muted-foreground group-hover:text-secondary font-black text-[10px] uppercase tracking-[0.3em]">{d === 1 ? "Curated Day" : "Curated Days"}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={!!selectedLocation} onClose={() => setSelectedLocation(null)}>
        {selectedLocation && (
          <LocationDetail 
            location={selectedLocation} 
            onBack={() => setSelectedLocation(null)}
            onNavigate={() => {
              toast({
                title: "Path Commencement",
                description: `Drafting prestigious route to ${selectedLocation.name}`,
              });
              setSelectedLocation(null);
            }}
            onExploreNearby={() => fetchNearbyDiscoveries(selectedLocation)}
          />
        )}
      </BottomSheet>

      {/* Elegant Bottom Shine */}
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-heritage-sand via-heritage-sand/80 to-transparent pointer-events-none z-[999]" />
    </div>
  );
}

