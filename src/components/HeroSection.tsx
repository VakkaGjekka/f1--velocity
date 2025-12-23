import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Gauge, Zap, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-f1.jpg";

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Formula 1 racing" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        {/* Hero gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-hero-gradient opacity-50 blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--racing-red) / 0.2) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--racing-red) / 0.2) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Speed lines */}
        <div className="speed-lines">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="speed-line"
              style={{
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-racing-red/30 bg-racing-red/10 mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-racing-red animate-pulse" />
            <span className="font-mono text-sm text-racing-red uppercase tracking-wider">
              Experience Pure Speed
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className={`font-display font-black text-5xl md:text-7xl lg:text-8xl leading-tight mb-6 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="block">FEEL THE</span>
            <span className="block text-glow-red text-primary">VELOCITY</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Explore the world's most exhilarating cars and legendary F1 drivers. 
            Immerse yourself in the ultimate automotive experience.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button variant="racing" size="xl" asChild>
              <Link to="/cars">
                Explore Cars
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/drivers">
                View Drivers
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {[
              { icon: Gauge, value: "350+", label: "Top Speed (km/h)" },
              { icon: Zap, value: "2.5s", label: "0-100 Acceleration" },
              { icon: Trophy, value: "23", label: "Championships" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary border border-border mb-3 group-hover:border-primary/50 transition-colors">
                  <stat.icon className="w-6 h-6 text-racing-cyan" />
                </div>
                <div className="font-display font-bold text-2xl md:text-3xl text-foreground">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
