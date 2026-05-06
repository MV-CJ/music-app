"use client";

import { useEffect, useRef, useState } from "react";

export function FloatingVideo({
  src,
  onClose,
  videoRef,
  onTimeUpdate,
  onLoadedMetadata,
  onEnd,
  startTime,
}: any) {
  const [pos, setPos] = useState({ x: 20, y: 200 });
  const [dragging, setDragging] = useState(false);

  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);

    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;

      let newX = e.clientX - offset.current.x;
      let newY = e.clientY - offset.current.y;

      const maxX = window.innerWidth - 300;
      const maxY = window.innerHeight - 180;

      setPos({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const onUp = () => setDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  return (
    <div
      style={{ position: "fixed", left: pos.x, top: pos.y }}
      onMouseDown={onMouseDown}
      className="w-72 h-40 bg-black rounded-xl overflow-hidden shadow-2xl z-50 cursor-grab"
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        autoPlay
        onEnded={onEnd}
        onLoadedMetadata={(e: any) => {
          const video = e.currentTarget;

          onLoadedMetadata(video.duration);

          // 🔥 GARANTE que tempo seja aplicado SEMPRE
          if (typeof startTime === "number") {
            video.currentTime = startTime;
          }

          // 🔥 força play confiável
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        }}
        onTimeUpdate={(e: any) =>
          onTimeUpdate(e.currentTarget.currentTime)
        }
        className="w-full h-full object-cover"
      />

      <button
        onClick={onClose}
        className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 rounded"
      >
        ✕
      </button>
    </div>
  );
}