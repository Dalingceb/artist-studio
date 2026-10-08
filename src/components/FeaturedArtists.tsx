// @ts-nocheck -- ported from the original app; loose typing kept as-is

import { useState, useEffect } from "react";
import { Link } from '@/lib/router-compat';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/database";
import { useToast } from "@/components/ui/use-toast";

const FeaturedArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchFeaturedArtists = async () => {
      try {
        console.log("Fetching featured artists...");
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('featured', true)
          .order('featured_priority', { ascending: false })
          .limit(8);
          
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Featured artists data received:", data);
        setArtists(data || []);
      } catch (err: any) {
        console.error("Error fetching featured artists:", err);
        setError(err.message || "Failed to load featured artists");
        
        toast({
          title: "Error",
          description: "Failed to load featured artists. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedArtists();
  }, [toast]);
  
  if (loading) {
    return (
      <section className="py-16 bg-swati-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif mb-4 text-swati-dark">Featured Artists</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Meet some of our exceptional EmaSwati talent showcasing the rich artistic heritage and creative excellence
            </p>
          </div>
          
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-swati-purple mx-auto"></div>
            <p className="mt-4">Loading featured artists...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-swati-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif mb-4 text-swati-dark">Featured Artists</h2>
            <p className="text-red-500 mt-4">Failed to load featured artists. Please try again later.</p>
            <p className="text-gray-500 mt-2">Error: {error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-swati-purple hover:bg-swati-purple/90"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-swati-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-serif mb-4 text-swati-dark">Featured Artists</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Meet some of our exceptional EmaSwati talent showcasing the rich artistic heritage and creative excellence
          </p>
        </div>

        {artists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No featured artists available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {artists.map((artist) => (
              <div 
                key={artist.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={artist.profile_image || '/default-profile.png'}
                    alt={artist.name}
                    className="object-cover w-full h-48"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{artist.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{artist.category}</p>
                  <p className="text-sm text-gray-500 mb-3">{artist.location}</p>
                  <div className="flex justify-between items-center">
                    <Link 
                      to={`/artist/${artist.id}`}
                      className="text-swati-purple hover:text-swati-purple/90 text-sm font-medium"
                    >
                      View Profile
                    </Link>
                    {artist.rating && (
                      <span className="text-sm text-yellow-600">
                        ⭐ {artist.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedArtists;
