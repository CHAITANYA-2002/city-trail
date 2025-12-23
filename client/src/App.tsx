import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import CitySelectionPage from "@/pages/CitySelectionPage";
import TripPreferencePage from "@/pages/TripPreferencePage";
import ItineraryPage from "@/pages/ItineraryPage";
import MapPage from "@/pages/MapPage";
import NotFound from "@/pages/not-found";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cities" element={<CitySelectionPage />} />
        <Route path="/trip" element={<TripPreferencePage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
}
