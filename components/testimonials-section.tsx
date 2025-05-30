"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "I was spending R$2,000 on Facebook ads with almost no results. ViralGen gave me content ideas that got more engagement in 1 week than my ads did in 3 months.",
      name: "Carlos Mendes",
      business: "Fitness Studio Owner",
      image: "/testimonial-1.jpg",
      stars: 5,
      result: "312% engagement increase",
    },
    {
      quote:
        "As a bakery owner, I had no idea what content would work. The first carousel idea from ViralGen got 1,400+ shares and brought in 37 new customers in a single day.",
      name: "Ana Oliveira",
      business: "Bakery Owner",
      image: "/testimonial-2.jpg",
      stars: 5,
      result: "1,400+ shares on first post",
    },
    {
      quote:
        "I was ready to hire a marketing agency for R$3,500/month. ViralGen does better work for less than R$40. My salon is now booked 3 weeks in advance.",
      name: "Juliana Costa",
      business: "Hair Salon Owner",
      image: "/testimonial-3.jpg",
      stars: 5,
      result: "Fully booked for 3 weeks",
    },
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
            Real Businesses.{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Real Results.
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of small businesses who've transformed their social media presence.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-2xl p-6 shadow-lg border border-border relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute -top-3 -right-3 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                {testimonial.result}
              </div>
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <div className="mb-4 text-foreground relative">
                <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                <p className="relative z-10 italic">{testimonial.quote}</p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image || "/placeholder.svg?height=48&width=48&query=person"}
                    alt={testimonial.name}
                    className="object-cover"
                    fill
                    sizes="48px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/diverse-group.png"
                    }}
                  />
                </div>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
