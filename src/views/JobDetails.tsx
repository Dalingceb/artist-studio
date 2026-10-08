import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@/lib/router-compat';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { JobListing } from '@/types/database';

type JobListingWithClient = JobListing & {
  client: {
    id: string;
    full_name: string;
  };
};

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [jobListing, setJobListing] = useState<JobListingWithClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobListing = async () => {
      try {
        const { data, error } = await supabase
          .from('job_listings')
          .select(`
            *,
            client:profiles!job_listings_client_id_fkey(id, full_name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setJobListing(data as JobListingWithClient);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job listing');
      } finally {
        setLoading(false);
      }
    };

    fetchJobListing();
  }, [id]);

  const handleContactClient = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to contact the client',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if a conversation already exists
      const { data: existingConversation, error: conversationError } = await supabase
        .from('conversations')
        .select('id')
        .eq('artist_id', user.id)
        .eq('client_id', jobListing?.client.id)
        .single();

      if (conversationError && conversationError.code !== 'PGRST116') {
        throw conversationError;
      }

      let conversationId;

      if (existingConversation) {
        conversationId = existingConversation.id;
      } else {
        // Create a new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            artist_id: user.id,
            client_id: jobListing?.client.id,
          })
          .select()
          .single();

        if (createError) throw createError;
        conversationId = newConversation.id;
      }

      // Navigate to the messages page with the conversation
      navigate(`/messages?conversation=${conversationId}`);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!jobListing) return <div>Job listing not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{jobListing.title}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p className="text-gray-700">{jobListing.description}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Budget Range</h2>
          <p className="text-gray-700">{jobListing.budget_range || 'Not specified'}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p className="text-gray-700">{jobListing.location}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Event Date</h2>
          <p className="text-gray-700">{new Date(jobListing.event_date).toLocaleDateString()}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <p className="text-gray-700">{jobListing.requirements || 'No specific requirements'}</p>
        </div>

        {user && user.id !== jobListing.client.id && (
          <Button
            onClick={handleContactClient}
            className="w-full md:w-auto"
          >
            Contact Client
          </Button>
        )}
      </div>
    </div>
  );
}