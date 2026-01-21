"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { MasterExperience, MasterBullet } from "@/app/types/database"
import { BulletCategories } from "@/app/types/database"

interface ExperienceSelectorProps {
  experiences: Array<MasterExperience & { bullets?: MasterBullet[] }>
  selectedExperiences: Set<string>
  selectedBullets: Set<string>
  onExperienceToggle: (experienceId: string, checked: boolean) => void
  onBulletToggle: (bulletId: string, checked: boolean) => void
}

const categoryOrder: BulletCategories[] = [
  BulletCategories.Experience,
  BulletCategories.Projects,
  BulletCategories.Education,
  BulletCategories.Skills,
  BulletCategories.Certifications,
  BulletCategories.Other,
]

export function ExperienceSelector({
  experiences,
  selectedExperiences,
  selectedBullets,
  onExperienceToggle,
  onBulletToggle,
}: ExperienceSelectorProps) {
  const groupedExperiences = categoryOrder.reduce((acc, category) => {
    acc[category] = experiences.filter((exp) => exp.type === category)
    return acc
  }, {} as Record<BulletCategories, typeof experiences>)

  const formatDateRange = (exp: MasterExperience): string => {
    const formatDate = (dateString: string | null): string => {
      if (!dateString) return ""
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      } catch {
        return dateString
      }
    }
    const start = formatDate(exp.start_date)
    const end = exp.end_date ? formatDate(exp.end_date) : "Present"
    if (!start) return ""
    return `${start} - ${end}`
  }

  return (
    <Accordion type="multiple" className="space-y-4">
      {categoryOrder.map((category) => {
        const categoryExperiences = groupedExperiences[category]
        if (categoryExperiences.length === 0) return null

        const selectedCount = categoryExperiences.filter((exp) =>
          selectedExperiences.has(exp.id)
        ).length

        return (
          <AccordionItem
            key={category}
            value={category}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold">{category}</span>
                <Badge variant="secondary">
                  {categoryExperiences.length} experience
                  {categoryExperiences.length !== 1 ? "s" : ""}
                  {selectedCount > 0 && ` • ${selectedCount} selected`}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="multiple" className="space-y-3 mt-4">
                {categoryExperiences.map((experience) => {
                  const isExperienceSelected = selectedExperiences.has(experience.id)
                  const experienceBullets = experience.bullets || []
                  const selectedBulletCount = experienceBullets.filter((bullet) =>
                    selectedBullets.has(bullet.id)
                  ).length

                  return (
                    <AccordionItem
                      key={experience.id}
                      value={experience.id}
                      className="border rounded-md px-3"
                    >
                      <div className="flex items-start gap-3 py-3">
                        <Checkbox
                          checked={isExperienceSelected}
                          onCheckedChange={(checked) =>
                            onExperienceToggle(experience.id, checked === true)
                          }
                          className="mt-1"
                        />
                        <AccordionTrigger className="flex-1 hover:no-underline py-0">
                          <div className="flex-1 text-left">
                            <div className="font-medium">{experience.title}</div>
                            {experience.organization && (
                              <div className="text-sm text-muted-foreground">
                                {experience.organization}
                              </div>
                            )}
                            {experience.start_date && (
                              <div className="text-xs text-muted-foreground">
                                {formatDateRange(experience)}
                              </div>
                            )}
                            {experienceBullets.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {experienceBullets.length} bullet
                                {experienceBullets.length !== 1 ? "s" : ""}
                                {selectedBulletCount > 0 &&
                                  ` • ${selectedBulletCount} selected`}
                              </div>
                            )}
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent>
                        <div className="space-y-2 pl-8 pb-3">
                          {experienceBullets.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">
                              No bullets for this experience
                            </p>
                          ) : (
                            experienceBullets.map((bullet) => (
                              <div
                                key={bullet.id}
                                className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50"
                              >
                                <Checkbox
                                  checked={selectedBullets.has(bullet.id)}
                                  onCheckedChange={(checked) =>
                                    onBulletToggle(bullet.id, checked === true)
                                  }
                                  className="mt-0.5"
                                />
                                <p className="text-sm flex-1">{bullet.content}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
