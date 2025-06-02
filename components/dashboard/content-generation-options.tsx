"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronUp, Settings } from "lucide-react"

export interface ContentGenerationOptions {
  platform: string
  format: string
  tone: string
  audience: string
  count: number
  categorized: boolean
}

interface ContentGenerationOptionsProps {
  options: ContentGenerationOptions
  onOptionsChange: (options: ContentGenerationOptions) => void
}

export function ContentGenerationOptions({
  options,
  onOptionsChange,
}: ContentGenerationOptionsProps) {
  // Somente controla abertura/fechamento do Collapsible
  const [isOpen, setIsOpen] = useState(false)

  // DEBUG: exibe sempre o valor atual de options.categorized
  console.log("ContentGenerationOptions render: options.categorized =", options.categorized)

  const handleOptionChange = (key: keyof ContentGenerationOptions, value: any) => {
    console.log(`ContentGenerationOptions: tentando setar ${key} =`, value)
    const newOptions = { ...options, [key]: value }
    onOptionsChange(newOptions)
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full rounded-lg border border-border p-4 bg-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Advanced Options</h3>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={options.platform}
              onValueChange={(value) => handleOptionChange("platform", value)}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Platform</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Content Format</Label>
            <Select
              value={options.format}
              onValueChange={(value) => handleOptionChange("format", value)}
            >
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Format</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="post">Single Post</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="reel">Reel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone of Voice</Label>
            <Select
              value={options.tone}
              onValueChange={(value) => handleOptionChange("tone", value)}
            >
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="funny">Funny</SelectItem>
                <SelectItem value="serious">Serious</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Select
              value={options.audience}
              onValueChange={(value) => handleOptionChange("audience", value)}
            >
              <SelectTrigger id="audience">
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="beginners">Beginners</SelectItem>
                <SelectItem value="experts">Experts</SelectItem>
                <SelectItem value="young">Young Adults (18-24)</SelectItem>
                <SelectItem value="adults">Adults (25-40)</SelectItem>
                <SelectItem value="seniors">Seniors (40+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="count">Number of Ideas ({options.count})</Label>
          </div>
          <Slider
            id="count"
            min={1}
            max={10}
            step={1}
            value={[options.count]}
            onValueChange={(value) => handleOptionChange("count", value[0])}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="categorized"
            checked={options.categorized}
            onChange={(e) => handleOptionChange("categorized", e.target.checked)}
            className="rounded border-primary text-primary focus:ring-primary"
          />
          <Label htmlFor="categorized">
            Generate categorized content (uses more credits)
          </Label>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
