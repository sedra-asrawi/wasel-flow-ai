import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { QrCode, CheckCircle, AlertCircle, Camera, Brain, Shield } from "lucide-react";
import { QRScanner } from "@/components/QRScanner";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ScanPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const scanType = searchParams.get("type") || "pickup"; // "pickup" or "delivery"
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [scannedData, setScannedData] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  // Mock driver ID - should match the database (Mohammed Hassan = 1)
  const currentDriverId = 1;

  const handleQRResult = async (qrData: string) => {
    console.log('QR Code scanned:', qrData);
    setScannedData(qrData);
    setIsScanning(false);
    setIsVerifying(true);

    try {
      toast({
        title: "QR Code Detected",
        description: "Verifying with AI...",
      });

      // Call our Supabase edge function for AI verification
      const { data, error } = await supabase.functions.invoke('qr-ai-verification', {
        body: {
          qrData: qrData,
          driverId: currentDriverId,
          scanType: scanType
        }
      });

      setIsVerifying(false);

      if (error) {
        console.error('Verification error:', error);
        setScanResult("error");
        setVerificationResult({
          reason: error.message || 'Verification failed',
          confidence: 0
        });
        toast({
          title: "Verification Failed",
          description: error.message || 'Could not verify QR code',
          variant: "destructive",
        });
        return;
      }

      console.log('Verification result:', data);
      setVerificationResult(data);

      if (data.isValid) {
        setScanResult("success");
        toast({
          title: "QR Code Verified ✓",
          description: `Valid ${scanType} QR code (${data.confidence}% confidence)`,
        });
      } else {
        setScanResult("error");
        toast({
          title: "Invalid QR Code",
          description: data.reason || 'QR code verification failed',
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Verification error:', error);
      setIsVerifying(false);
      setScanResult("error");
      setVerificationResult({
        reason: 'System error during verification',
        confidence: 0
      });
      toast({
        title: "System Error",
        description: "Could not verify QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQRError = (error: string) => {
    console.error('QR Scanner error:', error);
    toast({
      title: "Camera Error",
      description: error,
      variant: "destructive",
    });
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setVerificationResult(null);
    setScannedData("");
  };

  const handleContinue = () => {
    if (scanResult === "success") {
      if (scanType === "pickup") {
        navigate("/confirmation");
      } else {
        // After delivery scan, go back to confirmation page with delivered status
        navigate("/confirmation?status=delivered");
      }
    }
  };

  const handleRetry = () => {
    setScanResult(null);
    setVerificationResult(null);
    setScannedData("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">AI-Powered QR Scanner</h1>
            <Brain className="h-6 w-6" />
          </div>
          <p className="text-blue-100">
            {scanType === "delivery" ? "AI-verified delivery confirmation" : "AI-verified order pickup"}
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Instructions */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              AI-Powered Verification
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <p className="text-sm text-muted-foreground">
              {scanType === "delivery" 
                ? "Scan the QR code to confirm delivery. Our AI will verify the code matches your driver ID and validates the delivery information."
                : "Scan the QR code to verify order pickup. Our AI will check if the code is valid for your driver profile and contains correct order information."
              }
            </p>
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Brain className="h-4 w-4" />
                <span>Powered by Gemini AI for enhanced security</span>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Scanner Area */}
        <ModernCard className="relative overflow-hidden">
          <ModernCardContent className="p-0">
            <QRScanner
              onResult={handleQRResult}
              onError={handleQRError}
              isActive={isScanning}
            />
            
            {isVerifying && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white space-y-4">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="space-y-2">
                    <p className="font-semibold">AI Verification in Progress</p>
                    <p className="text-sm opacity-80">Analyzing QR code with Gemini AI...</p>
                  </div>
                </div>
              </div>
            )}
            
            {scanResult === "success" && (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-green-600/20 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                <div className="text-center space-y-6 p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-wasel-green/30 max-w-sm mx-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-wasel-green to-status-active rounded-full flex items-center justify-center mx-auto shadow-lg animate-scale-in">
                      <CheckCircle className="h-12 w-12 text-white drop-shadow-sm" />
                    </div>
                    <div className="absolute -inset-2 bg-wasel-green/20 rounded-full animate-ping"></div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-wasel-blue animate-fade-in">
                      ✅ AI Verification Successful!
                    </h3>
                    {verificationResult?.confidence && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-wasel-green/10 rounded-full border border-wasel-green/30">
                        <div className="w-2 h-2 bg-wasel-green rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-wasel-blue">
                          {verificationResult.confidence}% Confidence
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {scanResult === "error" && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                <div className="text-center space-y-4 p-4">
                  <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-destructive">Verification Failed</p>
                    <p className="text-sm text-red-600 max-w-xs mx-auto">
                      {verificationResult?.reason || "Invalid QR code. Please try again."}
                    </p>
                    {scannedData && (
                      <p className="text-xs text-muted-foreground mt-2 font-mono bg-muted p-2 rounded max-w-xs mx-auto break-all">
                        Scanned: {scannedData.slice(0, 50)}{scannedData.length > 50 ? '...' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </ModernCardContent>
        </ModernCard>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isScanning && !scanResult && !isVerifying && (
            <Button 
              onClick={handleScan} 
              className="w-full h-12 bg-gradient-primary text-white font-semibold"
              size="lg"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Start AI-Powered Scanning
            </Button>
          )}
          
          {scanResult === "success" && (
            <Button 
              onClick={handleContinue}
              className="w-full h-12 bg-gradient-success text-white font-semibold"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
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
              <span className="text-muted-foreground">Current Driver</span>
              <span className="font-medium">Mohammed Hassan (#1)</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-muted-foreground">Scan Type</span>
              <span className="font-medium capitalize">{scanType}</span>
            </div>
            {verificationResult?.extractedOrderId && (
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-muted-foreground">Detected Order</span>
                <span className="font-medium">{verificationResult.extractedOrderId}</span>
              </div>
            )}
          </ModernCardContent>
        </ModernCard>
      </div>

      <Navigation />
    </div>
  );
};

export default ScanPage;