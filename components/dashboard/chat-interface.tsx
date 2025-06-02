// app/(private)/dashboard/chat/chat-interface.tsx

"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Zap, Loader2, X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ContentIdeaCard } from "@/components/dashboard/content-idea-card";
import { CategorizedContent } from "@/components/dashboard/categorized-content";
import { ContentGenerationOptions } from "@/components/dashboard/content-generation-options";
import { SuggestedPrompts } from "@/components/dashboard/suggested-prompts";
import {
  generateContentIdeas,
  generateCategorizedContent,
} from "@/app/(private)/dashboard/chat/actions";
import type { ContentIdea, ContentCategory } from "@/app/(private)/dashboard/chat/type";
import { toggleFavorite, getFavorites } from "@/utils/favorites";

export function ChatInterface() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [categorizedContent, setCategorizedContent] = useState<ContentCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creditsUsed, setCreditsUsed] = useState(0);

  // Estado único de todas as opções, incluindo `categorized`
  const [generationOptions, setGenerationOptions] = useState<{
    platform: string;
    format: string;
    tone: string;
    audience: string;
    count: number;
    categorized: boolean;
  }>({
    platform: "any",
    format: "any",
    tone: "professional",
    audience: "general",
    count: 5,
    categorized: false, // inicia como false
  });

  const [chatHistory, setChatHistory] = useState<
    Array<{ type: "user" | "assistant"; content: string }>
  >([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCredits = () => {
      setCreditsUsed(1);
    };
    loadCredits();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // DEBUG: exibe o valor de generationOptions.categorized sempre que o componente renderiza
  console.log("ChatInterface render: generationOptions.categorized =", generationOptions.categorized);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Assim que clicar em “Gerar”, limpamos imediatamente qualquer resultado antigo
    setContentIdeas([]);
    setCategorizedContent([]);
    setIsLoading(true);
    setError(null);

    setChatHistory((prev) => [...prev, { type: "user", content: prompt }]);
    setChatHistory((prev) => [
      ...prev,
      { type: "assistant", content: "Generating viral content ideas..." },
    ]);

    try {
      if (generationOptions.categorized) {
        console.log("Usando modo categorizado"); // DEBUG
        const { platform, format, tone, audience, count } = generationOptions;
        const categories = await generateCategorizedContent(prompt, {
          platform: platform !== "any" ? platform : undefined,
          format: format !== "any" ? format : undefined,
          tone,
          audience,
          count,
        });

        if (typeof window !== "undefined") {
          const favorites = getFavorites();
          const favoriteIds = new Set(favorites.map((fav) => fav.id));
          const categoriesWithFavoriteStatus = categories.map((category) => ({
            ...category,
            ideas: category.ideas.map((idea) => ({
              ...idea,
              isFavorite: favoriteIds.has(idea.id),
            })),
          }));
          setCategorizedContent(categoriesWithFavoriteStatus);
        } else {
          setCategorizedContent(categories);
        }

        setChatHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = {
            type: "assistant",
            content: `I've generated ${categories.length} categories of content ideas based on your prompt. Each category contains ${categories[0]?.ideas.length ?? 1} idea(s).`,
          };
          return newHistory;
        });

        setCreditsUsed((prev) => prev + 4);
      } else {
        console.log("Usando modo normal (não categorizado)"); // DEBUG
        const ideas = await generateContentIdeas(prompt, {
          platform: generationOptions.platform !== "any" ? generationOptions.platform : undefined,
          format: generationOptions.format !== "any" ? generationOptions.format : undefined,
          tone: generationOptions.tone,
          audience: generationOptions.audience,
          count: generationOptions.count,
        });

        if (typeof window !== "undefined") {
          const favorites = getFavorites();
          const favoriteIds = new Set(favorites.map((fav) => fav.id));
          const ideasWithFavoriteStatus = ideas.map((idea) => ({
            ...idea,
            isFavorite: favoriteIds.has(idea.id),
          }));
          setContentIdeas(ideasWithFavoriteStatus);
        } else {
          setContentIdeas(ideas);
        }

        setChatHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = {
            type: "assistant",
            content: `I've generated ${ideas.length} viral content ideas based on your prompt. Each idea includes detailed information to help you create engaging content.`,
          };
          return newHistory;
        });

        setCreditsUsed((prev) => prev + 1);
      }

      toast({
        title: "Ideas Generated!",
        description: `Viral content ideas have been created for you.`,
      });
    } catch (err) {
      console.error("Error generating content:", err);
      setError("Failed to generate content ideas. Please try again.");

      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          type: "assistant",
          content: "I'm sorry, I encountered an error while generating content ideas. Please try again.",
        };
        return newHistory;
      });

      toast({
        title: "Generation Failed",
        description: "There was an error generating your content ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  const handleToggleFavorite = (idea: ContentIdea) => {
    const updatedIdea = toggleFavorite(idea);

    if (contentIdeas.length > 0) {
      setContentIdeas((ideas) => ideas.map((i) => (i.id === idea.id ? updatedIdea : i)));
    }
    if (categorizedContent.length > 0) {
      setCategorizedContent((categories) =>
        categories.map((category) => ({
          ...category,
          ideas: category.ideas.map((i) => (i.id === idea.id ? updatedIdea : i)),
        }))
      );
    }

    toast({
      title: updatedIdea.isFavorite ? "Added to favorites" : "Removed from favorites",
      description: updatedIdea.isFavorite
        ? "Content idea saved to your favorites."
        : "Content idea removed from your favorites.",
    });
  };

  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const clearResults = () => {
    setContentIdeas([]);
    setCategorizedContent([]);
  };

  return (
    <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            Make Viral with AI
          </h2>
          <p className="text-muted-foreground">
            Tell me what type of content you need, and I'll generate viral-worthy ideas tailored to your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat and Input Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Chat History */}
            <div className="rounded-xl border-2 border-primary/10 bg-card p-4 h-[300px] overflow-y-auto">
              {chatHistory.length > 0 ? (
                <div className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 ${
                          message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="inline-block p-4 rounded-full bg-secondary/10 mb-4">
                    <Lightbulb className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Start a Conversation</h3>
                  <p className="text-muted-foreground max-w-md">
                    Ask me to generate content ideas for your business, or try one of the suggested prompts below.
                  </p>
                </div>
              )}
            </div>

            {/* Suggested Prompts */}
            <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />

            {/* Advanced Options */}
            <ContentGenerationOptions
              options={generationOptions}
              onOptionsChange={setGenerationOptions}
            />

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="What viral content do you need today?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[80px] pr-12 rounded-xl border-2 border-primary/20 focus-visible:ring-primary"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute bottom-3 right-3 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="sr-only">Generate</span>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                    <Zap className="h-3 w-3" />
                    <span>
                      {creditsUsed} credit{creditsUsed !== 1 ? "s" : ""} used
                    </span>
                  </span>

                  {generationOptions.categorized && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Categorized Mode
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(contentIdeas.length > 0 || categorizedContent.length > 0) && (
                    <Button variant="ghost" size="sm" className="h-8 rounded-full" onClick={clearResults}>
                      <X className="h-4 w-4 mr-1" />
                      Clear Results
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border-2 border-primary/10 bg-card p-4 h-full">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-secondary" />
                Generated Ideas
              </h3>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[400px]">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-secondary animate-spin"></div>
                  </div>
                  <p className="mt-4 text-muted-foreground">Generating viral content ideas...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
                  <p className="text-destructive">{error}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => setError(null)}>
                    Try Again
                  </Button>
                </div>
              ) : generationOptions.categorized ? (
                categorizedContent.length > 0 ? (
                  <div className="overflow-y-auto max-h-[600px] pr-2">
                    <CategorizedContent
                      categories={categorizedContent}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <div className="inline-block p-4 rounded-full bg-secondary/10 mb-4">
                      <Sparkles className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Categories Generated Yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      After submitting a prompt in categorized mode, you’ll see categories here.
                    </p>
                  </div>
                )
              ) : contentIdeas.length > 0 ? (
                <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                  {contentIdeas.map((idea, index) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ContentIdeaCard idea={idea} onToggleFavorite={handleToggleFavorite} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="inline-block p-4 rounded-full bg-secondary/10 mb-4">
                    <Sparkles className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Ideas Generated Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Enter a prompt and click generate to create viral content ideas for your business.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
