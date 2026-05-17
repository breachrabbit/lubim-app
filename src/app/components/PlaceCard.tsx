// src/app/components/PlaceCard.tsx
// Карточка достопримечательности в тёмном премиальном стиле.
// При наведении появляется тонкая бронзовая подсветка.

import Link from "next/link";
import type { Place } from "../data/places";
import { CATEGORY_LABELS } from "../data/places";
import PlacePlaceholder from "./PlacePlaceholder";
import { getIconByCategory } from "./PlaceIcons";

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link
      href={`/places/${place.slug}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-300 border"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Шапка с иконкой/фото */}
      <div className="h-48 relative overflow-hidden">
        {place.imageFile ? (
          <img
            src={`/images/${place.imageFile}`}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlacePlaceholder
            icon={getIconByCategory(place.category, 80)}
            category={place.category}
          />
        )}
        {/* Градиент снизу для читаемости label */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(15,15,15,0.95), transparent)",
          }}
        />
        {/* Метка категории */}
        <span
          className="absolute top-3 right-3 text-[11px] px-2.5 py-1 rounded-full font-medium tracking-wide uppercase border backdrop-blur-md"
          style={{
            backgroundColor: "rgba(15, 15, 15, 0.6)",
            borderColor: "var(--color-accent-dim)",
            color: "var(--color-accent)",
            letterSpacing: "0.05em",
          }}
        >
          {CATEGORY_LABELS[place.category]}
        </span>
      </div>

      {/* Основной контент карточки */}
      <div className="p-5">
        <h3
          className="font-serif text-lg leading-tight mb-1.5 transition-colors duration-300 group-hover:text-[var(--color-accent-bright)]"
          style={{ color: "var(--color-text)" }}
        >
          {place.name}
        </h3>
        <p
          className="text-sm leading-relaxed mb-4 line-clamp-2"
          style={{ color: "var(--color-text-dim)" }}
        >
          {place.shortDescription}
        </p>

        {/* Метаданные внизу */}
        <div
          className="flex items-center gap-4 text-xs pt-3 border-t"
          style={{
            color: "var(--color-text-muted)",
            borderColor: "var(--color-border)",
          }}
        >
          {place.yearBuilt && (
            <span className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="w-3.5 h-3.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="truncate">{place.yearBuilt}</span>
            </span>
          )}
          {place.address && (
            <span className="flex items-center gap-1.5 min-w-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 shrink-0"
              >
                <path d="M12 22s-8-8-8-13a8 8 0 0 1 16 0c0 5-8 13-8 13z" />
                <circle cx="12" cy="9" r="3" />
              </svg>
              <span className="truncate">{place.address}</span>
            </span>
          )}
        </div>
      </div>

      {/* Тонкая бронзовая линия при hover */}
      <div
        className="h-0.5 transition-all duration-300 group-hover:opacity-100 opacity-0"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
    </Link>
  );
}
