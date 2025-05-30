"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void
}

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  const prompts = [
    {
      category: "Instagram",
      suggestions: [
        "5 carousel ideas for a bakery",
        "10 post ideas for a fitness coach",
        "Instagram content strategy for a restaurant",
        "Educational carousel ideas for a consultant",
      ],
    },
    {
      category: "TikTok/Reels",
      suggestions: [
        "Viral TikTok ideas for a clothing store",
        "Behind-the-scenes video ideas for a salon",
        "Quick tip videos for a marketing agency",
        "Day-in-the-life content for a photographer",
      ],
    },
    {
      category: "Business Types",
      suggestions: [
        "Content ideas for a new coffee shop",
        "Social media strategy for a law firm",
        "Engagement posts for a dental practice",
        "Content calendar for a real estate agent",
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Suggested Prompts</h3>

      <div className="space-y-3">
        {prompts.map((category) => (
          <div key={category.category} className="space-y-2">
            <h4 className="text-xs text-muted-foreground">{category.category}</h4>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 pb-1">
                {category.suggestions.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    className="rounded-full flex-shrink-0 bg-primary/5 border-primary/20 hover:bg-primary/10 hover:text-primary"
                    onClick={() => onSelectPrompt(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  )
}
