import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

/**
 * Reusable 3D-tilt glass card that subtly follows the cursor.
 * Used for hero preview, feature bento and service packs.
 */
export function TiltCard({
  children,
  className,
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  return (
    <motion.div
      className={cn("relative [transform-style:preserve-3d]", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ x: -py * max, y: px * max });
      }}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => {
        setActive(false);
        setTilt({ x: 0, y: 0 });
      }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: active ? 1.015 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
