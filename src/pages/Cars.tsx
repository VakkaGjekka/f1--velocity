import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Loader2, Filter } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";

type CarType = "formula1" | "hypercar" | "supercar" | "electric";

interface Car {
  id: string;
  name: string;
  brand: string;
  car_type: CarType;
  year: number;
  top_speed: number | null;
  horsepower: number | null;
  acceleration: number | null;
  image_url: string | null;
}

const carTypes: { value: CarType | "all"; label: string }[] = [
  { value: "all", label: "All Cars" },
  { value: "formula1", label: "Formula 1" },
  { value: "hypercar", label: "Hypercars" },
  { value: "supercar", label: "Supercars" },
  { value: "electric", label: "Electric" },
];

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<CarType | "all">("all");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);

      // Fetch cars
      const { data: carsData, error: carsError } = await supabase
        .from("cars")
        .select("*")
        .order("brand");

      if (carsError) {
        toast.error("Failed to load cars");
      } else {
        setCars(carsData || []);
      }

      // Fetch favorites if logged in
      if (session?.user) {
        const { data: favData } = await supabase
          .from("favorite_cars")
          .select("car_id")
          .eq("user_id", session.user.id);

        setFavorites(favData?.map((f) => f.car_id) || []);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const toggleFavorite = async (carId: string) => {
    if (!userId) {
      toast.error("Please sign in to save favorites");
      return;
    }

    const isFavorite = favorites.includes(carId);

    if (isFavorite) {
      const { error } = await supabase
        .from("favorite_cars")
        .delete()
        .eq("user_id", userId)
        .eq("car_id", carId);

      if (!error) {
        setFavorites(favorites.filter((id) => id !== carId));
        toast.success("Removed from favorites");
      }
    } else {
      const { error } = await supabase.from("favorite_cars").insert({
        user_id: userId,
        car_id: carId,
      });

      if (!error) {
        setFavorites([...favorites, carId]);
        toast.success("Added to favorites");
      }
    }
  };

  const filteredCars = activeFilter === "all"
    ? cars
    : cars.filter((car) => car.car_type === activeFilter);

  return (
    <>
      <Helmet>
        <title>Explore Cars | Velocity</title>
        <meta name="description" content="Browse the world's most exhilarating Formula 1 cars, hypercars, supercars, and electric performance vehicles." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Header */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-30" />
          <div className="container relative z-10 px-4">
            <div className="max-w-3xl">
              <span className="font-mono text-sm text-racing-cyan uppercase tracking-widest">
                Collection
              </span>
              <h1 className="font-display font-black text-5xl md:text-6xl mt-2 mb-4">
                EXPLORE CARS
              </h1>
              <p className="font-body text-xl text-muted-foreground">
                From the legendary circuits to the open road. Discover machines built for pure speed.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border sticky top-20 z-40 bg-background/95 backdrop-blur-xl">
          <div className="container px-4">
            <div className="flex items-center gap-4 py-4 overflow-x-auto scrollbar-hide">
              <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              {carTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={activeFilter === type.value ? "racing" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter(type.value)}
                  className={cn(
                    "flex-shrink-0",
                    activeFilter !== type.value && "text-muted-foreground"
                  )}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Cars Grid */}
        <section className="py-12">
          <div className="container px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-xl text-muted-foreground">
                  No cars found in this category.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car, index) => (
                  <div
                    key={car.id}
                    className="opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                  >
                    <CarCard
                      id={car.id}
                      name={car.name}
                      brand={car.brand}
                      carType={car.car_type}
                      year={car.year}
                      topSpeed={car.top_speed || undefined}
                      horsepower={car.horsepower || undefined}
                      acceleration={car.acceleration || undefined}
                      imageUrl={car.image_url || undefined}
                      isFavorite={favorites.includes(car.id)}
                      onToggleFavorite={userId ? () => toggleFavorite(car.id) : undefined}
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

export default Cars;
