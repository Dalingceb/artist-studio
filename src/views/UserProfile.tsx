
import { useState, useEffect } from "react";
import { Navigate, Link } from '@/lib/router-compat';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Artist } from "@/types/database";
import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdDisplay from "@/components/AdDisplay";

// Imported refactored components
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserAccountCard from "@/components/profile/UserAccountCard";
import ProfileTabs from "@/components/profile/ProfileTabs";
import LoadingProfile from "@/components/profile/LoadingProfile";

const UserProfile = () => {
  const { user, userProfile, isLoading } = useAuth();
  const { toast } = useToast();
  const [artistProfile, setArtistProfile] = useState<Artist | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [defaultTab, setDefaultTab] = useState<string>("profile");

  useEffect(() => {
    const fetchArtistProfile = async () => {
      if (!user) return;
      
      try {
        setProfileLoading(true);
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        setArtistProfile(data as any as Artist);
        
        // If the user is an artist, set the default tab to "bookings"
        if (data) {
          setDefaultTab("bookings");
        }
      } catch (error: any) {
        console.error("Error fetching artist profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your artist profile",
          variant: "destructive"
        });
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchArtistProfile();
  }, [user, toast]);

  // If loading, show loading state
  if (isLoading) {
    return <LoadingProfile />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleEditProfile = () => {
    // Add edit profile functionality here
    console.log("Edit profile clicked");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileHeader 
            artistProfile={!!artistProfile} 
            userProfile={userProfile}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <UserAccountCard 
                user={user}
                profile={userProfile}
                onEditProfile={handleEditProfile}
              />
              
              {/* Add Messages Link Card */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link to="/messages">
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        My Messages
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar Ad */}
              <AdDisplay position="sidebar" page="profile" />
            </div>
            
            {/* Artist profile and bookings section */}
            <div className="md:col-span-3">
              <ProfileTabs 
                artistProfile={artistProfile}
                profileLoading={profileLoading}
                defaultTab={defaultTab}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
