
import { useNavigate } from '@/lib/router-compat';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import TalentCategories from "@/components/TalentCategories";
import FeaturedArtists from "@/components/FeaturedArtists";
import Footer from "@/components/Footer";
import AdDisplay from "@/components/AdDisplay";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string, category: string, location: string) => {
    const searchParams = new URLSearchParams();
    
    if (query) searchParams.append('query', query);
    if (category && category !== 'all') searchParams.append('category', category);
    if (location && location !== 'all') searchParams.append('location', location);
    
    navigate(`/explore?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <Hero />
        
        {/* Banner Ad */}
        <AdDisplay position="banner" page="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4" />
        
        {/* Search Bar */}
        <section className="py-6 bg-gradient-to-b from-white to-swati-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-bold">Find Eswatini Talent</h2>
              <p className="text-gray-600">Connect with the skilled artists of Eswatini</p>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>
        
        {/* Categories */}
        <TalentCategories />
        
        {/* Inline Ad */}
        <AdDisplay position="inline" page="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8" />
        
        {/* Featured Artists */}
        <FeaturedArtists />
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-swati-purple to-swati-teal text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-serif mb-4">Ready to Showcase Your Talent?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                Join our community of talented EmaSwati artists and connect with potential clients.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="/signup" className="inline-block rounded-md border border-white bg-transparent px-8 py-3 text-base font-medium text-white hover:bg-white hover:text-swati-purple transition-colors">
                  Create Your Profile
                </a>
                <a href="/explore" className="inline-block rounded-md border bg-white px-8 py-3 text-base font-medium text-swati-purple hover:bg-opacity-90 transition-colors">
                  Explore Talent
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
