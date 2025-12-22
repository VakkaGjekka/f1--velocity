import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trophy, Medal, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DriverCardProps {
  id: string;
  name: string;
  nationality: string;
  team: string;
  number: number;
  championships: number;
  podiums: number;
  wins: number;
  imageUrl?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  rank?: number;
}

export const DriverCard = ({
  id,
  name,
  nationality,
  team,
  number,
  championships,
  podiums,
  wins,
  imageUrl,
  isFavorite = false,
  onToggleFavorite,
  rank,
}: DriverCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="racing-card group cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rank badge */}
      {rank && (
        <div className="absolute -top-3 -left-3 z-10 w-10 h-10 bg-racing-gradient rounded-full flex items-center justify-center font-display font-black text-lg text-primary-foreground shadow-lg">
          {rank}
        </div>
      )}

      {/* Driver Number Background */}
      <div className="absolute top-4 right-4 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="driver-number text-8xl">{number}</span>
      </div>

      {/* Content */}
      <Link to={`/drivers/${id}`} className="block relative z-10">
        <div className="p-6">
          {/* Image */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className={cn(
                  "w-full h-full object-cover rounded-full border-2 border-border transition-all duration-500",
                  isHovered && "border-primary scale-105"
                )}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center border-2 border-border">
                <span className="font-display font-bold text-2xl text-muted-foreground">
                  {name.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Glowing ring on hover */}
            <div
              className={cn(
                "absolute inset-0 rounded-full border-2 border-primary transition-all duration-500",
                isHovered ? "opacity-100 scale-110" : "opacity-0 scale-100"
              )}
            />
          </div>

          {/* Driver Info */}
          <div className="text-center mb-4">
            <p className="font-mono text-xs text-racing-cyan uppercase tracking-wider mb-1">
              {team}
            </p>
            <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-1">
              {name}
            </h3>
            <p className="font-body text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Flag className="w-3 h-3" />
              {nationality}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
            <div className="text-center">
              <Trophy className="w-4 h-4 mx-auto mb-1 text-racing-yellow" />
              <p className="font-display font-bold text-lg text-foreground">{championships}</p>
              <p className="font-mono text-[10px] text-muted-foreground uppercase">Titles</p>
            </div>
            <div className="text-center">
              <Medal className="w-4 h-4 mx-auto mb-1 text-racing-cyan" />
              <p className="font-display font-bold text-lg text-foreground">{podiums}</p>
              <p className="font-mono text-[10px] text-muted-foreground uppercase">Podiums</p>
            </div>
            <div className="text-center">
              <Flag className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="font-display font-bold text-lg text-foreground">{wins}</p>
              <p className="font-mono text-[10px] text-muted-foreground uppercase">Wins</p>
            </div>
          </div>

          {/* Favorite button */}
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20 bg-background/50 backdrop-blur-sm hover:bg-background/80"
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
        </div>
      </Link>
    </div>
  );
};
