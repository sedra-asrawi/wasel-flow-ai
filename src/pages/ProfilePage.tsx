// ===============================
// 1) FRONTEND (React + Vite)
// File: src/pages/ProfilePage.tsx
// ===============================
import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { StatsCard } from "@/components/ui/stats-card";
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
  Bot,
  Truck,
  ArrowLeft,
  Award,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { type: "user" | "bot" | "system"; message: string }[]
  >([{ type: "bot", message: "Hello! I'm Wasel AI. How can I help you today?" }]);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  const driverProfile = {
    name: "Mohammed Hassan",
    email: "mohammed.hassan@example.com",
    phone: "+965 9999 1234",
    rating: 4.9,
    totalRatings: 1247,
    memberSince: "2023",
    vehicleType: "Motorcycle",
    licenseNumber: "KWT-2024-7891",
    location: "Kuwait City, Kuwait",
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isSending) return;

    const currentMessage = chatMessage.trim();
    setChatMessage("");
    setChatHistory((prev) => [...prev, { type: "user", message: currentMessage }]);
    setIsSending(true);
    setChatHistory((prev) => [...prev, { type: "bot", message: "Thinking..." }]);

    try {
      // Use Supabase client to invoke the edge function
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { message: currentMessage },
      });

      if (error) {
        throw new Error(error.message || 'Failed to get response from AI');
      }

      const botMessage = data?.response || "Sorry, I couldn't process your request.";

      setChatHistory((prev) => {
        const history = [...prev];
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].type === "bot" && history[i].message === "Thinking...") {
            history.splice(i, 1);
            break;
          }
        }
        return [...history, { type: "bot", message: botMessage }];
      });
    } catch (error: any) {
      setChatHistory((prev) => {
        const history = [...prev];
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].type === "bot" && history[i].message === "Thinking...") {
            history.splice(i, 1);
            break;
          }
        }
        return [
          ...history,
          { type: "bot", message: `Sorry, I'm having trouble: ${error?.message || "Network error"}` },
        ];
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with back button */}
      <header className="relative bg-background/95 backdrop-blur-lg border-b border-border/20 p-4">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Driver Profile</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Profile Avatar and Name */}
        <ModernCard className="overflow-hidden">
          <ModernCardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20 overflow-hidden">
                  <AvatarImage 
                    src="/lovable-uploads/ebbd92cb-f1c4-41e5-8075-503b91b8b3e5.png"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                    {driverProfile.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{driverProfile.name}</h2>
                <p className="text-sm text-muted-foreground">Driver ID: 123456</p>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatsCard value="1200" label="Points" variant="primary" />
          <StatsCard value="4.8" label="Rating" variant="success" showStar />
          <StatsCard value="95%" label="Completion Rate" variant="secondary" />
        </div>

        {/* Activity Section */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Activity</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">Order #7890</div>
                  <div className="text-xs text-muted-foreground">10:00 AM - 11:00 AM</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">Order #7891</div>
                  <div className="text-xs text-muted-foreground">11:30 AM - 12:30 PM</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">Order #7892</div>
                  <div className="text-xs text-muted-foreground">1:00 PM - 2:00 PM</div>
                </div>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* AI Assistant */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Wasel AI Assistant
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent className="space-y-4">
            <div ref={scrollRef} className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm transition-all duration-200 ${
                    chat.type === "user" 
                      ? "bg-gradient-primary text-white shadow-soft" 
                      : "bg-muted text-foreground"
                  }`}>
                    {chat.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Ask Wasel AI anything..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                disabled={isSending}
                className="flex-1 rounded-2xl border-2 focus:border-primary"
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage} 
                disabled={isSending}
                className="rounded-2xl px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              AI assistant to help with delivery questions, route optimization, and support
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Quick Actions */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Quick Actions</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent className="space-y-3">
            <Button variant="modern" className="w-full justify-start h-14 rounded-2xl">
              <Settings className="h-5 w-5 mr-3" />
              Account Settings
            </Button>
            <Button variant="modern" className="w-full justify-start h-14 rounded-2xl">
              <MessageCircle className="h-5 w-5 mr-3" />
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start h-14 rounded-2xl text-destructive hover:text-destructive border-destructive/20">
              <User className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </ModernCardContent>
        </ModernCard>
      </div>

      <Navigation />
    </div>
  );
};

export default ProfilePage;

