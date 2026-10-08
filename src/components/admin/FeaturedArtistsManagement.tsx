
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Star, StarOff } from 'lucide-react';

interface Artist {
  id: string;
  name: string;
  category: string;
  location: string;
  featured: boolean;
  featured_priority: number;
  rating: number;
}

const FeaturedArtistsManagement = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      console.log('Fetching artists...');
      const { data, error } = await supabase
        .from('artists')
        .select('id, name, category, location, featured, featured_priority, rating')
        .order('featured_priority', { ascending: false });

      if (error) {
        console.error('Error fetching artists:', error);
        throw error;
      }
      
      console.log('Artists fetched:', data);
      setArtists(data || []);
    } catch (error) {
      console.error('Error fetching artists:', error);
      toast.error('Failed to fetch artists');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextPriority = () => {
    const featuredArtists = artists.filter(artist => artist.featured);
    if (featuredArtists.length === 0) return 1;
    
    const highestPriority = Math.max(...featuredArtists.map(artist => artist.featured_priority || 0));
    return highestPriority + 1;
  };

  const toggleFeatured = async (artistId: string, currentFeatured: boolean) => {
    try {
      console.log(`Toggling featured status for artist ${artistId} from ${currentFeatured} to ${!currentFeatured}`);
      
      const newPriority = !currentFeatured ? getNextPriority() : 0;
      
      const { error } = await supabase
        .from('artists')
        .update({ 
          featured: !currentFeatured,
          featured_priority: newPriority
        })
        .eq('id', artistId);

      if (error) {
        console.error('Supabase error updating featured status:', error);
        throw error;
      }

      console.log('Featured status updated successfully');

      // Update local state
      setArtists(prev => 
        prev.map(artist => 
          artist.id === artistId 
            ? { ...artist, featured: !currentFeatured, featured_priority: newPriority }
            : artist
        )
      );

      toast.success(`Artist ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
    } catch (error: any) {
      console.error('Error updating featured status:', error);
      toast.error(`Failed to update featured status: ${error.message}`);
    }
  };

  const updatePriority = async (artistId: string, newPriority: number) => {
    try {
      console.log(`Updating priority for artist ${artistId} to ${newPriority}`);
      
      const { error } = await supabase
        .from('artists')
        .update({ featured_priority: newPriority })
        .eq('id', artistId);

      if (error) {
        console.error('Error updating priority:', error);
        throw error;
      }

      setArtists(prev => 
        prev.map(artist => 
          artist.id === artistId 
            ? { ...artist, featured_priority: newPriority }
            : artist
        )
      );

      toast.success('Priority updated successfully');
    } catch (error: any) {
      console.error('Error updating priority:', error);
      toast.error(`Failed to update priority: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading artists...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Artists Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell className="font-medium">{artist.name}</TableCell>
                <TableCell>{artist.category}</TableCell>
                <TableCell>{artist.location}</TableCell>
                <TableCell>{artist.rating ? artist.rating.toFixed(1) : 'N/A'}</TableCell>
                <TableCell>
                  {artist.featured ? (
                    <Badge variant="default">Featured</Badge>
                  ) : (
                    <Badge variant="secondary">Not Featured</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {artist.featured && (
                    <input
                      type="number"
                      value={artist.featured_priority}
                      onChange={(e) => updatePriority(artist.id, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border rounded"
                      min="0"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={artist.featured ? "outline" : "default"}
                    onClick={() => toggleFeatured(artist.id, artist.featured)}
                  >
                    {artist.featured ? (
                      <>
                        <StarOff size={16} className="mr-1" />
                        Unfeature
                      </>
                    ) : (
                      <>
                        <Star size={16} className="mr-1" />
                        Feature
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FeaturedArtistsManagement;
