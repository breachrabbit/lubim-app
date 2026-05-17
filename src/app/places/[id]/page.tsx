// src/app/places/[id]/page.tsx
// Страница подробного описания одной достопримечательности.

import { notFound } from "next/navigation";
import Link from "next/link";
import { places, getPlaceBySlug, CATEGORY_LABELS } from "../../data/places";
import { getAudioPaths } from "../../data/audio-scripts";
import PlacePlaceholder from "../../components/PlacePlaceholder";
import { getIconByCategory } from "../../components/PlaceIcons";
import AudioGuidePlayer from "../../components/AudioGuidePlayer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return places.map((place) => ({ id: place.slug }));
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const place = getPlaceBySlug(id);
  if (!place) notFound();

  const routeUrl = `https://yandex.ru/maps/?rtext=~${place.latitude},${place.longitude}&rtt=pd`;
  const audio = getAudioPaths(place.slug);

  return (
    <>
      {/* Кнопка возврата — sticky поверх контента */}
      <div
        className="sticky top-0 z-40 backdrop-blur-xl border-b"
        style={{
          backgroundColor: "rgba(15, 15, 15, 0.85)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center h-14 px-4">
          <Link
            href="/places"
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "var(--color-accent)" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            К списку мест
          </Link>
        </div>
      </div>

      {/* Hero с изображением и категорией */}
      <div className="relative h-80 overflow-hidden">
        {place.imageFile ? (
          <img
            src={`/images/${place.imageFile}`}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <PlacePlaceholder
            icon={getIconByCategory(place.category, 120)}
            category={place.category}
          />
        )}
        {/* Градиент для читаемости метки */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(15,15,15,0.95))",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <span
            className="inline-block text-[11px] px-3 py-1 rounded-full font-medium tracking-widest uppercase border backdrop-blur-md"
            style={{
              backgroundColor: "rgba(15, 15, 15, 0.6)",
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
              letterSpacing: "0.1em",
            }}
          >
            {CATEGORY_LABELS[place.category]}
          </span>
        </div>
      </div>

      {/* Название и краткое описание */}
      <article className="px-6 pt-6 pb-4 stagger-children">
        <h1
          className="font-serif text-3xl leading-tight mb-3"
          style={{ color: "var(--color-text)" }}
        >
          {place.name}
        </h1>
        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--color-text-dim)" }}
        >
          {place.shortDescription}
        </p>
      </article>

      {/* Аудиогид — плеер подключается только если есть сценарий в audio-scripts.ts */}
      <AudioGuidePlayer
        maleSrc={audio.male}
        femaleSrc={audio.female}
        knownDurationSeconds={audio.durationSeconds}
      />

      {/* Информационная таблица */}
      <section
        className="mx-6 mt-6 rounded-xl border overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        {place.yearBuilt && (
          <InfoRow label="Датировка" value={place.yearBuilt} />
        )}
        {place.address && <InfoRow label="Адрес" value={place.address} />}
        <InfoRow
          label="Координаты"
          value={`${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}`}
          isLast
        />
      </section>

      {/* Подробное описание с серифной типографикой */}
      <section className="px-6 pt-8 pb-4">
        <div
          className="text-xs uppercase tracking-widest mb-3 font-medium"
          style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
        >
          История
        </div>
        <div
          className="text-base leading-relaxed whitespace-pre-line"
          style={{ color: "var(--color-text-dim)" }}
        >
          {place.description}
        </div>
      </section>

      {/* CTA-кнопка построения маршрута */}
      <div className="px-6 pt-6 pb-10">
        <a
          href={routeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center gap-3 w-full rounded-xl py-4 font-medium text-base transition-all duration-300 border glow-accent"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-bg)",
            borderColor: "var(--color-accent-bright)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          Построить маршрут
        </a>
        <p
          className="text-center text-xs mt-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Откроется в Яндекс.Картах
        </p>
      </div>
    </>
  );
}

function InfoRow({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3.5 gap-4 ${
        isLast ? "" : "border-b"
      }`}
      style={{ borderColor: "var(--color-border)" }}
    >
      <span
        className="text-xs uppercase tracking-widest shrink-0"
        style={{ color: "var(--color-text-muted)", letterSpacing: "0.1em" }}
      >
        {label}
      </span>
      <span
        className="text-sm text-right"
        style={{ color: "var(--color-text)" }}
      >
        {value}
      </span>
    </div>
  );
}
