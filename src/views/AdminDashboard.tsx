
import { useState, useEffect } from 'react';
import { Link } from '@/lib/router-compat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedArtistsManagement from '@/components/admin/FeaturedArtistsManagement';
import AdManagement from '@/components/admin/AdManagement';
import { Users, Star, MessageSquare, Calendar, BookOpen, Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LearningResource, ResourceCategory } from '@/types/database';

interface DashboardStats {
  totalArtists: number;
  featuredArtists: number;
  activeBookings: number;
  totalMessages: number;
  totalResources: number;
  publishedResources: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalArtists: 0,
    featuredArtists: 0,
    activeBookings: 0,
    totalMessages: 0,
    totalResources: 0,
    publishedResources: 0
  });
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<(LearningResource & { category?: ResourceCategory })[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchDashboardStats();
    fetchCategories();
    fetchResources();
  }, []);

  useEffect(() => {
    fetchResources();
  }, [searchQuery, statusFilter]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch total artists
      const { count: totalArtists } = await supabase
        .from('artists')
        .select('*', { count: 'exact', head: true });

      // Fetch featured artists
      const { count: featuredArtists } = await supabase
        .from('artists')
        .select('*', { count: 'exact', head: true })
        .eq('featured', true);

      // Fetch active bookings (confirmed or pending)
      const { count: activeBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('status', ['confirmed', 'pending']);

      // Fetch total messages
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Fetch total resources
      const { count: totalResources } = await supabase
        .from('learning_resources')
        .select('*', { count: 'exact', head: true });

      // Fetch published resources
      const { count: publishedResources } = await supabase
        .from('learning_resources')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      setStats({
        totalArtists: totalArtists || 0,
        featuredArtists: featuredArtists || 0,
        activeBookings: activeBookings || 0,
        totalMessages: totalMessages || 0,
        totalResources: totalResources || 0,
        publishedResources: publishedResources || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

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
      setResourcesLoading(true);
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
      setResourcesLoading(false);
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
      fetchDashboardStats(); // Refresh stats
      toast.success('Resource deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource. Please try again.');
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

      fetchDashboardStats(); // Refresh stats
      toast.success(`Resource ${status} successfully`);
    } catch (error) {
      console.error('Error updating resource:', error);
      toast.error('Failed to update resource status');
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your platform from here</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.totalArtists}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Artists</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.featuredArtists}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.activeBookings}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.totalMessages}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.totalResources}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Resources</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.publishedResources}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="featured-artists" className="space-y-6">
          <TabsList className="grid w-full lg:w-[600px] grid-cols-3">
            <TabsTrigger value="featured-artists">Featured Artists</TabsTrigger>
            <TabsTrigger value="ads">Ad Management</TabsTrigger>
            <TabsTrigger value="resources">Learning Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured-artists">
            <FeaturedArtistsManagement />
          </TabsContent>
          
          <TabsContent value="ads">
            <AdManagement />
          </TabsContent>
          
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Learning Resources</CardTitle>
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
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
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

                {/* Resources List */}
                {resourcesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border rounded-lg p-4 animate-pulse">
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
                      </div>
                    ))}
                  </div>
                ) : resources.length === 0 ? (
                  <div className="text-center py-12">
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resources.map((resource) => (
                      <div key={resource.id} className="border rounded-lg p-4">
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
