"use client";

import { useRef, type ReactNode } from "react";

/**
 * Pointer-driven 3D tilt. Deliberately restrained: a few degrees, spring-eased,
 * and completely disabled for touch devices and reduced-motion visitors.
 */
export function TiltCard({
  children,
  className = "",
  intensity = 7,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node || !canTilt()) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `rotateY(${x * intensity * 2}deg) rotateX(${
      -y * intensity * 2
    }deg) translateZ(0)`;
  }

  function reset() {
    const node = ref.current;
    if (node) node.style.transform = "";
  }

  return (
    <div className="scene h-full">
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        className={`tilt h-full ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
