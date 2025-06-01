// app/(private)/dashboard/settings/UserPreferencesForm.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  Save as SaveIcon,
  Trash2,
  Upload,
  Download,
  X,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Mascot } from "@/components/mascot";
import { toast } from "@/components/ui/use-toast";

import {
  UpdatePreferencesData,
  updatePreferencesSchema,
  TargetAge,
  TargetGender,
} from "@/app/(private)/dashboard/settings/type";

import { savePref } from "@/app/(private)/dashboard/settings/actions";
import { updateContentPreferencesAction } from "@/app/(private)/dashboard/settings/contentAction";

interface PrefsFromServer {
  businessInfo: {
    business_name: string;
    business_type: string;
    industry: string;
    niche: string;
    business_size: string;
    years_in_business: string;
    website: string;
  } | null;
  targetAudience: {
    target_age: string[];
    target_gender: string[];
    target_location: string;
    target_interests: string[];
    target_pain_points: string[];
  } | null;
  contentPreferences: {
    content_tone: string;
    content_formality: string;
    content_length: string;
    content_frequency: string;
    content_emojis: boolean;
    content_hashtags: boolean;
    // cta?: boolean;
  } | null;
  platformPreferences: {
    instagram: boolean;
    facebook: boolean;
    tiktok: boolean;
    twitter: boolean;
    linkedin: boolean;
    youtube: boolean;
  } | null;
  brandVoice: {
    brand_values: string[];
    brand_personality: string;
    brand_description: string;
  } | null;
  examples: {
    competitor_urls: string[];
    favorite_content: string;
    content_to_avoid: string;
  } | null;
}

