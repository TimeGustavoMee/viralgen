"use client"

import { motion } from "framer-motion"
import { HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  const faqs = [
    {
      question: "How exactly does ViralGen work?",
      answer:
        "ViralGen uses advanced AI trained on thousands of viral posts to generate content ideas specifically for your business. Just tell us your niche, and our AI will create ready-to-use content ideas that are proven to drive engagement. No marketing experience needed.",
    },
    {
      question: "Will this work for my specific business?",
      answer:
        "ViralGen works for ANY business type - restaurants, salons, gyms, dentists, e-commerce stores, coaches, consultants, and more. Our AI adapts to your specific niche and audience to create relevant, high-converting content ideas.",
    },
    {
      question: "How many content ideas do I get?",
      answer:
        "With our Pro plan, you get 20 credits per week, which equals 100 viral content ideas (5 variations per credit). That's more than enough to dominate your social media presence and leave competitors in the dust.",
    },
    {
      question: "Do I need to be a good writer to use this?",
      answer:
        "Not at all! ViralGen gives you complete, ready-to-use content ideas. Just copy, paste, and post. No writing skills required. Our AI does all the creative work for you.",
    },
    {
      question: "What if it doesn't work for me?",
      answer:
        "We offer a 7-day money-back guarantee. If you don't see a significant increase in your engagement within 7 days, we'll refund 100% of your money. No questions asked. You have nothing to lose and everything to gain.",
    },
    {
      question: "How is this different from ChatGPT?",
      answer:
        "Unlike general AI tools like ChatGPT, ViralGen is specifically trained on viral social media content and optimized for small businesses. Our AI understands what drives engagement on each platform and creates content ideas that are proven to go viral in your specific niche.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6"
          >
            <HelpCircle className="h-4 w-4" />
            <span>COMMON QUESTIONS</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left font-semibold text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
