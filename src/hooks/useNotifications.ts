import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

export const useNotifications = () => {
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      // Get unread messages count
      const { count: messagesCount, error: messagesError } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (!messagesError && messagesCount !== null) {
        setUnreadMessages(messagesCount);
      }

      // Get artist profile to determine booking context
      const { data: artistData } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (artistData) {
        // For artists – pending bookings received
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('artist_id', artistData.id)
          .eq('status', 'pending');

        if (!bookingsError && bookingsCount !== null) {
          setPendingBookings(bookingsCount);
        }
      } else {
        // For clients – their pending booking requests
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('client_id', user.id)
          .eq('status', 'pending');

        if (!bookingsError && bookingsCount !== null) {
          setPendingBookings(bookingsCount);
        }
      }
    };

    fetchNotifications();

    // Set up real-time subscriptions
    const messagesSubscription = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    const bookingsSubscription = supabase
      .channel('bookings-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      messagesSubscription.unsubscribe();
      bookingsSubscription.unsubscribe();
    };
  }, [user]);

  return {
    unreadMessages,
    pendingBookings,
    totalNotifications: unreadMessages + pendingBookings,
  };
};
