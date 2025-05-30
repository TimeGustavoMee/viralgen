"use client"

import { motion } from "framer-motion"
import { X, CheckCircle2 } from "lucide-react"

export function PainPointsSection() {
  const painPoints = [
    "Spending thousands on ads with no results",
    "Posting content that gets zero engagement",
    "Wasting hours trying to figure out what works",
    "Watching competitors go viral while you struggle",
    "Feeling lost in the algorithm changes",
  ]

  const solutions = [
    "AI-generated viral content ideas in seconds",
    "Proven formats that drive massive engagement",
    "Save 10+ hours per week on content planning",
    "Outperform competitors with algorithm-optimized content",
    "Stay ahead with constantly updated viral strategies",
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Stop the{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">Frustration</span>{" "}
            of Failed Content
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Most small businesses waste time and money on content that goes nowhere. ViralGen changes everything.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            className="bg-muted rounded-2xl p-6 border-2 border-destructive/30"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-6 text-destructive flex items-center gap-2">
              <X className="h-5 w-5" />
              WITHOUT VIRALGEN
            </h3>
            <ul className="space-y-4">
              {painPoints.map((point, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <X className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="bg-muted rounded-2xl p-6 border-2 border-secondary/30"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-6 text-secondary flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              WITH VIRALGEN
            </h3>
            <ul className="space-y-4">
              {solutions.map((solution, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{solution}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
