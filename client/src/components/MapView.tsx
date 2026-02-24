import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, Navigation, MapPin, Clock, ExternalLink, ChevronRight, X, Compass as CompassIcon, Sparkles, Crown, BookOpen, Loader2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Location, CategoryType } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";
import { JAIPUR_ITINERARY, COORDS } from "@/data/jaipurItinerary";
import { DaySwitcher } from "@/components/DaySwitcher";
import { useTrip } from "@/contexts/TripContext";
import { useToast } from "@/hooks/use-toast";

/* ─────────────────────────────────────────────────────
   HELPERS  (defined at module level — never inside a component)
───────────────────────────────────────────────────── */

const createCustomMarker = (loc: Location, active: boolean) => {
  const cat = CATEGORIES.find(c => c.id === loc.category);
  const color = cat?.color ?? "#BC4A3C";
  const img = loc.imageUrl;
  return L.divIcon({
    className: "custom-marker-compass",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transition:all 0.5s cubic-bezier(0.23,1,0.32,1);transform:scale(${active ? 1.35 : 1}) translateY(${active ? "-12px" : "0"});filter:drop-shadow(0 ${active ? "16px 32px" : "4px 12px"} rgba(0,0,0,${active ? "0.35" : "0.18"}))">
        <div style="width:60px;height:60px;border-radius:22px;background:#FDFBF7;border:3px solid ${active ? "#D4AF37" : "rgba(255,255,255,0.9)"};box-shadow:${active ? "0 0 0 2px #D4AF37, 0 12px 40px rgba(212,175,55,0.4)" : "0 4px 20px rgba(0,0,0,0.15)"};position:relative;overflow:hidden">
          ${img
            ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;border-radius:18px" />`
            : `<div style="width:100%;height:100%;border-radius:18px;background:${color}20;display:flex;align-items:center;justify-content:center;color:${color};font-weight:900;font-size:22px">${loc.name[0]}</div>`
          }
          <div style="position:absolute;inset:0;border-radius:18px;background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.25))"></div>
          ${active ? `<div style="position:absolute;inset:0;border:2.5px solid #D4AF37;border-radius:18px;animation:pulse-gold 2s infinite"></div>` : ""}
        </div>
        <div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid ${active ? "#D4AF37" : "white"};margin-top:-1px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.15))"></div>
        <div style="margin-top:4px;background:${active ? "rgba(30,39,46,0.92)" : "rgba(255,255,255,0.92)"};color:${active ? "#D4AF37" : "#1E272E"};padding:4px 12px;border-radius:10px;font-size:10px;font-weight:900;font-family:'DM Sans',sans-serif;letter-spacing:0.03em;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,0.15);border:1px solid ${active ? "rgba(212,175,55,0.4)" : "rgba(0,0,0,0.06)"};backdrop-filter:blur(12px)">${loc.name}</div>
      </div>`,
    iconAnchor: [30, 95],
    popupAnchor: [0, -95],
  });
};

const createGlobalDiscoveryMarker = (loc: Location, active: boolean) =>
  L.divIcon({
    className: "global-marker-discovery",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transition:all 0.5s;transform:scale(${active ? 1.3 : 1});filter:drop-shadow(0 ${active ? "12px 24px" : "4px 12px"} rgba(44,62,80,0.2))">
        <div style="width:44px;height:44px;border-radius:16px;background:#2C3E50;border:2px solid ${active ? "#D4AF37" : "rgba(253,251,247,0.2)"};display:flex;align-items:center;justify-content:center;color:#D4AF37;box-shadow:inset 0 0 10px rgba(212,175,55,${active ? 0.3 : 0});position:relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          ${active ? `<div style="position:absolute;inset:-6px;border:2px solid #D4AF37;border-radius:20px;animation:pulse-gold 2s infinite"></div>` : ""}
        </div>
        <div style="margin-top:8px;background:${active ? "#D4AF37" : "white"};color:${active ? "white" : "#2C3E50"};padding:4px 12px;border-radius:10px;font-size:10px;font-weight:900;font-family:'DM Sans',sans-serif;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,0.1);border:1px solid ${active ? "#D4AF37" : "rgba(0,0,0,0.05)"};backdrop-filter:blur(8px)">${loc.name}</div>
      </div>`,
    iconAnchor: [22, 65],
    popupAnchor: [0, -65],
  });

