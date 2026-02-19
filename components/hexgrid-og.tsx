interface HexGridOGProps {
    width?: number
    height?: number
    scale?: number
    // Converted 'oklch(0.25 0.01 240)' to hex for compatibility
    color?: string 
    pointSize?: number
  }
  
  export default function HexGridOG({
    width = 1200 * 2,
    height = 630 * 2,
    scale = 15,
    color = "#1d2226", // Matches oklch(0.25 0.01 240)
    pointSize = 1.5,
  }: HexGridOGProps) {
    const s = scale
    const w = Math.sqrt(3) * s
  
    const cols = Math.ceil(width / w) + 2
    const rows = Math.ceil(height / (1.5 * s)) + 2
  
    const uniquePoints = new Set<string>()
    const circles: JSX.Element[] = []
  
    // Hexagon math
    const hexVertices = (x: number, y: number) => [
      [x + w / 2, y],
      [x + w, y + s / 2],
      [x + w, y + s * 1.5],
      [x + w / 2, y + s * 2],
      [x, y + s * 1.5],
      [x, y + s / 2],
    ]
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * w + (row % 2) * (w / 2)
        const y = row * 1.5 * s
  
        const vertices = hexVertices(x, y)
  
        vertices.forEach(([vx, vy]) => {
          // Round to 1 decimal to handle floating point jitter
          const key = `${vx.toFixed(1)},${vy.toFixed(1)}`
          
          if (!uniquePoints.has(key)) {
            uniquePoints.add(key)
            circles.push(
              <circle
                key={key}
                cx={vx}
                cy={vy}
                r={pointSize}
                fill={color}
              />
            )
          }
        })
      }
    }
  
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          inset: 0,
          // The opacity prop from your class 'opacity-75'
          opacity: 0.75, 
        }}
      >
        <defs>
          {/* 
            Replicating your Tailwind mask-image:
            radial-gradient(circle_at_center, rgba(255,255,255,0.35)_20%, white_70%, white_80%, rgba(255,255,255,0.25)_100%)
          */}
          <radialGradient id="complexMask" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            {/* 0% to 20%: 35% opacity */}
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="20%" stopColor="white" stopOpacity="0.35" />
            
            {/* 20% to 70%: Fade to 100% opacity */}
            <stop offset="70%" stopColor="white" stopOpacity="1" />
            
            {/* 70% to 80%: Hold 100% opacity */}
            <stop offset="80%" stopColor="white" stopOpacity="1" />
            
            {/* 80% to 100%: Fade down to 25% opacity */}
            <stop offset="100%" stopColor="white" stopOpacity="0.25" />
          </radialGradient>
  
          <mask id="gridMask">
            <rect width="100%" height="100%" fill="url(#complexMask)" />
          </mask>
        </defs>
  
        <g mask="url(#gridMask)">
          {circles}
        </g>
      </svg>
    )
  }