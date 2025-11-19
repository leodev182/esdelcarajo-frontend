import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatea precio en bolívares
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea fecha en español
 */
export function formatDate(
  date: string | Date,
  formatStr: string = "PPP"
): string {
  return format(new Date(date), formatStr, { locale: es });
}

/**
 * Formatea fecha relativa (hace 2 días, etc.)
 */
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Hoy";
  if (diffInDays === 1) return "Ayer";
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;

  return formatDate(targetDate, "PP");
}

/**
 * Trunca texto con ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
