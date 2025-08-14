// ===============================
// 1) FRONTEND (React + Vite)
// File: src/pages/ProfilePage.tsx
// ===============================
import { useState, useRef, useEffect } from "react";
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
  Bot,
} from "lucide-react";

import { createClient } from "@supabase/supabase-js";

// Check if Supabase environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if environment variables are available
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Use the Supabase client to get the functions URL
const FUNCTIONS_BASE = supabaseUrl ? `${supabaseUrl}/functions/v1` : null;
const PUBLIC_BEARER = supabaseAnonKey;

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
      if (!FUNCTIONS_BASE || !PUBLIC_BEARER) {
        throw new Error("Supabase configuration is not set up. Please connect your project to Supabase.");
      }

      // If your function expects a user access token instead, get it via supabase.auth.getSession()
      // const { data: { session } } = await supabase.auth.getSession();
      // const authToken = session?.access_token || PUBLIC_BEARER;
      const authToken = PUBLIC_BEARER;

      const response = await fetch(`${FUNCTIONS_BASE}/gemini-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : { response: await response.text() };

      const botMessage = data.response || data.message || "Sorry, I couldn't process your request.";

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
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-primary text-white p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-blue-100">Manage your account & get help</p>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-primary text-white text-lg">
                  {driverProfile.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{driverProfile.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{driverProfile.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({driverProfile.totalRatings} reviews)</span>
                </div>
                <Badge variant="secondary" className="mt-2">Driver since {driverProfile.memberSince}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Wasel AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div ref={scrollRef} className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${chat.type === "user" ? "bg-primary text-white" : "bg-muted text-foreground"}`}>
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
                className="flex-1"
              />
              <Button size="sm" onClick={handleSendMessage} className="bg-primary hover:bg-primary/90" disabled={isSending}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              AI assistant to help with delivery questions, route optimization, and support
            </div>
          </CardContent>
        </Card>

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

