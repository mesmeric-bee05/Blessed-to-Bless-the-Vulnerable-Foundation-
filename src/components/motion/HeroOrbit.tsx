"use client";

import { useEffect, useRef } from "react";

/**
 * The site's one piece of 3D sculpture: woven Kenyan textile geometry expressed
 * as concentric orbits around a warm core. Pointer movement shifts the whole
 * assembly by a few degrees; the rings rotate on their own via CSS.
 */
export function HeroOrbit() {
  const scene = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scene.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        node.style.setProperty("--rx", (x * 10).toFixed(2));
        node.style.setProperty("--ry", (y * -8).toFixed(2));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="scene relative mx-auto aspect-square w-full max-w-[34rem]" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(217,162,83,0.16),transparent_62%)] blur-2xl" />
      <div ref={scene} className="orbital absolute inset-[6%]">
        <div className="ring" />
        <div className="ring" />
        <div className="ring" />
        <div className="ring" />
        <div className="orb-core" />
      </div>
    </div>
  );
}
