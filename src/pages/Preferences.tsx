import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Car, Zap, Rocket, Battery } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";

type CarType = "formula1" | "hypercar" | "supercar" | "electric";

const carTypeOptions: { value: CarType; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  {
    value: "formula1",
    label: "Formula 1",
    icon: Rocket,
    description: "Open-wheel racing machines built for the pinnacle of motorsport",
  },
  {
    value: "hypercar",
    label: "Hypercars",
    icon: Zap,
    description: "Ultra-exclusive, million-dollar speed demons",
  },
  {
    value: "supercar",
    label: "Supercars",
    icon: Car,
    description: "High-performance sports cars for the road",
  },
  {
    value: "electric",
    label: "Electric",
    icon: Battery,
    description: "The future of performance with instant torque",
  },
];

const Preferences = () => {
  const [selectedTypes, setSelectedTypes] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      // Fetch existing preferences
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("preferred_car_types")
        .eq("user_id", session.user.id)
        .single();

      if (prefs?.preferred_car_types) {
        setSelectedTypes(prefs.preferred_car_types as CarType[]);
      }

      setIsLoading(false);
    };

    checkAuthAndFetch();
  }, [navigate]);

  const toggleType = (type: CarType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast.error("Please sign in first");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase
      .from("user_preferences")
      .update({ preferred_car_types: selectedTypes })
      .eq("user_id", session.user.id);

    if (error) {
      toast.error("Failed to save preferences");
    } else {
      toast.success("Preferences saved!");
      navigate("/");
    }

    setIsSaving(false);
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
        <title>Your Preferences | Velocity</title>
        <meta name="description" content="Customize your Velocity experience by selecting your favorite types of cars." />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hero-gradient opacity-30 blur-3xl" />
        </div>

        <div className="container relative z-10 px-4 py-16 max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-racing-cyan/30 bg-racing-cyan/10 mb-6">
              <div className="w-2 h-2 rounded-full bg-racing-cyan animate-pulse" />
              <span className="font-mono text-sm text-racing-cyan uppercase tracking-wider">
                Personalize
              </span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">
              WHAT DRIVES YOU?
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              Select your favorite types of cars to personalize your experience
            </p>
          </div>

          {/* Car Type Selection */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {carTypeOptions.map((option) => {
              const isSelected = selectedTypes.includes(option.value);
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  onClick={() => toggleType(option.value)}
                  className={cn(
                    "relative p-6 rounded-lg border-2 text-left transition-all duration-300",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary hover:border-primary/50"
                  )}
                >
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}

                  <Icon className={cn(
                    "w-8 h-8 mb-3 transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                  <h3 className="font-display font-bold text-lg mb-1">
                    {option.label}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="racing"
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
              className="min-w-[200px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate("/")}
            >
              Skip for Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Preferences;
