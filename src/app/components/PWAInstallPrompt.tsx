// src/app/components/PWAInstallPrompt.tsx
// Компонент, отображающий предложение установить приложение как PWA.
//
// Логика работы:
// 1. Браузер (Chrome/Edge/Samsung Internet) самостоятельно определяет,
//    соответствует ли сайт критериям PWA, и диспатчит событие
//    `beforeinstallprompt`. Мы его перехватываем и показываем свою UI-кнопку.
// 2. iOS Safari не поддерживает `beforeinstallprompt`, но позволяет
//    добавить сайт на домашний экран вручную. Для iOS-пользователей
//    показываем отдельную подсказку с инструкцией.
// 3. Если пользователь уже установил приложение, промпт не появляется.

"use client";

import { useEffect, useState } from "react";

/**
 * Типы события beforeinstallprompt отсутствуют в стандартных типах TS,
 * поэтому описываем его вручную.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DISMISS_STORAGE_KEY = "pwa-install-dismissed-at";
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней

export default function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Определяем iOS (требует отдельной обработки, так как Safari
    // не поддерживает beforeinstallprompt)
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as { MSStream?: unknown }).MSStream;

    // Проверяем, запущено ли уже в режиме "установленного" приложения
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      // Уже установлено — промпт не нужен
      return;
    }

    // Проверяем, не отклонял ли пользователь промпт недавно
    const dismissedAt = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (dismissedAt && Date.now() - parseInt(dismissedAt, 10) < DISMISS_COOLDOWN_MS) {
      return;
    }

    if (isIOSDevice) {
      setIsIOS(true);
      // iOS — показываем подсказку сразу с небольшой задержкой
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // Для остальных браузеров ждём событие от системы
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /**
   * Запускает нативный промпт установки (только для не-iOS).
   */
  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setInstallEvent(null);
  };

  /**
   * Закрывает промпт и запоминает время, чтобы не показывать снова 7 дней.
   */
  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
  };

  if (!visible) return null;

  return (
    <div
      className="fixed left-4 right-4 bottom-20 max-w-2xl mx-auto z-50 rounded-2xl p-4 backdrop-blur-xl border"
      style={{
        backgroundColor: "rgba(36, 36, 36, 0.95)",
        borderColor: "var(--color-accent-dim)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(201, 169, 110, 0.2)",
        animation: "stagger-fade-in 0.4s var(--ease-smooth)",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Иконка-аватар приложения */}
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-bg)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M12 22s-8-8-8-13a8 8 0 0 1 16 0c0 5-8 13-8 13z" />
            <circle cx="12" cy="9" r="3" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base font-medium leading-tight">
            Установить приложение
          </h3>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--color-text-dim)" }}>
            {isIOS
              ? "Нажмите «Поделиться» ↑, затем «На экран «Домой»»"
              : "Добавьте «Гид по Любиму» на главный экран для быстрого доступа."}
          </p>

          <div className="flex gap-2 mt-3">
            {!isIOS && installEvent && (
              <button
                onClick={handleInstall}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-transform active:scale-95"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-bg)",
                }}
              >
                Установить
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: "var(--color-text-dim)",
              }}
            >
              Позже
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
