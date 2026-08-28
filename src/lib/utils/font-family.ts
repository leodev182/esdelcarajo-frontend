import { FontFamily } from "@/src/lib/api/landing.api";

const FONT_VAR_MAP: Record<NonNullable<FontFamily>, string> = {
  "zuume-rough": "var(--font-zuume-rough)",
  "western-bang-bang": "var(--font-western-bang-bang)",
  "special-elite": "var(--font-special-elite)",
  "life-is-so-wonderful": "var(--font-life-is-so-wonderful)",
  "cut-the-crap": "var(--font-cut-the-crap)",
};

export function getFontStyle(
  fontFamily?: FontFamily | null
): React.CSSProperties {
  if (!fontFamily) return {};
  return { fontFamily: FONT_VAR_MAP[fontFamily] ?? undefined };
}

export const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: "zuume-rough", label: "Zuume Rough" },
  { value: "western-bang-bang", label: "Western Bang Bang" },
  { value: "special-elite", label: "Special Elite" },
  { value: "life-is-so-wonderful", label: "Life is so Wonderful" },
  { value: "cut-the-crap", label: "Cut the Crap" },
];
