import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Share2, 
  Star, 
  Clock, 
  IndianRupee, 
  MapPin, 
  Phone, 
  Globe, 
  Navigation,
  Heart,
  Sparkles,
  ChevronLeft
} from "lucide-react";
import { CATEGORIES, type Location } from "@shared/schema";

interface LocationDetailProps {
  location: Location;
  distance?: number;
  onBack: () => void;
  onNavigate: () => void;
  onExploreNearby?: () => void;
}

export function LocationDetail({ location, distance, onBack, onNavigate, onExploreNearby }: LocationDetailProps) {
  const category = CATEGORIES.find(c => c.id === location.category);
  
  const formatDistance = (meters?: number) => {
    if (!meters) return null;
    if (meters < 1000) {
      return `${Math.round(meters)}m away`;
    }
    return `${(meters / 1000).toFixed(1)}km away`;
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: location.name,
          text: location.shortDescription || location.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-heritage-sand flex flex-col overflow-hidden">
      {/* Cinematic Hero */}
      <div className="relative h-[45vh] min-h-[320px] bg-foreground overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="w-full h-full"
        >
          {location.imageUrl ? (
            <img 
              src={location.imageUrl} 
              alt={location.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
              <MapPin className="w-16 h-16 text-primary/20" />
            </div>
          )}
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-sand via-transparent to-black/20" />
        
        <header className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-10">
          <motion.button 
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center shadow-xl active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <div className="flex gap-3">
            <motion.button 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center shadow-xl transition-all"
            >
              <Heart className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center shadow-xl transition-all"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </header>

        {/* Categories Overlays */}
        <div className="absolute bottom-12 left-8 flex gap-2">
          {category && (
            <Badge 
              className="px-4 py-2 bg-primary text-white border-none rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-glow"
            >
              {category.name}
            </Badge>
          )}
          {location.isFeatured && (
            <Badge className="px-4 py-2 bg-accent text-foreground border-none rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Featured Discovery
            </Badge>
          )}
        </div>
      </div>
      
      <main className="flex-1 -mt-10 relative z-10 px-8 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-[3.5rem] p-8 sm:p-12 shadow-luxury border-2 border-primary/5"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
            <div className="flex-1">
              <h1 className="font-serif text-4xl italic text-foreground mb-3 leading-tight">
                {location.name}
              </h1>
              <div className="flex items-center gap-4 text-[10px] font-black text-secondary uppercase tracking-[0.3em] italic">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> {location.address || 'Central District'}
                </span>
                {distance !== undefined && (
                  <>
                    <span className="w-1 h-1 bg-primary/20 rounded-full" />
                    <span>{formatDistance(distance)}</span>
                  </>
                )}
              </div>
            </div>
            
            {location.rating && (
              <div className="flex flex-col items-center justify-center bg-accent/10 px-6 py-4 rounded-[2rem] border-2 border-accent/20 min-w-[100px]">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="font-serif text-2xl italic text-foreground">
                    {location.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-60">
                  {location.reviewCount || 0} Reviews
                </span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
            <div className="p-6 rounded-[2rem] bg-heritage-sand/50 border-2 border-primary/5 text-center transition-transform hover:scale-[1.02]">
              <Clock className="w-6 h-6 mx-auto mb-3 text-primary opacity-60" />
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Curation Hours</p>
              <p className="font-serif text-sm italic text-foreground">
                {location.openingHours && location.closingHours 
                  ? `${location.openingHours} — ${location.closingHours}`
                  : "Preserved Open"
                }
              </p>
            </div>
            
            <div className="p-6 rounded-[2rem] bg-heritage-sand/50 border-2 border-primary/5 text-center transition-transform hover:scale-[1.02]">
              <IndianRupee className="w-6 h-6 mx-auto mb-3 text-secondary opacity-60" />
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Access Fee</p>
              <p className="font-serif text-sm italic text-foreground">
                {location.entryFee || "Complimentary"}
              </p>
            </div>
            
            <div className="p-6 rounded-[2rem] bg-heritage-sand/50 border-2 border-primary/5 text-center transition-transform hover:scale-[1.02] col-span-2 sm:col-span-1">
              <Navigation className="w-6 h-6 mx-auto mb-3 text-accent opacity-60" />
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Proximity</p>
              <p className="font-serif text-sm italic text-foreground">
                {formatDistance(distance) || "Uncharted"}
              </p>
            </div>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">The Narrative</span>
              <div className="flex-1 h-px bg-primary/10" />
            </div>
            <p className="font-medium text-foreground leading-[1.8] italic text-lg decoration-primary/10">
              {location.description}
            </p>
          </div>
          
          {/* Gallery - Refined */}
          {location.gallery && location.gallery.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Visual Archive</span>
                <div className="flex-1 h-px bg-secondary/10" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {location.gallery.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="w-48 h-36 flex-shrink-0 rounded-[2rem] overflow-hidden bg-muted shadow-lg border-2 border-white"
                  >
                    <img 
                      src={img} 
                      alt={`${location.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-primary/5">
            {location.phone && (
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-[1rem] bg-primary/5 flex items-center justify-center text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Concierge</p>
                  <a href={`tel:${location.phone}`} className="font-serif text-base italic text-foreground hover:text-primary transition-colors">
                    {location.phone}
                  </a>
                </div>
              </div>
            )}
            
            {location.website && (
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-[1rem] bg-secondary/5 flex items-center justify-center text-secondary">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">External Archive</p>
                  <a href={location.website} target="_blank" rel="noopener noreferrer" className="font-serif text-base italic text-foreground hover:text-secondary transition-colors underline decoration-secondary/30">
                    Visit Official Portal
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
      
      {/* Prestige Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-8 pt-4 bg-heritage-sand/80 backdrop-blur-xl border-t border-primary/5 z-50">
        <div className="flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExploreNearby}
            className="flex-1 h-16 bg-white border-2 border-primary/20 text-primary rounded-[2rem] font-black text-[10px] tracking-[0.2em] uppercase shadow-lg flex items-center justify-center gap-3 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Sparkles className="w-4 h-4 text-accent" />
            Explore Nearby
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNavigate}
            className="flex-[1.5] h-16 bg-foreground text-white rounded-[2rem] font-black text-[11px] tracking-[0.4em] uppercase shadow-luxury relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-primary translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
            <span className="relative z-10 flex items-center justify-center gap-4">
              Authorize Route <Navigation className="w-5 h-5 text-accent shadow-glow" />
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
