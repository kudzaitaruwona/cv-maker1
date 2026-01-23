import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"
import type { DashboardSummary } from "@/app/actions/dashboard"

type Props = {
  summary: DashboardSummary
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "Unknown"
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return "Unknown"
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// CV-specific summary section so users can quickly re-open recent CVs.
export function CVSummary({ summary }: Props) {
  const hasCVs = summary.recentCVs.length > 0

  return (
    <section className="space-y-4 h-full">
      {/* h-full + flex-col so this card stretches to match its grid row height */}
      <Card className="h-full flex flex-col rounded-xl border-2">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>CVs</CardTitle>
            <CardDescription>
              See your latest CVs and jump back into editing.
            </CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/cvs/new">
              New CV
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="flex-1">
          {hasCVs ? (
            <ul className="space-y-3">
              {summary.recentCVs.map((cv) => (
                <li key={cv.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{cv.title || "Untitled CV"}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {formatDate(cv.updated_at || cv.created_at)}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/cvs/${cv.id}/edit`}>Open</Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                You haven’t created any CVs yet.
              </p>
              <Button asChild>
                <Link href="/cvs/new">
                  Create your first CV
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

