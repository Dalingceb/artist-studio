import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { JobListing } from "@/types/database";
import { ScrollArea } from "@/components/ui/scroll-area";

type JobApplicationFormProps = {
  jobListing: JobListing;
  onSuccess: () => void;
  onCancel: () => void;
};

const JobApplicationForm = ({ jobListing, onSuccess, onCancel }: JobApplicationFormProps) => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState("");
  const [availability, setAvailability] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for jobs",
        variant: "destructive"
      });
      return;
    }

    // Check for artist profile in the artists table instead of just is_artist flag
    const { data: artistProfile, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!artistProfile) {
      toast({
        title: "Artist Profile Required",
        description: "You need to create an artist profile to apply for jobs. Please go to your profile settings to create one.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // First, get the client's ID from the job listing
      const { data: jobData, error: jobError } = await supabase
        .from('job_listings')
        .select('client_id')
        .eq('id', jobListing.id)
        .single();

      if (jobError) throw jobError;

      // Fetch client's name using client_id
      const { data: clientProfile, error: clientProfileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', jobData.client_id)
        .single();

      if (clientProfileError) throw clientProfileError;

      // Create the job application
      const { data: application, error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobListing.id,
          artist_id: user.id,
          client_id: jobData.client_id,
          cover_letter: coverLetter,
          proposed_rate: proposedRate,
          additional_info: additionalInfo,
          status: 'pending'
        })
        .select()
        .single();
      
      if (applicationError) throw applicationError;

      // Create a conversation between the artist and client
      // Before creating the conversation, ensure both profiles exist
      const { data: artistProfileData, error: artistProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
  
      if (!artistProfileData) {
        // Create artist profile if it doesn't exist
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: userProfile?.full_name,
            is_artist: true
          });
  
        if (createProfileError) throw createProfileError;
      }
  
      // Verify client profile exists
      const { data: clientData, error: clientError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', jobData.client_id)
        .single();
  
      if (!clientData) {
        toast({
          title: "Error",
          description: "Unable to message client. Client profile not found.",
          variant: "destructive"
        });
        return;
      }
  
      // Now create the conversation
      const { error: conversationError } = await supabase
        .from('conversations')
        .insert({
          job_listing_id: jobListing.id,
          user1_id: user.id,
          user2_id: jobData.client_id,
          user1_name: userProfile?.full_name,
          user2_name: clientData.full_name,
          last_message: `New job application for: ${jobListing.title}`
        });

      if (conversationError) throw conversationError;
      
      toast({
        title: "Application submitted!",
        description: `Your application has been sent successfully. The client will be notified.`,
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive"
      });
      console.error("Error creating job application:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cover-letter">Cover Letter</Label>
            <Textarea 
              id="cover-letter" 
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Introduce yourself and explain why you're a good fit for this job..." 
              className="min-h-[150px]" 
              required
            />
          </div>
          
          <div>
            <Label htmlFor="proposed-rate">Proposed Rate (SZL)</Label>
            <Input 
              id="proposed-rate" 
              type="number"
              value={proposedRate}
              onChange={(e) => setProposedRate(e.target.value)}
              required
              placeholder="Your proposed rate for this job"
            />
          </div>
          
          <div>
            <Label htmlFor="additional-info">Additional Information</Label>
            <Textarea 
              id="additional-info" 
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any other relevant information about your experience or requirements..." 
              className="min-h-[80px]" 
            />
          </div>
        </form>
      </ScrollArea>

      <div className="bg-white pt-4 pb-2 border-t mt-6">
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-swati-purple hover:bg-swati-purple-dark"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;