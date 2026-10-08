
import { useState, useEffect } from 'react';
import { Link } from '@/lib/router-compat';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { LearningResource, ResourceCategory } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import AdminRoute from '@/components/admin/AdminRoute';

const AdminResourceManagement = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [resources, setResources] = useState<(LearningResource & { category?: ResourceCategory })[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchResources();
  }, [searchQuery, statusFilter]);

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

  const fetchResources = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('learning_resources')
        .select(`
          *,
          category:resource_categories(*)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { error } = await supabase
        .from('learning_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResources(resources.filter(r => r.id !== id));
      toast({
        title: "Success",
        description: "Resource deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateResourceStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('learning_resources')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setResources(resources.map(r => 
        r.id === id ? { ...r, status: status as any } : r
      ));

      toast({
        title: "Success",
        description: `Resource ${status} successfully.`,
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: "Error",
        description: "Failed to update resource status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">
                  Resource Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Create and manage learning resources for artists
                </p>
              </div>
              
              <Link to="/admin/resources/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Resource
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Resources List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-16 bg-gray-200 rounded"></div>
                          <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : resources.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your search criteria'
                      : 'Create your first learning resource to get started'}
                  </p>
                  <Link to="/admin/resources/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Resource
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <Card key={resource.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{resource.title}</h3>
                            <Badge className={getStatusColor(resource.status)}>
                              {resource.status}
                            </Badge>
                            {resource.category && (
                              <Badge variant="outline">
                                {resource.category.name}
                              </Badge>
                            )}
                          </div>
                          
                          {resource.excerpt && (
                            <p className="text-gray-600 mb-2 line-clamp-2">
                              {resource.excerpt}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Created: {new Date(resource.created_at).toLocaleDateString()}</span>
                            <span>Updated: {new Date(resource.updated_at).toLocaleDateString()}</span>
                            {resource.estimated_read_time && (
                              <span>{resource.estimated_read_time} min read</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {resource.status === 'published' && (
                            <Link to={`/resources/${resource.id}`} target="_blank">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          )}
                          
                          <Link to={`/admin/resources/edit/${resource.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          
                          <Select
                            value={resource.status}
                            onValueChange={(status) => updateResourceStatus(resource.id, status)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteResource(resource.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default AdminResourceManagement;
