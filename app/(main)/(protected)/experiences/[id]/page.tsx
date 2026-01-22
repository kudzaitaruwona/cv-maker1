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
  const [newBulletContent, setNewBulletContent] = useState("")
  const [showNewBullet, setShowNewBullet] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    start_date: "",
    end_date: "",
    location: "",
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
      setFormData({
        title: expData.title,
        organization: expData.organization || "",
        start_date: expData.start_date || "",
        end_date: expData.end_date || "",
        location: expData.location || "",
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
      
      const updated = await updateExperience(experienceId, {
        title: formData.title,
        organization: formData.organization || null,
        start_date: startDate,
        end_date: endDate,
        location: formData.location || null,
        type: formData.type,
      })
      setExperience(updated)
      setIsEditing(false)
      toast.success("Experience updated successfully")
    } catch (error) {
      toast.error("Failed to update experience")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteExperience = async () => {
    try {
      await deleteExperience(experienceId)
      toast.success("Experience deleted successfully")
      router.push("/experiences")
    } catch (error) {
      toast.error("Failed to delete experience")
      console.error(error)
    }
  }

  const handleCreateBullet = async () => {
    if (!newBulletContent.trim()) return

    try {
      const newBullet = await createBullet(experienceId, newBulletContent.trim())
      setBullets([...bullets, newBullet])
      setNewBulletContent("")
      setShowNewBullet(false)
      toast.success("Bullet added successfully")
    } catch (error) {
      toast.error("Failed to create bullet")
      console.error(error)
    }
  }

  const handleUpdateBullet = async (id: string, content: string) => {
    try {
      const updated = await updateBullet(id, content)
      setBullets(bullets.map((b) => (b.id === id ? updated : b)))
      toast.success("Bullet updated successfully")
    } catch (error) {
      toast.error("Failed to update bullet")
      console.error(error)
    }
  }

  const handleDeleteBullet = async (id: string) => {
    try {
      await deleteBullet(id)
      setBullets(bullets.filter((b) => b.id !== id))
      toast.success("Bullet deleted successfully")
    } catch (error) {
      toast.error("Failed to delete bullet")
      console.error(error)
    }
  }

  const hasChanges = experience && (
    formData.title !== experience.title ||
    formData.organization !== (experience.organization || "") ||
    formData.start_date !== (experience.start_date || "") ||
    formData.end_date !== (experience.end_date || "") ||
    formData.location !== (experience.location || "") ||
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
          <h1 className="text-3xl font-bold">Experience Details</h1>
        </div>
      </div>

      <Card className="rounded-xl border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Experience Information</CardTitle>
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
                <Label>Organization</Label>
                <Input
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
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
              {experience.organization && (
                <div>
                  <Label className="text-muted-foreground">Organization</Label>
                  <p className="font-medium">{experience.organization}</p>
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
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bullets</CardTitle>
            {!showNewBullet && (
              <Button onClick={() => setShowNewBullet(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Bullet
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewBullet && (
            <div className="space-y-2 p-3 rounded-md border border-input bg-card">
              <textarea
                value={newBulletContent}
                onChange={(e) => setNewBulletContent(e.target.value)}
                placeholder="Enter bullet point content..."
                className="w-full min-h-[80px] p-2 rounded-md border border-input bg-background"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateBullet}>
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
            </div>
          )}

          {bullets.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No bullets yet. Add your first bullet point.
            </p>
          ) : (
            <div className="space-y-2">
              {bullets.map((bullet) => (
                <BulletItem
                  key={bullet.id}
                  bullet={bullet}
                  onEdit={handleUpdateBullet}
                  onDelete={handleDeleteBullet}
                  showEditButtons={true}
                />
              ))}
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
          Delete Experience
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              experience "{experience.title}" and all its bullets.
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
