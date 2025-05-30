"use client"

import { useState } from "react"
import { Copy, Heart, Share, ChevronDown, ChevronUp, Tag, Clock, BarChart, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import type { ContentIdea } from "@/app/actions/generate-content"

interface ContentIdeaCardProps {
  idea: ContentIdea
  onToggleFavorite: (idea: ContentIdea) => void
  compact?: boolean
}

export function ContentIdeaCard({ idea, onToggleFavorite, compact = false }: ContentIdeaCardProps) {
  const [expanded, setExpanded] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Content idea copied to clipboard successfully.",
    })
  }

  const shareIdea = () => {
    // In a real app, this would open a share dialog
    // For now, just copy to clipboard
    const shareText = `${idea.title}\n\n${idea.description}\n\nGenerated with ViralGen`
    navigator.clipboard.writeText(shareText)
    toast({
      title: "Ready to share",
      description: "Content idea copied to clipboard for sharing.",
    })
  }

  // Determine difficulty color
  const difficultyColor =
    idea.difficulty === "easy"
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : idea.difficulty === "medium"
        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        : "bg-red-500/10 text-red-500 border-red-500/20"

  // Determine engagement color
  const engagementColor = idea.estimatedEngagement?.includes("High")
    ? "bg-green-500/10 text-green-500 border-green-500/20"
    : idea.estimatedEngagement?.includes("Medium")
      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      : "bg-blue-500/10 text-blue-500 border-blue-500/20"

  if (compact) {
    return (
      <div className="p-4 rounded-xl border-2 border-primary/10 bg-card text-card-foreground shadow-sm hover:border-primary/20 transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">{idea.title}</h4>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => onToggleFavorite(idea)}
                  >
                    <Heart className={`h-4 w-4 ${idea.isFavorite ? "fill-secondary text-secondary" : ""}`} />
                    <span className="sr-only">Favorite</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{idea.isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => copyToClipboard(idea.description)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-3">{idea.description}</p>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl border-2 border-primary/10 bg-card text-card-foreground shadow-sm hover:border-primary/20 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-lg">{idea.title}</h4>
          {(idea.format || idea.platform) && (
            <div className="flex flex-wrap gap-2 mt-1">
              {idea.format && (
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {idea.format}
                </Badge>
              )}
              {idea.platform && (
                <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">
                  {idea.platform}
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => onToggleFavorite(idea)}
                >
                  <Heart className={`h-4 w-4 ${idea.isFavorite ? "fill-secondary text-secondary" : ""}`} />
                  <span className="sr-only">Favorite</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{idea.isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => copyToClipboard(idea.description)}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={shareIdea}>
                  <Share className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this idea</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <p className="text-muted-foreground my-3">{idea.description}</p>

      {/* Quick stats */}
      <div className="flex flex-wrap gap-3 mt-4 mb-2">
        {idea.estimatedEngagement && (
          <Badge variant="outline" className={engagementColor}>
            <BarChart className="h-3 w-3 mr-1" />
            {idea.estimatedEngagement} Engagement
          </Badge>
        )}

        {idea.difficulty && (
          <Badge variant="outline" className={difficultyColor}>
            {idea.difficulty === "easy"
              ? "Easy to Create"
              : idea.difficulty === "medium"
                ? "Medium Difficulty"
                : "Advanced"}
          </Badge>
        )}

        {idea.timeToCreate && (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Clock className="h-3 w-3 mr-1" />
            {idea.timeToCreate}
          </Badge>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-2 text-muted-foreground"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <>
            <ChevronUp className="h-4 w-4 mr-2" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-2" />
            Show More Details
          </>
        )}
      </Button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-3 border-t mt-3 space-y-4">
              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                    Suggested Hashtags
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-secondary/10 text-secondary border-none">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Target audience */}
              {idea.targetAudience && (
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    Target Audience
                  </h5>
                  <p className="text-sm text-muted-foreground">{idea.targetAudience}</p>
                </div>
              )}

              {/* Best time to post */}
              {idea.bestTimeToPost && (
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Best Time to Post
                  </h5>
                  <p className="text-sm text-muted-foreground">{idea.bestTimeToPost}</p>
                </div>
              )}

              {/* Variations */}
              {idea.variations && idea.variations.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Content Variations</h5>
                  <ul className="space-y-2">
                    {idea.variations.map((variation, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">
                          {index + 1}
                        </span>
                        {variation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
