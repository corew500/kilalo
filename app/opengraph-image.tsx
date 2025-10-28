import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'Kilalo - Empowering DRC Entrepreneurs'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #215965 0%, #21654f 100%)',
          padding: '80px 100px',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            right: -50,
            top: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(243, 146, 0, 0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -30,
            bottom: -30,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(243, 146, 0, 0.15)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '-0.02em',
            marginBottom: 40,
            display: 'flex',
          }}
        >
          <span style={{ color: 'white' }}>KIL</span>
          <span style={{ color: '#F39200' }}>ALO</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 42,
            color: 'white',
            letterSpacing: '0.1em',
            fontWeight: 300,
            marginBottom: 30,
          }}
        >
          EMPOWERING DRC ENTREPRENEURS
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 300,
          }}
        >
          Venture Studio • Business Programs • Community
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
