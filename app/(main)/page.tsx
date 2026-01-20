import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { FileText, List, Download, Sparkles, ShieldCheck, CreditCard } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-16 py-12">
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          No ads • No data selling • Payments via Stripe
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Build Better CVs Faster</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Store all your achievements in one place, get AI-powered suggestions when you want them, and export a clean
            CV in minutes.
          </p>
        </div>

        <div className="pt-2">
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline underline-offset-4">
            Log in
          </Link>
        </p>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Everything you need to ship a strong CV</h2>
          <p className="text-sm text-muted-foreground">
            Simple workflow, clear structure, and optional AI assistance—without the bloat.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-xl border-2 shadow">
            <CardHeader className="p-6 space-y-1.5">
              <CardTitle>Centralized Storage</CardTitle>
              <CardDescription>Organize achievements by category</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
              <List className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep education, experience, projects, skills, and certifications in one place so you never lose a great
                bullet again.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 shadow">
            <CardHeader className="p-6 space-y-1.5">
              <CardTitle>CV Builder</CardTitle>
              <CardDescription>Build tailored versions quickly</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Select the most relevant bullets for a role and generate focused CV versions for different job targets.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 shadow">
            <CardHeader className="p-6 space-y-1.5">
              <CardTitle>Export Ready</CardTitle>
              <CardDescription>Download clean outputs</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
              <Download className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Export a polished CV you can submit immediately—no messy formatting or last-minute copy/paste chaos.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <p className="text-sm text-muted-foreground">A simple flow you can finish in one sitting.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-xl border-2 shadow">
            <CardHeader className="p-6 space-y-1.5">
              <CardTitle className="text-xl">1. Add bullets</CardTitle>
              <CardDescription>Capture achievements as you go</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
              Save accomplishments with a short title and a clear description—grouped by category for easy reuse.
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 shadow">
            <CardHeader className="p-6 space-y-1.5">
              <CardTitle className="text-xl">2. Improve with AI (optional)</CardTitle>
              <CardDescription>Suggestions + ATS scoring</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
              Use AI to generate improvement suggestions and an ATS compatibility score. You always stay in control of
              what goes into your final CV.
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 shadow">
            <CardHeader className="p-6 space-y-1.5">
              <CardTitle className="text-xl">3. Export</CardTitle>
              <CardDescription>Ready to submit</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
              Export your CV when it’s ready. Keep multiple versions so you can apply faster without rewriting
              everything.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Privacy-first, by default</h2>
          <p className="text-sm text-muted-foreground">Clear rules. No surprises.</p>
        </div>

        <Card className="rounded-xl border-2 shadow">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">AI is optional and purpose-limited</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you use AI features, relevant CV content is processed to generate suggestions and an ATS score. Your
                  data is not used to train AI models.
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link href="/privacy" className="text-primary hover:underline underline-offset-4">
                    Read Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-primary hover:underline underline-offset-4">
                    Read Terms
                  </Link>
                </div>
              </div>

              <Separator className="md:hidden" />

              <div className="space-y-2 md:max-w-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Payments handled by Stripe</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We don’t store your card details. Stripe processes payments and subscriptions securely.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Pricing (simple)</h2>
          <p className="text-sm text-muted-foreground">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-xl border-2 shadow">
            <CardHeader className="p-6 space-y-1.5">
              <CardTitle>Free</CardTitle>
              <CardDescription>For getting started</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
              <ul className="list-disc pl-5 space-y-2">
                <li>Save and organize bullets</li>
                <li>Create CV drafts</li>
                <li>Basic exports</li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Plan details may change as we improve the product.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-2 shadow">
            <CardHeader className="p-6 space-y-1.5">
              <CardTitle>Pro</CardTitle>
              <CardDescription>For serious job hunting</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
              <ul className="list-disc pl-5 space-y-2">
                <li>AI improvement suggestions (optional)</li>
                <li>ATS compatibility scoring</li>
                <li>More exports and versions</li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Billing and subscriptions are handled via Stripe.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <p className="text-sm text-muted-foreground">Quick answers before you start.</p>
        </div>

        <Card className="rounded-xl border-2 shadow">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ai">
                <AccordionTrigger>Do you train AI models on my CV content?</AccordionTrigger>
                <AccordionContent>
                  No. If you use AI features, your CV content is processed only to generate suggestions and an ATS score.
                  It is not used to train AI models.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ads">
                <AccordionTrigger>Do you show ads or sell my data?</AccordionTrigger>
                <AccordionContent>
                  No ads, no selling of personal data, and no marketing tracking.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment">
                <AccordionTrigger>How do payments work?</AccordionTrigger>
                <AccordionContent>
                  Payments and subscriptions are handled by Stripe. We don’t store your card details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="outcomes">
                <AccordionTrigger>Do you guarantee job offers?</AccordionTrigger>
                <AccordionContent>
                  No. We help you create a stronger CV, but hiring outcomes depend on many factors outside our control.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
