import { useNavigate } from "react-router-dom";
import { TripPreference } from "@/components/TripPreference";
import type { City } from "@shared/schema";

export default function TripPreferencePage() {
  const navigate = useNavigate();
  const city: City | null = JSON.parse(
    sessionStorage.getItem("selectedCity") || "null"
  );

  if (!city) {
    navigate("/cities");
    return null;
  }

  return (
    <TripPreference
      cityName={city.name}
      onBack={() => navigate(-1)}
      onContinue={({ days, mode }) => {
        // store exploreMode so other pages can behave accordingly
        sessionStorage.setItem("exploreMode", mode);
        if (days !== null) sessionStorage.setItem("tripDays", String(days));

        if (mode === "itinerary") {
          navigate("/itinerary");
        } else {
          // Continue to map for explore mode
          navigate("/map");
        }
      }}
    />
  );
}
