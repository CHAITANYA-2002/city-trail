import { useEffect, useState } from "react";

export function useUserLocation() {
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.warn("Location error:", err.message);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return location;
}
