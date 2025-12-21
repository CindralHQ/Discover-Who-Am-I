import { NextResponse } from 'next/server'

function getSiteUrl() {
  const siteUrl =
    process.env.WP_SITE_URL ||
    process.env.LP_SITE_URL ||
    process.env.NEXT_PUBLIC_LP_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL

  const normalized = siteUrl?.replace(/\/+$/, '')
  if (!normalized) {
    throw new Error('Missing WP_SITE_URL or LP_SITE_URL environment variable.')
  }
  return normalized
}

function extractMessage(html: string) {
  const noticeError = html.match(/notice-error[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p>/i)
  if (noticeError?.[1]) {
    return noticeError[1].replace(/<[^>]*>?/g, '').trim()
  }

  const noticeMessage = html.match(/<p class="message">([\s\S]*?)<\/p>/i)
  if (noticeMessage?.[1]) {
    return noticeMessage[1].replace(/<[^>]*>?/g, '').trim()
  }

  return null
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = body?.email?.trim()

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  let siteUrl: string
  try {
    siteUrl = getSiteUrl()
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }

  const url = `${siteUrl}/wp-login.php?action=lostpassword`
  const params = new URLSearchParams({
    user_login: email,
    'wp-submit': 'Get New Password',
    redirect_to: '',
    action: 'lostpassword',
  })

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const text = await res.text()

    // WordPress returns 200 with a message even on some errors, so inspect the HTML.
    const lower = text.toLowerCase()
    const success =
      lower.includes('check your email') ||
      lower.includes('password reset email has been sent') ||
      lower.includes('email has been sent')

    if (res.ok && success) {
      return NextResponse.json({ success: true })
    }

    const friendly =
      extractMessage(text) ||
      (lower.includes('email could not be sent')
        ? 'Email could not be sent. The site mail settings may need attention.'
        : lower.includes('invalid') || lower.includes('error')
          ? 'Could not find that email. Please double-check and try again.'
          : 'Unable to start password reset right now.')

    return NextResponse.json({ error: friendly }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to start password reset.' }, { status: 500 })
  }
}
