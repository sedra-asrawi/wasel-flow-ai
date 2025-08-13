import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusCircle } from "@/components/ui/status-circle";
import { MapPin, Clock, Phone } from "lucide-react";

type OrderStatus = "pickup" | "delivery" | "delivered";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("pickup");

  // Check if we're returning from delivery scan
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    if (status === "delivered") {
      setCurrentStatus("delivered");
    }
  }, []);

  // Simulate status progression
  useEffect(() => {
    const statusProgression = ["pickup", "delivery", "delivered"] as const;
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < statusProgression.length) {
        setCurrentStatus(statusProgression[currentIndex]);
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStepStatus = (step: OrderStatus) => {
    const statusOrder = ["pickup", "delivery", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(step);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const handleNextStep = () => {
    const statusOrder = ["pickup", "delivery", "delivered"] as const;
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex < statusOrder.length - 1) {
      if (currentStatus === "delivery") {
        // Before marking as delivered, go to scan page for delivery confirmation
        navigate("/scan?type=delivery");
      } else {
        setCurrentStatus(statusOrder[currentIndex + 1]);
      }
    }
  };

  const mockOrder = {
    id: "ORD-2024-001",
    customerName: "Ahmed Al-Rashid",
    customerPhone: "+965 9999 1234",
    deliveryAddress: "Salmiya, Block 12, Building 45, Apt 3A",
    estimatedTime: "15 mins",
    total: 16
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Order Status</h1>
          <p className="text-blue-100">Track your delivery progress</p>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Status Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <StatusCircle 
                status={getStepStatus("pickup")} 
                label="Pickup" 
              />
              <div className="flex-1 h-0.5 bg-muted mx-4 relative">
                <div 
                  className={`h-full transition-all duration-500 ${
                    getStepStatus("delivery") === "completed" || getStepStatus("delivery") === "active" 
                      ? "bg-gradient-success" 
                      : "bg-muted"
                  }`}
                />
              </div>
              <StatusCircle 
                status={getStepStatus("delivery")} 
                label="En Route" 
              />
              <div className="flex-1 h-0.5 bg-muted mx-4 relative">
                <div 
                  className={`h-full transition-all duration-500 ${
                    getStepStatus("delivered") === "completed" 
                      ? "bg-gradient-success" 
                      : "bg-muted"
                  }`}
                />
              </div>
              <StatusCircle 
                status={getStepStatus("delivered")} 
                label="Delivered" 
              />
            </div>

            {/* Current Status Message */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              {currentStatus === "pickup" && (
                <div>
                  <p className="font-medium text-primary">Order Confirmed!</p>
                  <p className="text-sm text-muted-foreground">QR code scan successful. Ready for pickup.</p>
                </div>
              )}
              {currentStatus === "delivery" && (
                <div>
                  <p className="font-medium text-wasel-orange">On the way!</p>
                  <p className="text-sm text-muted-foreground">Heading to delivery location.</p>
                </div>
              )}
              {currentStatus === "delivered" && (
                <div>
                  <p className="font-medium text-accent">Delivered Successfully!</p>
                  <p className="text-sm text-muted-foreground">Order completed. Great job!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order #</span>
              <span className="font-medium">{mockOrder.id}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{mockOrder.customerName}</span>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-wasel-green mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-muted-foreground">{mockOrder.deliveryAddress}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">ETA:</span>
              <span className="font-medium">{mockOrder.estimatedTime}</span>
            </div>

            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">Total Amount</span>
              <span className="font-semibold">KWD {mockOrder.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {currentStatus === "pickup" && (
            <Button 
              onClick={handleNextStep}
              className="w-full h-12 bg-gradient-warning text-white font-semibold"
            >
              Start Delivery
            </Button>
          )}
          
          {currentStatus === "delivery" && (
            <Button 
              onClick={handleNextStep}
              className="w-full h-12 bg-gradient-success text-white font-semibold"
            >
              Mark as Delivered
            </Button>
          )}

          {currentStatus === "delivered" && (
            <Button 
              className="w-full h-12 bg-gradient-primary text-white font-semibold"
              onClick={() => window.location.href = "/"}
            >
              Complete Order
            </Button>
          )}

          <Button variant="outline" className="w-full">
            Contact Support
          </Button>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default ConfirmationPage;