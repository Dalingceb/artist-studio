
import { useState, useCallback } from "react";
import { Link, useNavigate } from '@/lib/router-compat';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import AdminDashboardLink from "./AdminDashboardLink";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      toast.success("You have been signed out");
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  }, [signOut, navigate]);

  const { unreadMessages, pendingBookings } = useNotifications();
  const totalNotifications = unreadMessages + pendingBookings;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif text-xl md:text-2xl font-bold text-swati-purple">Swazi<span className="text-swati-gold"> Artistry</span></span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-swati-purple">
              Home
            </Link>
            <Link to="/explore" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-swati-purple">
              Explore Talent
            </Link>
            <Link to="/jobs" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-swati-purple">
              Hiring Call
            </Link>
            <Link to="/categories" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-swati-purple">
              Categories
            </Link>
            <Link to="/resources" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-swati-purple">
              Learning
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-swati-purple">
              About
            </Link>
            <div className="ml-4 flex items-center space-x-2">
              {user ? (
                <>
                  <Link to="/create-job">
                    <Button variant="outline" size="sm" className="flex items-center">
                      Post a Job
                    </Button>
                  </Link>
                  
                  <AdminDashboardLink />
                  
                  <Link to="/profile">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <User size={16} className="mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    className="bg-swati-purple hover:bg-swati-purple/90" 
                    size="sm"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>

                  <Link to="/profile" className="relative">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Bell size={16} className="mr-2" />
                        
                        </Button>
                        
                        {totalNotifications > 0 && (
                        <Badge
                              className="absolute -top-2 -right-2 bg-swati-purple text-white"
                              variant="secondary"
                        >
                          {totalNotifications}
                        </Badge>
                      )}

                    </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-swati-purple hover:bg-swati-purple/90" size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 hover:text-swati-purple focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-slide-in-right fixed top-16 left-0 right-0 bottom-0 z-50 overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-swati-purple hover:bg-gray-50">
              Home
            </Link>
            <Link to="/explore" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-swati-purple hover:bg-gray-50">
              Explore Talent
            </Link>
            <Link to="/jobs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-swati-purple hover:bg-gray-50">
              Hiring Call
            </Link>
            {user && (
              <Link to="/create-job" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-swati-purple hover:bg-gray-50">
                Post a Job
              </Link>
            )}
            <Link to="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-swati-purple hover:bg-gray-50">
              Categories
            </Link>
            <Link to="/resources" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-swati-purple hover:bg-gray-50">
              Learning
            </Link>
            <Link to="/faq" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-swati-purple hover:bg-gray-50">
              FAQ
            </Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-swati-purple hover:bg-gray-50">
              About
            </Link>
            <div className="mt-4 flex flex-col space-y-2 px-3">
              {user ? (
                <>

                 <Link to="/profile" className="relative">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Bell size={16} className="mr-2" />
                        Notifications
                        </Button>
                        
                        {totalNotifications > 0 && (
                        <Badge
                              className="absolute -top-2 -right-2 bg-swati-purple text-white"
                              variant="secondary"
                          
                        >
                          {totalNotifications}
                        </Badge>
                      )}

                    </Link>
                  <div className="w-full">
                    <AdminDashboardLink />
                  </div>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full justify-center flex items-center">
                      <User size={16} className="mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    className="w-full justify-center bg-swati-purple hover:bg-swati-purple/90"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full justify-center">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full justify-center bg-swati-purple hover:bg-swati-purple/90">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
