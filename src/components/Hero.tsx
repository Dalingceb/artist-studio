
import { Button } from "@/components/ui/button";
import { Link } from '@/lib/router-compat';
import { useAuth } from "@/hooks/useAuth";
import { categories } from "@/components/SearchBar";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <div className="relative bg-gradient-to-b from-swati-light to-white overflow-hidden py-16">
      {/* Decorative elements */}
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
        <div className="relative h-full max-w-7xl mx-auto">
          <svg
            className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/4 lg:translate-x-1/4 xl:-translate-y-1/2 text-swati-purple/10"
            width="404"
            height="784"
            fill="none"
            viewBox="0 0 404 784"
          >
            <defs>
              <pattern
                id="pattern-squares"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="784" fill="url(#pattern-squares)" />
          </svg>
        </div>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7 xl:col-span-6">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-swati-dark mb-6">
                <span className="block">Discover & Connect with</span>
                <span className="gradient-heading block">Eswatini Talent</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mb-8">
                Find and book the perfect Swati artists, musicians, dancers, speakers, 
                and creatives for your events, projects, and performances.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                <Link to="/explore">
                  <Button size="lg" className="bg-swati-purple hover:bg-swati-purple/90 w-full sm:w-auto">
                    Explore Talent
                  </Button>
                </Link>
                <Link to={user ? "/profile" : "/signup"}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-swati-purple text-swati-purple hover:bg-swati-purple/10">
                    {user ? "Manage Your Profile" : "List Your Talent"}
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3 mb-8">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-swati-teal mr-2" />
                  <span>{categories.length - 1} Categories</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-swati-coral mr-2" />
                  <span>All over Eswatini</span>
            
               </div>
              
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-swati-gold mr-2" />
                  
                </div>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 lg:col-span-5 xl:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-swati-purple/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-swati-gold/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-swati-teal/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="EmaSwati performers"
                    className="rounded-lg shadow-xl object-cover h-80 sm:h-96 lg:h-[26rem] w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
 );
 };

export default Hero;
