"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { BulletItem } from "@/components/cv/BulletItem"
import { ExperienceSelector } from "@/components/cv/ExperienceSelector"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  exportPDF,
} from "@/app/actions/cvs"
import { getExperiences, getBullets } from "@/app/actions/experiences"
import type {
  CVWithDetails,
  CVSectionWithBullets,
  CVBullet,
} from "@/app/types/database"
import type { MasterExperience, MasterBullet } from "@/app/types/database"
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

const categoryOrder: BulletCategories[] = [
  BulletCategories.Experience,
  BulletCategories.Projects,
  BulletCategories.Education,
  BulletCategories.Skills,
  BulletCategories.Certifications,
  BulletCategories.Other,
]

export default function EditCVPage() {
  const params = useParams()
  const router = useRouter()
  const cvId = params.id as string

  const [cv, setCV] = useState<CVWithDetails | null>(null)
  const [sections, setSections] = useState<CVSectionWithBullets[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddExperience, setShowAddExperience] = useState<string | null>(null)
  const [availableExperiences, setAvailableExperiences] = useState<
    Array<MasterExperience & { bullets?: MasterBullet[] }>
  >([])
  const [selectedExperiences, setSelectedExperiences] = useState<Set<string>>(new Set())
  const [selectedBullets, setSelectedBullets] = useState<Set<string>>(new Set())

  // Form state
  const [cvTitle, setCVTitle] = useState("")
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
      toast.error("Failed to load experiences")
      console.error(error)
    }
  }

  const handleSaveCVDetails = async () => {
    if (!cv) return

    try {
      setSaving(true)
      
      // Update CV title
      await updateCV(cv.id, { title: cvTitle })

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

      // Update section details
      await updateCVSection(section.id, {
        title: section.title,
        organization: section.organization,
        start_date: section.start_date,
        end_date: section.end_date,
        location: section.location,
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
      toast.error("Please select at least one experience")
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

      toast.success("Experiences added successfully")
      setShowAddExperience(null)
      setSelectedExperiences(new Set())
      setSelectedBullets(new Set())
      loadData()
    } catch (error) {
      toast.error("Failed to add experiences")
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

  const handleExportPDF = async () => {
    try {
      setSaving(true)
      const blob = await exportPDF(cvId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${cvTitle || "CV"}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("PDF exported successfully")
    } catch (error) {
      toast.error("Failed to export PDF")
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
                      Add Experience
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
                          <h3 className="font-semibold">Select Experiences to Add</h3>
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
                    No experiences in this category yet
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
                            {section.organization && (
                              <div className="text-sm text-muted-foreground">
                                {section.organization}
                              </div>
                            )}
                            {section.start_date && (
                              <div className="text-xs text-muted-foreground">
                                {new Date(section.start_date).toLocaleDateString()} -{" "}
                                {section.end_date
                                  ? new Date(section.end_date).toLocaleDateString()
                                  : "Present"}
                              </div>
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
                                <Label>Organization</Label>
                                <Input
                                  value={section.organization || ""}
                                  onChange={(e) => {
                                    const updated = sections.map((s) =>
                                      s.id === section.id
                                        ? { ...s, organization: e.target.value }
                                        : s
                                    )
                                    setSections(updated)
                                  }}
                                />
                              </div>
                            </div>
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
            <Button onClick={handleExportPDF} disabled={saving}>
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
