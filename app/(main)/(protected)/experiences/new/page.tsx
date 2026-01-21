"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ExperienceForm } from "@/components/cv/ExperienceForm"
import { createExperience } from "@/app/actions/experiences"
import { BulletCategories } from "@/app/types/database"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewExperiencePage() {
  const router = useRouter()

  const handleSubmit = async (data: {
    type: BulletCategories
    title: string
    organization?: string | null
    start_date?: string | null
    end_date?: string | null
    location?: string | null
  }) => {
    try {
      const newExperience = await createExperience(data)
      toast.success("Experience created successfully")
      router.push(`/experiences/${newExperience.id}`)
    } catch (error) {
      toast.error("Failed to create experience")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/experiences">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Experience</h1>
          <p className="text-muted-foreground mt-2">
            Add a new experience to your master library
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <ExperienceForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </div>
  )
}
