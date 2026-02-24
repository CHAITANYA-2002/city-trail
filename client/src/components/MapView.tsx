import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; 
import { Locate, Navigation, MapPin, Clock, Info, ExternalLink, ChevronRight, X, Compass as CompassIcon, Sparkles, Map as MapIcon, Crown, BookOpen, Loader2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Location, CategoryType } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";
import { JAIPUR_ITINERARY, COORDS } from "@/data/jaipurItinerary";
import { DaySwitcher } from "@/components/DaySwitcher";
import { useTrip } from "@/contexts/TripContext";
import { useToast } from "@/hooks/use-toast";

/* ---------------- HELPERS ---------------- */

// Custom premium marker - Compass Mode Heritage Style
const createCustomMarker = (loc: Location, active: boolean) => {
  const cat = CATEGORIES.find(c => c.id === loc.category);
  const color = cat?.color ?? "#BC4A3C";
  
  return L.divIcon({
    className: "custom-marker-compass",
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        transform: scale(${active ? 1.3 : 1}) translateY(${active ? '-10px' : '0'});
        filter: drop-shadow(0 ${active ? '12px 24px' : '4px 12px'} rgba(0,0,0,0.2));
      ">
        <div style="
          width: 52px;
          height: 52px;
          border-radius: 20px;
          background: #FDFBF7;
          border: 2px solid ${active ? "#D4AF37" : "rgba(188, 74, 60, 0.1)"};
          padding: 3px;
          box-shadow: inset 0 0 15px rgba(212, 175, 55, ${active ? 0.3 : 0});
          position: relative;
          overflow: hidden;
        ">
          <div style="
            width: 100%;
            height: 100%;
            border-radius: 14px;
            overflow: hidden;
            background: ${color}10;
          ">
            ${loc.imageUrl ? 
              `<img src="${loc.imageUrl}" style="width:100%;height:100%;object-fit:cover" />` : 
              `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:${color};font-weight:900;font-size:18px">${loc.name[0]}</div>`
            }
          </div>
          ${active ? `<div style="position:absolute;top:0;left:0;right:0;bottom:0;border:2px solid #D4AF37;border-radius:18px;animation: pulse-gold 2s infinite"></div>` : ''}
        </div>
        
        <div style="
          margin-top: 8px;
          background: ${active ? "#1E272E" : "white"};
          color: ${active ? "#D4AF37" : "#1E272E"};
          padding: 5px 14px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 800;
          font-family: 'DM Sans', sans-serif;
          text-transform: capitalize;
          letter-spacing: 0.02em;
          white-space: nowrap;
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          border: 1px solid ${active ? "#D4AF37" : "rgba(0,0,0,0.05)"};
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        ">
          ${loc.name}
        </div>
      </div>
    `,
    iconAnchor: [26, 75],
    popupAnchor: [0, -75],
  });
};

const createGlobalDiscoveryMarker = (loc: Location, active: boolean) => {
  return L.divIcon({
    className: "global-marker-discovery",
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        transform: scale(${active ? 1.3 : 1});
        filter: drop-shadow(0 ${active ? '12px 24px' : '4px 12px'} rgba(44, 62, 80, 0.2));
      ">
        <div style="
          width: 44px;
          height: 44px;
          border-radius: 16px;
          background: #2C3E50;
          border: 2px solid ${active ? "#D4AF37" : "rgba(253, 251, 247, 0.2)"};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
          box-shadow: inset 0 0 10px rgba(212, 175, 55, ${active ? 0.3 : 0});
          position: relative;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          ${active ? `<div style="position:absolute;inset:-6px;border:2px solid #D4AF37;border-radius:20px;animation: pulse-gold 2s infinite"></div>` : ''}
        </div>
        
        <div style="
          margin-top: 8px;
          background: ${active ? "#D4AF37" : "white"};
          color: ${active ? "white" : "#2C3E50"};
          padding: 4px 12px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 900;
          font-family: 'DM Sans', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          white-space: nowrap;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          border: 1px solid ${active ? "#D4AF37" : "rgba(0,0,0,0.05)"};
          backdrop-filter: blur(8px);
        ">
          ${loc.name}
        </div>
      </div>
    `,
    iconAnchor: [22, 65],
    popupAnchor: [0, -65],
  });
};

