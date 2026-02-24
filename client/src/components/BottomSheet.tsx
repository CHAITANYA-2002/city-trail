import { useRef, useState, useEffect } from "react";
import { motion, useAnimation, PanInfo, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripHorizontal, Sparkles } from "lucide-react";

interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: number[];
  initialSnap?: number;
}

export function BottomSheet({ 
  children, 
  isOpen, 
  onClose,
  snapPoints = [0.4, 0.7, 0.95],
  initialSnap = 0
}: BottomSheetProps) {
  const controls = useAnimation();
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const sheetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      controls.start({ y: `${(1 - snapPoints[currentSnap]) * 100}%` });
    } else {
      controls.start({ y: "100%" });
    }
  }, [isOpen, currentSnap, snapPoints, controls]);
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y;
    const currentY = info.point.y;
    const windowHeight = window.innerHeight;
    const currentPosition = currentY / windowHeight;
    
    if (velocity > 400) {
      if (currentSnap > 0) {
        setCurrentSnap(currentSnap - 1);
      } else {
        onClose();
      }
      return;
    }
    
    if (velocity < -400) {
      if (currentSnap < snapPoints.length - 1) {
        setCurrentSnap(currentSnap + 1);
      }
      return;
    }
    
    let closestSnap = 0;
    let minDistance = Infinity;
    
    snapPoints.forEach((snap, index) => {
      const snapPosition = 1 - snap;
      const distance = Math.abs(currentPosition - snapPosition);
      if (distance < minDistance) {
        minDistance = distance;
        closestSnap = index;
      }
    });
    
    if (currentPosition > 0.9) {
      onClose();
    } else {
      setCurrentSnap(closestSnap);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-md z-[1000]"
            onClick={onClose}
          />
          
          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={controls}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 350, mass: 0.8 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.05}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-[1001] bg-heritage-sand rounded-t-[3.5rem] shadow-luxury border-t-2 border-primary/10 overflow-hidden"
            style={{ height: "95vh", touchAction: "none" }}
          >
            {/* Prestige Handle */}
            <div className="flex flex-col items-center py-6 gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/40 to-transparent w-full h-full"
                />
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100%-60px)] px-6 sm:px-10 pb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {children}
              </motion.div>
            </ScrollArea>
            
            {/* Elegant Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-heritage-sand to-transparent pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
