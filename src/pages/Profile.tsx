import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Settings, Heart, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setEmail(session.user.email || "");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username || "");
      }

      setIsLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) return;

    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("user_id", session.user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
    }

    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Profile | Velocity</title>
        <meta name="description" content="Manage your Velocity profile and account settings." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <section className="pt-32 pb-16">
          <div className="container px-4 max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 rounded-full bg-secondary border-2 border-border mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
              <h1 className="font-display font-black text-4xl mb-2">
                YOUR PROFILE
              </h1>
              <p className="font-body text-lg text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>

            {/* Profile Form */}
            <div className="racing-card p-8 mb-8">
              <h2 className="font-display font-bold text-lg uppercase tracking-wider mb-6 pb-2 border-b border-border">
                Account Details
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-display text-sm uppercase tracking-wider">
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted border-border h-12"
                  />
                  <p className="font-mono text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="font-display text-sm uppercase tracking-wider">
                    Username
                  </Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="bg-secondary border-border focus:border-primary h-12"
                  />
                </div>

                <Button
                  variant="racing"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="racing-card p-8 mb-8">
              <h2 className="font-display font-bold text-lg uppercase tracking-wider mb-6 pb-2 border-b border-border">
                Quick Links
              </h2>

              <div className="space-y-3">
                <Link
                  to="/favorites"
                  className="flex items-center gap-3 p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors"
                >
                  <Heart className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-display font-semibold">Favorites</p>
                    <p className="font-body text-sm text-muted-foreground">
                      View your saved cars and drivers
                    </p>
                  </div>
                </Link>

                <Link
                  to="/preferences"
                  className="flex items-center gap-3 p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-racing-cyan" />
                  <div>
                    <p className="font-display font-semibold">Preferences</p>
                    <p className="font-body text-sm text-muted-foreground">
                      Update your car type preferences
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Sign Out */}
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Profile;
