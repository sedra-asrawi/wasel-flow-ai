import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StatusCircleProps {
  status: "pending" | "active" | "completed";
  label: string;
  className?: string;
}

export const StatusCircle = ({ status, label, className }: StatusCircleProps) => {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          status === "completed" && "bg-gradient-success border-accent text-white",
          status === "active" && "bg-primary border-primary text-white animate-pulse-glow",
          status === "pending" && "border-muted-foreground text-muted-foreground"
        )}
      >
        {status === "completed" && <Check className="h-6 w-6" />}
        {status === "active" && <div className="w-3 h-3 bg-white rounded-full" />}
        {status === "pending" && <div className="w-3 h-3 border-2 border-current rounded-full" />}
      </div>
      <span className={cn(
        "text-sm font-medium",
        status === "completed" && "text-accent",
        status === "active" && "text-primary",
        status === "pending" && "text-muted-foreground"
      )}>
        {label}
      </span>
    </div>
  );
};