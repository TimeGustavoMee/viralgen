// src/components/dashboard/categorized-content.tsx

"use client";

import { useEffect, useState } from "react";
import { ContentIdeaCard } from "@/components/dashboard/content-idea-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import type { ContentCategory, ContentIdea } from "@/app/(private)/dashboard/chat/type";

interface CategorizedContentProps {
  categories: ContentCategory[];
  onToggleFavorite: (idea: ContentIdea) => void;
}

export function CategorizedContent({
  categories,
  onToggleFavorite,
}: CategorizedContentProps) {
  const [activeTab, setActiveTab] = useState<string>(() => categories[0]?.name || "");

  useEffect(() => {
    if (categories.length > 0) {
      setActiveTab(categories[0].name);
    }
  }, [categories]);

  if (!categories || categories.length === 0) {
    return (
      <p className="text-muted-foreground text-center mt-4">
        Nenhuma categoria encontrada.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-full justify-start p-1 bg-muted">
            {categories.map((category) => (
              <TabsTrigger
                key={category.name}
                value={category.name}
                className="rounded-lg data-[state=active]:bg-background"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {categories.map((category) => (
          <TabsContent key={category.name} value={category.name} className="mt-4">
            <div className="space-y-4">
              {category.ideas.map((idea, index) => (
                <motion.div
                  key={idea.id || `${category.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ContentIdeaCard idea={idea} onToggleFavorite={onToggleFavorite} />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
