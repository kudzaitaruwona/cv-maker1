import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FilePlus2, ListChecks, PlusCircle, Settings } from "lucide-react"

// Quick navigation to key flows (create CV, add entry, manage bullets, settings).
export function QuickActions() {
  const actions = [
    {
      label: "Create CV",
      description: "Start a new tailored CV for a role.",
      href: "/cvs/new",
      icon: FilePlus2,
      variant: "default" as const,
    },
    {
      label: "Add Entry",
      description: "Capture a new work entry, project, or education item.",
      href: "/experiences/new",
      icon: PlusCircle,
      variant: "outline" as const,
    },
    {
      label: "Manage Bullets",
      description: "Curate and refine your bullet library.",
      href: "/bullets",
      icon: ListChecks,
      variant: "outline" as const,
    },
    {
      label: "Profile & Settings",
      description: "Keep your profile and links up to date.",
      href: "/settings",
      icon: Settings,
      variant: "outline" as const,
    },
  ]

  return (
    <section aria-labelledby="quick-actions-heading" className="space-y-2 h-full">
      <h2 id="quick-actions-heading" className="text-lg font-semibold">
        Quick actions
      </h2>
      {/* h-full + flex so this column visually lines up with the stats column. */}
      <Card className="h-full flex flex-col rounded-xl border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Jump to what matters most right now.
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          {/* Single-column layout to keep text comfortably within each action card. */}
          <div className="grid gap-3">
            {actions.map((action) => (
              <Button
                key={action.href}
                asChild
                variant={action.variant}
                className="w-full justify-start h-auto py-3 px-3 text-left flex flex-col items-start gap-1"
              >
                <Link href={action.href} className="w-full">
                  <div className="flex items-center gap-2">
                    <action.icon className="h-4 w-4" />
                    <span className="font-semibold">{action.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

