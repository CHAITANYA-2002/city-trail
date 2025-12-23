import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { JAIPUR_ITINERARY } from "@/data/jaipurItinerary";
import { MapPin } from "lucide-react";

export default function ItineraryPage() {
  const navigate = useNavigate();
  const raw = sessionStorage.getItem("tripDays");
  const storedDays = raw ? Number(raw) : NaN;

  const initialDays = Number.isFinite(storedDays) && JAIPUR_ITINERARY[storedDays] ? storedDays : null;
  const [selectedDays, setSelectedDays] = useState<number | null>(initialDays);

  // If user hasn't set days yet, show a simple chooser so they can view the itinerary immediately
  if (!selectedDays) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">View an Itinerary</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Choose how many days you'd like to view. You can always set trip preferences later.
          </p>

          <div className="flex gap-3 justify-center mb-4">
            {[1, 2, 3, 4].map((d) => (
              <button
                key={d}
                onClick={() => {
                  sessionStorage.setItem("tripDays", String(d));
                  setSelectedDays(d);
                }}
                className="px-4 py-2 rounded-md border bg-white"
              >
                {d} {d === 1 ? "Day" : "Days"}
              </button>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/trip")}
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
            >
              Set Trip Preferences
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-white border px-4 py-2 rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const plans = JAIPUR_ITINERARY[selectedDays];

  const [showChangePlan, setShowChangePlan] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <div className="px-4 pt-4 pb-3">
        <button
          onClick={() => {
            // Set map to show itinerary and go to the map page
            sessionStorage.setItem("exploreMode", "itinerary");
            sessionStorage.setItem("tripDays", String(selectedDays));
            navigate("/map");
          }}
          className="flex items-center text-sm text-muted-foreground mb-3"
        >
          ← Back to map
        </button>

        <h1 className="text-2xl font-semibold">Your Jaipur Itinerary — {selectedDays} day{selectedDays!>1?"s":""}</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-4">Full day-wise plan. Tap "See on Map" to view the route.</p>
      </div>

      <div className="px-4 pt-2 pb-24 space-y-6">
        {plans.map((day) => (
          <div key={day.day} className="bg-white rounded-xl p-4 border">
            <h2 className="font-semibold mb-3">Day {day.day}: {day.title}</h2>

            <div className="space-y-4">
              {day.stops.map((stop, idx) => (
                <div key={`${day.day}-${idx}`} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">{idx+1}</div>
                    {idx !== day.stops.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-2 h-full" style={{minHeight:24}} />}
                  </div>

                  <div>
                    <p className="font-medium">{stop.title}</p>
                    {stop.time && <p className="text-xs text-muted-foreground">{stop.time}</p>}
                    {stop.description && <p className="text-sm text-muted-foreground mt-1">{stop.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 left-4 right-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={() => {
              sessionStorage.setItem("tripDays", String(selectedDays));
              sessionStorage.setItem("exploreMode", "itinerary");
              navigate("/map");
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl"
          >
            <MapPin className="w-4 h-4" /> See on Map
          </button>

          <button
            onClick={() => setShowChangePlan(true)}
            className="flex-1 bg-white border py-3 rounded-xl"
          >
            Change my plan
          </button>
        </div>
      </div>

      {/* Change plan sheet */}
      <div>
        {showChangePlan && (
          <div className="fixed inset-0 z-[1000] bg-background/80 flex items-end justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded-t-3xl shadow-xl">
              <h3 className="text-lg font-semibold mb-2">Change your plan</h3>
              <p className="text-sm text-muted-foreground mb-4">Choose an option below</p>

              <div className="space-y-3">
                <button onClick={() => navigate('/cities')} className="w-full py-3 bg-gray-100 rounded-md">Change City</button>

                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium mb-2">Change number of days</p>
                  <div className="flex gap-2">
                    {[1,2,3,4].map((d) => (
                      <button key={d}
                        onClick={() => {
                          sessionStorage.setItem('tripDays', String(d));
                          setSelectedDays(d);
                          setShowChangePlan(false);
                        }}
                        className={`flex-1 py-2 rounded-md ${d === selectedDays ? 'bg-primary text-white' : 'bg-white border'}`}
                      >{d} {d===1? 'Day' : 'Days'}</button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => setShowChangePlan(false)} className="flex-1 py-2">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
