import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ArrowLeft, Check, Compass, Globe, Sparkles } from "lucide-react";
import type { City } from "@shared/schema";

interface CitySelectionProps {
  cities: City[];
  isLoading: boolean;
  onSelectCity: (city: City) => void;
  onBack: () => void;
}

export function CitySelection({
  cities,
  isLoading,
  onSelectCity,
  onBack,
}: CitySelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Decorative Heritage Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <header className="px-8 pt-12 pb-8 z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Gateway
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-5xl font-serif text-foreground mb-3 leading-tight">
            Where shall we <span className="text-primary italic">venture?</span>
          </h1>
          <p className="text-sm font-sans text-muted-foreground/80 max-w-sm leading-relaxed mb-8">
            Select a sanctuary of heritage and culture to begin your curated trail through the heart of India.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-[2rem] border border-border/50 group-focus-within:border-primary/30 transition-all overflow-hidden">
            <Search className="ml-6 w-5 h-5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-4 py-6 text-sm font-sans focus:outline-none placeholder:text-muted-foreground/40"
            />
          </div>
        </motion.div>
      </header>

      {/* Main Curator Gallery */}
      <main className="flex-1 px-8 pb-32 z-10">
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 rounded-[2.5rem] bg-muted/30 animate-pulse" />
            ))
          ) : filteredCities.length > 0 ? (
            filteredCities.map((city, index) => {
              const isSelected = selectedCity?.id === city.id;

              return (
                <motion.button
                  key={city.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                  onClick={() => setSelectedCity(city)}
                  className={`relative group w-full text-left rounded-[2.5rem] border-2 transition-all duration-700 overflow-hidden ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-2xl scale-[1.02]"
                      : "border-border/50 bg-white dark:bg-black/20 hover:border-primary/30 hover:-translate-y-2 hover:shadow-luxury"
                  }`}
                >
                  <div className="p-8 flex items-center gap-6">
                    {/* Visual Anchor */}
                    <div className={`shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-700 ${
                      isSelected 
                        ? "bg-primary text-white rotate-[-12deg] scale-110 shadow-xl shadow-primary/30" 
                        : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:rotate-6"
                    }`}>
                      {isSelected ? <Sparkles className="w-10 h-10" /> : <Globe className="w-8 h-8" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className={`text-2xl font-serif transition-colors duration-500 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {city.name}
                        </h2>
                        {city.isDefault && (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-accent/20 text-accent-foreground border border-accent/20">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-sans text-muted-foreground/60 uppercase tracking-[0.2em]">
                        {city.country}
                      </p>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>

                  {/* Subtle Background Pattern (Optional future expansion) */}
                  <div className="absolute bottom-0 right-0 opacity-[0.03] p-4">
                    <Compass className="w-32 h-32 rotate-12" />
                  </div>
                </motion.button>
              );
            })
          ) : (
            <div className="py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-serif text-muted-foreground">The trail is quiet...</h3>
              <p className="text-sm font-sans text-muted-foreground/50 mt-2">No sanctuaries match your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* Premium Floating Navigation */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed bottom-12 left-8 right-8 z-[1002]"
          >
            <button
              onClick={() => onSelectCity(selectedCity)}
              className="w-full relative group flex items-center justify-center gap-3 bg-secondary text-white py-7 rounded-[2.5rem] font-black text-sm tracking-[0.3em] overflow-hidden shadow-2xl transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-primary/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center gap-3">
                COMMENCE JOURNEY <ArrowLeft className="w-4 h-4 rotate-180" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[1001]" />
    </div>
  );
}
