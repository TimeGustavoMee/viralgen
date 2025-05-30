import type { ContentIdea } from "@/app/actions/generate-content"

// Extended ContentIdea with collection and notes
interface ExtendedContentIdea extends ContentIdea {
  collection?: string
  notes?: string
  dateAdded: string
}

// Save a content idea to favorites
export function saveFavorite(idea: ContentIdea): void {
  // Get existing favorites from localStorage
  const existingFavorites = getFavorites()

  // Check if this idea is already in favorites
  const exists = existingFavorites.some((fav) => fav.id === idea.id)

  if (!exists) {
    // Add the new favorite with timestamp and default collection
    const updatedFavorites = [
      ...existingFavorites,
      {
        ...idea,
        isFavorite: true,
        dateAdded: new Date().toISOString(),
        collection: "Uncategorized",
        notes: "",
      },
    ]

    // Save back to localStorage
    localStorage.setItem("viralgen_favorites", JSON.stringify(updatedFavorites))
  }
}

// Remove a content idea from favorites
export function removeFavorite(ideaId: string): void {
  // Get existing favorites
  const existingFavorites = getFavorites()

  // Filter out the idea to remove
  const updatedFavorites = existingFavorites.filter((idea) => idea.id !== ideaId)

  // Save back to localStorage
  localStorage.setItem("viralgen_favorites", JSON.stringify(updatedFavorites))
}

// Get all favorites
export function getFavorites(): ExtendedContentIdea[] {
  if (typeof window === "undefined") {
    return []
  }

  const favoritesJson = localStorage.getItem("viralgen_favorites")

  if (!favoritesJson) {
    return []
  }

  try {
    return JSON.parse(favoritesJson)
  } catch (error) {
    console.error("Error parsing favorites from localStorage:", error)
    return []
  }
}

// Toggle favorite status
export function toggleFavorite(idea: ContentIdea): ContentIdea {
  const updatedIdea = { ...idea, isFavorite: !idea.isFavorite }

  if (updatedIdea.isFavorite) {
    saveFavorite(updatedIdea)
  } else {
    removeFavorite(idea.id)
  }

  return updatedIdea
}

// Update favorite notes
export function updateFavoriteNotes(ideaId: string, notes: string): void {
  // Get existing favorites
  const existingFavorites = getFavorites()

  // Update the notes for the specified idea
  const updatedFavorites = existingFavorites.map((idea) => {
    if (idea.id === ideaId) {
      return { ...idea, notes }
    }
    return idea
  })

  // Save back to localStorage
  localStorage.setItem("viralgen_favorites", JSON.stringify(updatedFavorites))
}

// Update favorite collection
export function updateFavoriteCollection(ideaId: string, collection: string): void {
  // Get existing favorites
  const existingFavorites = getFavorites()

  // Update the collection for the specified idea
  const updatedFavorites = existingFavorites.map((idea) => {
    if (idea.id === ideaId) {
      return { ...idea, collection }
    }
    return idea
  })

  // Save back to localStorage
  localStorage.setItem("viralgen_favorites", JSON.stringify(updatedFavorites))
}

// Get all collections
export function getCollections(): string[] {
  const favorites = getFavorites()
  const collections = new Set<string>()

  favorites.forEach((favorite) => {
    if (favorite.collection) {
      collections.add(favorite.collection)
    }
  })

  return Array.from(collections)
}
