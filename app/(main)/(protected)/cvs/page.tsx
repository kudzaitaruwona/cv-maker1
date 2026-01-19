"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, PlusCircle } from "lucide-react"
import Link from "next/link"

interface CVSection {
  title: string
  items: string[]
}

export default function CVPage() {
  // TODO: Replace with actual API call to fetch CV data from backend
  const cvData: CVSection[] = [
    {
      title: "Education",
      items: [
        "Bachelor of Science in Computer Science, University of Technology, 2020-2024",
        "Relevant coursework: Data Structures, Algorithms, Software Engineering"
      ]
    },
    {
      title: "Experience",
      items: [
        "Software Engineer at Tech Corp, 2022-Present",
        "Developed and maintained web applications using React and TypeScript",
        "Led a team of 5 developers to deliver a major product feature on time"
      ]
    },
    {
      title: "Skills",
      items: [
        "Programming Languages: JavaScript, TypeScript, Python, Java",
        "Frameworks: React, Next.js, Node.js",
        "Tools: Git, Docker, AWS"
      ]
    },
    {
      title: "Projects",
      items: [
        "Built a task management app with real-time collaboration features",
        "Developed an e-commerce platform with payment integration"
      ]
    },
    {
      title: "Certifications",
      items: [
        "AWS Certified Solutions Architect - Associate, 2023",
        "Google Cloud Professional Cloud Architect, 2024"
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">CV Preview</h1>
          <p className="text-muted-foreground">
            Review your curriculum vitae
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/cvs/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New CV
            </Link>
          </Button>
          <Button
            onClick={() => {
              // TODO: Implement PDF download functionality
              console.log("Download PDF")
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {cvData.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Export or edit your CV
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="w-full sm:w-auto"
            onClick={() => {
              // TODO: Implement CV export functionality
              console.log("Export CV")
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CV
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/cvs/edit">Edit CV</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
