
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Artist } from "@/types/database";
import { Pencil, Trash2, Image, Video, PlusCircle } from "lucide-react";
import { useNavigate } from '@/lib/router-compat';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

type PortfolioItem = {
  id: string;
  title: string;
  description?: string;
  media_url: string;
  media_type: "image" | "video";
  thumbnail_url?: string;
  price: number | null; // Change this line to match the database schema
};

type PortfolioGalleryProps = {
  artist: Artist;
  isEditable?: boolean;
};

const PortfolioGallery = ({ artist, isEditable = false }: PortfolioGalleryProps) => {
  const navigate = useNavigate(); // Add this line
  const { toast } = useToast();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Add guard clause at the beginning after state initialization
  if (!artist) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swati-purple mx-auto"></div>
        <p className="mt-2">Loading artist portfolio...</p>
      </div>
    );
  }

  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('artist_portfolio')
        .select('*')
        .eq('artist_id', artist.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPortfolioItems(data as PortfolioItem[]);
    } catch (err: any) {
      setError(err.message || "Failed to fetch portfolio items");
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artist?.id) {
      fetchPortfolio();
    }
  }, [artist?.id]);
  
  const handleViewItem = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setIsUploaderOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete || !artist?.id) return;

    try {
      setLoading(true);
      
      // First delete the file from storage if it exists
      const item = portfolioItems.find(item => item.id === itemToDelete);
      if (item) {
        // Get the filename from the URL
        const filePath = item.media_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('portfolio')
            .remove([`${artist.id}/${filePath}`]);
        }

        // Also remove thumbnail if it exists
        if (item.thumbnail_url) {
          const thumbnailPath = item.thumbnail_url.split('/').pop();
          if (thumbnailPath) {
            await supabase.storage
              .from('portfolio')
              .remove([`${artist.id}/${thumbnailPath}`]);
          }
        }
      }
      
      // Delete the database record
      const { error } = await supabase
        .from('artist_portfolio')
        .delete()
        .eq('id', itemToDelete);
      
      if (error) throw error;
      
      // Update the UI
      setPortfolioItems(portfolioItems.filter(item => item.id !== itemToDelete));
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      
      toast({
        title: "Item deleted",
        description: "Portfolio item has been removed successfully",
      });
    } catch (err: any) {
      console.error("Error deleting item:", err);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploaderClose = (newItemAdded: boolean = false) => {
    setIsUploaderOpen(false);
    setIsEditMode(false);
    setSelectedItem(null);
    
    if (newItemAdded) {
      fetchPortfolio();
    }
  };
  
  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  if (loading && portfolioItems.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swati-purple mx-auto"></div>
        <p className="mt-2">Loading portfolio...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }
  
  if (portfolioItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No portfolio items yet.</p>
        {isEditable && (
          <Button onClick={() => navigate("/portfolio/upload")} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Portfolio Item
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {isEditable && (
        <div className="flex justify-end">
          <Button onClick={() => navigate("/portfolio/upload")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Portfolio Item
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative group">
                {item.media_type === "image" ? (
                  <img
                    src={item.media_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="relative w-full h-48">
                    <img
                      src={item.thumbnail_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover bg-gray-100"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Video className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
                
                {isEditable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditItem(item)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => confirmDelete(item.id)}
                      className="h-8 w-8 bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-2">
                <h3 className="font-semibold truncate">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                )}
                {item.price && (
                  <p className="text-swati-purple font-semibold">SZL {item.price.toLocaleString()}</p>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewItem(item)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="w-full">
              {selectedItem?.media_type === "image" ? (
                <img 
                  src={selectedItem.media_url} 
                  alt={selectedItem.title}
                  className="w-full h-auto max-h-[60vh] object-contain rounded-md"
                />
              ) : (
                <video 
                  src={selectedItem?.media_url} 
                  controls
                  className="w-full h-auto max-h-[60vh] rounded-md"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            
            {selectedItem?.description && (
              <p className="text-gray-700">{selectedItem.description}</p>
            )}
            
            {selectedItem?.price && (
              <p className="text-lg font-semibold text-swati-purple">
                Price: SZL {selectedItem.price.toLocaleString()}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this portfolio item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PortfolioGallery;
