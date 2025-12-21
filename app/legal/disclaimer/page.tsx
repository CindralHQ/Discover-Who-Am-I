export const metadata = { title: 'Disclaimer - Discover Who Am I' }

export default function DisclaimerPage() {
  return (
    <div className="container py-10">
      <div className="rounded-3xl bg-sky-50 px-6 py-8 text-sky-800 shadow-sm ring-1 ring-sky-100 sm:px-10 sm:py-12">
        <div className="space-y-6">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-sky-900">Disclaimer</h1>
          <div className="space-y-5 text-base leading-7">
            <p>
              The information contained in &apos;the books by the author&apos; and the &apos;Who Am I&apos; are not
              intended to serve as a replacement for professional medical advice. Any use of the information in the
              books and the courses is at the participant&apos;s discretion. Author specifically disclaims any implied
              warranties of merchantability and fitness for a particular purpose and all liability arising directly or
              indirectly from the use or application of any information contained in the book or the various courses.
            </p>
            <p>
              The author does not recommend the self-management of health or mental health problems. You should never
              disregard medical advice, or delay in seeking it, because of something you have learned in this book or
              these courses. &apos;The Who Am I&apos; are a structured self-study and self-development programme that
              shouldn&apos;t be taken lightly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
