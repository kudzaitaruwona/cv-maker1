import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardSummary } from "@/app/actions/dashboard"

type Props = {
  summary: DashboardSummary
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "Unknown"
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return "Unknown"
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Lightweight activity feed focused on library entries.
export function RecentActivity({ summary }: Props) {
  const hasEntries = summary.recentEntries.length > 0

  return (
    <section className="space-y-4 h-full">
      {/* h-full + flex-col so this matches the height of the CV summary column. */}
      <Card className="h-full flex flex-col rounded-xl border-2">
        <CardHeader>
          <CardTitle>Recent entries</CardTitle>
          <CardDescription>
            Latest items added to your master library.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {hasEntries ? (
            <ul className="space-y-3">
              {summary.recentEntries.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.type} • Added {formatDate(entry.created_at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              When you add new entries to your library, they’ll appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

