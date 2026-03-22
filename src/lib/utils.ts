import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string | null): string {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeDate(dateString: string | null): string {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `In ${diffDays} days`;
  return formatDate(dateString);
}

export function getGradeColor(score: number | null): string {
  if (score === null) return "text-gray-400";
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-yellow-600";
  if (score >= 60) return "text-orange-600";
  return "text-red-600";
}

export function getGradeBadgeColor(score: number | null): string {
  if (score === null) return "bg-gray-100 text-gray-600";
  if (score >= 90) return "bg-green-100 text-green-700";
  if (score >= 80) return "bg-blue-100 text-blue-700";
  if (score >= 70) return "bg-yellow-100 text-yellow-700";
  if (score >= 60) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function getDueDateStatus(
  dueAt: string | null
): "overdue" | "due-soon" | "upcoming" | "none" {
  if (!dueAt) return "none";
  const due = new Date(dueAt);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) return "overdue";
  if (diffHours < 48) return "due-soon";
  return "upcoming";
}