const itineraryIcon = (num: number, title: string, active: boolean, imageUrl?: string) =>
  L.divIcon({
    className: "itin-marker-heritage",
    html: `
      <div style="display:flex;align-items:center;gap:12px;pointer-events:none;transform:scale(${active ? 1.25 : 1}); transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)">
        <div style="
          width:46px;height:46px;
          border-radius:18px;
          background:${active ? "#1E272E" : "#BC4A3C"};
          color:${active ? "#D4AF37" : "#FDFBF7"};
          display:flex;
          flex-shrink: 0;
          align-items:center;
          justify-content:center;
          font-family: serif;
          font-size:20px;
          font-weight:bold;
          border:3.5px solid #D4AF37;
          box-shadow:0 15px 35px rgba(188, 74, 60, ${active ? 0.4 : 0.2});
          rotate: ${active ? '-10deg' : '0deg'};
          transition: all 0.5s ease;
          position: relative;
        ">
          ${num}
          ${active ? `<div style="position:absolute;inset:-6px;border:2px solid #D4AF37;border-radius:24px;animation: pulse-gold 2s infinite"></div>` : ''}
        </div>
        
        <div style="
          background: rgba(253, 251, 247, 0.98);
          padding: 4px 6px;
          padding-right: 18px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          border: 1.5px solid ${active ? "#D4AF37" : "rgba(212, 175, 55, 0.1)"};
          backdrop-filter: blur(12px);
          min-width: 140px;
        ">
          <div style="width:32px;height:32px;border-radius:12px;overflow:hidden;background:#BC4A3C10;flex-shrink:0">
            ${imageUrl ? 
              `<img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover" />` : 
              `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#BC4A3C;color:white;font-size:12px;font-weight:bold">${title[0]}</div>`
            }
          </div>
          <div style="display:flex;flex-direction:column">
            <span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;color:#1E272E;white-space:nowrap">${title}</span>
            <span style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#BC4A3C;opacity:0.6">${active ? 'Arriving Soon' : `Phase ${num}`}</span>
          </div>
        </div>
      </div>
    `,
    iconAnchor: [23, 23],
  });

function ChangeView({ center, zoom, force }: { center: [number, number], zoom?: number, force?: boolean }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || map.getZoom(), { animate: true, duration: 2, easeLinearity: 0.2 });
  }, [center, zoom, map, force]);
  return null;
}

function FitBounds({ positions, padding = [80, 80] }: { positions: [number, number][], padding?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!positions || positions.length === 0) return;
    const bounds = L.latLngBounds(positions as any);
    map.fitBounds(bounds, { padding: padding as any, maxZoom: 16, animate: true, duration: 2 });
  }, [map, positions, padding]);
  return null;
}

/* ---------------- MAIN COMPONENT ---------------- */

export function MapView({
  center: initialCenter,
  locations = [],
  selectedCategory,
  onLocationSelect,
  mode: initialMode,
  selectedLoc: externalSelectedLoc,
  onDiscoverySelected,
  cityName,
}: MapViewProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    userLocation, setUserLocation, 
    exploreMode, days, 
    customItinerary, dayPlan 
  } = useTrip();

  const [activeDay, setActiveDay] = useState(1);
  const [activeRoute, setActiveRoute] = useState<[number, number][]>([]);
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);

  // Sync with prop
  useEffect(() => {
    if (externalSelectedLoc) {
      setSelectedLoc(externalSelectedLoc);
    }
  }, [externalSelectedLoc]);

  // Memoize map view target to prevent reset loops during panning/zooming
  const mapTarget = useMemo(() => {
    if (selectedLoc) {
      return {
        center: [selectedLoc.latitude, selectedLoc.longitude] as [number, number],
        zoom: 16
      };
    }
    return {
      center: initialCenter,
      zoom: 13
    };
  }, [selectedLoc, initialCenter]);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentNavStop, setCurrentNavStop] = useState(0);
  const [discoveries, setDiscoveries] = useState<Location[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Track user location
  useEffect(() => {
    if (!navigator.geolocation) return;
    
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.warn("Location error:", err);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setUserLocation]);

  // Reset navigation when changing days or modes
  useEffect(() => {
    setIsNavigating(false);
    setCurrentNavStop(0);
    setSelectedLoc(null);
    setDiscoveries([]);
    setShowSearchArea(false);
  }, [activeDay, exploreMode]);

  const fetchAreaDiscoveries = async () => {
    if (!mapBounds) return;
    setIsDiscovering(true);
    setShowSearchArea(false);
    
    try {
      const west = mapBounds.getWest();
      const south = mapBounds.getSouth();
      const east = mapBounds.getEast();
      const north = mapBounds.getNorth();
      
      const query = selectedCategory 
        ? `${CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory} in ${cityName}`
        : "tourism";
      
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&bounded=1&viewbox=${west},${north},${east},${south}&limit=15`
      );
      const data = await res.json();
      
      const newLocs: Location[] = data.map((res: any) => ({
        id: `ext-${res.place_id}`,
        name: res.display_name.split(",")[0],
        description: res.display_name,
        shortDescription: res.type?.replace(/_/g, ' '),
        category: "popular",
        cityId: "extern",
        latitude: parseFloat(res.lat),
        longitude: parseFloat(res.lon),
        imageUrl: null,
        gallery: [],
        rating: 4.0,
        address: res.display_name,
        tags: [res.type, res.class],
      }));
      
      setDiscoveries(newLocs);
      toast({
        title: "Area Scouted",
        description: `Uncovered ${newLocs.length} nearby treasures.`,
      });
    } catch (e) {
      console.error("Discovery error:", e);
    } finally {
      setIsDiscovering(false);
    }
  };

