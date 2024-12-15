import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = false

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
