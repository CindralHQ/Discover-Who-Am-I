import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID

  if (!key) {
    return NextResponse.json({ key: null, error: 'Razorpay key not configured' }, { status: 500 })
  }

  return NextResponse.json({ key })
}
