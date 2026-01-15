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
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 via-background to-background" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_50%)]" />
          <div className="text-center max-w-4xl mx-auto relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-8 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Save hours building CVs. Build once, customize forever.
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                ResuMe
              </span>
              <span className="block text-3xl lg:text-5xl text-muted-foreground mt-3 font-normal">
                CV & Achievement Manager
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Stop recreating your CV from scratch. Store all your achievements in one place, 
              then build tailored CVs in minutes instead of hours. Perfect for students, freelancers, 
              and professionals who value their time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-2 hover:bg-accent transition-colors">
                <Link href="/auth/login">Log In</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span>Free to start</span>
              </div>
            </div>
          </div>
        </section>

        {/* Perfect For Section */}
        <section className="bg-muted/30 py-20 -mx-5 px-5 w-screen relative left-1/2 right-1/2 -translate-x-1/2 border-y border-border/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Perfect For
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're starting your career or advancing it, ResuMe adapts to your needs
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Preparing for applications and keeping track of your academic achievements
                  </p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Freelancers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Showcasing projects and building tailored CVs for different clients
                  </p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Professionals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Maintaining a central career record and managing multiple CV versions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Powerful features to help you manage your professional achievements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                  <List className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Centralized Bullet Bank</CardTitle>
                <CardDescription>
                  Organize achievements by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary/70" />
                    Education
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary/70" />
                    Experience
                  </li>
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary/70" />
                    Projects
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary/70" />
                    Certifications
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">CV Builder</CardTitle>
                <CardDescription>
                  Select bullets per section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Build multiple CV versions by selecting the most relevant bullets for each application
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Preview CVs</CardTitle>
                <CardDescription>
                  Review before exporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Preview your CV to ensure everything looks perfect before exporting
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">PDF Export</CardTitle>
                <CardDescription>
                  Export professional PDFs instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Generate and download professional PDF documents with one click
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Search & Filter</CardTitle>
                <CardDescription>
                  Find bullets quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Search and filter bullets by category to find exactly what you need
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Modern UI</CardTitle>
                <CardDescription>
                  Beautiful, responsive design
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Minimalist, modern interface built with Shadcn UI components
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-primary text-primary-foreground py-24 -mx-5 px-5 w-screen left-1/2 right-1/2 -translate-x-1/2 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl lg:text-2xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Join ResuMe today and take control of your professional achievements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/auth/sign-up">Sign Up Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                <Link href="/auth/login">Log In</Link>
              </Button>
            </div>
          </div>
        </section>
    </>
  )
}
