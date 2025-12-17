import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, ChevronRight } from "lucide-react";
import { CATEGORIES, type Location } from "@shared/schema";

interface LocationCardProps {
  location: Location;
  distance?: number;
  onClick: () => void;
}

export function LocationCard({ location, distance, onClick }: LocationCardProps) {
  const category = CATEGORIES.find(c => c.id === location.category);
  
  const formatDistance = (meters?: number) => {
    if (!meters) return null;
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      <Card 
        className="overflow-visible cursor-pointer hover-elevate active-elevate-2"
        onClick={onClick}
        data-testid={`card-location-${location.id}`}
      >
        <div className="flex gap-3 p-3">
          <div className="w-24 h-24 rounded-md bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0 relative overflow-hidden">
            {location.imageUrl ? (
              <img 
                src={location.imageUrl} 
                alt={location.name}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary/40" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 
                  className="font-semibold text-foreground line-clamp-1"
                  data-testid={`text-location-name-${location.id}`}
                >
                  {location.name}
                </h3>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>
              
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {category && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-1.5 py-0"
                    style={{ 
                      backgroundColor: `${category.color}15`,
                      color: category.color 
                    }}
                  >
                    {category.name}
                  </Badge>
                )}
                
                {location.rating && (
                  <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{location.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              {location.shortDescription && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {location.shortDescription}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {distance !== undefined && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{formatDistance(distance)}</span>
                </div>
              )}
              
              {location.openingHours && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{location.openingHours}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
