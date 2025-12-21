import { NextResponse } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

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

function buildTransport() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT) || 587
  const secure = process.env.SMTP_SECURE === 'true'

  if (!user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

function renderLineItems(lineItems: any[] = []) {
  if (!Array.isArray(lineItems) || lineItems.length === 0) return 'No items'
  return lineItems
    .map((item) => `• ${item?.name ?? 'Course'} x ${item?.quantity ?? 1} — ${item?.total ?? ''}`)
    .join('\n')
}

async function sendReceiptEmail(order: any) {
  const transport = buildTransport()
  const billingEmail = order?.billing?.email
  const to = billingEmail || process.env.FALLBACK_ADMIN_EMAIL
  if (!transport || !to) {
    console.warn('Skipping receipt email; SMTP or recipient missing.')
    return
  }

  const subject = `Your Discover Who Am I purchase (Order #${order?.id ?? ''})`
  const text = [
    'Thank you for your purchase!',
    `Order reference: ${order?.id ?? 'N/A'}`,
    `Total: ${order?.currency ?? ''} ${order?.total ?? ''}`,
    '',
    'Items:',
    renderLineItems(order?.line_items),
    '',
    'You can access your courses anytime from My Courses after signing in.',
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a;">
      <h2>Thank you for your purchase!</h2>
      <p><strong>Order reference:</strong> ${order?.id ?? 'N/A'}</p>
      <p><strong>Total:</strong> ${order?.currency ?? ''} ${order?.total ?? ''}</p>
      <h3>Items</h3>
      <ul>
        ${(order?.line_items ?? [])
          .map(
            (item: any) =>
              `<li><strong>${item?.name ?? 'Course'}</strong> &times; ${item?.quantity ?? 1} — ${item?.total ?? ''}</li>`
          )
          .join('')}
      </ul>
      <p style="margin-top:16px;">You can access your courses anytime from <a href="${
        process.env.NEXT_PUBLIC_SITE_URL || 'https://discoverwhoami.com'
      }/my-courses">My Courses</a> after signing in.</p>
    </div>
  `

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@discoverwhoami.com',
    to,
    subject,
    text,
    html,
  })
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

    // Fire-and-forget receipt email; do not block the response if it fails.
    sendReceiptEmail(data).catch((err) => {
      console.error('Receipt email failed', err)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to finalize order.' }, { status: 500 })
  }
}
