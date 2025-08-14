import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { QrCode, CheckCircle, AlertCircle, Camera } from "lucide-react";

const ScanPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scanType = searchParams.get("type") || "pickup"; // "pickup" or "delivery"
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Random success/error for demo
      setScanResult(Math.random() > 0.2 ? "success" : "error");
    }, 2000);
  };

  const handleContinue = () => {
    if (scanResult === "success") {
      if (scanType === "pickup") {
        navigate("/confirmation");
      } else {
        navigate("/");
      }
    }
  };

  const handleRetry = () => {
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Scan QR Code</h1>
          <p className="text-blue-100">
            {scanType === "delivery" ? "Confirm delivery completion" : "Verify order pickup"}
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Instructions */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="text-lg flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Order Verification
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <p className="text-sm text-muted-foreground">
              {scanType === "delivery" 
                ? "Scan the QR code to confirm successful delivery to the customer. This completes the order process."
                : "Scan the QR code on the receipt to verify that you're picking up the correct order. This ensures order accuracy and prevents mix-ups."
              }
            </p>
          </ModernCardContent>
        </ModernCard>

        {/* Scanner Area */}
        <ModernCard className="relative overflow-hidden">
          <ModernCardContent className="p-0">
            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
              {!isScanning && !scanResult && (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 border-4 border-dashed border-primary rounded-lg flex items-center justify-center mx-auto">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Point camera at QR code
                  </p>
                </div>
              )}
              
              {scanResult === "success" && (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-accent">Scan Successful!</p>
                    <p className="text-sm text-muted-foreground">
                      {scanType === "delivery" ? "Delivery confirmed" : "Order verified"}
                    </p>
                  </div>
                </div>
              )}
              
              {scanResult === "error" && (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-destructive">Scan Failed</p>
                    <p className="text-sm text-muted-foreground">
                      Invalid QR code. Please try again.
                    </p>
                  </div>
                </div>
              )}
              
              {isScanning && (
                <div className="text-center">
                  <div className="w-20 h-20 border-4 border-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <QrCode className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Scanning...
                  </p>
                </div>
              )}
              
              {isScanning && (
                <div className="absolute inset-4 border-2 border-primary rounded-lg">
                  <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-primary rounded-br-lg"></div>
                </div>
              )}
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isScanning && !scanResult && (
            <Button 
              onClick={handleScan} 
              className="w-full h-12 bg-gradient-primary text-white font-semibold"
              size="lg"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Start Scanning
            </Button>
          )}
          
          {scanResult === "success" && (
            <Button 
              onClick={handleContinue}
              className="w-full h-12 bg-gradient-success text-white font-semibold"
              size="lg"
            >
              Continue
            </Button>
          )}
          
          {scanResult === "error" && (
            <Button 
              onClick={handleRetry}
              className="w-full h-12 bg-gradient-primary text-white font-semibold"
              size="lg"
            >
              Try Again
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => navigate("/")}
          >
            Back to Orders
          </Button>
        </div>

        {/* Order Info */}
        <ModernCard>
          <ModernCardContent className="pt-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Current Order</span>
              <span className="font-medium">ORD-2024-001</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-muted-foreground">Restaurant</span>
              <span className="font-medium">Al-Boom Steak House</span>
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>

      <Navigation />
    </div>
  );
};

export default ScanPage;