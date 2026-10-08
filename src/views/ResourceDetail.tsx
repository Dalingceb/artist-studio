
import { useState, useEffect } from 'react';
import { useParams, Link } from '@/lib/router-compat';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, BookOpen, Share2, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LearningResource, ResourceCategory } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import AdDisplay from '@/components/AdDisplay';

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<(LearningResource & { category?: ResourceCategory }) | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchResource();
    }
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('learning_resources')
        .select(`
          *,
          category:resource_categories(*)
        `)
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setResource(data);
    } catch (error) {
      console.error('Error fetching resource:', error);
      toast({
        title: "Error",
        description: "Failed to load the resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource?.title,
          text: resource?.excerpt || resource?.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Resource link has been copied to your clipboard.",
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatContent = (content: string) => {
    // Basic markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mb-6 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-semibold mb-5 text-gray-900">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-medium mb-4 text-gray-900">$1</h3>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-swati-purple bg-swati-purple/5 pl-6 py-4 italic text-gray-700 my-6 rounded-r-lg">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 mb-2 text-gray-700">$1</li>')
      .replace(/^1\. (.*$)/gm, '<li class="ml-6 mb-2 text-gray-700">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-swati-purple hover:text-swati-purple/80 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-xl my-8 shadow-lg" />')
      .replace(/\n\n/g, '</p><p class="mb-6 text-gray-700 leading-relaxed text-lg">')
      .replace(/^/, '<p class="mb-6 text-gray-700 leading-relaxed text-lg">')
      .replace(/$/, '</p>');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-8"></div>
              <div className="h-80 bg-gray-200 rounded-xl mb-8"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Resource not found</h1>
            <p className="text-gray-600 mb-8 text-lg">The learning resource you're looking for doesn't exist or has been removed.</p>
            <Link to="/resources">
              <Button className="bg-swati-purple hover:bg-swati-purple/90">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Resources
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Link to="/resources">
              <Button variant="ghost" className="pl-0 text-gray-600 hover:text-swati-purple">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Resources
              </Button>
            </Link>
          </div>

          {/* Featured Image */}
          {resource.featured_image && (
            <div className="aspect-video bg-gradient-to-br from-swati-purple/10 to-swati-gold/10 rounded-2xl overflow-hidden mb-10 shadow-xl">
              <img
                src={resource.featured_image}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {resource.category && (
                <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
                  {resource.category.name}
                </Badge>
              )}
              
              {resource.difficulty_level && (
                <Badge className={`text-sm font-medium px-3 py-1 ${getDifficultyColor(resource.difficulty_level)}`}>
                  {resource.difficulty_level}
                </Badge>
              )}
              
              {resource.estimated_read_time && (
                <Badge variant="outline" className="flex items-center gap-1 text-sm px-3 py-1">
                  <Clock className="h-4 w-4" />
                  {resource.estimated_read_time} min read
                </Badge>
              )}
            </div>

            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              {resource.title}
            </h1>
            
            {resource.excerpt && (
              <p className="text-2xl text-gray-600 mb-8 leading-relaxed font-light">
                {resource.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b border-gray-200">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(resource.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm text-gray-600 px-3 py-1">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <Card className="border-0 shadow-xl">
            <CardContent className="pt-10 px-10">
              <div 
                className="prose prose-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: formatContent(resource.content) }}
              />
            </CardContent>
          </Card>

          {/* Banner Ad */}
          <AdDisplay position="banner" page="learning-resources" className="my-12" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResourceDetail;
