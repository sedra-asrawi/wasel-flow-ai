import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { Download, QrCode, Scan, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const QRTestPage = () => {
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customerName, setCustomerName] = useState("Ahmed Al-Rashid");
  const [driverId, setDriverId] = useState("2");
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateQRCode = async (orderType: "pickup" | "delivery") => {
    setIsGenerating(true);
    try {
      const response = await fetch(`https://exwfohcfjxmouilxfqmy.supabase.co/functions/v1/generate-test-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4d2ZvaGNmanhtb3VpbHhmcW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxOTQ5NjAsImV4cCI6MjA3MDc3MDk2MH0.wxUgqYdKtjOeurLOGZw3YqjCSPOEcP5FX4SnKp78CP0`,
        },
        body: JSON.stringify({ driverId: parseInt(driverId), customerName, orderType })
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      // Get the blob directly from the response
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrImageUrl(url);

      toast({
        title: "QR Code Generated!",
        description: `Test ${orderType} QR code ready for scanning`,
      });
    } catch (error) {
      console.error('QR generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (qrImageUrl) {
      const link = document.createElement('a');
      link.href = qrImageUrl;
      link.download = `${customerName.replace(/\s+/g, '_')}_qr_code.png`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">QR Test Generator</h1>
          <p className="text-muted-foreground">Generate scannable test QR codes for the AI scanner</p>
        </div>

        {/* Custom Details Form */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Details
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverId">Driver ID</Label>
              <Input
                id="driverId"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                placeholder="Enter driver ID"
              />
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Generator Buttons */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Generate QR Code
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => generateQRCode("pickup")}
                disabled={isGenerating || !customerName.trim() || !driverId.trim()}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Pickup QR"}
              </Button>
              <Button 
                onClick={() => generateQRCode("delivery")}
                disabled={isGenerating || !customerName.trim() || !driverId.trim()}
                variant="outline"
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Delivery QR"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Generate separate QR codes for pickup and delivery operations
            </p>
          </ModernCardContent>
        </ModernCard>

        {/* QR Code Display */}
        {qrImageUrl && (
          <ModernCard>
            <ModernCardContent className="p-6 text-center space-y-4">
              <img 
                src={qrImageUrl} 
                alt="Generated QR Code" 
                className="mx-auto border rounded-lg bg-white p-4"
                style={{ maxWidth: "250px" }}
              />
              <div className="flex gap-2">
                <Button onClick={downloadQR} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={() => navigate("/scan?type=pickup")}
                  className="flex-1"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Test Scan
                </Button>
              </div>
            </ModernCardContent>
          </ModernCard>
        )}

        {/* Instructions */}
        <ModernCard>
          <ModernCardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>How to test:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Generate a QR code above</li>
                <li>Display it on another device or print it</li>
                <li>Click "Test Scan" or go to /scan</li>
                <li>Scan the QR code with your camera</li>
              </ol>
              <p className="mt-3 text-xs">
                The QR codes contain: DRIVER_ID:1|ORDER_ID:ORD-2024-001|TYPE:pickup|CUSTOMER:John Smith|ADDRESS:123 Main St
              </p>
            </div>
          </ModernCardContent>
        </ModernCard>

        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default QRTestPage;