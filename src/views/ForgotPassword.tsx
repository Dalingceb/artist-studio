
import { useState } from "react";
import { Link } from '@/lib/router-compat';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setSubmitted(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for a password reset link",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Failed to send reset email",
        description: error.message || "Please check your email and try again",
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
            <span className="font-serif text-3xl font-bold text-swati-purple">Ema<span className="text-swati-gold">Swati</span></span>
            <span className="ml-2 text-sm text-gray-500">Talent Hub</span>
          </Link>
          
          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold font-serif text-gray-900">Forgot your password?</h1>
              <p className="mt-2 text-gray-600">Enter your email and we'll send you a reset link</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold font-serif text-gray-900">Check your email</h1>
              <p className="mt-2 text-gray-600">
                If an account exists for {email}, you'll receive a password reset link.
              </p>
            </>
          )}
        </div>
        
        {!submitted ? (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={loading}
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
                    Sending...
                  </>
                ) : "Send reset link"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-8">
            <Button 
              onClick={() => setSubmitted(false)}
              className="w-full bg-swati-purple hover:bg-swati-purple/90" 
            >
              Send another email
            </Button>
          </div>
        )}
        
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

export default ForgotPassword;
