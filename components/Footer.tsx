import footerBackground from '@/assets/footerbg.png'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type FooterProps = {
  className?: string
}

const quickLinks = [
  { label: 'Who Am I – Part 1', href: '/wai1' },
  { label: 'Who Am I – Part 2', href: '/wai2' },
  { label: 'Who Am I – Part 3', href: '/wai3' },
  { label: 'Who Am I – Part 4', href: '/wai4' },
  // { label: 'Books & Publications', href: 'https://santoshsachdeva.com/books/' }
]

const seriesLinks = [
  { label: "About Santosh Ma's Teachings", href: 'https://santoshsachdeva.com/articles/' },
  { label: 'Kundalini Diary', href: 'https://santoshsachdeva.com/kundalini-diary/' },
  { label: 'Eight Spiritual Breaths', href: 'https://eightspiritualbreaths.com/' }
]

const socialLinks = [
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: 'https://www.youtube.com/@SantoshSachdevaTalks' },
  { label: 'Facebook', href: 'https://www.facebook.com/eightspiritualbreaths/' },
]

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cx(
        'relative mt-24 border-t border-white/20 text-white',
        className
      )}
      style={{
        backgroundImage: `url(${footerBackground.src})`,
        backgroundPosition: 'center top',
        backgroundSize: 'cover'
      }}
    >
      <div className="container relative px-4 py-12 text-sm sm:px-6 sm:py-16 lg:px-0">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <div className="space-y-4">
            <div className="text-2xl font-semibold text-white">Discover Who Am I</div>
            <p className="text-sm leading-7 text-white/80">
              A living archive of Santosh Ma&apos;s transmissions on kundalini, subtle-body wisdom, and the
              unfolding of the Self. Crafted for seekers who learn through vision, story, and direct energetic
              resonance.
            </p>
            <a
              href="/wai1"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 transition hover:text-sky-100 hover:underline"
            >
              Begin the Who Am I journey →
            </a>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Explore
            </span>
            <ul className="grid grid-cols-1 gap-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/85 transition hover:text-white hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Know More
            </span>
            <ul className="grid grid-cols-1 gap-2 text-sm">
              {seriesLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/85 transition hover:text-white hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Connect
            </span>
            <ul className="grid grid-cols-1 gap-2 text-sm">
              <li>
                <a
                  href="mailto:admin@discoverwhoami.org"
                  className="text-white/85 transition hover:text-white hover:underline"
                >
                  admin@discoverwhoami.org
                </a>
              </li>
              <li className="text-white/80">Mumbai · India</li>
              <li>
                <a
                  href="/contact"
                  className="text-white/85 transition hover:text-white hover:underline"
                >
                  Contact Us
                </a>
              </li>
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/85 transition hover:text-white hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-4 border-t border-white/20 pt-6 text-xs text-white/70 sm:flex sm:items-center sm:justify-between sm:space-y-0">
          <div className="font-medium text-white/85">
            © {new Date().getFullYear()} Discover Who Am I. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="/attributions" className="transition hover:text-white hover:underline">
              Attributions
            </a>
            <a href="/legal/disclaimer" className="transition hover:text-white hover:underline">
              Disclaimer
            </a>
            <a href="/legal/privacy" className="transition hover:text-white hover:underline">
              Privacy Policy
            </a>
            <a href="/legal/terms" className="transition hover:text-white hover:underline">
              Terms &amp; Conditions
            </a>
            <a href="/legal/refund" className="transition hover:text-white hover:underline">
              Payment &amp; Refund
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
