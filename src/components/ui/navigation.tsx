import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-strong">
      <div className="flex h-20 max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex-1 flex flex-col items-center justify-center h-16 mt-2 rounded-xl transition-colors duration-300 ease-out z-10"
            >
              <Icon className={cn(
                "h-6 w-6 mb-1 transition-all duration-300 relative z-10",
                isActive ? "text-secondary" : "text-muted-foreground"
              )} />
              
              <span className={cn(
                "text-xs font-medium transition-colors duration-300 relative z-10",
                isActive ? "text-primary" : "text-muted-foreground"
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