import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-semibold mb-2">404</CardTitle>
          <CardDescription className="text-lg">
            Page not found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            The page you are looking for does not exist.
          </p>
          <Button asChild className="w-full">
            <Link href="/">Go to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
