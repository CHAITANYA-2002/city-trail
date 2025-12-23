import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { DayItinerary } from "@/data/jaipurItinerary";

interface ItineraryPreviewProps {
  plans: DayItinerary[];
  onBack: () => void;
  onViewMap: () => void;
  onOpenFull?: () => void;
}

export function ItineraryPreview({
  plans,
  onBack,
  onViewMap,
  onOpenFull,
}: ItineraryPreviewProps) {
  return (
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-muted-foreground mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <h1 className="text-2xl font-semibold">Your Jaipur Itinerary</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Day-wise travel plan curated for you
        </p>
      </div>

      <div className="flex-1 px-4 space-y-6 overflow-y-auto pb-24">
        {plans.map((day) => (
          <div key={day.day} className="bg-white rounded-xl p-4 border">
            <h2 className="font-semibold mb-2">
              Day {day.day}: {day.title}
            </h2>

            <div className="space-y-2">
              {day.stops.map((stop, idx) => (
                <div
                  key={`${day.day}-${idx}`}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium">{stop.title}</p>
                    {stop.time && (
                      <p className="text-xs text-muted-foreground">
                        {stop.time}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t space-y-2">
        {onOpenFull && (
          <Button
            onClick={onOpenFull}
            variant="outline"
            className="w-full h-12 text-base font-semibold"
          >
            View Full Itinerary
          </Button>
        )}

        <Button
          onClick={onViewMap}
          className="w-full h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600"
        >
          <MapPin className="w-4 h-4 mr-2" />
          View on Map
        </Button>
      </div>
    </div>
  );
}
