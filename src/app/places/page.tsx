// src/app/places/page.tsx
// Страница каталога достопримечательностей.
// Верхняя панель с фильтром "пилюлями" + сетка карточек с поэтапным появлением.

"use client";

import { useState, useMemo } from "react";
import { places, CATEGORY_LABELS, type PlaceCategory } from "../data/places";
import PageHeader from "../components/PageHeader";
import PlaceCard from "../components/PlaceCard";

type FilterValue = "all" | PlaceCategory;

const FILTER_ORDER: FilterValue[] = [
  "all",
  "church",
  "museum",
  "park",
  "nature",
  "monument",
];

const FILTER_LABELS: Record<FilterValue, string> = {
  all: "Все",
  ...CATEGORY_LABELS,
};

export default function PlacesPage() {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filteredPlaces = useMemo(() => {
    if (filter === "all") return places;
    return places.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <>
      <PageHeader
        eyebrow={`${places.length} объектов`}
        title="Достопримечательности"
        subtitle="Каталог культурного наследия города"
      />

      {/* Sticky-панель с фильтрами */}
      <div
        className="sticky top-0 z-30 backdrop-blur-xl border-b"
        style={{
          backgroundColor: "rgba(15, 15, 15, 0.85)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-2 px-4 py-3 w-max">
            {FILTER_ORDER.map((value) => {
              const isActive = filter === value;
              return (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className="px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase whitespace-nowrap transition-all duration-200 border"
                  style={{
                    backgroundColor: isActive
                      ? "var(--color-accent)"
                      : "transparent",
                    color: isActive
                      ? "var(--color-bg)"
                      : "var(--color-text-dim)",
                    borderColor: isActive
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {FILTER_LABELS[value]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Результаты */}
      <div className="p-4">
        {filteredPlaces.length === 0 ? (
          <div
            className="text-center py-16"
            style={{ color: "var(--color-text-muted)" }}
          >
            <p className="text-sm">По выбранной категории ничего не найдено.</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children"
            // key на фильтре — заставляет React перестроить сетку при смене фильтра,
            // что перезапускает stagger-анимацию
            key={filter}
          >
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
