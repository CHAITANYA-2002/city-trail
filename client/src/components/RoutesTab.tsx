import { Route, MapPin } from "lucide-react";

export function RoutesTab() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Route className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Plan Your Route</h2>
      <p className="text-center text-muted-foreground max-w-xs">
        Create custom routes by selecting multiple destinations. Perfect for planning your day of exploration.
      </p>
    </div>
  );
}
