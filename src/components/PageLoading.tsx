import aethel from "@/assets/aethel_small_logos.png";
import { motion } from "framer-motion";

/**
 * Full-screen loader for route transitions and page-level queries.
 * The Aethel logo breathes gently while a thin bar sweeps underneath.
 */
export function PageLoading({ label }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <div className="relative flex items-center justify-center">
        {/* soft accent glow behind the logo */}
        <div className="absolute size-28 rounded-full bg-primary/15 blur-2xl" />
        <motion.img
          src={aethel}
          alt="Aethel Technologies"
          className="relative size-16 rounded-2xl object-contain"
          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* sweeping progress line */}
      <div className="relative h-[3px] w-40 overflow-hidden rounded-full bg-border/60">
        <motion.div
          className="absolute inset-y-0 w-16 rounded-full bg-primary"
          animate={{ x: [-64, 160] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}
