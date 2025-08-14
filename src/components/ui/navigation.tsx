import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { 
  Package, 
  QrCode, 
  CheckCircle, 
  BarChart3, 
  User 
} from "lucide-react";

const navigationItems = [
  { path: "/", icon: Package, label: "Orders" },
  { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { path: "/profile", icon: User, label: "Profile" },
];

export const Navigation = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  // Find the current active index
  useEffect(() => {
    const currentIndex = navigationItems.findIndex(item => item.path === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  // Calculate the position of the active square
  const getSquarePosition = () => {
    const containerWidth = 100; // percentage
    const itemWidth = containerWidth / navigationItems.length;
    const itemCenter = itemWidth / 2;
    const position = (activeIndex * itemWidth) + itemCenter - 8; // 8 is half of square width (64px / 8 = 8%)
    return position;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-strong">
      <div className="relative flex h-20 max-w-md mx-auto px-2">
        {/* Animated background square */}
        <div 
          className="absolute top-2 h-16 w-16 bg-gradient-primary rounded-2xl shadow-medium transition-all duration-500 ease-out"
          style={{
            left: `${getSquarePosition()}%`,
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20 blur-lg scale-110" />
        </div>
        
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center h-16 mt-2 rounded-2xl transition-all duration-300 ease-out group z-10",
                "hover:scale-105 active:scale-95"
              )}
            >
              {/* Icon */}
              <Icon className={cn(
                "h-6 w-6 mb-1 transition-all duration-300 relative z-10",
                isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
              )} />
              
              {/* Label */}
              <span className={cn(
                "text-xs font-medium transition-all duration-300 relative z-10",
                isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};