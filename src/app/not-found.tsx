// src/app/not-found.tsx
// Страница 404. Показывается, когда пользователь переходит на несуществующий адрес.

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        {/* Большое стилизованное "404" в серифе */}
        <div
          className="font-serif leading-none mb-4"
          style={{
            color: "var(--color-accent)",
            fontSize: "88px",
            fontWeight: 400,
          }}
        >
          404
        </div>

        {/* Декоративная бронзовая полоса */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12" style={{ backgroundColor: "var(--color-accent)" }} />
          <div
            className="w-2 h-2 rotate-45"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
          <div className="h-px w-12" style={{ backgroundColor: "var(--color-accent)" }} />
        </div>

        <h1
          className="font-serif text-2xl mb-3 leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          Страница не найдена
        </h1>

        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "var(--color-text-dim)" }}
        >
          Возможно, вы перешли по устаревшей ссылке или ввели несуществующий адрес.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl text-sm font-medium border transition-colors glow-accent"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-bg)",
            borderColor: "var(--color-accent-bright)",
          }}
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
