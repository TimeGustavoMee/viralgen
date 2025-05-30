"use client"

import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"

export function GuaranteeSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border-2 border-primary/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="md:w-1/4 flex justify-center">
              <ShieldCheck className="h-32 w-32 text-secondary" />
            </div>
            <div className="md:w-3/4 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4">7-Day "Double Your Engagement" Guarantee</h3>
              <p className="text-lg mb-4">
                If you don't see a <span className="font-bold">significant increase in your engagement</span> within 7
                days of using ViralGen, we'll refund 100% of your money. No questions asked.
              </p>
              <p className="text-muted-foreground">
                We're so confident in our AI that we're taking all the risk. You have nothing to lose and everything to
                gain.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
