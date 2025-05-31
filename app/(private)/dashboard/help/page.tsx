"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageSquare, Search } from "lucide-react"

export default function HelpPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmitSupport = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Support request submitted",
        description: "We'll get back to you as soon as possible.",
      })
    }, 1000)
  }

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">Find answers to common questions or contact our support team.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for help articles..."
          className="pl-10 rounded-full border-2 border-primary/20 focus-visible:ring-primary"
        />
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-full p-1 bg-muted">
          <TabsTrigger value="faq" className="rounded-full data-[state=active]:bg-background">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-full data-[state=active]:bg-background">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to the most common questions about ViralGen.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border">
                    <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Send us a message and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="What do you need help with?"
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Please describe your issue in detail..."
                  className="min-h-[150px] rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={handleSubmitSupport}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Support Request"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