export function UserPreferencesForm({ data }: { data: PrefsFromServer }) {
  const {
    businessInfo,
    targetAudience,
    contentPreferences,
    platformPreferences,
    brandVoice,
    examples,
  } = data;

  // Mapeia snake_case → camelCase
  const mappedData: UpdatePreferencesData = {
    // === BUSINESS INFORMATION ===
    businessName: businessInfo?.business_name ?? "",
    businessType: (
      [
        "saas",
        "ecommerce",
        "service_provider",
        "agency",
        "restaurant",
        "retail_store",
        "healthcare",
        "education",
        "non_profit",
        "other",
      ] as const
    ).includes(businessInfo?.business_type as any)
      ? (businessInfo?.business_type as
          | "saas"
          | "ecommerce"
          | "service_provider"
          | "agency"
          | "restaurant"
          | "retail_store"
          | "healthcare"
          | "education"
          | "non_profit"
          | "other")
      : undefined,
    industry: (
      [
        "technology",
        "marketing",
        "healthcare",
        "finance",
        "education",
        "food & Beverage",
        "fashion",
        "travel",
        "fitness",
        "beauty",
        "other",
      ] as const
    ).includes(businessInfo?.industry as any)
      ? (businessInfo?.industry as
          | "technology"
          | "marketing"
          | "healthcare"
          | "finance"
          | "education"
          | "food & Beverage"
          | "fashion"
          | "travel"
          | "fitness"
          | "beauty"
          | "other")
      : undefined,
    niche: businessInfo?.niche ?? "",
    businessSize: (
      ["solo_entrepreneur", "small", "medium", "large"] as const
    ).includes(businessInfo?.business_size as any)
      ? (businessInfo?.business_size as
          | "solo_entrepreneur"
          | "small"
          | "medium"
          | "large")
      : undefined,
    yearsInBusiness: (
      ["less_1_year", "1_3_years", "4_10_years", "more_10_years"] as const
    ).includes(businessInfo?.years_in_business as any)
      ? (businessInfo?.years_in_business as
          | "less_1_year"
          | "1_3_years"
          | "4_10_years"
          | "more_10_years")
      : undefined,
    website: businessInfo?.website ?? "",

    // === TARGET AUDIENCE ===
    targetAge:
      (targetAudience?.target_age?.filter((age): age is TargetAge =>
        ["18–24", "25–34", "35–44", "45–54", "55–64", "65+"].includes(age)
      ) as TargetAge[]) ?? [],
    targetGender:
      (targetAudience?.target_gender?.filter((gender): gender is TargetGender =>
        ["male", "female", "all"].includes(gender)
      ) as TargetGender[]) ?? [],
    targetLocation: targetAudience?.target_location ?? "",
    targetInterests: targetAudience?.target_interests ?? [],
    targetPainPoints: targetAudience?.target_pain_points ?? [],

    // === CONTENT PREFERENCES ===
    contentTone: (
      [
        "professional",
        "casual",
        "funny",
        "serious",
        "inspirational",
        "educational",
        "conversational",
      ] as const
    ).includes(contentPreferences?.content_tone as any)
      ? (contentPreferences?.content_tone as
          | "professional"
          | "casual"
          | "funny"
          | "serious"
          | "inspirational"
          | "educational"
          | "conversational")
      : undefined,
    contentFormality: (
      ["formal", "semi_formal", "casual", "very_casual"] as const
    ).includes(contentPreferences?.content_formality as any)
      ? (contentPreferences?.content_formality as
          | "formal"
          | "semi_formal"
          | "casual"
          | "very_casual")
      : undefined,
    contentLength: (["short", "medium", "long"] as const).includes(
      contentPreferences?.content_length as any
    )
      ? (contentPreferences?.content_length as "short" | "medium" | "long")
      : undefined,
    contentFrequency: (
      [
        "daily",
        "several_times_a_week",
        "weekly",
        "bi_weekly",
        "monthly",
      ] as const
    ).includes(contentPreferences?.content_frequency as any)
      ? (contentPreferences?.content_frequency as
          | "daily"
          | "several_times_a_week"
          | "weekly"
          | "bi_weekly"
          | "monthly")
      : undefined,
    contentEmojis: contentPreferences?.content_emojis ?? false,
    contentHashtags: contentPreferences?.content_hashtags ?? false,
    // ** OMITIDO contentCallToAction **

    // === PLATFORM PREFERENCES ===
    platforms: {
      instagram: platformPreferences?.instagram ?? false,
      facebook: platformPreferences?.facebook ?? false,
      tiktok: platformPreferences?.tiktok ?? false,
      twitter: platformPreferences?.twitter ?? false,
      linkedin: platformPreferences?.linkedin ?? false,
      youtube: platformPreferences?.youtube ?? false,
    },

    // === BRAND VOICE ===
    brandValues: brandVoice?.brand_values ?? [],
    brandPersonality: brandVoice?.brand_personality ?? "",
    brandDescription: brandVoice?.brand_description ?? "",

    // === EXAMPLES ===
    competitorUrls: examples?.competitor_urls ?? [],
    favoriteContent: examples?.favorite_content ?? "",
    contentToAvoid: examples?.content_to_avoid ?? "",
  };

  const initialValues: UpdatePreferencesData = { ...mappedData };

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePreferencesData>({
    resolver: zodResolver(updatePreferencesSchema),
    defaultValues: initialValues,
  });

  const [formProgress, setFormProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof PrefsFromServer>(
    contentPreferences ? "contentPreferences" : "businessInfo"
  );

  // Quando `data` mudar, reseta o form
  useEffect(() => {
    reset(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Calcula progresso
  const allValues = watch();
  useEffect(() => {
    const prefs = allValues as UpdatePreferencesData;
    const nonPlatformKeys = Object.keys(prefs).filter((k) => k !== "platforms");
    const platformKeys = prefs.platforms ? Object.keys(prefs.platforms) : [];
    const totalFields = nonPlatformKeys.length + platformKeys.length;

    let filledFields = 0;
    nonPlatformKeys.forEach((key) => {
      const value = (prefs as any)[key];
      if (Array.isArray(value)) {
        if (value.length > 0) filledFields++;
      } else if (typeof value === "boolean") {
        if (value) filledFields++;
      } else if (value) {
        filledFields++;
      }
    });
    if (prefs.platforms) {
      platformKeys.forEach((platKey) => {
        if ((prefs.platforms as any)[platKey]) {
          filledFields++;
        }
      });
    }
    const progress = totalFields
      ? Math.min(100, Math.round((filledFields / totalFields) * 100))
      : 0;
    setFormProgress(progress);
  }, [allValues]);

  // Função unificada de submit
  const onSubmit = async (formData: UpdatePreferencesData) => {
    setIsSaving(true);

    try {
      if (activeTab === "contentPreferences") {
        // Submete só Content Preferences
        const fd = new FormData();
        fd.append("preferred_tone", formData.contentTone!);
        fd.append("preferred_formality", formData.contentFormality!);
        fd.append("preferred_length", formData.contentLength!);
        fd.append("preferred_frequency", formData.contentFrequency!);
        fd.append("use_emojis", formData.contentEmojis ? "true" : "false");
        fd.append("use_hashtags", formData.contentHashtags ? "true" : "false");
        // Se usar CTA, descomente:
        // fd.append("cta", formData.contentCallToAction ? "true" : "false");

        const result = await updateContentPreferencesAction(fd);
        if ((result as any).error) {
          toast({
            title: "Erro ao salvar conteúdo",
            description: (result as any).error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Conteúdo salvo",
            description: "As preferências de conteúdo foram atualizadas.",
          });
          const updated = (result as any)
            .content as PrefsFromServer["contentPreferences"];
          if (updated) {
            reset({
              ...formData,
              contentTone: updated.content_tone as
                | "professional"
                | "casual"
                | "funny"
                | "serious"
                | "inspirational"
                | "educational"
                | "conversational"
                | undefined,
              contentFormality: updated.content_formality as
                | "formal"
                | "semi_formal"
                | "casual"
                | "very_casual"
                | undefined,
              contentLength: updated.content_length as "short" | "medium" | "long" | undefined,
              contentFrequency: updated.content_frequency as
                | "daily"
                | "several_times_a_week"
                | "weekly"
                | "bi_weekly"
                | "monthly"
                | undefined,
              contentEmojis: updated.content_emojis,
              contentHashtags: updated.content_hashtags,
            });
          }
        }
      } else {
        // Submete todas as preferências (savePref)
        const result = await savePref(formData);
        if ((result as any).status !== "success") {
          throw new Error((result as any).status || "Erro desconhecido");
        }
        reset(formData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        toast({
          title: "Preferences saved",
          description: "All your preferences have been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error saving preferences",
        description:
          activeTab === "contentPreferences"
            ? "Não foi possível salvar suas preferências de conteúdo."
            : "Houve um erro ao salvar suas preferências. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    reset(initialValues);
    toast({
      title: "Preferences reset",
      description:
        "Your preferences have been reset to the values from the database.",
    });
  };

  const handleExport = () => {
    const current = getValues();
    const blob = new Blob([JSON.stringify(current, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "viralgen-preferences.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({
      title: "Preferences exported",
      description: "Your preferences have been exported successfully.",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import preferences",
      description: "This feature will be available in the next update.",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden relative">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-secondary" />
                Content Preferences
              </CardTitle>
              <CardDescription>
                Customize your content preferences to get more relevant and
                personalized content ideas.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={handleReset}
                type="button"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={handleExport}
                type="button"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={handleImport}
                type="button"
              >
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
            <Progress
              value={formProgress}
              className="h-2 bg-muted [&>div]:bg-secondary"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={contentPreferences ? "content" : "business"}
            onValueChange={(value) => {
              switch (value) {
                case "business":
                  setActiveTab("businessInfo");
                  break;
                case "audience":
                  setActiveTab("targetAudience");
                  break;
                case "content":
                  setActiveTab("contentPreferences");
                  break;
                case "platforms":
                  setActiveTab("platformPreferences");
                  break;
                case "brand":
                  setActiveTab("brandVoice");
                  break;
                case "examples":
                  setActiveTab("examples");
                  break;
              }
            }}
            className="w-full"
          >
            <div className="overflow-x-auto pb-2">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 rounded-lg p-1 bg-muted mb-6">
                <TabsTrigger
                  value="business"
                  className="rounded-md data-[state=active]:bg-background"
                >
                  <Building className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Business</span>
                </TabsTrigger>
                <TabsTrigger
                  value="audience"
                  className="rounded-md data-[state=active]:bg-background"
                >
                  <Target className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Audience</span>
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="rounded-md data-[state=active]:bg-background"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger
                  value="platforms"
                  className="rounded-md data-[state=active]:bg-background"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Platforms</span>
                </TabsTrigger>
                <TabsTrigger
                  value="brand"
                  className="rounded-md data-[state=active]:bg-background"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Brand</span>
                </TabsTrigger>
                <TabsTrigger
                  value="examples"
                  className="rounded-md data-[state=active]:bg-background"
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Examples</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* === BUSINESS INFORMATION === */}
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
                    {...register("businessName")}
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm">
                      {errors.businessName.message}
                    </p>
                  )}
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
                    {...register("website")}
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  />
                  {errors.website && (
                    <p className="text-red-500 text-sm">
                      {errors.website.message}
                    </p>
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type of Business */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Label htmlFor="business-type">Type of Business</Label>
                  <Controller
                    control={control}
                    name="businessType"
                    defaultValue={initialValues.businessType}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
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
                          <SelectItem value="service_provider">
                            Service Provider
                          </SelectItem>
                          <SelectItem value="agency">Agency</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="retail_store">
                            Retail Store
                          </SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="non_profit">Non-profit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.businessType && (
                    <p className="text-red-500 text-sm">
                      {errors.businessType.message}
                    </p>
                  )}
                </motion.div>

                {/* Industry */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Label htmlFor="industry">Industry</Label>
                  <Controller
                    control={control}
                    name="industry"
                    defaultValue={initialValues.industry}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="industry"
                          className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                        >
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="food & Beverage">
                            Food &amp; Beverage
                          </SelectItem>
                          <SelectItem value="fashion">Fashion</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="beauty">Beauty</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.industry && (
                    <p className="text-red-500 text-sm">
                      {errors.industry.message}
                    </p>
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Specific Niche */}
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
                    {...register("niche")}
                    className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  />
                  {errors.niche && (
                    <p className="text-red-500 text-sm">
                      {errors.niche.message}
                    </p>
                  )}
                </motion.div>

                {/* Business Size */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Label htmlFor="business-size">Business Size</Label>
                  <Controller
                    control={control}
                    name="businessSize"
                    defaultValue={initialValues.businessSize}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="business-size"
                          className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                        >
                          <SelectValue placeholder="Select business size" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="solo_entrepreneur">
                            Solo Entrepreneur
                          </SelectItem>
                          <SelectItem value="small">
                            Small (2-10 employees)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (11-50 employees)
                          </SelectItem>
                          <SelectItem value="large">
                            Large (51+ employees)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.businessSize && (
                    <p className="text-red-500 text-sm">
                      {errors.businessSize.message}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Years in Business */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Label htmlFor="years-in-business">Years in Business</Label>
                <Controller
                  control={control}
                  name="yearsInBusiness"
                  defaultValue={initialValues.yearsInBusiness}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="years-in-business"
                        className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select years in business" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        <SelectItem value="less_1_year">
                          Less than 1 year
                        </SelectItem>
                        <SelectItem value="1_3_years">1-3 years</SelectItem>
                        <SelectItem value="4_10_years">4-10 years</SelectItem>
                        <SelectItem value="more_10_years">
                          More than 10 years
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.yearsInBusiness && (
                  <p className="text-red-500 text-sm">
                    {errors.yearsInBusiness.message}
                  </p>
                )}
              </motion.div>
            </TabsContent>

            {/* === TARGET AUDIENCE === */}
            <TabsContent value="audience" className="space-y-6">
              {/* Target Age Groups */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label>Target Age Groups</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(
                    [
                      "18–24",
                      "25–34",
                      "35–44",
                      "45–54",
                      "55–64",
                      "65+",
                    ] as TargetAge[]
                  ).map((age) => {
                    const selectedList = watch("targetAge") || [];
                    const isSelected = selectedList.includes(age);
                    return (
                      <Badge
                        key={age}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-primary/10"
                        }`}
                        onClick={() => {
                          const currentAges = watch("targetAge") || [];
                          let newAges: TargetAge[];
                          if (currentAges.includes(age)) {
                            newAges = currentAges.filter((a) => a !== age);
                          } else {
                            newAges = [...currentAges, age];
                          }
                          setValue("targetAge", newAges, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        {age}
                      </Badge>
                    );
                  })}
                </div>
                {errors.targetAge && (
                  <p className="text-red-500 text-sm">
                    {errors.targetAge.message}
                  </p>
                )}
              </motion.div>

              {/* Target Gender */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label>Target Gender</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(["male", "female", "all"] as TargetGender[]).map(
                    (gender) => {
                      const selectedGenders = watch("targetGender") || [];
                      const isSel = selectedGenders.includes(gender);
                      return (
                        <Badge
                          key={gender}
                          variant={isSel ? "default" : "outline"}
                          className={`cursor-pointer ${
                            isSel
                              ? "bg-primary text-primary-foreground"
                              : "bg-background hover:bg-primary/10"
                          }`}
                          onClick={() => {
                            let currentGenders = watch("targetGender") || [];
                            let newGenders: TargetGender[] = [
                              ...currentGenders,
                            ];

                            if (gender === "all") {
                              newGenders = ["all"];
                            } else {
                              newGenders = newGenders.filter(
                                (g) => g !== "all"
                              );
                              if (newGenders.includes(gender)) {
                                newGenders = newGenders.filter(
                                  (g) => g !== gender
                                );
                                if (newGenders.length === 0)
                                  newGenders = ["all"];
                              } else {
                                newGenders.push(gender);
                              }
                            }
                            setValue("targetGender", newGenders, {
                              shouldValidate: true,
                            });
                          }}
                        >
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </Badge>
                      );
                    }
                  )}
                </div>
                {errors.targetGender && (
                  <p className="text-red-500 text-sm">
                    {errors.targetGender.message}
                  </p>
                )}
              </motion.div>

              {/* Target Location */}
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
                  {...register("targetLocation")}
                  className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
                {errors.targetLocation && (
                  <p className="text-red-500 text-sm">
                    {errors.targetLocation.message}
                  </p>
                )}
              </motion.div>

              {/* Target Interests */}
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
                  ].map((interest) => {
                    const currentList = watch("targetInterests") || [];
                    const isSel = currentList.includes(interest);
                    return (
                      <Badge
                        key={interest}
                        variant={isSel ? "default" : "outline"}
                        className={`cursor-pointer ${
                          isSel
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-background hover:bg-secondary/10"
                        }`}
                        onClick={() => {
                          const current = watch("targetInterests") || [];
                          let newList: string[];
                          if (current.includes(interest)) {
                            newList = current.filter((i) => i !== interest);
                          } else {
                            newList = [...current, interest];
                          }
                          setValue("targetInterests", newList, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        {interest}
                      </Badge>
                    );
                  })}
                </div>
                <Input
                  placeholder="Add custom interest and press Enter"
                  className="mt-2 rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const current = watch("targetInterests") || [];
                      const newVal = e.currentTarget.value.trim();
                      if (!current.includes(newVal)) {
                        setValue("targetInterests", [...current, newVal], {
                          shouldValidate: true,
                        });
                      }
                      e.currentTarget.value = "";
                      e.preventDefault();
                    }
                  }}
                />
                {errors.targetInterests && (
                  <p className="text-red-500 text-sm">
                    {(errors.targetInterests as any)?.message}
                  </p>
                )}
              </motion.div>

              {/* Target Pain Points */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Label>Target Pain Points</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(watch("targetPainPoints") || []).map((painPoint) => (
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
                        onClick={() => {
                          const current = watch("targetPainPoints") || [];
                          const newList = current.filter(
                            (p) => p !== painPoint
                          );
                          setValue("targetPainPoints", newList, {
                            shouldValidate: true,
                          });
                        }}
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
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      e.currentTarget.value.trim()
                    ) {
                      const current = watch("targetPainPoints") || [];
                      const val = e.currentTarget.value.trim();
                      setValue("targetPainPoints", [...current, val], {
                        shouldValidate: true,
                      });
                      e.currentTarget.value = "";
                      e.preventDefault();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Press Enter to add a pain point. Use Shift+Enter for new
                  lines.
                </p>
                {errors.targetPainPoints && (
                  <p className="text-red-500 text-sm">
                    {(errors.targetPainPoints as any)?.message}
                  </p>
                )}
              </motion.div>
            </TabsContent>

            {/* === CONTENT PREFERENCES === */}
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content Tone */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="content-tone">Content Tone</Label>
                  <Controller
                    control={control}
                    name="contentTone"
                    defaultValue={initialValues.contentTone}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="content-tone"
                          className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                        >
                          <SelectValue placeholder="Select content tone" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="funny">Funny</SelectItem>
                          <SelectItem value="serious">Serious</SelectItem>
                          <SelectItem value="inspirational">
                            Inspirational
                          </SelectItem>
                          <SelectItem value="educational">
                            Educational
                          </SelectItem>
                          <SelectItem value="conversational">
                            Conversational
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.contentTone && (
                    <p className="text-red-500 text-sm">
                      {errors.contentTone.message}
                    </p>
                  )}
                </motion.div>

                {/* Content Formality */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Label htmlFor="content-formality">Content Formality</Label>
                  <Controller
                    control={control}
                    name="contentFormality"
                    defaultValue={initialValues.contentFormality}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="content-formality"
                          className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                        >
                          <SelectValue placeholder="Select content formality" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="semi_formal">
                            Semi-formal
                          </SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="very_casual">
                            Very casual
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.contentFormality && (
                    <p className="text-red-500 text-sm">
                      {errors.contentFormality.message}
                    </p>
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preferred Content Length */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Label htmlFor="content-length">
                    Preferred Content Length
                  </Label>
                  <Controller
                    control={control}
                    name="contentLength"
                    defaultValue={initialValues.contentLength}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="content-length"
                          className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                        >
                          <SelectValue placeholder="Select content length" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="short">
                            Short (brief and concise)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (balanced length)
                          </SelectItem>
                          <SelectItem value="long">
                            Long (detailed and comprehensive)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.contentLength && (
                    <p className="text-red-500 text-sm">
                      {errors.contentLength.message}
                    </p>
                  )}
                </motion.div>

                {/* Content Posting Frequency */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Label htmlFor="content-frequency">
                    Content Posting Frequency
                  </Label>
                  <Controller
                    control={control}
                    name="contentFrequency"
                    defaultValue={initialValues.contentFrequency}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="content-frequency"
                          className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                        >
                          <SelectValue placeholder="Select posting frequency" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="several_times_a_week">
                            Several times a week
                          </SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi_weekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.contentFrequency && (
                    <p className="text-red-500 text-sm">
                      {errors.contentFrequency.message}
                    </p>
                  )}
                </motion.div>
              </div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <h3 className="text-sm font-medium">Content Elements</h3>

                {/* Use Emojis */}
                <Controller
                  control={control}
                  name="contentEmojis"
                  defaultValue={initialValues.contentEmojis}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="content-emojis">Use Emojis</Label>
                        <p className="text-sm text-muted-foreground">
                          Include emojis in generated content
                        </p>
                      </div>
                      <Switch
                        id="content-emojis"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </div>
                  )}
                />
                {errors.contentEmojis && (
                  <p className="text-red-500 text-sm">
                    {(errors.contentEmojis as any)?.message}
                  </p>
                )}

                {/* Include Hashtags */}
                <Controller
                  control={control}
                  name="contentHashtags"
                  defaultValue={initialValues.contentHashtags}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="content-hashtags">
                          Include Hashtags
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Generate relevant hashtags for social media
                        </p>
                      </div>
                      <Switch
                        id="content-hashtags"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </div>
                  )}
                />
                {errors.contentHashtags && (
                  <p className="text-red-500 text-sm">
                    {(errors.contentHashtags as any)?.message}
                  </p>
                )}

                {/*
                  <-- CTA omitido conforme o schema atualizado -->
                */}
              </motion.div>
            </TabsContent>

            {/* === PLATFORM PREFERENCES === */}
            <TabsContent value="platforms" className="space-y-6">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-sm font-medium">
                  Select Your Active Platforms
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose the platforms where you want to publish content
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Instagram */}
                  <Controller
                    control={control}
                    name="platforms.instagram"
                    defaultValue={initialValues.platforms!.instagram}
                    render={({ field }) => (
                      <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                        <Instagram className="h-8 w-8 text-pink-500" />
                        <div className="flex-1">
                          <h4 className="font-medium">Instagram</h4>
                          <p className="text-sm text-muted-foreground">
                            Photos, carousels, reels, stories
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </div>
                    )}
                  />

                  {/* Facebook */}
                  <Controller
                    control={control}
                    name="platforms.facebook"
                    defaultValue={initialValues.platforms!.facebook}
                    render={({ field }) => (
                      <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                        <svg
                          className="h-8 w-8 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2.25C6.85 2.25 2.25 6.85 2.25 12c0 5.15 4.6 9.75 9.75 9.75 5.15 0 9.75-4.6 9.75-9.75 0-5.15-4.6-9.75-9.75-9.75zm3.75 6.75h-2.25v-1.5c0-.83.67-1.5 1.5-1.5h.75V3.75h-.75c-2.07 0-3.75 1.68-3.75 3.75v1.5H9v2.25h2.25V20.25h2.25V11.25h2.25l.75-2.25z" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-medium">Facebook</h4>
                          <p className="text-sm text-muted-foreground">
                            Posts, videos, stories, groups
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </div>
                    )}
                  />

                  {/* TikTok */}
                  <Controller
                    control={control}
                    name="platforms.tiktok"
                    defaultValue={initialValues.platforms!.tiktok}
                    render={({ field }) => (
                      <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                        <svg
                          className="h-8 w-8 text-black dark:text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-medium">TikTok</h4>
                          <p className="text-sm text-muted-foreground">
                            Short-form videos
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </div>
                    )}
                  />

                  {/* Twitter */}
                  <Controller
                    control={control}
                    name="platforms.twitter"
                    defaultValue={initialValues.platforms!.twitter}
                    render={({ field }) => (
                      <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                        <Twitter className="h-8 w-8 text-blue-400" />
                        <div className="flex-1">
                          <h4 className="font-medium">Twitter</h4>
                          <p className="text-sm text-muted-foreground">
                            Tweets, threads, spaces
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </div>
                    )}
                  />

                  {/* LinkedIn */}
                  <Controller
                    control={control}
                    name="platforms.linkedin"
                    defaultValue={initialValues.platforms!.linkedin}
                    render={({ field }) => (
                      <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                        <Linkedin className="h-8 w-8 text-blue-700" />
                        <div className="flex-1">
                          <h4 className="font-medium">LinkedIn</h4>
                          <p className="text-sm text-muted-foreground">
                            Professional posts, articles
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </div>
                    )}
                  />

                  {/* YouTube */}
                  <Controller
                    control={control}
                    name="platforms.youtube"
                    defaultValue={initialValues.platforms!.youtube}
                    render={({ field }) => (
                      <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-primary/10 bg-card">
                        <Youtube className="h-8 w-8 text-red-600" />
                        <div className="flex-1">
                          <h4 className="font-medium">YouTube</h4>
                          <p className="text-sm text-muted-foreground">
                            Long-form videos, shorts
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </div>
                    )}
                  />
                </div>
              </motion.div>
            </TabsContent>

            {/* === BRAND VOICE === */}
            <TabsContent value="brand" className="space-y-6">
              {/* Brand Values */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label>Brand Values</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(watch("brandValues") || []).map((value) => {
                    const currentBrandVals = watch("brandValues") || [];
                    const isSel = currentBrandVals.includes(value);
                    return (
                      <Badge
                        key={value}
                        variant={isSel ? "default" : "outline"}
                        className={`cursor-pointer ${
                          isSel
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-primary/10"
                        }`}
                        onClick={() => {
                          const current = watch("brandValues") || [];
                          let newVals: string[];
                          if (current.includes(value)) {
                            newVals = current.filter((v) => v !== value);
                          } else {
                            newVals = [...current, value];
                          }
                          setValue("brandValues", newVals, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        {value}
                      </Badge>
                    );
                  })}
                </div>
                <Input
                  placeholder="Add custom value and press Enter"
                  className="mt-2 rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const current = watch("brandValues") || [];
                      const newVal = e.currentTarget.value.trim().toLowerCase();
                      if (!current.includes(newVal)) {
                        setValue("brandValues", [...current, newVal], {
                          shouldValidate: true,
                        });
                      }
                      e.currentTarget.value = "";
                      e.preventDefault();
                    }
                  }}
                />
                {errors.brandValues && (
                  <p className="text-red-500 text-sm">
                    {(errors.brandValues as any)?.message}
                  </p>
                )}
              </motion.div>

              {/* Brand Personality */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label htmlFor="brand-personality">Brand Personality</Label>
                <Controller
                  control={control}
                  name="brandPersonality"
                  defaultValue={initialValues.brandPersonality}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="brand-personality"
                        className="rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select brand personality" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        <SelectItem value="helpful">
                          Helpful & Supportive
                        </SelectItem>
                        <SelectItem value="authoritative">
                          Authoritative & Expert
                        </SelectItem>
                        <SelectItem value="friendly">
                          Friendly & Approachable
                        </SelectItem>
                        <SelectItem value="innovative">
                          Innovative & Forward-thinking
                        </SelectItem>
                        <SelectItem value="playful">Playful & Fun</SelectItem>
                        <SelectItem value="luxurious">
                          Luxurious & Premium
                        </SelectItem>
                        <SelectItem value="trustworthy">
                          Trustworthy & Reliable
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.brandPersonality && (
                  <p className="text-red-500 text-sm">
                    {errors.brandPersonality.message}
                  </p>
                )}
              </motion.div>

              {/* Brand Description */}
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
                  {...register("brandDescription")}
                  className="min-h-[150px] rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
                {errors.brandDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.brandDescription.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Describe your brand's mission, vision, and what makes it
                  unique.
                </p>
              </motion.div>
            </TabsContent>

            {/* === EXAMPLES === */}
            <TabsContent value="examples" className="space-y-6">
              {/* Competitor URLs */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label>Competitor URLs</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(watch("competitorUrls") || []).map((url) => {
                    return (
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
                          onClick={() => {
                            const current = watch("competitorUrls") || [];
                            const newList = current.filter((u) => u !== url);
                            setValue("competitorUrls", newList, {
                              shouldValidate: true,
                            });
                          }}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
                <Input
                  placeholder="Add competitor URL and press Enter (e.g., competitor.com)"
                  className="mt-2 rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const current = watch("competitorUrls") || [];
                      const newVal = e.currentTarget.value.trim();
                      if (!current.includes(newVal)) {
                        setValue("competitorUrls", [...current, newVal], {
                          shouldValidate: true,
                        });
                      }
                      e.currentTarget.value = "";
                      e.preventDefault();
                    }
                  }}
                />
                {errors.competitorUrls && (
                  <p className="text-red-500 text-sm">
                    {(errors.competitorUrls as any)?.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Add URLs of competitors whose content style you admire or want
                  to analyze.
                </p>
              </motion.div>

              {/* Content You Like */}
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
                  {...register("favoriteContent")}
                  className="min-h-[100px] rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
                {errors.favoriteContent && (
                  <p className="text-red-500 text-sm">
                    {errors.favoriteContent.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Examples help us understand your style preferences.
                </p>
              </motion.div>

              {/* Content to Avoid */}
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
                  {...register("contentToAvoid")}
                  className="min-h-[100px] rounded-lg border-2 border-primary/20 focus-visible:ring-primary"
                />
                {errors.contentToAvoid && (
                  <p className="text-red-500 text-sm">
                    {errors.contentToAvoid.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Help us understand what not to generate for your brand.
                </p>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* === BOTÃO SALVAR + MASCOT === */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <div className="relative order-2 sm:order-1">
              <Mascot
                emotion="thinking"
                message="These details help me create better content ideas para você!"
                size="md"
              />
            </div>
            <Button
              type="submit"
              disabled={isSaving || isSubmitting}
              className="rounded-full btn-bounce bg-secondary hover:bg-secondary/90 text-secondary-foreground order-1 sm:order-2 w-full sm:w-auto"
            >
              {isSaving || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </CardContent>

        {/* === OVERLAY DE SUCESSO === */}
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
              <p className="text-muted-foreground">
                Your content will now be more personalized.
              </p>
            </motion.div>
          </motion.div>
        )}
      </Card>
    </form>
  );
}
