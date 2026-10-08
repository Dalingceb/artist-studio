
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload, Image } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

interface Ad {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  position: string;
  pages: string[];
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

const AVAILABLE_PAGES = [
  { id: 'home', label: 'Home Page' },
  { id: 'explore', label: 'Explore Page' },
  { id: 'artist-profile', label: 'Artist Profile Pages' },
  { id: 'categories', label: 'Categories Page' },
  { id: 'about', label: 'About Page' },
  { id: 'jobs', label: 'Job Listings Page' },
  { id: 'learning-resources', label: 'Learning Resources Page' },
];

const AdManagement = () => {
  const { user } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link_url: '',
    position: 'banner',
    pages: [] as string[],
    is_active: true,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast.error('Failed to fetch ads');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `ad_${uuidv4()}.${fileExt}`;
      const filePath = `ads/${fileName}`;

      console.log('Uploading image to:', filePath);

      const { error: uploadError, data } = await supabase.storage
        .from('ad-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('ad-images')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePageToggle = (pageId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      pages: checked 
        ? [...prev.pages, pageId]
        : prev.pages.filter(p => p !== pageId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create ads');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Ad title is required');
      return;
    }

    if (formData.pages.length === 0) {
      toast.error('Please select at least one page for the ad to appear on');
      return;
    }

    try {
      console.log('Starting ad save process...');
      let imageUrl = editingAd?.image_url || null;

      // Upload new image if one was selected
      if (imageFile) {
        console.log('Uploading new image...');
        imageUrl = await uploadImage(imageFile);
      }

      const adData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        image_url: imageUrl,
        link_url: formData.link_url.trim() || null,
        position: formData.position,
        pages: formData.pages,
        is_active: formData.is_active,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        created_by: user.id
      };

      console.log('Ad data to save:', adData);

      if (editingAd) {
        const { error } = await supabase
          .from('ads')
          .update(adData)
          .eq('id', editingAd.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        toast.success('Ad updated successfully');
      } else {
        const { error } = await supabase
          .from('ads')
          .insert([adData]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        toast.success('Ad created successfully');
      }

      resetForm();
      fetchAds();
    } catch (error: any) {
      console.error('Error saving ad:', error);
      toast.error(`Failed to save ad: ${error.message || 'Unknown error'}`);
    }
  };

  const deleteAd = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', adId);

      if (error) throw error;
      toast.success('Ad deleted successfully');
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('Failed to delete ad');
    }
  };

  const toggleAdStatus = async (adId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ is_active: !currentStatus })
        .eq('id', adId);

      if (error) throw error;
      toast.success(`Ad ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchAds();
    } catch (error) {
      console.error('Error updating ad status:', error);
      toast.error('Failed to update ad status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link_url: '',
      position: 'banner',
      pages: [],
      is_active: true,
      start_date: '',
      end_date: ''
    });
    setEditingAd(null);
    setShowForm(false);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const editAd = (ad: Ad) => {
    setFormData({
      title: ad.title,
      description: ad.description || '',
      link_url: ad.link_url || '',
      position: ad.position,
      pages: ad.pages || [],
      is_active: ad.is_active,
      start_date: ad.start_date ? ad.start_date.split('T')[0] : '',
      end_date: ad.end_date ? ad.end_date.split('T')[0] : ''
    });
    setEditingAd(ad);
    setImagePreview(ad.image_url);
    setShowForm(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading ads...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ad Management</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-2" />
            Create Ad
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Ad Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="inline">Inline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Textarea
                placeholder="Ad Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />

              {/* Page Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pages to Display On</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABLE_PAGES.map((page) => (
                    <div key={page.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={page.id}
                        checked={formData.pages.includes(page.id)}
                        onCheckedChange={(checked) => handlePageToggle(page.id, checked as boolean)}
                      />
                      <label 
                        htmlFor={page.id} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {page.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ad Image</label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload size={16} className="mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>
              
              <Input
                placeholder="Link URL (optional)"
                value={formData.link_url}
                onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {editingAd ? 'Update Ad' : 'Create Ad'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    {ad.image_url ? (
                      <img 
                        src={ad.image_url} 
                        alt={ad.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Image size={16} className="text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell>{ad.position}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(ad.pages || []).map((pageId) => {
                        const page = AVAILABLE_PAGES.find(p => p.id === pageId);
                        return (
                          <Badge key={pageId} variant="outline" className="text-xs">
                            {page?.label || pageId}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={ad.is_active ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                    >
                      {ad.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ad.start_date ? new Date(ad.start_date).toLocaleDateString() : 'No start date'}
                  </TableCell>
                  <TableCell>
                    {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : 'No end date'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editAd(ad)}>
                        <Edit size={14} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => deleteAd(ad.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdManagement;
