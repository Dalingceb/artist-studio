import { useState, useEffect } from "react";
import { Link, useNavigate } from '@/lib/router-compat';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if the user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      try {
        setCheckingSession(true);
        const { data } = await supabase.auth.getSession();
        
        // Check if we have a valid session that came from a recovery flow
        // This is a simplification - in a real-world app, you might want more robust checks
        const hasSession = !!data.session?.user;
        setHasRecoverySession(hasSession);
        
        // If no recovery session, show an error toast
        if (!hasSession) {
          toast({
            title: "Invalid or expired reset link",
            description: "Please request a new password reset link",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Session check error:", error);
        setHasRecoverySession(false);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkSession();
  }, [toast, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password 
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      });
      
      // Sign out to ensure the user needs to sign in with the new password
      await supabase.auth.signOut();
      
      // Redirect to login page
      navigate("/login");
    } catch (error: any) {
      console.error("Password update error:", error);
      setErrorMessage(error.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-swati-light to-white">
        <div className="m-auto w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-swati-purple" />
          <p className="text-gray-600">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  if (!hasRecoverySession) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-swati-light to-white">
        <div className="m-auto w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg text-center">
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-900">Invalid Reset Link</h1>
            <p className="mt-2 text-gray-600">Your password reset link is invalid or has expired.</p>
          </div>
          
          <div className="mt-8">
            <Link to="/forgot-password">
              <Button className="w-full bg-swati-purple hover:bg-swati-purple/90">
                Request New Reset Link
              </Button>
            </Link>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="font-medium text-swati-teal hover:text-swati-teal/80">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-swati-light to-white">
      <div className="m-auto w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <Link to="/" className="flex justify-center items-center mb-6">
            <span className="font-serif text-3xl font-bold text-swati-purple">Ema<span className="text-swati-gold">Swati</span></span>
            <span className="ml-2 text-sm text-gray-500">Talent Hub</span>
          </Link>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Set new password</h1>
          <p className="mt-2 text-gray-600">Choose a strong password for your account</p>
        </div>
        
        <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your new password"
              disabled={loading}
              minLength={6}
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your new password"
              disabled={loading}
              minLength={6}
            />
          </div>
          
          <div>
            <Button 
              type="submit" 
              className="w-full bg-swati-purple hover:bg-swati-purple/90 flex items-center justify-center" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : "Update Password"}
            </Button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="font-medium text-swati-teal hover:text-swati-teal/80">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
