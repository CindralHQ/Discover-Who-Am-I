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

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/g, '').replace(/\s+/g, ' ').trim()
}

function extractMessage(html: string) {
  const loginError = html.match(/id=["']login_error["'][^>]*>([\s\S]*?)<\/div>/i)
  if (loginError?.[1]) {
    return stripHtml(loginError[1])
  }

  const noticeError = html.match(/notice-error[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p>/i)
  if (noticeError?.[1]) {
    return stripHtml(noticeError[1])
  }

  const noticeMessage = html.match(/<p class="message">([\s\S]*?)<\/p>/i)
  if (noticeMessage?.[1]) {
    return stripHtml(noticeMessage[1])
  }

  return null
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const login = typeof body?.login === 'string' ? body.login.trim() : ''
  const key = typeof body?.key === 'string' ? body.key.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const confirmPassword = typeof body?.confirmPassword === 'string' ? body.confirmPassword : ''

  if (!login || !key || !password || !confirmPassword) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 })
  }

  let siteUrl: string
  try {
    siteUrl = getSiteUrl()
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }

  const url = `${siteUrl}/wp-login.php?action=resetpass`
  const params = new URLSearchParams({
    pass1: password,
    pass2: confirmPassword,
    rp_key: key,
    rp_login: login,
    'wp-submit': 'Reset Password',
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
    const lower = text.toLowerCase()
    const success =
      lower.includes('password has been reset') ||
      lower.includes('resetpass=complete') ||
      lower.includes('your password has been reset')

    if (res.ok && success) {
      return NextResponse.json({ success: true })
    }

    const friendly =
      extractMessage(text) ||
      (lower.includes('expired') || lower.includes('invalid')
        ? 'Reset link is invalid or expired. Please request a new one.'
        : 'Unable to reset your password right now.')

    return NextResponse.json({ error: friendly }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to reset your password.' }, { status: 500 })
  }
}
