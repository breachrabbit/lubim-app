// src/app/components/BottomNav.tsx
// Нижняя навигационная панель в тёмном стиле.
// Активный раздел подчёркивается бронзовой линией,
// переходы между разделами плавные за счёт transition.

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
  /**
   * Inline-SVG-иконка. Используем линейный контур, а не emoji —
   * это даёт премиальный вид и единый визуальный язык.
   */
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Город",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 21h18" />
        <path d="M5 21V8l4-3 4 3 4-3 4 3v13" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    name: "Места",
    href: "/places",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22s-8-8-8-13a8 8 0 0 1 16 0c0 5-8 13-8 13z" />
        <circle cx="12" cy="9" r="3" />
      </svg>
    ),
  },
  {
    name: "Маршруты",
    href: "/routes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 6h8a4 4 0 0 1 0 8H7a4 4 0 0 0 0 8h10" />
        <circle cx="3" cy="6" r="1.5" />
        <circle cx="17" cy="22" r="1.5" />
      </svg>
    ),
  },
  {
    name: "Карта",
    href: "/map",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t"
      style={{
        backgroundColor: "rgba(15, 15, 15, 0.85)",
        borderColor: "var(--color-border)",
      }}
      aria-label="Основная навигация"
    >
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200"
              style={{
                color: active ? "var(--color-accent)" : "var(--color-text-dim)",
              }}
            >
              <div
                className="transition-transform duration-300"
                style={{
                  transform: active ? "translateY(-2px) scale(1.1)" : "translateY(0) scale(1)",
                }}
              >
                {item.icon}
              </div>
              <span
                className="text-[10px] mt-1 font-medium tracking-wide uppercase"
                style={{ letterSpacing: "0.05em" }}
              >
                {item.name}
              </span>
              {/* Бронзовая линия-индикатор активного таба */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-b-full transition-all duration-300"
                style={{
                  width: active ? "40%" : "0%",
                  backgroundColor: "var(--color-accent)",
                  boxShadow: active ? "0 0 12px var(--color-accent)" : "none",
                }}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
