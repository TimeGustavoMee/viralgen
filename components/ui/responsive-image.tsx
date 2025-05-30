"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface ResponsiveImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string
}

export function ResponsiveImage({ src, alt, fallbackText, ...props }: ResponsiveImageProps) {
  const [error, setError] = useState(false)

  const fallbackSrc = `/placeholder.svg?height=${props.height || 100}&width=${props.width || 100}&query=${encodeURIComponent(fallbackText || alt)}`

  return <Image src={error ? fallbackSrc : src} alt={alt} onError={() => setError(true)} {...props} />
}
