import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  // Read the service worker file from public directory
  const swPath = path.join(process.cwd(), 'public', 'sw.js')
  const swContent = fs.readFileSync(swPath, 'utf8')

  return new NextResponse(swContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Service-Worker-Allowed': '/',
    },
  })
}
