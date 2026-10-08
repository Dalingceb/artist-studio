
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@/lib/router-compat';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Save, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LearningResource, ResourceCategory } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import AdminRoute from '@/components/admin/AdminRoute';
import RichTextEditor from '@/components/resources/RichTextEditor';

const AdminResourceForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!!id);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    status: 'draft',
    tags: [] as string[],
    estimated_read_time: '',
    difficulty_level: '',
    featured_image: '',
  });
  
  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditing && id) {
      fetchResource();
    }
  }, [id, isEditing]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchResource = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content,
        category_id: data.category_id || '',
        status: data.status,
        tags: data.tags || [],
        estimated_read_time: data.estimated_read_time?.toString() || '',
        difficulty_level: data.difficulty_level || '',
        featured_image: data.featured_image || '',
      });
    } catch (error) {
      console.error('Error fetching resource:', error);
      toast({
        title: "Error",
        description: "Failed to load resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `featured/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('learning-resources')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('learning-resources')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, featured_image: publicUrl }));
      
      toast({
        title: "Success",
        description: "Featured image uploaded successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const resourceData = {
        title: formData.title,
        excerpt: formData.excerpt || null,
        content: formData.content,
        category_id: formData.category_id || null,
        status: formData.status,
        tags: formData.tags.length > 0 ? formData.tags : null,
        estimated_read_time: formData.estimated_read_time ? parseInt(formData.estimated_read_time) : null,
        difficulty_level: formData.difficulty_level || null,
        featured_image: formData.featured_image || null,
        author_id: user.id,
      };

      if (isEditing && id) {
        const { error } = await supabase
          .from('learning_resources')
          .update(resourceData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Resource updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('learning_resources')
          .insert([resourceData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Resource created successfully.",
        });
      }

      navigate('/admin/resources');
    } catch (error) {
      console.error('Error saving resource:', error);
      toast({
        title: "Error",
        description: "Failed to save resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // In a real app, you might open a preview modal or new tab
    console.log('Preview resource:', formData);
  };

  return (
    <AdminRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                {isEditing ? 'Edit Resource' : 'Create New Resource'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEditing ? 'Update your learning resource' : 'Create a new learning resource for artists'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter resource title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description for resource cards and previews"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select
                        value={formData.difficulty_level}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="read-time">Estimated Read Time (minutes)</Label>
                      <Input
                        id="read-time"
                        type="number"
                        value={formData.estimated_read_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimated_read_time: e.target.value }))}
                        placeholder="15"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="featured-image">Upload Featured Image</Label>
                      <Input
                        id="featured-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
                    </div>

                    {formData.featured_image && (
                      <div className="mt-4">
                        <img
                          src={formData.featured_image}
                          alt="Featured"
                          className="max-w-xs h-auto rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} disabled={!newTag.trim()}>
                        Add
                      </Button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-600"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Content *</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/resources')}
                >
                  Cancel
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreview}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  
                  <Button type="submit" disabled={loading || !formData.title || !formData.content}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </main>
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default AdminResourceForm;
