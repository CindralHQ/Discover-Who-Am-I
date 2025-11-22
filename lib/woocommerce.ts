type WooCommerceEnvConfig = {
  storeUrl: string
  consumerKey: string
  consumerSecret: string
}

export type WooProductImage = {
  id: number
  src: string
  name: string
  alt: string
}

export type WooProduct = {
  id: number
  name: string
  slug: string
  permalink: string
  type: string
  status: string
  price: string
  regular_price: string
  sale_price: string
  price_html: string
  stock_status: string
  description: string
  short_description: string
  images: WooProductImage[]
}

export type FetchWooProductsOptions = {
  perPage?: number
  page?: number
  search?: string
  category?: number
  order?: 'asc' | 'desc'
  orderBy?: string
}

function normalizeStoreUrl(rawUrl: string) {
  return rawUrl.replace(/\/+$/, '')
}

export function getWooEnvConfig(): WooCommerceEnvConfig {
  const storeUrl = process.env.WC_STORE_URL?.trim()
  const consumerKey = process.env.WC_CONSUMER_KEY?.trim()
  const consumerSecret = process.env.WC_CONSUMER_SECRET?.trim()

  const missingVars = [
    storeUrl ? null : 'WC_STORE_URL',
    consumerKey ? null : 'WC_CONSUMER_KEY',
    consumerSecret ? null : 'WC_CONSUMER_SECRET',
  ].filter(Boolean)

  if (missingVars.length > 0) {
    throw new Error(`Missing WooCommerce env variables: ${missingVars.join(', ')}`)
  }

  return {
    storeUrl: normalizeStoreUrl(storeUrl!),
    consumerKey: consumerKey!,
    consumerSecret: consumerSecret!,
  }
}

export async function fetchWooProducts(options: FetchWooProductsOptions = {}): Promise<WooProduct[]> {
  const { storeUrl, consumerKey, consumerSecret } = getWooEnvConfig()
  const {
    perPage = 12,
    page = 1,
    search,
    category,
    order = 'desc',
    orderBy = 'date',
  } = options

  const url = new URL('/wp-json/wc/v3/products', `${storeUrl}/`)
  url.searchParams.set('per_page', perPage.toString())
  url.searchParams.set('page', page.toString())
  url.searchParams.set('order', order)
  if (orderBy) {
    url.searchParams.set('orderby', orderBy)
  }
  if (search) {
    url.searchParams.set('search', search)
  }
  if (category) {
    url.searchParams.set('category', category.toString())
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
      Accept: 'application/json',
    },
    // Products should update quickly, but we can still leverage caching.
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `WooCommerce request failed (${response.status} ${response.statusText}): ${body.slice(0, 200)}`
    )
  }

  const data = (await response.json()) as WooProduct[]
  return data
}

export function buildWooCheckoutUrl(
  productId: number,
  options: { quantity?: number; redirectToCheckout?: boolean } = {}
) {
  const {
    quantity = 1,
    redirectToCheckout = true,
  } = options

  const baseStoreUrl =
    process.env.WC_STORE_URL?.trim() ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://wordpress.discoverwhoami.com')

  const normalizedBase = normalizeStoreUrl(baseStoreUrl)
  const url = new URL('/', `${normalizedBase}/`)
  url.searchParams.set('add-to-cart', productId.toString())
  url.searchParams.set('quantity', quantity.toString())
  if (redirectToCheckout) {
    url.searchParams.set('redirect_to_checkout', 'true')
  }

  return url.toString()
}
