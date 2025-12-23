import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate } from "lucide-react";
import type { Location, CategoryType } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";
import { JAIPUR_ITINERARY, type ItineraryStop } from "@/data/jaipurItinerary";
import { DaySwitcher } from "@/components/DaySwitcher";

/* ---------------- TYPES ---------------- */

interface MapViewProps {
  center: [number, number];

  // explore mode
  locations?: Location[];
  selectedCategory?: CategoryType | null;
  userLocation?: [number, number] | null;
  onLocationSelect?: (location: Location) => void;
  onLocateUser?: () => void;

  // itinerary mode
  mode: "map" | "itinerary";
  tripDays?: number;
}

/* ---------------- COORDINATES ---------------- */

export const COORDS: Record<string, [number, number]> = {
  "Amber Fort": [26.9855, 75.8513],
  "Panna Meena Ka Kund": [26.9902, 75.8523],
  "Jal Mahal": [26.9535, 75.8466],
  "City Palace": [26.9258, 75.8237],
  "Jantar Mantar": [26.9249, 75.8246],
  "Hawa Mahal": [26.9239, 75.8267],
  "Nahargarh Fort": [26.9446, 75.812],
  "Jaigarh Fort": [26.9859, 75.8463],
  "Sisodia Rani Ka Bagh": [26.8728, 75.8469],
  "Galta Ji": [26.9149, 75.856],
  "Albert Hall Museum": [26.9124, 75.7873],
  "Patrika Gate": [26.8059, 75.8227],
  "Chokhi Dhani": [26.7745, 75.8443],
  "Masala Chowk": [26.9167, 75.8301],
  // Added shopping / day 4 stops
  "Bapu Bazaar": [26.9239, 75.8256],
  "World Trade Park": [26.9139, 75.7966],
  "Gaurav Tower": [26.9151, 75.7995],
  "Jawahar Circle": [26.9126, 75.8085],
};

/* ---------------- PIN ICON (SIDE LABEL) ---------------- */

const itineraryIcon = (num: number, title: string) =>
  L.divIcon({
    className: "",
    html: `
      <div style="display:flex;align-items:center;gap:8px">
        <div style="
          width:32px;height:32px;
          border-radius:50%;
          background:#f97316;
          color:white;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:600;
          border:2px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,.25)
        ">${num}</div>

        <div style="
          background:white;
          padding:6px 10px;
          border-radius:10px;
          font-size:13px;
          font-weight:500;
          white-space:nowrap;
          box-shadow:0 4px 14px rgba(0,0,0,.15)
        ">
          ${title}
        </div>
      </div>
    `,
    iconAnchor: [0, 18],
  });

/* ---------------- COMPONENT ---------------- */

export function MapView({
  center,
  locations = [],
  selectedCategory,
  userLocation,
  onLocationSelect,
  onLocateUser,
  mode,
  tripDays,
}: MapViewProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [route, setRoute] = useState<[number, number][]>([]);

  // Filters ONLY for explore mode
  const filteredLocations =
    mode === "map" && selectedCategory
      ? locations.filter((l) => l.category === selectedCategory)
      : locations;

  const itinerary = useMemo(() => {
    if (!tripDays) return [];
    return JAIPUR_ITINERARY[tripDays] ?? [];
  }, [tripDays]);

  const dayData = itinerary.find((d) => d.day === activeDay);

  /* -------- FETCH ROAD-FOLLOWING ROUTE -------- */

useEffect(() => {
  if (mode !== "itinerary" || !dayData) {
    setRoute([]);
    return;
  }

  // Precompute points here so TypeScript can narrow `dayData`
  const points = dayData.stops
    .map((s) => COORDS[s.title])
    .filter((p): p is [number, number] => Array.isArray(p));

  // Include user location at start and end if present
  const routingPoints: [number, number][] = [...points];
  if (userLocation) {
    routingPoints.unshift(userLocation);
    routingPoints.push(userLocation);
  }

  // If there are not enough points, clear any existing route and bail
  if (routingPoints.length < 2) {
    setRoute([]);
    return;
  }

  async function fetchRoute() {
    const query = routingPoints.map((p) => `${p[1]},${p[0]}`).join(";");

    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${query}?overview=full&geometries=geojson`
    );

    const json = await res.json();

    const coords = json.routes[0].geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]]
    );

    setRoute(coords);
  }

  fetchRoute();
}, [mode, dayData, userLocation]);

// Fit map to route or markers
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!positions || positions.length === 0) return;
    const bounds = L.latLngBounds(positions as any);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, positions]);
  return null;
}

// Category icon generator
const categoryIcon = (category: string | CategoryType | undefined, label = "") => {
  const cat = CATEGORIES.find((c) => c.id === category);
  const color = cat?.color ?? "#6b7280";

  return L.divIcon({
    className: "",
    html: `<div style="width:30px;height:30px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:600;border:2px solid white">${label}</div>`,
    iconAnchor: [15, 15],
  });
};

// Icon for user start/end
const userIcon = (text: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:34px;height:34px;border-radius:8px;background:#10b981;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;border:2px solid white">${text}</div>`,
    iconAnchor: [17, 17],
  });

  return (
    <div className="relative w-full h-full">
      {/* Day Switcher */}
      {mode === "itinerary" && itinerary.length > 0 && (
        <DaySwitcher
          totalDays={itinerary.length}
          activeDay={activeDay}
          onChange={setActiveDay}
        />
      )}

      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
      >
        {/* Clean, premium map theme (more saturated) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="saturated-tiles"
        />

        {/* Fit to route when present */}
        {mode === "itinerary" && route.length > 0 && <FitBounds positions={route} />}

        {/* Explore Mode Pins */}
        {mode === "map" &&
          filteredLocations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              eventHandlers={{
                click: () => onLocationSelect?.(loc),
              }}
              icon={categoryIcon(loc.category, (loc.name || "")[0])}
            />
          ))}

        {/* Itinerary Pins */}
        {mode === "itinerary" &&
          dayData?.stops.map((stop, i) => {
            const pos = COORDS[stop.title];
            if (!pos) return null;
            return (
              <Marker
                key={stop.title}
                position={pos}
                icon={itineraryIcon(i + 1, stop.title)}
              />
            );
          })}

        {/* User start/end markers when available */}
        {mode === "itinerary" && userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon("S")} />
            <Marker position={userLocation} icon={userIcon("E")} />
          </>
        )}

        {/* Route */}
        {mode === "itinerary" && route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#2563EB", // vibrant blue (Tailwind blue-600)
              weight: 6,
              opacity: 0.95,
              lineCap: "round",
            }}
          />
        )}

        {/* User Location */}
        {userLocation && <Marker position={userLocation} />}
      </MapContainer>

      {/* Locate Button (optional) */}
      {onLocateUser && (
        <button
          onClick={onLocateUser}
          className="absolute right-4 bottom-24 z-[1000]
                     bg-white rounded-full p-2 shadow-md"
        >
          <Locate className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
