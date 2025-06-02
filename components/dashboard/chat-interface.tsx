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
  // 0 = mensagem de boas-vindas e pergunta “Seu nome completo:”
  // 1 = aguardando @ do Instagram
  // 2 = aguardando resposta “sim/​não/​um pouco”
  // 2.5 = ajuste de nível de IA (iniciante/intermediário/avançado)
  // 3 = confirmação de entendimento
  // 4 = mensagem de marco (criador ativado) e instruções da Missão 1
  // 5 = aguardando primeira ideia de conteúdo (Missão 1)
  const [firstContactStage, setFirstContactStage] = useState<number>(0);

  // Dados coletados no bloco 1
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

  // Quando true, o primeiro contato (bloco 1) foi concluído.
  const [firstContactDone, setFirstContactDone] = useState<boolean>(false);

  // -------------------------------------------------
  // 3) ESTADOS DO BLOCO 4 – CONSTRUÇÃO DE AUTORIDADE E POSICIONAMENTO VIRAL
  // -------------------------------------------------
  // Vamos criar um novo estado para controlar cada “stage” do Bloco 4.
  //   0 = Pergunta “Qual post seu mais repercutiu até agora?”
  //   1 = Pergunta “Como você se sentiu ao publicar esse post? E ao ver o resultado?”
  //   2 = Pergunta “O que você acha que mais conectou com o público?”
  //   3 = Pergunta “Você tem repetido esse tipo de conteúdo ou ainda não?”
  //     (nesse momento, marcamos tag: nucleo_viral_identificado)
  //   4 = Desenvolvimento de pilares: mensagem explicativa + tag: pilares_autoridade_ativos
  //        (apenas envio de texto; a escolha de “quando quiser avançar” será capturada no next stage)
  //   5 = Pergunta “Escolha um dos pilares (Posicionamento / Conexão / Estilo)”
  //   6 = Monitoramento de posicionamento: instrução para “Durante a semana, observe...”
  //        (apenas mensagem; aguardamos resposta de qual conteúdo mais impactou)
  //   7 = Pergunta “Qual conteúdo mais impactou?” (quando usuário reporta, marcamos tag: ajuste_posicionamento_ativo)
  //   8 = Fechamento do ciclo: mensagem final + tag: missao4_completa
  //   null = não estamos no Bloco 4 (fluxo de geração normal)
  const [block4Stage, setBlock4Stage] = useState<number | null>(null);

  // Armazenamos as respostas do usuário em cada etapa do Bloco 4
  const [block4Data, setBlock4Data] = useState<{
    viralPost?: string;
    feeling?: string;
    connectionReason?: string;
    repeatedContent?: string;
    chosenPillar?: string;
    mostImpactfulContent?: string;
  }>({});

  // -------------------------------------------------
  // 4) useEffect PARA INICIAR O BLOCO 1
  // -------------------------------------------------
  useEffect(() => {
    if (firstContactStage === 0) {
      setChatHistory([
        {
          type: "assistant",
          content: `🎉 Bem-vindo(a) oficialmente ao VIRALGEN – o projeto que transforma pessoas comuns em criadores virais com inteligência artificial.\n
Já ajudamos milhares de pessoas a saírem do zero e criarem conteúdos que se destacam. Agora é sua vez.\n
Eu sou o Agente Viral, seu assistente pessoal. Estou aqui pra te guiar passo a passo.\n\n
*Pra começar, me responde 3 coisas:*\n
1. **Seu nome completo:**\n
2. **Seu @ do Instagram (vai ser seu ID aqui dentro):**\n
3. **Você já usou IA pra criar conteúdo antes? (sim / não / um pouco)**\n\n
⚠️ Se não entender alguma coisa, digita “ajuda” e eu explico tudo com calma.`,
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
  // 5) useEffect PARA CRÉDITOS (mantive como antes)
  // -------------------------------------------------
  useEffect(() => {
    const loadCredits = () => {
      setCreditsUsed(1);
    };
    loadCredits();
  }, []);

  // -------------------------------------------------
  // 6) FUNÇÃO handleSubmit
  //    – Decide se está no Bloco 1, no Bloco 4 ou no fluxo normal de geração de conteúdo
  // -------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Se ainda não completou o primeiro contato → Bloco 1
    if (!firstContactDone) {
      await handleFirstContactSubmit(prompt.trim());
      setPrompt("");
      return;
    }

    // Se já terminou o Bloco 1 e block4Stage não é null → estamos no Bloco 4
    if (block4Stage !== null) {
      await handleBlock4Submit(prompt.trim());
      setPrompt("");
      return;
    }

    // Caso contrário, é o fluxo “normal” de geração de conteúdo
    handleNormalChatSubmit(e);
  };

  // -------------------------------------------------
  // 7) LÓGICA DO FLUXO BLOCO 1 (primeiro contato)
  // -------------------------------------------------
  async function handleFirstContactSubmit(userText: string) {
    // Se o usuário digitar "ajuda" (ou variações), mostramos mensagem de ajuda e não avançamos de etapa:
    if (userText.trim().toLowerCase() === "ajuda") {
      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: `🤖 *Como funciona o VIRALGEN?*\n\n1. No primeiro contato, eu peço seu nome, @ do Instagram e se você já usou IA.\n2. Depois, ajustamos seu nível de experiência com IA (iniciante/intermediário/avançado).\n3. Em seguida, você envia sua primeira ideia de conteúdo (Missão 1) e eu ajudo a refiná-la.\n4. Após concluir a Missão 1, entramos no Bloco 4 (Construção de Autoridade).`,
        },
      ]);
      return;
    }

    // Adiciona a mensagem do usuário ao histórico
    setChatHistory((prev) => [...prev, { type: "user", content: userText }]);

    switch (firstContactStage) {
      case 0:
        // Nome completo
        setFirstContactData((prev) => ({ ...prev, name: userText }));
        setFirstContactStage(1);
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `Ótimo, ${userText}! Agora me diz:\n\n**Seu @ do Instagram (vai ser seu ID aqui dentro):**`,
          },
        ]);
        break;

      case 1:
        // @ do Instagram
        const ig = userText;
        const igValid = ig.startsWith("@") && !ig.includes(" ");
        if (!igValid) {
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Consegue mandar seu @ certinho? Algo como **@seunome** ou **@seudominio**. Ele será usado pra acompanhar seu progresso aqui dentro.`,
            },
          ]);
        } else {
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

      case 2:
        // Resposta “sim” | “não” | “um pouco” ou ambíguo
        const respostaIA = userText.toLowerCase();
        if (
          respostaIA !== "sim" &&
          respostaIA !== "não" &&
          respostaIA !== "nao"

        ) {
          // Ambíguo → tratamos como intermediário e pedimos ajuste de nível
          setFirstContactData((prev) => ({ ...prev, iaUsage: "intermediário" }));
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Legal! Então vou te considerar como **intermediário** e te ajudar a destravar essa parte. Se preferir que eu te trate como **iniciante** ou **avançado**, me avisa.`,
            },
          ]);
          setFirstContactStage(2.5);
        } else {
          // Padroniza “nao” para “não”
          let padronizado = respostaIA === "nao" ? "não" : respostaIA;
          setFirstContactData((prev) => ({ ...prev, iaUsage: padronizado }));
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

      case 2.5:
        // Ajuste de nível: “iniciante” | “intermediário” | “avançado”
        const nivel = userText.toLowerCase();
        if (nivel !== "iniciante" && nivel !== "intermediário" && nivel !== "avançado") {
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Desculpa, não entendi. Se prefere que eu te trate como iniciante, intermediário ou avançado, me diz exatamente uma dessas palavras.`,
            },
          ]);
        } else {
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

      case 3:
        // Confirmação “entendi” ou “não entendi”
        const confirmacao = userText.toLowerCase();
        if (
          confirmacao !== "entendi" &&
          confirmacao !== "não entendi" &&
          confirmacao !== "nao entendi"
        ) {
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Por favor, responde “entendi” ou “não entendi”. Se você não entendeu, eu explico novamente.`,
            },
          ]);
        } else if (confirmacao === "não entendi" || confirmacao === "nao entendi") {
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Tudo bem, vou detalhar de novo:\n\n1. Você vai me enviar ideias ou rascunhos de conteúdo (texto, imagem, vídeo) e eu vou te ajudar a refinar.\n2. Vamos passo a passo: desde encontrar o tema até otimizar o texto e a estratégia de publicação.\n3. A ideia é você sair daqui sabendo usar IA de verdade para criar posts virais.\n\nMe fala “entendi” quando fizer sentido para continuarmos.`,
            },
          ]);
          // permanece em firstContactStage = 3
        } else {
          ;
          setFirstContactDone(true);
          setFirstContactStage(5);
          // Ao terminar a Missão 1, iniciamos o Bloco 4 (stage 0):
          setBlock4Stage(0);

          // Pergunta inicial do Bloco 4:
          setChatHistory((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `🎯 Identificação do Ponto Forte Viral*\n\nQual post seu mais repercutiu até agora?`,
            },
          ]);
        }
        break;

      case 5:
        // Já recebemos a primeira ideia de conteúdo → aqui, simplesmente mostramos feedback,
        // mas, como iniciamos o Bloco 4 no case 3, não vamos chegar aqui diretamente.
        // Deixamos apenas para referência futura, mas, na prática, as submissões irão para handleBlock4Submit.
        break;

      default:
        break;
    }
  }

  // -------------------------------------------------
  // 8) LÓGICA DO BLOCO 4
  // -------------------------------------------------
  async function handleBlock4Submit(userText: string) {
    // Adiciona a mensagem do usuário ao histórico
    setChatHistory((prev) => [...prev, { type: "user", content: userText }]);

    switch (block4Stage) {
      case 0:
        // Resposta: “Qual post seu mais repercutiu até agora?”
        setBlock4Data((prev) => ({ ...prev, viralPost: userText }));
        setBlock4Stage(1);
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `Como você se sentiu ao publicar esse post? E ao ver o resultado?`,
          },
        ]);
        break;

      case 1:
        // Resposta: “Como você se sentiu ao publicar esse post? E ao ver o resultado?”
        setBlock4Data((prev) => ({ ...prev, feeling: userText }));
        setBlock4Stage(2);
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `O que você acha que mais conectou com o público?`,
          },
        ]);
        break;

      case 2:
        // Resposta: “O que você acha que mais conectou com o público?”
        setBlock4Data((prev) => ({ ...prev, connectionReason: userText }));
        setBlock4Stage(3);
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `Você tem repetido esse tipo de conteúdo ou ainda não?`,
          },
        ]);
        break;

      case 3:
        // Resposta: “Você tem repetido esse tipo de conteúdo ou ainda não?”
        setBlock4Data((prev) => ({ ...prev, repeatedContent: userText }));
        // Tag: nucleo_viral_identificado
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `🏗️ *Desenvolvimento de Pilares de Autoridade*\n\nA partir do seu núcleo viral, vamos construir seus 3 pilares de autoridade:\n\n- Conteúdos que te posicionam como referência\n- Conteúdos que geram conexão emocional\n- Conteúdos que mostram sua identidade visual, tom de voz e diferencial competitivo\n\nQuando quiser avançar, me diz e eu trago ideias estratégicas prontas para esses pilares.`,
          },
        ]);
        setBlock4Stage(4);
        break;

      case 4:
        // O usuário apenas disse “quando quiser avançar” (ou algo equivalente).
        // Agora devemos perguntar sobre qual pilar quer focar.
        setBlock4Stage(7);
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `🎯 *Definição do Foco Semanal (Ciclo de Posicionamento)*\n\nEscolha um dos pilares para ser sua prioridade nos próximos dias:\n\n- Posicionamento\n- Conexão\n- Estilo\n\nQuando quiser prosseguir, responda exatamente um desses nomes.`,
          },
        ]);
        break;


      case 7:
        // O usuário indicou “qual conteúdo mais impactou”
        // Tag: ajuste_posicionamento_ativo
        setChatHistory((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `🏁 *Conclusão do Ciclo de Posicionamento*\n\nMissão concluída. Você começou a ser reconhecido. Agora é hora de se tornar inesquecível.\n\nSua voz já influencia. Agora vamos moldar o espaço que ela vai ocupar no seu nicho, com intenção e estratégia.`,
          },
        ]);
        setBlock4Stage(null);

        break;

    }
  }

  // -------------------------------------------------
  // 9) FLUXO “NORMAL” DE GERAÇÃO DE CONTEÚDO (já existente)
  // -------------------------------------------------
  const handleNormalChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

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
        description: `Viral content ideas have been created for você.`,
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
  // 10) Demais handlers (favoritar, selecionar prompt, clear results)
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
  // 11) RENDER (JSX)
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
            {firstContactDone && block4Stage === null
              ? "Conteúdos virais prontos para sua estratégia!"
              : !firstContactDone
                ? "Vamos começar com sua ativação no VIRALGEN"
                : "Estamos construindo sua autoridade e posicionamento viral"}
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
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 whitespace-pre-wrap ${message.type === "user"
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
                    {!firstContactDone
                      ? "Responda às perguntas para ativar seu perfil."
                      : block4Stage !== null
                        ? "Siga as instruções para evoluir sua autoridade e posicionamento."
                        : "Peça ideias de conteúdo ou comece a conversa aqui."}
                  </p>
                </div>
              )}
            </div>

            {/* Se o Bloco 1 já terminou e o Bloco 4 estiver concluído, mostramos prompts sugeridos e opções */}
            {firstContactDone && block4Stage === null && (
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
                    !firstContactDone
                      ? "Digite aqui sua resposta..."
                      : block4Stage !== null
                        ? "Digite aqui sua resposta para continuar o Bloco 4..."
                        : "O que você precisa hoje?"
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

                  {generationOptions.categorized && firstContactDone && block4Stage === null && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Categorized Mode
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(contentIdeas.length > 0 || categorizedContent.length > 0) &&
                    firstContactDone &&
                    block4Stage === null && (
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
                {!firstContactDone
                  ? "Bem‐vind@ ao VIRALGEN"
                  : block4Stage !== null
                    ? "Bloco 4: Autoridade e Posicionamento"
                    : "Generated Ideas"}
              </h3>

              {!firstContactDone ? (
                // Antes de concluir o Bloco 1
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="inline-block p-4 rounded-full bg-secondary/10 mb-4">
                    <Sparkles className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Aguardando seu primeiro contato
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Responda às perguntas acima para ativar seu perfil no Viralgen.
                    Assim que terminar, você entrará no Bloco 4 de autoridade.
                  </p>
                </div>
              ) : block4Stage !== null ? (
                // Durante o Bloco 4, mostra apenas histórico (não há “resultados de geração”)
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <p className="text-muted-foreground">
                    Continue respondendo as instruções para concluir o Bloco 4.
                  </p>
                </div>
              ) : isLoading ? (
                // Fluxo normal de geração, após Bloco 4 concluído
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
  )
}
;
