import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { Link } from '@/lib/router-compat';
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/database";

interface ArtistSearchResultsProps {
  searchQuery: string;
  category: string;
  location: string;
}

const ArtistSearchResults = ({ searchQuery, category, location }: ArtistSearchResultsProps) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('artists')
          .select('*');

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }
        
        if (location && location !== 'all') {
          query = query.ilike('location', `%${location}%`);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        
        setArtists(data as Artist[]);
      } catch (err: any) {
        console.error("Error fetching artists:", err);
        setError(err.message || "An error occurred while fetching artists");
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [searchQuery, category, location]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-swati-purple mx-auto"></div>
        <p className="mt-4">Loading artists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p className="mb-2">Error loading artists:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">No artists found in this category.</p>
        <p className="mt-2">View our <Link to="/explore" onClick={() => window.location.reload()} className="text-swati-purple hover:underline">complete list of artists</Link> instead.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artists.map((artist) => (
        <Link to={`/artist/${artist.id}`} key={artist.id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
            <div className="h-48 overflow-hidden">
              <img
                src={artist.profile_image || "https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="font-serif font-bold text-lg">{artist.name}</h3>
              <p className="text-gray-600">{artist.category}</p>
              <div className="flex items-center mt-1">
                <MapPin size={16} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">{artist.location}</span>
              </div>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={16} 
                      className={`${star <= artist.rating ? 'fill-swati-gold text-swati-gold' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm font-semibold">{artist.rating > 0 ? artist.rating.toFixed(1) : "New"}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ArtistSearchResults;
