"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getTargetJobs, createCV } from "@/app/actions/cv"
import type { TargetJob } from "@/app/types/cv"

export default function NewCVPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [targetJobId, setTargetJobId] = useState<string>("__none__")
  const [jobDescription, setJobDescription] = useState("")
  const [targetJobs, setTargetJobs] = useState<TargetJob[]>([])
  const [isLoadingTargetJobs, setIsLoadingTargetJobs] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchTargetJobs = async () => {
      setIsLoadingTargetJobs(true)
      try {
        const data = await getTargetJobs()
        setTargetJobs(data || [])
      } catch (error) {
        console.error("Failed to fetch target jobs:", error)
        toast.error("Failed to load target jobs")
      } finally {
        setIsLoadingTargetJobs(false)
      }
    }
    fetchTargetJobs()
  }, [])

  // Auto-populate job description when target job is selected
  useEffect(() => {
    if (targetJobId) {
      const selectedJob = targetJobs.find((job) => job.id === targetJobId)
      if (selectedJob?.description) {
        setJobDescription(selectedJob.description)
      }
    }
  }, [targetJobId, targetJobs])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a CV title")
      return
    }

    setIsSubmitting(true)

    try {
      // Convert "__none__" to null for database
      const finalTargetJobId = targetJobId === "__none__" || !targetJobId ? null : targetJobId
      
      const newCV = await createCV({
        title: title.trim(),
        target_job_id: finalTargetJobId,
      })

      // TODO: If job description is provided, save it to JobDescriptions table
      // This would be done in a separate action or within createCV
      if (jobDescription.trim()) {
        // await saveJobDescription(newCV.id, jobDescription.trim())
        console.log("Job description to save:", jobDescription.trim())
      }

      toast.success("CV created successfully")
      router.push(`/cvs/${newCV.id}/edit`)
      router.refresh()
    } catch (error) {
      console.error("Failed to create CV:", error)
      toast.error("Failed to create CV. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cvs">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold mb-2">Create New CV</h1>
          <p className="text-muted-foreground">
            Start building a new curriculum vitae
          </p>
        </div>
      </div>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6">
          <CardTitle>CV Information</CardTitle>
          <CardDescription>
            Fill in the details for your new CV
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">CV Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Software Engineer CV"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">
                Give your CV a descriptive name to identify it later
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-job">Target Job</Label>
              {isLoadingTargetJobs ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading target jobs...
                </div>
              ) : (
                <Select
                  value={targetJobId}
                  onValueChange={setTargetJobId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="target-job" className="h-9">
                    <SelectValue placeholder="Select a target job (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">No target job</SelectItem>
                    {targetJobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                        {job.company && ` at ${job.company}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">
                Link this CV to a specific job application (optional)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste or enter the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isSubmitting}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add the job description to help tailor your CV. This will be auto-filled if you select a target job with a description.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create CV"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                asChild
                disabled={isSubmitting}
              >
                <Link href="/cvs">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
