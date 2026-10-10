
import { useState } from "react";
import { Link, useNavigate } from '@/lib/router-compat';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isArtist, setIsArtist] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            is_artist: isArtist
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
      // Redirect to login or straight to artist profile creation if they're an artist
      if (isArtist) {
        navigate("/create-profile");
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-swati-light to-white">
      <div className="m-auto w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <Link to="/" className="flex justify-center items-center mb-6">
            <span className="font-serif text-3xl font-bold text-swati-purple">Swazi<span className="text-swati-gold"> Artistry</span></span>
            <span className="ml-2 text-sm text-gray-500">Talent Hub</span>
          </Link>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-600">Join our community of talented EmaSwati artists</p>
        </div>
        
        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                id="isArtist"
                type="checkbox"
                checked={isArtist}
                onChange={(e) => setIsArtist(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-swati-purple focus:ring-swati-purple"
              />
              <Label htmlFor="isArtist" className="text-sm">I am an artist/talent looking to showcase my skills</Label>
            </div>
          </div>
          
          <div>
            <Button type="submit" className="w-full bg-swati-purple hover:bg-swati-purple/90" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          By creating an account you agree to the{" "}
          <Link to="/terms" className="text-swati-teal hover:underline">Terms of Use</Link> and{" "}
          <Link to="/privacy" className="text-swati-teal hover:underline">Privacy Policy</Link>.
        </p>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-swati-teal hover:text-swati-teal/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
