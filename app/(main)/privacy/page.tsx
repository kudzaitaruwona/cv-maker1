import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Important: Plain-language, GDPR-friendly transparency without legal jargon.
const LAST_UPDATED = "January 20, 2026"

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </div>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Quick summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            We collect the information we need to run the service: your account details, the CV content you enter, and
            minimal usage data required for core functionality.
          </p>
          <p>
            Payments are processed by Stripe. We do not store your card details.
          </p>
          <p>
            If you use AI-assisted features, your CV content is temporarily processed to generate suggestions and an ATS
            compatibility score. Your content is not used to train AI models.
          </p>
          <p>
            We do not sell your data, we do not run ads, and we do not track you for marketing.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">What we collect</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4 text-sm leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-semibold">Account information</h2>
            <p className="text-muted-foreground">
              Email address and basic profile information you provide (such as your name).
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">CV content</h2>
            <p className="text-muted-foreground">
              The content you enter into the app (for example: experience, education, skills, achievements, and other CV
              text).
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Payment data (Stripe)</h2>
            <p className="text-muted-foreground">
              Payment processing is handled by Stripe. We receive payment status and subscription information (for
              example: active, cancelled, plan type). We do not store your full card number or CVC.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Minimal usage data</h2>
            <p className="text-muted-foreground">
              Basic technical data needed to keep the app working (for example: authentication/session data, feature
              access, and error logs). We do not use this for marketing tracking.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Why we collect it</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <ul className="list-disc pl-5 space-y-2">
            <li>To create and manage your account</li>
            <li>To save, edit, and export your CVs</li>
            <li>To provide AI suggestions and an ATS compatibility score (only when you use those features)</li>
            <li>To process payments and manage subscriptions via Stripe</li>
            <li>To keep the service secure and reliable (for example: preventing abuse and diagnosing errors)</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">AI-assisted features</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          {/* Clear disclosure: CV content is processed to deliver the feature, not for training. */}
          <p>
            When you request AI suggestions or an ATS compatibility score, we send the relevant CV content to an AI
            provider to process your request.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We use AI only to generate improvement suggestions and an ATS compatibility score.</li>
            <li>Your CV content is processed only to provide the feature.</li>
            <li>Your CV content is not used to train AI models.</li>
          </ul>
          <p>
            If you prefer not to use AI, you can continue using the CV builder without AI-assisted features.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">What we do not do</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <ul className="list-disc pl-5 space-y-2">
            <li>We do not sell your personal data.</li>
            <li>We do not run ads.</li>
            <li>We do not track you for marketing purposes.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Third-party services</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4 text-sm leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-semibold">Stripe</h2>
            <p className="text-muted-foreground">Used to process payments and manage subscriptions.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-semibold">Hosting provider</h2>
            <p className="text-muted-foreground">
              Used to host the app and store data needed to run the service.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-semibold">AI provider</h2>
            <p className="text-muted-foreground">
              Used only to process CV content for AI suggestions and ATS scoring when you request those features.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Data retention & security</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            We keep your account and CV data for as long as you maintain an account so you can use the service. If you
            delete your account, we will delete or anonymize your data within a reasonable period (unless we are required
            to keep certain records for legal or accounting reasons).
          </p>
          <p>
            We use reasonable security measures to protect your data, but no online service can guarantee absolute
            security.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 shadow">
        <CardHeader className="p-6 space-y-1.5">
          <CardTitle className="text-2xl font-semibold">Your rights & choices</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <ul className="list-disc pl-5 space-y-2">
            <li>You can access and update your account information.</li>
            <li>You can request a copy of your data.</li>
            <li>You can request deletion of your account and associated data.</li>
            <li>You can choose not to use AI-assisted features.</li>
          </ul>
          <p>
            If you are in the EEA/UK, you may have additional rights under GDPR. We aim to honor these rights for all
            users where applicable.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

