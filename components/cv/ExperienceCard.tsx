"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MasterExperience } from "@/app/types/database"
import { Calendar, MapPin, Building2 } from "lucide-react"

interface ExperienceCardProps {
  experience: MasterExperience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    } catch {
      return dateString
    }
  }

  const formatDateRange = (): string => {
    const start = formatDate(experience.start_date)
    const end = experience.end_date ? formatDate(experience.end_date) : "Present"
    if (!start) return ""
    return `${start} - ${end}`
  }

  return (
    <Link href={`/experiences/${experience.id}`}>
      <Card className="rounded-xl border-2 shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight">{experience.title}</h3>
            <Badge variant="outline">{experience.type}</Badge>
          </div>

          {experience.organisation && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{experience.organisation}</span>
            </div>
          )}

          {experience.start_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDateRange()}</span>
            </div>
          )}

          {experience.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{experience.location}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
