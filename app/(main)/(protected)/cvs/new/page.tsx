"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepIndicator } from "@/components/cv/StepIndicator"
import { ExperienceSelector } from "@/components/cv/ExperienceSelector"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Loader2, ChevronRight, ChevronLeft } from "lucide-react"
import {
  getExperiences,
  getBullets,
} from "@/app/actions/experiences"
import {
  createTargetPosition,
  createCV,
  createCVSections,
  createCVBullets,
} from "@/app/actions/cvs"
import type { MasterExperience, MasterBullet } from "@/app/types/database"

export default function NewCVPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Step 1: Job Details
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [targetPositionId, setTargetPositionId] = useState<string | null>(null)
  const [cvId, setCvId] = useState<string | null>(null)

  // Step 2: Experience Selection
  const [experiences, setExperiences] = useState<
    Array<MasterExperience & { bullets?: MasterBullet[] }>
  >([])
  const [selectedExperiences, setSelectedExperiences] = useState<Set<string>>(new Set())
  const [selectedBullets, setSelectedBullets] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (step === 2) {
      loadExperiences()
    }
  }, [step])

  const loadExperiences = async () => {
    try {
      setLoading(true)
      const expData = await getExperiences()
      
      // Load bullets for each experience
      const experiencesWithBullets = await Promise.all(
        expData.map(async (exp) => {
          const bullets = await getBullets(exp.id)
          return { ...exp, bullets }
        })
      )
      
      setExperiences(experiencesWithBullets)
    } catch (error) {
      toast.error("Failed to load experiences")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleStep1Submit = async () => {
    if (!jobTitle.trim() || !company.trim()) {
      toast.error("Please fill in job title and company")
      return
    }

    try {
      setSubmitting(true)
      
      // Create target position
      const targetPosition = await createTargetPosition({
        title: jobTitle.trim(),
        company: company.trim(),
        description: jobDescription.trim() || null,
      })
      setTargetPositionId(targetPosition.id)

      // Create CV with temporary title (will be updated later)
      const cv = await createCV({
        title: `${jobTitle} at ${company}`,
        target_position_id: targetPosition.id,
      })
      setCvId(cv.id)

      setStep(2)
    } catch (error) {
      toast.error("Failed to create CV")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleStep2Submit = async () => {
    if (selectedExperiences.size === 0) {
      toast.error("Please select at least one experience")
      return
    }

    if (!cvId) {
      toast.error("CV not found. Please start over.")
      return
    }

    try {
      setSubmitting(true)

      // Prepare selections
      const experienceSelections = Array.from(selectedExperiences).map((expId) => {
        const exp = experiences.find((e) => e.id === expId)
        if (!exp) throw new Error(`Experience ${expId} not found`)
        return {
          master_experience_id: expId,
          master_experience: exp,
        }
      })

      // Create CV sections
      const sections = await createCVSections(cvId, experienceSelections)

      // Create CV bullets for each section
      for (const section of sections) {
        const experience = experiences.find((e) => e.id === section.master_experience_id)
        if (!experience || !experience.bullets) continue

        // Filter bullets that are selected
        const selectedBulletsForExp = experience.bullets.filter((bullet) =>
          selectedBullets.has(bullet.id)
        )

        if (selectedBulletsForExp.length > 0) {
          const bulletSelections = selectedBulletsForExp.map((bullet) => ({
            master_bullet_id: bullet.id,
            master_bullet: bullet,
          }))

          await createCVBullets(section.id, bulletSelections)
        }
      }

      toast.success("CV created successfully")
      router.push(`/cvs/${cvId}/edit`)
    } catch (error) {
      toast.error("Failed to create CV sections")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleExperienceToggle = (experienceId: string, checked: boolean) => {
    const newSelected = new Set(selectedExperiences)
    if (checked) {
      newSelected.add(experienceId)
      // Auto-select all bullets for this experience
      const experience = experiences.find((e) => e.id === experienceId)
      if (experience?.bullets) {
        const newBullets = new Set(selectedBullets)
        experience.bullets.forEach((bullet) => newBullets.add(bullet.id))
        setSelectedBullets(newBullets)
      }
    } else {
      newSelected.delete(experienceId)
      // Auto-deselect all bullets for this experience
      const experience = experiences.find((e) => e.id === experienceId)
      if (experience?.bullets) {
        const newBullets = new Set(selectedBullets)
        experience.bullets.forEach((bullet) => newBullets.delete(bullet.id))
        setSelectedBullets(newBullets)
      }
    }
    setSelectedExperiences(newSelected)
  }

  const handleBulletToggle = (bulletId: string, checked: boolean) => {
    const newSelected = new Set(selectedBullets)
    if (checked) {
      newSelected.add(bulletId)
    } else {
      newSelected.delete(bulletId)
    }
    setSelectedBullets(newSelected)
  }

  const selectedCount = {
    experiences: selectedExperiences.size,
    bullets: selectedBullets.size,
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cvs">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New CV</h1>
          <p className="text-muted-foreground mt-2">
            Build a tailored CV for your job application
          </p>
        </div>
      </div>

      <StepIndicator
        currentStep={step}
        totalSteps={2}
        stepLabels={["Job Details", "Select Content"]}
      />

      {step === 1 && (
        <Card className="rounded-xl border-2">
          <CardHeader>
            <CardTitle>Step 1: Job Details</CardTitle>
            <CardDescription>
              Tell us about the job you're applying for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title *</Label>
              <Input
                id="job-title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Software Engineer"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here (optional but recommended)"
                className="min-h-[200px]"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Adding the job description helps us tailor your CV content
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" asChild disabled={submitting}>
                <Link href="/cvs">Cancel</Link>
              </Button>
              <Button onClick={handleStep1Submit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="rounded-xl border-2">
          <CardHeader>
            <CardTitle>Step 2: Select Experiences & Bullets</CardTitle>
            <CardDescription>
              Choose which experiences and bullets to include in your CV
            </CardDescription>
            {selectedCount.experiences > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedCount.experiences} experience{selectedCount.experiences !== 1 ? "s" : ""}{" "}
                selected • {selectedCount.bullets} bullet{selectedCount.bullets !== 1 ? "s" : ""}{" "}
                selected
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No experiences found. Create experiences in your master library first.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/experiences">Go to Master Library</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <ExperienceSelector
                  experiences={experiences}
                  selectedExperiences={selectedExperiences}
                  selectedBullets={selectedBullets}
                  onExperienceToggle={handleExperienceToggle}
                  onBulletToggle={handleBulletToggle}
                />

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={submitting}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={handleStep2Submit} disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Confirm Selection"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
