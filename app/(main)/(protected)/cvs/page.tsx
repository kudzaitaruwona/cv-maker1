"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PlusCircle, Edit, Trash2, Loader2, FileText } from "lucide-react"
import Link from "next/link"
import { getCVs, getTargetJobs, deleteCV } from "@/app/actions/cv"
import { toast } from "sonner"
import type { CV, TargetJob } from "@/app/types/cv"

export default function CVListPage() {
  const [cvs, setCVs] = useState<CV[]>([])
  const [targetJobs, setTargetJobs] = useState<Record<string, TargetJob>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cvToDelete, setCVToDelete] = useState<CV | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [cvsData, targetJobsData] = await Promise.all([
          getCVs(),
          getTargetJobs(),
        ])
        setCVs(cvsData || [])
        
        // Create a map of target jobs by ID for easy lookup
        const targetJobsMap: Record<string, TargetJob> = {}
        targetJobsData.forEach((job) => {
          targetJobsMap[job.id] = job
        })
        setTargetJobs(targetJobsMap)
      } catch (error) {
        console.error("Failed to fetch CVs:", error)
        toast.error("Failed to load CVs. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDeleteClick = (cv: CV) => {
    setCVToDelete(cv)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!cvToDelete) return

    setIsDeleting(true)
    try {
      await deleteCV(cvToDelete.id)
      toast.success("CV deleted successfully")
      setDeleteDialogOpen(false)
      setCVToDelete(null)
      // Refresh the list
      const data = await getCVs()
      setCVs(data || [])
    } catch (error) {
      console.error("Failed to delete CV:", error)
      toast.error("Failed to delete CV. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">My CVs</h1>
          <p className="text-muted-foreground">
            Manage and edit your curriculum vitae
          </p>
        </div>
        <Button asChild>
          <Link href="/cvs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New CV
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading CVs...</p>
          </CardContent>
        </Card>
      ) : cvs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No CVs found</p>
            <Button asChild>
              <Link href="/cvs/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First CV
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cvs.map((cv) => {
            const targetJob = cv.target_job_id ? targetJobs[cv.target_job_id] : null
            return (
              <Card key={cv.id} className="rounded-xl border-2 shadow">
                <CardHeader className="p-6">
                  <CardTitle className="text-xl">{cv.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {targetJob ? (
                      <span>
                        Target: {targetJob.title}
                        {targetJob.company && ` at ${targetJob.company}`}
                      </span>
                    ) : (
                      "No target job"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  <div className="text-xs text-muted-foreground">
                    Created {formatDate(cv.created_at)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/cvs/${cv.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteClick(cv)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the CV{" "}
              {cvToDelete && (
                <span className="font-medium">"{cvToDelete.title}"</span>
              )}{" "}
              and all its sections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
