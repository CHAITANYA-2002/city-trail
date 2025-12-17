import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, X, MapPin, Clock } from "lucide-react";
import type { Location } from "@shared/schema";

interface SearchBarProps {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
}

export function SearchBar({ locations, onSelectLocation }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const filteredLocations = query.length > 0
    ? locations.filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.description.toLowerCase().includes(query.toLowerCase()) ||
        loc.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];
  
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  
  const handleSelect = (location: Location) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== location.name);
      return [location.name, ...filtered].slice(0, 5);
    });
    onSelectLocation(location);
    setIsExpanded(false);
    setQuery("");
  };
  
  const handleClose = () => {
    setIsExpanded(false);
    setQuery("");
  };
  
  return (
    <>
      <div 
        className={`
          relative z-[1001] transition-all duration-300
          ${isExpanded ? 'fixed inset-0 bg-background' : ''}
        `}
      >
        <div className={`${isExpanded ? 'p-4' : ''}`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search places, food, attractions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className={`
                pl-12 pr-10 h-12 text-base
                ${isExpanded 
                  ? 'rounded-md' 
                  : 'rounded-full shadow-lg bg-background/95 backdrop-blur'
                }
              `}
              data-testid="input-search"
              aria-label="Search locations"
            />
            {isExpanded && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={handleClose}
                data-testid="button-close-search"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4"
              >
                {filteredLocations.length > 0 ? (
                  <div className="space-y-2">
                    {filteredLocations.map((location) => (
                      <Card
                        key={location.id}
                        className="p-3 cursor-pointer hover-elevate active-elevate-2 overflow-visible"
                        onClick={() => handleSelect(location)}
                        data-testid={`search-result-${location.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">
                              {location.name}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {location.shortDescription || location.address}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : query.length > 0 ? (
                  <div className="py-8 text-center">
                    <MapPin className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">No results found</p>
                  </div>
                ) : recentSearches.length > 0 ? (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</p>
                    <div className="space-y-1">
                      {recentSearches.map((search, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 rounded-md hover-elevate cursor-pointer"
                          onClick={() => setQuery(search)}
                        >
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Search className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">Start typing to search</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1000]"
          onClick={handleClose}
        />
      )}
    </>
  );
}
