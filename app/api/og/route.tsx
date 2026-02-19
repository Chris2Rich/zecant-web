import { ImageResponse } from 'next/og'
import HexGridOG from "@/components/hexgrid-og"

export const runtime = 'edge'
export const alt = 'Zecant - AI-Powered Trading Strategy Platform'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 86400

export const GET = async () => {
  const [interRegular, interBlack] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff').then((res) =>
      res.arrayBuffer()
    ),
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-900-normal.woff').then((res) =>
      res.arrayBuffer()
    ),
  ])
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
          backgroundColor: '#03060b',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '"Inter", sans-serif',
        }}
      >

        {/* Hexgrid with CSS maskImage */}
        <HexGridOG width={1200} height={630} />

        {/* Main content - centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            padding: '0 48px',
          }}
        >
          {/* "Turn Ideas Into Alpha" */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              fontSize: '96px',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              whiteSpace: 'pre',
            }}
          >
            <span style={{ color: '#f0f0f5' }}>Turn </span>
            <span style={{ color: '#4a78ea' }}>Ideas</span>
            <span style={{ color: '#f0f0f5' }}> Into Alpha</span>
          </div>
          <br />
          {/* Subtext */}
          <div
            style={{
              display: 'flex',
              fontSize: '22px',
              color: '#9ca3af',
              textAlign: 'center',
              maxWidth: '600px',
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            Zecant lets you programmatically generate and backtest trading strategies using natural language.
            Algorithmic trading democratised.
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '315px',
            height: '2px',
            width: '720px',
            background: 'linear-gradient(90deg, transparent, #4a78ea, transparent)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interRegular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Inter',
          data: interBlack,
          style: 'normal',
          weight: 900,
        },
      ],
    }
  )
}
