import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TelemetryProgress } from "@/components/TelemetryProgress";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Heart, Gauge, Zap, Timer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";

interface Car {
  id: string;
  name: string;
  brand: string;
  car_type: string;
  year: number;
  top_speed: number | null;
  horsepower: number | null;
  acceleration: number | null;
  description: string | null;
  image_url: string | null;
  interior_image_url: string | null;
}

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [viewMode, setViewMode] = useState<"exterior" | "interior">("exterior");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);

      // Fetch car
      const { data: carData, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !carData) {
        toast.error("Car not found");
      } else {
        setCar(carData);
      }

      // Check if favorite
      if (session?.user && id) {
        const { data: favData } = await supabase
          .from("favorite_cars")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("car_id", id)
          .single();

        setIsFavorite(!!favData);
      }

      setIsLoading(false);
    };

    if (id) fetchData();
  }, [id]);

  const toggleFavorite = async () => {
    if (!userId || !car) {
      toast.error("Please sign in to save favorites");
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from("favorite_cars")
        .delete()
        .eq("user_id", userId)
        .eq("car_id", car.id);

      if (!error) {
        setIsFavorite(false);
        toast.success("Removed from favorites");
      }
    } else {
      const { error } = await supabase.from("favorite_cars").insert({
        user_id: userId,
        car_id: car.id,
      });

      if (!error) {
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    }
  };

  const handleRotate = () => {
    setRotationAngle((prev) => prev + 45);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 pt-32 text-center">
          <h1 className="font-display text-3xl mb-4">Car Not Found</h1>
          <Button variant="outline" asChild>
            <Link to="/cars">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cars
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{car.name} | Velocity</title>
        <meta name="description" content={car.description || `Explore the ${car.year} ${car.brand} ${car.name} with detailed specifications and immersive views.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Back button */}
        <div className="container px-4 pt-24">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-display text-sm uppercase tracking-wider">Back to Cars</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="pt-8 pb-16">
          <div className="container px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Car Viewer */}
              <div className="relative">
                <div className="cockpit-frame aspect-[4/3] bg-carbon-gradient relative overflow-hidden">
                  {car.image_url ? (
                    <img
                      src={viewMode === "interior" && car.interior_image_url ? car.interior_image_url : car.image_url}
                      alt={car.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      style={{ transform: `rotateY(${rotationAngle}deg) scale(1.1)` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gauge className="w-24 h-24 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    variant="carbon"
                    size="sm"
                    onClick={handleRotate}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Rotate
                  </Button>
                  <Button
                    variant={viewMode === "exterior" ? "racing" : "carbon"}
                    size="sm"
                    onClick={() => setViewMode("exterior")}
                  >
                    Exterior
                  </Button>
                  <Button
                    variant={viewMode === "interior" ? "racing" : "carbon"}
                    size="sm"
                    onClick={() => setViewMode("interior")}
                  >
                    Cockpit
                  </Button>
                </div>
              </div>

              {/* Car Info */}
              <div>
                <div className="mb-6">
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-display font-semibold uppercase tracking-wider border mb-4",
                    car.car_type === "formula1" && "bg-primary/20 text-primary border-primary/30",
                    car.car_type === "hypercar" && "bg-racing-cyan/20 text-racing-cyan border-racing-cyan/30",
                    car.car_type === "supercar" && "bg-racing-yellow/20 text-racing-yellow border-racing-yellow/30",
                    car.car_type === "electric" && "bg-green-500/20 text-green-400 border-green-400/30"
                  )}>
                    {car.car_type.replace("formula1", "F1")}
                  </span>
                  <p className="font-mono text-sm text-racing-cyan uppercase tracking-wider mb-2">
                    {car.brand} • {car.year}
                  </p>
                  <h1 className="font-display font-black text-4xl md:text-5xl mb-4">
                    {car.name}
                  </h1>
                  {car.description && (
                    <p className="font-body text-lg text-muted-foreground leading-relaxed">
                      {car.description}
                    </p>
                  )}
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

                {/* Stats */}
                <div className="space-y-6">
                  <h3 className="font-display font-bold text-lg uppercase tracking-wider border-b border-border pb-2">
                    Performance Specs
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-6">
                    {car.top_speed && (
                      <div className="text-center p-4 rounded-lg bg-secondary border border-border">
                        <Gauge className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="font-display font-bold text-2xl">{car.top_speed}</p>
                        <p className="font-mono text-xs text-muted-foreground uppercase">km/h</p>
                      </div>
                    )}
                    {car.horsepower && (
                      <div className="text-center p-4 rounded-lg bg-secondary border border-border">
                        <Zap className="w-6 h-6 mx-auto mb-2 text-racing-cyan" />
                        <p className="font-display font-bold text-2xl">{car.horsepower}</p>
                        <p className="font-mono text-xs text-muted-foreground uppercase">hp</p>
                      </div>
                    )}
                    {car.acceleration && (
                      <div className="text-center p-4 rounded-lg bg-secondary border border-border">
                        <Timer className="w-6 h-6 mx-auto mb-2 text-racing-yellow" />
                        <p className="font-display font-bold text-2xl">{car.acceleration}s</p>
                        <p className="font-mono text-xs text-muted-foreground uppercase">0-100</p>
                      </div>
                    )}
                  </div>

                  {/* Telemetry bars */}
                  <div className="space-y-4 pt-4">
                    {car.top_speed && (
                      <TelemetryProgress
                        label="Top Speed"
                        value={car.top_speed}
                        maxValue={400}
                        variant="red"
                        delay={200}
                      />
                    )}
                    {car.horsepower && (
                      <TelemetryProgress
                        label="Power Output"
                        value={car.horsepower}
                        maxValue={1200}
                        variant="cyan"
                        delay={400}
                      />
                    )}
                  </div>
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

export default CarDetail;
