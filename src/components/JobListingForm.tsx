import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type JobListingFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const JobListingForm = ({ onSuccess, onCancel }: JobListingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a job listing",
        variant: "destructive"
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date for your event",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('job_listings')
        .insert({
          client_id: user.id,
          title,
          description,
          event_date: format(date, 'yyyy-MM-dd'),
          event_time: time || null,
          location,
          category,
          budget_range: budgetRange,
          requirements: requirements,
          status: 'open'
        });
      
      if (error) throw error;
      
      toast({
        title: "Job listing created!",
        description: "Your job listing has been posted successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create job listing",
        variant: "destructive"
      });
      console.error("Error creating job listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
  <SelectGroup>
    {/* Performing Arts */}
    <SelectItem value="music">Music</SelectItem>
    <SelectItem value="dj">DJ</SelectItem>
    <SelectItem value="mc">MC / Host</SelectItem>
    <SelectItem value="dance">Dance</SelectItem>
    <SelectItem value="comedy">Comedy</SelectItem>
    <SelectItem value="poetry">Poetry / Spoken Word</SelectItem>
    <SelectItem value="theatre">Theatre / Acting</SelectItem>
    <SelectItem value="storytelling">Traditional Storytelling</SelectItem>

    {/* Visual & Design Arts */}
    <SelectItem value="photography">Photography</SelectItem>
    <SelectItem value="videography">Videography</SelectItem>
    <SelectItem value="graphic_design">Graphic Design</SelectItem>
    <SelectItem value="fine_art">Fine Art / Painting</SelectItem>
    <SelectItem value="sculpture">Sculpture / Craft</SelectItem>
    <SelectItem value="fashion_design">Fashion Design</SelectItem>
    <SelectItem value="makeup_artist">Makeup Artist</SelectItem>
    <SelectItem value="jewelry_maker">Jewelry Maker</SelectItem>

    <SelectItem value="author">Author</SelectItem>
    <SelectItem value="scriptwriter">Scriptwriter</SelectItem>
    <SelectItem value="songwriter">Songwriter</SelectItem>
    <SelectItem value="copywriter">Copywriter</SelectItem>
    <SelectItem value="journalist">Journalist</SelectItem>
    <SelectItem value="blogger">Blogger</SelectItem>
    <SelectItem value="editor">Editor / Proofreader</SelectItem>
    <SelectItem value="playwright">Playwright</SelectItem>
    <SelectItem value="content_writer">Content Writer</SelectItem>
    <SelectItem value="ghostwriter">Ghostwriter</SelectItem>
    <SelectItem value="screenwriter">Screenwriter</SelectItem>
    <SelectItem value="speechwriter">Speechwriter</SelectItem>
    <SelectItem value="translator">Translator / Language Artist</SelectItem>


    {/* Cultural & Traditional */}
    <SelectItem value="culinary_arts"></SelectItem>
    <SelectItem value="traditional_dance">Traditional Dance</SelectItem>
    <SelectItem value="cultural_music">Cultural Musician</SelectItem>
    <SelectItem value="herbal_art">Herbalist / Natural Artistry</SelectItem>

    {/* Digital & Technical */}
    <SelectItem value="sound_engineer">Sound Engineer</SelectItem>
    <SelectItem value="light_technician">Lighting Technician</SelectItem>
    <SelectItem value="set_designer">Stage / Set Designer</SelectItem>
    <SelectItem value="video_editor">Video Editor</SelectItem>
    <SelectItem value="content_creator">Content Creator</SelectItem>

    {/* Event & Misc */}
    <SelectItem value="event_planner">Event Planner</SelectItem>
    <SelectItem value="influencer">Social Media Influencer</SelectItem>
    <SelectItem value="model">Model</SelectItem>
    <SelectItem value="voice_actor">Voice Actor</SelectItem>
  </SelectGroup>
</SelectContent>

        </Select>
      </div>

      <div className="space-y-2">
        <Label>Event Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Event Time (optional)</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budgetRange">Budget Range (SZL)</Label>
        <Input
          id="budgetRange"
          value={budgetRange}
          onChange={(e) => setBudgetRange(e.target.value)}
          
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Job Listing"}
        </Button>
      </div>
    </form>
  );
};

export default JobListingForm;