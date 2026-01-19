"use client"

import { useState } from "react"
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
import { ArrowLeft } from "lucide-react"
import { createBullets } from "@/app/actions/bullets"
import { bulletCategories } from "@/app/types/bullets"

const categories: { value: bulletCategories; label: string }[] = [
  { value: bulletCategories.Experience, label: "Experience" },
  { value: bulletCategories.Projects, label: "Projects" },
  { value: bulletCategories.Education, label: "Education" },
  { value: bulletCategories.Skills, label: "Skills" },
  { value: bulletCategories.Certifications, label: "Certifications" },
  { value: bulletCategories.Other, label: "Other" },
]


export default function NewBulletPage() {
  const router = useRouter()
  const [category, setCategory] = useState<bulletCategories | "">("")
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category || !title || !text) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Call server action to create bullet
      await createBullets(category, text, title)

      toast.success("Bullet created successfully")
      
      // Navigate back to bullets page after successful creation
      router.push("/bullets")
    } catch (error) {
      console.error("Failed to create bullet:", error)
      toast.error("Failed to create bullet. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="text-3xl font-semibold mb-2">Add New Bullet</h1>
          <p className="text-muted-foreground">
            Create a new achievement bullet point
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bullet Information</CardTitle>
          <CardDescription>
            Fill in the details for your new bullet point
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
                {isSubmitting ? "Creating..." : "Create"}
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
