"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Settings,
  Building,
  Target,
  MessageSquare,
  Palette,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  PenTool,
  Save,
  Trash2,
  Upload,
  Download,
  X,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"
import { Mascot } from "@/components/mascot"
import { toast } from "@/components/ui/use-toast"

// Define the user preferences type
interface UserPreferences {
  // Business Information
  businessName: string
  businessType: string
  industry: string
  niche: string
  businessSize: string
  yearsInBusiness: string
  website: string

  // Target Audience
  targetAge: string[]
  targetGender: string[]
  targetLocation: string
  targetInterests: string[]
  targetPainPoints: string[]

  // Content Preferences
  contentTone: string
  contentFormality: string
  contentLength: string
  contentFrequency: string
  contentEmojis: boolean
  contentHashtags: boolean
  contentCallToAction: boolean

  // Platform Preferences
  platforms: {
    instagram: boolean
    facebook: boolean
    tiktok: boolean
    twitter: boolean
    linkedin: boolean
    youtube: boolean
  }

  // Brand Voice
  brandValues: string[]
  brandPersonality: string
  brandDescription: string

  // Examples
  competitorUrls: string[]
  favoriteContent: string
  contentToAvoid: string
}

export function UserPreferencesForm() {
  const [formProgress, setFormProgress] = useState(60)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("business")

  // Initialize with default values
  const [preferences, setPreferences] = useState<UserPreferences>({
    // Business Information
    businessName: "ViralGen",
    businessType: "saas",
    industry: "technology",
    niche: "content creation",
    businessSize: "small",
    yearsInBusiness: "1-3",
    website: "viralgen.com",

    // Target Audience
    targetAge: ["25-34", "35-44"],
    targetGender: ["all"],
    targetLocation: "Global",
    targetInterests: ["marketing", "social media", "content creation"],
    targetPainPoints: ["time-consuming content creation", "lack of engagement", "inconsistent results"],

    // Content Preferences
    contentTone: "professional",
    contentFormality: "casual",
    contentLength: "medium",
    contentFrequency: "daily",
    contentEmojis: true,
    contentHashtags: true,
    contentCallToAction: true,

    // Platform Preferences
    platforms: {
      instagram: true,
      facebook: true,
      tiktok: true,
      twitter: true,
      linkedin: true,
      youtube: false,
    },

    // Brand Voice
    brandValues: ["innovation", "simplicity", "reliability"],
    brandPersonality: "helpful",
    brandDescription:
      "ViralGen helps entrepreneurs and creators generate viral content ideas using AI, with an ultra-simple and highly intuitive user experience.",

    // Examples
    competitorUrls: [],
    favoriteContent: "",
    contentToAvoid: "",
  })

  // Calculate progress based on filled fields
  useEffect(() => {
    const totalFields = Object.keys(preferences).length + Object.keys(preferences.platforms).length

    let filledFields = 0

    // Count filled fields
    Object.entries(preferences).forEach(([key, value]) => {
      if (key === "platforms") {
        Object.values(value).forEach((platformEnabled) => {
          if (platformEnabled) filledFields++
        })
      } else if (Array.isArray(value)) {
        if (value.length > 0) filledFields++
      } else if (typeof value === "boolean") {
        filledFields++
      } else if (value) {
        filledFields++
      }
    })

    const progress = Math.min(100, Math.round((filledFields / totalFields) * 100))
    setFormProgress(progress)
  }, [preferences])

  const handleSave = useCallback(() => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)

      // Show success animation
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)

      // Show toast
      toast({
        title: "Preferences saved",
        description: "Your content preferences have been updated successfully.",
      })
    }, 1000)
  }, [])

  const handleReset = useCallback(() => {
    // Show confirmation toast
    toast({
      title: "Preferences reset",
      description: "Your content preferences have been reset to default values.",
    })
  }, [])

  const handleExport = useCallback(() => {
    // Create a JSON blob and download it
    const blob = new Blob([JSON.stringify(preferences, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "viralgen-preferences.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast({
      title: "Preferences exported",
      description: "Your content preferences have been exported successfully.",
    })
  }, [preferences])

  const handleImport = useCallback(() => {
    // In a real app, this would open a file picker
    toast({
      title: "Import preferences",
      description: "This feature will be available in the next update.",
    })
  }, [])

  // Helper function to update preferences
  const updatePreference = useCallback((key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  // Helper function to update nested platform preferences
  const updatePlatform = useCallback((platform: keyof UserPreferences["platforms"], enabled: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: enabled,
      },
    }))
  }, [])

  // Helper function to update array preferences
  const updateArrayPreference = useCallback((key: keyof UserPreferences, value: string, add: boolean) => {
    setPreferences((prev) => {
      const currentArray = prev[key] as string[]
      let newArray

      if (add) {
        newArray = [...currentArray, value]
      } else {
        newArray = currentArray.filter((item) => item !== value)
      }

      return {
        ...prev,
        [key]: newArray,
      }
    })
  }, [])

  return (
    <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden relative">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-secondary" />
              Content Preferences
            </CardTitle>
            <CardDescription>
              Customize your content preferences to get more relevant and personalized content ideas.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleReset}>
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Import</span>
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Profile completion</span>
            <span>{formProgress}%</span>
          </div>
          <Progress value={formProgress} className="h-2 bg-muted [&>div]:bg-secondary" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 rounded-lg p-1 bg-muted mb-6">
              <TabsTrigger value="business" className="rounded-md data-[state=active]:bg-background">
                <Building className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Business</span>
              </TabsTrigger>
              <TabsTrigger value="audience" className="rounded-md data-[state=active]:bg-background">
                <Target className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Audience</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="rounded-md data-[state=active]:bg-background">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="platforms" className="rounded-md data-[state=active]:bg-background">
                <Instagram className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Platforms</span>
              </TabsTrigger>
              <TabsTrigger value="brand" className="rounded-md data-[state=active]:bg-background">
                <Palette className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Brand</span>
              </TabsTrigger>
              <TabsTrigger value="examples" className="rounded-md data-[state=active]:bg-background">
                <PenTool className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Examples</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Business Information Tab */}
          <TabsContent value="business" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  placeholder="Your Business Name"
                  value={preferences.businessName}
                  onChange={(e) => updatePreference("businessName", e.target.value)}
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="yourwebsite.com"
                  value={preferences.website}
                  onChange={(e) => updatePreference("website", e.target.value)}
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label htmlFor="business-type">Type of Business</Label>
                <Select
                  value={preferences.businessType}
                  onValueChange={(value) => updatePreference("businessType", value)}
                >
                  <SelectTrigger
                    id="business-type"
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  >
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="service">Service Provider</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="retail">Retail Store</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="nonprofit">Non-profit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Label htmlFor="industry">Industry</Label>
                <Select value={preferences.industry} onValueChange={(value) => updatePreference("industry", value)}>
                  <SelectTrigger
                    id="industry"
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  >
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Label htmlFor="niche">Specific Niche</Label>
                <Input
                  id="niche"
                  placeholder="Your specific niche"
                  value={preferences.niche}
                  onChange={(e) => updatePreference("niche", e.target.value)}
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Label htmlFor="business-size">Business Size</Label>
                <Select
                  value={preferences.businessSize}
                  onValueChange={(value) => updatePreference("businessSize", value)}
                >
                  <SelectTrigger
                    id="business-size"
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  >
                    <SelectValue placeholder="Select business size" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="solo">Solo Entrepreneur</SelectItem>
                    <SelectItem value="small">Small (2-10 employees)</SelectItem>
                    <SelectItem value="medium">Medium (11-50 employees)</SelectItem>
                    <SelectItem value="large">Large (51+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Label htmlFor="years-in-business">Years in Business</Label>
              <Select
                value={preferences.yearsInBusiness}
                onValueChange={(value) => updatePreference("yearsInBusiness", value)}
              >
                <SelectTrigger
                  id="years-in-business"
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                >
                  <SelectValue placeholder="Select years in business" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="4-10">4-10 years</SelectItem>
                  <SelectItem value="more-than-10">More than 10 years</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </TabsContent>

          {/* Target Audience Tab */}
          <TabsContent value="audience" className="space-y-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label>Target Age Groups</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["18-24", "25-34", "35-44", "45-54", "55-64", "65+"].map((age) => (
                  <Badge
                    key={age}
                    variant={preferences.targetAge.includes(age) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      preferences.targetAge.includes(age)
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-primary/10"
                    }`}
                    onClick={() => {
                      if (preferences.targetAge.includes(age)) {
                        updateArrayPreference("targetAge", age, false)
                      } else {
                        updateArrayPreference("targetAge", age, true)
                      }
                    }}
                  >
                    {age}
                  </Badge>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Label>Target Gender</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["male", "female", "all"].map((gender) => (
                  <Badge
                    key={gender}
                    variant={preferences.targetGender.includes(gender) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      preferences.targetGender.includes(gender)
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-primary/10"
                    }`}
                    onClick={() => {
                      // If selecting "all", clear others
                      if (gender === "all") {
                        updatePreference("targetGender", ["all"])
                      } else {
                        // If selecting specific gender, remove "all"
                        let newGenders = [...preferences.targetGender]
                        if (newGenders.includes("all")) {
                          newGenders = newGenders.filter((g) => g !== "all")
                        }

                        // Toggle the selected gender
                        if (newGenders.includes(gender)) {
                          newGenders = newGenders.filter((g) => g !== gender)
                          // If empty, default to "all"
                          if (newGenders.length === 0) {
                            newGenders = ["all"]
                          }
                        } else {
                          newGenders.push(gender)
                        }

                        updatePreference("targetGender", newGenders)
                      }
                    }}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Badge>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Label htmlFor="target-location">Target Location</Label>
              <Input
                id="target-location"
                placeholder="Global, US, Europe, etc."
                value={preferences.targetLocation}
                onChange={(e) => updatePreference("targetLocation", e.target.value)}
                className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Label>Target Interests</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "marketing",
                  "social media",
                  "content creation",
                  "business",
                  "technology",
                  "education",
                  "entertainment",
                  "lifestyle",
                ].map((interest) => (
                  <Badge
                    key={interest}
                    variant={preferences.targetInterests.includes(interest) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      preferences.targetInterests.includes(interest)
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-background hover:bg-secondary/10"
                    }`}
                    onClick={() => {
                      if (preferences.targetInterests.includes(interest)) {
                        updateArrayPreference("targetInterests", interest, false)
                      } else {
                        updateArrayPreference("targetInterests", interest, true)
                      }
                    }}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add custom interest and press Enter"
                className="mt-2 rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    updateArrayPreference("targetInterests", e.currentTarget.value.trim().toLowerCase(), true)
                    e.currentTarget.value = ""
                    e.preventDefault()
                  }
                }}
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Label>Target Pain Points</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.targetPainPoints.map((painPoint) => (
                  <Badge
                    key={painPoint}
                    variant="secondary"
                    className="bg-secondary/10 text-secondary border-secondary/20 flex items-center gap-1"
                  >
                    {painPoint}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full p-0 text-secondary"
                      onClick={() => updateArrayPreference("targetPainPoints", painPoint, false)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <Textarea
                placeholder="Describe the pain points your target audience experiences..."
                className="mt-2 min-h-[100px] rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && e.currentTarget.value.trim()) {
                    updateArrayPreference("targetPainPoints", e.currentTarget.value.trim(), true)
                    e.currentTarget.value = ""
                    e.preventDefault()
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Press Enter to add a pain point. Use Shift+Enter for new lines.
              </p>
            </motion.div>
          </TabsContent>

          {/* Content Preferences Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label htmlFor="content-tone">Content Tone</Label>
                <Select
                  value={preferences.contentTone}
                  onValueChange={(value) => updatePreference("contentTone", value)}
                >
                  <SelectTrigger
                    id="content-tone"
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  >
                    <SelectValue placeholder="Select content tone" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="funny">Funny</SelectItem>
                    <SelectItem value="serious">Serious</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label htmlFor="content-formality">Content Formality</Label>
                <Select
                  value={preferences.contentFormality}
                  onValueChange={(value) => updatePreference("contentFormality", value)}
                >
                  <SelectTrigger
                    id="content-formality"
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  >
                    <SelectValue placeholder="Select content formality" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="semi-formal">Semi-formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="very-casual">Very casual</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label htmlFor="content-length">Preferred Content Length</Label>
                <Select
                  value={preferences.contentLength}
                  onValueChange={(value) => updatePreference("contentLength", value)}
                >
                  <SelectTrigger
                    id="content-length"
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  >
                    <SelectValue placeholder="Select content length" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="short">Short (brief and concise)</SelectItem>
                    <SelectItem value="medium">Medium (balanced length)</SelectItem>
                    <SelectItem value="long">Long (detailed and comprehensive)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Label htmlFor="content-frequency">Content Posting Frequency</Label>
                <Select
                  value={preferences.contentFrequency}
                  onValueChange={(value) => updatePreference("contentFrequency", value)}
                >
                  <SelectTrigger
                    id="content-frequency"
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  >
                    <SelectValue placeholder="Select posting frequency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="several-times-week">Several times a week</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <h3 className="text-sm font-medium">Content Elements</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="content-emojis">Use Emojis</Label>
                  <p className="text-sm text-muted-foreground">Include emojis in generated content</p>
                </div>
                <Switch
                  id="content-emojis"
                  checked={preferences.contentEmojis}
                  onCheckedChange={(checked) => updatePreference("contentEmojis", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="content-hashtags">Include Hashtags</Label>
                  <p className="text-sm text-muted-foreground">Generate relevant hashtags for social media</p>
                </div>
                <Switch
                  id="content-hashtags"
                  checked={preferences.contentHashtags}
                  onCheckedChange={(checked) => updatePreference("contentHashtags", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="content-cta">Include Call-to-Actions</Label>
                  <p className="text-sm text-muted-foreground">Add clear CTAs to engage your audience</p>
                </div>
                <Switch
                  id="content-cta"
                  checked={preferences.contentCallToAction}
                  onCheckedChange={(checked) => updatePreference("contentCallToAction", checked)}
                />
              </div>
            </motion.div>
          </TabsContent>

          {/* Platform Preferences Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-sm font-medium">Select Your Active Platforms</h3>
              <p className="text-sm text-muted-foreground">Choose the platforms where you want to publish content</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                  <Instagram className="h-8 w-8 text-pink-500" />
                  <div className="flex-1">
                    <h4 className="font-medium">Instagram</h4>
                    <p className="text-sm text-muted-foreground">Photos, carousels, reels, stories</p>
                  </div>
                  <Switch
                    checked={preferences.platforms.instagram}
                    onCheckedChange={(checked) => updatePlatform("instagram", checked)}
                  />
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                  <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.25C6.85 2.25 2.25 6.85 2.25 12c0 5.15 4.6 9.75 9.75 9.75 5.15 0 9.75-4.6 9.75-9.75 0-5.15-4.6-9.75-9.75-9.75zm3.75 6.75h-2.25v-1.5c0-.83.67-1.5 1.5-1.5h.75V3.75h-.75c-2.07 0-3.75 1.68-3.75 3.75v1.5H9v2.25h2.25V20.25h2.25V11.25h2.25l.75-2.25z" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-medium">Facebook</h4>
                    <p className="text-sm text-muted-foreground">Posts, videos, stories, groups</p>
                  </div>
                  <Switch
                    checked={preferences.platforms.facebook}
                    onCheckedChange={(checked) => updatePlatform("facebook", checked)}
                  />
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                  <svg className="h-8 w-8 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-medium">TikTok</h4>
                    <p className="text-sm text-muted-foreground">Short-form videos</p>
                  </div>
                  <Switch
                    checked={preferences.platforms.tiktok}
                    onCheckedChange={(checked) => updatePlatform("tiktok", checked)}
                  />
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                  <Twitter className="h-8 w-8 text-blue-400" />
                  <div className="flex-1">
                    <h4 className="font-medium">Twitter</h4>
                    <p className="text-sm text-muted-foreground">Tweets, threads, spaces</p>
                  </div>
                  <Switch
                    checked={preferences.platforms.twitter}
                    onCheckedChange={(checked) => updatePlatform("twitter", checked)}
                  />
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                  <Linkedin className="h-8 w-8 text-blue-700" />
                  <div className="flex-1">
                    <h4 className="font-medium">LinkedIn</h4>
                    <p className="text-sm text-muted-foreground">Professional posts, articles</p>
                  </div>
                  <Switch
                    checked={preferences.platforms.linkedin}
                    onCheckedChange={(checked) => updatePlatform("linkedin", checked)}
                  />
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                  <Youtube className="h-8 w-8 text-red-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">YouTube</h4>
                    <p className="text-sm text-muted-foreground">Long-form videos, shorts</p>
                  </div>
                  <Switch
                    checked={preferences.platforms.youtube}
                    onCheckedChange={(checked) => updatePlatform("youtube", checked)}
                  />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Brand Voice Tab */}
          <TabsContent value="brand" className="space-y-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label>Brand Values</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "innovation",
                  "quality",
                  "reliability",
                  "simplicity",
                  "creativity",
                  "authenticity",
                  "transparency",
                  "sustainability",
                  "inclusivity",
                  "excellence",
                ].map((value) => (
                  <Badge
                    key={value}
                    variant={preferences.brandValues.includes(value) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      preferences.brandValues.includes(value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-primary/10"
                    }`}
                    onClick={() => {
                      if (preferences.brandValues.includes(value)) {
                        updateArrayPreference("brandValues", value, false)
                      } else {
                        updateArrayPreference("brandValues", value, true)
                      }
                    }}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add custom value and press Enter"
                className="mt-2 rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    updateArrayPreference("brandValues", e.currentTarget.value.trim().toLowerCase(), true)
                    e.currentTarget.value = ""
                    e.preventDefault()
                  }
                }}
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Label htmlFor="brand-personality">Brand Personality</Label>
              <Select
                value={preferences.brandPersonality}
                onValueChange={(value) => updatePreference("brandPersonality", value)}
              >
                <SelectTrigger
                  id="brand-personality"
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                >
                  <SelectValue placeholder="Select brand personality" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="helpful">Helpful & Supportive</SelectItem>
                  <SelectItem value="authoritative">Authoritative & Expert</SelectItem>
                  <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                  <SelectItem value="innovative">Innovative & Forward-thinking</SelectItem>
                  <SelectItem value="playful">Playful & Fun</SelectItem>
                  <SelectItem value="luxurious">Luxurious & Premium</SelectItem>
                  <SelectItem value="trustworthy">Trustworthy & Reliable</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Label htmlFor="brand-description">Brand Description</Label>
              <Textarea
                id="brand-description"
                placeholder="Describe your brand in a few sentences"
                className="min-h-[150px] rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                value={preferences.brandDescription}
                onChange={(e) => updatePreference("brandDescription", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Describe your brand's mission, vision, and what makes it unique.
              </p>
            </motion.div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label>Competitor URLs</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.competitorUrls.map((url) => (
                  <Badge
                    key={url}
                    variant="secondary"
                    className="bg-secondary/10 text-secondary border-secondary/20 flex items-center gap-1"
                  >
                    {url}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full p-0 text-secondary"
                      onClick={() => updateArrayPreference("competitorUrls", url, false)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add competitor URL and press Enter (e.g., competitor.com)"
                className="mt-2 rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    updateArrayPreference("competitorUrls", e.currentTarget.value.trim(), true)
                    e.currentTarget.value = ""
                    e.preventDefault()
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Add URLs of competitors whose content style you admire or want to analyze.
              </p>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Label htmlFor="favorite-content">Content You Like</Label>
              <Textarea
                id="favorite-content"
                placeholder="Paste examples of content you like or describe what you like about certain content"
                className="min-h-[100px] rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                value={preferences.favoriteContent}
                onChange={(e) => updatePreference("favoriteContent", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Examples help us understand your style preferences.</p>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Label htmlFor="content-to-avoid">Content to Avoid</Label>
              <Textarea
                id="content-to-avoid"
                placeholder="Describe content styles, topics, or approaches you want to avoid"
                className="min-h-[100px] rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                value={preferences.contentToAvoid}
                onChange={(e) => updatePreference("contentToAvoid", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Help us understand what not to generate for your brand.</p>
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <div className="relative order-2 sm:order-1">
            <Mascot emotion="thinking" message="These details help me create better content ideas for you!" size="md" />
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-full btn-bounce bg-secondary hover:bg-secondary/90 text-secondary-foreground order-1 sm:order-2 w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {/* Success animation */}
      {showSuccess && (
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <CheckCircle2 className="h-16 w-16 text-secondary mb-4" />
            <h3 className="text-xl font-bold mb-2">Preferences Saved!</h3>
            <p className="text-muted-foreground">Your content will now be more personalized.</p>
          </motion.div>
        </motion.div>
      )}
    </Card>
  )
}
