// @ts-nocheck -- ported from the original app; loose typing kept as-is
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { supabaseAnonKey } from '@/lib/supabase';

type Message = {
  recipient_id: string;
  is_read: any;
  sender_profile_image: string;
  media_url: any;
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
};

// Fix the Conversation type definition
type Conversation = {
  id: string;  // Change this from a function to a string property
  conversation_with_id: string;
  conversation_with_name: string;
  last_message: string;
  updated_at: string;
  profile_image?: string;
};

export const useConversation = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch conversations
  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const formattedConversations = data.map(conv => ({
          id: conv.id,
          conversation_with_id: conv.user1_id === user.id ? conv.user2_id : conv.user1_id,
          conversation_with_name: conv.user1_id === user.id ? conv.user2_name : conv.user1_name,
          last_message: conv.last_message,
          updated_at: conv.updated_at,
          profile_image: conv.user1_id === user.id ? conv.user2_profile_image : conv.user1_profile_image
        }));

        setConversations(formattedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user || !selectedConversationId) return;

    const subscription = supabase
      .channel(`conversation_${selectedConversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedConversationId}`
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedConversationId, user]);

  // Add this effect to fetch messages when conversation is selected
  useEffect(() => {
    if (!user || !selectedConversationId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', selectedConversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedConversationId, user]);

  // Modify the startConversation function to properly handle existing conversations
  const startConversation = async (userId: string, userName: string) => {
    if (!user) return;
    
    try {
      // First, check if conversation exists
      const { data: existingConv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${userId}),and(user1_id.eq.${userId},user2_id.eq.${user.id})`)
        .single();
  
      if (existingConv) {
        // Always update the conversations list with the latest data
        const existingConvInList = conversations.find(conv => conv.id === existingConv.id);
        if (!existingConvInList) {
          setConversations(prev => [{
            id: existingConv.id,
            conversation_with_id: userId,
            conversation_with_name: userName,
            last_message: existingConv.last_message,
            updated_at: existingConv.updated_at,
            profile_image: existingConv.user1_id === user.id ? existingConv.user2_profile_image : existingConv.user1_profile_image
          }, ...prev]);
        }
        
        setSelectedConversationId(existingConv.id);
        setSelectedUserName(userName);
        return existingConv.id;
      }
  
      // Set the selected conversation without modifying the list if it already exists
      const existingConvInList = conversations.find(conv => conv.id === existingConv.id);
      if (existingConvInList) {
        setSelectedConversationId(existingConv.id);
        setSelectedUserName(userName);
        return;
      }
      
      // If no existing conversation, create a new one
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          user1_id: user.id,
          user2_id: userId,
          user1_name: user.user_metadata.full_name,
          user2_name: userName,
          last_message: '',
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
  
      if (createError) throw createError;
  
      setSelectedConversationId(newConv.id);
      setSelectedUserName(userName);
      
      // Add to conversations list
      setConversations(prev => [{
        id: newConv.id,
        conversation_with_id: userId,
        conversation_with_name: userName,
        last_message: '',
        updated_at: newConv.updated_at,
        profile_image: undefined
      }, ...prev]);
  
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string, file?: File) => {
    if (!user || !selectedConversationId) return;
  
    setSending(true);
    try {
      let mediaUrl = null;
      
      if (file) {
        mediaUrl = await uploadMedia(file);
      }
  
      // First get the conversation details
      const { data: conversationData, error: convFetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', selectedConversationId)
        .single();
  
      if (convFetchError) throw convFetchError;
      if (!conversationData) throw new Error('Conversation not found');
  
      // Determine the recipient ID
      const recipientId = conversationData.user1_id === user.id 
        ? conversationData.user2_id 
        : conversationData.user1_id;
  
      // Insert the message
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          sender_name: user.user_metadata.full_name,
          message: message,
          media_url: mediaUrl,
          media_type: file?.type,
          media_size: file?.size,
          created_at: new Date().toISOString()
        });
  
      if (msgError) throw msgError;
  
      // Update the conversation's last message
      const { error: convError } = await supabase
        .from('conversations')
        .update({
          last_message: message,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedConversationId);
  
      if (convError) throw convError;
  
      // Add message to local state
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        conversation_id: selectedConversationId,
        sender_id: user.id,
        sender_name: user.user_metadata.full_name,
        message: message,
        is_read: false,
        recipient_id: recipientId,
        media_url: mediaUrl,
        created_at: new Date().toISOString(),
        sender_profile_image: user.user_metadata.profile_image || ''

     
     
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setSending(false);
    }
  };

  const uploadMedia = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `message-media/${fileName}`;

    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  return {
    conversations,
    messages,
    selectedConversationId,
    selectedUserName,
    loading,
    sending,
    startConversation,
    sendMessage,
    setSelectedConversationId,
    setSelectedUserName,  // Add this
    setConversations,     // Add this
  };
};
