// src/app/map/page.tsx
// Страница с интерактивной картой города Любим.
// Leaflet не работает при серверном рендеринге (обращается к window),
// поэтому компонент карты импортируется динамически с ssr: false.

"use client";

import dynamic from "next/dynamic";
import PageHeader from "../components/PageHeader";
import { places, CATEGORY_LABELS, type PlaceCategory } from "../data/places";
import { getIconByCategory } from "../components/PlaceIcons";

const CityMap = dynamic(() => import("../components/CityMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center h-full"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="text-center">
        <div
          className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
        />
        <p className="text-xs uppercase tracking-widest" style={{
          color: "var(--color-text-dim)",
          letterSpacing: "0.15em",
        }}>
          Загрузка карты
        </p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  // Подсчёт числа мест в каждой категории
  const categoryCounts = places.reduce((acc, place) => {
    acc[place.category] = (acc[place.category] || 0) + 1;
    return acc;
  }, {} as Record<PlaceCategory, number>);

  return (
    <>
      <PageHeader
        eyebrow="Интерактивная карта"
        title="Карта Любима"
        subtitle={`${places.length} отмеченных точек`}
      />

      {/* Контейнер карты фиксированной высоты */}
      <div
        className="h-[60vh] min-h-[400px] border-y"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <CityMap />
      </div>

      {/* Легенда */}
      <section className="px-6 py-6 stagger-children">
        <div
          className="text-xs uppercase tracking-widest mb-4 font-medium"
          style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
        >
          Условные обозначения
        </div>
        <ul className="space-y-3">
          {(Object.keys(categoryCounts) as PlaceCategory[]).map((cat) => (
            <li
              key={cat}
              className="flex items-center gap-3 py-1"
            >
              {/* Мини-иконка категории в бронзовом круге */}
              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-accent-dim)",
                  color: "var(--color-accent)",
                }}
              >
                {getIconByCategory(cat, 22)}
              </div>
              <span
                className="flex-1 text-sm"
                style={{ color: "var(--color-text)" }}
              >
                {CATEGORY_LABELS[cat]}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {categoryCounts[cat]} {pluralize(categoryCounts[cat], ["место", "места", "мест"])}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Подсказки */}
      <section
        className="px-6 py-6 border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="text-xs uppercase tracking-widest mb-4 font-medium"
          style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
        >
          Как пользоваться
        </div>
        <ul
          className="space-y-2.5 text-sm leading-relaxed"
          style={{ color: "var(--color-text-dim)" }}
        >
          <TipRow>Нажмите на метку, чтобы увидеть краткую информацию о месте</TipRow>
          <TipRow>Щипком или колесом мыши можно приближать и удалять карту</TipRow>
          <TipRow>Ссылка «Подробнее» во всплывающем окне откроет страницу объекта</TipRow>
        </ul>
      </section>
    </>
  );
}

/**
 * Строка подсказки со стрелкой.
 */
function TipRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="shrink-0 mt-1.5 w-1 h-1 rounded-full"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
      <span className="flex-1">{children}</span>
    </li>
  );
}

/**
 * Русское склонение существительного по числу.
 */
function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}
