-- Temporarily disable RLS for demo purposes or create more permissive policies
-- Update chat policies to allow demo usage without authentication

DROP POLICY IF EXISTS "Users can view chats they are part of" ON public.chats;
DROP POLICY IF EXISTS "Users can create chats" ON public.chats;
DROP POLICY IF EXISTS "Users can view messages from their chats" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can create messages in their chats" ON public.chat_messages;

-- Create more permissive policies for demo
CREATE POLICY "Allow all chat operations for demo"
ON public.chats
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all message operations for demo"
ON public.chat_messages
FOR ALL
USING (true)
WITH CHECK (true);