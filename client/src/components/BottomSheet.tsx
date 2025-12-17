import { useRef, useState, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripHorizontal } from "lucide-react";

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
  snapPoints = [0.3, 0.6, 0.9],
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
    
    if (velocity > 500) {
      if (currentSnap > 0) {
        setCurrentSnap(currentSnap - 1);
      } else {
        onClose();
      }
      return;
    }
    
    if (velocity < -500) {
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
    
    if (currentPosition > 0.85) {
      onClose();
    } else {
      setCurrentSnap(closestSnap);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-[999]"
        onClick={onClose}
      />
      
      <motion.div
        ref={sheetRef}
        initial={{ y: "100%" }}
        animate={controls}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="fixed inset-x-0 bottom-0 z-[1000] bg-background rounded-t-3xl shadow-2xl"
        style={{ height: "90vh", touchAction: "none" }}
      >
        <div className="flex justify-center py-3">
          <GripHorizontal className="w-10 h-1.5 text-muted-foreground/50" />
        </div>
        
        <ScrollArea className="h-[calc(100%-24px)] px-4">
          {children}
        </ScrollArea>
      </motion.div>
    </>
  );
}
