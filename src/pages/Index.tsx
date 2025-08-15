import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/ChatInterface";
import { MapPin, Clock, DollarSign, Phone, MessageCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [orderAccepted, setOrderAccepted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const mockOrder = {
    id: "ORD-2024-001",
    customerName: "Ahmed Al-Rashid",
    customerPhone: "+965 9999 1234",
    restaurant: "Al-Boom Steak House",
    restaurantAddress: "Sharq, Kuwait City, Kuwait",
    deliveryAddress: "Salmiya, Block 12, Building 45, Apt 3A",
    items: [
      { name: "Grilled Salmon", quantity: 1, price: 8.500 },
      { name: "Caesar Salad", quantity: 1, price: 3.250 },
      { name: "Chocolate Cake", quantity: 1, price: 2.750 }
    ],
    total: 14.500,
    deliveryFee: 1.500,
    estimatedTime: "25-30 mins",
    priority: "high" as const
  };

  const handlePickup = () => {
    setOrderAccepted(true);
    navigate("/scan");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Wasel Driver</h1>
          <p className="text-blue-100">New order available</p>
        </div>
      </header>

      {/* Order Details */}
      <div className="max-w-md mx-auto p-4 space-y-4">
        <ModernCard className="animate-slide-up">
          <ModernCardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <ModernCardTitle className="text-lg">{mockOrder.restaurant}</ModernCardTitle>
                <p className="text-sm text-muted-foreground">Order #{mockOrder.id}</p>
              </div>
              <Badge 
                variant={mockOrder.priority === "high" ? "destructive" : "secondary"}
                className="animate-pulse-glow"
              >
                {mockOrder.priority === "high" ? "High Priority" : "Standard"}
              </Badge>
            </div>
          </ModernCardHeader>
          
          <ModernCardContent className="space-y-4">
            {/* Customer Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Customer</h3>
            <div className="flex items-center gap-2 text-sm">
              <span>{mockOrder.customerName}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-1"
                  onClick={() => setChatOpen(true)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            </div>

            {/* Pickup Location */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-wasel-orange" />
                Pickup from
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                {mockOrder.restaurantAddress}
              </p>
            </div>

            {/* Delivery Location */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-wasel-green" />
                Deliver to
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                {mockOrder.deliveryAddress}
              </p>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Items</h3>
              <div className="space-y-1">
                {mockOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>KWD {item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>KWD {mockOrder.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>KWD {mockOrder.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>KWD {mockOrder.total + mockOrder.deliveryFee}</span>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated delivery: {mockOrder.estimatedTime}</span>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Action Button */}
        <div className="space-y-3">
          {!orderAccepted ? (
            <button 
              onClick={handlePickup} 
              className="group relative w-full h-14 bg-gradient-to-r from-primary via-primary to-accent rounded-2xl font-bold text-lg text-white shadow-strong hover:shadow-glow transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              {/* Animated background overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              
              {/* Button content */}
              <div className="relative flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="tracking-wide">Start Pickup</span>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-30 blur-xl scale-110 transition-all duration-300" />
            </button>
          ) : (
            <div className="text-center p-4 bg-gradient-success/10 rounded-2xl border border-accent/20 backdrop-blur-sm">
              <p className="text-accent font-medium">Order Accepted!</p>
              <p className="text-sm text-muted-foreground">Proceed to scan QR code</p>
            </div>
          )}
        </div>
      </div>

      <Navigation 
        activeColor="secondary"
        variant="filled"
        size="default"
        showLabels={true}
      />
      
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

export default Index;