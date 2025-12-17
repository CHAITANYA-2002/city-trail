import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, MapPin, ArrowLeft, Check } from "lucide-react";
import type { City } from "@shared/schema";

interface CitySelectionProps {
  cities: City[];
  isLoading: boolean;
  onSelectCity: (city: City) => void;
  onBack: () => void;
}

export function CitySelection({ cities, isLoading, onSelectCity, onBack }: CitySelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleConfirm = () => {
    if (selectedCity) {
      onSelectCity(selectedCity);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold" data-testid="text-city-selection-title">Select Your City</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-city"
          />
        </div>
      </header>
      
      <main className="flex-1 p-4 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredCities.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`relative overflow-visible cursor-pointer transition-all hover-elevate active-elevate-2 ${
                    selectedCity?.id === city.id 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : ''
                  }`}
                  onClick={() => setSelectedCity(city)}
                  data-testid={`card-city-${city.id}`}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-md relative">
                    {city.imageUrl ? (
                      <img 
                        src={city.imageUrl} 
                        alt={city.name}
                        className="w-full h-full object-cover rounded-t-md"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-primary/40" />
                      </div>
                    )}
                    
                    {city.isDefault && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-sm">
                        Featured
                      </span>
                    )}
                    
                    {selectedCity?.id === city.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground" data-testid={`text-city-name-${city.id}`}>
                      {city.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{city.country}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        {!isLoading && filteredCities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No cities found</p>
          </div>
        )}
      </main>
      
      {selectedCity && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg"
        >
          <Button 
            onClick={handleConfirm}
            className="w-full h-12 text-base font-semibold"
            data-testid="button-confirm-city"
          >
            Explore {selectedCity.name}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
