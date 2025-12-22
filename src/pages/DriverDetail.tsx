import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TelemetryProgress } from "@/components/TelemetryProgress";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Heart, Trophy, Medal, Flag, Target } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";

interface Driver {
  id: string;
  name: string;
  nationality: string;
  team: string;
  number: number;
  championships: number;
  podiums: number;
  wins: number;
  pole_positions: number;
  career_points: number;
  image_url: string | null;
  helmet_image_url: string | null;
}

const DriverDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);

      // Fetch driver
      const { data: driverData, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !driverData) {
        toast.error("Driver not found");
      } else {
        setDriver(driverData);
      }

      // Check if favorite
      if (session?.user && id) {
        const { data: favData } = await supabase
          .from("favorite_drivers")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("driver_id", id)
          .single();

        setIsFavorite(!!favData);
      }

      setIsLoading(false);
    };

    if (id) fetchData();
  }, [id]);

  const toggleFavorite = async () => {
    if (!userId || !driver) {
      toast.error("Please sign in to save favorites");
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from("favorite_drivers")
        .delete()
        .eq("user_id", userId)
        .eq("driver_id", driver.id);

      if (!error) {
        setIsFavorite(false);
        toast.success("Removed from favorites");
      }
    } else {
      const { error } = await supabase.from("favorite_drivers").insert({
        user_id: userId,
        driver_id: driver.id,
      });

      if (!error) {
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 pt-32 text-center">
          <h1 className="font-display text-3xl mb-4">Driver Not Found</h1>
          <Button variant="outline" asChild>
            <Link to="/drivers">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Drivers
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{driver.name} | Velocity</title>
        <meta name="description" content={`Explore ${driver.name}'s F1 career statistics including ${driver.championships} championships, ${driver.wins} wins, and ${driver.podiums} podiums.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Back button */}
        <div className="container px-4 pt-24">
          <Link
            to="/drivers"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-display text-sm uppercase tracking-wider">Back to Drivers</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="pt-8 pb-16">
          <div className="container px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Driver Image */}
              <div className="relative">
                {/* Driver Number Background */}
                <div className="absolute top-0 right-0 z-0 opacity-10">
                  <span className="font-display font-black text-[200px] leading-none" style={{
                    WebkitTextStroke: "4px hsl(var(--foreground))",
                    color: "transparent"
                  }}>
                    {driver.number}
                  </span>
                </div>

                <div className="cockpit-frame aspect-square bg-carbon-gradient relative overflow-hidden">
                  {driver.image_url ? (
                    <img
                      src={driver.image_url}
                      alt={driver.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display font-bold text-6xl text-muted-foreground/30">
                        {driver.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>
              </div>

              {/* Driver Info */}
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="font-mono text-sm text-racing-cyan uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    {driver.nationality} • {driver.team}
                  </p>
                  <h1 className="font-display font-black text-4xl md:text-5xl mb-2">
                    {driver.name}
                  </h1>
                  <p className="font-display text-6xl font-black text-primary">
                    #{driver.number}
                  </p>
                </div>

                {/* Favorite button */}
                {userId && (
                  <Button
                    variant={isFavorite ? "racing" : "outline"}
                    onClick={toggleFavorite}
                    className="mb-8 gap-2"
                  >
                    <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                    {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
                  </Button>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-5 rounded-lg bg-secondary border border-border text-center">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-racing-yellow" />
                    <p className="font-display font-bold text-3xl">{driver.championships}</p>
                    <p className="font-mono text-xs text-muted-foreground uppercase">Championships</p>
                  </div>
                  <div className="p-5 rounded-lg bg-secondary border border-border text-center">
                    <Flag className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-display font-bold text-3xl">{driver.wins}</p>
                    <p className="font-mono text-xs text-muted-foreground uppercase">Race Wins</p>
                  </div>
                  <div className="p-5 rounded-lg bg-secondary border border-border text-center">
                    <Medal className="w-8 h-8 mx-auto mb-2 text-racing-cyan" />
                    <p className="font-display font-bold text-3xl">{driver.podiums}</p>
                    <p className="font-mono text-xs text-muted-foreground uppercase">Podiums</p>
                  </div>
                  <div className="p-5 rounded-lg bg-secondary border border-border text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-foreground" />
                    <p className="font-display font-bold text-3xl">{driver.pole_positions}</p>
                    <p className="font-mono text-xs text-muted-foreground uppercase">Pole Positions</p>
                  </div>
                </div>

                {/* Career Points */}
                <div className="p-5 rounded-lg bg-secondary border border-border mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-muted-foreground uppercase">Career Points</span>
                    <span className="font-display font-bold text-2xl text-primary">
                      {driver.career_points.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Telemetry bars */}
                <div className="space-y-6">
                  <h3 className="font-display font-bold text-lg uppercase tracking-wider border-b border-border pb-2">
                    Career Performance
                  </h3>
                  <TelemetryProgress
                    label="Championships"
                    value={driver.championships}
                    maxValue={8}
                    variant="yellow"
                    delay={200}
                  />
                  <TelemetryProgress
                    label="Race Wins"
                    value={driver.wins}
                    maxValue={105}
                    variant="red"
                    delay={400}
                  />
                  <TelemetryProgress
                    label="Podium Finishes"
                    value={driver.podiums}
                    maxValue={200}
                    variant="cyan"
                    delay={600}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default DriverDetail;
