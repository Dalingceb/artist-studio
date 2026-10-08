
import React from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/database"; // Update import

type ProfileHeaderProps = {
  artistProfile: boolean;
  userProfile?: Profile | null; // Changed from UserMetadata
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  artistProfile,
  userProfile,
}) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        {artistProfile ? "Artist Dashboard" : "Your Profile"}
      </h1>
      <p className="text-gray-600">
        {artistProfile 
          ? "Manage your artist profile and bookings" 
          : "Manage your account and artist profile"}
      </p>
    </div>
  );
};

export default ProfileHeader;
