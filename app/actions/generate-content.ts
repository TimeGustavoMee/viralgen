"use server"

export interface ContentIdea {
  id: string
  title: string
  description: string
  isFavorite: boolean
  format?: string
  platform?: string
  tags?: string[]
  estimatedEngagement?: string
  difficulty?: "easy" | "medium" | "hard"
  timeToCreate?: string
  bestTimeToPost?: string
  targetAudience?: string
  variations?: string[]
}

export interface ContentCategory {
  name: string
  ideas: ContentIdea[]
}

// Mock function to generate content ideas without requiring an API key
export async function generateContentIdeas(
  prompt: string,
  options?: {
    platform?: string
    format?: string
    tone?: string
    audience?: string
    count?: number
  },
): Promise<ContentIdea[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate a deterministic but seemingly random ID based on the prompt
    const generateId = (index: number) => `idea-${Date.now()}-${index}`

    // Create mock content ideas based on the prompt
    let ideas: ContentIdea[] = []

    // Extract options
    const platform = options?.platform || getContentPlatform(prompt)
    const format = options?.format || getContentFormat(prompt)
    const count = options?.count || 5

    // Different templates based on common content types
    if (platform === "instagram" || format === "carousel") {
      ideas = [
        {
          id: generateId(0),
          title: "Day in the Life",
          description: `Create a carousel showing a day in your life as a ${getBusinessType(prompt)}. Start with morning routines, show behind-the-scenes of your work, and end with how you wind down. This format consistently gets high engagement as it satisfies curiosity about how professionals in your field operate daily.`,
          isFavorite: false,
          format: "Carousel",
          platform: "Instagram",
          tags: ["dayinthelife", "behindthescenes", "business", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "High",
          difficulty: "medium",
          timeToCreate: "2-3 hours",
          bestTimeToPost: "Weekdays, 12-2pm",
          targetAudience: "Followers interested in your industry process",
          variations: [
            "Morning routine to evening wind-down",
            "Focus on the most challenging part of your day",
            "Show the tools and equipment you use daily",
          ],
        },
        {
          id: generateId(1),
          title: "Before and After Transformation",
          description: `Share impressive before and after results from your ${getBusinessType(prompt)}. The first slide should show the "before" state, creating curiosity, then reveal the transformation in subsequent slides. This format works because it demonstrates your expertise and the tangible value you provide.`,
          isFavorite: false,
          format: "Carousel",
          platform: "Instagram",
          tags: ["beforeandafter", "transformation", "results", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "Very High",
          difficulty: "easy",
          timeToCreate: "1-2 hours",
          bestTimeToPost: "Weekends, 10am-12pm",
          targetAudience: "Potential customers considering your services",
          variations: [
            "Multiple before/after examples in one carousel",
            "Show the process steps between before and after",
            "Include client testimonial quotes with the transformation",
          ],
        },
        {
          id: generateId(2),
          title: "5 Myths About Your Industry",
          description: `Create a carousel debunking 5 common myths about ${getBusinessType(prompt)}. Each slide should address one myth and provide the truth with a brief explanation. This format positions you as an authority while educating your audience on misconceptions they might have about your industry.`,
          isFavorite: false,
          format: "Carousel",
          platform: "Instagram",
          tags: ["mythbusting", "industrytips", "education", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "High",
          difficulty: "medium",
          timeToCreate: "2-3 hours",
          bestTimeToPost: "Weekdays, 4-6pm",
          targetAudience: "Both existing and potential customers",
          variations: [
            "Focus on beginner misconceptions",
            "Address advanced industry myths",
            "Compare common beliefs vs reality",
          ],
        },
        {
          id: generateId(3),
          title: "Client Success Story",
          description: `Share a detailed case study of how you helped a client achieve results. Start with their challenge, show your process, and end with impressive results. Include testimonial quotes and specific metrics. This storytelling approach builds trust and shows potential clients what's possible when working with you.`,
          isFavorite: false,
          format: "Carousel",
          platform: "Instagram",
          tags: ["casestudy", "success", "testimonial", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "Medium-High",
          difficulty: "medium",
          timeToCreate: "3-4 hours",
          bestTimeToPost: "Weekdays, 9-11am",
          targetAudience: "Potential clients in the decision-making phase",
          variations: [
            "Focus on the emotional journey of the client",
            "Highlight the ROI and specific metrics",
            "Show multiple client success stories briefly",
          ],
        },
        {
          id: generateId(4),
          title: "Quick Tips Carousel",
          description: `Create a carousel with 5-7 actionable tips related to ${getBusinessType(prompt)}. Each slide should contain one specific, valuable tip that your audience can implement immediately. This format works because it provides immediate value and positions you as a helpful resource rather than just a service provider.`,
          isFavorite: false,
          format: "Carousel",
          platform: "Instagram",
          tags: ["tips", "quicktips", "howto", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "High",
          difficulty: "easy",
          timeToCreate: "1-2 hours",
          bestTimeToPost: "Weekdays, 12-2pm or 7-9pm",
          targetAudience: "Audience looking for practical advice",
          variations: [
            "Beginner tips for newcomers",
            "Advanced tips for experienced audience",
            "Seasonal or trending topic tips",
          ],
        },
      ]
    } else if (platform === "tiktok" || platform === "reels" || format === "video") {
      ideas = [
        {
          id: generateId(0),
          title: "Behind-the-Scenes Process",
          description: `Create a fast-paced video showing how you create/deliver your ${getBusinessType(prompt)} product or service. Use trending music and quick transitions. This format works because people love seeing how things are made, and it humanizes your brand while showcasing your expertise.`,
          isFavorite: false,
          format: "Short Video",
          platform: platform === "tiktok" ? "TikTok" : "Instagram Reels",
          tags: ["behindthescenes", "process", "howitsmade", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "High",
          difficulty: "medium",
          timeToCreate: "2-3 hours",
          bestTimeToPost: "Weekdays, 10am-1pm or 7-9pm",
          targetAudience: "Curious followers interested in your process",
          variations: [
            "Speed up the entire process to fit in 30 seconds",
            "Focus on one surprising aspect of your process",
            "Show common mistakes to avoid in your process",
          ],
        },
        {
          id: generateId(1),
          title: "Common Mistakes to Avoid",
          description: `Create a video highlighting 3-5 common mistakes people make related to ${getBusinessType(prompt)}. Start with a hook like "You're doing [activity] all wrong!" then provide valuable corrections. This format works because it triggers curiosity and provides immediate value.`,
          isFavorite: false,
          format: "Short Video",
          platform: platform === "tiktok" ? "TikTok" : "Instagram Reels",
          tags: ["mistakes", "tips", "advice", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "Very High",
          difficulty: "easy",
          timeToCreate: "1-2 hours",
          bestTimeToPost: "Weekdays, 12-3pm",
          targetAudience: "Both beginners and experienced audience in your niche",
          variations: [
            "Focus on beginner mistakes only",
            "Show expensive mistakes that cost people money",
            "Demonstrate before (wrong) and after (correct) techniques",
          ],
        },
        {
          id: generateId(2),
          title: "Day in the Life",
          description: `Film snippets throughout your day as a ${getBusinessType(prompt)} professional. Show morning routine, work activities, challenges, and wins. This format works because it satisfies curiosity about your profession while creating relatability and trust.`,
          isFavorite: false,
          format: "Short Video",
          platform: platform === "tiktok" ? "TikTok" : "Instagram Reels",
          tags: ["dayinthelife", "routine", "business", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "Medium-High",
          difficulty: "medium",
          timeToCreate: "Full day to film, 1-2 hours to edit",
          bestTimeToPost: "Weekdays, 7-9am or 7-9pm",
          targetAudience: "Followers interested in your lifestyle and work",
          variations: [
            "Focus only on your morning routine",
            "Show a challenging day with problems to solve",
            "Feature team members and collaboration",
          ],
        },
        {
          id: generateId(3),
          title: "Before/After Transformation",
          description: `Create a video showing dramatic before and after results from your ${getBusinessType(prompt)}. Use a trending transition effect between the before and after shots. This format works because transformation content is inherently engaging and demonstrates your value proposition clearly.`,
          isFavorite: false,
          format: "Short Video",
          platform: platform === "tiktok" ? "TikTok" : "Instagram Reels",
          tags: ["beforeandafter", "transformation", "results", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "Very High",
          difficulty: "easy",
          timeToCreate: "1-2 hours",
          bestTimeToPost: "Weekends, 10am-1pm",
          targetAudience: "Potential customers considering your services",
          variations: [
            "Multiple transformations in one video",
            "Show the process between before and after",
            "Include client reaction to their transformation",
          ],
        },
        {
          id: generateId(4),
          title: "Trending Sound Adaptation",
          description: `Take a currently trending sound on TikTok/Reels and adapt it to your ${getBusinessType(prompt)} niche. Put your own creative spin on it while maintaining the original format that made it go viral. This works because you're leveraging existing viral momentum while adding your unique perspective.`,
          isFavorite: false,
          format: "Short Video",
          platform: platform === "tiktok" ? "TikTok" : "Instagram Reels",
          tags: ["trending", "challenge", "viral", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "Very High",
          difficulty: "medium",
          timeToCreate: "1-3 hours",
          bestTimeToPost: "Weekdays, 9-11am or 7-9pm",
          targetAudience: "Broader audience beyond your followers",
          variations: [
            "Combine multiple trending sounds in one video",
            "Create a duet with another creator in your niche",
            "Put an unexpected twist on the trend",
          ],
        },
      ]
    } else {
      // Generic content ideas for any type of business
      ideas = [
        {
          id: generateId(0),
          title: "Problem-Solution Framework",
          description: `Create content that identifies a common problem your target audience faces related to ${getBusinessType(prompt)}, then present your product/service as the solution. Include specific pain points and how exactly you solve them. This framework works because it connects emotionally with audience frustrations before offering relief.`,
          isFavorite: false,
          format: "Multi-purpose",
          platform: "Any",
          tags: ["problem", "solution", "value", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "High",
          difficulty: "medium",
          timeToCreate: "2-3 hours",
          bestTimeToPost: "Weekdays, 9-11am",
          targetAudience: "Potential customers experiencing the problem",
          variations: [
            "Focus on one major problem and detailed solution",
            "Address multiple small problems with quick solutions",
            "Show customer testimonials about the problem solved",
          ],
        },
        {
          id: generateId(1),
          title: "Expert Tips Series",
          description: `Share 3-5 insider tips related to ${getBusinessType(prompt)} that most people don't know about. Position these as "secrets" or "hacks" that you've learned through your expertise. This format works because it provides immediate value while establishing your authority in the field.`,
          isFavorite: false,
          format: "Multi-purpose",
          platform: "Any",
          tags: ["tips", "expert", "advice", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "Medium-High",
          difficulty: "easy",
          timeToCreate: "1-2 hours",
          bestTimeToPost: "Weekdays, 12-2pm",
          targetAudience: "Both beginners and experienced audience in your niche",
          variations: ["Focus on money-saving tips", "Share time-saving tips", "Reveal industry insider knowledge"],
        },
        {
          id: generateId(2),
          title: "Client Success Story",
          description: `Share a detailed case study of how you helped a client achieve results in the ${getBusinessType(prompt)} space. Include specific challenges, your approach, and measurable outcomes. This storytelling approach builds trust and helps prospects see themselves in the success story.`,
          isFavorite: false,
          format: "Multi-purpose",
          platform: "Any",
          tags: ["casestudy", "success", "results", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "Medium",
          difficulty: "medium",
          timeToCreate: "3-4 hours",
          bestTimeToPost: "Weekdays, 9-11am",
          targetAudience: "Potential clients in the decision-making phase",
          variations: [
            "Focus on the emotional journey of the client",
            "Highlight the ROI and specific metrics",
            "Show the step-by-step process you used",
          ],
        },
        {
          id: generateId(3),
          title: "Myth vs. Reality",
          description: `Debunk a common misconception about ${getBusinessType(prompt)}. Start with the myth many believe, explain why it's wrong, then provide the correct information. This format works because it challenges assumptions while positioning you as a trusted source of accurate information.`,
          isFavorite: false,
          format: "Multi-purpose",
          platform: "Any",
          tags: ["mythbusting", "facts", "education", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "High",
          difficulty: "medium",
          timeToCreate: "2-3 hours",
          bestTimeToPost: "Weekdays, 4-6pm",
          targetAudience: "Both existing and potential customers",
          variations: [
            "Address multiple myths in one piece",
            "Show the consequences of believing the myth",
            "Include statistics or research to back up reality",
          ],
        },
        {
          id: generateId(4),
          title: "Day in the Life",
          description: `Show what a typical day looks like in your ${getBusinessType(prompt)} business. Include behind-the-scenes moments, challenges you face, and how you deliver value to clients. This humanizes your brand and satisfies curiosity about how you operate.`,
          isFavorite: false,
          format: "Multi-purpose",
          platform: "Any",
          tags: ["dayinthelife", "behindthescenes", "business", getBusinessType(prompt).replace(/\s+/g, "")],
          estimatedEngagement: "Medium-High",
          difficulty: "medium",
          timeToCreate: "Full day to document, 2-3 hours to create",
          bestTimeToPost: "Weekdays, 12-2pm",
          targetAudience: "Followers interested in your business process",
          variations: [
            "Focus on the most interesting part of your day",
            "Show a day with a specific challenge",
            "Feature different team members throughout the day",
          ],
        },
      ]
    }

    // Generate additional ideas if needed to meet the count
    while (ideas.length < count) {
      // Clone and modify existing ideas with variations
      const baseIdea = ideas[ideas.length % 5]
      const newIdea = {
        ...baseIdea,
        id: generateId(ideas.length),
        title: baseIdea.title + " (Variation)",
        description: "Alternative approach: " + baseIdea.description,
      }
      ideas.push(newIdea)
    }

    // Limit to requested count
    ideas = ideas.slice(0, count)

    return ideas
  } catch (error) {
    console.error("Error generating content ideas:", error)
    // Return a friendly error message
    return [
      {
        id: `idea-${Date.now()}-error`,
        title: "Generation Error",
        description: "We encountered an error while generating your content ideas. Please try again in a moment.",
        isFavorite: false,
      },
    ]
  }
}

// Generate categorized content ideas
export async function generateCategorizedContent(prompt: string): Promise<ContentCategory[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const businessType = getBusinessType(prompt)

    // Generate ideas for different categories
    const engagementIdeas = await generateContentIdeas(prompt + " for high engagement", { count: 3 })
    const salesIdeas = await generateContentIdeas(prompt + " to drive sales", { count: 3 })
    const brandingIdeas = await generateContentIdeas(prompt + " for brand awareness", { count: 3 })
    const educationalIdeas = await generateContentIdeas(prompt + " educational content", { count: 3 })

    return [
      {
        name: "High Engagement",
        ideas: engagementIdeas,
      },
      {
        name: "Sales & Conversion",
        ideas: salesIdeas,
      },
      {
        name: "Brand Awareness",
        ideas: brandingIdeas,
      },
      {
        name: "Educational Content",
        ideas: educationalIdeas,
      },
    ]
  } catch (error) {
    console.error("Error generating categorized content:", error)
    return [
      {
        name: "Error",
        ideas: [
          {
            id: `idea-${Date.now()}-error`,
            title: "Generation Error",
            description: "We encountered an error while generating your content ideas. Please try again in a moment.",
            isFavorite: false,
          },
        ],
      },
    ]
  }
}

// Helper function to extract business type from prompt
function getBusinessType(prompt: string): string {
  // Extract business type from prompt or return a generic term
  const businessTypes = [
    "fitness coach",
    "restaurant",
    "bakery",
    "salon",
    "gym",
    "dentist",
    "photographer",
    "consultant",
    "coach",
    "store",
    "agency",
    "service",
    "business",
  ]

  const foundType = businessTypes.find((type) => prompt.toLowerCase().includes(type))
  return foundType || "business"
}

// Helper function to extract content platform from prompt
function getContentPlatform(prompt: string): string {
  const platforms = [
    { keywords: ["instagram", "ig", "insta"], value: "instagram" },
    { keywords: ["tiktok", "tik tok", "tt"], value: "tiktok" },
    { keywords: ["reels", "reel", "instagram reels"], value: "reels" },
    { keywords: ["facebook", "fb"], value: "facebook" },
    { keywords: ["linkedin", "li"], value: "linkedin" },
    { keywords: ["twitter", "x", "tweet"], value: "twitter" },
    { keywords: ["youtube", "yt", "video"], value: "youtube" },
  ]

  for (const platform of platforms) {
    if (platform.keywords.some((keyword) => prompt.toLowerCase().includes(keyword))) {
      return platform.value
    }
  }

  return "any"
}

// Helper function to extract content format from prompt
function getContentFormat(prompt: string): string {
  const formats = [
    { keywords: ["carousel", "slides", "swipe"], value: "carousel" },
    { keywords: ["video", "reel", "tiktok", "clip"], value: "video" },
    { keywords: ["post", "image", "photo", "picture"], value: "post" },
    { keywords: ["story", "stories"], value: "story" },
    { keywords: ["blog", "article"], value: "blog" },
    { keywords: ["infographic", "graphic"], value: "infographic" },
  ]

  for (const format of formats) {
    if (format.keywords.some((keyword) => prompt.toLowerCase().includes(keyword))) {
      return format.value
    }
  }

  return "any"
}
