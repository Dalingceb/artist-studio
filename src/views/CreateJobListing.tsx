import { useNavigate } from '@/lib/router-compat';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import JobListingForm from "@/components/JobListingForm";
import Navbar from "@/components/Navbar";

const CreateJobListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSuccess = () => {
    navigate("/jobs"); // Fixed: Changed from /job-listings to /jobs to match the route in App.tsx
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create Job Listing</h1>
          <p className="text-gray-600 mb-8">
            Post your job listing to find the perfect artist for your event.
          </p>
          <JobListingForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateJobListing;