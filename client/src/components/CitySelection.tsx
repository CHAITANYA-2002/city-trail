import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowLeft, Check, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col">
      {/* Header */}
      <header className="px-4 pt-4 pb-3">
        <button
          onClick={onBack}
          className="mb-3 flex items-center text-sm text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <h1 className="text-2xl font-semibold">Choose your city</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select a city to start exploring
        </p>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full bg-white"
          />
        </div>
      </header>

      {/* City List */}
      <main className="flex-1 px-4 space-y-3 overflow-y-auto pb-24">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-muted animate-pulse"
              />
            ))}
          </>
        ) : filteredCities.length > 0 ? (
          filteredCities.map((city, index) => {
            const isSelected = selectedCity?.id === city.id;

            return (
              <motion.button
                key={city.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCity(city)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                  isSelected
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isSelected
                        ? "bg-orange-500 text-white"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h2 className="font-medium">{city.name}</h2>
                      {city.isDefault && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {city.country}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <Check className="text-orange-500 w-5 h-5" />
                ) : (
                  <ChevronRight className="text-muted-foreground w-5 h-5" />
                )}
              </motion.button>
            );
          })
        ) : (
          <div className="py-16 text-center">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No cities found</p>
          </div>
        )}
      </main>

      {/* Bottom CTA */}
      {selectedCity && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t"
        >
          <Button
            onClick={() => onSelectCity(selectedCity)}
            className="w-full h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600"
          >
            Continue to {selectedCity.name}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
