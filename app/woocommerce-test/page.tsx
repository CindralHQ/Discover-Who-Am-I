import Link from 'next/link'

import { buildWooCheckoutUrl, fetchWooProducts, type WooProduct } from '@/lib/woocommerce'

export const metadata = {
  title: 'WooCommerce Product Fetch Test',
}

export const dynamic = 'force-dynamic'

function stripHtml(value?: string | null) {
  if (!value) return ''
  return value.replace(/<[^>]*>?/g, '').replace(/\s+/g, ' ').trim()
}

export default async function WooCommerceTestPage() {
  let products: WooProduct[] = []
  let errorMessage: string | null = null

  try {
    products = await fetchWooProducts({ perPage: 9 })
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : 'Unable to fetch products right now. Please try again shortly.'
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4 rounded-3xl border border-indigo-100 bg-white/90 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">Integration Test</p>
        <h1 className="text-3xl font-semibold tracking-tight text-indigo-900">WooCommerce Products</h1>
        <p className="text-base leading-7 text-indigo-800">
          This page makes a server-side request to the WooCommerce REST API, letting you quickly confirm that the store
          credentials in <code className="font-mono text-indigo-900">.env.local</code> are configured correctly.
        </p>
        <ul className="text-sm text-indigo-700">
          <li>• Set <code className="font-mono text-indigo-900">WC_STORE_URL</code> to your WordPress site URL.</li>
          <li>• Provide REST API credentials via <code className="font-mono text-indigo-900">WC_CONSUMER_KEY</code> and{' '}
            <code className="font-mono text-indigo-900">WC_CONSUMER_SECRET</code>.
          </li>
          <li>• Restrict the key to read-only access inside WooCommerce for safety.</li>
        </ul>
      </section>

      <section className="rounded-3xl border border-indigo-100 bg-white/95 p-6 shadow-sm">
        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-rose-800">
            <p className="font-semibold">Request failed</p>
            <p className="mt-1 text-sm leading-6">{errorMessage}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/70 p-6 text-indigo-700">
            <p className="font-semibold">No products returned yet.</p>
            <p className="mt-1 text-sm leading-6">
              Add a product inside WordPress → WooCommerce or relax the filters in{' '}
              <code className="font-mono text-indigo-900">fetchWooProducts()</code>.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-400">Results</p>
              <p className="text-lg text-indigo-800">
                Showing the {products.length} most recent products ordered by publish date.
              </p>
            </div>
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const heroImage = product.images?.[0]
                const checkoutUrl = buildWooCheckoutUrl(product.id)
                const priceText = stripHtml(product.price_html) || product.price || 'Price unavailable'
                const summary = stripHtml(product.short_description || product.description) || 'No summary provided yet.'

                return (
                  <li
                    key={product.id}
                    className="flex flex-col rounded-2xl border border-indigo-100 bg-white/90 shadow-sm"
                  >
                    <div className="relative overflow-hidden rounded-t-2xl border-b border-indigo-50 bg-indigo-50">
                      {heroImage ? (
                        // Using native img tag keeps the page simple without updating next.config domains.
                        <img
                          src={heroImage.src}
                          alt={heroImage.alt || heroImage.name || product.name}
                          className="h-60 w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-60 items-center justify-center text-sm text-indigo-500">No image</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col space-y-4 p-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-indigo-400">{product.type}</p>
                        <h2 className="text-xl font-semibold text-indigo-900">{product.name}</h2>
                        <p className="text-sm text-indigo-600">Status: {product.status}</p>
                      </div>
                      <p className="flex-1 text-sm leading-6 text-indigo-800">{summary}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-indigo-900">{priceText}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.stock_status === 'instock'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {product.stock_status === 'instock' ? 'In stock' : 'Check stock'}
                        </span>
                      </div>
                      <Link
                        href={checkoutUrl}
                        className="inline-flex items-center justify-center rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Go to Checkout ↗
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
