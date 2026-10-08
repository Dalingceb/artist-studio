
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCreation from "@/components/ProfileCreation";
import { Navigate } from '@/lib/router-compat';
import { useAuth } from "@/hooks/useAuth";

const ArtistProfileCreation = () => {
  const { user, userProfile, isLoading } = useAuth();

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-swati-purple mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-white to-swati-light py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create Your Artist Profile</h1>
            <p className="text-gray-600">Showcase your talent and connect with potential clients across Eswatini</p>
          </div>
          
          <ProfileCreation />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArtistProfileCreation;
