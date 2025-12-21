'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type Billing = {
  first_name: string
  last_name: string
  email: string
  phone: string
  address_1: string
  address_2?: string
  city: string
  state: string
  postcode: string
  country: string
}

type SearchParams = { [key: string]: string | string[] | undefined }

type ProductInfo = {
  id: number
  name: string
  description: string
  badge: string
  color: string
  ownedHints: string[]
}
type ProductKey = 'wai1' | 'wai2' | 'wai3' | 'wai4'

const PRODUCTS: Record<ProductKey, ProductInfo> = {
  wai1: {
    id: 2462,
    name: 'WAI Part I — Purification',
    description: 'Foundation of chakra and kundalini awakening.',
    badge: 'Part I',
    color: 'bg-amber-100 text-amber-800',
    ownedHints: ['wai part 1', 'who am i - part i', 'part i', 'part 1', 'wai1', 'purification']
  },
  wai2: {
    id: 2464,
    name: 'WAI Part II — Blossoming',
    description: 'Heart-centered expansion and blossoming.',
    badge: 'Part II',
    color: 'bg-emerald-100 text-emerald-800',
    ownedHints: ['wai part 2', 'who am i - part ii', 'part ii', 'part 2', 'wai2', 'blossoming']
  },
  wai3: {
    id: 2466,
    name: 'WAI Part III — Ascent',
    description: 'Ascent toward Sahasrara, the luminous climb.',
    badge: 'Part III',
    color: 'bg-sky-100 text-sky-800',
    ownedHints: ['wai part 3', 'who am i - part iii', 'part iii', 'part 3', 'wai3', 'ascent']
  },
  wai4: {
    id: 2466,
    name: 'WAI Part IV — Golden Body',
    description: 'Beyond the granthis into the body of gold.',
    badge: 'Part IV',
    color: 'bg-violet-100 text-violet-800',
    ownedHints: ['wai part 4', 'who am i - part iv', 'part iv', 'part 4', 'wai4', 'golden body']
  }
}

const FALLBACK_PRODUCT: ProductKey = 'wai1'

declare global {
  interface Window {
    Razorpay?: any
  }
}

