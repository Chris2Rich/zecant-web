import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Zecant - AI-Powered Trading Strategy Platform'
export const size = {
  width: 1200,
  height: 630
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        position: 'relative'
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, rgba(10, 10, 10, 1) 70%)'
        }}
      />
      
      {/* Grid pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
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
        {/* ZECANT logo text */}
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
        
        {/* Tagline */}
        <span
          style={{
            fontSize: '28px',
            color: 'rgba(255,255,255,0.6)',
            fontWeight: 500,
            letterSpacing: '0.02em'
          }}
        >
          Turn Ideas Into Alpha
        </span>
        
        {/* Sub tagline */}
        <span
          style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '8px'
          }}
        >
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
          background: 'linear-gradient(90deg, transparent, #6366f1, transparent)'
        }}
      />
    </div>,
    {
      ...size
    }
  )
}
