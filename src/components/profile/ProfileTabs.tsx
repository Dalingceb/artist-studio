
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Artist } from "@/types/database";
import ArtistProfileContent from "./ArtistProfileContent";
import BookingsList from "@/components/BookingsList";

interface ProfileTabsProps {
  artistProfile: Artist | null;
  profileLoading: boolean;
  defaultTab: string;
}

const ProfileTabs = ({ artistProfile, profileLoading, defaultTab }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (profileLoading) {
    return (
      <div className="md:col-span-2">
        <div className="text-center py-8">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="md:col-span-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">
            {artistProfile ? "Artist Profile" : "Profile"}
          </TabsTrigger>
          <TabsTrigger value="bookings">
            {artistProfile ? "My Bookings" : "My Bookings"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          {artistProfile ? (
            <ArtistProfileContent artistProfile={artistProfile} profileLoading={profileLoading} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Create Your Artist Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  You haven't created an artist profile yet. Create one to showcase your talents and connect with potential clients.
                </p>
                <a href="/create-profile" className="inline-block rounded-md bg-swati-purple px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition-colors">
                  Create Artist Profile
                </a>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="bookings">
          <BookingsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
