import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { LEARNPRESS_TOKEN_COOKIE, fetchLearnPressCourses } from '@/lib/learnpress'

export async function GET() {
  const cookieStore = cookies()
  const authToken = cookieStore.get(LEARNPRESS_TOKEN_COOKIE)?.value
  if (!authToken) {
    return NextResponse.json({ courses: [] })
  }

  try {
    const courses = await fetchLearnPressCourses({ learned: true, authToken, perPage: 50 })
    const ownedStrings = new Set<string>()
    const ownedIds: number[] = []

    courses.forEach((course) => {
      if (course.id) ownedIds.push(course.id)
      const candidates = [course.slug, course.name, course.title?.rendered].filter(Boolean) as string[]
      candidates.forEach((value) => ownedStrings.add(value.toLowerCase()))
    })

    return NextResponse.json({ courses: Array.from(ownedStrings), ids: ownedIds })
  } catch (error) {
    return NextResponse.json({ courses: [], ids: [] })
  }
}
