// app/(private)/dashboard/chat/chat-interface.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
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
  // -------------------------------------------------
  // 1) ESTADOS GERAIS DO COMPONENTE
  // -------------------------------------------------
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [categorizedContent, setCategorizedContent] = useState<ContentCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creditsUsed, setCreditsUsed] = useState(0);

  // Estado para as opções de geração (modo normal vs categorizado, etc.)
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
    categorized: false,
  });

  // Estado do histórico de chat (apenas para exibir mensagens no chat UI)
  const [chatHistory, setChatHistory] = useState<
    Array<{ type: "user" | "assistant"; content: string }>
  >([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------
  // 2) ESTADOS DE “PRIMEIRO CONTATO” (BLOCO 1)
  // -------------------------------------------------
  // Em qual etapa do bloco 1 o usuário está (0..5).
  // 0 = enviar mensagem de boas-vindas e pergunta “Seu nome completo:”
  // 1 = aguardar resposta do nome; depois: pergunta “Seu @ do Instagram:”
  // 2 = aguardar @ e validar; depois: “Você já usou IA pra criar conteúdo antes?”
  // 3 = aguardar resposta de IA; validar ambíguo → eventualmente perguntar “Se prefere iniciante/avançado…”
  //     depois: perguntar “Você entendeu…?”
  // 4 = enviamos mensagem de marco simbólico + definição de missão 1; marcamos firstContactDone
  // 5 = “missão 1” está aberta; aguardamos envio da primeira ideia de conteúdo/rascunho
  const [firstContactStage, setFirstContactStage] = useState<number>(0);

  // Guarda os dados coletados no bloco 1
  const [firstContactData, setFirstContactData] = useState<{
    name: string;
    instagram: string;
    iaUsage: string;
    iaLevel?: string; // “iniciante” | “intermediário” | “avançado”
  }>({
    name: "",
    instagram: "",
    iaUsage: "",
  });

  // Quando true, o primeiro contato foi concluído e o chat "normal" entra em ação
  const [firstContactDone, setFirstContactDone] = useState<boolean>(false);

  // -------------------------------------------------
  // 3) useEffect PARA INICIAR O BLOCO 1
  // -------------------------------------------------
  useEffect(() => {
    // Ao montar, empurramos a mensagem de boas-vindas (stage 0)
    if (firstContactStage === 0) {
      setChatHistory([
        {
          type: "assistant",
          content: `🎉 Bem-vindo(a) oficialmente ao VIRALGEN – o projeto que transforma pessoas comuns em criadores virais com inteligência artificial.\n\nJá ajudamos milhares de pessoas a saírem do zero e criarem conteúdos que se destacam. Agora é sua vez.\n\nEu sou o Agente Viral, seu assistente pessoal. Estou aqui pra te guiar passo a passo.\n\n*Pra começar, me responde 3 coisas:*\n\n1. **Seu nome completo:**\n2. **Seu @ do Instagram (vai ser seu ID aqui dentro):**\n3. **Você já usou IA pra criar conteúdo antes? (sim / não / um pouco)**\n\n⚠️ Se não entender alguma coisa, digita “ajuda” e eu explico tudo com calma.`,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll automático do chat quando algo novo entra
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // -------------------------------------------------
  // 4) useEffect PARA CRÉDITOS (mantive como antes)
  // -------------------------------------------------
  useEffect(() => {
    const loadCredits = () => {
      setCreditsUsed(1);
    };
    loadCredits();
  }, []);

  // -------------------------------------------------
  // 5) FUNÇÃO handleSubmit (agora lida COM DOIS FLUXOS: bloco 1 ou geração normal)
  // -------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Se o primeiro contato NÃO estiver concluído, passamos pelo fluxo BLOCO 1
    if (!firstContactDone) {
      await handleFirstContactSubmit(prompt.trim());
      setPrompt(""); // limpamos o campo a cada resposta
      return;
    }

    // Se chegamos aqui, firstContactDone == true → é o fluxo “normal” de geração de conteúdo:
    handleNormalChatSubmit(e);
  };

  // -------------------------------------------------
  // 6) LÓGICA DO FLUXO BLOCO 1
  // -------------------------------------------------
  async function handleFirstContactSubmit(userText: string) {
    // Se o usuário digitar "ajuda" (ou variações), não tratamos como nome:
    if (userText.trim().toLowerCase() === "ajuda") {
      setChatHistory(prev => [
        ...prev,
        { type: "assistant", content: `🤖 *Como funciona o VIRALGEN?*\n\n1. No primeiro contato, eu peço seu nome, @ do Instagram e se você já usou IA.\n2. Depois, ajustamos seu nível de experiência com IA (iniciante/intermediário/avançado).\n3. Em seguida, você envia sua primeira ideia de conteúdo (Missão 1) e eu ajudo a refiná-la.\n4. Após concluir a Missão 1, seguimos para níveis avançados. Me manda seu nome completo para começarmos!Bora? ` },
      ]);
      // Não alteramos firstContactStage nem armazenamos nada; permanecemos na mesma etapa (0).
      return;
    }

    // Continua o fluxo normal caso não seja "ajuda":
    setChatHistory(prev => [...prev, { type: "user", content: userText }]);

    switch (firstContactStage) {
      case 0:
        // Aqui, queremos aceitar qualquer texto não vazio como nome,
        // mas nesse ponto já filtramos "ajuda" acima.
        setFirstContactData(prev => ({ ...prev, name: userText }));
        setFirstContactStage(1);
        setChatHistory(prev => [
          ...prev,
          {
            type: "assistant",
            content: `Ótimo, ${userText}! Agora me diz:\n\n**Seu @ do Instagram (vai ser seu ID aqui dentro):**`,
          },
        ]);
        break;

      // ---------------------------------------------
      case 1:
        // Aqui esperamos o @ do Instagram. Validamos se começa com “@” e não tem espaços.
        const ig = userText;
        const igValid = ig.startsWith("@") && !ig.includes(" ");
        if (!igValid) {
          // Reenvia a mesma pergunta até ser válido
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Consegue mandar seu @ certinho? Algo como **@seunome** ou **@seudominio**. Ele será usado pra acompanhar seu progresso aqui dentro.`,
            },
          ]);
          // mantemos firstContactStage = 1
        } else {
          // Salvamos e avançamos para a próxima etapa
          setFirstContactData((prev) => ({ ...prev, instagram: ig }));
          setFirstContactStage(2);
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Perfeito, ${ig}! Agora me diz:\n\n**Você já usou IA pra criar conteúdo antes? (sim / não / um pouco)**`,
            },
          ]);
        }
        break;

      // ---------------------------------------------
      case 2:
        // Aqui esperamos “sim”, “não” ou “um pouco”. Se vier diferente, consideramos ambíguo.
        const respostaIA = userText.toLowerCase();
        if (
          respostaIA !== "sim" &&
          respostaIA !== "não" &&
          respostaIA !== "nao" &&
          respostaIA !== "um pouco" &&
          respostaIA !== "umpouco"
        ) {
          // Resposta ambígua: tratamos como intermediário e perguntamos se prefere iniciante ou avançado
          setFirstContactData((prev) => ({ ...prev, iaUsage: "intermediário" }));
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Legal! Então vou te considerar como **intermediário** e te ajudar a destravar essa parte. Se preferir que eu te trate como **iniciante** ou **avançado**, me avisa.`,
            },
          ]);
          // Mantemos na mesma etapa (2), mas agora esperamos “iniciante” | “intermediário” | “avançado”
          setFirstContactStage(2.5); // 2.5 = “etapa de ajuste de nível de IA”
        } else {
          // Se a resposta for exatamente “sim” | “não” | “um pouco”
          // Padronizamos “nao” para “não”
          let padronizado = respostaIA === "nao" ? "não" : respostaIA;
          setFirstContactData((prev) => ({ ...prev, iaUsage: padronizado }));
          // Passamos direto para a confirmação de entendimento
          setFirstContactStage(3);
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Última coisa antes da missão:\n\n**Você entendeu que aqui você vai criar conteúdos com ajuda da IA, seguindo um passo a passo validado, e que eu vou estar com você pra ajustar e melhorar até você acertar?**\n\nResponde “entendi” ou “não entendi” que eu explico melhor.`,
            },
          ]);
        }
        break;

      // ---------------------------------------------
      case 2.5:
        // Estamos na subetapa de ajuste de nível: esperamos “iniciante”, “intermediário” ou “avançado”
        const nivel = userText.toLowerCase();
        if (nivel !== "iniciante" && nivel !== "intermediário" && nivel !== "avançado") {
          // Se não for nenhum dos três, repete a pergunta
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Desculpa, não entendi. Se prefere que eu te trate como iniciante, intermediário ou avançado, me diz exatamente uma dessas palavras.`,
            },
          ]);
          // mantemos firstContactStage = 2.5
        } else {
          // Salvamos e avançamos para confirmação de entendimento
          setFirstContactData((prev) => ({ ...prev, iaLevel: nivel }));
          setFirstContactStage(3);
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Ótimo, vou te tratar como **${nivel}** nesse processo.\n\nÚltima coisa antes da missão:\n\n**Você entendeu que aqui você vai criar conteúdos com ajuda da IA, seguindo um passo a passo validado, e que eu vou estar com você pra ajustar e melhorar até você acertar?**\n\nResponde “entendi” ou “não entendi” que eu explico melhor.`,
            },
          ]);
        }
        break;

      // ---------------------------------------------
      case 3:
        // Esperamos “entendi” ou “não entendi”
        const confirmacao = userText.toLowerCase();
        if (confirmacao !== "entendi" && confirmacao !== "não entendi" && confirmacao !== "nao entendi") {
          // Qualquer outra resposta, pedimos para o usuário responder exatamente.
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Por favor, responde “entendi” ou “não entendi”. Se você não entendeu, eu explico novamente.`,
            },
          ]);
        } else if (confirmacao === "não entendi" || confirmacao === "nao entendi") {
          // Reexplicamos todo o conceito
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Tudo bem, vou detalhar de novo:\n\n1. Você vai me enviar ideias ou rascunhos de conteúdo (texto, imagem, vídeo) e eu vou te ajudar a refinar.\n2. Vamos passo a passo: desde encontrar o tema até otimizar o texto e a estratégia de publicação.\n3. A ideia é você sair daqui sabendo usar IA de verdade para criar posts virais.\n\nMe fala “entendi” quando fizer sentido para continuarmos.`,
            },
          ]);
          // mantém firstContactStage = 3
        } else {
          // Usuário disse “entendi”
          setFirstContactStage(4);
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Perfeito. A partir de agora, você é oficialmente um **Criador Viral em Ativação**. Sua missão começa agora.\n\n*Tag aplicada: criador_ativado*`,
            },
            {
              type: "assistant",
              content: `Você terá cumprido sua **Missão 1** quando:\n\n- Me mandar aqui a sua primeira ideia de conteúdo ou rascunho criado com IA.\n\nQuando fizer isso, te levo pro **Nível 2** com ajustes estratégicos e desbloqueios especiais.\n\n*Tag aplicada: missao1_completa*`,
            },
          ]);
          // marcamos o primeiro contato como concluído, mas aguardamos a primeira ideia (stage 5)
          setFirstContactDone(true);
          setFirstContactStage(5);
        }
        break;

      // ---------------------------------------------
      case 5:
        // Estamos aguardando a primeira ideia de conteúdo / rascunho com IA (Missão 1).
        // Assim que o usuário enviar qualquer texto aqui, consideramos sua Missão 1 concluída.
        // Podemos tocar no nível 2 (mas não implementaremos o nível 2 aqui; assumimos que você vai fazer no Bloco 2).
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `🎉 Excelente! Você completou sua Missão 1 enviando sua primeira ideia/rascunho. Agora vamos para o Nível 2 com ajustes estratégicos e desbloqueios especiais!`,
          },
        ]);
        // LIGAÇÃO: daqui em diante, o fluxo “normal” de geração de conteúdo (você pode exibir sugestões ou deixar o usuário começar a pedir ideias).
        // Não alteramos firstContactDone (continua true) nem o stage.  
        break;

      default:
        break;
    }
  }

  // -------------------------------------------------
  // 7) FLUXO “NORMAL” DE GERAÇÃO DE CONTEÚDO (já existente)
  // -------------------------------------------------
  const handleNormalChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Limpa resultados antigos, coloca loading, zera erros
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
        console.log("Usando modo categorizado");
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
            content: `I've generated ${categories.length} categories of content ideas based on your prompt. Each category contains ${categories[0]?.ideas.length ?? 1
              } idea(s).`,
          };
          return newHistory;
        });

        setCreditsUsed((prev) => prev + 4);
      } else {
        console.log("Usando modo normal (não categorizado)");
        const ideas = await generateContentIdeas(prompt, {
          platform:
            generationOptions.platform !== "any"
              ? generationOptions.platform
              : undefined,
          format:
            generationOptions.format !== "any"
              ? generationOptions.format
              : undefined,
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
          content:
            "I'm sorry, I encountered an error while generating content ideas. Please try again.",
        };
        return newHistory;
      });

      toast({
        title: "Generation Failed",
        description:
          "There was an error generating your content ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  // -------------------------------------------------
  // 8) Demais handlers (favoritar, selecionar prompt, clear results)
  // -------------------------------------------------
  const handleToggleFavorite = (idea: ContentIdea) => {
    const updatedIdea = toggleFavorite(idea);

    if (contentIdeas.length > 0) {
      setContentIdeas((ideas) =>
        ideas.map((i) => (i.id === idea.id ? updatedIdea : i))
      );
    }
    if (categorizedContent.length > 0) {
      setCategorizedContent((categories) =>
        categories.map((category) => ({
          ...category,
          ideas: category.ideas.map((i) =>
            i.id === idea.id ? updatedIdea : i
          ),
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

  // -------------------------------------------------
  // 9) RENDER (JSX)
  // -------------------------------------------------
  return (
    <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            Make Viral with AI
          </h2>
          <p className="text-muted-foreground">
            {/** Se ainda não passou pelo primeiro contato, mostramos instruções mais gerais */}
            {firstContactDone
              ? "Conteúdos virais prontos para sua estratégia!"
              : "Vamos começar com sua ativação no VIRALGEN"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat e Input */}
          <div className="lg:col-span-2 space-y-4">
            {/* Histórico de Chat */}
            <div className="rounded-xl border-2 border-primary/10 bg-card p-4 h-[300px] overflow-y-auto">
              {chatHistory.length > 0 ? (
                <div className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 ${message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
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
                    {firstContactDone
                      ? "Peça ideias de conteúdo ou comece a conversa aqui."
                      : "Responda às perguntas para ativar seu perfil."}
                  </p>
                </div>
              )}
            </div>

            {/* Se o bloco 1 já terminou, mostramos prompts sugeridos e opções */}
            {firstContactDone && (
              <>
                <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />

                <ContentGenerationOptions
                  options={generationOptions}
                  onOptionsChange={setGenerationOptions}
                />
              </>
            )}

            {/* Formulário de Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder={
                    firstContactDone
                      ? "O que você precisa hoje?"
                      : "Digite aqui sua resposta..."
                  }
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
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Enviar</span>
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

                  {generationOptions.categorized && firstContactDone && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Categorized Mode
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(contentIdeas.length > 0 || categorizedContent.length > 0) &&
                    firstContactDone && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-full"
                        onClick={clearResults}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear Results
                      </Button>
                    )}
                </div>
              </div>
            </form>
          </div>

          {/* Seção de Resultados */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border-2 border-primary/10 bg-card p-4 h-full">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-secondary" />
                {firstContactDone ? "Generated Ideas" : "Bem‐vind@ ao VIRALGEN"}
              </h3>

              {/*
                Se ainda não concluiu o primeiro contato, não mostramos resultados de geração.
                Mostramos instruções ou placeholder. 
              */}
              {!firstContactDone ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="inline-block p-4 rounded-full bg-secondary/10 mb-4">
                    <Sparkles className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Aguardando seu primeiro contato
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    {`
                      Responda às perguntas acima para ativar seu perfil no Viralgen.
                      Assim que terminar, você poderá gerar ideias de conteúdo normalmente.
                    `}
                  </p>
                </div>
              ) : isLoading ? (
                // Se estiver gerando ideias de conteúdo (após firstContactDone)
                <div className="flex flex-col items-center justify-center h-[400px]">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-secondary animate-spin"></div>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Generating viral content ideas...
                  </p>
                </div>
              ) : error ? (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
                  <p className="text-destructive">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setError(null)}
                  >
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
                    <h3 className="text-lg font-medium mb-2">
                      No Categories Generated Yet
                    </h3>
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
                      <ContentIdeaCard
                        idea={idea}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="inline-block p-4 rounded-full bg-secondary/10 mb-4">
                    <Sparkles className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No Ideas Generated Yet
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Enter a prompt and click generate to create viral content ideas
                    for your business.
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
