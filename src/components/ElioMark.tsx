import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

/** Small raster rendering of the Elio logo (kept in PNG format). */
export function ElioMark({ className }: { className?: string }) {
  return <img src={logo} alt="Elio" className={cn("size-6 rounded-md", className)} />;
}
