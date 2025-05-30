"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { getFavorites } from "@/utils/favorites"
import { ContentIdeaCard } from "@/components/dashboard/content-idea-card"
import { PlusCircle, CalendarIcon, Clock, Trash2, Edit, AlertCircle } from "lucide-react"
import type { ContentIdea } from "@/app/actions/generate-content"

interface ScheduledContent {
  id: string
  date: Date
  contentId: string
  title: string
  description: string
  platform: string
  time: string
  status: "draft" | "scheduled" | "published" | "failed"
  notes?: string
}

export function ContentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ScheduledContent | null>(null)
  const [favorites, setFavorites] = useState<ContentIdea[]>([])
  const [selectedFavorite, setSelectedFavorite] = useState<string | null>(null)
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    platform: "instagram",
    time: "12:00",
    notes: "",
  })
  const [editContent, setEditContent] = useState({
    title: "",
    description: "",
    platform: "instagram",
    time: "12:00",
    notes: "",
    status: "scheduled" as const,
  })

  // Load scheduled content and favorites from localStorage on component mount
  useEffect(() => {
    const loadScheduledContent = () => {
      if (typeof window !== "undefined") {
        const savedContent = localStorage.getItem("viralgen_scheduled_content")
        if (savedContent) {
          try {
            // Parse the JSON and convert date strings back to Date objects
            const parsed = JSON.parse(savedContent)
            const contentWithDates = parsed.map((item: any) => ({
              ...item,
              date: new Date(item.date),
            }))
            setScheduledContent(contentWithDates)
          } catch (error) {
            console.error("Error parsing scheduled content:", error)
            setScheduledContent([])
          }
        }
      }
    }

    const loadFavorites = () => {
      const favs = getFavorites()
      setFavorites(favs)
    }

    loadScheduledContent()
    loadFavorites()
  }, [])

  // Save scheduled content to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && scheduledContent.length > 0) {
      localStorage.setItem("viralgen_scheduled_content", JSON.stringify(scheduledContent))
    }
  }, [scheduledContent])

  // Get content for the selected date
  const getContentForDate = (date: Date | null) => {
    if (!date) return []

    return scheduledContent.filter(
      (content) =>
        content.date.getDate() === date.getDate() &&
        content.date.getMonth() === date.getMonth() &&
        content.date.getFullYear() === date.getFullYear(),
    )
  }

  // Handle date selection in the calendar
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      setSelectedDate(date)
    }
  }

  // Handle adding new content
  const handleAddContent = () => {
    if (!selectedDate) return

    // If a favorite was selected, use its title and description
    let title = newContent.title
    let description = newContent.description
    let contentId = ""

    if (selectedFavorite) {
      const favorite = favorites.find((fav) => fav.id === selectedFavorite)
      if (favorite) {
        title = favorite.title
        description = favorite.description
        contentId = favorite.id
      }
    }

    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your content.",
        variant: "destructive",
      })
      return
    }

    const newScheduledContent: ScheduledContent = {
      id: `scheduled-${Date.now()}`,
      date: selectedDate,
      contentId,
      title,
      description,
      platform: newContent.platform,
      time: newContent.time,
      status: "scheduled",
      notes: newContent.notes,
    }

    setScheduledContent([...scheduledContent, newScheduledContent])
    setIsAddDialogOpen(false)

    // Reset form
    setNewContent({
      title: "",
      description: "",
      platform: "instagram",
      time: "12:00",
      notes: "",
    })
    setSelectedFavorite(null)

    toast({
      title: "Content Scheduled",
      description: `"${title}" has been scheduled for ${selectedDate.toLocaleDateString()}.`,
    })
  }

  // Handle viewing content details
  const handleViewContent = (content: ScheduledContent) => {
    setSelectedContent(content)
    setIsViewDialogOpen(true)
  }

  // Handle editing content
  const handleEditClick = (content: ScheduledContent) => {
    setSelectedContent(content)
    setEditContent({
      title: content.title,
      description: content.description,
      platform: content.platform,
      time: content.time,
      notes: content.notes || "",
      status: content.status,
    })
    setIsEditDialogOpen(true)
  }

  // Save edited content
  const handleSaveEdit = () => {
    if (!selectedContent) return

    const updatedContent = scheduledContent.map((content) =>
      content.id === selectedContent.id
        ? {
            ...content,
            title: editContent.title,
            description: editContent.description,
            platform: editContent.platform,
            time: editContent.time,
            notes: editContent.notes,
            status: editContent.status,
          }
        : content,
    )

    setScheduledContent(updatedContent)
    setIsEditDialogOpen(false)

    toast({
      title: "Content Updated",
      description: "Your scheduled content has been updated.",
    })
  }

  // Handle deleting content
  const handleDeleteContent = (id: string) => {
    setScheduledContent(scheduledContent.filter((content) => content.id !== id))
    setIsViewDialogOpen(false)

    toast({
      title: "Content Removed",
      description: "The scheduled content has been removed from your calendar.",
    })
  }

  // Handle favorite selection
  const handleFavoriteSelect = (id: string) => {
    setSelectedFavorite(id)
    const favorite = favorites.find((fav) => fav.id === id)
    if (favorite) {
      setNewContent({
        ...newContent,
        title: favorite.title,
        description: favorite.description,
      })
    }
  }

  // Get dates with content for highlighting in the calendar
  const getDatesWithContent = () => {
    return scheduledContent.map((content) => content.date)
  }

  // Render the badge for content status
  const renderStatusBadge = (status: ScheduledContent["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Draft
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Scheduled
          </Badge>
        )
      case "published":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Published
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Select a date to view or schedule content</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            // Highlight dates with scheduled content
            modifiers={{
              booked: getDatesWithContent(),
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
                backgroundColor: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                borderRadius: "0",
              },
            }}
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              if (selectedDate) {
                setIsAddDialogOpen(true)
              } else {
                toast({
                  title: "No Date Selected",
                  description: "Please select a date on the calendar first.",
                  variant: "destructive",
                })
              }
            }}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Content
          </Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-2 border-2 border-primary/20">
        <CardHeader>
          <CardTitle>
            {selectedDate ? (
              <span>
                Content for{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            ) : (
              <span>Scheduled Content</span>
            )}
          </CardTitle>
          <CardDescription>
            {selectedDate ? (
              <span>Manage your content scheduled for this date</span>
            ) : (
              <span>Select a date to view scheduled content</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <>
              {getContentForDate(selectedDate).length > 0 ? (
                <div className="space-y-4">
                  {getContentForDate(selectedDate).map((content) => (
                    <div
                      key={content.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleViewContent(content)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{content.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{content.platform}</Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {content.time}
                            </div>
                            {renderStatusBadge(content.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(content)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteContent(content.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Content Scheduled</h3>
                  <p className="text-muted-foreground mb-4">You don't have any content scheduled for this date yet.</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Schedule Content
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Date Selected</h3>
              <p className="text-muted-foreground">Select a date on the calendar to view or schedule content.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Content Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule New Content</DialogTitle>
            <DialogDescription>
              {selectedDate && <span>Add content to your calendar for {selectedDate.toLocaleDateString()}.</span>}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="favorite">Use Saved Idea (Optional)</Label>
              <Select onValueChange={handleFavoriteSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a saved idea" />
                </SelectTrigger>
                <SelectContent>
                  {favorites.length > 0 ? (
                    favorites.map((favorite) => (
                      <SelectItem key={favorite.id} value={favorite.id}>
                        {favorite.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No saved ideas found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                placeholder="Enter content title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newContent.description}
                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                placeholder="Enter content description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={newContent.platform}
                  onValueChange={(value) => setNewContent({ ...newContent, platform: value })}
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newContent.time}
                  onChange={(e) => setNewContent({ ...newContent, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={newContent.notes}
                onChange={(e) => setNewContent({ ...newContent, notes: e.target.value })}
                placeholder="Add any additional notes or reminders"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContent}>Schedule Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Content Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Content Details</DialogTitle>
            <DialogDescription>
              {selectedContent && (
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{selectedContent.platform}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {selectedContent.time}
                  </div>
                  {renderStatusBadge(selectedContent.status)}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedContent && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedContent.title}</h3>
                <p className="mt-2 text-muted-foreground">{selectedContent.description}</p>
              </div>

              {selectedContent.notes && (
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="font-medium mb-1">Notes:</h4>
                  <p className="text-sm">{selectedContent.notes}</p>
                </div>
              )}

              {/* If this content is based on a saved idea, show the original idea */}
              {selectedContent.contentId && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Based on Saved Idea:</h4>
                  {favorites.find((fav) => fav.id === selectedContent.contentId) ? (
                    <ScrollArea className="h-[200px]">
                      <ContentIdeaCard
                        idea={favorites.find((fav) => fav.id === selectedContent.contentId)!}
                        onToggleFavorite={() => {}}
                        compact={true}
                      />
                    </ScrollArea>
                  ) : (
                    <p className="text-sm text-muted-foreground">Original idea not found in favorites.</p>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="destructive" onClick={() => selectedContent && handleDeleteContent(selectedContent.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsViewDialogOpen(false)
                if (selectedContent) {
                  handleEditClick(selectedContent)
                }
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Scheduled Content</DialogTitle>
            <DialogDescription>Make changes to your scheduled content.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editContent.title}
                onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editContent.description}
                onChange={(e) => setEditContent({ ...editContent, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-platform">Platform</Label>
                <Select
                  value={editContent.platform}
                  onValueChange={(value) => setEditContent({ ...editContent, platform: value })}
                >
                  <SelectTrigger id="edit-platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editContent.time}
                  onChange={(e) => setEditContent({ ...editContent, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editContent.status}
                onValueChange={(value: "draft" | "scheduled" | "published" | "failed") =>
                  setEditContent({ ...editContent, status: value })
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Textarea
                id="edit-notes"
                value={editContent.notes}
                onChange={(e) => setEditContent({ ...editContent, notes: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
