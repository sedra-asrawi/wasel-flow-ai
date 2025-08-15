import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { StatusCircle } from "@/components/ui/status-circle";
import { ChatInterface } from "@/components/ChatInterface";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";

type OrderStatus = "pickup" | "delivery" | "delivered";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(() => {
    // Check if we're coming from delivery scan with delivered status
    const status = searchParams.get("status");
    return status === "delivered" ? "delivered" : "pickup";
  });
  const [chatOpen, setChatOpen] = useState(false);

  // Removed auto-progress - circles stay in their current state

  const mockOrder = {
    id: "ORD-2024-001",
    customerName: "Ahmed Al-Rashid",
    restaurant: "Al-Boom Steak House",
    customerAddress: "Block 5, Street 12, Hawalli, Kuwait",
    restaurantAddress: "Al-Boom Center, Kuwait City",
    total: 12.750,
    phone: "+965 9876 5432",
    estimatedTime: "25-30 mins"
  };

  const getStepStatus = (step: OrderStatus) => {
    const statuses: OrderStatus[] = ["pickup", "delivery", "delivered"];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(step);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const handleNextStep = () => {
    if (currentStatus === "pickup") {
      setCurrentStatus("delivery");
    } else if (currentStatus === "delivery") {
      setCurrentStatus("delivered");
    } else {
      navigate("/");
    }
  };

  const handleContactCustomer = () => {
    window.location.href = `tel:${mockOrder.phone}`;
  };

  const handleNavigate = () => {
    const address = currentStatus === "pickup" ? mockOrder.restaurantAddress : mockOrder.customerAddress;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
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
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="text-lg">Delivery Progress</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="flex justify-between items-center mb-6">
              <StatusCircle 
                status={getStepStatus("pickup")} 
                label="Pickup" 
              />
              <div className="flex-1 h-0.5 bg-muted mx-4 relative">
                <div 
                  className={`h-full transition-all duration-500 ${
                    getStepStatus("delivery") === "completed" || getStepStatus("delivery") === "active" 
                      ? "bg-primary" 
                      : "bg-muted"
                  }`}
                  style={{ 
                    width: getStepStatus("delivery") === "completed" || getStepStatus("delivery") === "active" ? "100%" : "0%" 
                  }}
                />
              </div>
              <StatusCircle 
                status={getStepStatus("delivery")} 
                label="In Route" 
              />
              <div className="flex-1 h-0.5 bg-muted mx-4 relative">
                <div 
                  className={`h-full transition-all duration-500 ${
                    getStepStatus("delivered") === "completed" 
                      ? "bg-primary" 
                      : "bg-muted"
                  }`}
                  style={{ 
                    width: getStepStatus("delivered") === "completed" ? "100%" : "0%" 
                  }}
                />
              </div>
              <StatusCircle 
                status={getStepStatus("delivered")} 
                label="Delivered" 
              />
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              {currentStatus === "pickup" && (
                <div>
                  <p className="font-medium text-primary">Ready for Pickup</p>
                  <p className="text-sm text-muted-foreground">Head to the restaurant to collect the order</p>
                </div>
              )}
              {currentStatus === "delivery" && (
                <div>
                  <p className="font-medium text-primary">On the Way</p>
                  <p className="text-sm text-muted-foreground">Delivering to customer location</p>
                </div>
              )}
              {currentStatus === "delivered" && (
                <div>
                  <p className="font-medium text-accent">Delivered Successfully!</p>
                  <p className="text-sm text-muted-foreground">Order completed. Great job!</p>
                </div>
              )}
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Order Details */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="text-lg">Order Details</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order #</span>
              <span className="font-medium">{mockOrder.id}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{mockOrder.customerName}</span>
                <div className="ml-auto flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleContactCustomer}
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setChatOpen(true)}
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {currentStatus === "pickup" ? "Pickup from:" : "Deliver to:"}
                </span>
                <span className="font-medium flex-1">
                  {currentStatus === "pickup" ? mockOrder.restaurant : mockOrder.customerAddress}
                </span>
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
          </ModernCardContent>
        </ModernCard>

        {/* Action Buttons */}
        <div className="space-y-3">
          {currentStatus === "pickup" && (
            <Button 
              onClick={handleNextStep}
              className="w-full h-12"
            >
              Start Delivery
            </Button>
          )}
          
          {currentStatus === "delivery" && (
            <Button 
              onClick={() => navigate('/scan?type=delivery')}
              className="w-full h-12 bg-gradient-success text-white font-semibold"
            >
              Complete Delivery
            </Button>
          )}
          
          {currentStatus === "delivered" && (
            <Button 
              onClick={() => navigate('/')}
              className="w-full h-12 bg-gradient-success text-white font-semibold"
            >
              Complete Order
            </Button>
          )}
          
          <Button 
            onClick={handleNavigate}
            variant="outline" 
            className="w-full h-12"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Navigate with Maps
          </Button>
        </div>
      </div>

      <Navigation />
      
      {/* Chat Interface */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <ChatInterface
            orderId={mockOrder.id}
            driverId="00000000-0000-0000-0000-000000000001" // Mock driver UUID
            customerId="00000000-0000-0000-0000-000000000002" // Mock customer UUID
            userType="driver"
            onClose={() => setChatOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ConfirmationPage;