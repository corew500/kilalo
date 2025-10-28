import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// Generate OG Image (1200x630)
const ogSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#215965;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#21654f;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#gradient)" />

  <!-- Decorative circles -->
  <circle cx="1150" cy="50" r="150" fill="#F39200" opacity="0.2" />
  <circle cx="70" cy="580" r="100" fill="#F39200" opacity="0.15" />

  <!-- Logo -->
  <text x="100" y="220" font-family="Arial, sans-serif" font-size="120" font-weight="bold" letter-spacing="-2">
    <tspan fill="white">KIL</tspan><tspan fill="#F39200">ALO</tspan>
  </text>

  <!-- Tagline -->
  <text x="100" y="310" font-family="Arial, sans-serif" font-size="42" fill="white" letter-spacing="4" font-weight="300">
    EMPOWERING DRC ENTREPRENEURS
  </text>

  <!-- Subtitle -->
  <text x="100" y="380" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.9)" font-weight="300">
    Venture Studio • Business Programs • Community
  </text>
</svg>
`

// Generate Favicon (32x32)
const faviconSvg = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#215965" rx="6" />
  <text x="16" y="24" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">
    K
  </text>
</svg>
`

// Generate Apple Icon (180x180)
const appleSvg = `
<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#215965;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#21654f;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="180" height="180" fill="url(#gradient2)" />
  <text x="90" y="135" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white" text-anchor="middle">
    K
  </text>
</svg>
`

async function generateImages() {
  console.log('Generating OG image...')
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(join(publicDir, 'opengraph-image.png'))

  console.log('Generating favicon...')
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.png'))

  console.log('Generating Apple icon...')
  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'))

  console.log('✅ All images generated successfully!')
}

generateImages().catch(console.error)