const itineraryIcon = (num: number, title: string, active: boolean) =>
  L.divIcon({
    className: "itin-marker-heritage",
    html: `
      <div style="display:flex;align-items:center;gap:12px;pointer-events:none;transform:scale(${active ? 1.25 : 1});transition:transform 0.6s cubic-bezier(0.19,1,0.22,1)">
        <div style="width:46px;height:46px;border-radius:18px;background:${active ? "#1E272E" : "#BC4A3C"};color:${active ? "#D4AF37" : "#FDFBF7"};display:flex;flex-shrink:0;align-items:center;justify-content:center;font-family:serif;font-size:20px;font-weight:bold;border:3.5px solid #D4AF37;box-shadow:0 15px 35px rgba(188,74,60,${active ? 0.4 : 0.2});rotate:${active ? "-10deg" : "0deg"};transition:all 0.5s ease;position:relative">
          ${num}
          ${active ? `<div style="position:absolute;inset:-6px;border:2px solid #D4AF37;border-radius:24px;animation:pulse-gold 2s infinite"></div>` : ""}
        </div>
        <div style="background:rgba(253,251,247,0.98);padding:4px 6px;padding-right:18px;border-radius:20px;display:flex;align-items:center;gap:12px;box-shadow:0 15px 40px rgba(0,0,0,0.15);border:1.5px solid ${active ? "#D4AF37" : "rgba(212,175,55,0.1)"};backdrop-filter:blur(12px);min-width:140px">
          <div style="width:32px;height:32px;border-radius:12px;overflow:hidden;background:#BC4A3C10;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:#BC4A3C;color:white;font-size:12px;font-weight:bold">${title[0]}</div>
          <div style="display:flex;flex-direction:column">
            <span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;color:#1E272E;white-space:nowrap">${title}</span>
            <span style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#BC4A3C;opacity:0.6">${active ? "Arriving Soon" : `Phase ${num}`}</span>
          </div>
        </div>
      </div>`,
    iconAnchor: [23, 23],
  });

/* ─────────────────────────────────────────────────────
   HELPER MAP SUB-COMPONENTS  (module-level, not inside MapView)
───────────────────────────────────────────────────── */

function ChangeView({ center, zoom, force }: { center: [number, number]; zoom?: number; force?: boolean }) {
  const map = useMap();
  const lat = center[0];
  const lng = center[1];
  useEffect(() => {
    map.setView([lat, lng], zoom || map.getZoom(), { animate: true, duration: 1.5, easeLinearity: 0.25 });
  }, [lat, lng, zoom, map, force]);
  return null;
}

function FitBounds({ positions, padding = [80, 80] }: { positions: [number, number][]; padding?: [number, number] }) {
  const map = useMap();
  const serialized = JSON.stringify(positions);
  const px = padding[0];
  const py = padding[1];
  useEffect(() => {
    const pts = JSON.parse(serialized) as [number, number][];
    if (!pts || pts.length === 0) return;
    map.fitBounds(L.latLngBounds(pts), { padding: [px, py], maxZoom: 16, animate: true, duration: 1.5 });
  }, [map, serialized, px, py]);
  return null;
}

interface MapEventsProps {
  onMoveEnd: (center: [number, number], bounds: L.LatLngBounds) => void;
  mapRef: React.MutableRefObject<L.Map | null>;
}

