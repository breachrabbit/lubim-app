// src/app/page.tsx
// Главная страница приложения — визитка города Любим.
// Премиальная тёмная вёрстка в духе журнальной статьи:
// hero-секция, крупная типографика, акцентные цитаты, тонкие бронзовые линии.

import { cityInfo } from "./data/city";
import { places } from "./data/places";
import { routes } from "./data/routes";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section
        className="relative overflow-hidden px-6 pt-14 pb-10"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(201, 169, 110, 0.12), transparent 60%)",
        }}
      >
        {/* Декоративная рамка в стиле ар-деко */}
        <div
          className="absolute top-6 left-6 w-12 h-12 border-l border-t"
          style={{ borderColor: "var(--color-accent)", opacity: 0.6 }}
        />
        <div
          className="absolute top-6 right-6 w-12 h-12 border-r border-t"
          style={{ borderColor: "var(--color-accent)", opacity: 0.6 }}
        />

        <div
          className="text-xs uppercase tracking-widest mb-4 font-medium text-center"
          style={{ color: "var(--color-accent)", letterSpacing: "0.25em" }}
        >
          {cityInfo.region}
        </div>

        <h1
          className="font-serif text-5xl sm:text-6xl leading-none text-center mb-4"
          style={{ color: "var(--color-text)", fontWeight: 400 }}
        >
          Любим
        </h1>

        <p
          className="text-center text-sm mb-6"
          style={{ color: "var(--color-text-dim)" }}
        >
          Самый маленький город Ярославской области
        </p>

        {/* Тонкая декоративная черта с ромбом посередине */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ backgroundColor: "var(--color-accent)" }} />
          <div
            className="w-2 h-2 rotate-45"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
          <div className="h-px w-16" style={{ backgroundColor: "var(--color-accent)" }} />
        </div>
      </section>

      {/* ============ СТАТИСТИКА ============ */}
      <section className="px-6 py-8 stagger-children">
        <div className="grid grid-cols-3 gap-3">
          <StatCard value={cityInfo.foundedYear.toString()} label="Основан" />
          <StatCard value={cityInfo.population.toLocaleString("ru-RU")} label="Жителей" />
          <StatCard value={`${cityInfo.area} км²`} label="Площадь" />
        </div>
      </section>

      {/* ============ ОПИСАНИЕ ============ */}
      <ContentSection
        eyebrow="О городе"
        title="Крепость царя Ивана Грозного"
        body={cityInfo.description}
      />

      {/* ============ ЦИТАТА-АКЦЕНТ ============ */}
      <section className="px-6 py-10">
        <blockquote
          className="font-serif text-2xl leading-snug text-center italic"
          style={{ color: "var(--color-accent-bright)", fontWeight: 400 }}
        >
          «Заложили Любим да Буй, два городка, и поставили»
        </blockquote>
        <p
          className="text-center text-xs mt-4 uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)", letterSpacing: "0.15em" }}
        >
          Галический летописец, 1534 год
        </p>
      </section>

      {/* ============ ПРОИСХОЖДЕНИЕ НАЗВАНИЯ ============ */}
      <ContentSection
        eyebrow="Этимология"
        title="Откуда название"
        body={cityInfo.nameOrigin}
      />

      {/* ============ АРХИТЕКТУРА ============ */}
      <ContentSection
        eyebrow="Градостроительство"
        title="Веерно-радиальный генплан Екатерины II"
        body={cityInfo.architecture}
      />

      {/* ============ ЗНАМЕНИТЫЕ УРОЖЕНЦЫ ============ */}
      <ContentSection
        eyebrow="Имена"
        title="Поэт Леонид Трефолев"
        body={cityInfo.notablePeople}
      />

      {/* ============ БЫСТРЫЕ ССЫЛКИ ============ */}
      <section className="px-6 py-8">
        <div
          className="text-xs uppercase tracking-widest mb-4 font-medium"
          style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
        >
          Начать путешествие
        </div>
        <div className="grid grid-cols-2 gap-3">
          <QuickLink
            href="/places"
            label="Достопримечательности"
            count={places.length}
            unit="мест"
          />
          <QuickLink
            href="/routes"
            label="Готовые маршруты"
            count={routes.length}
            unit="маршрутов"
          />
        </div>
      </section>

      {/* ============ ТРАНСПОРТ ============ */}
      <ContentSection
        eyebrow="Как добраться"
        title="До Любима"
        customBody={
          <ul className="space-y-3 text-base leading-relaxed">
            <TransportRow
              from="От Ярославля"
              value={`${cityInfo.distanceToYaroslavl} км`}
              direction="на северо-восток"
            />
            <TransportRow
              from="От Костромы"
              value={`${cityInfo.distanceToKostroma} км`}
              direction="на север"
            />
            <TransportRow
              from="Железная дорога"
              value="Станция Любим"
              direction="линии Москва–Чита, Буй–Данилов"
            />
          </ul>
        }
      />

      {/* ============ ФУТЕР ============ */}
      <footer
        className="px-6 py-8 text-center text-xs border-t mt-6"
        style={{
          color: "var(--color-text-muted)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="font-serif text-base mb-2"
          style={{ color: "var(--color-accent)" }}
        >
          Гид по Любиму
        </div>
        <p className="leading-relaxed max-w-sm mx-auto">
          Туристический путеводитель по самому маленькому городу
          Ярославской области. Создан в рамках выпускной
          квалификационной работы.
        </p>
        <p className="mt-3 opacity-70">
          Источники: БРЭ, Википедия, Любимский историко-краеведческий музей
        </p>
      </footer>
    </>
  );
}

