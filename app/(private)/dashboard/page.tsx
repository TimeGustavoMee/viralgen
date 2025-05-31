"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Crown, TrendingUp, Star, Users, MessageSquare, Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          className="text-3xl font-bold mb-2 flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="h-6 w-6 text-secondary" />
          Welcome to ViralGen
        </motion.h1>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Generate viral content ideas in seconds with AI.
        </motion.p>
      </div>

      <motion.div
        className="grid gap-6 md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden card-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-secondary" />
              Credits Available
            </CardTitle>
            <CardDescription>You have 1 credit remaining this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={20} className="h-2 bg-muted [&>div]:bg-secondary" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>1/2 credits used</div>
                <div>Resets in 5 days</div>
              </div>
              <Button
                className="w-full rounded-full btn-bounce bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                asChild
              >
                <Link href="/dashboard/billing">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Pro (10 credits/week)
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden card-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Stats
            </CardTitle>
            <CardDescription>Your content generation activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Ideas Generated
                </p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Favorites
                </p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-tertiary/5 border border-tertiary/10">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Profile Completion
                </p>
                <p className="text-2xl font-bold">60%</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-accent/5 border border-accent/10">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Account Type
                </p>
                <p className="text-2xl font-bold">Free</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden card-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-secondary" />
              Generate Content
            </CardTitle>
            <CardDescription>Create viral content ideas with AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Use our AI to generate viral content ideas tailored to your business. Get started with a simple prompt.
            </p>
            <Button
              className="w-full rounded-full btn-bounce bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              asChild
            >
              <Link href="/dashboard/chat">
                <Sparkles className="mr-2 h-4 w-4" />
                Chat with AI
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden card-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-secondary" />
              Saved Ideas
            </CardTitle>
            <CardDescription>Access your favorite content ideas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              View and manage your saved content ideas. You have 2 favorites saved.
            </p>
            <Button
              className="w-full rounded-full btn-bounce bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              asChild
            >
              <Link href="/dashboard/favorites">
                <Heart className="mr-2 h-4 w-4" />
                View Favorites
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
