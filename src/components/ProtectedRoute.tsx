import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/auth" }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
      {children}
    </ProtectedRoute>
  );
};

interface DriverRouteProps {
  children: React.ReactNode;
}

export const DriverRoute = ({ children }: DriverRouteProps) => {
  return (
    <ProtectedRoute allowedRoles={["driver"]} redirectTo="/auth">
      {children}
    </ProtectedRoute>
  );
};

interface WaselRouteProps {
  children: React.ReactNode;
}

export const WaselRoute = ({ children }: WaselRouteProps) => {
  return (
    <ProtectedRoute allowedRoles={["wasel", "admin"]} redirectTo="/auth">
      {children}
    </ProtectedRoute>
  );
};