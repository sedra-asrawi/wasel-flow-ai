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

export const ChatInterface = ({ orderId, driverId, customerId, userType, onClose }: ChatInterfaceProps) => {
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

  const translateMessage = async (text: string, targetLang: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-translate', {
        body: {
          message: text,
          targetLanguage: targetLang,
          sourceLanguage: 'auto'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Translation error:', error);
      return null;
    }
  };

  const detectLanguageAndTranslate = async (text: string) => {
    // Simple language detection for Indian languages
    const hindiPattern = /[\u0900-\u097F]/; // Devanagari script (Hindi)
    const urduPattern = /[\u0600-\u06FF]/; // Arabic script (Urdu)
    
    let needsTranslation = false;
    let detectedLanguage = 'en';
    
    if (hindiPattern.test(text)) {
      needsTranslation = true;
      detectedLanguage = 'hi';
    } else if (urduPattern.test(text)) {
      needsTranslation = true;
      detectedLanguage = 'ur';
    }
    
    if (needsTranslation) {
      console.log('Translating text:', text, 'from', detectedLanguage, 'to English');
      const translationData = await translateMessage(text, 'en');
      console.log('Translation result:', translationData);
      
      // Make sure we get actual English text
      const englishText = translationData?.translatedText || 'Translation failed';
      
      return {
        englishText: englishText,  // This will be stored as 'message'
        originalText: text,        // This will be stored as 'original_message'
        sourceLanguage: detectedLanguage,
        targetLanguage: 'en',
        isTranslated: true
      };
    }
    
    return {
      englishText: text,  // No translation needed
      originalText: null,
      sourceLanguage: null,
      targetLanguage: null,
      isTranslated: false
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    setIsLoading(true);
    try {
      const originalMessage = newMessage.trim();
      
      // Auto-detect and translate Indian languages to English
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
        original_language: translationResult.sourceLanguage,
        translated_language: translationResult.targetLanguage,
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
          original_language: translationResult.sourceLanguage,
          translated_language: translationResult.targetLanguage,
          is_translated: translationResult.isTranslated,
        });

      if (error) {
        // If database save fails, remove the optimistic message
        setMessages(prev => prev.filter(msg => msg.id !== newMessageObj.id));
        throw error;
      }

      toast({
        title: "Message sent",
        description: translationResult.isTranslated ? "Message auto-translated to English" : "Message sent",
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
    <Card className="w-full max-w-md mx-auto h-[500px] flex flex-col">
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

      <CardContent className="flex-1 flex flex-col p-0">
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

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};