import { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('fetchUserRole: Starting role fetch for user:', userId);
      // Query user_profiles table directly using raw SQL to avoid type issues
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      console.log('fetchUserRole: Query result:', { data, error });
      
      if (error) {
        console.error('fetchUserRole: Error fetching user role:', error);
        console.log('fetchUserRole: Setting default role to driver');
        setUserRole('driver'); // Default to driver
      } else {
        console.log('fetchUserRole: User role found:', data?.role);
        setUserRole(data?.role || 'driver');
      }
    } catch (error) {
      console.error('fetchUserRole: Exception in fetchUserRole:', error);
      setUserRole('driver'); // Default to driver
    }
  };

  useEffect(() => {
    console.log('useAuth: Setting up auth state listener');
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserRole(session.user.id);
          setLoading(false); // Only set loading false after role is fetched
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('useAuth: Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id);
        setLoading(false); // Only set loading false after role is fetched
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};