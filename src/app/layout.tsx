// src/app/layout.tsx
// Корневой шаблон приложения. Подключает метаданные PWA,
// нижнюю навигацию и контейнер для всех страниц.
//
// Шрифты: используем системные стеки (без Google Fonts) — это даёт:
//  - мгновенную загрузку (никаких FOIT/FOUT)
//  - работу полностью offline
//  - соответствие платформе (SF на iOS, Roboto на Android, Segoe на Windows)

import type { Metadata, Viewport } from "next";
import BottomNav from "./components/BottomNav";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Гид по Любиму — туристический путеводитель",
  description:
    "Мобильное приложение-путеводитель по городу Любим Ярославской области. " +
    "Достопримечательности, готовые маршруты, интерактивная карта.",
  applicationName: "Гид по Любиму",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Гид по Любиму",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f0f0f",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <main className="page-container max-w-2xl mx-auto">{children}</main>
        <BottomNav />
        <PWAInstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
