import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Important: Simple, human terms that set expectations for payments + AI features.
const LAST_UPDATED = "January 20, 2026"

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </div>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">The service</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Resumaide is a CV builder that lets you create, save, and export CVs. We also offer optional AI-assisted
            features to generate improvement suggestions and an ATS compatibility score.
          </p>
          <p>
            By using the service, you agree to these Terms.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Your content</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <ul className="list-disc pl-5 space-y-2">
            <li>You own the CV content you create and upload.</li>
            <li>You are responsible for the final version of your CV and anything you submit to employers.</li>
            <li>
              AI suggestions are guidance only. They may be incomplete or wrong, and should be reviewed before use.
            </li>
            <li>We do not guarantee interviews, job offers, or employment outcomes.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">AI-assisted features</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          {/* Clear rules: what AI is for, and what we don't do with user content. */}
          <ul className="list-disc pl-5 space-y-2">
            <li>AI is used only to generate improvement suggestions and an ATS compatibility score.</li>
            <li>To provide these features, we may process the relevant CV content with an AI provider.</li>
            <li>Your CV content is not used to train AI models.</li>
            <li>You can use the CV builder without AI-assisted features.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Payments, subscriptions, and refunds</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Billing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Paid plans are billed through Stripe using the pricing shown at checkout.</li>
              <li>Subscriptions renew automatically each billing cycle until you cancel.</li>
              <li>Taxes may apply depending on your location and will be shown where required.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Cancellation</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You can cancel your subscription at any time from your account settings (or via support).</li>
              <li>
                After cancellation, you will keep access to paid features until the end of your current billing period.
              </li>
              <li>We do not charge a cancellation fee.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Refunds</h2>
            <p>
              Unless required by law, payments are non-refundable. If you believe there was a billing mistake (for
              example: duplicate charge), contact support and we’ll investigate.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Plan changes</h2>
            <p>
              If you upgrade or downgrade, the change and any proration (if applicable) will be handled by Stripe and
              shown during the change.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Acceptable use</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Please don’t:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the service for unlawful purposes</li>
            <li>Attempt to break, overload, or bypass security features</li>
            <li>Upload content you don’t have the right to use</li>
            <li>Abuse or harass others (including support)</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Account suspension or termination</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            We may suspend or terminate accounts that violate these Terms or create risk for the service, other users,
            or third parties. When reasonable, we’ll provide notice and an opportunity to fix the issue.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Limitation of liability</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            We provide the service “as is” and “as available”. To the extent permitted by law, Resumaide is not liable for
            indirect, incidental, special, or consequential damages, or loss of profits, data, or goodwill.
          </p>
          <p>
            We are not responsible for hiring decisions or outcomes. Your use of the service is at your own discretion.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Changes to these terms</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            We may update these Terms from time to time. If changes are significant, we’ll take reasonable steps to
            notify you (for example: in-app notice).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

