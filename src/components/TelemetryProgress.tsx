import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TelemetryProgressProps {
  label: string;
  value: number;
  maxValue: number;
  variant?: "red" | "cyan" | "yellow";
  showValue?: boolean;
  delay?: number;
}

export const TelemetryProgress = ({
  label,
  value,
  maxValue,
  variant = "red",
  showValue = true,
  delay = 0,
}: TelemetryProgressProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = Math.min((value / maxValue) * 100, 100);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValue(percentage);
    }, delay);
    return () => clearTimeout(timeout);
  }, [percentage, delay]);

  const getVariantClasses = () => {
    switch (variant) {
      case "cyan":
        return "telemetry-bar-cyan";
      case "yellow":
        return "bg-gradient-to-r from-racing-yellow to-amber-400 shadow-[0_0_20px_hsl(var(--pit-yellow)/0.5)]";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {showValue && (
          <span className="font-mono text-sm font-semibold text-foreground">
            {value.toLocaleString()}
          </span>
        )}
      </div>
      <div className="telemetry-bar">
        <div
          className={cn("telemetry-bar-fill", getVariantClasses())}
          style={{
            width: `${animatedValue}%`,
            transition: `width 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
};
