import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("driver");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handleSuccessfulAuth(session.user.id);
      }
    };
    checkUser();
  }, []);

  const handleSuccessfulAuth = async (userId: string) => {
    try {
      // Use the app_current_role function to get user role
      const { data: role, error } = await (supabase as any).rpc('app_current_role');
      
      if (error || !role) {
        console.error('Error fetching user role:', error);
        // Default to driver if role fetch fails
        navigate('/dashboard');
        return;
      }

      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'wasel') {
        navigate('/dashboard');
      } else if (role === 'driver') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard'); // Default fallback
      }
    } catch (error) {
      console.error('Error during auth redirect:', error);
      toast({
        title: "Authentication error",
        description: "Unable to verify your account. Please try again.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        await handleSuccessfulAuth(data.user.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone: phone,
          }
        }
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Account created!",
          description: data.user.email_confirmed_at 
            ? "You can now log in with your credentials."
            : "Please check your email to confirm your account.",
        });

        if (data.user.email_confirmed_at) {
          await handleSuccessfulAuth(data.user.id);
        } else {
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <ModernCard className="w-full max-w-md">
        <ModernCardHeader className="text-center">
          <ModernCardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create Account"}
          </ModernCardTitle>
          <ModernCardDescription>
            {isLogin 
              ? "Sign in to your account to continue" 
              : "Sign up to get started with your delivery management"
            }
          </ModernCardDescription>
        </ModernCardHeader>

        <ModernCardContent>
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="driver">Driver</option>
                    <option value="wasel">Wasel Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  );
};

export default AuthPage;