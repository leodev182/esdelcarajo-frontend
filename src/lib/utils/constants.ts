export const APP_NAME = "Del Carajo";
export const APP_DESCRIPTION = "Devotos del Arte - Ropa Urbana Venezolana";

// URLs de API y App
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Categorías principales (deben coincidir con el backend)
export const CATEGORIES = {
  CARAJOS: "carajos",
  CARAJAS: "carajas",
  CARAJITOS: "carajitos",
  OTRAS_VAINAS: "otras-vainas",
} as const;

// Items por página en el catálogo
export const PRODUCTS_PER_PAGE = 12;

// Duración del caché en milisegundos
export const CACHE_TIME = {
  SHORT: 1000 * 60 * 5, // 5 minutos
  MEDIUM: 1000 * 60 * 30, // 30 minutos
  LONG: 1000 * 60 * 60, // 1 hora
} as const;
