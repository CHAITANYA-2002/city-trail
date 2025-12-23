import { Button } from "@/components/ui/button";

interface DaySwitcherProps {
  totalDays: number;
  activeDay: number;
  onChange: (day: number) => void;
}

export function DaySwitcher({
  totalDays,
  activeDay,
  onChange,
}: DaySwitcherProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-background shadow-lg rounded-full flex overflow-hidden">
      {Array.from({ length: totalDays }).map((_, i) => {
        const day = i + 1;
        return (
          <Button
            key={day}
            variant={day === activeDay ? "default" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => onChange(day)}
          >
            Day {day}
          </Button>
        );
      })}
    </div>
  );
}
