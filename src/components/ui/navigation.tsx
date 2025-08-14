import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { 
  Package, 
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-strong">
      <div className="relative flex h-20 max-w-md mx-auto">
        {/* Moving background square */}
        <div 
          className="absolute top-2 h-16 w-16 bg-gradient-primary rounded-2xl shadow-medium transition-all duration-300 ease-out"
          style={{
            left: `calc(${activeIndex * (100 / navigationItems.length)}% + ${100 / navigationItems.length / 2}% - 32px)`,
          }}
        />
        
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex-1 flex flex-col items-center justify-center h-16 mt-2 rounded-2xl transition-colors duration-300 ease-out group z-10"
            >
              <Icon className={cn(
                "h-6 w-6 mb-1 transition-colors duration-300",
                isActive ? "text-white" : "text-muted-foreground"
              )} />
              
              <span className={cn(
                "text-xs font-medium transition-colors duration-300",
                isActive ? "text-white" : "text-muted-foreground"
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