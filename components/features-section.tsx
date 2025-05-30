"use client"

import { Sparkles, Zap, Target, Clock, Palette, Award } from "lucide-react"
import { motion } from "framer-motion"

export function FeaturesSection() {
  const features = [
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "AI-Powered Ideas",
      description: "Our advanced AI analyzes viral trends to generate content ideas with high engagement potential.",
      color: "border-primary/20 bg-primary/5 hover:border-primary/30 hover:bg-primary/10",
    },
    {
      icon: <Zap className="h-10 w-10 text-secondary" />,
      title: "Lightning Fast",
      description: "Get 5 viral content ideas in seconds, not hours. Save time and focus on creating.",
      color: "border-secondary/20 bg-secondary/5 hover:border-secondary/30 hover:bg-secondary/10",
    },
    {
      icon: <Target className="h-10 w-10 text-tertiary" />,
      title: "Niche Targeted",
      description: "Content ideas tailored to your specific industry, audience, and brand voice.",
      color: "border-tertiary/20 bg-tertiary/5 hover:border-tertiary/30 hover:bg-tertiary/10",
    },
    {
      icon: <Clock className="h-10 w-10 text-accent" />,
      title: "Weekly Credits",
      description: "Fresh ideas every week to keep your content calendar full and engaging.",
      color: "border-accent/20 bg-accent/5 hover:border-accent/30 hover:bg-accent/10",
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: "Customizable",
      description: "Adjust tone, style, and format to match your unique brand personality.",
      color: "border-primary/20 bg-primary/5 hover:border-primary/30 hover:bg-primary/10",
    },
    {
      icon: <Award className="h-10 w-10 text-secondary" />,
      title: "Proven Results",
      description: "Content ideas designed to increase followers, engagement, and conversions.",
      color: "border-secondary/20 bg-secondary/5 hover:border-secondary/30 hover:bg-secondary/10",
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
    <section id="features" className="py-20 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span>Supercharge your content</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Features That Make Content Creation{" "}
            <span className="bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">
              Effortless
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to generate viral-worthy content ideas in one simple platform.
          </motion.p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-2xl border-2 ${feature.color} card-lift transition-all duration-300`}
              variants={itemVariants}
            >
              <div className="mb-4 p-3 rounded-full inline-block bg-white shadow-sm">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
