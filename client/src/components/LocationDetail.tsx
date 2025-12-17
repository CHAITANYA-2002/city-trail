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
  Heart
} from "lucide-react";
import { CATEGORIES, type Location } from "@shared/schema";

interface LocationDetailProps {
  location: Location;
  distance?: number;
  onBack: () => void;
  onNavigate: () => void;
}

export function LocationDetail({ location, distance, onBack, onNavigate }: LocationDetailProps) {
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative h-[40vh] min-h-[280px] bg-gradient-to-br from-primary/30 to-accent/30">
        {location.imageUrl ? (
          <img 
            src={location.imageUrl} 
            alt={location.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-primary/40" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="bg-white/10 backdrop-blur-md text-white border-0"
            data-testid="button-back-detail"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-white/10 backdrop-blur-md text-white border-0"
              data-testid="button-favorite"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleShare}
              className="bg-white/10 backdrop-blur-md text-white border-0"
              data-testid="button-share"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </header>
      </div>
      
      <main className="flex-1 -mt-8 relative z-10">
        <div className="bg-background rounded-t-3xl px-4 pt-6 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h1 
                className="text-2xl font-bold text-foreground"
                data-testid="text-location-detail-name"
              >
                {location.name}
              </h1>
              
              {location.rating && (
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-amber-700 dark:text-amber-300">
                    {location.rating.toFixed(1)}
                  </span>
                  {location.reviewCount && (
                    <span className="text-sm text-muted-foreground">
                      ({location.reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {category && (
                <Badge 
                  variant="secondary"
                  style={{ 
                    backgroundColor: `${category.color}15`,
                    color: category.color 
                  }}
                >
                  {category.name}
                </Badge>
              )}
              
              {distance !== undefined && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  {formatDistance(distance)}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card className="p-3 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Hours</p>
                <p className="text-sm font-medium">
                  {location.openingHours && location.closingHours 
                    ? `${location.openingHours} - ${location.closingHours}`
                    : "Open 24hrs"
                  }
                </p>
              </Card>
              
              <Card className="p-3 text-center">
                <IndianRupee className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Entry Fee</p>
                <p className="text-sm font-medium">
                  {location.entryFee || "Free"}
                </p>
              </Card>
              
              <Card className="p-3 text-center">
                <Navigation className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="text-sm font-medium">
                  {formatDistance(distance) || "N/A"}
                </p>
              </Card>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {location.description}
              </p>
            </div>
            
            {location.address && (
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                </div>
              </div>
            )}
            
            {location.phone && (
              <div className="flex items-start gap-3 mb-3">
                <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a href={`tel:${location.phone}`} className="text-sm text-primary">
                    {location.phone}
                  </a>
                </div>
              </div>
            )}
            
            {location.website && (
              <div className="flex items-start gap-3 mb-3">
                <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a href={location.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary">
                    Visit Website
                  </a>
                </div>
              </div>
            )}
            
            {location.gallery && location.gallery.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Gallery</h2>
                <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {location.gallery.map((img, idx) => (
                    <div 
                      key={idx}
                      className="w-32 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted"
                    >
                      <img 
                        src={img} 
                        alt={`${location.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {location.tags && location.tags.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {location.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
        <Button 
          onClick={onNavigate}
          className="w-full h-12 text-base font-semibold gap-2"
          data-testid="button-get-directions"
        >
          <Navigation className="w-5 h-5" />
          Get Directions
        </Button>
      </div>
    </div>
  );
}
