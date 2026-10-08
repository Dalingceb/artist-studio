
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Artist } from "@/types/database";

type Review = {
  id: string;
  artist_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    full_name: string;
  };
};

type ReviewsSectionProps = {
  artist: Artist;
};

const ReviewsSection = ({ artist }: ReviewsSectionProps) => {
  // Remove the guard clause since we're already checking for artist in ArtistProfile
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('artist_reviews')
          .select(`
            id, artist_id, reviewer_id, rating, comment, created_at,
            reviewer:profiles(full_name)
          `)
          .eq('artist_id', artist.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setReviews(data as any as Review[]);
          if (user) {
            const userHasReviewed = data.some((review: any) => review.reviewer_id === user.id);
            setHasReviewed(userHasReviewed);
          }
        } else {
          setReviews([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch reviews");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [artist.id, user]);

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to leave a review",
        variant: "destructive"
      });
      return;
    }
    
    if (rating < 1 || rating > 5) {
      toast({
        title: "Invalid rating",
        description: "Please select a rating between 1 and 5 stars",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const newReview = {
        artist_id: artist.id,  // Changed from artist?.artist_id to artist.id
        reviewer_id: user.id,
        rating,
        comment: comment || null
      };
      
      const { data, error } = await supabase
        .from('artist_reviews')
        .insert(newReview as any)
        .select(`
         id, artist_id, reviewer_id, rating, comment, created_at,
          reviewer:profiles(full_name)
        `)
        .single();
      
      if (error) throw error;
      
      // Update reviews list and average rating
      setReviews(prevReviews => [data as any as Review, ...prevReviews]);
      setHasReviewed(true);
      setIsDialogOpen(false);
      
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
      
      // Reset form
      setRating(5);
      setComment("");
      
      // Update artist's average rating
      await updateArtistRating();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit review",
        variant: "destructive"
      });
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const updateArtistRating = async () => {
    try {
      const { data, error } = await supabase
        .from('artist_reviews')
        .select('rating')
        .eq('artist_id', artist.id);  // Changed from artist?.artist_id to artist.id
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const ratings = data.map(r => r.rating);
        const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        
        const { error: updateError } = await supabase
          .from('artists')
          .update({ rating: Number(avgRating.toFixed(2)) })
          .eq('id', artist.id)  // Changed from artist_id to id
          .single();
      
        if (updateError) {
          console.error('Error updating artist rating:', updateError);
          throw updateError;
        }
      }
    } catch (err) {
      console.error("Error updating artist rating:", err);
    }
  };
  
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                size={18}
                className={`${star <= calculateAverageRating() ? 'fill-swati-gold text-swati-gold' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="font-semibold">{calculateAverageRating().toFixed(1)}</span>
          <span className="ml-1 text-gray-500">({reviews.length})</span>
        </div>
        
        {user && !hasReviewed && (
          <Button 
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="border-swati-purple text-swati-purple hover:bg-swati-purple/10"
          >
            Write a Review
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swati-purple mx-auto"></div>
          <p className="mt-2">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>Error: {error}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No reviews yet. Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{review.reviewer.full_name}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(review.created_at), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        size={16}
                        className={`${star <= review.rating ? 'fill-swati-gold text-swati-gold' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review for {artist?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2">Rating</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    size={24}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer ${star <= rating ? 'fill-swati-gold text-swati-gold' : 'text-gray-300'} hover:text-swati-gold`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Your Review (optional)</p>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience working with this artist..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={submitting}
              className="bg-swati-purple hover:bg-swati-purple/90"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsSection;
