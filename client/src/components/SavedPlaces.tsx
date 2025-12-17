import { Heart, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SavedPlaces() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Heart className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">No Saved Places Yet</h2>
      <p className="text-center text-muted-foreground max-w-xs">
        Tap the heart icon on any location to save it here for quick access later.
      </p>
    </div>
  );
}
