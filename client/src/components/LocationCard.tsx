import { motion } from "framer-motion";
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
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
    >
      <div
        className="overflow-hidden cursor-pointer group relative rounded-[2.5rem] transition-all duration-500"
        style={{
          background: "rgba(253,251,247,0.80)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
          border: "1px solid rgba(255,255,255,0.40)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(212,175,55,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
        onClick={onClick}
        data-testid={`card-location-${location.id}`}
      >
        {/* Gold shimmer border on hover */}
        <div
          className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
          style={{ boxShadow: "0 0 0 1.5px rgba(212,175,55,0.3), 0 20px 50px rgba(0,0,0,0.14)" }}
        />

        <div className="flex gap-5 p-4">
          {/* Thumbnail */}
          <div
            className="w-28 h-28 rounded-[2rem] flex-shrink-0 relative overflow-hidden bg-muted"
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}
          >
            {location.imageUrl ? (
              <>
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                <span className="font-serif text-3xl italic text-primary opacity-40">{location.name[0]}</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3
                  className="font-serif text-xl italic text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors duration-300"
                  data-testid={`text-location-name-${location.id}`}
                >
                  {location.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                  <ChevronRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {category && (
                  <Badge className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-primary/5 text-primary border-none rounded-full">
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

            <div className="flex items-center gap-4 pt-1 flex-wrap">
              {distance !== undefined && (
                <div className="flex items-center gap-1.5 text-[10px] font-black text-primary/40 uppercase tracking-widest">
                  <MapPin className="w-3 h-3" />
                  <span>{formatDistance(distance)}</span>
                </div>
              )}
              {location.openingHours && (
                <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  <span>{location.openingHours}{location.closingHours ? ` – ${location.closingHours}` : ""}</span>
                </div>
              )}
              {(location as any).entryFee && (
                <div className="text-[9px] font-black text-secondary/50 uppercase tracking-widest">
                  {(location as any).entryFee?.split(",")[0]}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom gold accent on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)" }}
        />
      </div>
    </motion.div>
  );
}
