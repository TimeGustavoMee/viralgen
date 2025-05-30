import { Skeleton } from "@/components/ui/skeleton"

export default function CalendarLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[300px] mb-2" />
        <Skeleton className="h-4 w-[500px]" />
      </div>
      <div className="border rounded-lg p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  )
}
