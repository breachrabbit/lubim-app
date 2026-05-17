/// <reference types="@capacitor/cli" />

import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Конфигурация Capacitor для сборки Android-приложения "Гид по Любиму".
 *
 * appId — уникальный идентификатор пакета, по формату Java-пакетов.
 * По соглашению используется обратный порядок домена: ru.lubim.guide.
 *
 * webDir — папка со статическими файлами, которые будут упакованы в APK.
 * Совпадает с выводом Next.js export (`out/`).
 */
const config: CapacitorConfig = {
  appId: "ru.lubim.guide",
  appName: "Гид по Любиму",
  webDir: "out",

  // Настройки Android-окружения
  android: {
    // Статус-бар в тон темы приложения
    backgroundColor: "#0f0f0f",
    // Без этой настройки WebView фонит белым при загрузке
    allowMixedContent: false,
    // В Capacitor 7+ это значение по умолчанию, но явно указываем
    webContentsDebuggingEnabled: false,
  },

  // Конфигурация плагинов
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#0f0f0f",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      backgroundColor: "#0f0f0f",
      style: "DARK",
      overlaysWebView: false,
    },
  },
};

export default config;
