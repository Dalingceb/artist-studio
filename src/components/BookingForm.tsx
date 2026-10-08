// @ts-nocheck -- ported from the original app; loose typing kept as-is

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Artist } from "@/types/database";
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

type BookingFormProps = {
  artist: Artist;
  onSuccess: () => void;
  onCancel: () => void;
};

const BookingForm = ({ artist, onSuccess, onCancel }: BookingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [bookingPurpose, setBookingPurpose] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book an artist",
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
      // Create the booking directly
      const { error } = await supabase
        .from('bookings')
        .insert({
          client_id: user.id,
          artist_id: artist.id,
          event_title: eventTitle,
          event_date: format(date, 'yyyy-MM-dd'),
          event_time: time || null,
          location: location,
          description: description || null,
          booking_purpose: bookingPurpose || null,
          additional_requirements: additionalRequirements || null,
          proposed_price: proposedPrice || null,
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast({
        title: "Booking request sent!",
        description: `Your booking request has been sent to ${artist.name}.`,
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit booking request",
        variant: "destructive"
      });
      console.error("Error creating booking:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="max-h-[70vh] pr-4">
      <form onSubmit={handleSubmit} className="space-y-4 pb-4">
        <div>
          <Label htmlFor="event-title">Event Title</Label>
          <Input 
            id="event-title" 
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Wedding, Corporate Event, etc." 
            required
          />
        </div>
        
        <div>
          <Label htmlFor="booking-purpose">Booking Purpose</Label>
          <Select
            value={bookingPurpose}
            onValueChange={setBookingPurpose}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select the purpose of your booking" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="corporate">Corporate Event</SelectItem>
                <SelectItem value="birthday">Birthday Party</SelectItem>
                <SelectItem value="concert">Concert/Performance</SelectItem>
                <SelectItem value="photoshoot">Event Photographer</SelectItem>
                <SelectItem value="hosting">Event Hosting</SelectItem>
                <SelectItem value="other">Other(Specify in Description)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Event Date</Label>
          <div className="border rounded-md p-3 mt-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="mx-auto"
              disabled={(date) => date < new Date()}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="event-time">Event Time (optional)</Label>
          <Input 
            id="event-time" 
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="location">Event Location</Label>
          <Input 
            id="location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter the venue or location" 
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Event Description (optional)</Label>
          <Textarea 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a brief description of your event..." 
            className="min-h-[80px]" 
          />
        </div>
        
        <div>
          <Label htmlFor="additional-requirements">Additional Requirements (optional)</Label>
          <Textarea 
            id="additional-requirements" 
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            placeholder="Any specific equipment, setup, or other requirements..." 
            className="min-h-[80px]" 
          />
        </div>

        <div>
        <Label htmlFor="proposed-price">Proposed Price (SZL)</Label>
        <Input
          id="proposed-price"
          type="number"
          value={proposedPrice}
          onChange={(e) => setProposedPrice(e.target.value)}
          placeholder="Enter the price you are willing to pay"
          required
          />
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-swati-purple hover:bg-swati-purple/90"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Booking Request"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
};

export default BookingForm;
