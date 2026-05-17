// src/app/components/PageHeader.tsx
// Единый заголовок страницы в тёмной премиальной стилистике.
// Крупный серифный шрифт + бронзовая декоративная линия под заголовком.

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;   // маленькая надпись над заголовком (например, "РАЗДЕЛ 1")
}

export default function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <header
      className="px-6 pt-10 pb-6 border-b"
      style={{ borderColor: "var(--color-border)" }}
    >
      {eyebrow && (
        <div
          className="text-xs uppercase tracking-widest mb-3 font-medium"
          style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
        >
          {eyebrow}
        </div>
      )}

      <h1
        className="font-serif text-3xl sm:text-4xl leading-tight tracking-tight"
        style={{ color: "var(--color-text)" }}
      >
        {title}
      </h1>

      {/* Декоративная бронзовая линия */}
      <div className="flex items-center gap-3 mt-4">
        <div
          className="h-px w-12"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
        {subtitle && (
          <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