// ==================== Вспомогательные компоненты ====================

/**
 * Карточка статистики для hero-блока.
 */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="rounded-xl p-4 text-center border"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="font-serif text-2xl leading-none"
        style={{ color: "var(--color-accent)" }}
      >
        {value}
      </div>
      <div
        className="text-[10px] uppercase tracking-widest mt-2"
        style={{ color: "var(--color-text-dim)", letterSpacing: "0.1em" }}
      >
        {label}
      </div>
    </div>
  );
}

/**
 * Редакторская секция с eyebrow, заголовком и текстом.
 * Позволяет передавать как обычный текст через `body`,
 * так и произвольный JSX через `customBody`.
 */
function ContentSection({
  eyebrow,
  title,
  body,
  customBody,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  customBody?: React.ReactNode;
}) {
  return (
    <section
      className="px-6 py-8 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div
        className="text-xs uppercase tracking-widest mb-3 font-medium"
        style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
      >
        {eyebrow}
      </div>
      <h2
        className="font-serif text-2xl leading-tight mb-4"
        style={{ color: "var(--color-text)" }}
      >
        {title}
      </h2>
      {body && (
        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--color-text-dim)" }}
        >
          {body}
        </p>
      )}
      {customBody}
    </section>
  );
}

/**
 * Быстрая ссылка на другой раздел приложения.
 */
function QuickLink({
  href,
  label,
  count,
  unit,
}: {
  href: string;
  label: string;
  count: number;
  unit: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block rounded-xl p-5 border overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="font-serif text-3xl leading-none mb-1"
        style={{ color: "var(--color-accent)" }}
      >
        {count}
      </div>
      <div
        className="text-[11px] uppercase tracking-widest"
        style={{ color: "var(--color-text-muted)", letterSpacing: "0.1em" }}
      >
        {unit}
      </div>
      <div
        className="text-sm mt-3 leading-snug"
        style={{ color: "var(--color-text)" }}
      >
        {label} →
      </div>
      {/* Бронзовая hover-линия снизу */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
    </Link>
  );
}

/**
 * Строка транспорта: "Откуда — Сколько — Куда".
 */
function TransportRow({
  from,
  value,
  direction,
}: {
  from: string;
  value: string;
  direction: string;
}) {
  return (
    <li className="flex items-baseline gap-3">
      <span
        className="text-xs uppercase tracking-widest shrink-0"
        style={{ color: "var(--color-text-muted)", letterSpacing: "0.1em", minWidth: "100px" }}
      >
        {from}
      </span>
      <span
        className="font-serif text-lg"
        style={{ color: "var(--color-accent)" }}
      >
        {value}
      </span>
      <span
        className="text-sm"
        style={{ color: "var(--color-text-dim)" }}
      >
        {direction}
      </span>
    </li>
  );
}
