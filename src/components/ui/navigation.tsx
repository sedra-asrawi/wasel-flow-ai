import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { 
  Package, 
  BarChart3, 
  User 
} from "lucide-react";

interface NavigationItem {
  path: string;
  icon: LucideIcon;
  label: string;
  badge?: string | number;
}

interface NavigationProps {
  items?: NavigationItem[];
  className?: string;
  activeColor?: "primary" | "secondary" | "accent";
  inactiveColor?: "muted" | "muted-foreground";
  variant?: "default" | "minimal" | "filled";
  size?: "sm" | "default" | "lg";
  showLabels?: boolean;
  position?: "bottom" | "top";
}

const defaultItems: NavigationItem[] = [
  { path: "/", icon: Package, label: "Orders" },
  { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { path: "/profile", icon: User, label: "Profile" },
];

const sizeClasses = {
  sm: { nav: "h-16", item: "h-12", icon: "h-4 w-4", text: "text-xs" },
  default: { nav: "h-20", item: "h-16", icon: "h-6 w-6", text: "text-xs" },
  lg: { nav: "h-24", item: "h-20", icon: "h-7 w-7", text: "text-sm" },
};

export const Navigation = ({
  items = defaultItems,
  className,
  activeColor = "secondary",
  inactiveColor = "muted-foreground",
  variant = "default",
  size = "default",
  showLabels = true,
  position = "bottom"
}: NavigationProps) => {
  const location = useLocation();
  const sizeStyles = sizeClasses[size];

  const getActiveColorClass = () => {
    switch (activeColor) {
      case "primary": return "text-primary";
      case "secondary": return "text-secondary";
      case "accent": return "text-accent";
      default: return "text-secondary";
    }
  };

  const getInactiveColorClass = () => {
    switch (inactiveColor) {
      case "muted": return "text-muted";
      case "muted-foreground": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const getVariantClasses = (isActive: boolean) => {
    switch (variant) {
      case "minimal":
        return cn(
          "transition-colors duration-300",
          isActive ? "text-[#82c0cc]" : getInactiveColorClass()
        );
      case "filled":
        return cn(
          "rounded-xl transition-all duration-300",
          isActive 
            ? "text-[#82c0cc]" 
            : "text-muted-foreground"
        );
      default:
        return cn(
          "rounded-xl transition-all duration-300 ease-out",
          isActive ? "text-[#82c0cc]" : getInactiveColorClass()
        );
    }
  };

  const positionClasses = position === "bottom" 
    ? "fixed bottom-0 left-0 right-0" 
    : "fixed top-0 left-0 right-0";

  return (
    <nav className={cn(
      positionClasses,
      "bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-strong z-40",
      position === "top" && "border-b border-t-0",
      className
    )}>
      <div className={cn("flex max-w-md mx-auto", sizeStyles.nav)}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center mt-2",
                sizeStyles.item,
                getVariantClasses(isActive)
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "transition-all duration-300",
                  sizeStyles.icon,
                  showLabels ? "mb-1" : "",
                  isActive ? "text-[#82c0cc]" : "text-muted-foreground"
                )} />
                
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              
              {showLabels && (
                <span className={cn(
                  "font-medium transition-colors duration-300",
                  sizeStyles.text
                )}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};