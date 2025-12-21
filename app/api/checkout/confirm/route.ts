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

function getWooEnv() {
  const storeUrl = process.env.WC_STORE_URL?.replace(/\/+$/, '')
  const consumerKey = process.env.WC_CONSUMER_KEY
  const consumerSecret = process.env.WC_CONSUMER_SECRET
  if (!storeUrl || !consumerKey || !consumerSecret) {
    throw new Error('Missing WooCommerce credentials (WC_STORE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET).')
  }
  return { storeUrl, consumerKey, consumerSecret }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, wooOrderId } = body || {}

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !wooOrderId) {
    return NextResponse.json({ error: 'Missing payment confirmation parameters.' }, { status: 400 })
  }

  let razorEnv
  let wooEnv
  try {
    razorEnv = getRazorpayEnv()
    wooEnv = getWooEnv()
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }

  const generatedSignature = crypto
    .createHmac('sha256', razorEnv.keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  if (generatedSignature !== razorpaySignature) {
    return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 })
  }

  try {
    const res = await fetch(`${wooEnv.storeUrl}/wp-json/wc/v3/orders/${wooOrderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${wooEnv.consumerKey}:${wooEnv.consumerSecret}`).toString('base64')}`
      },
      body: JSON.stringify({
        status: 'completed',
        set_paid: true,
        transaction_id: razorpayPaymentId
      })
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || 'Unable to update order status.' }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to finalize order.' }, { status: 500 })
  }
}
