import { motion } from "framer-motion";
import { Compass, Heart, Route, User, MapPin } from "lucide-react";

type TabType = "explore" | "saved" | "itinerary" | "routes" | "profile";

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "explore" as TabType, label: "Explore", icon: Compass },
  { id: "saved" as TabType, label: "Saved", icon: Heart },
  { id: "itinerary" as TabType, label: "Itinerary", icon: MapPin },
  { id: "routes" as TabType, label: "Routes", icon: Route },
  { id: "profile" as TabType, label: "Profile", icon: User },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 py-4 px-6 z-[900] safe-area-inset-bottom">
      <div className="max-w-md mx-auto h-20 bg-foreground/90 backdrop-blur-2xl rounded-[2.5rem] shadow-luxury border border-white/10 flex items-center justify-around px-2 relative overflow-hidden">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full
                transition-all duration-500 relative z-10
                ${isActive ? 'text-accent' : 'text-heritage-sand/40 hover:text-heritage-sand/60'}
              `}
              data-testid={`nav-${tab.id}`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="navTabGlow"
                    className="absolute inset-x-[-15px] inset-y-[-15px] bg-accent/20 rounded-full blur-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-6 h-6 mb-1.5 transition-transform duration-500 ${isActive ? 'scale-110 shadow-glow' : 'scale-100'}`} />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="navTabIndicator"
                  className="absolute -bottom-1 w-1.5 h-1.5 bg-accent rounded-full shadow-glow"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
