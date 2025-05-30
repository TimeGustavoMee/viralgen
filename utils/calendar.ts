// Helper functions for the content calendar

// Get the week number for a given date
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// Get the month name for a given month number
export function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[month]
}

// Get the day name for a given day number
export function getDayName(day: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[day]
}

// Get the number of days in a month
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

// Check if a date is today
export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// Format a date as YYYY-MM-DD
export function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Parse a date string in YYYY-MM-DD format
export function parseDateYYYYMMDD(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day)
}

// Get the best posting times for different platforms
export function getBestPostingTimes(platform: string): string[] {
  switch (platform.toLowerCase()) {
    case "instagram":
      return ["11:00", "13:00", "19:00", "21:00"]
    case "tiktok":
      return ["09:00", "12:00", "19:00", "22:00"]
    case "facebook":
      return ["08:00", "13:00", "15:00", "19:00"]
    case "twitter":
      return ["08:00", "12:00", "17:00", "21:00"]
    case "linkedin":
      return ["08:00", "10:00", "12:00", "17:00", "18:00"]
    case "youtube":
      return ["15:00", "16:00", "17:00", "18:00"]
    default:
      return ["09:00", "12:00", "15:00", "18:00"]
  }
}

// Get the best posting days for different platforms
export function getBestPostingDays(platform: string): number[] {
  // Days are 0-indexed (0 = Sunday, 6 = Saturday)
  switch (platform.toLowerCase()) {
    case "instagram":
      return [1, 2, 4, 5] // Monday, Tuesday, Thursday, Friday
    case "tiktok":
      return [1, 2, 3, 5] // Monday, Tuesday, Wednesday, Friday
    case "facebook":
      return [3, 4, 5] // Wednesday, Thursday, Friday
    case "twitter":
      return [1, 2, 3, 4] // Monday, Tuesday, Wednesday, Thursday
    case "linkedin":
      return [1, 2, 3] // Monday, Tuesday, Wednesday
    case "youtube":
      return [4, 5, 6, 0] // Thursday, Friday, Saturday, Sunday
    default:
      return [1, 2, 3, 4, 5] // Weekdays
  }
}
