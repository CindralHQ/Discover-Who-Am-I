import { NextResponse } from 'next/server'

import { LEARNPRESS_TOKEN_COOKIE, LEARNPRESS_USER_COOKIE } from '@/lib/learnpress'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: LEARNPRESS_TOKEN_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  response.cookies.set({
    name: LEARNPRESS_USER_COOKIE,
    value: '',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}
