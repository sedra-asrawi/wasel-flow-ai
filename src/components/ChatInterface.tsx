import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Languages, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  sender_type: "driver" | "customer";
  message: string;
  original_message?: string | null;
  is_translated: boolean;
  original_language?: string | null;
  translated_language?: string | null;
  created_at: string;
}

interface ChatInterfaceProps {
  orderId: string;
  driverId: string;
  customerId: string;
  userType: "driver" | "customer";
  onClose: () => void;
}

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "ur", name: "Urdu" },
  { code: "tl", name: "Filipino" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
];

// ---------- string utils to prevent false "translated" blocks ----------
const norm = (s: string) =>
  s
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();

const areSame = (a?: string | null, b?: string | null) => {
  if (!a || !b) return false;
  return norm(a) === norm(b);
};

// quick detector for obvious non-Latin scripts (helps with debugging)
const hasNonLatin = (s: string) =>
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(
    s
  );

export const ChatInterface = ({
  orderId,
  driverId,
  customerId,
  userType,
  onClose,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat (create/find + load history)
  useEffect(() => {
    const init = async () => {
      try {
        if (!orderId || !driverId || !customerId) return;

        const { data: existingChat, error: chatError } = await supabase
          .from("chats")
          .select("id")
          .eq("driver_id", driverId)
          .eq("customer_id", customerId)
          .eq("order_id", orderId)
          .single();

        if (chatError && chatError.code !== "PGRST116") {
          throw chatError;
        }

        let currentChatId = existingChat?.id as string | undefined;

        if (!currentChatId) {
          const { data: newChat, error: createError } = await supabase
            .from("chats")
            .insert({
              driver_id: driverId,
              customer_id: customerId,
              order_id: orderId,
            })
            .select("id")
            .single();

          if (createError) throw createError;
          currentChatId = newChat!.id;
        }

        setChatId(currentChatId);

        const { data: chatMessages, error: messagesError } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("chat_id", currentChatId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;
        setMessages((chatMessages || []) as Message[]);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast({
          title: "Error",
          description: "Failed to initialize chat",
          variant: "destructive",
        });
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, driverId, customerId]);

  // Subscribe to real-time message inserts after chatId is known
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`chat_${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const exists = prev.find(
              (msg) =>
                msg.message === payload.new.message &&
                msg.sender_type === payload.new.sender_type &&
                Math.abs(
                  new Date(msg.created_at).getTime() -
                    new Date(payload.new.created_at).getTime()
                ) < 5000
            );
            if (!exists) {
              return [...prev, payload.new as Message];
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // -------- TRANSLATION --------
  // Be defensive: try multiple payload shapes and read multiple response shapes.
  const translateMessage = async (text: string, targetLang: string) => {
    try {
      // Try the most likely shape first
      let resp = await supabase.functions.invoke("chat-translate", {
        body: { text, target: targetLang, source: "auto" },
      });

      // If the function expects different keys, try alternates
      if ((resp.error || !resp.data) && hasNonLatin(text)) {
        resp = await supabase.functions.invoke("chat-translate", {
          body: { message: text, target_language: targetLang, source_language: "auto" },
        });
      }

      const { data, error } = resp;

      if (error || !data) {
        console.warn("translateMessage: no data or error", error);
        return { translatedText: text, detectedLanguage: "und" };
      }

      const translatedText: string =
        data.translatedText ??
        data.translated_text ??
        data.translation ??
        data.translated ??
        data.text ??
        text;

      const detectedLanguage: string =
        data.detectedLanguage ??
        data.detected_language ??
        data.source ??
        data.source_language ??
        "und";

      return { translatedText, detectedLanguage };
    } catch (err) {
      console.error("translateMessage exception:", err);
      return { translatedText: text, detectedLanguage: "und" };
    }
  };

  // Always attempt translation to the selected target. If unchanged => not translated.
  const detectLanguageAndTranslate = async (text: string, targetLang: string) => {
    const { translatedText, detectedLanguage } = await translateMessage(text, targetLang);
    
    // Check if text was actually translated (different from original)
    const isTranslated = !areSame(translatedText, text) && translatedText !== text;
    
    // For non-English text, always show as translated even if API didn't change it
    const hasNonLatinChars = hasNonLatin(text);
    const shouldShowAsTranslated = isTranslated || (hasNonLatinChars && targetLang === "en");

    return {
      translatedText: shouldShowAsTranslated ? translatedText : text,
      originalText: shouldShowAsTranslated ? text : null,
      isTranslated: shouldShowAsTranslated,
      detectedLanguage,
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    setIsLoading(true);
    try {
      const originalMessage = newMessage.trim();

      const result = await detectLanguageAndTranslate(originalMessage, preferredLanguage);
      const userId = userType === "driver" ? driverId : customerId;

      const tempMessage: Message = {
        id: crypto.randomUUID(),
        sender_type: userType,
        message: result.translatedText,
        original_message: result.originalText ?? null,
        original_language: result.isTranslated ? result.detectedLanguage || "auto" : null,
        translated_language: result.isTranslated ? preferredLanguage : null,
        is_translated: result.isTranslated,
        created_at: new Date().toISOString(),
      };

      // Optimistic UI
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");

      // Persist
      const { error } = await supabase.from("chat_messages").insert({
        chat_id: chatId,
        sender_id: userId,
        sender_type: userType,
        message: result.translatedText,
        original_message: result.originalText,
        original_language: result.isTranslated ? result.detectedLanguage || "auto" : null,
        translated_language: result.isTranslated ? preferredLanguage : null,
        is_translated: result.isTranslated,
      });

      if (error) {
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
        throw error;
      }

      toast({
        title: "Message sent",
        description: result.isTranslated
          ? `Auto-translated to ${preferredLanguage.toUpperCase()}`
          : "Message sent",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto h-[500px] flex flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat with {userType === "driver" ? "Customer" : "Driver"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((message) => {
              // Extra guard: even if DB says is_translated, don't show translated block
              // if the strings are effectively the same.
              const showTranslatedBlock =
                !!message.is_translated &&
                !!message.original_message &&
                !areSame(message.original_message, message.message);

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_type === userType ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender_type === userType
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {showTranslatedBlock ? (
                      <div className="space-y-2">
                        {/* Original message */}
                        <div className="border-b border-current/20 pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              Original ({(message.original_language || "AUTO").toUpperCase()})
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{message.original_message}</p>
                        </div>

                        {/* Translated message */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              <Languages className="h-3 w-3 mr-1" />
                              {`Translation (${(
                                message.translated_language ||
                                preferredLanguage ||
                                "en"
                              ).toUpperCase()})`}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{message.message}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm">{message.message}</p>
                    )}

                    <p className="text-xs opacity-70 mt-2">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
