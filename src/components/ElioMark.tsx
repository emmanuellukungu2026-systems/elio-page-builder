import logo from "@/assets/logo.png";
import logoInverted from "@/assets/logo-inverted.png";
import { cn } from "@/lib/utils";

/**
 * Small raster rendering of the Elio logo (kept in PNG format).
 * Set `invert` to use the color-swapped variant on dark surfaces
 * (e.g. the footer strip of the Professional template).
 */
export function ElioMark({ className, invert = false }: { className?: string; invert?: boolean }) {
  return <img src={invert ? logoInverted : logo} alt="Elio" className={cn("size-6 rounded-md", className)} />;
}
