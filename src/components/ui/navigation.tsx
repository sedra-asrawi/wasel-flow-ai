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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Find the current active index
  useEffect(() => {
    const currentIndex = navigationItems.findIndex(item => item.path === location.pathname);
    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      setIsTransitioning(true);
      setActiveIndex(currentIndex);
      
      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 400);
    }
  }, [location.pathname, activeIndex]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-strong">
      <div className="relative flex justify-around items-center h-20 max-w-md mx-auto px-2">
        {/* Animated background square */}
        <div 
          className={cn(
            "absolute h-16 w-16 bg-gradient-primary rounded-2xl shadow-medium transition-all duration-500 ease-out",
            "before:absolute before:inset-0 before:bg-gradient-primary before:rounded-2xl before:opacity-20 before:blur-lg before:scale-110",
            isTransitioning && "scale-110 opacity-80"
          )}
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
            left: `calc(${100 / navigationItems.length / 2}% - 32px)`,
          }}
        />
        
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center h-16 w-16 rounded-2xl transition-all duration-300 ease-out group z-10",
                "hover:scale-105 active:scale-95",
                isActive 
                  ? "text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Icon without jumping animation */}
              <Icon className={cn(
                "h-6 w-6 mb-1 transition-all duration-300 relative z-10"
              )} />
              
              {/* Label */}
              <span className={cn(
                "text-xs font-medium transition-all duration-300 relative z-10"
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