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
  { path: "/confirmation", icon: CheckCircle, label: "Status" },
  { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { path: "/profile", icon: User, label: "Profile" },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center h-full px-3 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};