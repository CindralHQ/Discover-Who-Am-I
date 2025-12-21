import { NextResponse } from 'next/server'

function getWooEnv() {
  const storeUrl = process.env.WC_STORE_URL?.replace(/\/+$/, '')
  const consumerKey = process.env.WC_CONSUMER_KEY
  const consumerSecret = process.env.WC_CONSUMER_SECRET
  if (!storeUrl || !consumerKey || !consumerSecret) {
    throw new Error('Missing WooCommerce credentials (WC_STORE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET).')
  }
  return { storeUrl, consumerKey, consumerSecret }
}

function sanitizePrice(value?: string | null) {
  if (!value) return null
  const withoutTags = value.replace(/<[^>]*>?/g, ' ').replace(/\s+/g, ' ').trim()
  return withoutTags.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number.parseInt(code, 10)))
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const ids = Array.isArray(body?.ids) ? body.ids.filter((n: any) => Number.isFinite(Number(n))) : []
  if (ids.length === 0) {
    return NextResponse.json({ error: 'No product ids provided.' }, { status: 400 })
  }

  let env
  try {
    env = getWooEnv()
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }

  try {
    const url = new URL(`${env.storeUrl}/wp-json/wc/v3/products`)
    url.searchParams.set('include', ids.join(','))
    url.searchParams.set('per_page', ids.length.toString())

    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${env.consumerKey}:${env.consumerSecret}`).toString('base64')}`,
        Accept: 'application/json'
      }
    })
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || 'Unable to fetch products.' }, { status: res.status })
    }

    const mapped = Array.isArray(data)
      ? data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: sanitizePrice(p.price_html) ?? sanitizePrice(p.price) ?? null
        }))
      : []

    return NextResponse.json({ products: mapped })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to fetch products.' }, { status: 500 })
  }
}
