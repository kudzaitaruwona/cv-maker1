"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import { createDummyBullets } from "@/app/actions/bullets"

export default function SeedBulletsPage() {
  const router = useRouter()
  const [count, setCount] = useState(20)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateDummyBullets = async () => {
    if (count < 1 || count > 100) {
      toast.error("Please enter a number between 1 and 100")
      return
    }

    setIsCreating(true)
    try {
      const result = await createDummyBullets(count)
      toast.success(`Successfully created ${result.count} dummy bullets!`)
      router.push("/bullets")
    } catch (error) {
      console.error("Failed to create dummy bullets:", error)
      toast.error("Failed to create dummy bullets. Please try again.")
    } finally {
      setIsCreating(false)
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
          <h1 className="text-3xl font-semibold mb-2">Seed Dummy Bullets</h1>
          <p className="text-muted-foreground">
            Create sample bullets for testing purposes
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Dummy Bullets</CardTitle>
          <CardDescription>
            This will create sample bullets across all categories for the current user.
            Useful for testing and development.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="count">Number of Bullets to Create</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 20)}
              placeholder="Enter number of bullets"
            />
            <p className="text-sm text-muted-foreground">
              Enter a number between 1 and 100. The script will create a variety of bullets
              across Experience, Projects, Education, Skills, Certifications, and Other categories.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCreateDummyBullets}
              disabled={isCreating}
              className="w-full sm:w-auto"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Dummy Bullets"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
              disabled={isCreating}
            >
              <Link href="/bullets">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
