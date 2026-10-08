
import { useState, useEffect } from "react";
import { useSearchParams } from '@/lib/router-compat';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ArtistSearchResults from "@/components/ArtistSearchResults";
import AdDisplay from "@/components/AdDisplay";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchState, setSearchState] = useState({
    query: searchParams.get("query") || "",
    category: searchParams.get("category") || "all",
    location: searchParams.get("location") || "all"
  });

  const handleSearch = (query: string, category: string, location: string) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (category !== "all") params.set("category", category);
    if (location !== "all") params.set("location", location);
    setSearchParams(params);
    setSearchState({ query, category, location });
  };

  // Update search state when URL parameters change
  useEffect(() => {
    setSearchState({
      query: searchParams.get("query") || "",
      category: searchParams.get("category") || "all",
      location: searchParams.get("location") || "all"
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-swati-light">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-serif font-bold text-center mb-6">Discover Talent in Eswatini</h1>
            <SearchBar 
              onSearch={handleSearch}
              initialQuery={searchState.query}
              initialCategory={searchState.category}
              initialLocation={searchState.location}
            />
          </div>
          
          {/* Banner Ad */}
          <AdDisplay position="banner" page="explore" className="my-6" />
          
          <div className="mt-10">
            <ArtistSearchResults 
              searchQuery={searchState.query}
              category={searchState.category}
              location={searchState.location}
            />
          </div>
          
          {/* Inline Ad */}
          <AdDisplay position="inline" page="explore" className="my-8" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
