import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, ChevronRight, Sparkles } from "lucide-react";
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
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    >
      <Card 
        className="overflow-hidden cursor-pointer bg-white border-2 border-primary/5 hover:border-primary/20 shadow-sm hover:shadow-luxury transition-all rounded-[2.5rem]"
        onClick={onClick}
        data-testid={`card-location-${location.id}`}
      >
        <div className="flex gap-5 p-4">
          <div className="w-28 h-28 rounded-[2rem] bg-muted/20 flex-shrink-0 relative overflow-hidden group">
            {location.imageUrl ? (
              <img 
                src={location.imageUrl} 
                alt={location.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                <MapPin className="w-8 h-8 text-primary/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 
                  className="font-serif text-xl italic text-foreground line-clamp-1 leading-tight"
                  data-testid={`text-location-name-${location.id}`}
                >
                  {location.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {category && (
                  <Badge 
                    className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-primary/5 text-primary border-none rounded-full"
                  >
                    {category.name}
                  </Badge>
                )}
                
                {location.rating && (
                  <div className="flex items-center gap-1 text-[10px] font-black text-secondary uppercase tracking-widest">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    <span>{location.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {location.shortDescription && (
              <p className="text-xs text-muted-foreground line-clamp-1 font-medium italic">
                {location.shortDescription}
              </p>
            )}

            <div className="flex items-center gap-4 pt-1">
              {distance !== undefined && (
                <div className="flex items-center gap-1.5 text-[10px] font-black text-primary/40 uppercase tracking-widest">
                  <MapPin className="w-3 h-3" />
                  <span>{formatDistance(distance)}</span>
                </div>
              )}
              
              {location.openingHours && (
                <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
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
