"use client";
import React, { useEffect, useRef } from "react";

interface HexGridProps {
  scale?: number;
  strokeWidth?: number;
  strokeColor?: string;
  pointSize?: number;
  className?: string;
}

export default function HexGrid({
  scale = 15,
  strokeWidth = 1,
  strokeColor = "oklch(0.25 0.01 240)",
  pointSize = 0.75,
  className = "fixed opacity-75 inset-0 [mask-image:radial-gradient(circle_at_center,rgba(255,255,255,0.35)_20%,white_80%,rgba(255,255,255,0.25)_100%)] -z-10",
}: HexGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const s = scale;
  const w = Math.sqrt(3) * s;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const cols = Math.ceil(width / w) + 2;
    const rows = Math.ceil(height / (1.5 * s)) + 2;

    const hexVertices = (x: number, y: number): [number, number][] => [
      [x + w / 2, y],
      [x + w, y + s / 2],
      [x + w, y + s * 1.5],
      [x + w / 2, y + s * 2],
      [x, y + s * 1.5],
      [x, y + s / 2],
    ];

    const drawPoint = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, pointSize, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();
    };

    // Draw only vertices
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * w + (row % 2) * (w / 2);
        const y = row * 1.5 * s;

        const vertices = hexVertices(x, y);
        vertices.forEach(([vx, vy]) => drawPoint(vx, vy));
      }
    }
  }, [s, w, strokeWidth, strokeColor, pointSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
