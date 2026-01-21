"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExperienceCard } from "@/components/cv/ExperienceCard"
import { getExperiences, createExperience } from "@/app/actions/experiences"
import type { MasterExperience } from "@/app/types/database"
import { BulletCategories } from "@/app/types/database"
import { Plus, Loader2 } from "lucide-react"
import { ExperienceForm } from "@/components/cv/ExperienceForm"
import { toast } from "sonner"

const categoryOrder: BulletCategories[] = [
  BulletCategories.Experience,
  BulletCategories.Projects,
  BulletCategories.Education,
  BulletCategories.Skills,
  BulletCategories.Certifications,
  BulletCategories.Other,
]

export default function ExperiencesPage() {
  const router = useRouter()
  const [experiences, setExperiences] = useState<MasterExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadExperiences()
  }, [])

  const loadExperiences = async () => {
    try {
      setLoading(true)
      const data = await getExperiences()
      setExperiences(data)
    } catch (error) {
      toast.error("Failed to load experiences")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExperience = async (data: {
    type: BulletCategories
    title: string
    organization?: string | null
    start_date?: string | null
    end_date?: string | null
    location?: string | null
  }) => {
    try {
      const newExperience = await createExperience(data)
      setDialogOpen(false)
      router.push(`/experiences/${newExperience.id}`)
      toast.success("Experience created successfully")
    } catch (error) {
      toast.error("Failed to create experience")
      console.error(error)
    }
  }

  const groupedExperiences = categoryOrder.reduce((acc, category) => {
    acc[category] = experiences.filter((exp) => exp.type === category)
    return acc
  }, {} as Record<BulletCategories, MasterExperience[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Master Library</h1>
          <p className="text-muted-foreground mt-2">
            Manage your experiences and achievements
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Experience</DialogTitle>
              <DialogDescription>
                Add a new experience to your master library
              </DialogDescription>
            </DialogHeader>
            <ExperienceForm
              onSubmit={handleCreateExperience}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {experiences.length === 0 ? (
        <Card className="rounded-xl border-2 p-12 text-center">
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No experiences yet. Create your first experience to get started.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {categoryOrder.map((category) => {
            const categoryExperiences = groupedExperiences[category]
            if (categoryExperiences.length === 0) return null

            return (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-semibold">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryExperiences.map((experience) => (
                    <ExperienceCard key={experience.id} experience={experience} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
