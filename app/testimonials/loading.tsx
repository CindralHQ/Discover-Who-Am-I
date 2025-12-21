export default function TestimonialsLoading() {
  return (
    <div className="container space-y-8 animate-page-fade">
      <header className="space-y-2">
        <div className="h-8 w-72 rounded-full bg-sky-100/80 animate-pulse" />
        <div className="h-4 w-[28rem] max-w-full rounded-full bg-sky-50 animate-pulse" />
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`testimonial-skeleton-${index}`}
            className="flex h-full flex-col gap-4 rounded-3xl border border-sky-100 bg-white/80 p-5 shadow-sm shadow-sky-200/30"
          >
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100" />
            <div className="h-6 w-3/4 rounded-full bg-slate-100" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full bg-slate-100" />
              <div className="h-4 w-5/6 rounded-full bg-slate-100" />
              <div className="h-4 w-1/2 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
