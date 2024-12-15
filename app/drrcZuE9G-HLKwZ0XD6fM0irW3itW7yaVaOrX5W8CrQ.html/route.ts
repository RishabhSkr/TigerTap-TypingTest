import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse('google-site-verification: drrcZuE9G-HLKwZ0XD6fM0irW3itW7yaVaOrX5W8CrQ', {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
