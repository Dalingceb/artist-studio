
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from '@/lib/router-compat';
import { Artist } from "@/types/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PortfolioGallery from "@/components/PortfolioGallery";
import { Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type ArtistProfileContentProps = {
  artistProfile: Artist | null;
  profileLoading: boolean;
};

const ArtistProfileContent: React.FC<ArtistProfileContentProps> = ({
  artistProfile,
  profileLoading,
}) => {
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleEditProfile = () => {
    if (artistProfile) {
      // Navigate to the edit profile page with the artist's data
      navigate("/create-profile", { 
        state: { 
          isEditing: true,
          artistProfile 
        } 
      });
    } else {
      toast({
        title: "Error",
        description: "Artist profile not found",
        variant: "destructive"
      });
    }
  };
  
  if (profileLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swati-purple mx-auto"></div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  } 
  
  if (artistProfile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium">{artistProfile.name}</h4>
            <p className="text-gray-500">{artistProfile.category}</p>
          </div>
          <Link to={`/artist/${artistProfile.id}`}>
            <Button variant="outline" size="sm">View Public Profile</Button>
          </Link>
        </div>
        
        <div>
          <p className="font-medium">Bio:</p>
          <p className="text-gray-700">{artistProfile.bio}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Phone:</p>
            <p className="text-gray-700">{artistProfile.phone}</p>
          </div>
          <div>
            <p className="font-medium">Location:</p>
            <p className="text-gray-700">{artistProfile.location}</p>
          </div>
          {artistProfile.website && (
            <div>
              <p className="font-medium">Website:</p>
              <p className="text-gray-700 truncate">{artistProfile.website}</p>
            </div>
          )}
        </div>
        
        <div className="pt-4 flex flex-wrap gap-3">
          <Button 
            className="bg-swati-purple hover:bg-swati-purple/90"
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsPortfolioOpen(true)}
          >
            <Image className="h-4 w-4" />
            Manage Portfolio
          </Button>
        </div>
        
        <Dialog open={isPortfolioOpen} onOpenChange={setIsPortfolioOpen}>
          <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Your Portfolio</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <PortfolioGallery artist={artistProfile} isEditable />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  return (
    <div className="text-center py-8 space-y-6">
      <p>You haven't created an artist profile yet.</p>
      <Link to="/create-profile">
        <Button className="bg-swati-purple hover:bg-swati-purple/90">
          Create Artist Profile
        </Button>
      </Link>
    </div>
  );
};

export default ArtistProfileContent;
