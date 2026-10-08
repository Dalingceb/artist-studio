// @ts-nocheck -- ported from the original app; loose typing kept as-is
import { useState, useEffect } from "react";
import { useNavigate } from '@/lib/router-compat';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import JobListingsList from "@/components/JobListingsList";
import Navbar from "@/components/Navbar";

const JobListings = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [isArtistView, setIsArtistView] = useState(false);

  // Set artist view automatically based on user profile
  useEffect(() => {
    if (userProfile?.is_artist) {
      setIsArtistView(true);
    }
  }, [userProfile]);

  const handleCreateJob = () => {
    navigate("/create-job");
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Job Listings</h1>
            <p className="text-gray-600 mt-2">
              {isArtistView 
                ? "Find opportunities and connect with potential clients"
                : "Browse and manage your job listings"}
            </p>
          </div>
          {!isArtistView && user && (
            <Button onClick={handleCreateJob}>
              Create Job Listing
            </Button>
          )}
        </div>

        {/* Only show view toggle for testing/admin purposes */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setIsArtistView(!isArtistView)}
            >
              {isArtistView ? "View Client View" : "View Artist View"}
            </Button>
          </div>
        )}

        <JobListingsList isArtistView={isArtistView} />
      </div>
    </div>
  );
};

export default JobListings;