async function loadRazorpayScript() {
  if (typeof window === 'undefined') return false
  if (window.Razorpay) return true
  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function CheckoutClient({ searchParams, isLoggedIn }: { searchParams: SearchParams; isLoggedIn: boolean }) {
  const router = useRouter()
  const productParam = (searchParams?.product as string) ?? FALLBACK_PRODUCT
  const productKey: ProductKey = (productParam in PRODUCTS ? productParam : FALLBACK_PRODUCT) as ProductKey
  const bundle = searchParams?.bundle === 'true'

  const baseProducts = useMemo<[ProductKey, ProductInfo][]>(() => {
    if (bundle) return Object.entries(PRODUCTS) as [ProductKey, ProductInfo][]
    const product = PRODUCTS[productKey] ?? PRODUCTS[FALLBACK_PRODUCT]
    return [[productKey, product]]
  }, [bundle, productKey])

  const [billing, setBilling] = useState<Billing>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'IN'
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) {
      const next = `/checkout?product=${encodeURIComponent(productParam)}${bundle ? '&bundle=true' : ''}`
      router.replace(`/course-login?next=${encodeURIComponent(next)}`)
    }
  }, [bundle, productParam, router, isLoggedIn])

  const handleChange = (field: keyof Billing) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setBilling((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    if (!hasItemsToPurchase) {
      setError('You already own the selected courses. Nothing to purchase here.')
      setSubmitting(false)
      return
    }

    try {
      const orderRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedProducts.map((product) => ({ productId: product.id, quantity: 1 })),
          billing
        })
      })
      const orderPayload = await orderRes.json()
      if (!orderRes.ok) {
        throw new Error(orderPayload.error ?? 'Unable to create order.')
      }

      const { orderId, total, currency } = orderPayload

      const rpRes = await fetch('/api/checkout/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency,
          receipt: `woo-${orderId}`
        })
      })
      const rpPayload = await rpRes.json()
      if (!rpRes.ok) {
        throw new Error(rpPayload.error ?? 'Unable to initiate payment.')
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Unable to load Razorpay.')
      }

      const key = razorpayKey || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID
      if (!key) {
        throw new Error('Missing Razorpay key.')
      }

      const options = {
        key,
        amount: rpPayload.amount,
        currency: rpPayload.currency,
        order_id: rpPayload.razorpayOrderId,
        name: 'Discover Who Am I',
        description: 'Course enrollment',
        prefill: {
          name: `${billing.first_name} ${billing.last_name}`.trim(),
          email: billing.email,
          contact: billing.phone
        },
        handler: async (response: any) => {
          try {
            const confirmRes = await fetch('/api/checkout/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                wooOrderId: orderId
              })
            })
            const confirmPayload = await confirmRes.json()
            if (!confirmRes.ok) {
              throw new Error(confirmPayload.error ?? 'Payment confirmation failed.')
            }
            router.push(`/thank-you?orderId=${orderId}`)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment confirmation failed.')
            setSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false)
          }
        },
        theme: {
          color: '#0ea5e9'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to process checkout.')
      setSubmitting(false)
    }
  }

  const [pricing, setPricing] = useState<Record<number, string>>({})
  const [owned, setOwned] = useState<string[]>([])
  const [ownedLoaded, setOwnedLoaded] = useState(false)
  const [razorpayKey, setRazorpayKey] = useState<string | null>(null)

  const normalizeToken = (value?: string | null) => {
    if (!value) return ''
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
  }

  useEffect(() => {
    const ids = baseProducts.map(([, p]) => p.id)
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/checkout/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids })
        })
        const payload = await res.json()
        if (res.ok && Array.isArray(payload.products)) {
          const map: Record<number, string> = {}
          payload.products.forEach((p: any) => {
            if (p?.id && p.price) {
              map[p.id] = p.price
            }
          })
          setPricing(map)
        }
      } catch {
        // ignore pricing errors; UI will show blanks
      }
    }
    fetchPrices()
  }, [baseProducts])

  useEffect(() => {
    const fetchOwned = async () => {
      try {
        const res = await fetch('/api/learnpress/owned')
        const data = await res.json()
        if (res.ok && Array.isArray(data.courses)) {
          const normalized = (data.courses as string[])
            .map((entry) => normalizeToken(entry))
            .filter(Boolean)
          setOwned(Array.from(new Set(normalized)))
        }
      } catch {
        setOwned([])
      } finally {
        setOwnedLoaded(true)
      }
    }
    fetchOwned()
  }, [])

  useEffect(() => {
    const fetchKey = async () => {
      try {
        const res = await fetch('/api/checkout/config')
        const data = await res.json()
        if (res.ok && data.key) {
          setRazorpayKey(data.key as string)
        }
      } catch {
        // ignore; fallback to env below
      }
    }
    fetchKey()
  }, [])

  const ownedMatchesKey = (key: ProductKey) => {
    const productHints = PRODUCTS[key]?.ownedHints ?? [key]
    const normalizedHints = productHints.map((hint) => normalizeToken(hint)).filter(Boolean)
    if (normalizedHints.length === 0) return false
    return owned.some((entry) => normalizedHints.some((hint) => entry.includes(hint)))
  }

  const selectedEntries = useMemo(() => {
    return baseProducts.filter(([key]) => !(bundle && ownedMatchesKey(key)))
  }, [baseProducts, bundle, owned])

  const selectedProducts = useMemo(() => selectedEntries.map(([, product]) => product), [selectedEntries])
  const singleTargetKey = selectedEntries[0]?.[0] ?? productKey ?? FALLBACK_PRODUCT

  const filteredOutCount = bundle ? baseProducts.length - selectedProducts.length : 0
  const hasItemsToPurchase = selectedProducts.length > 0

  const selectedLabel = bundle
    ? 'Complete WAI Bundle'
    : selectedProducts.length > 0
      ? `Course: ${selectedProducts[0].name}`
      : `Course: ${productParam.toUpperCase()}`

  const currency =
    selectedProducts
      .map((product) => pricing[product.id])
      .find(Boolean)
      ?.split(' ')[0] || 'INR'

  const totalAmount = selectedProducts.reduce((sum, product) => {
    const priceText = pricing[product.id]
    if (!priceText) return sum
    const numeric = Number(priceText.replace(/[^0-9.]/g, '').replace(/,/g, ''))
    return sum + (Number.isFinite(numeric) ? numeric : 0)
  }, 0)

  return (
    <div className="px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-lg md:p-8">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">Checkout</p>
            <h1 className="text-2xl font-semibold text-sky-900">Complete your purchase</h1>
            <p className="text-sm text-slate-600">{selectedLabel}</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-sky-900" htmlFor="first_name">First name</label>
                <input
                  id="first_name"
                  value={billing.first_name}
                  onChange={handleChange('first_name')}
                  className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm text-sky-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-sky-900" htmlFor="last_name">Last name</label>
                <input
                  id="last_name"
                  value={billing.last_name}
                  onChange={handleChange('last_name')}
                  className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm text-sky-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-sky-900" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={billing.email}
                onChange={handleChange('email')}
                className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm text-sky-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-sky-900" htmlFor="phone">Phone</label>
              <input
                id="phone"
                value={billing.phone}
                onChange={handleChange('phone')}
                className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm text-sky-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-sky-900" htmlFor="address_1">Address</label>
              <input
                id="address_1"
                value={billing.address_1}
                onChange={handleChange('address_1')}
                className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm text-sky-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-sky-900" htmlFor="address_2">Address 2 (optional)</label>
              <input
                id="address_2"
                value={billing.address_2}
                onChange={handleChange('address_2')}
                className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm text-sky-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-sky-900" htmlFor="city">City</label>
                <input
                  id="city"
                  value={billing.city}
                  onChange={handleChange('city')}
                  className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm text-sky-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-sky-900" htmlFor="state">State/Province</label>
                <input
                  id="state"
                  value={billing.state}
                  onChange={handleChange('state')}
                  className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm text-sky-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-sky-900" htmlFor="postcode">Postal code</label>
                <input
                  id="postcode"
                  value={billing.postcode}
                  onChange={handleChange('postcode')}
                  className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm text-sky-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-sky-900" htmlFor="country">Country code</label>
                <input
                  id="country"
                  value={billing.country}
                  onChange={handleChange('country')}
                  className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm text-sky-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-70"
              disabled={submitting || !isLoggedIn || !hasItemsToPurchase || (bundle && !ownedLoaded)}
            >
              {submitting
                ? 'Processing…'
                : !hasItemsToPurchase
                  ? 'Nothing to purchase'
                  : bundle && !ownedLoaded
                    ? 'Checking your courses…'
                    : 'Pay with Razorpay'}
            </button>
          </form>
        </div>

        <div className="space-y-4 rounded-2xl border border-sky-100 bg-slate-50 p-6 shadow-inner md:p-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Your Order</p>
            <h2 className="text-xl font-semibold text-slate-900">
              {bundle ? 'WAI Complete Bundle' : selectedProducts[0]?.name ?? 'Course'}
            </h2>
            <p className="text-sm text-slate-600">
              {bundle
                ? hasItemsToPurchase
                  ? 'All parts together in one checkout.'
                  : 'All selected courses are already in your library.'
                : selectedProducts[0]?.description ?? 'Selected course'}
            </p>
          </div>
          {bundle && !ownedLoaded ? (
            <p className="text-xs text-slate-500">Checking your existing enrollments…</p>
          ) : null}

          <div
            key={bundle ? 'bundle-list' : 'single-list'}
            className="space-y-3 animate-page-fade transition duration-300"
          >
            {hasItemsToPurchase ? (
              selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition duration-300"
                >
                  <div className="space-y-1">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${product.color}`}>
                      {product.badge}
                    </span>
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-600">{product.description}</p>
                    <p className="text-xs font-semibold text-slate-800">
                      Price: {pricing[product.id] ?? 'Loading…'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 shadow-sm">
                <p className="font-semibold">You already own every course in this bundle.</p>
                <p className="text-xs text-amber-800">
                  Nothing to add here—head to My Courses to keep learning.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/my-courses')}
                  className="mt-1 inline-flex w-fit items-center justify-center rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition duration-200 hover:bg-amber-400"
                >
                  Go to My Courses
                </button>
              </div>
            )}
          </div>

          {filteredOutCount > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-2 text-xs font-semibold text-amber-800">
              {filteredOutCount} course{filteredOutCount === 1 ? '' : 's'} already owned were skipped from the bundle.
            </div>
          ) : null}

          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm">
            <span>Total</span>
            <span>
              {currency} {totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {bundle ? (
            <button
              key="bundle-switch"
              type="button"
              onClick={() => router.replace(`/checkout?product=${encodeURIComponent(singleTargetKey)}`)}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition duration-200 hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 animate-page-fade"
            >
              <p className="font-semibold text-slate-900">Switch to single course</p>
              <p className="text-xs text-slate-600">Prefer one course only?</p>
              <span className="mt-3 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition duration-200 hover:bg-sky-500">
                Go back to single course
              </span>
            </button>
          ) : (
            <button
              key="single-switch"
              type="button"
              onClick={() => router.replace('/checkout?bundle=true')}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition duration-200 hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 animate-page-fade"
            >
              <p className="font-semibold text-slate-900">Bundle option</p>
              <p className="text-xs text-slate-600">
                Want everything in one go? Add all parts to your checkout.
              </p>
              <div className="mt-3 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition duration-200 hover:bg-sky-500">
                Add all parts
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
