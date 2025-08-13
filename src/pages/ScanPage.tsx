import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, CheckCircle, AlertCircle, Camera } from "lucide-react";

const ScanPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scanType = searchParams.get("type") || "pickup"; // "pickup" or "delivery"
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Simulate successful scan (90% success rate)
      const success = Math.random() > 0.1;
      setScanResult(success ? "success" : "error");
      
      if (success) {
        setTimeout(() => {
          if (scanType === "delivery") {
            // After successful delivery scan, go back to confirmation with delivered status
            navigate("/confirmation?status=delivered");
          } else {
            // After successful pickup scan, go to confirmation
            navigate("/confirmation");
          }
        }, 2000);
      }
    }, 3000);
  };

  const resetScan = () => {
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Order Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {scanType === "delivery" 
                ? "Scan the QR code to confirm successful delivery to the customer. This completes the order process."
                : "Scan the QR code on the receipt to verify that you're picking up the correct order. This ensures order accuracy and prevents mix-ups."
              }
            </p>
          </CardContent>
        </Card>

        {/* Scanner Area */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
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

              {isScanning && (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 border-4 border-primary rounded-lg flex items-center justify-center mx-auto animate-pulse-glow">
                    <QrCode className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Scanning...</p>
                  <div className="w-full bg-muted rounded-full h-2 mx-auto max-w-40">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
                  </div>
                </div>
              )}

              {scanResult === "success" && (
                <div className="text-center space-y-4 animate-slide-up">
                  <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-accent">Scan Successful!</p>
                    <p className="text-sm text-muted-foreground">
                      {scanType === "delivery" ? "Delivery confirmed. Order completed!" : "Order verified. Redirecting..."}
                    </p>
                  </div>
                </div>
              )}

              {scanResult === "error" && (
                <div className="text-center space-y-4 animate-slide-up">
                  <div className="w-20 h-20 bg-gradient-to-br from-destructive to-destructive/80 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-destructive">Scan Failed</p>
                    <p className="text-sm text-muted-foreground">
                      {scanType === "delivery" 
                        ? "Unable to confirm delivery. Please try again or contact support."
                        : "Order mismatch detected. This order is not assigned to you."
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Scanning frame overlay */}
              {isScanning && (
                <div className="absolute inset-4 border-2 border-primary rounded-lg">
                  <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-primary rounded-br-lg"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isScanning && !scanResult && (
            <Button 
              onClick={handleScan} 
              className="w-full h-12 bg-gradient-primary text-white font-semibold"
              size="lg"
            >
              Start Scanning
            </Button>
          )}

          {scanResult === "error" && (
            <Button 
              onClick={resetScan} 
              className="w-full h-12"
              variant="outline"
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Current Order</span>
              <span className="font-medium">ORD-2024-001</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-muted-foreground">Restaurant</span>
              <span className="font-medium">Al-Boom Steak House</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default ScanPage;