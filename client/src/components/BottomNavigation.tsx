import { motion } from "framer-motion";
import { Compass, Heart, Route, User } from "lucide-react";

type TabType = "explore" | "saved" | "routes" | "profile";

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "explore" as TabType, label: "Explore", icon: Compass },
  { id: "saved" as TabType, label: "Saved", icon: Heart },
  { id: "routes" as TabType, label: "Routes", icon: Route },
  { id: "profile" as TabType, label: "Profile", icon: User },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-[900] safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full
                transition-colors relative
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
              `}
              data-testid={`nav-${tab.id}`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
