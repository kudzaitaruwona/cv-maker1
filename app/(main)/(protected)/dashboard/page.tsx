import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { getDashboardSummary } from "@/app/actions/dashboard"
import { StatsOverview } from "@/components/dashboard/StatsOverview"
import { CVSummary } from "@/components/dashboard/CVSummary"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { RecentActivity } from "@/components/dashboard/RecentActivity"

// Skeleton shown while the dashboard data loads.
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="rounded-xl border-2">
            <CardContent className="h-24 animate-pulse bg-muted/40" />
          </Card>
        ))}
          </div>
        </div>
  )
}

// Server-side dashboard content; keeps data fetching close to the UI.
async function DashboardContent() {
  try {
    const summary = await getDashboardSummary()

                      return (
      <div className="space-y-8">
        {/* Top row: stats and quick actions aligned to equal height, 2 equal columns */}
        <div className="grid gap-6 items-stretch lg:grid-cols-2">
          <StatsOverview summary={summary} />
          <QuickActions />
        </div>

        {/* Second row: CVs and recent entries aligned to equal height, same column widths */}
        <div className="grid gap-6 items-stretch lg:grid-cols-2">
          <CVSummary summary={summary} />
          <RecentActivity summary={summary} />
                          </div>
                        </div>
                      )
  } catch (error) {
    console.error("Failed to load dashboard:", error)
    return (
      <Card className="border-2 border-destructive/40 bg-destructive/5">
        <CardContent className="py-6">
          <p className="text-sm font-medium text-destructive">
            We couldn’t load your dashboard right now.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please refresh the page, or try again in a few moments.
          </p>
            </CardContent>
          </Card>
    )
  }
}

export default function DashboardPage() {
  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
          See the state of your CV workspace at a glance and jump into the next step.
        </p>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </main>
  )
}

