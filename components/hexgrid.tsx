import React from 'react';

interface HexGridProps {
  scale?: number;
  strokeWidth?: number;
  /** The base color class for the faint grid lines */
  baseColorClass?: string;
  /** The highlight color class for the random segments */
  highlightColorClass?: string;
  className?: string;
}

export default function HexGrid({
  scale = 30,
  strokeWidth = 1,
  baseColorClass = "stroke-muted-foreground/20", // Very faint base
  highlightColorClass = "stroke-primary",        // Bright highlights
  className = "absolute inset-0 -z-10",
}: HexGridProps) {
  const s = scale;
  const w = Math.sqrt(3) * s;
  const h = 2 * s;

  const patternId = `hex-grid-pattern-${scale}`;

  // This creates the "random" look.
  // The numbers represent: [Draw Length, Gap Length, Draw Length, Gap Length...]
  // We make the gaps huge so only small segments of primary color show up.
  const dashArray = `${s} ${s * 5} ${s / 2} ${s * 8}`;

  return (
    <svg
      className={`pointer-events-none w-full h-full ${className} fixed`}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width={w}
          height={3 * s}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(-${w / 2}, 0)`}
        >
          {/* SHARED PATH DATA: The shape of the hex grid tile */}
          {/* Note: We define the path once here to reuse it, but React requires us to render it twice for the layers */}
          
          {/* LAYER 1: The Base Grid (Muted, full opacity lines) */}
          <path
            d={`
              M ${w / 2} 0 L ${w} ${s / 2} L ${w} ${s * 1.5} L ${w / 2} ${s * 2} L 0 ${s * 1.5} L 0 ${s / 2} Z
              M ${w / 2} ${3 * s} L ${w} ${s * 3.5} L ${w} ${s * 4.5} L ${w / 2} ${s * 5} L 0 ${s * 4.5} L 0 ${s * 3.5} Z
            `}
            fill="none"
            className={baseColorClass}
            strokeWidth={strokeWidth}
          />

          {/* LAYER 2: The Highlight Grid (Primary, dashed lines) */}
          <path
            d={`
              M ${w / 2} 0 L ${w} ${s / 2} L ${w} ${s * 1.5} L ${w / 2} ${s * 2} L 0 ${s * 1.5} L 0 ${s / 2} Z
              M ${w / 2} ${3 * s} L ${w} ${s * 3.5} L ${w} ${s * 4.5} L ${w / 2} ${s * 5} L 0 ${s * 4.5} L 0 ${s * 3.5} Z
            `}
            fill="none"
            className={highlightColorClass}
            strokeWidth={strokeWidth}
            // This creates the "broken line" effect
            strokeDasharray={dashArray}
            // Offset the dashes slightly so they don't look too uniform
            strokeDashoffset={s} 
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}