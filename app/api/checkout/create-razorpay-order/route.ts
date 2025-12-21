import { NextResponse } from 'next/server'
import crypto from 'crypto'

function getRazorpayEnv() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    throw new Error('Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET.')
  }
  return { keyId, keySecret }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const amount = body?.amount
  const currency = body?.currency || 'INR'
  const receipt = body?.receipt || `order_${crypto.randomUUID()}`

  if (!amount || Number.isNaN(Number(amount))) {
    return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 })
  }

  let envConfig
  try {
    envConfig = getRazorpayEnv()
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }

  try {
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${envConfig.keyId}:${envConfig.keySecret}`).toString('base64')}`
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount) * 100),
        currency,
        receipt
      })
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.description || 'Unable to create Razorpay order.' }, { status: res.status })
    }

    return NextResponse.json({
      razorpayOrderId: data.id,
      amount: data.amount,
      currency: data.currency
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to create Razorpay order.' }, { status: 500 })
  }
}
