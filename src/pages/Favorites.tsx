import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarCard } from "@/components/CarCard";
import { DriverCard } from "@/components/DriverCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Car, Users, Heart } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

interface FavoriteCar {
  id: string;
  name: string;
  brand: string;
  car_type: string;
  year: number;
  top_speed: number | null;
  horsepower: number | null;
  acceleration: number | null;
  image_url: string | null;
}

interface FavoriteDriver {
  id: string;
  name: string;
  nationality: string;
  team: string;
  number: number;
  championships: number;
  podiums: number;
  wins: number;
  image_url: string | null;
}

const Favorites = () => {
  const [favoriteCars, setFavoriteCars] = useState<FavoriteCar[]>([]);
  const [favoriteDrivers, setFavoriteDrivers] = useState<FavoriteDriver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);

      // Fetch favorite cars
      const { data: carFavs } = await supabase
        .from("favorite_cars")
        .select("car_id")
        .eq("user_id", session.user.id);

      if (carFavs && carFavs.length > 0) {
        const carIds = carFavs.map((f) => f.car_id);
        const { data: cars } = await supabase
          .from("cars")
          .select("*")
          .in("id", carIds);
        
        setFavoriteCars(cars || []);
      }

      // Fetch favorite drivers
      const { data: driverFavs } = await supabase
        .from("favorite_drivers")
        .select("driver_id")
        .eq("user_id", session.user.id);

      if (driverFavs && driverFavs.length > 0) {
        const driverIds = driverFavs.map((f) => f.driver_id);
        const { data: drivers } = await supabase
          .from("drivers")
          .select("*")
          .in("id", driverIds);
        
        setFavoriteDrivers(drivers || []);
      }

      setIsLoading(false);
    };

    fetchFavorites();
  }, [navigate]);

  const removeFavoriteCar = async (carId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from("favorite_cars")
      .delete()
      .eq("user_id", userId)
      .eq("car_id", carId);

    if (!error) {
      setFavoriteCars(favoriteCars.filter((c) => c.id !== carId));
      toast.success("Removed from favorites");
    }
  };

  const removeFavoriteDriver = async (driverId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from("favorite_drivers")
      .delete()
      .eq("user_id", userId)
      .eq("driver_id", driverId);

    if (!error) {
      setFavoriteDrivers(favoriteDrivers.filter((d) => d.id !== driverId));
      toast.success("Removed from favorites");
    }
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
        <title>Your Favorites | Velocity</title>
        <meta name="description" content="View and manage your saved favorite cars and F1 drivers." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Header */}
        <section className="pt-32 pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-30" />
          <div className="container relative z-10 px-4">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-primary" />
              <span className="font-mono text-sm text-racing-cyan uppercase tracking-widest">
                Collection
              </span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-6xl mb-4">
              YOUR FAVORITES
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              Cars and drivers you've saved to your collection.
            </p>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-8">
          <div className="container px-4">
            <Tabs defaultValue="cars" className="w-full">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8 bg-secondary">
                <TabsTrigger value="cars" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Car className="w-4 h-4" />
                  Cars ({favoriteCars.length})
                </TabsTrigger>
                <TabsTrigger value="drivers" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-4 h-4" />
                  Drivers ({favoriteDrivers.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cars">
                {favoriteCars.length === 0 ? (
                  <div className="text-center py-20">
                    <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="font-body text-xl text-muted-foreground mb-2">
                      No favorite cars yet
                    </p>
                    <p className="font-body text-muted-foreground">
                      Browse our collection and save your favorites!
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteCars.map((car) => (
                      <CarCard
                        key={car.id}
                        id={car.id}
                        name={car.name}
                        brand={car.brand}
                        carType={car.car_type}
                        year={car.year}
                        topSpeed={car.top_speed || undefined}
                        horsepower={car.horsepower || undefined}
                        acceleration={car.acceleration || undefined}
                        imageUrl={car.image_url || undefined}
                        isFavorite={true}
                        onToggleFavorite={() => removeFavoriteCar(car.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="drivers">
                {favoriteDrivers.length === 0 ? (
                  <div className="text-center py-20">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="font-body text-xl text-muted-foreground mb-2">
                      No favorite drivers yet
                    </p>
                    <p className="font-body text-muted-foreground">
                      Explore our drivers and save your favorites!
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteDrivers.map((driver) => (
                      <DriverCard
                        key={driver.id}
                        id={driver.id}
                        name={driver.name}
                        nationality={driver.nationality}
                        team={driver.team}
                        number={driver.number}
                        championships={driver.championships}
                        podiums={driver.podiums}
                        wins={driver.wins}
                        imageUrl={driver.image_url || undefined}
                        isFavorite={true}
                        onToggleFavorite={() => removeFavoriteDriver(driver.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Favorites;
