"use client"
import React, { useEffect, useRef } from "react";

interface HexGridProps {
  scale?: number;
  strokeWidth?: number;
  strokeColor?: string;
  className?: string;
}

export default function HexGrid({
  scale = 40,
  strokeWidth = 1,
  strokeColor = "rgba(156, 163, 175, 0.15)", // subtle muted foreground
  className = "absolute inset-0 -z-10",
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

    const drawHex = (x: number, y: number) => {
      const vertices: [number, number][] = [
        [x + w / 2, y],
        [x + w, y + s / 2],
        [x + w, y + s * 1.5],
        [x + w / 2, y + s * 2],
        [x, y + s * 1.5],
        [x, y + s / 2],
      ];

      ctx.beginPath();
      vertices.forEach(([vx, vy], i) => {
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      });
      ctx.closePath();

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    };

    // Draw all hexes
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * w + (row % 2) * (w / 2);
        const y = row * 1.5 * s;
        drawHex(x, y);
      }
    }
  }, [s, w, strokeWidth, strokeColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
