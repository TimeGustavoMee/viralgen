"use client"

import { Check, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Mascot } from "@/components/mascot"

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Fill Your Preferences Once",
      description:
        "Set up your business details, niche, target audience, and tone of voice to personalize all future content ideas.",
      image: "/preferences-screen.png",
      mascotEmotion: "thinking",
      mascotMessage: "Tell me about your brand!",
    },
    {
      number: "02",
      title: "Ask the AI for Content",
      description:
        'Simply type what you need: format, niche, and volume. For example: "10 Instagram carousel ideas for a fitness coach".',
      image: "/chat-screen.png",
      mascotEmotion: "happy",
      mascotMessage: "What content do you need today?",
    },
    {
      number: "03",
      title: "Get Instant Viral Ideas",
      description:
        "Receive 5 high-quality, engagement-focused content ideas per credit, ready to implement in your content strategy.",
      image: "/results-screen.png",
      mascotEmotion: "celebrating",
      mascotMessage: "Your viral ideas are ready!",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
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
            <span>Simple as 1-2-3</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            How ViralGen{" "}
            <span className="bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">
              Works
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Three simple steps to transform your content strategy and go viral.
          </motion.p>
        </div>

        <div className="space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex-1">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                  Step {step.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h3>
                <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                <ul className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <motion.li
                      key={item}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * item }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-muted-foreground">
                        {index === 0 && item === 1 && "Save time with auto-saved preferences"}
                        {index === 0 && item === 2 && "Update anytime as your brand evolves"}
                        {index === 0 && item === 3 && "Personalized results based on your inputs"}

                        {index === 1 && item === 1 && "Simple, conversational interface"}
                        {index === 1 && item === 2 && "Request any content format you need"}
                        {index === 1 && item === 3 && "Specify exactly what you're looking for"}

                        {index === 2 && item === 1 && "Copy ideas with one click"}
                        {index === 2 && item === 2 && "Save favorites for later use"}
                        {index === 2 && item === 3 && "Get variations of any idea you like"}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 relative">
                <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20 relative">
                  <Image
                    src={step.image || "/placeholder.svg?height=400&width=600&query=app screen"}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    width={600}
                    height={400}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(step.title)}`
                    }}
                  />

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-accent animate-bounce-slight" />
                  <div
                    className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-tertiary animate-bounce-slight"
                    style={{ animationDelay: "0.7s" }}
                  />
                </div>

                {/* Mascot */}
                <div className={`absolute ${index % 2 === 0 ? "-bottom-10 -left-10" : "-bottom-10 -right-10"}`}>
                  <Mascot emotion={step.mascotEmotion as any} message={step.mascotMessage} size="md" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
