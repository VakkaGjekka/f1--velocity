import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Car, Users } from "lucide-react";

export const FeaturedSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById("featured-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const features = [
    {
      icon: Car,
      title: "Premium Collection",
      description: "From Formula 1 to hypercars, explore the fastest machines on the planet with immersive 360° views and detailed specifications.",
      link: "/cars",
      linkText: "Browse Cars",
      gradient: "from-primary/20 to-transparent",
    },
    {
      icon: Users,
      title: "Legendary Drivers",
      description: "Discover the greatest F1 drivers of all time. Track their championships, analyze their career progress, and follow their journey.",
      link: "/drivers",
      linkText: "View Drivers",
      gradient: "from-racing-cyan/20 to-transparent",
    },
  ];

  return (
    <section id="featured-section" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="font-mono text-sm text-racing-cyan uppercase tracking-widest">
            Explore
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl mt-2 mb-4">
            THE EXPERIENCE
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive into an immersive automotive world designed for enthusiasts who demand excellence.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`racing-card p-8 transition-all duration-700 delay-${(index + 1) * 200} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-lg bg-secondary border border-border flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="font-display font-bold text-2xl mb-4">
                  {feature.title}
                </h3>
                
                <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <Button variant="outline" asChild className="group">
                  <Link to={feature.link}>
                    {feature.linkText}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
