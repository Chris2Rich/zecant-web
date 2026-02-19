import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Zecant - AI-Powered Trading Strategy Platform'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 86400

export const GET = async () => {
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient (Changed to backgroundImage) */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, rgba(10, 10, 10, 1) 70%)'
        }}
      />
      
      {/* Grid pattern (Fixed using single SVG url) */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 L 0 0 L 40 0' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/svg%3E")`,
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
          backgroundImage: 'linear-gradient(90deg, transparent, #6366f1, transparent)'
        }}
      />
    </div>,
    { ...size }
  )
}