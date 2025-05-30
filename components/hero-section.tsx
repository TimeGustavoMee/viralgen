"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Clock, Zap } from "lucide-react"
import CountUp from "react-countup"

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background to-background/80">
      {/* Background elements */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-20 left-[10%] w-64 h-64 rounded-full bg-secondary/20 blur-3xl" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-bold mb-6"
          >
            <Zap className="h-4 w-4" />
            <span>STOP WASTING MONEY ON ADS THAT DON'T WORK</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Let AI{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explode Your Social Media
            </span>{" "}
            — for Just R$39,90
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="font-bold">20 EXTREME viral content ideas every week.</span> No guesswork. No copywriting.
            No time wasted.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="text-lg px-8 rounded-full bg-secondary hover:bg-secondary/90 group shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 transition-all duration-300 text-secondary-foreground"
              asChild
            >
              <Link href="/register">
                START CREATING VIRAL CONTENT NOW
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 text-sm font-medium text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-secondary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-secondary" />
              <span>7-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>Setup in 60 seconds</span>
            </div>
          </motion.div>
        </div>

        {/* Social proof */}
        <motion.div
          className="mt-12 bg-muted backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-border"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-secondary mb-1">
                <CountUp end={3712} duration={2.5} separator="," />+
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-1">
                <CountUp end={287} duration={2.5} separator="," />%
              </div>
              <div className="text-sm text-muted-foreground">Avg. Engagement Boost</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-1">
                <CountUp end={100} duration={2.5} separator="," />
                K+
              </div>
              <div className="text-sm text-muted-foreground">Ideas Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-1">
                <CountUp end={97} duration={2.5} separator="," />%
              </div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          className="mt-16 relative mx-auto max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-border">
            <Image
              src="/dashboard-preview.png"
              alt="ViralGen dashboard preview"
              className="w-full h-full object-cover"
              width={1200}
              height={675}
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/dashboard-preview.png"
              }}
            />
          </div>

          {/* Testimonial bubble */}
          <motion.div
            className="absolute -bottom-6 -right-6 bg-card rounded-xl shadow-lg p-4 max-w-xs border-2 border-primary/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <Image
                src="/testimonial-avatar.jpg"
                alt="Customer"
                className="w-10 h-10 rounded-full object-cover"
                width={40}
                height={40}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/diverse-group.png"
                }}
              />
              <div>
                <p className="text-sm font-medium mb-1">
                  "My engagement went up 312% in just 2 weeks. This is insane!"
                </p>
                <p className="text-xs text-muted-foreground">— Maria S., Bakery Owner</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
