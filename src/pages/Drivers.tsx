import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DriverCard } from "@/components/DriverCard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

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
}

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);

      // Fetch drivers sorted by championships
      const { data: driversData, error: driversError } = await supabase
        .from("drivers")
        .select("*")
        .order("championships", { ascending: false });

      if (driversError) {
        toast.error("Failed to load drivers");
      } else {
        setDrivers(driversData || []);
      }

      // Fetch favorites if logged in
      if (session?.user) {
        const { data: favData } = await supabase
          .from("favorite_drivers")
          .select("driver_id")
          .eq("user_id", session.user.id);

        setFavorites(favData?.map((f) => f.driver_id) || []);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const toggleFavorite = async (driverId: string) => {
    if (!userId) {
      toast.error("Please sign in to save favorites");
      return;
    }

    const isFavorite = favorites.includes(driverId);

    if (isFavorite) {
      const { error } = await supabase
        .from("favorite_drivers")
        .delete()
        .eq("user_id", userId)
        .eq("driver_id", driverId);

      if (!error) {
        setFavorites(favorites.filter((id) => id !== driverId));
        toast.success("Removed from favorites");
      }
    } else {
      const { error } = await supabase.from("favorite_drivers").insert({
        user_id: userId,
        driver_id: driverId,
      });

      if (!error) {
        setFavorites([...favorites, driverId]);
        toast.success("Added to favorites");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>F1 Drivers | Velocity</title>
        <meta name="description" content="Discover the greatest Formula 1 drivers of all time. Track their championships, analyze career stats, and follow their racing journey." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Header */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-30" />
          <div className="container relative z-10 px-4">
            <div className="max-w-3xl">
              <span className="font-mono text-sm text-racing-cyan uppercase tracking-widest">
                Champions
              </span>
              <h1 className="font-display font-black text-5xl md:text-6xl mt-2 mb-4">
                F1 DRIVERS
              </h1>
              <p className="font-body text-xl text-muted-foreground">
                The legends who pushed the limits of speed and skill on the world's greatest circuits.
              </p>
            </div>
          </div>
        </section>

        {/* Drivers Grid */}
        <section className="py-12">
          <div className="container px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : drivers.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-xl text-muted-foreground">
                  No drivers found.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {drivers.map((driver, index) => (
                  <div
                    key={driver.id}
                    className="opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                  >
                    <DriverCard
                      id={driver.id}
                      name={driver.name}
                      nationality={driver.nationality}
                      team={driver.team}
                      number={driver.number}
                      championships={driver.championships}
                      podiums={driver.podiums}
                      wins={driver.wins}
                      imageUrl={driver.image_url || undefined}
                      isFavorite={favorites.includes(driver.id)}
                      onToggleFavorite={userId ? () => toggleFavorite(driver.id) : undefined}
                      rank={index + 1}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Drivers;