function MapEvents({ onMoveEnd, mapRef }: MapEventsProps) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    const center = map.getCenter();
    onMoveEnd([center.lat, center.lng], map.getBounds());
  }, [map, mapRef, onMoveEnd]);
  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onMoveEnd([center.lat, center.lng], map.getBounds());
    },
  });
  return null;
}

/* ─────────────────────────────────────────────────────
   PROPS
───────────────────────────────────────────────────── */

interface MapViewProps {
  center: [number, number];
  locations?: Location[];
  selectedCategory?: string | null;
  onLocationSelect?: (location: Location | null) => void;
  mode: "map" | "itinerary";
  selectedLoc?: Location | null;
  onDiscoverySelected?: (loc: Location) => void;
  cityName: string;
}

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */

export function MapView({
  center: initialCenter,
  locations = [],
  selectedCategory,
  onLocationSelect,
  selectedLoc: externalSelectedLoc,
  onDiscoverySelected,
  cityName,
}: MapViewProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userLocation, setUserLocation, exploreMode, days, customItinerary, dayPlan } = useTrip();

  const [activeDay, setActiveDay] = useState(1);
  const [activeRoute, setActiveRoute] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentNavStop, setCurrentNavStop] = useState(0);
  const [discoveries, setDiscoveries] = useState<Location[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const mapTarget = useMemo(() => {
    if (externalSelectedLoc) {
      return { center: [externalSelectedLoc.latitude, externalSelectedLoc.longitude] as [number, number], zoom: 16 };
    }
    return { center: initialCenter, zoom: 13 };
  }, [externalSelectedLoc, initialCenter]);

  const displayLocations = useMemo(() => {
    if (exploreMode === "map") {
      if (!selectedCategory) return locations;
      return locations.filter(l => l.category === selectedCategory);
    }
    return [];
  }, [exploreMode, locations, selectedCategory]);

  const displayPositions = useMemo(
    () => displayLocations.map(l => [l.latitude, l.longitude] as [number, number]),
    [displayLocations]
  );

  const handleMoveEnd = useCallback((center: [number, number], bounds: L.LatLngBounds) => {
    setMapCenter(center);
    setMapBounds(bounds);
    setShowSearchArea(true);
  }, []);

  // Track user GPS location
  useEffect(() => {
    if (!navigator.geolocation) return;
    let lastUpdate = 0;
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const now = Date.now();
        if (now - lastUpdate > 5000) {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          lastUpdate = now;
        }
      },
      err => console.warn("Location error:", err),
      { enableHighAccuracy: false }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [setUserLocation]);

  // Reset nav state when switching day or mode
  useEffect(() => {
    setIsNavigating(false);
    setCurrentNavStop(0);
    onLocationSelect?.(null);
    setDiscoveries([]);
    setShowSearchArea(false);
  }, [activeDay, exploreMode, onLocationSelect]);

  const fetchAreaDiscoveries = async () => {
    if (!mapBounds) return;
    setIsDiscovering(true);
    setShowSearchArea(false);
    try {
      const { west, south, east, north } = {
        west: mapBounds.getWest(),
        south: mapBounds.getSouth(),
        east: mapBounds.getEast(),
        north: mapBounds.getNorth(),
      };
      const query = selectedCategory
        ? `${CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory} in ${cityName}`
        : "tourism";
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&bounded=1&viewbox=${west},${north},${east},${south}&limit=15`
      );
      const data = await res.json();
      const newLocs: Location[] = data.map((r: any) => ({
        id: `ext-${r.place_id}`,
        name: r.display_name.split(",")[0],
        description: r.display_name,
        shortDescription: r.type?.replace(/_/g, " "),
        category: "popular",
        cityId: "extern",
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        imageUrl: null,
        gallery: [],
        rating: 4.0,
        address: r.display_name,
        tags: [r.type, r.class],
      }));
      setDiscoveries(newLocs);
      toast({ title: "Area Scouted", description: `Uncovered ${newLocs.length} nearby treasures.` });
    } catch (e) {
      console.error("Discovery error:", e);
    } finally {
      setIsDiscovering(false);
    }
  };

  const itinerary = useMemo(() => {
    if (exploreMode === "itinerary" && days) return JAIPUR_ITINERARY[days] ?? [];
    return [];
  }, [exploreMode, days]);

  const currentDayData = useMemo(() => {
    if (exploreMode === "itinerary") return itinerary.find(d => d.day === activeDay);
    if (exploreMode === "custom") return dayPlan.find(d => d.day === activeDay);
    return null;
  }, [itinerary, dayPlan, activeDay, exploreMode]);

  const fetchRoute = useCallback(async (points: [number, number][]) => {
    if (points.length < 2) {
      setActiveRoute([]);
      setRouteInfo(null);
      return;
    }
    try {
      const query = points.map(p => `${p[1]},${p[0]}`).join(";");
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${query}?overview=full&geometries=geojson`
      );
      const json = await res.json();
      if (json.routes?.[0]) {
        const route = json.routes[0];
        setActiveRoute(route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]));
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
      if (externalSelectedLoc && userLocation) {
        fetchRoute([userLocation, [externalSelectedLoc.latitude, externalSelectedLoc.longitude]]);
      } else {
        setActiveRoute([]);
        setRouteInfo(null);
      }
      return;
    }
    let points: [number, number][] = [];
    if (currentDayData) {
      points = currentDayData.stops
        .map((s: any) => {
          if ("latitude" in s) return [s.latitude, s.longitude] as [number, number];
          return COORDS[s.title];
        })
        .filter((p): p is [number, number] => !!p);
      if (isNavigating && userLocation) points = [userLocation, ...points.slice(currentNavStop)];
    } else if (exploreMode === "custom" && customItinerary.length > 0) {
      points = customItinerary.map(l => [l.latitude, l.longitude] as [number, number]);
    }
    fetchRoute(points);
  }, [exploreMode, currentDayData, customItinerary, activeDay, userLocation, isNavigating, currentNavStop, externalSelectedLoc, fetchRoute]);

  const handleLocate = () => {
    if (!userLocation) {
      toast({ title: "Celestial Syncing...", description: "Aligning your coordinates with the stars..." });
    }
  };

  const startNavigation = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${userLocation ? `&origin=${userLocation[0]},${userLocation[1]}` : ""}`;
    window.open(url, "_blank");
  };

  return (
    <div className="relative w-full h-full bg-[#FDFBF7] overflow-hidden compass-mode">

      {/* ── GLASSMORPHISM RICH POPUP CARD ── */}
      <AnimatePresence>
        {externalSelectedLoc && (
          <motion.div
            key={externalSelectedLoc.id}
            initial={{ y: 120, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 120, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute bottom-6 left-4 right-4 z-[2000] max-w-lg mx-auto"
            style={{ perspective: "1000px" }}
          >
            <div
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/30"
              style={{
                background: "rgba(253,251,247,0.75)",
                backdropFilter: "blur(32px) saturate(1.6)",
                WebkitBackdropFilter: "blur(32px) saturate(1.6)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {/* Photo Hero Banner */}
              <div className="relative h-40 overflow-hidden">
                {externalSelectedLoc.imageUrl ? (
                  <img
                    src={externalSelectedLoc.imageUrl}
                    alt={externalSelectedLoc.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary via-primary to-foreground flex items-center justify-center">
                    <span className="font-serif text-7xl italic text-white/20">{externalSelectedLoc.name[0]}</span>
                  </div>
                )}
                {/* Top gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {/* Close Button */}
                <button
                  onClick={() => onLocationSelect?.(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center border border-white/30 transition-all active:scale-90"
                  style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)" }}
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Category pill */}
                {!externalSelectedLoc.id.toString().startsWith("ext-") && (
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] text-white border border-white/20"
                    style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)" }}
                  >
                    {CATEGORIES.find(c => c.id === externalSelectedLoc.category)?.name ?? externalSelectedLoc.category}
                  </div>
                )}

                {/* Name overlay on photo */}
                <div className="absolute bottom-3 left-5 right-12">
                  <h3 className="font-serif text-xl italic text-white leading-tight drop-shadow-lg line-clamp-1">
                    {externalSelectedLoc.name}
                  </h3>
                </div>
              </div>

              {/* Detail Body */}
              <div className="px-6 pt-4 pb-5">
                {/* Stats row */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {externalSelectedLoc.rating && (
                    <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                      <svg className="w-3 h-3 fill-accent text-accent" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <span className="text-[10px] font-black text-foreground">{externalSelectedLoc.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {externalSelectedLoc.openingHours && (
                    <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                      <Clock className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-black text-foreground">{externalSelectedLoc.openingHours}{externalSelectedLoc.closingHours ? ` – ${externalSelectedLoc.closingHours}` : ""}</span>
                    </div>
                  )}
                  {(externalSelectedLoc as any).entryFee && (
                    <div className="flex items-center gap-1.5 bg-secondary/5 px-3 py-1.5 rounded-full border border-secondary/10">
                      <span className="text-[10px] font-black text-secondary">{(externalSelectedLoc as any).entryFee}</span>
                    </div>
                  )}
                  {externalSelectedLoc.id.toString().startsWith("ext-") && (
                    <div className="flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
                      <Globe className="w-3 h-3" /> External Discovery
                    </div>
                  )}
                  {routeInfo && (
                    <div className="flex items-center gap-1.5 ml-auto text-[10px] font-black text-secondary">
                      <Navigation className="w-3 h-3 fill-current" />
                      {routeInfo.duration} · {routeInfo.distance}
                    </div>
                  )}
                </div>

                {/* Short description */}
                {externalSelectedLoc.shortDescription && (
                  <p className="text-xs text-muted-foreground/80 italic mb-4 leading-relaxed line-clamp-2">
                    {externalSelectedLoc.shortDescription}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  {/* Book Ride */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      startNavigation(externalSelectedLoc.latitude, externalSelectedLoc.longitude);
                    }}
                    className="flex-1 relative overflow-hidden rounded-2xl py-4 flex items-center justify-center gap-2 font-black text-[10px] tracking-[0.2em] uppercase text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #BC4A3C, #9B3830)" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-700" />
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Book Ride
                  </motion.button>

                  {/* Navigate */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startNavigation(externalSelectedLoc.latitude, externalSelectedLoc.longitude)}
                    className="flex-1 relative overflow-hidden rounded-2xl py-4 flex items-center justify-center gap-2 font-black text-[10px] tracking-[0.2em] uppercase border"
                    style={{
                      background: "rgba(30,39,46,0.06)",
                      borderColor: "rgba(30,39,46,0.12)",
                      color: "#1E272E",
                    }}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Navigate
                  </motion.button>

                  {/* Full Details */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onLocationSelect?.(externalSelectedLoc)}
                    className="w-14 rounded-2xl py-4 flex items-center justify-center border transition-all"
                    style={{
                      background: "rgba(212,175,55,0.08)",
                      borderColor: "rgba(212,175,55,0.25)",
                      color: "#D4AF37",
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Gold shimmer accent at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Guide Overlay */}
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
                {(currentDayData.stops[currentNavStop] as any)?.title || "The Final Sanctum"}
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

      {/* Side Controls */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[1001] flex flex-col gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLocate}
          className="bg-[#FDFBF7]/90 backdrop-blur-xl rounded-[1.5rem] p-5 shadow-luxury border-2 border-primary/10 transition-all group pointer-events-auto"
        >
          <Locate className={`w-7 h-7 ${userLocation ? "text-primary" : "text-muted-foreground/40"} transition-colors`} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/itinerary")}
          className="bg-[#FDFBF7]/90 backdrop-blur-xl rounded-[1.5rem] p-5 shadow-luxury border-2 border-primary/10 transition-all group pointer-events-auto"
        >
          <BookOpen className="w-7 h-7 text-secondary transition-colors" />
        </motion.button>
      </div>

      {/* Search Area Button */}
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

      {/* MAP */}
      <MapContainer center={initialCenter} zoom={13} className="h-full w-full" zoomControl={false}>
        <MapEvents onMoveEnd={handleMoveEnd} mapRef={mapRef} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap"
          className="heritage-tiles"
        />
        <ChangeView center={mapTarget.center} zoom={mapTarget.zoom} force={!!externalSelectedLoc} />
        {activeRoute.length > 0 && <FitBounds positions={activeRoute} />}
        {displayPositions.length > 0 && !externalSelectedLoc && <FitBounds positions={displayPositions} />}

        {/* User Location */}
        {userLocation && (
          <>
            <Circle center={userLocation} radius={150} pathOptions={{ fillColor: "#BC4A3C", fillOpacity: 0.1, color: "#BC4A3C", weight: 1 }} />
            <Marker
              position={userLocation}
              icon={L.divIcon({
                className: "user-marker-compass",
                html: `<div style="position:relative;width:24px;height:24px"><div style="position:absolute;inset:-8px;background:rgba(188,74,60,0.2);border-radius:50%;animation:pulse 2s infinite"></div><div style="width:100%;height:100%;background:#BC4A3C;border:4px solid #FDFBF7;border-radius:50%;box-shadow:0 0 20px rgba(188,74,60,0.5)"></div></div>`,
              })}
            />
          </>
        )}

        {/* Explore Markers */}
        {exploreMode === "map" &&
          displayLocations.map(loc => (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              eventHandlers={{ click: () => onLocationSelect?.(loc) }}
              icon={
                loc.id.toString().startsWith("ext-")
                  ? createGlobalDiscoveryMarker(loc, externalSelectedLoc?.id === loc.id)
                  : createCustomMarker(loc, externalSelectedLoc?.id === loc.id)
              }
            />
          ))}

        {/* Floating Selected Focus */}
        {externalSelectedLoc && !displayLocations.find(l => l.id === externalSelectedLoc.id) && (
          <Marker
            position={[externalSelectedLoc.latitude, externalSelectedLoc.longitude]}
            icon={
              externalSelectedLoc.id.toString().startsWith("ext-")
                ? createGlobalDiscoveryMarker(externalSelectedLoc, true)
                : createCustomMarker(externalSelectedLoc, true)
            }
          />
        )}

        {/* Discovery Markers */}
        {discoveries.map(loc => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={createGlobalDiscoveryMarker(loc, externalSelectedLoc?.id === loc.id)}
            eventHandlers={{ click: () => onDiscoverySelected?.(loc) }}
          />
        ))}

        {/* Itinerary Markers */}
        {(exploreMode === "itinerary" || exploreMode === "custom") &&
          currentDayData?.stops.map((stop: any, i: number) => {
            const lat = "latitude" in stop ? stop.latitude : COORDS[stop.title]?.[0];
            const lng = "longitude" in stop ? stop.longitude : COORDS[stop.title]?.[1];
            if (!lat || !lng) return null;
            const loc = locations.find(l => l.name === stop.title);
            return (
              <Marker
                key={`itin-${i}`}
                position={[lat, lng]}
                icon={itineraryIcon(i + 1, stop.title, externalSelectedLoc?.id === loc?.id)}
                eventHandlers={{ click: () => loc && onLocationSelect?.(loc) }}
              />
            );
          })}

        {/* Route */}
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

      {/* Itinerary Controller */}
      <AnimatePresence>
        {(exploreMode === "itinerary" || exploreMode === "custom") && !externalSelectedLoc && (
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
