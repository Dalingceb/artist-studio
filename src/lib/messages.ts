// src/lib/api/messages.ts
import { supabase } from '@/lib/supabase';

export const markMessageAsRead = async (messageId: string, userId: string) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', messageId)
    .eq('recipient_id', userId); // RLS protection

  if (error) {
    console.error('Error marking message as read:', error);
    throw new Error(error.message);
  }
};
