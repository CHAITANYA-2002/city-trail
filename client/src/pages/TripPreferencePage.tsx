import { useNavigate } from "react-router-dom";
import { TripPreference } from "@/components/TripPreference";
import { useTrip } from "@/contexts/TripContext";

export default function TripPreferencePage() {
  const navigate = useNavigate();
  const { city, exploreMode } = useTrip();

  if (!city) {
    navigate("/cities");
    return null;
  }

  return (
    <TripPreference
      cityName={city.name}
      onBack={() => navigate(-1)}
      onContinue={() => {
        if (exploreMode === "custom") {
          navigate("/planner");
        } else {
          navigate("/map");
        }
      }}
    />
  );
}
