"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Loader2, RefreshCw } from "lucide-react"
import { getBullets, deleteBullets } from "@/app/actions/bullets"
import { toast } from "sonner"
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

interface Bullet {
  id: string
  content: string
  category: "Experience" | "Projects" | "Education" | "Skills" | "Certifications" | "Other"
  createdAt: string
  title?: string
}

const categories: Bullet["category"][] = [
  "Experience",
  "Projects",
  "Education",
  "Skills",
  "Certifications",
  "Other"
]

export default function BulletsPage() {
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bulletToDelete, setBulletToDelete] = useState<Bullet | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
    
  const fetchBullets = async () => {
    setIsLoading(true)
    try {
      const data = await getBullets()
      setBullets(data || [])
    } catch (error) {
      console.error("Failed to fetch bullets:", error)
      toast.error("Failed to load bullets. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBullets()
  }, [])

  const handleDeleteClick = (bullet: Bullet) => {
    setBulletToDelete(bullet)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!bulletToDelete) return

    setIsDeleting(true)
    try {
      await deleteBullets(bulletToDelete.id)
      toast.success("Bullet deleted successfully")
      setDeleteDialogOpen(false)
      setBulletToDelete(null)
      // Refresh the list after deletion
      await fetchBullets()
    } catch (error) {
      console.error("Failed to delete bullet:", error)
      toast.error("Failed to delete bullet. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const groupedBullets = useMemo(() => {
    const grouped: Record<string, Bullet[]> = {}
    categories.forEach(category => {
      grouped[category] = bullets.filter(bullet => bullet.category === category)
    })
    return grouped
  }, [bullets])

  const formatCategoryName = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  const hasAnyBullets = bullets.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Bullets</h1>
          <p className="text-muted-foreground">
            Manage your achievement bullets
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={fetchBullets}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button asChild>
            <Link href="/bullets/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Bullet
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading bullets...</p>
          </CardContent>
        </Card>
      ) : !hasAnyBullets ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No bullets yet</p>
            <Button asChild>
              <Link href="/bullets/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Bullet
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryBullets = groupedBullets[category]
            if (categoryBullets.length === 0) return null

            return (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  {formatCategoryName(category)}
                </h2>
                <div className="space-y-4">
                  {categoryBullets.map((bullet) => (
                    <Card key={bullet.id}>
                      <CardHeader>
                        <CardTitle className="text-base font-medium">
                          {bullet.title || bullet.content}
                        </CardTitle>
                        {bullet.title && (
                          <CardDescription className="text-sm">
                            {bullet.content}
                          </CardDescription>
                        )}
                        <CardDescription>
                          Added on {new Date(bullet.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/bullets/${bullet.id}/edit`}>Edit</Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteClick(bullet)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bullet{" "}
              {bulletToDelete && (
                <span className="font-medium">
                  "{bulletToDelete.title || bulletToDelete.content}"
                </span>
              )}{" "}
              from your account.
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
