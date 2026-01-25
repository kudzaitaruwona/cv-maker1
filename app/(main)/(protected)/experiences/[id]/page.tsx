"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BulletItem } from "@/components/cv/BulletItem"
import {
  getExperience,
  getBullets,
  updateExperience,
  deleteExperience,
  createBullet,
  updateBullet,
  deleteBullet,
} from "@/app/actions/experiences"
import type { MasterExperience, MasterBullet } from "@/app/types/database"
import { BulletCategories } from "@/app/types/database"
import { ArrowLeft, Plus, Save, Trash2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Categories that only need a single date (award/completion date)
const singleDateCategories = [
  BulletCategories.Projects,
  BulletCategories.Certifications,
  BulletCategories.Skills,
]
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

export default function ExperienceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const experienceId = params.id as string

  const [experience, setExperience] = useState<MasterExperience | null>(null)
  const [bullets, setBullets] = useState<MasterBullet[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Batch editing state for bullets
  const [newBullets, setNewBullets] = useState<string[]>([]) // Array of content strings for new bullets
  const [editedBullets, setEditedBullets] = useState<Record<string, string>>({}) // id -> new content
  const [deletedBulletIds, setDeletedBulletIds] = useState<Set<string>>(new Set()) // Set of ids to delete
  const [newBulletContent, setNewBulletContent] = useState("")
  const [showNewBullet, setShowNewBullet] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    organisation: "",
    start_date: "",
    end_date: "",
    location: "",
    link: "",
    type: BulletCategories.Experience,
    is_present: false,
  })

  useEffect(() => {
    if (experienceId) {
      loadData()
    }
  }, [experienceId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [expData, bulletsData] = await Promise.all([
        getExperience(experienceId),
        getBullets(experienceId),
      ])
      setExperience(expData)
      setBullets(bulletsData)
      // Map organisation to organisation for form
      setFormData({
        title: expData.title,
        organisation: expData.organisation || "",
        start_date: expData.start_date || "",
        end_date: expData.end_date || "",
        location: expData.location || "",
        link: expData.link || "",
        type: expData.type,
        is_present: !expData.end_date,
      })
    } catch (error) {
      toast.error("Failed to load experience")
      console.error(error)
      router.push("/experiences")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveExperience = async () => {
    try {
      setSaving(true)
      const isSingleDateCategory = singleDateCategories.includes(formData.type)
      
      let startDate: string | null = null
      let endDate: string | null = null
      
      if (isSingleDateCategory) {
        // For single date categories, use end_date as the award/completion date
        // If end_date is not provided, use start_date
        endDate = formData.end_date || formData.start_date || null
        startDate = null
      } else {
        startDate = formData.start_date || null
        endDate = formData.is_present ? null : (formData.end_date || null)
      }
      
      // Map organisation to organisation for database
      const updated = await updateExperience(experienceId, {
        title: formData.title,
        organisation: formData.organisation || null,
        start_date: startDate,
        end_date: endDate,
        location: formData.location || null,
        link: formData.link || null,
        type: formData.type,
      })
      setExperience(updated)
      setIsEditing(false)
      toast.success("Entry updated successfully")
    } catch (error) {
      toast.error("Failed to update entry")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteExperience = async () => {
    try {
      await deleteExperience(experienceId)
      toast.success("Entry deleted successfully")
      router.push("/experiences")
    } catch (error) {
      toast.error("Failed to delete entry")
      console.error(error)
    }
  }

  // Add new bullet to pending list
  const handleAddNewBullet = () => {
    if (!newBulletContent.trim()) return
    setNewBullets([...newBullets, newBulletContent.trim()])
    setNewBulletContent("")
    setShowNewBullet(false)
  }

  // Update bullet content in local state
  const handleUpdateBullet = (id: string, content: string) => {
    setEditedBullets({ ...editedBullets, [id]: content })
  }

  // Mark bullet for deletion
  const handleDeleteBullet = (id: string) => {
    setDeletedBulletIds(new Set([...deletedBulletIds, id]))
    // Remove from edited bullets if it was being edited
    const newEdited = { ...editedBullets }
    delete newEdited[id]
    setEditedBullets(newEdited)
  }

  // Remove bullet from new bullets list
  const handleRemoveNewBullet = (index: number) => {
    setNewBullets(newBullets.filter((_, i) => i !== index))
  }

  // Undo deletion
  const handleUndoDeleteBullet = (id: string) => {
    const newDeleted = new Set(deletedBulletIds)
    newDeleted.delete(id)
    setDeletedBulletIds(newDeleted)
  }

  // Batch save all bullet changes
  const handleSaveAllBullets = async () => {
    try {
      setSaving(true)
      
      // Create new bullets
      for (const content of newBullets) {
        await createBullet(experienceId, content)
      }

      // Update edited bullets
      for (const [id, content] of Object.entries(editedBullets)) {
        await updateBullet(id, content)
      }

      // Delete marked bullets
      for (const id of deletedBulletIds) {
        await deleteBullet(id)
      }

      // Clear pending changes and reload
      setNewBullets([])
      setEditedBullets({})
      setDeletedBulletIds(new Set())
      
      // Reload bullets from server
      const bulletsData = await getBullets(experienceId)
      setBullets(bulletsData)
      
      toast.success("All changes saved successfully")
    } catch (error) {
      toast.error("Failed to save changes")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // Check if there are pending changes
  const hasPendingBulletChanges = 
    newBullets.length > 0 || 
    Object.keys(editedBullets).length > 0 || 
    deletedBulletIds.size > 0

  // Get display bullets (original + new - deleted, with edits applied)
  const getDisplayBullets = (): Array<MasterBullet & { isNew?: boolean }> => {
    const display: Array<MasterBullet & { isNew?: boolean }> = []
    
    // Add existing bullets (not deleted, with edits applied)
    bullets.forEach((bullet) => {
      if (!deletedBulletIds.has(bullet.id)) {
        const editedContent = editedBullets[bullet.id]
        display.push({
          ...bullet,
          content: editedContent !== undefined ? editedContent : bullet.content,
        })
      }
    })
    
    // Add new bullets (as temporary objects)
    newBullets.forEach((content, index) => {
      display.push({
        id: `new-${index}`,
        content,
        master_experience_id: experienceId,
        user_id: "",
        sort_order: bullets.length + index,
        created_at: new Date().toISOString(),
        isNew: true,
      } as MasterBullet & { isNew: boolean })
    })
    
    return display
  }

  const hasChanges = experience && (
    formData.title !== experience.title ||
    formData.organisation !== (experience.organisation || "") ||
    formData.start_date !== (experience.start_date || "") ||
    formData.end_date !== (experience.end_date || "") ||
    formData.location !== (experience.location || "") ||
    formData.link !== (experience.link || "") ||
    formData.type !== experience.type ||
    formData.is_present !== !experience.end_date
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!experience) {
    return null
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Entry Details</h1>
        </div>
      </div>

      <Card className="rounded-xl border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Entry Information</CardTitle>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as BulletCategories })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BulletCategories).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>organisation</Label>
                <Input
                  value={formData.organisation}
                  onChange={(e) =>
                    setFormData({ ...formData, organisation: e.target.value })
                  }
                />
              </div>

              {singleDateCategories.includes(formData.type) ? (
                <div className="space-y-2">
                  <Label>Date Awarded / Completion Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date || formData.start_date || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        end_date: e.target.value,
                        start_date: "",
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    The date this was awarded or completed
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) =>
                          setFormData({ ...formData, start_date: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        disabled={formData.is_present}
                        value={formData.end_date}
                        onChange={(e) =>
                          setFormData({ ...formData, end_date: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_present"
                      checked={formData.is_present}
                      onChange={(e) =>
                        setFormData({ ...formData, is_present: e.target.checked })
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_present">Currently working here</Label>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              {(formData.type === BulletCategories.Projects || formData.type === BulletCategories.Certifications) && (
                <div className="space-y-2">
                  <Label>Link</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com/project"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to the project, certification, or related resource
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveExperience}
                  disabled={!hasChanges || saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    loadData()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="font-medium">{experience.type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{experience.title}</p>
              </div>
              {experience.organisation && (
                <div>
                  <Label className="text-muted-foreground">organisation</Label>
                  <p className="font-medium">{experience.organisation}</p>
                </div>
              )}
              {singleDateCategories.includes(experience.type) ? (
                (experience.end_date || experience.start_date) && (
                  <div>
                    <Label className="text-muted-foreground">Date Awarded / Completion Date</Label>
                    <p className="font-medium">
                      {new Date(experience.end_date || experience.start_date!).toLocaleDateString()}
                    </p>
                  </div>
                )
              ) : (
                experience.start_date && (
                  <div>
                    <Label className="text-muted-foreground">Date Range</Label>
                    <p className="font-medium">
                      {new Date(experience.start_date).toLocaleDateString()} -{" "}
                      {experience.end_date
                        ? new Date(experience.end_date).toLocaleDateString()
                        : "Present"}
                    </p>
                  </div>
                )
              )}
              {experience.location && (
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{experience.location}</p>
                </div>
              )}
              {experience.link && (experience.type === BulletCategories.Projects || experience.type === BulletCategories.Certifications) && (
                <div>
                  <Label className="text-muted-foreground">Link</Label>
                  <p className="font-medium">
                    <a
                      href={experience.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {experience.link}
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Points</CardTitle>
              {hasPendingBulletChanges && (
                <p className="text-sm text-muted-foreground mt-1">
                  You have unsaved changes
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {hasPendingBulletChanges && (
                <Button 
                  onClick={handleSaveAllBullets} 
                  disabled={saving}
                  className="bg-primary"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save All Changes
                    </>
                  )}
                </Button>
              )}
              {!showNewBullet && (
                <Button onClick={() => setShowNewBullet(true)} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Point
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewBullet && (
            <div className="space-y-2 p-3 rounded-md border border-input bg-card">
              <textarea
                value={newBulletContent}
                onChange={(e) => setNewBulletContent(e.target.value)}
                placeholder="Enter point content..."
                className="w-full min-h-[80px] p-2 rounded-md border border-input bg-background"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleAddNewBullet()
                  }
                }}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddNewBullet}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowNewBullet(false)
                    setNewBulletContent("")
                  }}
                >
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Cmd/Ctrl + Enter to add
              </p>
            </div>
          )}

          {getDisplayBullets().length === 0 && newBullets.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No points yet. Add your first point.
            </p>
          ) : (
            <div className="space-y-2">
              {getDisplayBullets().map((bullet, index) => {
                const isNew = bullet.isNew === true
                const originalBullet = bullets.find(b => b.id === bullet.id)
                const isEdited = !isNew && originalBullet && editedBullets[bullet.id] && editedBullets[bullet.id] !== originalBullet.content
                const isDeleted = !isNew && deletedBulletIds.has(bullet.id)
                
                if (isNew) {
                  // Calculate which new bullet index this is
                  const nonDeletedCount = bullets.filter(b => !deletedBulletIds.has(b.id)).length
                  const newBulletIndex = index - nonDeletedCount
                  
                  return (
                    <div key={bullet.id} className="space-y-2 p-3 rounded-md border-2 border-primary/50 bg-primary/5">
                      <div className="flex items-start gap-2">
                        <Badge variant="secondary" className="text-xs">New</Badge>
                        <p className="text-sm leading-relaxed flex-1">{bullet.content}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveNewBullet(newBulletIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                }

                if (isDeleted) {
                  return (
                    <div key={bullet.id} className="relative opacity-50">
                      <div className="absolute inset-0 bg-destructive/10 border-2 border-destructive/50 rounded-md" />
                      <div className="p-3 relative">
                        <p className="text-sm line-through">{bullet.content}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => handleUndoDeleteBullet(bullet.id)}
                        >
                          Undo
                        </Button>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={bullet.id} className="relative">
                    {isEdited && (
                      <Badge variant="secondary" className="absolute top-2 right-12 z-10 text-xs">
                        Edited
                      </Badge>
                    )}
                    <BulletItem
                      bullet={bullet}
                      onEdit={handleUpdateBullet}
                      onDelete={handleDeleteBullet}
                      showEditButtons={true}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Entry
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              entry "{experience.title}" and all its bullets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExperience}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
