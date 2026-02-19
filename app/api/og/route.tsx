import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Zecant - AI-Powered Trading Strategy Platform'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 86400

export const GET = async () => {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          // 1. Swapped radial-gradient to a supported linear-gradient fallback
          backgroundImage: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 0%, #0a0a0a 70%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        
        {/* 2. Grid pattern replaced with a raw SVG element natively supported by Satori */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
          }}
        >
          <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            zIndex: 1
          }}
        >
          <span
            style={{
              fontSize: '120px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              lineHeight: 1
            }}
          >
            ZECANT
          </span>
          <span style={{ fontSize: '28px', color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '0.02em' }}>
            Turn Ideas Into Alpha
          </span>
          <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
            AI-Powered Trading Strategy Platform
          </span>
        </div>
        
        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            height: '3px',
            width: '200px',
            // 3. Fixed strict Satori gradient syntax
            backgroundImage: 'linear-gradient(to right, rgba(99,102,241,0), #6366f1, rgba(99,102,241,0))'
          }}
        />
      </div>
    ),
    { ...size }
  )
}