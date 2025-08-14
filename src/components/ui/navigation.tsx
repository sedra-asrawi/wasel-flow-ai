import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Package, 
  QrCode, 
  CheckCircle, 
  BarChart3, 
  User 
} from "lucide-react";

const navigationItems = [
  { path: "/", icon: Package, label: "Orders" },
  { path: "/scan", icon: QrCode, label: "Scan" },
  { path: "/confirmation", icon: CheckCircle, label: "Confirm" },
  { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { path: "/profile", icon: User, label: "Profile" },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-strong">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center h-16 w-16 rounded-2xl transition-all duration-300 ease-out group",
                "hover:scale-105 active:scale-95",
                isActive 
                  ? "bg-gradient-primary text-white shadow-medium transform scale-110" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
              )}
            >
              {/* Background glow effect for active state */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20 blur-lg scale-110 animate-pulse-glow" />
              )}
              
              {/* Icon with bounce animation */}
              <Icon className={cn(
                "h-6 w-6 mb-1 transition-all duration-300 relative z-10",
                isActive && "animate-bounce"
              )} />
              
              {/* Label with slide up animation */}
              <span className={cn(
                "text-xs font-medium transition-all duration-300 relative z-10",
                isActive && "animate-slide-up"
              )}>
                {item.label}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};