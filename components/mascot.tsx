"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface MascotProps {
  emotion?: "happy" | "excited" | "thinking" | "celebrating"
  message?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Mascot({ emotion = "happy", message, className = "", size = "md" }: MascotProps) {
  const [randomTip, setRandomTip] = useState("")
  const [imageError, setImageError] = useState(false)

  const tips = [
    "Try asking for carousel ideas!",
    "Need help with reels? Just ask!",
    "Don't forget to save your favorites!",
    "Complete your profile for better ideas!",
    "Pro tip: Be specific about your niche!",
  ]

  useEffect(() => {
    setRandomTip(tips[Math.floor(Math.random() * tips.length)])
  }, [])

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const getEmotionImage = () => {
    switch (emotion) {
      case "excited":
        return "/mascot-excited.png"
      case "thinking":
        return "/mascot-thinking.png"
      case "celebrating":
        return "/mascot-celebrating.png"
      case "happy":
      default:
        return "/mascot-happy.png"
    }
  }

  const fallbackImage = "/energetic-animal-mascot.png"

  return (
    <div className={`relative flex items-end ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative z-10`}
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src={imageError ? fallbackImage : getEmotionImage()}
            alt="ViralGen Mascot"
            className="w-full h-full object-contain"
            width={size === "sm" ? 64 : size === "md" ? 96 : 128}
            height={size === "sm" ? 64 : size === "md" ? 96 : 128}
            onError={() => setImageError(true)}
            priority
          />
        </div>
      </motion.div>

      {message && (
        <motion.div
          className="absolute z-20 bg-white rounded-xl p-3 border-2 border-primary shadow-lg max-w-[200px] left-20"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute w-4 h-4 bg-white border-l-2 border-b-2 border-primary transform rotate-45 -left-2 bottom-4"></div>
          <p className="text-sm font-medium">{message || randomTip}</p>
        </motion.div>
      )}
    </div>
  )
}
