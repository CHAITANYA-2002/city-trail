
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { City, Location, CategoryType } from "@shared/schema";

export type ExploreMode = "map" | "itinerary" | "custom";

export interface PlannedDay {
  day: number;
  title: string;
  stops: any[]; // ItineraryStop-like structure
  overview?: string;
}

interface TripState {
  city: City | null;
  days: number | null;
  interests: string[];
  exploreMode: ExploreMode;
  customItinerary: Location[];
  dayPlan: PlannedDay[];
  selectedCategory: CategoryType | null;
  userLocation: [number, number] | null;
}

interface TripContextType extends TripState {
  setCity: (city: City | null) => void;
  setDays: (days: number | null) => void;
  setInterests: (interests: string[]) => void;
  setExploreMode: (mode: ExploreMode) => void;
  setCustomItinerary: (itin: Location[]) => void;
  setDayPlan: (plan: PlannedDay[]) => void;
  setSelectedCategory: (cat: CategoryType | null) => void;
  setUserLocation: (loc: [number, number] | null) => void;
  
  // High-level actions
  addLocation: (loc: Location, day?: number) => void;
  removeLocation: (locationName: string) => void;
  reorderStops: (dayIndex: number, fromIndex: number, toIndex: number) => void;
  clearTrip: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  // Initialization from sessionStorage
  const [state, setState] = useState<TripState>(() => {
    const savedCity = sessionStorage.getItem("selectedCity");
    const savedDays = sessionStorage.getItem("tripDays");
    const savedExploreMode = sessionStorage.getItem("exploreMode");
    const savedCustomItin = sessionStorage.getItem("customItinerary");
    const savedDayPlan = sessionStorage.getItem("dayPlan");
    const savedInterests = sessionStorage.getItem("tripInterests");

    return {
      city: savedCity ? JSON.parse(savedCity) : null,
      days: savedDays ? Number(savedDays) : null,
      interests: savedInterests ? JSON.parse(savedInterests) : [],
      exploreMode: (savedExploreMode as ExploreMode) || "map",
      customItinerary: savedCustomItin ? JSON.parse(savedCustomItin) : [],
      dayPlan: savedDayPlan ? JSON.parse(savedDayPlan) : [],
      selectedCategory: null,
      userLocation: null,
    };
  });

  // Persist to sessionStorage on state changes
  useEffect(() => {
    if (state.city) sessionStorage.setItem("selectedCity", JSON.stringify(state.city));
    if (state.days) sessionStorage.setItem("tripDays", String(state.days));
    sessionStorage.setItem("exploreMode", state.exploreMode);
    sessionStorage.setItem("customItinerary", JSON.stringify(state.customItinerary));
    sessionStorage.setItem("dayPlan", JSON.stringify(state.dayPlan));
    sessionStorage.setItem("tripInterests", JSON.stringify(state.interests));
  }, [state.city, state.days, state.exploreMode, state.customItinerary, state.dayPlan, state.interests]);

  const setCity = useCallback((city: City | null) => setState(s => ({ ...s, city })), []);
  const setDays = useCallback((days: number | null) => setState(s => ({ ...s, days })), []);
  const setInterests = useCallback((interests: string[]) => setState(s => ({ ...s, interests })), []);
  const setExploreMode = useCallback((exploreMode: ExploreMode) => setState(s => ({ ...s, exploreMode })), []);
  const setCustomItinerary = useCallback((customItinerary: Location[]) => setState(s => ({ ...s, customItinerary })), []);
  const setDayPlan = useCallback((dayPlan: PlannedDay[]) => setState(s => ({ ...s, dayPlan })), []);
  const setSelectedCategory = useCallback((selectedCategory: CategoryType | null) => setState(s => ({ ...s, selectedCategory })), []);
  const setUserLocation = useCallback((userLocation: [number, number] | null) => setState(s => ({ ...s, userLocation })), []);

  const addLocation = useCallback((loc: Location, day?: number) => {
    setState(s => {
      const newCustom = [...s.customItinerary, loc];
      let newDayPlan = [...s.dayPlan];
      
      if (day && day <= newDayPlan.length) {
        newDayPlan[day-1].stops.push({
          title: loc.name,
          description: loc.description,
          type: loc.category,
        });
      }
      
      return { ...s, customItinerary: newCustom, dayPlan: newDayPlan };
    });
  }, []);

  const removeLocation = useCallback((locationName: string) => {
    setState(s => {
      const newCustom = s.customItinerary.filter(l => l.name !== locationName);
      const newDayPlan = s.dayPlan.map(d => ({
        ...d,
        stops: d.stops.filter((st: any) => st.title !== locationName)
      }));
      return { ...s, customItinerary: newCustom, dayPlan: newDayPlan };
    });
  }, []);

  const reorderStops = useCallback((dayIndex: number, fromIndex: number, toIndex: number) => {
    setState(s => {
      const newDayPlan = [...s.dayPlan];
      const day = { ...newDayPlan[dayIndex] };
      const stops = [...day.stops];
      const [moved] = stops.splice(fromIndex, 1);
      stops.splice(toIndex, 0, moved);
      day.stops = stops;
      newDayPlan[dayIndex] = day;
      return { ...s, dayPlan: newDayPlan };
    });
  }, []);

  const clearTrip = useCallback(() => {
    sessionStorage.clear();
    setState({
      city: null,
      days: null,
      interests: [],
      exploreMode: "map",
      customItinerary: [],
      dayPlan: [],
      selectedCategory: null,
      userLocation: null,
    });
  }, []);

  return (
    <TripContext.Provider value={{
      ...state,
      setCity,
      setDays,
      setInterests,
      setExploreMode,
      setCustomItinerary,
      setDayPlan,
      setSelectedCategory,
      setUserLocation,
      addLocation,
      removeLocation,
      reorderStops,
      clearTrip
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
