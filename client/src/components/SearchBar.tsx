import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, X, MapPin, Clock, Globe, Loader2, Compass, Sparkles, Star, ChevronRight } from "lucide-react";
import type { Location } from "@shared/schema";

interface SearchBarProps {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
  cityContext?: string;
}

export function SearchBar({ locations, onSelectLocation, cityContext = "Jaipur" }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [externalResults, setExternalResults] = useState<any[]>([]);
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const internalResults = query.length > 0
    ? locations.filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.description.toLowerCase().includes(query.toLowerCase()) ||
        loc.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (query.length < 3) {
      setExternalResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingExternal(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + " " + cityContext)}&limit=5`
        );
        const data = await response.json();
        setExternalResults(data);
      } catch (error) {
        console.error("External search error:", error);
      } finally {
        setIsSearchingExternal(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [query, cityContext]);
  
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  
  const handleSelectInternal = (location: Location) => {
    addToRecent(location.name);
    onSelectLocation(location);
    setIsExpanded(false);
    setQuery("");
  };

  const handleSelectExternal = (res: any) => {
    addToRecent(res.display_name.split(",")[0]);
    
    const newLoc: Location = {
      id: `ext-${res.place_id}`,
      name: res.display_name.split(",")[0],
      description: res.display_name,
      shortDescription: res.type,
      category: "popular",
      cityId: "extern",
      latitude: parseFloat(res.lat),
      longitude: parseFloat(res.lon),
      imageUrl: null,
      gallery: [],
      rating: 4.0,
      reviewCount: 0,
      openingHours: null,
      closingHours: null,
      entryFee: null,
      address: res.display_name,
      phone: null,
      website: null,
      tags: [res.type, res.class],
      isFeatured: false,
    } as any;

    onSelectLocation(newLoc);
    setIsExpanded(false);
    setQuery("");
  };

  const addToRecent = (name: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== name);
      return [name, ...filtered].slice(0, 5);
    });
  };
  
  const handleClose = () => {
    setIsExpanded(false);
    setQuery("");
  };
  
  return (
    <>
      <div 
        className={`
          relative z-[1001] transition-all duration-500
          ${isExpanded ? 'fixed inset-0 bg-heritage-sand overflow-hidden' : 'w-full'}
        `}
      >
        <div className={`${isExpanded ? 'p-6 pt-12 sm:p-12' : ''}`}>
          <div className="relative group">
            {!isExpanded && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[2rem] shadow-luxury pointer-events-none transition-transform group-hover:scale-[1.02]" />
            )}
            
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 z-10 transition-colors ${isExpanded ? 'text-primary' : 'text-muted-foreground/40'}`} />
            
            <Input
              ref={inputRef}
              type="search"
              placeholder={`Unveil ${cityContext}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className={`
                pl-14 pr-12 h-16 text-base font-medium border-none focus-visible:ring-0 transition-all
                ${isExpanded 
                  ? 'rounded-[2.5rem] bg-white shadow-luxury' 
                  : 'rounded-[2rem] bg-transparent'
                }
              `}
            />
            
            {isExpanded && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-muted/10 rounded-full hover:bg-muted/20 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            )}
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="mt-12 pb-24 overflow-y-auto max-h-[calc(100vh-160px)] no-scrollbar"
              >
                <div className="max-w-2xl mx-auto space-y-12">
                  {/* Featured Results */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-2">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Heritage Discoveries</span>
                      <div className="flex-1 h-px bg-primary/10" />
                    </div>
                    
                    {internalResults.length > 0 ? (
                      <div className="grid gap-3">
                        {internalResults.map((location, idx) => (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={location.id}
                            onClick={() => handleSelectInternal(location)}
                            className="group p-5 bg-white rounded-[2rem] border-2 border-primary/5 hover:border-primary/20 cursor-pointer transition-all shadow-sm hover:shadow-luxury relative overflow-hidden"
                          >
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif text-xl italic text-foreground truncate">{location.name}</h4>
                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1 opacity-60 truncate">
                                  {location.shortDescription || location.address}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : query.length > 0 && !isSearchingExternal ? (
                      <div className="py-8 text-center bg-white/40 rounded-[2.5rem] border-2 border-dashed border-primary/10">
                        <p className="font-serif text-sm italic text-muted-foreground">No heritage matches for this query.</p>
                      </div>
                    ) : query.length === 0 && (
                      <p className="text-sm italic text-muted-foreground/40 px-2">Begin typing to uncover the city's gems...</p>
                    )}
                  </div>

                  {/* Web Horizons (Global Discovery) */}
                  {query.length >= 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 px-2">
                        <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Web Horizons (Global)</span>
                        <div className="flex-1 h-px bg-secondary/10" />
                        {isSearchingExternal && <Loader2 className="w-4 h-4 animate-spin text-secondary" />}
                      </div>
                      
                      <div className="grid gap-3">
                        {externalResults.map((res, idx) => (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={`ext-${idx}`}
                            onClick={() => handleSelectExternal(res)}
                            className="group p-5 bg-white rounded-[2rem] border-2 border-secondary/5 hover:border-secondary/20 cursor-pointer transition-all shadow-sm hover:shadow-luxury relative overflow-hidden"
                          >
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                <Globe className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif text-xl italic text-foreground truncate">{res.display_name.split(",")[0]}</h4>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60 truncate">
                                  {res.type?.replace(/_/g, ' ') || 'Point of Interest'} • {res.display_name.split(",").slice(1, 3).join(",")}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Odysseys */}
                  {query.length === 0 && recentSearches.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 px-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Recent Odysseys</span>
                        <div className="flex-1 h-px bg-muted/20" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, idx) => (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            key={idx}
                            onClick={() => setQuery(search)}
                            className="px-6 py-3 bg-white border-2 border-primary/5 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/20 hover:text-foreground transition-all flex items-center gap-2"
                          >
                            <Clock className="w-3 h-3" />
                            {search}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/40 backdrop-blur-md z-[1000]"
          onClick={handleClose}
        />
      )}
    </>
  );
}
