import Link from 'next/link'

export const metadata = {
  title: 'Attributions - Who Am I'
}

export default function AttributionsPage() {
  return (
    <div className="container space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-sky-700 via-sky-800 to-slate-900 p-10 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-[0.4em] text-sky-200">Credits</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Source Acknowledgements</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-sky-100">
          Discover Who Am I honours the creators whose artistry supports this experience. We extend
          gratitude to the visual and sonic storytellers whose work elevates our transmission.
        </p>
      </section>

      <section className="space-y-8 rounded-3xl border border-sky-100 bg-white/90 p-10 shadow-sm backdrop-blur">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">Visual Elements</h2>
          <p className="text-base leading-7 text-slate-600">
            The celestial background featured in the home page opening animation brings a dreamy, etheric
            tone to the experience. This artwork was generously shared by the{' '}
            <Link
              href="https://www.freepik.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-sky-600 underline decoration-sky-400 hover:text-sky-700"
            >
              Freepik
            </Link>{' '}
            community.
          </p>
          <div className="rounded-2xl bg-slate-100/70 p-4 text-sm text-slate-500 shadow-inner">
            <div className="font-medium text-slate-600">Asset</div>
            <div className="mt-1">
              Celestial BG (homepage animation backdrop) – downloaded from{' '}
              <Link
                href="https://www.freepik.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sky-600 underline decoration-sky-400 hover:text-sky-700"
              >
                www.freepik.com
              </Link>
              .
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">Audio Landscape</h2>
          <p className="text-base leading-7 text-slate-600">
            The ambient soundtrack guiding the opening sequence is licensed via TuneTank and composed by
            Vislevski. Its soaring pads and gentle motion are integral to the sense of ascension.
          </p>
          <div className="rounded-2xl bg-slate-100/70 p-4 text-sm text-slate-500 shadow-inner">
            <div className="font-medium text-slate-600">Track</div>
            <div className="mt-1">
              <span className="font-semibold text-slate-700">Flying In The Clouds</span> by Vislevski –{' '}
              <Link
                href="https://tunetank.com/track/5030-flying-in-the-clouds/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 underline decoration-sky-400 hover:text-sky-700"
              >
                https://tunetank.com/track/5030-flying-in-the-clouds/
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-sky-100 bg-sky-50/80 p-8 text-sm leading-7 text-sky-900">
        <p>
          If you create with one of these artists, please support them directly. We remain grateful for the
          inspiration that keeps seekers immersed in the teachings.
        </p>
      </section>
    </div>
  )
}
