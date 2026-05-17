// src/app/components/ServiceWorkerRegister.tsx
// Клиентский компонент, регистрирующий Service Worker при монтировании.
// Запускается один раз и молча — любые ошибки просто логируются,
// чтобы не ломать UX если что-то пошло не так.

"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Регистрируем только если браузер поддерживает SW и мы в production-окружении
    // (в dev режиме SW часто мешает отладке — Next.js перестраивает бандлы,
    //  а SW кэширует старые и кажется что изменения не применяются)
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    // Регистрируем после загрузки страницы, чтобы не конкурировать
    // с основными ресурсами за пропускную способность
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => {
          console.warn("Не удалось зарегистрировать Service Worker:", err);
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
