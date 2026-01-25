"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BulletItem } from "@/components/cv/BulletItem"
import { ExperienceSelector } from "@/components/cv/ExperienceSelector"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getCV,
  getCVSections,
  updateCV,
  updateTargetPosition,
  updateCVSection,
  updateCVBullets,
  deleteCVSection,
  deleteCVBullet,
  addCVSections,
  addCVBullets,
  runATSScore,
} from "@/app/actions/cvs"
import { getExperiences, getBullets } from "@/app/actions/experiences"
import type {
  CVWithDetails,
  CVSectionWithBullets,
  CVBullet,
  MasterExperience,
  MasterBullet,
} from "@/app/types/database"
import { BulletCategories } from "@/app/types/database"
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Loader2,
  FileDown,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const categoryOrder: BulletCategories[] = [
  BulletCategories.Experience,
  BulletCategories.Projects,
  BulletCategories.Education,
  BulletCategories.Skills,
  BulletCategories.Certifications,
  BulletCategories.Other,
]

// Categories that only need a single date (award/completion date)
const singleDateCategories = [
  BulletCategories.Projects,
  BulletCategories.Certifications,
  BulletCategories.Skills,
]

export default function CVPage() {
  const params = useParams()
  const router = useRouter()
  const cvId = params.id as string

  const [cv, setCV] = useState<CVWithDetails | null>(null)
  const [sections, setSections] = useState<CVSectionWithBullets[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddExperience, setShowAddExperience] = useState<string | null>(null)
  const [globalAddDialogOpen, setGlobalAddDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<BulletCategories | null>(null)
  const [loadingExperiences, setLoadingExperiences] = useState(false)
  const [availableExperiences, setAvailableExperiences] = useState<
    Array<MasterExperience & { bullets?: MasterBullet[] }>
  >([])
  const [selectedExperiences, setSelectedExperiences] = useState<Set<string>>(new Set())
  const [selectedBullets, setSelectedBullets] = useState<Set<string>>(new Set())

  // Form state
  const [cvTitle, setCVTitle] = useState("")
  const [cvSummary, setCVSummary] = useState("")
  const [targetJobTitle, setTargetJobTitle] = useState("")
  const [targetCompany, setTargetCompany] = useState("")
  const [targetDescription, setTargetDescription] = useState("")

  useEffect(() => {
    if (cvId) {
      loadData()
    }
  }, [cvId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cvData, sectionsData] = await Promise.all([
        getCV(cvId),
        getCVSections(cvId),
      ])
      setCV(cvData)
      setSections(sectionsData)
      setCVTitle(cvData.title)
      setCVSummary(cvData.summary || "")
      if (cvData.target_position) {
        setTargetJobTitle(cvData.target_position.title)
        setTargetCompany(cvData.target_position.company)
        setTargetDescription(cvData.target_position.description || "")
      }
    } catch (error) {
      toast.error("Failed to load CV")
      console.error(error)
      router.push("/cvs")
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableExperiences = async (category: BulletCategories) => {
    try {
      setLoadingExperiences(true)
      const expData = await getExperiences()
      const categoryExperiences = expData.filter((exp) => exp.type === category)
      
      const experiencesWithBullets = await Promise.all(
        categoryExperiences.map(async (exp) => {
          const bullets = await getBullets(exp.id)
          return { ...exp, bullets }
        })
      )
      
      setAvailableExperiences(experiencesWithBullets)
    } catch (error) {
      toast.error("Failed to load entries")
      console.error(error)
      setAvailableExperiences([])
    } finally {
      setLoadingExperiences(false)
    }
  }

  const handleCategorySelect = (category: BulletCategories) => {
    setSelectedCategory(category)
    setSelectedExperiences(new Set())
    setSelectedBullets(new Set())
    loadAvailableExperiences(category)
  }

  const handleGlobalAdd = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category")
      return
    }

    if (selectedExperiences.size === 0) {
      toast.error("Please select at least one entry")
      return
    }

    if (!cvId) {
      toast.error("CV not found")
      return
    }

    try {
      setSaving(true)

      const experienceSelections = Array.from(selectedExperiences).map((expId) => {
        const exp = availableExperiences.find((e) => e.id === expId)
        if (!exp) throw new Error(`Entry ${expId} not found`)
        return {
          master_experience_id: expId,
          master_experience: exp,
        }
      })

      const newSections = await addCVSections(cvId, experienceSelections)

      // Add bullets for each new section
      for (const section of newSections) {
        const experience = availableExperiences.find(
          (e) => e.id === section.master_experience_id
        )
        if (!experience || !experience.bullets) continue

        const selectedBulletsForExp = experience.bullets.filter((bullet) =>
          selectedBullets.has(bullet.id)
        )

        if (selectedBulletsForExp.length > 0) {
          const bulletSelections = selectedBulletsForExp.map((bullet) => ({
            master_bullet_id: bullet.id,
            master_bullet: bullet,
          }))

          await addCVBullets(section.id, bulletSelections)
        }
      }

      toast.success("Entries added successfully")
      setGlobalAddDialogOpen(false)
      setSelectedCategory(null)
      setAvailableExperiences([])
      setSelectedExperiences(new Set())
      setSelectedBullets(new Set())
      loadData()
    } catch (error) {
      toast.error("Failed to add entries")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCVDetails = async () => {
    if (!cv) return

    try {
      setSaving(true)
      
      // Update CV title and summary
      await updateCV(cv.id, { 
        title: cvTitle,
        summary: cvSummary || null,
      })

      // Update target position if it exists
      if (cv.target_position) {
        await updateTargetPosition(cv.target_position.id, {
          title: targetJobTitle,
          company: targetCompany,
          description: targetDescription || null,
        })
      }

      toast.success("CV details saved successfully")
      loadData()
    } catch (error) {
      toast.error("Failed to save CV details")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSection = async (section: CVSectionWithBullets) => {
    try {
      setSaving(true)

      const isSingleDateCategory = singleDateCategories.includes(section.type as BulletCategories)
      
      let startDate: string | null = null
      let endDate: string | null = null
      
      if (isSingleDateCategory) {
        // For single date categories, use end_date as the award/completion date
        // If end_date is not provided, use start_date
        endDate = section.end_date || section.start_date || null
        startDate = null
      } else {
        startDate = section.start_date || null
        endDate = section.end_date || null
      }

      // Update section details
      await updateCVSection(section.id, {
        title: section.title,
        organisation: section.organisation,
        start_date: startDate,
        end_date: endDate,
        location: section.location,
        link: section.link,
      })

      // Update bullets
      if (section.bullets && section.bullets.length > 0) {
        await updateCVBullets(
          section.id,
          section.bullets.map((bullet) => ({
            id: bullet.id,
            content: bullet.content,
          }))
        )
      }

      toast.success("Section saved successfully")
      loadData()
    } catch (error) {
      toast.error("Failed to save section")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deleteCVSection(sectionId)
      toast.success("Section deleted successfully")
      loadData()
    } catch (error) {
      toast.error("Failed to delete section")
      console.error(error)
    }
  }

  const handleUpdateBullet = async (
    sectionId: string,
    bulletId: string,
    content: string
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          bullets: section.bullets?.map((bullet) =>
            bullet.id === bulletId ? { ...bullet, content } : bullet
          ),
        }
      }
      return section
    })
    setSections(updatedSections)
  }

  const handleDeleteBullet = async (bulletId: string) => {
    try {
      await deleteCVBullet(bulletId)
      toast.success("Bullet deleted successfully")
      loadData()
    } catch (error) {
      toast.error("Failed to delete bullet")
      console.error(error)
    }
  }

  const handleAddExperiences = async (category: BulletCategories) => {
    if (selectedExperiences.size === 0) {
      toast.error("Please select at least one entry")
      return
    }

    try {
      setSaving(true)

      const experienceSelections = Array.from(selectedExperiences).map((expId) => {
        const exp = availableExperiences.find((e) => e.id === expId)
        if (!exp) throw new Error(`Experience ${expId} not found`)
        return {
          master_experience_id: expId,
          master_experience: exp,
        }
      })

      const newSections = await addCVSections(cvId, experienceSelections)

      // Add bullets for each new section
      for (const section of newSections) {
        const experience = availableExperiences.find(
          (e) => e.id === section.master_experience_id
        )
        if (!experience || !experience.bullets) continue

        const selectedBulletsForExp = experience.bullets.filter((bullet) =>
          selectedBullets.has(bullet.id)
        )

        if (selectedBulletsForExp.length > 0) {
          const bulletSelections = selectedBulletsForExp.map((bullet) => ({
            master_bullet_id: bullet.id,
            master_bullet: bullet,
          }))

          await addCVBullets(section.id, bulletSelections)
        }
      }

      toast.success("Entries added successfully")
      setShowAddExperience(null)
      setSelectedExperiences(new Set())
      setSelectedBullets(new Set())
      loadData()
    } catch (error) {
      toast.error("Failed to add entries")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleRunATS = async () => {
    try {
      setSaving(true)
      await runATSScore(cvId)
      toast.success("ATS score generated successfully")
      loadData()
    } catch (error) {
      toast.error("Failed to generate ATS score")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const groupedSections = categoryOrder.reduce((acc, category) => {
    acc[category] = sections.filter((section) => section.type === category)
    return acc
  }, {} as Record<BulletCategories, CVSectionWithBullets[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!cv) {
    return null
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit CV</h1>
        </div>
      </div>

      {/* CV Details Section */}
      <Card className="rounded-xl border-2">
        <CardHeader>
          <CardTitle>CV Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>CV Title</Label>
            <Input
              value={cvTitle}
              onChange={(e) => setCVTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Summary</Label>
              <span className="text-xs text-muted-foreground">(Recommended)</span>
            </div>
            <Textarea
              value={cvSummary}
              onChange={(e) => setCVSummary(e.target.value)}
              placeholder="Write a brief professional summary highlighting your key qualifications and career objectives..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              A well-written summary helps recruiters quickly understand your value proposition. This summary will appear at the top of your CV.
            </p>
          </div>

          {cv.target_position && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea
                  value={targetDescription}
                  onChange={(e) => setTargetDescription(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
            </>
          )}

          <Button onClick={handleSaveCVDetails} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            Save CV Details
          </Button>
        </CardContent>
      </Card>

      {/* Global Add New Entry Button */}
      <Card className="rounded-xl border-2">
        <CardContent className="p-6">
          <Dialog
            open={globalAddDialogOpen}
            onOpenChange={(open) => {
              setGlobalAddDialogOpen(open)
              if (!open) {
                // Reset state when dialog closes
                setSelectedCategory(null)
                setAvailableExperiences([])
                setSelectedExperiences(new Set())
                setSelectedBullets(new Set())
                setLoadingExperiences(false)
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Entry</DialogTitle>
                <DialogDescription>
                  Select a category and choose entries to add to your CV
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label>Select Category</Label>
                  <Select
                    value={selectedCategory || ""}
                    onValueChange={(value) => handleCategorySelect(value as BulletCategories)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOrder.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div className="space-y-4">
                    {loadingExperiences ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">
                          Loading entries...
                        </span>
                      </div>
                    ) : availableExperiences.length === 0 ? (
                      <div className="rounded-lg border-2 border-dashed p-12 text-center">
                        <p className="text-muted-foreground mb-2">
                          No entries found for {selectedCategory}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Create entries in your{" "}
                          <Link
                            href="/experiences"
                            className="text-primary hover:underline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setGlobalAddDialogOpen(false)
                            }}
                          >
                            Master Library
                          </Link>{" "}
                          first.
                        </p>
                      </div>
                    ) : (
                      <>
                        <ExperienceSelector
                          experiences={availableExperiences}
                          selectedExperiences={selectedExperiences}
                          selectedBullets={selectedBullets}
                          onExperienceToggle={(id, checked) => {
                            const newSet = new Set(selectedExperiences)
                            if (checked) {
                              newSet.add(id)
                            } else {
                              newSet.delete(id)
                            }
                            setSelectedExperiences(newSet)
                          }}
                          onBulletToggle={(id, checked) => {
                            const newSet = new Set(selectedBullets)
                            if (checked) {
                              newSet.add(id)
                            } else {
                              newSet.delete(id)
                            }
                            setSelectedBullets(newSet)
                          }}
                        />
                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setGlobalAddDialogOpen(false)
                              setSelectedCategory(null)
                              setSelectedExperiences(new Set())
                              setSelectedBullets(new Set())
                            }}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleGlobalAdd}
                            disabled={saving || selectedExperiences.size === 0}
                          >
                            {saving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              <>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Selected
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* CV Sections by Category */}
      <div className="space-y-6">
        {categoryOrder.map((category) => {
          const categorySections = groupedSections[category]
          if (categorySections.length === 0 && showAddExperience !== category) {
            return null
          }

          return (
            <Card key={category} className="rounded-xl border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{category}</CardTitle>
                  {!showAddExperience && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddExperience(category)
                        loadAvailableExperiences(category)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New {category}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddExperience === category && (
                  <Card className="border-2 border-dashed">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Select Entries to Add</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowAddExperience(null)
                              setSelectedExperiences(new Set())
                              setSelectedBullets(new Set())
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                        <ExperienceSelector
                          experiences={availableExperiences}
                          selectedExperiences={selectedExperiences}
                          selectedBullets={selectedBullets}
                          onExperienceToggle={(id, checked) => {
                            const newSet = new Set(selectedExperiences)
                            if (checked) {
                              newSet.add(id)
                            } else {
                              newSet.delete(id)
                            }
                            setSelectedExperiences(newSet)
                          }}
                          onBulletToggle={(id, checked) => {
                            const newSet = new Set(selectedBullets)
                            if (checked) {
                              newSet.add(id)
                            } else {
                              newSet.delete(id)
                            }
                            setSelectedBullets(newSet)
                          }}
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleAddExperiences(category)}
                            disabled={saving}
                          >
                            Add Selected
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {categorySections.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No entries in this category yet
                  </p>
                ) : (
                  <Accordion type="multiple" className="space-y-3">
                    {categorySections.map((section) => (
                      <AccordionItem
                        key={section.id}
                        value={section.id}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex-1 text-left">
                            <div className="font-medium">{section.title}</div>
                            {section.organisation && (
                              <div className="text-sm text-muted-foreground">
                                {section.organisation}
                              </div>
                            )}
                            {singleDateCategories.includes(section.type as BulletCategories) ? (
                              (section.end_date || section.start_date) && (
                                <div className="text-xs text-muted-foreground">
                                  {new Date(section.end_date || section.start_date!).toLocaleDateString()}
                                </div>
                              )
                            ) : (
                              section.start_date && (
                                <div className="text-xs text-muted-foreground">
                                  {new Date(section.start_date).toLocaleDateString()} -{" "}
                                  {section.end_date
                                    ? new Date(section.end_date).toLocaleDateString()
                                    : "Present"}
                                </div>
                              )
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                  value={section.title}
                                  onChange={(e) => {
                                    const updated = sections.map((s) =>
                                      s.id === section.id
                                        ? { ...s, title: e.target.value }
                                        : s
                                    )
                                    setSections(updated)
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>organisation</Label>
                                <Input
                                  value={section.organisation || ""}
                                  onChange={(e) => {
                                    const updated = sections.map((s) =>
                                      s.id === section.id
                                        ? { ...s, organisation: e.target.value }
                                        : s
                                    )
                                    setSections(updated)
                                  }}
                                />
                              </div>
                            </div>
                            {singleDateCategories.includes(section.type as BulletCategories) ? (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Date Awarded / Completion Date</Label>
                                  <Input
                                    type="date"
                                    value={section.end_date || section.start_date || ""}
                                    onChange={(e) => {
                                      const updated = sections.map((s) =>
                                        s.id === section.id
                                          ? { ...s, end_date: e.target.value, start_date: null }
                                          : s
                                      )
                                      setSections(updated)
                                    }}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    The date this was awarded or completed
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Label>Location</Label>
                                  <Input
                                    value={section.location || ""}
                                    onChange={(e) => {
                                      const updated = sections.map((s) =>
                                        s.id === section.id
                                          ? { ...s, location: e.target.value }
                                          : s
                                      )
                                      setSections(updated)
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Start Date</Label>
                                  <Input
                                    type="date"
                                    value={section.start_date || ""}
                                    onChange={(e) => {
                                      const updated = sections.map((s) =>
                                        s.id === section.id
                                          ? { ...s, start_date: e.target.value }
                                          : s
                                      )
                                      setSections(updated)
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>End Date</Label>
                                  <Input
                                    type="date"
                                    value={section.end_date || ""}
                                    onChange={(e) => {
                                      const updated = sections.map((s) =>
                                        s.id === section.id
                                          ? { ...s, end_date: e.target.value }
                                          : s
                                      )
                                      setSections(updated)
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Location</Label>
                                  <Input
                                    value={section.location || ""}
                                    onChange={(e) => {
                                      const updated = sections.map((s) =>
                                        s.id === section.id
                                          ? { ...s, location: e.target.value }
                                          : s
                                      )
                                      setSections(updated)
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            {(section.type === BulletCategories.Projects || section.type === BulletCategories.Certifications) && (
                              <div className="space-y-2">
                                <Label>Link</Label>
                                <Input
                                  type="url"
                                  placeholder="https://example.com/project"
                                  value={section.link || ""}
                                  onChange={(e) => {
                                    const updated = sections.map((s) =>
                                      s.id === section.id
                                        ? { ...s, link: e.target.value }
                                        : s
                                    )
                                    setSections(updated)
                                  }}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Link to the project, certification, or related resource
                                </p>
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label>Bullets</Label>
                              {section.bullets && section.bullets.length > 0 ? (
                                <div className="space-y-2">
                                  {section.bullets.map((bullet) => (
                                    <BulletItem
                                      key={bullet.id}
                                      bullet={bullet}
                                      onEdit={(id, content) =>
                                        handleUpdateBullet(section.id, id, content)
                                      }
                                      onDelete={handleDeleteBullet}
                                      showEditButtons={true}
                                      isEdited={
                                        bullet.master_bullet_id !== null &&
                                        bullet.previous_content !== null
                                      }
                                    />
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No bullets for this section
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2 border-t">
                              <Button
                                onClick={() => handleSaveSection(section)}
                                disabled={saving}
                              >
                                <Save className="mr-2 h-4 w-4" />
                                Save Section
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteSection(section.id)}
                                disabled={saving}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Section
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Actions */}
      <Card className="rounded-xl border-2">
        <CardContent className="p-6">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleRunATS} disabled={saving}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Run ATS Score
            </Button>
            <Button asChild disabled={saving}>
              <Link href={`/cvs/${cvId}/resume`}>
                <FileDown className="mr-2 h-4 w-4" />
                Create PDF
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
