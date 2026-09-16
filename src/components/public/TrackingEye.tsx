"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface TrackingEyeProps {
  className?: string;
  maxOffset?: number;
}

/** Eye socket + pupil — assets used as-is (already black, no background). */
export function TrackingEye({ className = "", maxOffset = 0.16 }: TrackingEyeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pupil = pupilRef.current;
    if (!root || !pupil) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const max = Math.min(rect.width, rect.height) * maxOffset;
      const clamped = Math.min(dist, max);
      targetX = (dx / dist) * clamped;
      targetY = (dy / dist) * clamped;
    };

    const reset = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      pupil.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", reset);
    };
  }, [maxOffset]);

  return (
    <div
      ref={rootRef}
      className={`relative select-none pointer-events-none ${className}`}
      aria-hidden
    >
      <div
        ref={pupilRef}
        className="absolute left-1/2 top-[52%] z-0 h-[72%] w-[72%] will-change-transform"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <Image
          src="/assets/bola-mata.png"
          alt=""
          fill
          sizes="120px"
          className="object-contain scale-[1.35]"
          priority
        />
      </div>

      <Image
        src="/assets/mata.png"
        alt=""
        fill
        sizes="128px"
        className="relative z-10 object-contain"
        priority
      />
    </div>
  );
}
