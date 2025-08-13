import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Phone } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [orderAccepted, setOrderAccepted] = useState(false);

  const mockOrder = {
    id: "ORD-2024-001",
    customerName: "Ahmed Al-Rashid",
    customerPhone: "+971 50 123 4567",
    restaurant: "Burj Al Arab Restaurant",
    restaurantAddress: "Jumeirah Beach Road, Dubai",
    deliveryAddress: "Dubai Marina, Tower 23, Apt 4B",
    items: [
      { name: "Grilled Salmon", quantity: 1, price: 95 },
      { name: "Caesar Salad", quantity: 1, price: 35 },
      { name: "Chocolate Cake", quantity: 1, price: 25 }
    ],
    total: 155,
    deliveryFee: 15,
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
        <Card className="animate-slide-up">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{mockOrder.restaurant}</CardTitle>
                <p className="text-sm text-muted-foreground">Order #{mockOrder.id}</p>
              </div>
              <Badge 
                variant={mockOrder.priority === "high" ? "destructive" : "secondary"}
                className="animate-pulse-glow"
              >
                {mockOrder.priority === "high" ? "High Priority" : "Standard"}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Customer Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Customer</h3>
              <div className="flex items-center gap-2 text-sm">
                <span>{mockOrder.customerName}</span>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <Phone className="h-4 w-4" />
                </Button>
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
                    <span>AED {item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>AED {mockOrder.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>AED {mockOrder.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>AED {mockOrder.total + mockOrder.deliveryFee}</span>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated delivery: {mockOrder.estimatedTime}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="space-y-3">
          {!orderAccepted ? (
            <Button 
              onClick={handlePickup} 
              className="w-full h-12 bg-gradient-success text-white font-semibold"
              size="lg"
            >
              Start Pickup
            </Button>
          ) : (
            <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-accent font-medium">Order Accepted!</p>
              <p className="text-sm text-muted-foreground">Proceed to scan QR code</p>
            </div>
          )}
          
          <Button variant="outline" className="w-full">
            Decline Order
          </Button>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Index;