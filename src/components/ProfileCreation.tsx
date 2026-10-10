// @ts-nocheck -- ported from the original app; loose typing kept as-is
import { useState, useRef } from "react";
import { useNavigate, useLocation } from '@/lib/router-compat';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PlusCircle, LinkIcon, Trash2, Upload, Camera } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const categories = [
  "Music & Performance",
  "Visual Arts & Design",
  "Creative Writing & Literature",
  "Dance & Movement",
  "Theatre & Acting",
  "Photography",
  "Film & Video",
  "Public Speaking",
  "Traditional Arts",
  "Other (Specify in Biography)"
];

const locations = [
  "Mbabane",
  "Manzini",
  "Lobamba",
  "Siteki",
  "Nhlangano",
  "Pigg's Peak",
  "Malkerns",
  "Ezulwini Valley",
  "Matsapha",
  "Big Bend",
  "Mhlume",
  "Simunye",
  "Lavumisa",
  "Other"
];

type SocialMedia = {
  id: string;
  platform: string;
  url: string;
};

const socialPlatforms = [
  "Instagram",
  "Facebook",
  "Twitter",
  "YouTube",
  "TikTok",
  "SoundCloud",
  "LinkedIn",
  "Website",
  "Other"
];

const ProfileCreation = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditing, artistProfile } = location.state || {};
  const profileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: isEditing ? artistProfile?.name : userProfile?.full_name || "",
    bio: isEditing ? artistProfile?.bio : "",
    category: isEditing ? artistProfile?.category : categories[0],
    phone: isEditing ? artistProfile?.phone : "", // Remove userProfile?.phone reference
    location: isEditing ? artistProfile?.location : locations[0],
  });

  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>(() => {
    if (isEditing && artistProfile?.social_links) {
      const links = JSON.parse(artistProfile.social_links);
      return Object.entries(links).map(([platform, url]) => ({
        id: uuidv4(),
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        url: url as string
      }));
    }
    return [{ id: uuidv4(), platform: "Instagram", url: "" }];
  });
  
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    isEditing ? artistProfile?.profile_image : null
  );
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    isEditing ? artistProfile?.banner_image : null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleAddSocialMedia = () => {
    setSocialMedia([
      ...socialMedia,
      { id: uuidv4(), platform: socialPlatforms[0], url: "" }
    ]);
  };

  const handleRemoveSocialMedia = (id: string) => {
    setSocialMedia(socialMedia.filter(social => social.id !== id));
  };

  const handleSocialMediaChange = (id: string, field: 'platform' | 'url', value: string) => {
    setSocialMedia(socialMedia.map(social => 
      social.id === id ? { ...social, [field]: value } : social
    ));
  };
  
  const uploadImage = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}_${uuidv4()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('artist-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('artist-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a profile",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Process social media links into a website field and additional data
      const mainWebsite = socialMedia.find(s => s.platform === 'Website')?.url || 
                         socialMedia[0]?.url || '';
      
      // Convert the socialMedia array to a JSON string for storage
      const socialLinksJSON = JSON.stringify(
        socialMedia
          .filter(s => s.url.trim() !== '')
          .reduce((acc, social) => {
            acc[social.platform.toLowerCase()] = social.url;
            return acc;
          }, {} as Record<string, string>)
      );

      // Upload images if selected
      let profileImageUrl = isEditing ? artistProfile?.profile_image : null;
      let bannerImageUrl = isEditing ? artistProfile?.banner_image : null;

      if (profileImage) {
        profileImageUrl = await uploadImage(profileImage, 'profile');
      }

      if (bannerImage) {
        bannerImageUrl = await uploadImage(bannerImage, 'banner');
      }
      
      const artistData = {
        user_id: user.id,
        name: formData.name,
        bio: formData.bio,
        category: formData.category,
        phone: formData.phone.startsWith('+268') ? formData.phone : `+268 ${formData.phone}`,
        location: formData.location,
        website: mainWebsite,
        social_links: socialLinksJSON,
        profile_image: profileImageUrl,
        banner_image: bannerImageUrl
      };

      let data;
      if (isEditing) {
        // Update existing profile
        const { data: updateData, error: updateError } = await supabase
          .from('artists')
          .update(artistData)
          .eq('id', artistProfile.id)
          .select()
          .single();
          
        if (updateError) throw updateError;
        data = updateData;
      } else {
        // Create new profile
        const { data: insertData, error: insertError } = await supabase
          .from('artists')
          .insert(artistData)
          .select()
          .single();
          
        if (insertError) throw insertError;
        data = insertData;
      }
      
      // Update user profile
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.name,
          profile_image: profileImageUrl,
          is_artist: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      toast({
        title: isEditing ? "Profile updated!" : "Profile created!",
        description: isEditing 
          ? "Your artist profile has been updated successfully."
          : "Your artist profile has been created successfully.",
      });
      
      navigate(`/artist/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} artist profile`,
        variant: "destructive"
      });
      console.error("Error handling profile:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold gradient-heading">
          {isEditing ? "Edit Your Artist Profile" : "Create Your Artist Profile"}
        </h2>
        <p className="text-gray-600">
          {isEditing 
            ? "Update your profile information" 
            : "Share your talent with Eswatini and beyond"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image Upload */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="font-serif text-lg font-medium mb-4 pb-2 border-b">Profile Images</h3>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex flex-col items-center">
              <Label htmlFor="profile-image" className="mb-2">Profile Picture</Label>
              <div className="relative group cursor-pointer" onClick={() => profileInputRef.current?.click()}>
                <Avatar className="w-24 h-24">
                  {profilePreview ? (
                    <AvatarImage src={profilePreview} alt="Profile preview" />
                  ) : (
                    <AvatarFallback className="bg-swati-light text-swati-purple">
                      <Camera size={32} />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={20} className="text-white" />
                </div>
                <input 
                  ref={profileInputRef}
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">Click to upload</span>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="banner-image" className="mb-2">Banner Image (optional)</Label>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors
                  ${bannerPreview ? 'border-swati-teal' : 'border-gray-300'}`}
                onClick={() => document.getElementById('banner-image')?.click()}
              >
                {bannerPreview ? (
                  <div className="relative">
                    <img 
                      src={bannerPreview} 
                      alt="Banner preview" 
                      className="mx-auto max-h-32 object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity rounded">
                      <span className="text-white text-sm bg-black bg-opacity-60 px-2 py-1 rounded">Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Upload a banner image</p>
                    <p className="text-xs text-gray-400 mt-1">Recommended size: 1200x300</p>
                  </div>
                )}
                <input 
                  id="banner-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerImageChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-serif text-lg font-medium mb-4 pb-2 border-b">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Professional/Stage Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your professional name"
              />
            </div>
        </div>    
            <div>
              <Label htmlFor="category">Primary Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              placeholder="Tell us about yourself, your experience, and your talents"
              rows={5}
            />
            <p className="text-xs text-gray-500 mt-1">
              A great bio helps clients understand your background and skills
            </p>
          </div>
          
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-serif text-lg font-medium mb-4 pb-2 border-b">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">+268</span>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={formData.phone.startsWith('+268') ? '' : 'pl-12'}
                  placeholder="7123 4567"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Eswatini country code (+268) will be added automatically if missing
              </p>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <Label>Social Media & Website Links</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddSocialMedia}
                disabled={socialMedia.length >= 5}
              >
                <PlusCircle size={16} className="mr-1" />
                Add Link
              </Button>
            </div>
            
            <div className="space-y-3">
              {socialMedia.map((social, index) => (
                <div key={social.id} className="flex items-center space-x-2">
                  <select
                    value={social.platform}
                    onChange={(e) => handleSocialMediaChange(social.id, 'platform', e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-1/3"
                  >
                    {socialPlatforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  
                  <div className="flex-1 relative">
                    <LinkIcon size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <Input
                      value={social.url}
                      onChange={(e) => handleSocialMediaChange(social.id, 'url', e.target.value)}
                      placeholder="https://..."
                      className="pl-10"
                    />
                  </div>
                  
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveSocialMedia(social.id)}
                    >
                      <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Add up to 5 social media profiles or websites
            </p>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-swati-purple hover:bg-swati-purple/90 py-6"
          disabled={loading}
        >
          {loading ? (isEditing ? "Updating Profile..." : "Creating Profile...") 
          : (isEditing ? "Update Your Artist Profile" : "Create Your Artist Profile")}
        </Button>
      </form>
    </div>
  );
};

export default ProfileCreation;
