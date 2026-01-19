import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, List, Download } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center py-24 px-5">
      <section className="max-w-3xl mx-auto text-center space-y-8 mb-24">
        <h1 className="text-4xl md:text-5xl font-bold">
          Build Better CVs Faster
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Store all your achievements in one place and build tailored CVs in minutes.
        </p>
        <div className="pt-4">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Centralized Storage</CardTitle>
              <CardDescription>
                Organize all your achievements by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <List className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Keep education, experience, projects, and certifications in one place.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CV Builder</CardTitle>
              <CardDescription>
                Select bullets to create custom CVs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileText className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Build multiple CV versions by selecting the most relevant achievements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PDF Export</CardTitle>
              <CardDescription>
                Export professional documents instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Download className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Generate and download professional PDF documents with one click.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
