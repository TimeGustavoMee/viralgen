"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  Trash2,
  Download,
  Calendar,
  Edit,
  Share2,
  LayoutGrid,
  List,
  ChevronDown,
  X,
  Folder,
  FolderPlus,
  Tag,
  Clock,
  BarChart,
  Sparkles,
  Copy,
  Heart,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { getFavorites, removeFavorite } from "@/utils/favorites"
import type { ContentIdea } from "@/app/actions/generate-content"

// Define collection type
interface Collection {
  id: string
  name: string
  description: string
  color: string
  ideas: ContentIdea[]
}

// Extended ContentIdea with notes
interface ExtendedContentIdea extends ContentIdea {
  notes?: string
  dateAdded?: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<ExtendedContentIdea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [formatFilter, setFormatFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "default",
      name: "All Favorites",
      description: "All your saved content ideas",
      color: "blue",
      ideas: [],
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Content ideas for Instagram",
      color: "pink",
      ideas: [],
    },
    {
      id: "tiktok",
      name: "TikTok",
      description: "Video ideas for TikTok",
      color: "black",
      ideas: [],
    },
  ])
  const [activeCollection, setActiveCollection] = useState("default")
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionDescription, setNewCollectionDescription] = useState("")
  const [newCollectionColor, setNewCollectionColor] = useState("blue")
  const [showNewCollectionDialog, setShowNewCollectionDialog] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<ExtendedContentIdea | null>(null)
  const [noteContent, setNoteContent] = useState("")
  const [expandedIdeas, setExpandedIdeas] = useState<Record<string, boolean>>({})
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = getFavorites().map((idea) => ({
          ...idea,
          dateAdded: idea.dateAdded || new Date().toISOString(),
          notes: idea.notes || "",
        }))

        setFavorites(savedFavorites)

        // Distribute favorites to collections
        const updatedCollections = collections.map((collection) => {
          if (collection.id === "default") {
            return { ...collection, ideas: savedFavorites }
          } else if (collection.id === "instagram") {
            return {
              ...collection,
              ideas: savedFavorites.filter(
                (idea) =>
                  idea.platform?.toLowerCase() === "instagram" || idea.description?.toLowerCase().includes("instagram"),
              ),
            }
          } else if (collection.id === "tiktok") {
            return {
              ...collection,
              ideas: savedFavorites.filter(
                (idea) =>
                  idea.platform?.toLowerCase() === "tiktok" || idea.description?.toLowerCase().includes("tiktok"),
              ),
            }
          }
          return collection
        })

        setCollections(updatedCollections)
      } catch (error) {
        console.error("Error loading favorites:", error)
        toast({
          title: "Error",
          description: "Failed to load your favorites. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  // Update hasActiveFilters when filters change
  useEffect(() => {
    setHasActiveFilters(searchQuery !== "" || platformFilter !== "all" || formatFilter !== "all")
  }, [searchQuery, platformFilter, formatFilter])

  // Filter and sort favorites based on current filters and sort order
  const getFilteredAndSortedIdeas = useCallback(
    (ideas: ContentIdea[]) => {
      // First apply filters
      let filtered = ideas

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (idea) =>
            idea.title.toLowerCase().includes(query) ||
            idea.description.toLowerCase().includes(query) ||
            (idea.tags && idea.tags.some((tag) => tag.toLowerCase().includes(query))) ||
            (idea.notes && idea.notes.toLowerCase().includes(query)),
        )
      }

      // Apply platform filter
      if (platformFilter !== "all") {
        filtered = filtered.filter(
          (idea) =>
            idea.platform?.toLowerCase() === platformFilter.toLowerCase() ||
            idea.description?.toLowerCase().includes(platformFilter.toLowerCase()),
        )
      }

      // Apply format filter
      if (formatFilter !== "all") {
        filtered = filtered.filter(
          (idea) =>
            idea.format?.toLowerCase() === formatFilter.toLowerCase() ||
            idea.description?.toLowerCase().includes(formatFilter.toLowerCase()),
        )
      }

      // Then sort
      return filtered.sort((a, b) => {
        switch (sortOrder) {
          case "newest":
            return new Date(b.dateAdded || "").getTime() - new Date(a.dateAdded || "").getTime()
          case "oldest":
            return new Date(a.dateAdded || "").getTime() - new Date(b.dateAdded || "").getTime()
          case "a-z":
            return a.title.localeCompare(b.title)
          case "z-a":
            return b.title.localeCompare(a.title)
          default:
            return 0
        }
      })
    },
    [searchQuery, platformFilter, formatFilter, sortOrder],
  )

  // Get the current collection
  const currentCollection = collections.find((c) => c.id === activeCollection) || collections[0]

  // Get filtered and sorted ideas for the current collection
  const filteredIdeas = getFilteredAndSortedIdeas(currentCollection.ideas)

  // Handle removing an idea from favorites
  const handleRemoveFavorite = useCallback((idea: ContentIdea) => {
    removeFavorite(idea.id)

    // Update local state
    setFavorites((prev) => prev.filter((fav) => fav.id !== idea.id))

    // Update collections
    setCollections((prev) =>
      prev.map((collection) => ({
        ...collection,
        ideas: collection.ideas.filter((i) => i.id !== idea.id),
      })),
    )

    toast({
      title: "Removed from favorites",
      description: "Content idea removed from your favorites.",
    })
  }, [])

  // Handle creating a new collection
  const handleCreateCollection = useCallback(() => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Collection name required",
        description: "Please enter a name for your collection.",
        variant: "destructive",
      })
      return
    }

    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name: newCollectionName,
      description: newCollectionDescription || "My custom collection",
      color: newCollectionColor,
      ideas: [],
    }

    setCollections((prev) => [...prev, newCollection])
    setActiveCollection(newCollection.id)
    setShowNewCollectionDialog(false)
    setNewCollectionName("")
    setNewCollectionDescription("")
    setNewCollectionColor("blue")

    toast({
      title: "Collection created",
      description: `Your collection "${newCollectionName}" has been created.`,
    })
  }, [newCollectionName, newCollectionDescription, newCollectionColor])

  // Handle adding an idea to a collection
  const handleAddToCollection = useCallback(
    (idea: ContentIdea, collectionId: string) => {
      // Check if idea is already in the collection
      const collection = collections.find((c) => c.id === collectionId)
      if (collection && !collection.ideas.some((i) => i.id === idea.id)) {
        setCollections((prev) => prev.map((c) => (c.id === collectionId ? { ...c, ideas: [...c.ideas, idea] } : c)))

        toast({
          title: "Added to collection",
          description: `Content idea added to "${collection.name}".`,
        })
      }
    },
    [collections],
  )

  // Handle exporting favorites as CSV
  const handleExportCSV = useCallback(() => {
    try {
      const headers = [
        "Title",
        "Description",
        "Platform",
        "Format",
        "Tags",
        "Estimated Engagement",
        "Notes",
        "Date Added",
      ]
      const rows = filteredIdeas.map((idea) => [
        idea.title,
        idea.description,
        idea.platform || "",
        idea.format || "",
        idea.tags?.join(", ") || "",
        idea.estimatedEngagement || "",
        idea.notes || "",
        new Date(idea.dateAdded || "").toLocaleDateString(),
      ])

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `viralgen-favorites-${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: "Your favorites have been exported as a CSV file.",
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: "Export failed",
        description: "Failed to export your favorites. Please try again.",
        variant: "destructive",
      })
    }
  }, [filteredIdeas])

  // Handle saving a note for an idea
  const handleSaveNote = useCallback(() => {
    if (!selectedIdea) return

    // Update the idea in favorites with the new note
    const updatedFavorites = favorites.map((idea) =>
      idea.id === selectedIdea.id ? { ...idea, notes: noteContent } : idea,
    )

    setFavorites(updatedFavorites)

    // Update collections
    setCollections((prev) =>
      prev.map((collection) => ({
        ...collection,
        ideas: collection.ideas.map((idea) => (idea.id === selectedIdea.id ? { ...idea, notes: noteContent } : idea)),
      })),
    )

    // Save to localStorage
    localStorage.setItem("viralgen_favorites", JSON.stringify(updatedFavorites))

    toast({
      title: "Note saved",
      description: "Your note has been saved for this content idea.",
    })

    setSelectedIdea(null)
    setNoteContent("")
  }, [selectedIdea, noteContent, favorites])

  // Handle copying content to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Content copied to clipboard successfully.",
    })
  }, [])

  // Toggle expanded state for an idea
  const toggleExpanded = useCallback((ideaId: string) => {
    setExpandedIdeas((prev) => ({
      ...prev,
      [ideaId]: !prev[ideaId],
    }))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setPlatformFilter("all")
    setFormatFilter("all")
  }, [])

  // Get color class based on collection color
  const getColorClass = useCallback((color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500"
      case "pink":
        return "bg-pink-500"
      case "green":
        return "bg-green-500"
      case "purple":
        return "bg-purple-500"
      case "orange":
        return "bg-orange-500"
      case "red":
        return "bg-red-500"
      case "black":
        return "bg-black dark:bg-white"
      default:
        return "bg-blue-500"
    }
  }, [])

  // Get badge color class based on difficulty
  const getDifficultyColor = useCallback((difficulty?: string) => {
    if (!difficulty) return ""

    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Heart className="h-6 w-6 text-secondary" />
          Favorites
        </h1>
        <p className="text-muted-foreground">Manage and organize your saved content ideas.</p>
      </div>

      <Card className="border-2 border-primary/20 rounded-xl shadow-md overflow-hidden">
        <CardHeader className="pb-2 space-y-4">
          <Tabs value={activeCollection} onValueChange={setActiveCollection} className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="overflow-x-auto pb-2 sm:pb-0">
                <TabsList className="bg-muted h-auto inline-flex">
                  {collections.map((collection) => (
                    <TabsTrigger
                      key={collection.id}
                      value={collection.id}
                      className="data-[state=active]:bg-background px-3 py-1.5 h-auto"
                    >
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${getColorClass(collection.color)}`} />
                        <span className="truncate max-w-[100px] sm:max-w-none">{collection.name}</span>
                        <Badge variant="outline" className="ml-1 text-xs">
                          {collection.ideas.length}
                        </Badge>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-full p-1">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List View</span>
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="sr-only">Grid View</span>
                  </Button>
                </div>

                <Dialog open={showNewCollectionDialog} onOpenChange={setShowNewCollectionDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <FolderPlus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">New Collection</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Collection</DialogTitle>
                      <DialogDescription>
                        Create a new collection to organize your favorite content ideas.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="collection-name" className="text-sm font-medium">
                          Collection Name
                        </label>
                        <Input
                          id="collection-name"
                          placeholder="My Collection"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="collection-description" className="text-sm font-medium">
                          Description (Optional)
                        </label>
                        <Input
                          id="collection-description"
                          placeholder="What's this collection for?"
                          value={newCollectionDescription}
                          onChange={(e) => setNewCollectionDescription(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="collection-color" className="text-sm font-medium">
                          Color
                        </label>
                        <Select value={newCollectionColor} onValueChange={setNewCollectionColor}>
                          <SelectTrigger id="collection-color">
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="pink">Pink</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="black">Black</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowNewCollectionDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateCollection}>Create Collection</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={handleExportCSV}
                  disabled={filteredIdeas.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search favorites..."
                className="pl-8 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7 rounded-full"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[130px] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Platform" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>

              <Select value={formatFilter} onValueChange={setFormatFilter}>
                <SelectTrigger className="w-[130px] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Format" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="reel">Reel</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[130px] rounded-lg">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="a-z">Title A-Z</SelectItem>
                  <SelectItem value="z-a">Title Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {filteredIdeas.length} results
              </Badge>
              <Button variant="ghost" size="sm" className="h-7 px-2 rounded-full" onClick={clearFilters}>
                <X className="h-3.5 w-3.5 mr-1" />
                Clear Filters
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-secondary animate-spin"></div>
              </div>
              <p className="mt-4 text-muted-foreground">Loading your favorites...</p>
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="inline-block p-4 rounded-full bg-secondary/10 mb-4">
                <Folder className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No favorites found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {hasActiveFilters
                  ? "No favorites match your current filters. Try adjusting your search or filters."
                  : activeCollection !== "default"
                    ? `You haven't added any content ideas to the "${currentCollection.name}" collection yet.`
                    : "You haven't saved any content ideas yet."}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => (window.location.href = "/dashboard/chat")}>Generate Content Ideas</Button>
              )}
            </div>
          ) : (
            <TabsContent value={activeCollection} className="mt-0">
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}
              >
                {filteredIdeas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{idea.title}</CardTitle>
                          <TooltipProvider>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                              </DropdownMenuTrigger>
                              <TooltipContent>
                                <p>Actions</p>
                              </TooltipContent>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => copyToClipboard(idea.description)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Content
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedIdea(idea)
                                    setNoteContent(idea.notes || "")
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  {idea.notes ? "Edit Note" : "Add Note"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => (window.location.href = "/dashboard/chat")}>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Generate Similar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    toast({
                                      title: "Coming Soon",
                                      description: "This feature will be available in the next update.",
                                    })
                                  }
                                >
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Schedule
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    toast({
                                      title: "Coming Soon",
                                      description: "This feature will be available in the next update.",
                                    })
                                  }
                                >
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Add to Collection</DropdownMenuLabel>
                                {collections
                                  .filter((c) => c.id !== "default" && !c.ideas.some((i) => i.id === idea.id))
                                  .map((collection) => (
                                    <DropdownMenuItem
                                      key={collection.id}
                                      onClick={() => handleAddToCollection(idea, collection.id)}
                                    >
                                      <div className={`w-2 h-2 rounded-full mr-2 ${getColorClass(collection.color)}`} />
                                      {collection.name}
                                    </DropdownMenuItem>
                                  ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleRemoveFavorite(idea)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove from Favorites
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipProvider>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {idea.platform && (
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                              {idea.platform}
                            </Badge>
                          )}
                          {idea.format && (
                            <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">
                              {idea.format}
                            </Badge>
                          )}
                          {idea.estimatedEngagement && (
                            <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20">
                              {idea.estimatedEngagement}
                            </Badge>
                          )}
                          {idea.difficulty && (
                            <Badge variant="outline" className={getDifficultyColor(idea.difficulty)}>
                              {idea.difficulty.charAt(0).toUpperCase() + idea.difficulty.slice(1)}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {viewMode === "grid" && idea.description.length > 100
                            ? idea.description.substring(0, 100) + "..."
                            : idea.description}
                        </p>

                        {idea.notes && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-md border border-border">
                            <div className="flex items-center gap-1 text-sm font-medium mb-1">
                              <Edit className="h-3.5 w-3.5" />
                              <span>Notes:</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {idea.notes.length > 100 && viewMode === "grid"
                                ? idea.notes.substring(0, 100) + "..."
                                : idea.notes}
                            </p>
                          </div>
                        )}

                        <AnimatePresence>
                          {expandedIdeas[idea.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t border-border overflow-hidden"
                            >
                              {idea.tags && idea.tags.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-1 text-sm font-medium mb-2">
                                    <Tag className="h-3.5 w-3.5" />
                                    <span>Tags:</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {idea.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="bg-secondary/10 text-xs">
                                        #{tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {(idea.timeToCreate || idea.bestTimeToPost) && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-1 text-sm font-medium mb-2">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>Timing:</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    {idea.timeToCreate && (
                                      <div>
                                        <span className="text-muted-foreground">Creation time:</span>{" "}
                                        <span>{idea.timeToCreate}</span>
                                      </div>
                                    )}
                                    {idea.bestTimeToPost && (
                                      <div>
                                        <span className="text-muted-foreground">Best time to post:</span>{" "}
                                        <span>{idea.bestTimeToPost}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {idea.variations && idea.variations.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-1 text-sm font-medium mb-2">
                                    <BarChart className="h-3.5 w-3.5" />
                                    <span>Variations:</span>
                                  </div>
                                  <ul className="list-disc list-inside text-sm space-y-1 pl-1">
                                    {idea.variations.map((variation, i) => (
                                      <li key={i}>{variation}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {idea.targetAudience && (
                                <div>
                                  <div className="flex items-center gap-1 text-sm font-medium mb-2">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-3.5 w-3.5"
                                    >
                                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                      <circle cx="9" cy="7" r="4" />
                                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    <span>Target Audience:</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{idea.targetAudience}</p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => toggleExpanded(idea.id)}
                          >
                            {expandedIdeas[idea.id] ? (
                              <>
                                <ChevronDown className="h-3.5 w-3.5 mr-1 rotate-180" />
                                <span className="text-xs">Less</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">More</span>
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => (window.location.href = "/dashboard/chat")}
                          >
                            <Sparkles className="h-3.5 w-3.5 mr-1" />
                            <span className="text-xs">Similar</span>
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive rounded-full"
                          onClick={() => handleRemoveFavorite(idea)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">Remove</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Note Dialog */}
      <Dialog open={!!selectedIdea} onOpenChange={(open) => !open && setSelectedIdea(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedIdea?.notes ? "Edit Note" : "Add Note"}</DialogTitle>
            <DialogDescription>
              {selectedIdea?.notes
                ? "Edit your personal note for this content idea."
                : "Add a personal note to this content idea for future reference."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Idea</label>
              <div className="p-3 rounded-md bg-muted">
                <h4 className="font-medium">{selectedIdea?.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedIdea?.description.substring(0, 100)}
                  {selectedIdea?.description.length > 100 ? "..." : ""}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Your Note
              </label>
              <Textarea
                id="note"
                placeholder="Add your thoughts, ideas, or reminders about this content..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedIdea(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
