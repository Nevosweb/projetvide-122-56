
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";
import { fr } from "date-fns/locale";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return format(date, "d MMMM yyyy", { locale: fr });
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "HH:mm", { locale: fr });
}

// Helper to find the optimal table size for a party
export function findOptimalTableSize(partySizes: number[], partySize: number): number | null {
  // First look for an exact match or slightly larger
  const exactOrSlightlyLarger = partySizes
    .filter(size => size >= partySize && size <= partySize + 2)
    .sort((a, b) => a - b)[0];
    
  if (exactOrSlightlyLarger) return exactOrSlightlyLarger;
  
  // Otherwise, find the smallest table that can fit the party
  const smallestFitting = partySizes
    .filter(size => size >= partySize)
    .sort((a, b) => a - b)[0];
    
  if (smallestFitting) return smallestFitting;
  
  // If no table is big enough, return the largest available
  return partySizes.length > 0 ? Math.max(...partySizes) : null;
}

// Check if two time intervals overlap
export function doTimeIntervalsOverlap(
  startA: Date | string, 
  endA: Date | string, 
  startB: Date | string, 
  endB: Date | string
): boolean {
  // Convert to Date objects if they are strings
  const start1 = typeof startA === 'string' ? new Date(startA) : startA;
  const end1 = typeof endA === 'string' ? new Date(endA) : endA;
  const start2 = typeof startB === 'string' ? new Date(startB) : startB;
  const end2 = typeof endB === 'string' ? new Date(endB) : endB;
  
  // Standard interval overlap check: (startA < endB) AND (endA > startB)
  return start1 < end2 && end1 > start2;
}
