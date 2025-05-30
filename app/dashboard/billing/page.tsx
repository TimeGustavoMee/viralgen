"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Crown, CreditCard } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleUpgrade = () => {
    if (!selectedPlan) {
      toast({
        title: "No plan selected",
        description: "Please select a plan to continue.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Subscription updated",
        description: `You have successfully upgraded to the ${selectedPlan} plan.`,
      })
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and payment methods.</p>
      </div>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-full p-1 bg-muted">
          <TabsTrigger value="subscription" className="rounded-full data-[state=active]:bg-background">
            Subscription
          </TabsTrigger>
          <TabsTrigger value="payment" className="rounded-full data-[state=active]:bg-background">
            Payment Methods
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="mt-6 space-y-6">
          <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-secondary" />
                Current Plan
              </CardTitle>
              <CardDescription>You are currently on the Free plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Credits used this week</span>
                  <span>1/2</span>
                </div>
                <Progress value={50} className="h-2 bg-muted [&>div]:bg-secondary" />
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Your credits will reset in 5 days. Upgrade to Pro to get more credits and features.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className={`border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                selectedPlan === "pro" ? "border-secondary shadow-lg" : "border-primary/20"
              }`}
              onClick={() => setSelectedPlan("pro")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Pro Plan</CardTitle>
                  {selectedPlan === "pro" && (
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <CardDescription>Most popular</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">R$39,90</span>
                  <span className="text-muted-foreground ml-2">per month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>10 credits per week (10 ideas)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>All viral content formats</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>Algorithm-optimized suggestions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>Save unlimited favorites</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className={`border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                selectedPlan === "business" ? "border-secondary shadow-lg" : "border-primary/20"
              }`}
              onClick={() => setSelectedPlan("business")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Business</CardTitle>
                  {selectedPlan === "business" && (
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <CardDescription>For growing businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">R$99,90</span>
                  <span className="text-muted-foreground ml-2">per month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>30 credits per week (30 ideas)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>All Pro features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className={`border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                selectedPlan === "enterprise" ? "border-secondary shadow-lg" : "border-primary/20"
              }`}
              onClick={() => setSelectedPlan("enterprise")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  {selectedPlan === "enterprise" && (
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <CardDescription>For agencies & large teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">R$499,90</span>
                  <span className="text-muted-foreground ml-2">per month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>500 credits per week (500 ideas)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>All Business features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>API access</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className={`border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                selectedPlan === "custom" ? "border-secondary shadow-lg" : "border-primary/20"
              }`}
              onClick={() => setSelectedPlan("custom")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Custom</CardTitle>
                  {selectedPlan === "custom" && (
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <CardDescription>For special requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">Contact</span>
                  <span className="text-muted-foreground ml-2">for pricing</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>500+ credits per week</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>Custom API integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>White-label solutions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>Custom contracts available</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8"
              onClick={handleUpgrade}
              disabled={isLoading || !selectedPlan}
            >
              {isLoading ? "Processing..." : "Upgrade Now"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-secondary" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your payment methods and billing information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="inline-block p-4 rounded-full bg-secondary/10 mb-4">
                  <CreditCard className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Payment Methods</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't added any payment methods yet. Add a payment method to upgrade your plan.
                </p>
                <Button className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
