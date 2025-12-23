import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapView, COORDS } from "@/components/MapView";
import { useUserLocation } from "@/hooks/use-mobile-location";
import { useNavigate } from "react-router-dom";
import { JAIPUR_ITINERARY } from "@/data/jaipurItinerary";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { BottomSheet } from "@/components/BottomSheet";
import { Button } from "@/components/ui/button";
import type { Location, CategoryType } from "@shared/schema";

export default function MapPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showDaysPicker, setShowDaysPicker] = useState(false);

  const city = sessionStorage.getItem("selectedCity");
  const days = Number(sessionStorage.getItem("tripDays"));
  const exploreMode = (sessionStorage.getItem("exploreMode") as "map" | "itinerary") ?? "map";
  const location = useUserLocation();

  // City must be selected to show the map
  if (!city) return <Navigate to="/cities" />;

  // If user requested itinerary mode but tripDays is missing, send them to itinerary picker
  if (exploreMode === "itinerary" && (!days || !JAIPUR_ITINERARY[days])) {
    return <Navigate to="/itinerary" />;
  }

  const parsedCity = JSON.parse(city);

  // Determine center: prefer selected city, else first itinerary stop, else fallback to Jaipur
  const center: [number, number] = parsedCity
    ? [parsedCity.latitude, parsedCity.longitude]
    : (() => {
        const firstItin = JAIPUR_ITINERARY[days]?.[0];
        const firstStopTitle = firstItin?.stops?.[0]?.title;
        const coord = firstStopTitle ? COORDS[firstStopTitle] : undefined;
        return coord ?? [26.9124, 75.7873];
      })();

  /* ---------------- DATA: fetch city locations ---------------- */
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations", { cityId: parsedCity.id }],
    queryFn: async () => {
      const res = await fetch(`/api/locations?cityId=${parsedCity.id}`);
      if (!res.ok) throw new Error("Failed to fetch locations");
      return res.json();
    },
    enabled: !!parsedCity,
  });

  // Build combined locations list which includes actual locations plus itinerary stops (if days present)
  const combinedLocations: Location[] = (() => {
    const map = new Map<string, Location>();

    // Add real locations first
    for (const loc of locations) map.set(loc.name, loc);

    // Add itinerary stops for selected days (if any), or include all known itinerary places so users can search them while exploring
    const daysToInclude = days && JAIPUR_ITINERARY[days] ? [JAIPUR_ITINERARY[days]] : Object.values(JAIPUR_ITINERARY);
    daysToInclude.flat().forEach((day) => {
      day.stops.forEach((stop, idx) => {
        const coords = COORDS[stop.title];
        if (!coords) return;

        if (!map.has(stop.title)) {
          map.set(stop.title, {
            id: `itinerary-${day.day}-${idx}`,
            name: stop.title,
            description: stop.description || "",
            shortDescription: stop.description || null,
            category: inferCategoryFromTitle(stop.title) as any,
            cityId: parsedCity.id,
            latitude: coords[0],
            longitude: coords[1],
            imageUrl: null,
            gallery: [],
            rating: 4,
            reviewCount: 0,
            openingHours: null,
            closingHours: null,
            entryFee: null,
            address: null,
            phone: null,
            website: null,
            tags: [],
            isFeatured: false,
          });
        }
      });
    });

    return Array.from(map.values());
  })();

  function inferCategoryFromTitle(title: string) {
    const t = title.toLowerCase();
    if (t.includes("fort") || t.includes("palace") || t.includes("jantar") || t.includes("hawa")) return "history";
    if (t.includes("dinner") || t.includes("lunch") || t.includes("restaurant")) return "food";
    if (t.includes("bazaar") || t.includes("market") || t.includes("mall") || t.includes("shopping")) return "shopping";
    if (t.includes("garden") || t.includes("circle") || t.includes("park")) return "nature";
    return "popular";
  }

  /* ---------------- HANDLERS ---------------- */
  const handleLocationSelect = (loc: Location) => {
    setSelectedLocation(loc);
  };

  const handleCreateItinerary = () => {
    // If days already chosen, just go to itinerary
    if (days && JAIPUR_ITINERARY[days]) {
      sessionStorage.setItem("tripDays", String(days));
      sessionStorage.setItem("exploreMode", "itinerary");
      navigate("/itinerary");
      return;
    }

    // Otherwise open days picker
    setShowDaysPicker(true);
  };

  const chooseDaysAndGo = (d: number) => {
    sessionStorage.setItem("tripDays", String(d));
    sessionStorage.setItem("exploreMode", "itinerary");
    setShowDaysPicker(false);
    navigate("/itinerary");
  };

  return (
    <div className="relative h-screen">
      {/* BACK BUTTON: always go to Cities selection */}
      <button
        onClick={() => navigate("/cities")}
        className="absolute top-4 left-4 z-[1000] bg-white rounded-full p-2 shadow-md"
        aria-label="Back to city selection"
      >
        ←
      </button>

      {/* Search + Filters overlays */}
      <div className="absolute top-0 left-0 right-0 z-[1002] px-4 pt-4 pb-2">
        <SearchBar
          locations={combinedLocations}
          onSelectLocation={handleLocationSelect}
        />
      </div>

      <div className="absolute top-20 left-0 right-0 z-[1001]">
        <CategoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className="flex-1 pt-24">
        <MapView
          center={center}
          locations={combinedLocations}
          selectedCategory={selectedCategory}
          userLocation={location}
          onLocationSelect={handleLocationSelect}
          onLocateUser={() => window.scrollTo(0, 0)}
          mode={exploreMode}
          tripDays={exploreMode === "itinerary" ? days : days || undefined}
        />
      </div>

      {/* Create Itinerary CTA */}
      {exploreMode === "map" && (
        <div className="fixed bottom-6 left-4 right-4 z-[1000]">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Button className="flex-1" onClick={handleCreateItinerary}>
              Create My Itinerary
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Selected location sheet */}
      <BottomSheet isOpen={!!selectedLocation} onClose={() => setSelectedLocation(null)}>
        {selectedLocation && (
          <div className="pb-24">
            <h2 className="text-xl font-bold">{selectedLocation.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{selectedLocation.description}</p>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => {
                // If it's an itinerary synthetic location, navigate to itinerary with that day focused
                if (selectedLocation.id?.toString().startsWith("itinerary-")) {
                  const parts = selectedLocation.id.toString().split("-");
                  const dayNum = Number(parts[1]) || undefined;
                  if (dayNum) {
                    sessionStorage.setItem("tripDays", String(dayNum));
                  }
                  sessionStorage.setItem("exploreMode", "itinerary");
                }
                navigate("/itinerary");
              }}>See on Itinerary</Button>
              <Button variant="ghost" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`, "_blank")}>Navigate</Button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Days picker sheet */}
      <BottomSheet isOpen={showDaysPicker} onClose={() => setShowDaysPicker(false)}>
        <div className="pb-24">
          <h3 className="text-lg font-semibold mb-2">Choose days for your itinerary</h3>
          <p className="text-sm text-muted-foreground mb-4">We will generate a {"mapped"} itinerary for the selected number of days.</p>
          <div className="flex gap-3">
            {[1,2,3,4].map((d) => (
              <Button key={d} onClick={() => chooseDaysAndGo(d)} className="flex-1">{d} {d===1?"Day":"Days"}</Button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

