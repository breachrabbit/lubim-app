// src/app/routes/page.tsx
// Страница туристических маршрутов по городу.
// Каждый маршрут — крупная карточка с метриками и пошаговой последовательностью мест.

import { routes } from "../data/routes";
import { places, getPlaceById } from "../data/places";
import PageHeader from "../components/PageHeader";
import Link from "next/link";

export default function RoutesPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${routes.length} маршрута`}
        title="Маршруты"
        subtitle="Готовые пешеходные прогулки по городу"
      />

      <div className="p-4 space-y-5 stagger-children">
        {routes.map((route) => {
          const routePlaces = route.placeIds
            .map((id) => getPlaceById(id))
            .filter(Boolean) as typeof places;

          return (
            <article
              key={route.id}
              className="rounded-2xl overflow-hidden border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              {/* Шапка с номером и названием */}
              <div
                className="relative p-6 border-b overflow-hidden"
                style={{
                  borderColor: "var(--color-border)",
                  background:
                    "radial-gradient(ellipse at top right, rgba(201, 169, 110, 0.15), transparent 60%)",
                }}
              >
                {/* Большой бронзовый номер маршрута */}
                <div
                  className="absolute top-4 right-6 font-serif text-7xl leading-none opacity-20"
                  style={{ color: "var(--color-accent)" }}
                >
                  0{route.id}
                </div>

                <div
                  className="text-xs uppercase tracking-widest mb-2 font-medium relative z-10"
                  style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
                >
                  {route.subtitle}
                </div>
                <h2
                  className="font-serif text-2xl leading-tight relative z-10"
                  style={{ color: "var(--color-text)" }}
                >
                  {route.title}
                </h2>

                {/* Метрики маршрута */}
                <div
                  className="flex gap-5 mt-4 text-xs relative z-10"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  <Metric label="Время" value={route.duration} />
                  <Metric label="Длина" value={`${route.lengthKm} км`} />
                  <Metric label="Точек" value={route.placeIds.length.toString()} />
                </div>
              </div>

              {/* Описание */}
              <div className="p-6">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  {route.description}
                </p>
              </div>

              {/* Пошаговая последовательность */}
              <div
                className="px-6 pb-6 pt-2 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className="text-xs uppercase tracking-widest mb-4 pt-4 font-medium"
                  style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
                >
                  По шагам
                </div>
                <ol className="relative">
                  {/* Вертикальная соединительная линия */}
                  <div
                    className="absolute left-[11px] top-2 bottom-2 w-px"
                    style={{ backgroundColor: "var(--color-border)" }}
                  />

                  {routePlaces.map((place, index) => (
                    <li
                      key={place.id}
                      className="relative flex items-start gap-4 pb-4 last:pb-0"
                    >
                      {/* Номер в круге */}
                      <div
                        className="relative z-10 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium border"
                        style={{
                          backgroundColor: "var(--color-bg)",
                          color: "var(--color-accent)",
                          borderColor: "var(--color-accent)",
                        }}
                      >
                        {index + 1}
                      </div>
                      <Link
                        href={`/places/${place.slug}`}
                        className="flex-1 text-sm pt-0.5 transition-colors hover:text-[var(--color-accent)]"
                        style={{ color: "var(--color-text)" }}
                      >
                        {place.name}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-widest"
        style={{ color: "var(--color-text-muted)", letterSpacing: "0.1em" }}
      >
        {label}
      </div>
      <div
        className="text-sm font-medium mt-0.5"
        style={{ color: "var(--color-text)" }}
      >
        {value}
      </div>
    </div>
  );
}
