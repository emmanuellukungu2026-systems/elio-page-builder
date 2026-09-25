import aethel from "@/assets/aethel_small_logos.png";
import { cn } from "@/lib/utils";

/** Small raster rendering of the Aethel Technologies logo (parent company). */
export function AethelMark({ className }: { className?: string }) {
  return (
    <img
      src={aethel}
      alt="Aethel Technologies"
      className={cn("size-6 rounded-md object-contain", className)}
    />
  );
}
