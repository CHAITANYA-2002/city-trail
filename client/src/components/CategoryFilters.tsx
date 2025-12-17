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
  Gem 
} from "lucide-react";
import { CATEGORIES, type CategoryType } from "@shared/schema";

const iconMap: Record<string, any> = {
  Landmark,
  UtensilsCrossed,
  ShoppingBag,
  TreePine,
  Sparkles,
  Calendar,
  Star,
  Gem
};

interface CategoryFiltersProps {
  selectedCategory: CategoryType | null;
  onSelectCategory: (category: CategoryType | null) => void;
}

export function CategoryFilters({ selectedCategory, onSelectCategory }: CategoryFiltersProps) {
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
      onSelectCategory(null);
    } else {
      onSelectCategory(categoryId);
    }
  };
  
  return (
    <div 
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {CATEGORIES.map((category) => {
        const Icon = iconMap[category.icon];
        const isSelected = selectedCategory === category.id;
        
        return (
          <motion.div
            key={category.id}
            whileTap={{ scale: 0.95 }}
            data-category={category.id}
          >
            <Badge
              variant={isSelected ? "default" : "secondary"}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 cursor-pointer whitespace-nowrap
                transition-colors text-sm font-medium
                ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
              `}
              onClick={() => handleClick(category.id)}
              data-testid={`filter-category-${category.id}`}
              aria-label={`Filter by ${category.name}`}
              aria-pressed={isSelected}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {category.name}
            </Badge>
          </motion.div>
        );
      })}
    </div>
  );
}
