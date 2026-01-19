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
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getBullets, updateBullets } from "@/app/actions/bullets"
import { bulletCategories } from "@/app/types/bullets"

const categories: { value: bulletCategories; label: string }[] = [
  { value: bulletCategories.Experience, label: "Experience" },
  { value: bulletCategories.Projects, label: "Projects" },
  { value: bulletCategories.Education, label: "Education" },
  { value: bulletCategories.Skills, label: "Skills" },
  { value: bulletCategories.Certifications, label: "Certifications" },
  { value: bulletCategories.Other, label: "Other" },
]

interface Bullet {
  id: string
  title?: string
  content: string
  category: string
  createdAt: string
}

export default function EditBulletPage() {
  const router = useRouter()
  const params = useParams()
  const bulletId = params.id as string

  const [category, setCategory] = useState<bulletCategories | "">("")
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchBullet() {
      setIsLoading(true)
      try {
        const bullets = await getBullets()
        const bullet = bullets?.find((b: Bullet) => b.id === bulletId)
        
        if (!bullet) {
          toast.error("Bullet not found")
          router.push("/bullets")
          return
        }

        setCategory(bullet.category as bulletCategories)
        setTitle(bullet.title || "")
        setText(bullet.content || "")
      } catch (error) {
        console.error("Failed to fetch bullet:", error)
        toast.error("Failed to load bullet. Please try again.")
        router.push("/bullets")
      } finally {
        setIsLoading(false)
      }
    }

    if (bulletId) {
      fetchBullet()
    }
  }, [bulletId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category || !text) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const updates: Record<string, any> = {
        category,
        content: text,
      }

      if (title) {
        updates.title = title
      }

      await updateBullets(bulletId, updates)

      toast.success("Bullet updated successfully")
      router.push("/bullets")
    } catch (error) {
      console.error("Failed to update bullet:", error)
      toast.error("Failed to update bullet. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/bullets">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold mb-2">Edit Bullet</h1>
            <p className="text-muted-foreground">
              Loading bullet details...
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/bullets">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold mb-2">Edit Bullet</h1>
          <p className="text-muted-foreground">
            Update your achievement bullet point
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bullet Information</CardTitle>
          <CardDescription>
            Update the details for your bullet point
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as bulletCategories)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter bullet title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Textarea
                id="text"
                placeholder="Enter bullet description"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                asChild
                disabled={isSubmitting}
              >
                <Link href="/bullets">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
