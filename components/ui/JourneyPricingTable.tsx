export type JourneyScheduleEntry = {
  part: string
  title: string
  videos: number
  weeks: number
  isTotal?: boolean
}

type JourneyPricingTableProps = {
  schedule: ReadonlyArray<JourneyScheduleEntry>
  pacing: ReadonlyArray<string>
  reminders: ReadonlyArray<string>
}

export function JourneyPricingTable({ schedule, pacing, reminders }: JourneyPricingTableProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm font-medium text-sky-500">
        Each series carries a focused theme. Allow the suggested pacing so the transmissions can integrate fully.
      </p>

      <div className="overflow-hidden rounded-2xl border border-sky-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-100 text-left">
            <thead className="bg-sky-50/60 text-sm font-semibold uppercase tracking-[0.2em] text-sky-500">
              <tr className="[&>th]:px-4 [&>th]:py-3">
                <th scope="col">Series</th>
                <th scope="col">Title</th>
                <th scope="col">Videos</th>
                <th scope="col">Weeks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 text-base leading-7 text-sky-800">
              {schedule.map((entry) => (
                <tr
                  key={entry.part}
                  className={`${entry.isTotal ? 'bg-sky-50/80 font-semibold text-sky-900' : 'bg-white'} align-top`}
                >
                  <td className="px-4 py-3">{entry.part}</td>
                  <td className="px-4 py-3">{entry.title}</td>
                  <td className="px-4 py-3">{entry.videos}</td>
                  <td className="px-4 py-3">{entry.weeks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
        {pacing.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      <div className="space-y-3 text-base leading-7 text-sky-500">
        {reminders.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  )
}
