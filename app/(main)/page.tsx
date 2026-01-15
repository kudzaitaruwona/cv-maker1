import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  List, 
  FileCheck, 
  Download, 
  Search, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Award 
} from "lucide-react"

export default function Home() {
  return (
    <>
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              ResuMe
              <span className="block text-3xl lg:text-4xl text-muted-foreground mt-2">
                CV & Achievement Manager
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Store, organize, and export your professional achievements. Keep all your work experience, 
              education, projects, and certifications in one central place. Build multiple CV versions 
              and export professional PDFs instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/auth/login">Log In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Perfect For Section */}
        <section className="bg-muted/50 py-16 -mx-5 px-5 w-screen relative left-1/2 right-1/2 -translate-x-1/2">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Perfect For
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Preparing for applications and keeping track of your academic achievements
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Freelancers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Showcasing projects and building tailored CVs for different clients
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Professionals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Maintaining a central career record and managing multiple CV versions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you manage your professional achievements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <List className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Centralized Bullet Bank</CardTitle>
                <CardDescription>
                  Organize achievements by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Experience
                  </li>
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Projects
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certifications
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>CV Builder</CardTitle>
                <CardDescription>
                  Select bullets per section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build multiple CV versions by selecting the most relevant bullets for each application
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Preview CVs</CardTitle>
                <CardDescription>
                  Review before exporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Preview your CV to ensure everything looks perfect before exporting
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>PDF Export</CardTitle>
                <CardDescription>
                  Export professional PDFs instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate and download professional PDF documents with one click
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Search & Filter</CardTitle>
                <CardDescription>
                  Find bullets quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Search and filter bullets by category to find exactly what you need
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Modern UI</CardTitle>
                <CardDescription>
                  Beautiful, responsive design
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Minimalist, modern interface built with Shadcn UI components
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-20 -mx-5 px-5 w-screen relative left-1/2 right-1/2 -translate-x-1/2">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Join ResuMe today and take control of your professional achievements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link href="/auth/sign-up">Sign Up Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/auth/login">Log In</Link>
              </Button>
            </div>
          </div>
        </section>
    </>
  )
}
