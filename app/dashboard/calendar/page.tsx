import type { Metadata } from "next"
import { ContentCalendar } from "@/components/dashboard/content-calendar"

export const metadata: Metadata = {
  title: "Content Calendar | ViralGen",
  description: "Schedule and organize your viral content ideas",
}

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
        <p className="text-muted-foreground">
          Schedule and organize your content ideas to maintain a consistent posting schedule.
        </p>
      </div>
      <ContentCalendar />
    </div>
  )
}