interface MapEventsProps {
  onMoveEnd: (center: [number, number], bounds: L.LatLngBounds) => void;
  mapRef: React.MutableRefObject<L.Map | null>;
}

function MapEvents({ onMoveEnd, mapRef }: MapEventsProps) {
  const map = useMap();
  
  useEffect(() => {
    mapRef.current = map;
    onMoveEnd([map.getCenter().lat, map.getCenter().lng], map.getBounds());
  }, [map, mapRef, onMoveEnd]);

  useMapEvents({
    moveend: () => {
      onMoveEnd([map.getCenter().lat, map.getCenter().lng], map.getBounds());
    },
  });
  return null;
}

  const displayLocations = useMemo(() => {
    if (exploreMode === "map") {
      if (!selectedCategory) return locations;
      return locations.filter(l => l.category === selectedCategory);
    }
    return [];
  }, [exploreMode, locations, selectedCategory]);

  const itinerary = useMemo(() => {
    if (exploreMode === "itinerary" && days) {
      return JAIPUR_ITINERARY[days] ?? [];
    }
    return [];
  }, [exploreMode, days]);

  const currentDayData = useMemo(() => {
    if (exploreMode === "itinerary") {
      return itinerary.find(d => d.day === activeDay);
    }
    if (exploreMode === "custom") {
      return dayPlan.find(d => d.day === activeDay);
    }
    return null;
  }, [itinerary, dayPlan, activeDay, exploreMode]);

  const fetchRoute = useCallback(async (points: [number, number][]) => {
    if (points.length < 2) {
      setActiveRoute([]);
      setRouteInfo(null);
      return;
    }

    try {
      const query = points.map((p) => `${p[1]},${p[0]}`).join(";");
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${query}?overview=full&geometries=geojson`
      );
      const json = await res.json();
      
      if (json.routes && json.routes[0]) {
        const route = json.routes[0];
        const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
        setActiveRoute(coords);
        
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(1) + " km",
          duration: Math.round(route.duration / 60) + " min",
        });
      }
    } catch (e) {
      console.error("Routing error:", e);
    }
  }, []);

  useEffect(() => {
    if (exploreMode === "map") {
      if (selectedLoc && userLocation) {
        fetchRoute([userLocation, [selectedLoc.latitude, selectedLoc.longitude]]);
      } else {
        setActiveRoute([]);
        setRouteInfo(null);
      }
      return;
    }

    let points: [number, number][] = [];
    if (currentDayData) {
      points = currentDayData.stops
        .map(s => {
          if ('latitude' in s) return [s.latitude, s.longitude] as [number, number];
          return COORDS[s.title];
        })
        .filter((p): p is [number, number] => !!p);
      
      if (isNavigating && userLocation) {
        points = [userLocation, ...points.slice(currentNavStop)];
      }
    } else if (exploreMode === "custom" && customItinerary.length > 0) {
      points = customItinerary.map(l => [l.latitude, l.longitude] as [number, number]);
    }

    fetchRoute(points);
  }, [exploreMode, currentDayData, customItinerary, activeDay, userLocation, isNavigating, currentNavStop, selectedLoc, fetchRoute]);

  const handleLocate = () => {
    if (!userLocation) {
      toast({
        title: "Celestial Syncing...",
        description: "Aligning your coordinates with the stars...",
      });
      return;
    }
  };

  const startNavigation = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${userLocation ? `&origin=${userLocation[0]},${userLocation[1]}` : ''}`;
    window.open(url, "_blank");
  };

  return (
    <div className="relative w-full h-full bg-[#FDFBF7] overflow-hidden compass-mode">
      {/* Selected Location: Heritage Card */}
      <AnimatePresence>
        {selectedLoc && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-8 left-6 right-6 z-[2000] bg-white rounded-[3rem] p-6 shadow-luxury border-2 border-primary/10 max-w-lg mx-auto overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
            
            <div className="relative flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-primary/5 overflow-hidden shrink-0 border border-primary/10 shadow-sm transition-transform duration-700 group-hover:scale-105">
                {selectedLoc.imageUrl ? (
                  <img src={selectedLoc.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-serif text-3xl italic">
                    {selectedLoc.name[0]}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-2xl text-foreground leading-tight truncate italic">{selectedLoc.name}</h3>
                  <button onClick={() => setSelectedLoc(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  {selectedLoc.id.toString().startsWith('ext-') ? (
                    <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
                      <Globe className="w-3.5 h-3.5" />
                      Global Discovery
                    </div>
                  ) : routeInfo ? (
                    <div className="flex items-center gap-2 text-[10px] font-black text-secondary tracking-widest uppercase">
                      <Navigation className="w-3.5 h-3.5 fill-current" />
                      {routeInfo.duration} <span className="text-muted-foreground/40">•</span> {routeInfo.distance}
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{selectedLoc.category}</span>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => startNavigation(selectedLoc.latitude, selectedLoc.longitude)}
                    className="flex-1 bg-secondary text-white rounded-2xl py-4 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg shadow-secondary/20 active:scale-95 transition-all overflow-hidden relative group"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      NAVIGATE <CompassIcon className="w-3 h-3" />
                    </span>
                  </button>
                  <button 
                    onClick={() => onLocationSelect?.(selectedLoc)}
                    className="px-6 bg-primary/5 text-primary border border-primary/10 rounded-2xl py-4 text-[10px] font-black tracking-[0.1em] uppercase active:scale-95 transition-all"
                  >
                    DETAILS
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Instruction Overlay */}
      {isNavigating && currentDayData && (
        <div className="absolute top-32 left-8 right-8 z-[2000] max-w-lg mx-auto">
          <motion.div 
            layout
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-foreground/95 backdrop-blur-xl text-[#FDFBF7] rounded-[2.5rem] p-6 shadow-2xl flex items-center gap-6 border border-primary/20"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-serif text-2xl text-white shadow-lg rotate-[-8deg]">
                {currentNavStop + 1}
              </div>
              <div className="absolute -inset-1 border border-primary/30 rounded-2xl rotate-4 pointer-events-none" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Celestial Guidance</p>
              <h4 className="font-serif text-xl italic leading-tight truncate">
                {currentDayData.stops[currentNavStop]?.title || "The Final Sanctum"}
              </h4>
            </div>
            
            <button 
              onClick={() => {
                if (currentNavStop < currentDayData.stops.length - 1) {
                  setCurrentNavStop(s => s + 1);
                } else {
                  setIsNavigating(false);
                  toast({ title: "Odyssey Complete!", description: "You have arrived at your final curated destination." });
                }
              }}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90 border border-white/5"
            >
              <ChevronRight className="w-7 h-7 text-accent" />
            </button>
          </motion.div>
        </div>
      )}

      {/* Control Tools */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[1001] flex flex-col gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLocate}
          className="bg-[#FDFBF7]/90 backdrop-blur-xl rounded-[1.5rem] p-5 shadow-luxury border-2 border-primary/10 transition-all group pointer-events-auto"
        >
          <Locate className={`w-7 h-7 ${userLocation ? 'text-primary' : 'text-muted-foreground/40'} transition-colors`} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/itinerary')}
          className="bg-[#FDFBF7]/90 backdrop-blur-xl rounded-[1.5rem] p-5 shadow-luxury border-2 border-primary/10 transition-all group pointer-events-auto"
        >
          <BookOpen className="w-7 h-7 text-secondary transition-colors" />
        </motion.button>
      </div>

      {/* Search This Area Button */}
      <AnimatePresence>
        {showSearchArea && !isDiscovering && exploreMode === "map" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 z-[1001]"
          >
            <button
              onClick={fetchAreaDiscoveries}
              disabled={isDiscovering}
              className="bg-white/70 backdrop-blur-2xl border-2 border-primary/20 px-8 py-4 rounded-full shadow-luxury flex items-center gap-3 group transition-all hover:bg-white hover:border-primary disabled:opacity-50"
            >
              {isDiscovering ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <CompassIcon className="w-5 h-5 text-primary group-hover:rotate-180 transition-transform duration-700" />
              )}
              <span className="font-black text-[10px] text-foreground uppercase tracking-[0.3em]">
                {isDiscovering ? "Scouting..." : selectedCategory ? `Search for ${selectedCategory}` : "Search This Area"}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <MapContainer
        center={initialCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <MapEvents 
          onMoveEnd={(center, bounds) => {
            setMapCenter(center);
            setMapBounds(bounds);
            setShowSearchArea(true);
          }} 
          mapRef={mapRef} 
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
          className="heritage-tiles"
        />

        <ChangeView 
          center={mapTarget.center} 
          zoom={mapTarget.zoom}
          force={!!selectedLoc}
        />
        {activeRoute.length > 0 && <FitBounds positions={activeRoute} />}
        {displayLocations.length > 0 && !selectedLoc && <FitBounds positions={displayLocations.map(l => [l.latitude, l.longitude])} />}

        {/* User Presence */}
        {userLocation && (
          <>
            <Circle 
              center={userLocation} 
              radius={150} 
              pathOptions={{ fillColor: '#BC4A3C', fillOpacity: 0.1, color: '#BC4A3C', weight: 1 }} 
            />
            <Marker 
              position={userLocation} 
              icon={L.divIcon({ 
                className: 'user-marker-compass', 
                html: `
                  <div style="position:relative;width:24px;height:24px">
                    <div style="position:absolute;inset:-8px;background:rgba(188, 74, 60, 0.2);border-radius:50%;animation: pulse 2s infinite"></div>
                    <div style="width:100%;height:100%;background:#BC4A3C;border:4px solid #FDFBF7;border-radius:50%;box-shadow:0 0 20px rgba(188, 74, 60, 0.5)"></div>
                  </div>
                `
              })} 
            />
          </>
        )}

        {/* Compass & Global Discovery Markers */}
        {exploreMode === "map" &&
          displayLocations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              eventHandlers={{ click: () => setSelectedLoc(loc) }}
              icon={loc.id.toString().startsWith('ext-') 
                ? createGlobalDiscoveryMarker(loc, selectedLoc?.id === loc.id)
                : createCustomMarker(loc, selectedLoc?.id === loc.id)
              }
            />
          ))}

        {/* Floating Selected Focus (for locations not in displayLocations) */}
        {selectedLoc && !displayLocations.find(l => l.id === selectedLoc.id) && (
          <Marker
            position={[selectedLoc.latitude, selectedLoc.longitude]}
            icon={selectedLoc.id.toString().startsWith('ext-') 
              ? createGlobalDiscoveryMarker(selectedLoc, true)
              : createCustomMarker(selectedLoc, true)
            }
          />
        )}

        {/* Discovery Markers */}
        {discoveries.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={createGlobalDiscoveryMarker(loc, selectedLoc?.id === loc.id)}
            eventHandlers={{ click: () => {
              setSelectedLoc(loc);
              onDiscoverySelected?.(loc);
            }}}
          />
        ))}

        {/* Itinerary Heritage Markers */}
        {(exploreMode === "itinerary" || exploreMode === "custom") && currentDayData?.stops.map((stop, i) => {
          const lat = 'latitude' in stop ? stop.latitude : COORDS[stop.title]?.[0];
          const lng = 'longitude' in stop ? stop.longitude : COORDS[stop.title]?.[1];
          if (!lat || !lng) return null;

          // Find from full locations set (prop) to ensure image is found even if filtered
          const loc = locations.find(l => l.name === stop.title);
          
          return (
            <Marker
              key={`itin-${i}`}
              position={[lat, lng]}
              icon={itineraryIcon(i + 1, stop.title, selectedLoc?.id === loc?.id, loc?.imageUrl || undefined)}
              eventHandlers={{ click: () => {
                if (loc) {
                  setSelectedLoc(loc);
                  onLocationSelect?.(loc);
                }
              }}}
            />
          );
        })}

        {/* Heritage Route Path */}
        {activeRoute.length > 0 && (
          <Polyline
            positions={activeRoute}
            pathOptions={{
              color: isNavigating ? "#BC4A3C" : "#D4AF37",
              weight: 10,
              opacity: 0.9,
              lineCap: "round",
              lineJoin: "round",
              dashArray: isNavigating ? undefined : "1, 20",
            }}
          />
        )}
      </MapContainer>

      {/* Synchronized Itinerary Controller */}
      <AnimatePresence>
        {(exploreMode === "itinerary" || exploreMode === "custom") && !selectedLoc && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-12 left-0 right-0 z-[1001] px-8"
          >
            <div className="max-w-md mx-auto flex flex-col gap-6">
              <DaySwitcher
                totalDays={exploreMode === "itinerary" ? (days || 1) : dayPlan.length}
                activeDay={activeDay}
                onChange={setActiveDay}
              />
              
              {!isNavigating && (
                <button 
                  onClick={() => {
                    if (!userLocation) {
                      toast({ title: "Coordinate Error", description: "The stars cannot see you. Please enable GPS." });
                      return;
                    }
                    setIsNavigating(true);
                  }}
                  className="w-full relative group flex items-center justify-center gap-4 bg-foreground text-[#FDFBF7] py-7 rounded-[2.5rem] font-black text-[10px] tracking-[0.3em] overflow-hidden shadow-2xl transition-all active:scale-95"
                >
                  <div className="absolute inset-0 bg-primary translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 flex items-center gap-4 uppercase">
                    COMMENCE CURATED PATH <Sparkles className="w-4 h-4 text-accent" />
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent pointer-events-none z-[1000]" />
    </div>
  );
}

interface MapViewProps {
  center: [number, number];
  locations?: Location[];
  selectedCategory?: string | null;
  onLocationSelect?: (location: Location) => void;
  mode: "map" | "itinerary";
  selectedLoc?: Location | null;
  onDiscoverySelected?: (loc: Location) => void;
  cityName: string;
}


