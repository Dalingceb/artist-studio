
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const BookingsDebug = () => {
  const { user } = useAuth();
  const [artistId, setArtistId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log("Fetching artist data for user:", user.id);
        
        // First get artist ID
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (artistError) {
          console.error("Artist lookup error:", artistError);
          setError(`Artist error: ${artistError.message}`);
          setLoading(false);
          return;
        }
        
        if (!artistData) {
          setError("No artist profile found for this user");
          setLoading(false);
          return;
        }
        
        console.log("Artist found:", artistData);
        setArtistId(artistData.id);
        
        // Now get bookings with more details
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id, client_id, event_title, event_date, event_time, 
            location, description, booking_purpose, additional_requirements,
            status, created_at,
            client:user_metadata(full_name, phone)
          `)
          .eq('artist_id', artistData.id);
          
        if (bookingsError) {
          console.error("Bookings fetch error:", bookingsError);
          setError(`Bookings error: ${bookingsError.message}`);
          setLoading(false);
          return;
        }
        
        console.log("Debug bookings data:", bookingsData);
        setBookings(bookingsData || []);
      } catch (err: any) {
        console.error("Full error object:", err);
        setError(`Unexpected error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (loading) return <div>Loading debug data...</div>;
  
  if (error) {
    return (
      <Card className="bg-red-50">
        <CardHeader>
          <CardTitle>Bookings Debug Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Debug Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <strong>Artist ID:</strong> {artistId}
        </div>
        <div className="mb-4">
          <strong>Raw Bookings Count:</strong> {bookings.length}
        </div>
        
        {bookings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-xs">{booking.id.substring(0, 8)}...</TableCell>
                  <TableCell>{booking.client?.full_name || 'Unknown'}</TableCell>
                  <TableCell>{booking.event_title}</TableCell>
                  <TableCell>{booking.event_date}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4 bg-yellow-100 rounded">
            No booking records found for this artist.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsDebug;
