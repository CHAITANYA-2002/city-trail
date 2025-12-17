import { User, Settings, Info, Star, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProfileTab() {
  return (
    <div className="flex flex-col px-6 pt-8 pb-24">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            <User className="w-12 h-12" />
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold text-foreground mb-1">Guest User</h2>
        <p className="text-muted-foreground text-sm">Sign in to sync your preferences</p>
      </div>
      
      <div className="space-y-3">
        <Card className="p-4 flex items-center gap-4 cursor-pointer hover-elevate overflow-visible">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Rate CityTrail</p>
            <p className="text-sm text-muted-foreground">Help us improve with your feedback</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-4 cursor-pointer hover-elevate overflow-visible">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <Settings className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Settings</p>
            <p className="text-sm text-muted-foreground">App preferences and notifications</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-4 cursor-pointer hover-elevate overflow-visible">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <Info className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium">About</p>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          </div>
        </Card>
      </div>
      
      <div className="mt-8">
        <Button className="w-full gap-2" variant="outline">
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </div>
    </div>
  );
}
