import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Locate, Plus, Minus } from "lucide-react";
import { CATEGORIES, type Location, type CategoryType } from "@shared/schema";

interface MapViewProps {
  center: [number, number];
  locations: Location[];
  selectedCategory: CategoryType | null;
  userLocation: [number, number] | null;
  onLocationSelect: (location: Location) => void;
  onLocateUser: () => void;
}

const createCategoryIcon = (category: string) => {
  const categoryInfo = CATEGORIES.find(c => c.id === category);
  const color = categoryInfo?.color || '#6366F1';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      position: relative;
      width: 24px;
      height: 24px;
    ">
      <div style="
        position: absolute;
        inset: 0;
        background: #3B82F6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
      <div style="
        position: absolute;
        inset: -8px;
        background: rgba(59, 130, 246, 0.2);
        border-radius: 50%;
        animation: pulse 2s infinite;
      "></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function MapController({ center, userLocation }: { center: [number, number]; userLocation: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 15, { duration: 1 });
    }
  }, [userLocation, map]);
  
  return null;
}

function ZoomControls() {
  const map = useMap();
  
  return (
    <div className="absolute right-4 bottom-28 z-[1000] flex flex-col gap-2">
      <Button
        size="icon"
        variant="secondary"
        className="shadow-lg"
        onClick={() => map.zoomIn()}
        data-testid="button-zoom-in"
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        className="shadow-lg"
        onClick={() => map.zoomOut()}
        data-testid="button-zoom-out"
      >
        <Minus className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function MapView({ 
  center, 
  locations, 
  selectedCategory, 
  userLocation, 
  onLocationSelect,
  onLocateUser 
}: MapViewProps) {
  const filteredLocations = selectedCategory 
    ? locations.filter(loc => loc.category === selectedCategory)
    : locations;
  
  return (
    <div className="relative w-full h-full">
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
          }
          .leaflet-container {
            width: 100%;
            height: 100%;
            font-family: inherit;
          }
          .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .leaflet-popup-content {
            margin: 8px 12px;
            font-size: 14px;
          }
        `}
      </style>
      
      <MapContainer 
        center={center} 
        zoom={13} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} userLocation={userLocation} />
        <ZoomControls />
        
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        
        {filteredLocations.map((location) => (
          <Marker 
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={createCategoryIcon(location.category)}
            eventHandlers={{
              click: () => onLocationSelect(location)
            }}
          >
            <Popup>
              <div className="min-w-[150px]">
                <h3 className="font-semibold text-sm mb-1">{location.name}</h3>
                {location.shortDescription && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {location.shortDescription}
                  </p>
                )}
                <button 
                  className="text-xs text-blue-600 font-medium"
                  onClick={() => onLocationSelect(location)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <Button
        size="icon"
        variant="secondary"
        className="absolute right-4 bottom-44 z-[1000] shadow-lg"
        onClick={onLocateUser}
        data-testid="button-locate-user"
      >
        <Locate className="w-4 h-4" />
      </Button>
    </div>
  );
}
