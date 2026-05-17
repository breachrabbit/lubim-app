// src/app/components/PlaceIcons.tsx
// Набор линейных SVG-иконок для категорий мест.
// Единый визуальный язык с нижней навигацией — тонкие линии, stroke 1.5.

import type { PlaceCategory } from "../data/places";

interface IconProps {
  size?: number;
  className?: string;
}

export function ChurchIcon({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Купол с крестом */}
      <path d="M32 8 L32 14" />
      <path d="M28 11 L36 11" />
      <path d="M28 20 Q32 14 36 20" fill="currentColor" fillOpacity="0.08" />
      {/* Основное здание */}
      <rect x="22" y="30" width="20" height="22" strokeWidth="1.5" />
      <path d="M20 30 L32 20 L44 30" />
      {/* Окно-арка */}
      <path d="M29 38 Q32 34 35 38 L35 46 L29 46 Z" fillOpacity="0" />
      {/* Основание */}
      <line x1="18" y1="52" x2="46" y2="52" />
    </svg>
  );
}

export function MuseumIcon({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Фронтон (треугольник) */}
      <path d="M10 22 L32 10 L54 22" />
      {/* Архитрав */}
      <line x1="10" y1="22" x2="54" y2="22" />
      {/* Колонны */}
      <line x1="16" y1="22" x2="16" y2="48" strokeWidth="2" />
      <line x1="26" y1="22" x2="26" y2="48" strokeWidth="2" />
      <line x1="38" y1="22" x2="38" y2="48" strokeWidth="2" />
      <line x1="48" y1="22" x2="48" y2="48" strokeWidth="2" />
      {/* Основание */}
      <line x1="10" y1="48" x2="54" y2="48" />
      <line x1="8" y1="52" x2="56" y2="52" />
    </svg>
  );
}

export function ParkIcon({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Лиственное дерево */}
      <circle cx="22" cy="24" r="10" fillOpacity="0" />
      <line x1="22" y1="34" x2="22" y2="50" />
      {/* Хвойное дерево */}
      <path d="M42 12 L34 28 L50 28 Z" fillOpacity="0" />
      <path d="M42 20 L36 34 L48 34 Z" fillOpacity="0" />
      <line x1="42" y1="34" x2="42" y2="50" />
      {/* Земля */}
      <path d="M10 52 Q32 48 54 52" />
    </svg>
  );
}

export function MonumentIcon({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Беседка-ротонда с куполом */}
      <ellipse cx="32" cy="18" rx="14" ry="4" />
      <path d="M18 18 Q32 10 46 18" />
      {/* Колонны */}
      <line x1="22" y1="22" x2="22" y2="46" strokeWidth="2" />
      <line x1="32" y1="22" x2="32" y2="46" strokeWidth="2" />
      <line x1="42" y1="22" x2="42" y2="46" strokeWidth="2" />
      {/* Основание */}
      <ellipse cx="32" cy="46" rx="14" ry="3" />
      <ellipse cx="32" cy="50" rx="16" ry="3" />
    </svg>
  );
}

export function NatureIcon({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Три сосны разного размера */}
      <path d="M20 18 L14 30 L26 30 Z" fillOpacity="0" />
      <path d="M20 26 L15 36 L25 36 Z" fillOpacity="0" />
      <line x1="20" y1="36" x2="20" y2="48" />

      <path d="M38 10 L30 26 L46 26 Z" fillOpacity="0" />
      <path d="M38 20 L32 32 L44 32 Z" fillOpacity="0" />
      <path d="M38 28 L34 38 L42 38 Z" fillOpacity="0" />
      <line x1="38" y1="38" x2="38" y2="52" />

      {/* Земля */}
      <path d="M8 52 Q32 48 56 52" />
    </svg>
  );
}

/**
 * Возвращает иконку по категории места.
 */
export function getIconByCategory(category: PlaceCategory, size = 64, className?: string) {
  switch (category) {
    case "church":
      return <ChurchIcon size={size} className={className} />;
    case "museum":
      return <MuseumIcon size={size} className={className} />;
    case "park":
      return <ParkIcon size={size} className={className} />;
    case "monument":
      return <MonumentIcon size={size} className={className} />;
    case "nature":
      return <NatureIcon size={size} className={className} />;
  }
}
