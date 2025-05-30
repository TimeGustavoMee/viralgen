"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Zap } from "lucide-react"

export function FinalCtaSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted to-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <Zap className="h-4 w-4" />
            <span>LIMITED TIME OFFER</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Stop Wasting Time and Money on Content That Doesn't Work
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Join <span className="font-bold">3,700+ businesses</span> already using ViralGen to dominate their social
            media.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="text-lg px-8 py-7 rounded-full bg-secondary hover:bg-secondary/90 group shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 transition-all duration-300 font-bold text-secondary-foreground"
              asChild
            >
              <Link href="/register">
                GET STARTED NOW — JUST R$39,90/MONTH
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">7-day money-back guarantee. Cancel anytime. No risk.</p>
        </motion.div>
      </div>
    </section>
  )
}
