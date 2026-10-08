
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LoadingProfile: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-swati-purple mx-auto"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingProfile;
