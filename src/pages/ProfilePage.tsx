import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Star, 
  MessageCircle, 
  Settings, 
  Phone, 
  Mail,
  MapPin,
  Send,
  Bot
} from "lucide-react";

const ProfilePage = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { type: "bot", message: "Hello! I'm Wasel AI. How can I help you today?" },
  ]);

  const driverProfile = {
    name: "Mohammed Hassan",
    email: "mohammed.hassan@example.com",
    phone: "+965 9999 1234",
    rating: 4.9,
    totalRatings: 1247,
    memberSince: "2023",
    vehicleType: "Motorcycle",
    licenseNumber: "KWT-2024-7891",
    location: "Kuwait City, Kuwait"
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = { type: "user", message: chatMessage };
    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me help you with that.",
        "That's a great question! Here's what I recommend...",
        "I'll make sure to route this to the appropriate team.",
        "Thanks for bringing this to my attention. Here's how we can resolve it:",
        "I'm here to help! Can you provide more details about the issue?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { type: "bot", message: randomResponse }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-blue-100">Manage your account & get help</p>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Profile Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-primary text-white text-lg">
                  {driverProfile.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{driverProfile.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{driverProfile.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({driverProfile.totalRatings} reviews)
                  </span>
                </div>
                <Badge variant="secondary" className="mt-2">
                  Driver since {driverProfile.memberSince}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{driverProfile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{driverProfile.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{driverProfile.location}</span>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vehicle Type</span>
              <span className="font-medium">{driverProfile.vehicleType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">License Number</span>
              <span className="font-medium">{driverProfile.licenseNumber}</span>
            </div>
          </CardContent>
        </Card>

        {/* Wasel AI Chatbot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Wasel AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chat History */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    chat.type === "user" 
                      ? "bg-primary text-white" 
                      : "bg-muted text-foreground"
                  }`}>
                    {chat.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask Wasel AI anything..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              AI assistant to help with delivery questions, route optimization, and support
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              <User className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default ProfilePage;