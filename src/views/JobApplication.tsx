import { useState, useEffect } from "react";
import { useParams, useNavigate } from '@/lib/router-compat';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { JobListing } from "@/types/database";
import { useToast } from "@/components/ui/use-toast";
import JobApplicationForm from "@/components/JobApplicationForm";
import Navbar from "@/components/Navbar";

const JobApplication = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [jobListing, setJobListing] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobListing = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('job_listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Job listing not found");

        setJobListing(data as JobListing);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load job listing",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobListing();
  }, [id]);

  const handleSuccess = () => {
    navigate('/jobs');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!user || !userProfile?.is_artist) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p>You must be logged in as an artist to apply for jobs.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !jobListing) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p>{error || "Job listing not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Apply for Job</h1>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">{jobListing.title}</h2>
          <p className="text-gray-600 mb-4">{jobListing.description}</p>
          <div className="text-sm text-gray-500">
            <p>Location: {jobListing.location}</p>
            <p>Event Date: {jobListing.event_date}</p>
            {jobListing.budget_range && (
              <p>Budget Range: {jobListing.budget_range}</p>
            )}
          </div>
        </div>
        <JobApplicationForm
          jobListing={jobListing}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default JobApplication;