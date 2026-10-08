// @ts-nocheck -- ported from the original app; loose typing kept as-is
import { useState, useEffect } from "react";
import { useNavigate } from '@/lib/router-compat';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { JobListing } from "@/types/database";

type JobListingWithClient = Partial<JobListing> & {
  client: {
    full_name: string;
  };
  job_applications?: {
    status: 'pending' | 'accepted' | 'rejected';
  }[];
};

type JobListingsListProps = {
  isArtistView?: boolean;
};

const JobListingsList = ({ isArtistView = false }: JobListingsListProps) => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<JobListingWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('job_listings')
          .select(`
            *,
            client:profiles!job_listings_client_id_fkey(full_name),
            job_applications!job_applications_job_id_fkey(status)
          `);

        if (isArtistView) {
          // For artists, show all listings and their applications
          query = query.eq('job_applications.artist_id', user.id);
        } else {
          // For clients, show only their own listings
          query = query.eq('client_id', user.id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setListings(data as JobListingWithClient[]);
      } catch (error: any) {
        console.error("Error fetching job listings:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load job listings",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, isArtistView]);

  const handleApply = async (listingId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for jobs",
        variant: "destructive"
      });
      return;
    }

    if (!userProfile?.is_artist) {
      toast({
        title: "Artist Profile Required",
        description: "You need to create an artist profile to apply for jobs",
        variant: "destructive"
      });
      return;
    }

    // Navigate to the application form
    navigate(`/jobs/${listingId}/apply`);
  };

  if (loading) return <div>Loading job listings...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!listings.length) return <div>No job listings found.</div>;

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <Card 
          key={listing.id} 
          className="hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{listing.title}</h3>
                <p className="text-sm text-gray-500">Posted by {listing.client?.full_name}</p>
              </div>
              <Badge variant={listing.status === 'open' ? 'default' : 'secondary'}>
                {listing.status?.toUpperCase()}
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(listing.event_date), 'PPP')}</span>
                {listing.event_time && (
                  <>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{listing.event_time}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{listing.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4" />
                <span>{listing.category}</span>
              </div>
            </div>

            <p className="mt-4 text-gray-700">{listing.description}</p>

            {listing.budget_range && (
              <p className="mt-2 text-sm text-gray-600">
                Budget Range: SZL {listing.budget_range}
              </p>
            )}

            {isArtistView && (
              <div className="mt-4 flex justify-end gap-2">
                {listing.job_applications?.[0] ? (
                  <Badge variant={
                    listing.job_applications[0].status === 'pending' ? 'default' :
                    listing.job_applications[0].status === 'accepted' ? 'success' :
                    'destructive'
                  }>
                    {listing.job_applications[0].status.toUpperCase()}
                  </Badge>
                ) : listing.status === 'open' ? (
                  <Button 
                    onClick={() => handleApply(listing.id)}
                  >
                    Apply Now
                  </Button>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobListingsList;