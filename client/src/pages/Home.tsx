import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { CitySelection } from "@/components/CitySelection";
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { List, Map as MapIcon, MapPin } from "lucide-react";
import type { City, Location, CategoryType } from "@shared/schema";

type AppScreen = "welcome" | "city-selection" | "explore";
type ViewMode = "map" | "list";
type TabType = "explore" | "saved" | "routes" | "profile";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>("welcome");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  
  const { data: cities = [], isLoading: citiesLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });
  
  const { data: locations = [], isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations", { cityId: selectedCity?.id }],
    queryFn: async () => {
      const response = await fetch(`/api/locations?cityId=${selectedCity?.id}`);
      if (!response.ok) throw new Error("Failed to fetch locations");
      return response.json();
    },
    enabled: !!selectedCity,
  });
  
  const filteredLocations = selectedCategory
    ? locations.filter(loc => loc.category === selectedCategory)
    : locations;
  
  const locationsWithDistance = filteredLocations.map(loc => ({
    ...loc,
    distance: userLocation 
      ? calculateDistance(userLocation[0], userLocation[1], loc.latitude, loc.longitude)
      : undefined
  })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  
  const handleGetStarted = () => {
    setScreen("city-selection");
  };
  
  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setScreen("explore");
  };
  
  const handleLocateUser = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);
  
  useEffect(() => {
    if (screen === "explore") {
      handleLocateUser();
    }
  }, [screen, handleLocateUser]);
  
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setShowLocationSheet(true);
  };
  
  const handleNavigate = () => {
    if (selectedLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`;
      window.open(url, "_blank");
    }
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
  
  const mapCenter: [number, number] = selectedCity 
    ? [selectedCity.latitude, selectedCity.longitude]
    : [26.9124, 75.7873];
  
  const renderExploreContent = () => (
    <>
      <div className="absolute top-0 left-0 right-0 z-[1002] px-4 pt-4 pb-2">
        <SearchBar 
          locations={locations}
          onSelectLocation={(loc) => {
            setSelectedLocation(loc);
          }}
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
            data-testid="button-view-map"
          >
            <MapIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            data-testid="button-view-list"
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
          />
        </div>
      ) : (
        <div className="flex-1 pt-36 pb-20 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-4 py-4 space-y-3">
              {locationsLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-3 p-3">
                      <Skeleton className="w-24 h-24 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </>
              ) : locationsWithDistance.length > 0 ? (
                locationsWithDistance.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    distance={location.distance}
                    onClick={() => setSelectedLocation(location)}
                  />
                ))
              ) : (
                <div className="py-12 text-center">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-foreground mb-1">No locations found</p>
                  <p className="text-muted-foreground">
                    {selectedCategory 
                      ? "Try selecting a different category"
                      : "Check back later for new places"
                    }
                  </p>
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
            <div className="mb-4">
              <h2 className="text-xl font-bold">{selectedLocation.name}</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {selectedLocation.shortDescription}
              </p>
            </div>
            
            <Button
              className="w-full"
              onClick={() => {
                setShowLocationSheet(false);
              }}
              data-testid="button-view-full-details"
            >
              View Full Details
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
        return (
          <div className="flex-1 pb-16">
            <SavedPlaces />
          </div>
        );
      case "routes":
        return (
          <div className="flex-1 pb-16">
            <RoutesTab />
          </div>
        );
      case "profile":
        return (
          <div className="flex-1 pb-16 overflow-auto">
            <ProfileTab />
          </div>
        );
      default:
        return renderExploreContent();
    }
  };
  
  return (
    <div className="h-screen flex flex-col bg-background">
      {renderTabContent()}
      
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
