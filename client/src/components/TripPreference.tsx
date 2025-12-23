import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Map, List } from "lucide-react";

interface TripPreferenceProps {
  cityName: string;
  onBack: () => void;
  onContinue: (data: {
    days: number | null;
    mode: "map" | "itinerary";
  }) => void;
}

export function TripPreference({
  cityName,
  onBack,
  onContinue,
}: TripPreferenceProps) {
  const [days, setDays] = useState<number | null>(null);
  const [mode, setMode] = useState<"map" | "itinerary" | null>(null);

  // allow map mode to continue even when days is not set
  const canContinue = mode === "map" || (days !== null && mode !== null);

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-muted-foreground mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <h1 className="text-2xl font-semibold">
          Plan your trip to {cityName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Answer a few questions to get started
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 space-y-8 mt-4">
        {/* Days Selection */}
        <div>
          <h2 className="text-lg font-medium mb-3">
            How many days are you visiting?
          </h2>

          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`py-3 rounded-xl border text-sm font-medium transition ${
                  days === d
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-200 bg-white"
                }`}
              >
                {d} {d === 1 ? "Day" : "Days"}
              </button>
            ))}
          </div>
        </div>

        {/* Explore Mode */}
        <div>
          <h2 className="text-lg font-medium mb-3">
            How would you like to explore?
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setMode("map")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition ${
                mode === "map"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <Map className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">Explore on my own</p>
                <p className="text-xs text-muted-foreground">
                  Browse all attractions freely on the map
                </p>
              </div>
            </button>

            <button
              onClick={() => setMode("itinerary")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition ${
                mode === "itinerary"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <List className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">Create an itinerary for me</p>
                <p className="text-xs text-muted-foreground">
                  Get a day-wise planned route
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="p-4 bg-white border-t"
      >
        <Button
          disabled={!canContinue}
          onClick={() =>
            onContinue({
              days: days ?? null,
              mode: mode!,
            })
          }
          className="w-full h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
