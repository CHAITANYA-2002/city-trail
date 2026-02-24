import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "@/pages/Home";
import CitySelectionPage from "@/pages/CitySelectionPage";
import TripPreferencePage from "@/pages/TripPreferencePage";
import ItineraryPage from "@/pages/ItineraryPage";
import MapPage from "@/pages/MapPage";
import DayPlannerPage from "@/pages/DayPlannerPage";
import NotFound from "@/pages/not-found";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

import { TripProvider } from "@/contexts/TripContext";

export default function App() {
  const location = useLocation();

  return (
    <TooltipProvider>
      <Toaster />
      <TripProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            } />
            <Route path="/cities" element={
              <PageWrapper>
                <CitySelectionPage />
              </PageWrapper>
            } />
            <Route path="/trip" element={
              <PageWrapper>
                <TripPreferencePage />
              </PageWrapper>
            } />
            <Route path="/itinerary" element={
              <PageWrapper>
                <ItineraryPage />
              </PageWrapper>
            } />
            <Route path="/map" element={
              <PageWrapper>
                <MapPage />
              </PageWrapper>
            } />
            <Route path="/planner" element={
              <PageWrapper>
                <DayPlannerPage />
              </PageWrapper>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </TripProvider>
    </TooltipProvider>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.19, 1, 0.22, 1] // Prestigious easeOutExpo
      }}
      className="w-full h-full overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
