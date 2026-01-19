"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

interface Bullet {
  id: string
  content: string
  category: "experience" | "projects" | "education" | "skills" | "certifications" | "other"
  createdAt: string
}

const categories: Bullet["category"][] = [
  "experience",
  "projects",
  "education",
  "skills",
  "certifications",
  "other"
]

export default function BulletsPage() {
  // TODO: Replace with actual API call to fetch bullets from backend
  const [bullets] = useState<Bullet[]>([
    {
      id: "1",
      content: "Developed and maintained web applications using React and TypeScript",
      category: "experience",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      content: "Led a team of 5 developers to deliver a major product feature on time",
      category: "experience",
      createdAt: "2024-03-01"
    },
    {
      id: "3",
      content: "Implemented CI/CD pipelines reducing deployment time by 40%",
      category: "experience",
      createdAt: "2024-02-20"
    },
    {
      id: "4",
      content: "Built a task management app with real-time collaboration features",
      category: "projects",
      createdAt: "2024-02-10"
    },
    {
      id: "5",
      content: "Developed an e-commerce platform with payment integration",
      category: "projects",
      createdAt: "2023-12-05"
    },
    {
      id: "6",
      content: "Created a data visualization dashboard using D3.js and React",
      category: "projects",
      createdAt: "2024-01-25"
    },
    {
      id: "7",
      content: "Bachelor of Science in Computer Science, University of Technology",
      category: "education",
      createdAt: "2023-06-20"
    },
    {
      id: "8",
      content: "Master of Science in Software Engineering, Tech Institute",
      category: "education",
      createdAt: "2021-05-15"
    },
    {
      id: "9",
      content: "Relevant coursework: Data Structures, Algorithms, Software Engineering",
      category: "education",
      createdAt: "2023-08-10"
    },
    {
      id: "10",
      content: "Programming Languages: JavaScript, TypeScript, Python, Java",
      category: "skills",
      createdAt: "2024-01-01"
    },
    {
      id: "11",
      content: "Frameworks: React, Next.js, Node.js, Express",
      category: "skills",
      createdAt: "2024-01-02"
    },
    {
      id: "12",
      content: "Tools: Git, Docker, AWS, Kubernetes",
      category: "skills",
      createdAt: "2024-01-03"
    },
    {
      id: "13",
      content: "AWS Certified Solutions Architect - Associate",
      category: "certifications",
      createdAt: "2023-11-05"
    },
    {
      id: "14",
      content: "Google Cloud Professional Cloud Architect",
      category: "certifications",
      createdAt: "2024-02-15"
    },
    {
      id: "15",
      content: "Certified Kubernetes Administrator (CKA)",
      category: "certifications",
      createdAt: "2023-09-20"
    },
    {
      id: "16",
      content: "Volunteer mentor for coding bootcamp students",
      category: "other",
      createdAt: "2024-03-10"
    },
    {
      id: "17",
      content: "Open source contributor to multiple React libraries",
      category: "other",
      createdAt: "2023-12-01"
    },
    {
      id: "18",
      content: "Published technical blog posts on software architecture",
      category: "other",
      createdAt: "2024-01-30"
    }
  ])

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
        <Button asChild>
          <Link href="/bullets/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Bullet
          </Link>
        </Button>
      </div>

      {!hasAnyBullets ? (
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
                          {bullet.content}
                        </CardTitle>
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
                            onClick={() => {
                              // TODO: Implement delete functionality with backend API
                              console.log("Delete bullet:", bullet.id)
                            }}
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
    </div>
  )
}
