import { useNavigate } from "react-router-dom";
import { CitySelection } from "@/components/CitySelection";
import { useQuery } from "@tanstack/react-query";
import type { City } from "@shared/schema";
import { useTrip } from "@/contexts/TripContext";

export default function CitySelectionPage() {
  const navigate = useNavigate();
  const { setCity } = useTrip();

  const { data: cities = [], isLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  return (
    <CitySelection
      cities={cities}
      isLoading={isLoading}
      onSelectCity={(city) => {
        setCity(city);
        navigate("/trip");
      }}
      onBack={() => navigate(-1)}
    />
  );
}
