import clsx, { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatRating(rating: number | null | undefined): string {
  if (rating == null) return "—";
  return rating % 1 === 0 ? `${rating}` : rating.toFixed(1);
}

export function usernameFromEmail(email: string): string {
  const base = email.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "") || "member";
  return base.slice(0, 20).toLowerCase();
}
