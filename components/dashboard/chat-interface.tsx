"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Loader2, X, Lightbulb, Zap } from "lucide-react";
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
import type {
  ContentIdea,
  ContentCategory,
} from "@/app/(private)/dashboard/chat/type";
import { toggleFavorite, getFavorites } from "@/utils/favorites";
import { useUserStore } from "@/stores/userStore";

export function ChatInterface() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [categorizedContent, setCategorizedContent] = useState<ContentCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [generationOptions, setGenerationOptions] = useState({
    platform: "any",
    format: "any",
    tone: "professional",
    audience: "general",
    count: 5,
    categorized: false,
  });

  const [chatHistory, setChatHistory] = useState<Array<{ type: "user" | "assistant"; content: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [firstContactDone, setFirstContactDone] = useState<boolean>(true); // simulado como feito
  const [block4Stage, setBlock4Stage] = useState<number | null>(null);
  const userId = useUserStore((state) => state.user?.id);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !userId) return;

    setContentIdeas([]);
    setCategorizedContent([]);
    setIsLoading(true);
    setError(null);

    setChatHistory((prev) => [...prev, { type: "user", content: prompt }]);
    setChatHistory((prev) => [...prev, { type: "assistant", content: "Gerando ideias virais de conteúdo..." }]);

    try {
      if (generationOptions.categorized) {
        const detailedPrompt = `
Por favor, gere cada categoria de ideias de conteúdo de forma muito extensa e detalhada, incluindo:
1. Contexto e justificativa;
2. Passos de implementação (enumerados em sequência);
3. Exemplos práticos de aplicação;
4. Sugestões de variações ou customizações;

Meu prompt original foi: "${prompt}"
        `.trim();

        const categories = await generateCategorizedContent(detailedPrompt, {
          ...generationOptions,
          userId,
        });
        console.log("Categorias recebidas:", categories);
        console.log("Ideias dentro da categoria:", categories[0]?.ideas);

        const favoriteIds = new Set(getFavorites().map((fav) => fav.id));
        const withFavorites = categories.map((cat) => ({
          ...cat,
          ideas: cat.ideas.map((idea) => ({
            ...idea,
            isFavorite: favoriteIds.has(idea.id),
          })),
        }));

        setCategorizedContent(withFavorites);
        setChatHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = {
            type: "assistant",
            content: `Foram geradas ${withFavorites.length} categorias de ideias de conteúdo com base no seu prompt.`,
          };
          return newHistory;
        });
        setCreditsUsed((prev) => prev + 4);
      } else {
        const detailedPrompt = `
Por favor, gere cada ideia de conteúdo de forma muito extensa e detalhada, incluindo:
1. Contexto e justificativa;
2. Passos de implementação (enumerados em sequência);
3. Exemplos práticos de aplicação;
4. Sugestões de variações ou customizações;

Meu prompt original foi: "${prompt}"
        `.trim();

        const ideas = await generateContentIdeas(detailedPrompt, {
          ...generationOptions,
          userId,
        });

        const favoriteIds = new Set(getFavorites().map((fav) => fav.id));
        const withFavorites = ideas.map((idea) => ({
          ...idea,
          isFavorite: favoriteIds.has(idea.id),
        }));

        setContentIdeas(withFavorites);
        setChatHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = {
            type: "assistant",
            content: `Foram geradas ${ideas.length} ideias virais de conteúdo com base no seu prompt.`,
          };
          return newHistory;
        });
        setCreditsUsed((prev) => prev + 1);
      }

      toast({ title: "Ideias Geradas!", description: "Ideias virais de conteúdo foram criadas para você." });
    } catch (err) {
      console.error("Erro ao gerar conteúdo:", err);
      setError("Falha ao gerar ideias de conteúdo. Tente novamente.");
      toast({
        title: "Geração Falhou",
        description: "Houve um erro ao gerar suas ideias de conteúdo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  const handleToggleFavorite = (idea: ContentIdea) => {
    const updatedIdea: ContentIdea = toggleFavorite(idea);

    setContentIdeas((ideas) => ideas.map((i) => (i.id === idea.id ? updatedIdea : i)));
    setCategorizedContent((cats) =>
      cats.map((cat) => ({
        ...cat,
        ideas: cat.ideas.map((i) => (i.id === idea.id ? updatedIdea : i)),
      }))
    );

    toast({
      title: updatedIdea.isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
      description: updatedIdea.isFavorite
        ? "A ideia de conteúdo foi salva em seus favoritos."
        : "A ideia de conteúdo foi removida dos seus favoritos.",
    });
  };

  const handleSelectPrompt = (selectedPrompt: string) => setPrompt(selectedPrompt);
  const clearResults = () => {
    setContentIdeas([]);
    setCategorizedContent([]);
  };

  return (
    <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            Make Viral with AI
          </h2>
          <p className="text-muted-foreground">
            {firstContactDone && block4Stage === null
              ? "Conteúdos virais prontos para sua estratégia!"
              : "Complete sua ativação para começar."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border-2 border-primary/10 bg-card p-4 h-[300px] overflow-y-auto">
              <div className="space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl p-3 whitespace-pre-wrap ${msg.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>

            {firstContactDone && block4Stage === null && (
              <>
                <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
                <ContentGenerationOptions options={generationOptions} onOptionsChange={setGenerationOptions} />
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="Digite um prompt para gerar ideias virais..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[80px] pr-12 rounded-xl border-2 border-primary/20 focus-visible:ring-primary"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute bottom-3 right-3 rounded-full bg-secondary text-secondary-foreground"
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  <Zap className="inline h-4 w-4 mr-1" />
                  {creditsUsed} crédito{creditsUsed !== 1 ? "s" : ""} usado
                </span>

                {(contentIdeas.length > 0 || categorizedContent.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearResults}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar resultados
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Coluna lateral */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border-2 border-primary/10 bg-card p-4 h-full">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-secondary" />
                Resultados
              </h3>

              {isLoading ? (
                <p className="text-center text-muted-foreground">Gerando conteúdo...</p>
              ) : error ? (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                  <p>{error}</p>
                  <Button size="sm" onClick={() => setError(null)} className="mt-2">
                    Tentar novamente
                  </Button>
                </div>
              ) : generationOptions.categorized && categorizedContent.length > 0 ? (
                <CategorizedContent
                  ideas={categorizedContent.flatMap((cat) => cat.ideas)}
                  onToggleFavorite={handleToggleFavorite}
                />
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
                <p className="text-muted-foreground text-center">
                  Nenhum conteúdo gerado ainda. Envie um prompt.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
