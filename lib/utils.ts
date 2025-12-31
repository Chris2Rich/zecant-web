import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMessagesTimestamp(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffHours = diffMs / (1000 * 60 * 60);
  const date = new Date(timestamp);

  if (diffHours < 24) {
    // Show only time for messages within 24 hours
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Show full date for older messages
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}