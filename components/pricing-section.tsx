"use client"

import Link from "next/link"
import { CheckCircle2, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export function PricingSection() {
  const plans = [
    {
      name: "Free Trial",
      description: "Try before you buy",
      price: "R$0",
      period: "7 days",
      features: ["2 viral content ideas per week", "Basic content formats", "Save favorites", "Email support"],
      cta: "Start Free Trial",
      href: "/register",
      highlighted: false,
      color: "border-border",
      buttonClass: "bg-muted hover:bg-muted/90 text-foreground",
    },
    {
      name: "Pro Plan",
      description: "Most popular",
      price: "R$39,90",
      period: "per month",
      features: [
        "10 credits per week (10 ideas)",
        "All viral content formats",
        "Algorithm-optimized suggestions",
        "Save unlimited favorites",
        "Priority support",
        "Custom brand voice",
        "7-day money-back guarantee",
      ],
      cta: "Get Started Now",
      href: "/register?plan=pro",
      highlighted: true,
      color: "border-secondary shadow-lg relative overflow-hidden",
      buttonClass: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
      badge: "BEST VALUE",
    },
    {
      name: "Business Plan",
      description: "For growing businesses",
      price: "R$99,90",
      period: "per month",
      features: [
        "30 credits per week (30 ideas)",
        "All Pro features",
        "Team collaboration",
        "Advanced analytics",
        "Priority support",
        "Custom brand voice",
        "7-day money-back guarantee",
      ],
      cta: "Upgrade to Business",
      href: "/register?plan=business",
      highlighted: false,
      color: "border-primary/20",
      buttonClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
    },
    {
      name: "Enterprise Plan",
      description: "For agencies & large teams",
      price: "R$499,90",
      period: "per month",
      features: [
        "500 credits per week (500 ideas)",
        "All Business features",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options",
        "API access",
        "Custom contracts available",
      ],
      cta: "Contact Sales",
      href: "/register?plan=enterprise",
      highlighted: false,
      color: "border-tertiary/20",
      buttonClass: "bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground",
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-background to-muted relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-40 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-40 left-0 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span>AFFORDABLE PRICING</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Less Than{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              R$1,33 Per Day
            </span>{" "}
            for Viral Content
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Cheaper than a coffee, more valuable than a marketing agency.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className={`h-full border-2 rounded-2xl ${plan.color} transition-all duration-300 hover:shadow-xl`}>
                {plan.badge && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-secondary text-secondary-foreground text-xs font-bold px-4 py-1 transform rotate-45 translate-x-12 translate-y-6 shadow-sm">
                      {plan.badge}
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {plan.highlighted && <Zap className="h-5 w-5 text-secondary" />}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className={`w-full rounded-full text-lg py-6 font-bold ${plan.buttonClass}`} asChild>
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p>No contracts. Cancel anytime. All plans include our core platform features.</p>
        </motion.div>
      </div>
    </section>
  )
}
