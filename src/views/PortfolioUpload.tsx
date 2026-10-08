// @ts-nocheck -- ported from the original app; loose typing kept as-is
import { useState, useRef } from "react";
import { useNavigate } from '@/lib/router-compat';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Upload, ImageIcon, VideoIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const PortfolioUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file under 10MB",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    if (mediaType === "video") {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(selectedFile);
      video.currentTime = 1; // Set to 1 second to avoid black frame
      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
            setThumbnail(thumbnailFile);
            // Also set the preview to the thumbnail for immediate display
            setPreview(URL.createObjectURL(thumbnailFile));
          }
        }, "image/jpeg", 0.95); // Increased quality to 0.95
      };
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${path}_${uuidv4()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    try {
      const { error: uploadError, data } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setLoading(true);
    try {
      // First get the artist_id for the current user
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (artistError || !artistData) {
        toast({
          title: "Error",
          description: "Could not find artist profile",
          variant: "destructive"
        });
        return;
      }

      const fileUrl = await uploadFile(file, mediaType);
      let thumbnailUrl = null;

      if (mediaType === "video" && thumbnail) {
        thumbnailUrl = await uploadFile(thumbnail, "thumbnail");
      }

      const { error } = await supabase
        .from("artist_portfolio")
        .insert([{
          artist_id: artistData.id, // Use the correct artist_id from the artists table
          title,
          description,
          price: typeof price === "number" ? price : null,
          media_type: mediaType,
          media_url: fileUrl,
          thumbnail_url: thumbnailUrl
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Portfolio item added successfully"
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error adding portfolio item:", error);
      toast({
        title: "Error",
        description: "Failed to add portfolio item",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add Portfolio Item</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label>Media Type</Label>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={mediaType === "image" ? "default" : "outline"}
              onClick={() => setMediaType("image")}
            >
              <ImageIcon className="mr-2" /> Image
            </Button>
            <Button
              type="button"
              variant={mediaType === "video" ? "default" : "outline"}
              onClick={() => setMediaType("video")}
            >
              <VideoIcon className="mr-2" /> Video
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Upload {mediaType}</Label>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              mediaType === "image" ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto" />
              ) : (
                <video src={preview} controls className="max-h-64 mx-auto" />
              )
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400" />
                <p className="mt-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (optional)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
          />
        </div>

        <Button type="submit" disabled={loading || !file}>
          {loading ? "Uploading..." : "Add to Portfolio"}
        </Button>
      </form>
    </div>
  );
};

export default PortfolioUpload;