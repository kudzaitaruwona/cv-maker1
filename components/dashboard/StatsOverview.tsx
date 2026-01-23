import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DashboardSummary } from "@/app/actions/dashboard"
import { FileText, Layers, ListChecks } from "lucide-react"

type Props = {
  summary: DashboardSummary
}

// High-level stats row so users can see “what’s going on” at a glance.
export function StatsOverview({ summary }: Props) {
  const items = [
    {
      label: "Total CVs",
      value: summary.totalCVs,
      description: "Published and draft CVs in your workspace.",
      icon: FileText,
    },
    {
      label: "Entries",
      value: summary.totalEntries,
      description: "Library entries (work, projects, education, etc.).",
      icon: Layers,
    },
    {
      label: "Library Bullets",
      value: summary.totalLibraryBullets,
      description: "Reusable bullets in your master library.",
      icon: ListChecks,
    },
  ]

  return (
    <section aria-labelledby="stats-heading" className="flex flex-col h-full space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 id="stats-heading" className="text-lg font-semibold">
          At a glance
        </h2>
        <Badge variant="outline" className="text-xs">
          Overview
        </Badge>
      </div>
      {/* Stack cards vertically and fill remaining space to match Quick Actions height. */}
      <div className="flex-1 space-y-3">
        {items.map((item) => (
          <Card key={item.label} className="rounded-xl border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

