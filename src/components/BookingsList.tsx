
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Calendar, MapPin, User, DollarSign } from 'lucide-react';

interface ArtistBooking {
  id: string;
  client_id: string;
  event_title: string;
  event_date: string;
  event_time?: string;
  location: string;
  description?: string;
  proposed_price: string;
  booking_purpose: string;
  additional_requirements?: string;
  status: string;
  created_at: string;
  client: {
    full_name: string;
  };
}

interface BookingWithArtist {
  id: string;
  client_id: string;
  artist_id: string;
  event_title: string;
  event_date: string;
  event_time?: string;
  location: string;
  description?: string;
  proposed_price?: string;
  booking_purpose: string;
  additional_requirements?: string;
  status: string;
  created_at: string;
  artist: {
    name: string;
    category: string;
  };
}

const BookingsList = () => {
  const { user, userProfile } = useAuth();
  const [artistBookings, setArtistBookings] = useState<ArtistBooking[]>([]);
  const [clientBookings, setClientBookings] = useState<BookingWithArtist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && userProfile) {
      fetchBookings();
    }
  }, [user, userProfile]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      if (userProfile?.is_artist) {
        // Fetch bookings for this artist
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (artistError) throw artistError;

        if (artistData) {
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              client:profiles!bookings_client_id_fkey(full_name)
            `)
            .eq('artist_id', artistData.id)
            .order('created_at', { ascending: false });

          if (bookingsError) throw bookingsError;

          // Transform the data to match the expected type
          const transformedData: ArtistBooking[] = (bookingsData || []).map((booking: any) => ({
            ...booking,
            client: {
              full_name: booking.client?.full_name || 'Unknown Client'
            }
          }));

          setArtistBookings(transformedData);
        }
      } else {
        // Fetch bookings made by this client
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            artist:artists!bookings_artist_id_fkey(name, category)
          `)
          .eq('client_id', user?.id)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        // Transform the data to match the expected type
        const transformedData: BookingWithArtist[] = (bookingsData || []).map((booking: any) => ({
          ...booking,
          artist: {
            name: booking.artist?.name || 'Unknown Artist',
            category: booking.artist?.category || 'Unknown Category'
          }
        }));

        setClientBookings(transformedData);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Booking status updated successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swati-purple"></div>
      </div>
    );
  }

  const bookingsToShow = userProfile?.is_artist ? artistBookings : clientBookings;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {userProfile?.is_artist ? 'Booking Requests' : 'My Bookings'}
      </h2>
      
      {bookingsToShow.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No bookings found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookingsToShow.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{booking.event_title}</CardTitle>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-sm">
                      {userProfile?.is_artist 
                        ? (booking as ArtistBooking).client.full_name
                        : (booking as BookingWithArtist).artist.name
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm">
                      {new Date(booking.event_date).toLocaleDateString()}
                      {booking.event_time && ` at ${booking.event_time}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-sm">{booking.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign size={16} className="text-gray-500" />
                    <span className="text-sm">{booking.proposed_price}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Purpose:</p>
                  <p className="text-sm text-gray-600">{booking.booking_purpose}</p>
                </div>
                
                {booking.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                    <p className="text-sm text-gray-600">{booking.description}</p>
                  </div>
                )}
                
                {booking.additional_requirements && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Additional Requirements:</p>
                    <p className="text-sm text-gray-600">{booking.additional_requirements}</p>
                  </div>
                )}
                
                {userProfile?.is_artist && booking.status === 'pending' && (
                  <div className="flex space-x-2 pt-4">
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Decline
                    </Button>
                  </div>
                )}
                
                {userProfile?.is_artist && booking.status === 'confirmed' && (
                  <div className="pt-4">
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Mark as Completed
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsList;
