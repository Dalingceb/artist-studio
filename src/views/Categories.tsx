
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from '@/lib/router-compat';
import { Artist } from "@/types/database";

const Categories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryArtists, setCategoryArtists] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get all artists
        const { data: artists, error } = await supabase
          .from('artists')
          .select('category');

        if (error) throw error;

        if (!artists) {
          setCategories([]);
          setCategoryArtists({});
          return;
        }
        
        // Cast the data to the expected type before processing
        const artistsData = artists as unknown as Pick<Artist, 'category'>[];
        
        // Extract unique categories
        const uniqueCategories = [...new Set(artistsData.map(artist => artist.category))];
        setCategories(uniqueCategories);

        // Count artists per category
        const counts = uniqueCategories.reduce((acc, category) => {
          acc[category] = artistsData.filter((artist) => artist.category === category).length;
          return acc;
        }, {} as Record<string, number>);

        setCategoryArtists(counts);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message || "An error occurred while fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-swati-light">
          <div className="max-w-7xl mx-auto text-center py-12 text-red-500">
            <p className="mb-2">Error loading categories:</p>
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-swati-light">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-center mb-8">Explore Categories</h1>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-swati-purple mx-auto"></div>
              <p className="mt-4">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No categories found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link 
                  to={`/explore?category=${encodeURIComponent(category)}`} 
                  key={category}
                >
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-6">
                      <h2 className="font-serif font-bold text-xl mb-2">{category}</h2>
                      <p className="text-gray-600">
                        {categoryArtists[category]} {categoryArtists[category] === 1 ? 'artist' : 'artists'} available
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
