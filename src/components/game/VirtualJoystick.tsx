"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Vector } from "@/types/game";

interface VirtualJoystickProps {
  onMove: (vector: Vector) => void;
}

export default function VirtualJoystick({ onMove }: VirtualJoystickProps) {
  const [active, setActive] = useState(false);
  const [thumbPos, setThumbPos] = useState({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width * 0.34;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > maxRadius) {
      deltaX = (deltaX / distance) * maxRadius;
      deltaY = (deltaY / distance) * maxRadius;
    }

    setThumbPos({ x: deltaX, y: deltaY });

    // Normalize output vector between -1 and 1
    onMove({
      dx: deltaX / maxRadius,
      dy: deltaY / maxRadius,
    });
  }, [onMove]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setActive(true);
    handleMove(clientX, clientY);
  }, [handleMove]);

  const handleEnd = useCallback(() => {
    setActive(false);
    setThumbPos({ x: 0, y: 0 });
    onMove({ dx: 0, dy: 0 });
  }, [onMove]);

  // Touch event listeners
  useEffect(() => {
    const baseElement = baseRef.current;
    if (!baseElement) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.targetTouches[0];
      handleStart(touch.clientX, touch.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.targetTouches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handleEnd();
    };

    baseElement.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      baseElement.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [handleEnd, handleMove, handleStart]);

  // Mouse event listeners for desktop testing
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (active) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const onMouseUp = () => {
      if (active) {
        handleEnd();
      }
    };

    if (active) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [active, handleEnd, handleMove]);

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-6 sm:left-6 z-40 flex flex-col items-center pointer-events-auto select-none">
      <div
        ref={baseRef}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-pearl/80 border-4 border-seafoam/80 backdrop-blur-md shadow-2xl flex items-center justify-center cursor-pointer transition-transform active:scale-95"
        style={{ touchAction: "none" }}
      >
        {/* Directional ticks */}
        <div className="absolute top-2 w-1.5 h-3 bg-reef/30 rounded-full" />
        <div className="absolute bottom-2 w-1.5 h-3 bg-reef/30 rounded-full" />
        <div className="absolute left-2 w-3 h-1.5 bg-reef/30 rounded-full" />
        <div className="absolute right-2 w-3 h-1.5 bg-reef/30 rounded-full" />

        {/* Movable Thumb Stick */}
        <div
          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-coral to-sunset border-2 border-white shadow-lg flex items-center justify-center transition-transform ${
            active ? "duration-75 scale-105" : "duration-300 ease-out"
          }`}
          style={{
            transform: `translate3d(${thumbPos.x}px, ${thumbPos.y}px, 0)`,
          }}
        >
          <div className="w-5 h-5 rounded-full bg-white/50" />
        </div>
      </div>
      <span className="mt-1 hidden sm:block text-[11px] font-heading font-bold text-reef/80 bg-pearl/90 px-2.5 py-0.5 rounded-full shadow-sm border border-white/60">
        Move Joystick / WASD
      </span>
    </div>
  );
}
