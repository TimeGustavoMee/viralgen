"use client"

import { motion } from "framer-motion"
import { Sparkles, Zap, Target, Clock, Palette, Award } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "100% Done-For-You Viral Content",
      description: "Just click and get 20 viral-ready content ideas every week, tailored to your exact business.",
      color: "border-primary/20 bg-muted hover:border-primary/30",
    },
    {
      icon: <Zap className="h-10 w-10 text-secondary" />,
      title: "Up to 100 Content Pieces Weekly",
      description: "Generate enough viral content to dominate your niche and leave competitors in the dust.",
      color: "border-secondary/20 bg-muted hover:border-secondary/30",
    },
    {
      icon: <Target className="h-10 w-10 text-tertiary" />,
      title: "Works for ANY Business Type",
      description: "Pizza shop, barbershop, dentist, gym, bakery — our AI creates viral content for every niche.",
      color: "border-tertiary/20 bg-muted hover:border-tertiary/30",
    },
    {
      icon: <Clock className="h-10 w-10 text-accent" />,
      title: "Save 10+ Hours Every Week",
      description:
        "No more staring at a blank screen. Get instant ideas that would take a marketing team days to create.",
      color: "border-accent/20 bg-muted hover:border-accent/30",
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: "No Writing Skills Needed",
      description: "Just copy, paste, and post. Our AI does all the creative work so you don't have to.",
      color: "border-primary/20 bg-muted hover:border-primary/30",
    },
    {
      icon: <Award className="h-10 w-10 text-secondary" />,
      title: "Double Your Engagement — Guaranteed",
      description: "See your engagement skyrocket in 7 days or get your money back. No questions asked.",
      color: "border-secondary/20 bg-muted hover:border-secondary/30",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="benefits" className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span>WHY BUSINESSES LOVE VIRALGEN</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stop Being{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Invisible Online
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your competitors are already using AI. Don't get left behind.
          </motion.p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-2xl border-2 ${benefit.color} transition-all duration-300 hover:shadow-lg`}
              variants={itemVariants}
            >
              <div className="mb-4 p-3 rounded-full inline-block bg-card shadow-sm">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
