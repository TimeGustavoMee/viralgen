import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <div className="container flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-md border-2 border-primary/20 rounded-xl shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ViralGen
              </span>
            </Link>
            <CardTitle className="text-2xl font-bold">Start Your Free Trial</CardTitle>
            <CardDescription>Create your account and start generating viral content in seconds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  required
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  required
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
              />
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <p>
                By signing up, you agree to our Terms of Service and Privacy Policy. You'll get a 7-day free trial with
                full access to all features.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full rounded-full bg-secondary hover:bg-secondary/90 py-6 text-lg font-bold text-secondary-foreground"
              asChild
            >
              <Link href="/dashboard">Start Free Trial</Link>
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
