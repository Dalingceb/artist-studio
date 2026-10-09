import { useState, useEffect } from "react";
import React from 'react';

import { useParams, Link } from '@/lib/router-compat';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, MapPin, Phone, Mail, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Artist } from "@/types/database";
import BookingForm from "@/components/BookingForm";
import PortfolioGallery from "@/components/PortfolioGallery";
import ReviewsSection from "@/components/ReviewsSection";
import AdDisplay from "@/components/AdDisplay";
import Messages from '@/views/Messages';

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("artists")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Artist not found");

        setArtist(data as any as Artist);

        if (user) {
          setIsOwnProfile(data.user_id === user.id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load artist profile");
        console.error("Error fetching artist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id, user]);

  const handleBookingComplete = () => {
    setIsBookingOpen(false);
    toast({
      title: "Booking Request Sent",
      description: "Your booking request has been sent. The artist will contact you to confirm.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-swati-purple mx-auto"></div>
            <p className="mt-4">Loading artist profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-500">Error</h1>
            <p className="mt-2">{error || "Failed to load artist profile"}</p>
            <Link to="/explore">
              <Button variant="link" className="mt-4">
                Return to Explore
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  function handleMessageArtist(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <><div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="relative h-48 md:h-72 bg-gradient-to-r from-swati-purple/90 to-swati-teal/90">
          {artist.banner_image ? (
            <img
              src={artist.banner_image}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-swati-purple/30 to-swati-teal/30"></div>
          )}
        </div>

        <div className="relative -mt-16 md:-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                {artist.profile_image ? (
                  <img
                    src={artist.profile_image}
                    alt={artist.name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-swati-purple/10">
                    <span className="text-4xl font-bold text-swati-purple">{artist.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="w-full min-w-0 bg-white p-4 md:p-6 rounded-lg shadow-lg flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold font-serif">{artist.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
                    <span className="text-gray-600">{artist.category}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-500 mr-1" />
                      <span className="text-gray-600 text-sm">{artist.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${star <= artist.rating ? "fill-swati-gold text-swati-gold" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-semibold">
                      {artist.rating > 0 ? artist.rating.toFixed(1) : "New"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 items-stretch md:items-end shrink-0">
                  <Button className="bg-swati-purple hover:bg-swati-purple/90" onClick={() => setIsBookingOpen(true)}>
                    Book Now
                  </Button>
                  {user && !isOwnProfile && (
                    <Link
                      to={`/messages?artistId=${artist.user_id}&artistName=${encodeURIComponent(artist.name)}`}
                      className="inline-flex"
                    >
                      <Button variant="outline" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Message
                      </Button>
                    </Link>
                  )}
                  {isOwnProfile && (
                    <div className="flex flex-col gap-2">
                      <Link to="/profile">
                        <Button variant="outline">Manage Profile</Button>
                      </Link>
                      <Link to="/messages">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          My Messages
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Book {artist.name}</DialogTitle>
                    </DialogHeader>
                    <BookingForm
                      artist={artist}
                      onSuccess={handleBookingComplete}
                      onCancel={() => setIsBookingOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16">
          {/* Banner Ad */}
          <AdDisplay position="banner" page="artist-profile" className="mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {/* Sidebar Ad */}
              <AdDisplay position="sidebar" page="artist-profile" />
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-serif font-bold text-lg mb-4 pb-2 border-b">Contact Details</h3>
                  <div className="space-y-4">
                    {artist.website && (
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-swati-purple mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold">Website</h4>
                          <a
                            href={artist.website.startsWith("http") ? artist.website : `https://${artist.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-swati-purple hover:underline"
                          >
                            {artist.website}
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-swati-purple mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold">Phone</h4>
                        <p className="text-sm text-gray-600">{artist.phone}</p>
                      </div>
                    </div>
                    {artist.rate && (
                      <div className="flex items-start">
                        <div>
                          <h4 className="text-sm font-semibold">Rate</h4>
                          <p className="text-sm text-gray-600">{artist.rate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-serif font-bold text-lg mb-4">Biography</h3>
                      <p className="text-gray-700 whitespace-pre-line">{artist.bio}</p>
                    </CardContent>
                  </Card>
                  
                  {/* Inline Ad */}
                  <AdDisplay position="inline" page="artist-profile" />
                </TabsContent>
                <TabsContent value="portfolio">
                  <PortfolioGallery artist={artist} />
                </TabsContent>
                <TabsContent value="reviews">
                  <ReviewsSection artist={artist} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    
    </>
  );
};

export default ArtistProfile;
