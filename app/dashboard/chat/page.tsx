"use client"

import { ChatInterface } from "@/components/dashboard/chat-interface"

export default function ChatPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Make Viral with AI</h1>
        <p className="text-muted-foreground">Generate viral content ideas in seconds with our advanced AI assistant.</p>
      </div>

      <ChatInterface />
    </div>
  )
}
