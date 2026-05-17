/** @type {import('next').NextConfig} */

// Проверяем переменную окружения: строим ли мы для Capacitor (Android/iOS)
// или для обычного веба/PWA.
//
// Для веба: обычная сборка, всё работает как прежде (страница SSR/SSG).
// Для Capacitor: нужен static export — все страницы в статический HTML,
// который упаковывается в APK вместе с нативным WebView.
const isCapacitorBuild = process.env.BUILD_TARGET === "capacitor";

const nextConfig = {
  reactStrictMode: true,

  // static export активируется только для Android-сборки
  ...(isCapacitorBuild && {
    output: "export",
    // В static export изображения не могут обрабатываться next/image Loader'ом
    images: { unoptimized: true },
    // Добавляем завершающий слэш к URL, чтобы пути правильно резолвились
    // в WebView Android (иначе /places не найдёт /places/index.html)
    trailingSlash: true,
  }),
};

module.exports = nextConfig;
