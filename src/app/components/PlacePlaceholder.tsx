// src/app/components/PlacePlaceholder.tsx
// SVG-заглушка для отображения места при отсутствии реального фото.
// Тёмный фон + тонкие бронзовые акценты в стиле премиум-темы.

import type { PlaceCategory } from "../data/places";

interface PlacePlaceholderProps {
  icon: React.ReactNode;
  category: PlaceCategory;
  className?: string;
}

/**
 * Тонкие цветовые оттенки для градиента фона. Все — вариации графита,
 * чтобы все места выглядели в единой тёмной стилистике, но различались.
 */
const COLOR_SCHEMES: Record<PlaceCategory, { from: string; to: string }> = {
  church:   { from: "#1a1814", to: "#2d2620" },
  museum:   { from: "#1a1a1a", to: "#2a2a2a" },
  park:     { from: "#151a17", to: "#232a25" },
  monument: { from: "#1a1618", to: "#2a2428" },
  nature:   { from: "#141815", to: "#212823" },
};

export default function PlacePlaceholder({
  icon,
  category,
  className = "",
}: PlacePlaceholderProps) {
  const colors = COLOR_SCHEMES[category];
  const gradientId = `grad-${category}`;
  const patternId = `pattern-${category}`;

  return (
    <div className={`w-full h-full overflow-hidden relative ${className}`}>
      <svg
        viewBox="0 0 400 250"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="50" height="50">
            <circle cx="25" cy="25" r="0.8" fill="rgba(201, 169, 110, 0.12)" />
          </pattern>
        </defs>

        {/* Основной фон */}
        <rect width="400" height="250" fill={`url(#${gradientId})`} />
        {/* Бронзовая точечная текстура */}
        <rect width="400" height="250" fill={`url(#${patternId})`} />

        {/* Тонкие декоративные линии в стиле ар-деко */}
        <line x1="30" y1="30" x2="80" y2="30" stroke="#c9a96e" strokeWidth="0.5" opacity="0.4" />
        <line x1="320" y1="220" x2="370" y2="220" stroke="#c9a96e" strokeWidth="0.5" opacity="0.4" />

        {/* Угловые декоры */}
        <path d="M30 30 L30 40" stroke="#c9a96e" strokeWidth="0.5" opacity="0.4" />
        <path d="M370 220 L370 210" stroke="#c9a96e" strokeWidth="0.5" opacity="0.4" />

        {/* Иконка по центру — передаётся как React-элемент */}
        <foreignObject x="150" y="75" width="100" height="100">
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c9a96e",
            }}
          >
            {icon}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
