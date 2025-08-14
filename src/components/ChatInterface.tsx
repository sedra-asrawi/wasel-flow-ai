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
  sender_type: 'driver' | 'customer';
  message: string;
  original_message?: string;
  is_translated: boolean;
  original_language?: string;
  translated_language?: string;
  created_at: string;
}

interface ChatInterfaceProps {
  orderId: string;
  driverId: string;
  customerId: string;
  userType: 'driver' | 'customer';
  onClose: () => void;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ur', name: 'Urdu' },
  { code: 'tl', name: 'Filipino' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
];

export const ChatInterface = ({
  orderId,
  driverId,
  customerId,
  userType,
  onClose
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

  useEffect(() => {
    initializeChat();
  }, [orderId, driverId, customerId]);

  const initializeChat = async () => {
    try {
      // First, try to find existing chat
      const { data: existingChat, error: chatError } = await supabase
        .from('chats')
        .select('id')
        .eq('driver_id', driverId)
        .eq('customer_id', customerId)
        .eq('order_id', orderId)
        .single();

      let currentChatId = existingChat?.id;

      if (!currentChatId) {
        // Create new chat if it doesn't exist
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            driver_id: driverId,
            customer_id: customerId,
            order_id: orderId,
          })
          .select('id')
          .single();

        if (createError) throw createError;
        currentChatId = newChat.id;
      }

      setChatId(currentChatId);

      // Load existing messages
      const { data: chatMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', currentChatId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages((chatMessages || []) as Message[]);

      // Subscribe to real-time updates (filter out duplicates)
      const channel = supabase
        .channel(`chat_${currentChatId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `chat_id=eq.${currentChatId}`,
          },
          (payload) => {
            // Only add if not already in messages (avoid duplicates from optimistic updates)
            setMessages(prev => {
              const exists = prev.find(msg => 
                msg.message === payload.new.message &&
                msg.sender_type === payload.new.sender_type &&
                Math.abs(new Date(msg.created_at).getTime() - new Date(payload.new.created_at).getTime()) < 5000
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
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: "Error",
        description: "Failed to initialize chat",
        variant: "destructive",
      });
    }
  };

  const translateMessage = async (text: string) => {
    try {
      console.log('Sending to OpenAI:', text);
      const { data, error } = await supabase.functions.invoke('chat-translate', {
        body: { message: text }
      });

      console.log('OpenAI response:', data, 'Error:', error);

      if (error || !data) {
        return text; // Return original if failed
      }

      return data.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original if failed
    }
  };

  const detectLanguageAndTranslate = async (text: string) => {
    // Check if text contains non-English characters
    const nonEnglishPattern = /[\u0900-\u097F\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/;
    
    if (nonEnglishPattern.test(text)) {
      console.log('Non-English detected, getting translation from OpenAI');
      const englishTranslation = await translateMessage(text);
      return {
        englishText: englishTranslation,
        originalText: text,
        isTranslated: true
      };
    }

    // Text is already in English
    return {
      englishText: text,
      originalText: null,
      isTranslated: false
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    setIsLoading(true);
    try {
      const originalMessage = newMessage.trim();

      // Auto-detect and translate non-English languages to English
      const translationResult = await detectLanguageAndTranslate(originalMessage);

      // Get current user ID (mock for now)
      const userId = userType === 'driver' ? driverId : customerId;

      console.log('Storing message:', {
        message: translationResult.englishText,
        original_message: translationResult.originalText,
        is_translated: translationResult.isTranslated
      });

      // Create the message object
      const newMessageObj = {
        id: crypto.randomUUID(), // Temporary ID
        chat_id: chatId,
        sender_id: userId,
        sender_type: userType,
        message: translationResult.englishText,
        original_message: translationResult.originalText,
        original_language: translationResult.isTranslated ? 'auto' : null,
        translated_language: translationResult.isTranslated ? 'en' : null,
        is_translated: translationResult.isTranslated,
        created_at: new Date().toISOString(),
      };

      // Immediately add to local state for instant UI update
      setMessages(prev => [...prev, newMessageObj as Message]);
      setNewMessage(""); // Clear input immediately

      // Then save to database
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: userId,
          sender_type: userType,
          message: translationResult.englishText,
          original_message: translationResult.originalText,
          original_language: translationResult.isTranslated ? 'auto' : null,
          translated_language: translationResult.isTranslated ? 'en' : null,
          is_translated: translationResult.isTranslated,
        });

      if (error) {
        // If database save fails, remove the optimistic message
        setMessages(prev => prev.filter(msg => msg.id !== newMessageObj.id));
        throw error;
      }

      toast({
        title: "Message sent",
        description: translationResult.isTranslated 
          ? "Message auto-translated to English" 
          : "Message sent",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
            Chat with {userType === 'driver' ? 'Customer' : 'Driver'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_type === userType ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender_type === userType
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.is_translated && message.original_message ? (
                    <div className="space-y-2">
                      {/* Original message */}
                      <div className="border-b border-current/20 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            Original ({message.original_language?.toUpperCase()})
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{message.original_message}</p>
                      </div>

                      {/* Translated message */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            <Languages className="h-3 w-3 mr-1" />
                            English Translation
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
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
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