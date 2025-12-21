import { cookies } from 'next/headers'

import { CheckoutClient } from '@/components/ui/CheckoutClient'

export const dynamic = 'force-dynamic'

type SearchParams = { [key: string]: string | string[] | undefined }

export default function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  const cookieStore = cookies()
  const isLoggedIn = Boolean(cookieStore.get('lp_token'))

  return <CheckoutClient searchParams={searchParams} isLoggedIn={isLoggedIn} />
}
