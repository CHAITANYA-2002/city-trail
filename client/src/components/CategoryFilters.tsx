import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Landmark, 
  UtensilsCrossed, 
  ShoppingBag, 
  TreePine, 
  Sparkles, 
  Calendar, 
  Star, 
  Gem,
  Compass
} from "lucide-react";
import { CATEGORIES, type CategoryType } from "@shared/schema";
import { useTrip } from "@/contexts/TripContext";

const iconMap: Record<string, any> = {
  Landmark,
  UtensilsCrossed,
  ShoppingBag,
  TreePine,
  Sparkles,
  Calendar,
  Star,
  Gem,
  Compass
};

export function CategoryFilters() {
  const { selectedCategory, setSelectedCategory } = useTrip();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (selectedCategory && scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector(`[data-category="${selectedCategory}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCategory]);
  
  const handleClick = (categoryId: CategoryType) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };
  
  return (
    <div 
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto no-scrollbar px-6 py-4"
    >
      {CATEGORIES.map((category) => {
        const Icon = iconMap[category.icon] || Compass;
        const isSelected = selectedCategory === category.id;
        
        return (
          <motion.div
            key={category.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            data-category={category.id}
          >
            <Badge
              variant={isSelected ? "default" : "secondary"}
              className={`
                flex items-center gap-2.5 px-6 py-3 cursor-pointer whitespace-nowrap
                transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em]
                rounded-2xl border-2
                ${isSelected 
                  ? 'bg-primary text-white border-primary shadow-luxury' 
                  : 'bg-white text-muted-foreground border-primary/5 hover:border-primary/20 hover:text-foreground shadow-sm'}
              `}
              onClick={() => handleClick(category.id)}
              aria-label={`Filter by ${category.name}`}
              aria-pressed={isSelected}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-accent shadow-glow' : 'text-primary/40'}`} />
              {category.name}
            </Badge>
          </motion.div>
        );
      })}
    </div>
  );
}
