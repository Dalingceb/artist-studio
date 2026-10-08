
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from '@/lib/router-compat';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, BookOpen, Search, Filter, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { LearningResource, ResourceCategory } from '@/types/database';
import AdDisplay from '@/components/AdDisplay';

const LearningResources = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState<(LearningResource & { category?: ResourceCategory })[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || 'all');

  useEffect(() => {
    fetchCategories();
    fetchResources();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

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
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      if (selectedDifficulty !== 'all') {
        query = query.eq('difficulty_level', selectedDifficulty);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%, tags.cs.{${searchQuery}}`);
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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
    setSearchParams(params);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-6">
              Learning Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Enhance your artistic skills and grow your creative business with our comprehensive learning materials
            </p>
            
            {isAdmin && (
              <div className="mt-8">
                <Link to="/admin/resources">
                  <Button className="bg-swati-purple hover:bg-swati-purple/90">Manage Resources</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <Card className="mb-10 shadow-lg border-0">
            <CardContent className="pt-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 h-12 text-lg border-gray-200"
                    />
                  </div>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-56 h-12">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-full md:w-56 h-12">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={handleSearch} className="w-full md:w-auto h-12 bg-swati-purple hover:bg-swati-purple/90">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Banner Ad */}
          <AdDisplay position="banner" page="learning-resources" className="my-8" />

          {/* Resources Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse border-0 shadow-lg">
                  <div className="h-56 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="pt-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-7 w-20 bg-gray-200 rounded"></div>
                      <div className="h-7 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-medium text-gray-900 mb-3">No resources found</h3>
              <p className="text-gray-600 text-lg">
                {searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Check back soon for new learning materials'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource) => (
                <Link key={resource.id} to={`/resources/${resource.id}`}>
                  <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group cursor-pointer overflow-hidden">
                    {resource.featured_image && (
                      <div className="aspect-video bg-gradient-to-br from-swati-purple/10 to-swati-gold/10 overflow-hidden">
                        <img
                          src={resource.featured_image}
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.category && (
                          <Badge variant="secondary" className="text-sm font-medium">
                            {resource.category.name}
                          </Badge>
                        )}
                        
                        {resource.difficulty_level && (
                          <Badge className={`text-sm font-medium ${getDifficultyColor(resource.difficulty_level)}`}>
                            {resource.difficulty_level}
                          </Badge>
                        )}
                        
                        {resource.estimated_read_time && (
                          <Badge variant="outline" className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            {resource.estimated_read_time} min
                          </Badge>
                        )}
                      </div>
                      
                      <CardTitle className="text-xl leading-tight group-hover:text-swati-purple transition-colors">
                        {resource.title}
                      </CardTitle>
                      
                      {resource.excerpt && (
                        <p className="text-gray-600 text-sm leading-relaxed mt-3">
                          {truncateText(resource.excerpt, 120)}
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {resource.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs text-gray-500">
                              {tag}
                            </Badge>
                          ))}
                          {resource.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs text-gray-500">
                              +{resource.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(resource.created_at).toLocaleDateString()}
                        </span>
                        <ArrowRight className="h-4 w-4 text-swati-purple group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Inline Ad */}
          <AdDisplay position="inline" page="learning-resources" className="my-12" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LearningResources;
