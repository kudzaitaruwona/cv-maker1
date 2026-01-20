"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { ArrowLeft, Loader2, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  getCV,
  getCVSections,
  getTargetJobs,
  updateCV,
  updateCVSection,
  createCVSection,
  deleteCVSection,
  reorderCVSections,
  getJobDescription,
} from "@/app/actions/cv"
import type { CV, TargetJob, CVSection } from "@/app/types/cv"
import { CVSectionType } from "@/app/types/cv"

export default function EditCVPage() {
  const params = useParams()
  const router = useRouter()
  const cvId = typeof params.id === "string" ? params.id : params.id?.[0]

  const [cv, setCV] = useState<CV | null>(null)
  const [sections, setSections] = useState<CVSection[]>([])
  const [targetJobs, setTargetJobs] = useState<TargetJob[]>([])
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteSectionDialogOpen, setDeleteSectionDialogOpen] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState<CVSection | null>(null)
  const [isDeletingSection, setIsDeletingSection] = useState(false)

  // Form state
  const [cvTitle, setCVTitle] = useState("")
  const [selectedTargetJobId, setSelectedTargetJobId] = useState<string>("__none__")
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [sectionTitles, setSectionTitles] = useState<Record<string, string>>({})
  const [sectionContents, setSectionContents] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!cvId) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [cvData, sectionsData, targetJobsData, jobDescData] = await Promise.all([
          getCV(cvId),
          getCVSections(cvId),
          getTargetJobs(),
          getJobDescription(cvId),
        ])

        setCV(cvData)
        setCVTitle(cvData.title)
        // Convert null/empty to "__none__" for Select component
        setSelectedTargetJobId(cvData.target_job_id || "__none__")
        setSections(sectionsData || [])

        // Initialize section form state
        const titles: Record<string, string> = {}
        const contents: Record<string, string> = {}
        sectionsData.forEach((section) => {
          titles[section.id] = section.title
          contents[section.id] = section.content || ""
        })
        setSectionTitles(titles)
        setSectionContents(contents)

        // Set target jobs
        setTargetJobs(targetJobsData || [])

        // Set job description
        if (jobDescData?.job_description) {
          setJobDescription(jobDescData.job_description)
        }
      } catch (error) {
        console.error("Failed to fetch CV data:", error)
        toast.error("Failed to load CV. Please try again.")
        router.push("/cvs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [cvId, router])

  const handleSaveCV = async () => {
    if (!cvId || !cvTitle.trim()) {
      toast.error("Please enter a CV title")
      return
    }

    setIsSaving(true)
    try {
      // Convert "__none__" to null for database
      const finalTargetJobId = selectedTargetJobId === "__none__" || !selectedTargetJobId ? null : selectedTargetJobId
      
      await updateCV(cvId, {
        title: cvTitle.trim(),
        target_job_id: finalTargetJobId,
      })

      // TODO: Save job description if changed
      // await updateJobDescription(cvId, jobDescription)

      toast.success("CV updated successfully")
    } catch (error) {
      console.error("Failed to update CV:", error)
      toast.error("Failed to update CV. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSection = async (sectionId: string) => {
    const title = sectionTitles[sectionId]?.trim()
    const content = sectionContents[sectionId]?.trim()

    if (!title) {
      toast.error("Please enter a section title")
      return
    }

    try {
      await updateCVSection(sectionId, {
        title,
        content: content || undefined,
      })

      // Update local state
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, title, content: content || null }
            : s
        )
      )

      setEditingSectionId(null)
      toast.success("Section updated successfully")
    } catch (error) {
      console.error("Failed to update section:", error)
      toast.error("Failed to update section. Please try again.")
    }
  }

  const handleAddSection = async (sectionType: CVSectionType) => {
    if (!cvId) return

    const newSortOrder =
      sections.length > 0
        ? Math.max(...sections.map((s) => s.sort_order)) + 1
        : 0

    try {
      const newSection = await createCVSection(cvId, {
        type: sectionType,
        title: `${sectionType} Section`,
        sort_order: newSortOrder,
        content: "",
      })

      setSections((prev) => [...prev, newSection])
      setSectionTitles((prev) => ({ ...prev, [newSection.id]: newSection.title }))
      setSectionContents((prev) => ({ ...prev, [newSection.id]: "" }))
      setEditingSectionId(newSection.id)
      toast.success("Section added successfully")
    } catch (error) {
      console.error("Failed to create section:", error)
      toast.error("Failed to add section. Please try again.")
    }
  }

  const handleDeleteSectionClick = (section: CVSection) => {
    setSectionToDelete(section)
    setDeleteSectionDialogOpen(true)
  }

  const handleDeleteSectionConfirm = async () => {
    if (!sectionToDelete) return

    setIsDeletingSection(true)
    try {
      await deleteCVSection(sectionToDelete.id)
      setSections((prev) => prev.filter((s) => s.id !== sectionToDelete.id))
      setSectionTitles((prev) => {
        const updated = { ...prev }
        delete updated[sectionToDelete.id]
        return updated
      })
      setSectionContents((prev) => {
        const updated = { ...prev }
        delete updated[sectionToDelete.id]
        return updated
      })
      toast.success("Section deleted successfully")
      setDeleteSectionDialogOpen(false)
      setSectionToDelete(null)
    } catch (error) {
      console.error("Failed to delete section:", error)
      toast.error("Failed to delete section. Please try again.")
    } finally {
      setIsDeletingSection(false)
    }
  }

  const handleMoveSection = async (sectionId: string, direction: "up" | "down") => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId)
    if (sectionIndex === -1) return

    const newIndex = direction === "up" ? sectionIndex - 1 : sectionIndex + 1
    if (newIndex < 0 || newIndex >= sections.length) return

    const updatedSections = [...sections]
    const [movedSection] = updatedSections.splice(sectionIndex, 1)
    updatedSections.splice(newIndex, 0, movedSection)

    // Update sort orders
    const sectionOrders = updatedSections.map((s, idx) => ({
      id: s.id,
      sort_order: idx,
    }))

    try {
      await reorderCVSections(cvId!, sectionOrders)
      setSections(updatedSections)
      toast.success("Section reordered successfully")
    } catch (error) {
      console.error("Failed to reorder sections:", error)
      toast.error("Failed to reorder section. Please try again.")
    }
  }

  const sectionTypeOptions = Object.values(CVSectionType)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading CV...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!cv) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">CV not found</p>
            <Button asChild variant="outline">
              <Link href="/cvs">Back to CVs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
          <h1 className="text-3xl font-semibold mb-2">Edit CV</h1>
          <p className="text-muted-foreground">
            Manage your CV details and sections
          </p>
        </div>
      </div>

      {/* CV Details */}
      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6">
          <CardTitle>CV Details</CardTitle>
          <CardDescription>Update your CV title and target job</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cv-title">CV Title *</Label>
            <Input
              id="cv-title"
              type="text"
              value={cvTitle}
              onChange={(e) => setCVTitle(e.target.value)}
              disabled={isSaving}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-job">Target Job</Label>
            <Select
              value={selectedTargetJobId}
              onValueChange={setSelectedTargetJobId}
              disabled={isSaving}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isSaving}
              className="min-h-[120px]"
              placeholder="Enter or paste the job description here..."
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveCV} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cvs">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CV Sections */}
      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>CV Sections</CardTitle>
              <CardDescription>Manage the sections of your CV</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sectionTypeOptions.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => handleAddSection(type)}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {sections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No sections yet</p>
              <p className="text-sm text-muted-foreground">
                Click "Add Section" to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section, index) => {
                const isEditing = editingSectionId === section.id
                return (
                  <Card key={section.id} className="border">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{section.type}</Badge>
                          {isEditing ? (
                            <Input
                              value={sectionTitles[section.id] || ""}
                              onChange={(e) =>
                                setSectionTitles((prev) => ({
                                  ...prev,
                                  [section.id]: e.target.value,
                                }))
                              }
                              placeholder="Section title"
                              className="h-8 w-auto min-w-[200px]"
                            />
                          ) : (
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMoveSection(section.id, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                            <span className="sr-only">Move up</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMoveSection(section.id, "down")}
                            disabled={index === sections.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Move down</span>
                          </Button>
                          {isEditing ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSaveSection(section.id)}
                              >
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingSectionId(null)
                                  // Reset form state
                                  setSectionTitles((prev) => ({
                                    ...prev,
                                    [section.id]: section.title,
                                  }))
                                  setSectionContents((prev) => ({
                                    ...prev,
                                    [section.id]: section.content || "",
                                  }))
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingSectionId(section.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteSectionClick(section)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Textarea
                            value={sectionContents[section.id] || ""}
                            onChange={(e) =>
                              setSectionContents((prev) => ({
                                ...prev,
                                [section.id]: e.target.value,
                              }))
                            }
                            placeholder="Enter section content..."
                            className="min-h-[100px]"
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {section.content || (
                            <span className="italic">No content yet</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteSectionDialogOpen}
        onOpenChange={setDeleteSectionDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the section{" "}
              {sectionToDelete && (
                <span className="font-medium">"{sectionToDelete.title}"</span>
              )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingSection}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSectionConfirm}
              disabled={isDeletingSection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingSection ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
