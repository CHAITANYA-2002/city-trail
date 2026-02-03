import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { CitySelection } from "@/components/CitySelection";
import { TripPreference } from "@/components/TripPreference";
import { MapView } from "@/components/MapView";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { LocationCard } from "@/components/LocationCard";
import { LocationDetail } from "@/components/LocationDetail";
import { BottomSheet } from "@/components/BottomSheet";
import { BottomNavigation } from "@/components/BottomNavigation";
import { SavedPlaces } from "@/components/SavedPlaces";
import { RoutesTab } from "@/components/RoutesTab";
import { ProfileTab } from "@/components/ProfileTab";
import { ItineraryPreview } from "@/components/ItineraryPreview";
import { JAIPUR_ITINERARY } from "@/data/jaipurItinerary";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { List, Map as MapIcon, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { City, Location, CategoryType } from "@shared/schema";



type AppScreen = "welcome" | "city-selection" | "trip-preference" | "explore";
type ViewMode = "map" | "list";
type TabType = "explore" | "saved" | "itinerary" | "routes" | "profile";

/* ---------------- UTILS ---------------- */

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ---------------- MAIN ---------------- */

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>("welcome");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [tripDays, setTripDays] = useState<number | null>(null);
  const [exploreMode, setExploreMode] = useState<"map" | "itinerary" | null>(
    null
  );

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const [showLocationSheet, setShowLocationSheet] = useState(false);

  const navigate = useNavigate();

  /* ---------------- GEOLOCATION (FIXED) ---------------- */

  const geoWatchId = useRef<number | null>(null);

const handleLocateUser = useCallback(() => {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported");
    return;
  }

  if (geoWatchId.current !== null) return;

  geoWatchId.current = navigator.geolocation.watchPosition(
    (pos) => {
      // ignore very inaccurate readings
      if (pos.coords.accuracy > 50) return;

      setUserLocation([
        pos.coords.latitude,
        pos.coords.longitude,
      ]);
    },
    (err) => {
      console.error("Geolocation error:", err.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 15000, // smoother tracking
    }
  );
}, []);

useEffect(() => {
  handleLocateUser();

  return () => {
    if (geoWatchId.current !== null) {
      navigator.geolocation.clearWatch(geoWatchId.current);
      geoWatchId.current = null;
    }
  };
}, [handleLocateUser]);


  /* ---------------- DATA ---------------- */

  const { data: cities = [], isLoading: citiesLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const { data: locations = [], isLoading: locationsLoading } =
    useQuery<Location[]>({
      queryKey: ["/api/locations", { cityId: selectedCity?.id }],
      queryFn: async () => {
        const res = await fetch(
          `/api/locations?cityId=${selectedCity?.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch locations");
        return res.json();
      },
      enabled: !!selectedCity,
    });

  const filteredLocations = selectedCategory
    ? locations.filter((l) => l.category === selectedCategory)
    : locations;

  const locationsWithDistance = filteredLocations
    .map((l) => ({
      ...l,
      distance: userLocation
        ? calculateDistance(
            userLocation[0],
            userLocation[1],
            l.latitude,
            l.longitude
          )
        : undefined,
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  /* ---------------- HANDLERS ---------------- */

  const handleGetStarted = () => setScreen("city-selection");

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    sessionStorage.setItem("selectedCity", JSON.stringify(city));
    setScreen("trip-preference");
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setShowLocationSheet(true);
  };

  const handleNavigate = () => {
    if (!selectedLocation) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`,
      "_blank"
    );
  };

  const getLocationDistance = (location: Location) => {
    if (!userLocation) return undefined;
    return calculateDistance(
      userLocation[0],
      userLocation[1],
      location.latitude,
      location.longitude
    );
  };

  /* ---------------- SCREEN SWITCH ---------------- */

  if (screen === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (screen === "city-selection") {
    return (
      <CitySelection
        cities={cities}
        isLoading={citiesLoading}
        onSelectCity={handleSelectCity}
        onBack={() => setScreen("welcome")}
      />
    );
  }

  if (screen === "trip-preference" && selectedCity) {
    return (
      <TripPreference
        cityName={selectedCity.name}
        onBack={() => setScreen("city-selection")}
        onContinue={({ days, mode }) => {
          setTripDays(days);
          setExploreMode(mode);
          sessionStorage.setItem("exploreMode", mode);
          if (days !== null) {
            sessionStorage.setItem("tripDays", String(days));
          }
          setScreen("explore");
        }}
      />
    );
  }

  if (selectedLocation && !showLocationSheet) {
    return (
      <LocationDetail
        location={selectedLocation}
        distance={getLocationDistance(selectedLocation)}
        onBack={() => setSelectedLocation(null)}
        onNavigate={handleNavigate}
      />
    );
  }

  /* ---------------- EXPLORE UI ---------------- */

  const mapCenter: [number, number] = selectedCity
    ? [selectedCity.latitude, selectedCity.longitude]
    : [26.9124, 75.7873];

  const renderExploreContent = () => (
    <>
      <div className="absolute top-0 left-0 right-0 z-[1002] px-4 pt-4 pb-2">
        <SearchBar
          locations={locations}
          onSelectLocation={setSelectedLocation}
        />
      </div>

      <div className="absolute top-20 left-0 right-0 z-[1001]">
        <CategoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className="absolute top-36 right-4 z-[1001]">
        <div className="bg-background rounded-md shadow-lg p-1 flex">
          <Button
            variant={viewMode === "map" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("map")}
          >
            <MapIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === "map" ? (
        <div className="flex-1 pt-32 pb-16">
          <MapView
            center={mapCenter}
            locations={locations}
            selectedCategory={selectedCategory}
            userLocation={userLocation}
            onLocationSelect={handleLocationSelect}
            onLocateUser={handleLocateUser}
            mode={exploreMode ?? "map"}
            tripDays={tripDays ?? undefined}
          />
        </div>
      ) : (
        <div className="flex-1 pt-36 pb-20 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-4 py-4 space-y-3">
              {locationsLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </>
              ) : locationsWithDistance.length > 0 ? (
                locationsWithDistance.map((loc) => (
                  <LocationCard
                    key={loc.id}
                    location={loc}
                    distance={loc.distance}
                    onClick={() => setSelectedLocation(loc)}
                  />
                ))
              ) : (
                <div className="py-12 text-center">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium">No locations found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      <BottomSheet
        isOpen={showLocationSheet}
        onClose={() => setShowLocationSheet(false)}
      >
        {selectedLocation && (
          <div className="pb-24">
            <h2 className="text-xl font-bold">{selectedLocation.name}</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {selectedLocation.shortDescription}
            </p>
            <Button className="w-full mt-4" onClick={handleNavigate}>
              Navigate
            </Button>
          </div>
        )}
      </BottomSheet>
    </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "explore":
        return renderExploreContent();
      case "saved":
        return <SavedPlaces />;
      case "itinerary": {
        // Determine plans from state or sessionStorage
        const days = tripDays ?? Number(sessionStorage.getItem("tripDays"));
        if (!days || !JAIPUR_ITINERARY[days]) {
          return (
            <div className="p-6 text-center">
              <h2 className="text-lg font-semibold mb-2">No itinerary available</h2>
              <p className="text-sm text-muted-foreground mb-4">Please set your trip preferences to generate an itinerary.</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => navigate("/trip")} className="bg-orange-500 text-white px-4 py-2 rounded-md">Set Trip Preferences</button>
                <button onClick={() => setActiveTab("explore")} className="bg-white border px-4 py-2 rounded-md">Back</button>
              </div>
            </div>
          );
        }

        return (
          <ItineraryPreview
            plans={JAIPUR_ITINERARY[days]}
            onBack={() => setActiveTab("explore")}
            onViewMap={() => {
              setExploreMode("itinerary");
              setViewMode("map");
              setActiveTab("explore");
            }}
            onOpenFull={() => {
              const daysVal = tripDays ?? Number(sessionStorage.getItem("tripDays"));
              if (Number.isFinite(daysVal)) sessionStorage.setItem("tripDays", String(daysVal));
              navigate("/itinerary");
            }}
          />
        );
      }
      case "routes":
        return <RoutesTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return renderExploreContent();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {renderTabContent()}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "itinerary") {
            sessionStorage.setItem("exploreMode", "itinerary");
            navigate("/itinerary");
            return;
          }
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
