import * as React from "react"
import { cn } from "@/lib/utils"
import { ModernCard, ModernCardContent } from "./modern-card"
import { Star } from "lucide-react"

interface StatsCardProps {
  value: string | number
  label: string
  className?: string
  variant?: "default" | "primary" | "secondary" | "success"
  showStar?: boolean
}

export const StatsCard = React.forwardRef<
  HTMLDivElement,
  StatsCardProps
>(({ value, label, className, variant = "default", showStar = false, ...props }, ref) => {
  const variants = {
    default: "bg-gradient-card border-border/20",
    primary: "bg-gradient-primary text-white border-primary/20",
    secondary: "bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/20",
    success: "bg-gradient-success text-white border-accent/20"
  }

  return (
    <ModernCard
      ref={ref}
      className={cn(
        "text-center min-h-[120px] flex items-center justify-center hover:scale-105 transition-all duration-300 group",
        variants[variant],
        className
      )}
      {...props}
    >
      <ModernCardContent className="p-4">
        <div className="space-y-2">
          <div className={cn(
            "text-3xl font-bold transition-all duration-300 group-hover:scale-110 flex items-center justify-center gap-2",
            variant === "primary" || variant === "success" ? "text-white" : "text-foreground"
          )}>
            {showStar && (
              <Star className={cn(
                "h-6 w-6 fill-current",
                variant === "primary" || variant === "success" ? "text-white" : "text-yellow-500"
              )} />
            )}
            {value}
          </div>
          <div className={cn(
            "text-sm font-medium",
            variant === "primary" || variant === "success" ? "text-white/80" : "text-muted-foreground"
          )}>
            {label}
          </div>
        </div>
      </ModernCardContent>
    </ModernCard>
  )
})
StatsCard.displayName = "StatsCard"