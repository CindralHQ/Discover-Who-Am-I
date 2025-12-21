import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { LEARNPRESS_USER_COOKIE, parseLearnPressUserCookie } from '@/lib/learnpress'

type OrderItem = { productId: number; quantity?: number }

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
  const items = Array.isArray(body?.items) ? (body.items as OrderItem[]) : []
  const billing = body?.billing

  if (items.length === 0) {
    return NextResponse.json({ error: 'No products specified.' }, { status: 400 })
  }

  let envConfig
  try {
    envConfig = getWooEnv()
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }

  // Attach the signed-in LearnPress user to the WooCommerce order so course access can sync back.
  const cookieStore = cookies()
  const userInfo = parseLearnPressUserCookie(cookieStore.get(LEARNPRESS_USER_COOKIE)?.value)
  const userId = userInfo?.id ? Number(userInfo.id) : undefined
  const hasCustomerId = Number.isFinite(userId)

  const payload: {
    payment_method: string
    payment_method_title: string
    set_paid: boolean
    billing: typeof billing
    line_items: { product_id: number; quantity: number }[]
    customer_id?: number
  } = {
    payment_method: 'razorpay',
    payment_method_title: 'Razorpay',
    set_paid: false,
    billing,
    line_items: items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity ?? 1
    }))
  }

  if (hasCustomerId) {
    payload.customer_id = Number(userId)
  }

  try {
    const res = await fetch(`${envConfig.storeUrl}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${envConfig.consumerKey}:${envConfig.consumerSecret}`).toString('base64')}`
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || 'Unable to create order.' }, { status: res.status })
    }

    return NextResponse.json({
      orderId: data.id,
      total: data.total,
      currency: data.currency
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to create order.' }, { status: 500 })
  }
}
