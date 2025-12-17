import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Compass, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-2xl" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-8 shadow-lg"
        >
          <Compass className="w-12 h-12 text-primary-foreground" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-foreground mb-3 tracking-tight"
          data-testid="text-app-title"
        >
          CityTrail
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-muted-foreground text-center max-w-xs leading-relaxed"
          data-testid="text-app-tagline"
        >
          Discover the hidden gems and iconic landmarks of India's most vibrant cities
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 flex items-center gap-6"
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Explore</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-2">
              <Compass className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Navigate</span>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="w-full z-10"
      >
        <Button 
          onClick={onGetStarted}
          size="lg"
          className="w-full h-14 text-lg font-semibold gap-2"
          data-testid="button-get-started"
          aria-label="Get Started"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </Button>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          Free to explore, no account required
        </p>
      </motion.div>
    </div>
  );
}
