// src/components/dashboard/content-idea-card.tsx

"use client";

import { useState } from "react";
import {
  Copy,
  Heart,
  Share,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  BarChart,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import type { ContentIdea } from "@/app/(private)/dashboard/chat/type";

interface ContentIdeaCardProps {
  idea: ContentIdea;
  onToggleFavorite: (idea: ContentIdea) => void;
  compact?: boolean;
}

export function ContentIdeaCard({
  idea,
  onToggleFavorite,
  compact = false,
}: ContentIdeaCardProps) {
  const [expanded, setExpanded] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content idea copied to clipboard successfully.",
    });
  };

  const shareIdea = () => {
    const shareText = `${idea.title}\n\n${idea.description}\n\nGenerated with ViralGen`;
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Ready to share",
      description: "Content idea copied to clipboard for sharing.",
    });
  };

  // Determine difficulty color
  const difficultyColor =
    idea.difficulty === "easy"
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : idea.difficulty === "medium"
        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        : "bg-red-500/10 text-red-500 border-red-500/20";

  // Normalize estimatedEngagement to string
  const engagementStr: string =
    idea.estimatedEngagement != null ? String(idea.estimatedEngagement) : "";

  // Determine engagement color
  const engagementColor = engagementStr.includes("High")
    ? "bg-green-500/10 text-green-500 border-green-500/20"
    : engagementStr.includes("Medium")
      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      : "bg-blue-500/10 text-blue-500 border-blue-500/20";

  // Se estiver em modo “compact”, exibe só título, descrição (clamped), favorito e copiar
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
                    <Heart
                      className={`h-4 w-4 ${idea.isFavorite ? "fill-secondary text-secondary" : ""
                        }`}
                    />
                    <span className="sr-only">Favorite</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {idea.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"}
                  </p>
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
                    onClick={() => copyToClipboard(idea.description || "")}
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
        <p className="text-muted-foreground line-clamp-3">
          {idea.description}
        </p>
      </div>
    );
  }

  // FULL DISPLAY MODE
  // -----------------------------------------------------

  // ① acessar “fase1” diretamente do objeto ideia
  const ganchoSupremo = idea.fase1.ganchoSupremo;
  const choqueDeRealidade = idea.fase1.choqueDeRealidade;
  const storytellingContexto = idea.fase1.storytellingContexto;
  const entregaDeValor1 = idea.fase1.entregaDeValor1;
  const ctaDuploBeneficio = idea.fase1.ctaDuploBeneficio;
  const entregaDeValor2 = idea.fase1.entregaDeValor2;
  const callToBase = idea.fase1.callToBase;
  const cliffhangerSupremo = idea.fase1.cliffhangerSupremo;

  return (
    <div className="p-4 rounded-xl border-2 border-primary/10 bg-card text-card-foreground shadow-sm hover:border-primary/20 transition-all duration-300">
      {/* Header: Title + Format/Platform */}
      <div className="flex justify-between itemss-start mb-2">
        <div>
          <h4 className="font-medium text-lg">{idea.title}</h4>
          {(idea.format || idea.platform) && (
            <div className="flex flex-wrap gap-2 mt-1">
              {idea.format && (
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20"
                >
                  {idea.format}
                </Badge>
              )}
              {idea.platform && (
                <Badge
                  variant="outline"
                  className="bg-secondary/5 text-secondary border-secondary/20"
                >
                  {idea.platform}
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {/* Favorite Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => onToggleFavorite(idea)}
                >
                  <Heart
                    className={`h-4 w-4 ${idea.isFavorite ? "fill-secondary text-secondary" : ""
                      }`}
                  />
                  <span className="sr-only">Favorite</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {idea.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Copy Description Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => copyToClipboard(idea.description || "")}
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

          {/* Share Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={shareIdea}
                >
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

      {/* Description */}
      <p className="text-muted-foreground my-3">{idea.description}</p>

      {/* Quick Stats: Engagement, Difficulty, Time to Create */}
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
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            <Clock className="h-3 w-3 mr-1" />
            {idea.timeToCreate}
          </Badge>
        )}
      </div>

      {/* Expand/Collapse Button */}
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

      {/* Expanded Section: DNA VIRALGEN + Demais Seções */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <h5 className="text-sm font-medium mb-2">
              VIRALGEN DNA – Strategic Creation
            </h5>
            <div className="pt-3 border-t mt-3 space-y-4 text-gray-600 dark:text-white">

              {/* ─── NOVO BLOCO: DNA VIRALGEN (fase1.1–1.8) ───────────────────────── */}
              {idea.fase1 && (
                <div>

                  <div className="space-y-3 ml-4">
                    {/* Fase 1.1 – Gancho Supremo */}
                    <div>
                      <h6 className="text-xs font-semibold mb-1">
                        SUPREME HOOK – The scroll killer
                      </h6>
                      <p className="text-sm">{ganchoSupremo}</p>
                    </div>

                    {/* Fase 1.2 – Choque de Realidade */}
                    <div>
                      <h6 className="text-xs font-semibold mb-1">
                        REALITY SHOCK – Cognitive Confrontation
                      </h6>
                      <p className="text-sm">{choqueDeRealidade}</p>
                    </div>

                    {/* Fase 1.3 – Storytelling + Contexto */}
                    <div>
                      <h6 className="text-xs font-semibold mb-1">
                        STORYTELLING + CONTEXT
                      </h6>
                      <p className="text-sm">{storytellingContexto}</p>
                    </div>

                    {/* Fase 1.4 – Entrega de Valor 1 */}
                    <div>
                      <h6 className="text-xs font-semibold mb-1">
                        VALUE DELIVERY - Concealed Part!
                      </h6>
                      <p className="text-sm">{entregaDeValor1}</p>
                    </div>

                    {/* Fase 1.5 – CTA Duplo + Benefício Real */}
                    <div>
                      <h6 className="text-xs font-semibold mb-1">
                        DOUBLE CTA + REAL BENEFIT
                      </h6>
                      <p className="text-sm">{ctaDuploBeneficio}</p>
                    </div>

                    {/* Fase 1.6 – Entrega de Valor 2 */}
                    <div>
                      <h6 className="text-xs font-semibold mb-1">
                        VALUE DELIVERY - Revealed Part!
                      </h6>
                      <p className="text-sm">{entregaDeValor2}</p>
                    </div>

                    {/* Fase 1.7 – Call to Base (CTB 2.0) */}
                    <div>
                      <h6 className="text-xs font-semibold mb-1">
                        CALL TO BASE
                      </h6>
                      <p className="text-sm">{callToBase}</p>
                    </div>

                    {/* Fase 1.8 – Cliffhanger Supremo */}
                    <div>
                      <h6 className="text-xs font-semibold mb-1">
                        SUPREME CLIFFHANGER
                      </h6>
                      <p className="text-sm">{cliffhangerSupremo}</p>
                    </div>
                  </div>
                </div>
              )}
              {/* ──────────────────────────────────────────────────────────────── */}

              {/* Context & Justification */}
              {idea.context && (
                <div>
                  <h5 className="text-sm font-medium mb-2">
                    Context & Justification
                  </h5>
                  <p className="text-sm whitespace-pre-wrap">{idea.context}</p>
                </div>
              )}

              {/* Implementation Steps */}
              {idea.steps && idea.steps.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">
                    Implementation Steps
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                    {idea.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Practical Examples */}
              {idea.examples && idea.examples.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">
                    Practical Examples
                  </h5>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    {idea.examples.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content Variations */}
              {idea.variations && idea.variations.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">
                    Content Variations
                  </h5>
                  <ul className="space-y-2 ml-4 text-sm">
                    {idea.variations.map((variation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">
                          {index + 1}
                        </span>
                        {variation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Hashtags */}
              {idea.tags && idea.tags.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                    Suggested Hashtags
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-secondary/10 text-secondary border-none"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Audience */}
              {idea.targetAudience && (
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    Target Audience
                  </h5>
                  <p className="text-sm">{idea.targetAudience}</p>
                </div>
              )}

              {/* Best Time to Post */}
              {idea.bestTimeToPost && (
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Best Time to Post
                  </h5>
                  <p className="text-sm">{idea.bestTimeToPost}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
