import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen-mobile max-w-screen overflow-x-hidden bg-background text-foreground">
      <div className="safe-pads min-h-screen-mobile flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
          <a 
            href="/" 
            className="inline-flex items-center justify-center tap-target px-6 py-3 bg-gradient-primary text-primary-foreground font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            Return to Home
          </a>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
