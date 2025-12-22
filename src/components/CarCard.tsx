import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Gauge, Zap, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarCardProps {
  id: string;
  name: string;
  brand: string;
  carType: string;
  year: number;
  topSpeed?: number;
  horsepower?: number;
  acceleration?: number;
  imageUrl?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const CarCard = ({
  id,
  name,
  brand,
  carType,
  year,
  topSpeed,
  horsepower,
  acceleration,
  imageUrl,
  isFavorite = false,
  onToggleFavorite,
}: CarCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCarTypeColor = (type: string) => {
    switch (type) {
      case "formula1":
        return "bg-racing-red/20 text-primary border-primary/30";
      case "hypercar":
        return "bg-racing-cyan/20 text-racing-cyan border-racing-cyan/30";
      case "supercar":
        return "bg-racing-yellow/20 text-racing-yellow border-racing-yellow/30";
      case "electric":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div
      className="racing-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered && "scale-110"
            )}
          />
        ) : (
          <div className="w-full h-full bg-carbon-gradient flex items-center justify-center">
            <Gauge className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />

        {/* Car type badge */}
        <div className="absolute top-4 left-4">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-display font-semibold uppercase tracking-wider border",
              getCarTypeColor(carType)
            )}
          >
            {carType.replace("formula1", "F1")}
          </span>
        </div>

        {/* Favorite button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                isFavorite ? "fill-primary text-primary" : "text-foreground"
              )}
            />
          </Button>
        )}

        {/* Year badge */}
        <div className="absolute bottom-4 right-4">
          <span className="font-mono text-sm text-muted-foreground bg-background/80 px-2 py-1 rounded backdrop-blur-sm">
            {year}
          </span>
        </div>
      </div>

      {/* Content */}
      <Link to={`/cars/${id}`} className="block p-5">
        <div className="mb-4">
          <p className="font-mono text-xs text-racing-cyan uppercase tracking-wider mb-1">
            {brand}
          </p>
          <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {topSpeed && (
            <div className="text-center">
              <Gauge className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="font-display font-bold text-foreground">{topSpeed}</p>
              <p className="font-mono text-[10px] text-muted-foreground uppercase">km/h</p>
            </div>
          )}
          {horsepower && (
            <div className="text-center">
              <Zap className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="font-display font-bold text-foreground">{horsepower}</p>
              <p className="font-mono text-[10px] text-muted-foreground uppercase">hp</p>
            </div>
          )}
          {acceleration && (
            <div className="text-center">
              <Timer className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="font-display font-bold text-foreground">{acceleration}s</p>
              <p className="font-mono text-[10px] text-muted-foreground uppercase">0-100</p>
            </div>
          )}
        </div>

        {/* Racing stripe on hover */}
        <div
          className={cn(
            "mt-4 h-0.5 bg-racing-gradient rounded-full transition-all duration-500",
            isHovered ? "w-full" : "w-0"
          )}
        />
      </Link>
    </div>
  );
};
