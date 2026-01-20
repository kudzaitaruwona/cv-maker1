"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Loader2, FileText, Briefcase } from "lucide-react"
import { createDummyCVs, createDummyTargetJobs } from "@/app/actions/cv"

export default function SeedCVsPage() {
  const router = useRouter()
  const [cvCount, setCvCount] = useState(3)
  const [targetJobCount, setTargetJobCount] = useState(5)
  const [isCreatingCVs, setIsCreatingCVs] = useState(false)
  const [isCreatingTargetJobs, setIsCreatingTargetJobs] = useState(false)

  const handleCreateDummyCVs = async () => {
    if (cvCount < 1 || cvCount > 20) {
      toast.error("Please enter a number between 1 and 20 for CVs")
      return
    }

    setIsCreatingCVs(true)
    try {
      const result = await createDummyCVs(cvCount)
      toast.success(result.message || `Successfully created ${result.count} dummy CVs!`)
      router.push("/cvs")
      router.refresh()
    } catch (error) {
      console.error("Failed to create dummy CVs:", error)
      toast.error("Failed to create dummy CVs. Please try again.")
    } finally {
      setIsCreatingCVs(false)
    }
  }

  const handleCreateDummyTargetJobs = async () => {
    if (targetJobCount < 1 || targetJobCount > 50) {
      toast.error("Please enter a number between 1 and 50 for target jobs")
      return
    }

    setIsCreatingTargetJobs(true)
    try {
      const result = await createDummyTargetJobs(targetJobCount)
      toast.success(result.message || `Successfully created ${result.count} dummy target jobs!`)
      router.refresh()
    } catch (error) {
      console.error("Failed to create dummy target jobs:", error)
      toast.error("Failed to create dummy target jobs. Please try again.")
    } finally {
      setIsCreatingTargetJobs(false)
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
          <h1 className="text-3xl font-semibold mb-2">Seed Dummy Data</h1>
          <p className="text-muted-foreground">
            Create sample CVs and target jobs for testing purposes
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Dummy CVs */}
        <Card className="rounded-xl border-2 shadow">
          <CardHeader className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Create Dummy CVs</CardTitle>
            </div>
            <CardDescription>
              Generate sample CVs with sections for testing and development
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cv-count">Number of CVs to Create</Label>
              <Input
                id="cv-count"
                type="number"
                min="1"
                max="20"
                value={cvCount}
                onChange={(e) => setCvCount(parseInt(e.target.value) || 3)}
                placeholder="Enter number of CVs"
              />
              <p className="text-sm text-muted-foreground">
                Enter a number between 1 and 20. Each CV will include sample sections
                (Experience, Education, Skills, etc.) with placeholder content.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCreateDummyCVs}
                disabled={isCreatingCVs}
                className="w-full sm:w-auto"
              >
                {isCreatingCVs ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Create Dummy CVs
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                asChild
                disabled={isCreatingCVs}
              >
                <Link href="/cvs">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Dummy Target Jobs */}
        <Card className="rounded-xl border-2 shadow">
          <CardHeader className="p-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <CardTitle>Create Dummy Target Jobs</CardTitle>
            </div>
            <CardDescription>
              Generate sample job postings that can be linked to CVs
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="target-job-count">Number of Target Jobs to Create</Label>
              <Input
                id="target-job-count"
                type="number"
                min="1"
                max="50"
                value={targetJobCount}
                onChange={(e) => setTargetJobCount(parseInt(e.target.value) || 5)}
                placeholder="Enter number of target jobs"
              />
              <p className="text-sm text-muted-foreground">
                Enter a number between 1 and 50. Each target job will include a title,
                company name, and sample job description.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCreateDummyTargetJobs}
                disabled={isCreatingTargetJobs}
                className="w-full sm:w-auto"
              >
                {isCreatingTargetJobs ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Create Dummy Target Jobs
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                asChild
                disabled={isCreatingTargetJobs}
              >
                <Link href="/cvs">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-2 border-muted">
        <CardHeader className="p-6">
          <CardTitle>Note</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-sm text-muted-foreground">
            These are placeholder functions. To implement actual dummy data generation,
            update the <code className="px-1.5 py-0.5 rounded bg-muted text-xs">createDummyCVs</code> and{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-xs">createDummyTargetJobs</code> functions
            in <code className="px-1.5 py-0.5 rounded bg-muted text-xs">app/actions/cv.ts</code> with actual
            database insertion logic.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
