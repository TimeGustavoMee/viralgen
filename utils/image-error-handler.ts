import type React from "react"
/**
 * Handles image loading errors by replacing the source with a placeholder
 * @param event The error event
 * @param fallbackText Text to use in the placeholder image
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackText = "image") {
  const target = event.target as HTMLImageElement
  const width = target.width || 100
  const height = target.height || 100
  target.src = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(fallbackText)}`
  target.onerror = null // Prevent infinite error loop
}
