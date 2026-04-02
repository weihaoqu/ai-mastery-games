"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Evidence } from "@/lib/types";
import { basePath } from "@/lib/basePath";

interface InteractiveSceneProps {
  imagePath: string;
  evidence: Evidence[];
  discoveredIds: Set<string>;
  onDiscover: (evidence: Evidence) => void;
}

export default function InteractiveScene({ imagePath, evidence, discoveredIds, onDiscover }: InteractiveSceneProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const hotspotEvidence = evidence.filter(e => e.hotspot);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(3, Math.max(1, prev - e.deltaY * 0.002)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    const t = e.touches[0];
    setDragging(true);
    dragStart.current = { x: t.clientX, y: t.clientY, panX: pan.x, panY: pan.y };
  }, [zoom, pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - dragStart.current.x;
    const dy = t.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  }, [dragging]);

  const handleHotspotClick = useCallback((ev: Evidence, e: React.MouseEvent) => {
    e.stopPropagation();
    onDiscover(ev);
  }, [onDiscover]);

  // Reset pan when zoom returns to 1
  if (zoom <= 1 && (pan.x !== 0 || pan.y !== 0)) {
    setPan({ x: 0, y: 0 });
  }

  return (
    <div className="w-full">
      <div
        className="relative w-full rounded-2xl overflow-hidden border-2 border-outline-variant shadow-[0_4px_0_0_rgba(0,106,45,0.4)] select-none"
        style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center center",
            transition: dragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          <img
            src={`${basePath}${imagePath}`}
            alt="Investigation scene"
            className="w-full h-auto block"
            draggable={false}
          />

          {hotspotEvidence.map((ev) => {
            const hs = ev.hotspot!;
            const discovered = discoveredIds.has(ev.id);
            return (
              <button
                key={ev.id}
                onClick={(e) => handleHotspotClick(ev, e)}
                className={`absolute rounded-lg transition-all ${
                  discovered
                    ? "border-2 border-primary/60 bg-primary/10"
                    : "border-0 bg-transparent hover:bg-white/10"
                }`}
                style={{
                  left: `${hs.x}%`,
                  top: `${hs.y}%`,
                  width: `${hs.w}%`,
                  height: `${hs.h}%`,
                  cursor: discovered ? "pointer" : "zoom-in",
                }}
                aria-label={discovered ? ev.title : "Investigate this area"}
              >
                {discovered && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary text-xs">check</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-xs text-on-surface-variant font-label">
          {zoom > 1 ? "Drag to pan \u2022 Scroll to zoom" : "Scroll to zoom \u2022 Click glowing areas to investigate"}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setZoom(prev => Math.min(3, prev + 0.5))}
            className="w-7 h-7 bg-surface-container-lowest border border-outline-variant rounded flex items-center justify-center hover:bg-surface-bright text-xs"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="w-7 h-7 bg-surface-container-lowest border border-outline-variant rounded flex items-center justify-center hover:bg-surface-bright text-xs"
          >
            <span className="material-symbols-outlined text-sm">fit_screen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
