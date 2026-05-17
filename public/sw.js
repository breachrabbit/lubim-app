// public/sw.js
// Service Worker для приложения "Гид по Любиму".
//
// Стратегии кэширования:
//  - App Shell (HTML/CSS/JS/иконки): Cache First — загружаем из кэша,
//    в сеть идём только при отсутствии. Ускоряет старт и обеспечивает offline.
//  - Тайлы карты OpenStreetMap: Stale While Revalidate — показываем из кэша,
//    в фоне обновляем. Пользователь видит карту мгновенно, даже без интернета.
//  - Аудиогиды (/audio/*.mp3): Cache First, отдельный кэш — файлы большие
//    (до 700 КБ), хранятся отдельно, чтобы не пересекаться с app-кэшем.
//  - Остальное: просто сеть, без кэша.
//
// Версия кэша меняется при каждом релизе, чтобы старые версии автоматически
// вычищались. Менять CACHE_VERSION вручную при обновлении приложения.

const CACHE_VERSION = 'v2';
const APP_CACHE = `lubim-app-${CACHE_VERSION}`;
const TILES_CACHE = `lubim-tiles-${CACHE_VERSION}`;
const AUDIO_CACHE = `lubim-audio-${CACHE_VERSION}`;

// Ресурсы, которые кэшируем сразу при установке SW.
// Это minimum, чтобы главная страница открывалась offline.
const APP_SHELL = [
  '/',
  '/places',
  '/routes',
  '/map',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// === Установка: кладём App Shell в кэш ===
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[SW] Ошибка при кэшировании App Shell:', err);
      });
    })
  );
  // Сразу активируем новый SW, не дожидаясь закрытия старых вкладок
  self.skipWaiting();
});

// === Активация: чистим кэши старых версий ===
self.addEventListener('activate', (event) => {
  const allowedCaches = [APP_CACHE, TILES_CACHE, AUDIO_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !allowedCaches.includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  // Берём контроль над открытыми вкладками сразу
  self.clients.claim();
});

// === Обработка запросов ===
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Игнорируем не-GET запросы (POST/PUT и т.п. не кэшируем)
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Тайлы OpenStreetMap — стратегия SWR
  if (url.hostname.endsWith('tile.openstreetmap.org')) {
    event.respondWith(staleWhileRevalidate(request, TILES_CACHE));
    return;
  }

  // Аудиогиды — отдельный кэш, стратегия Cache First.
  // Файлы по ~400-700 КБ; не храним их в общем app-кэше,
  // чтобы при очистке не теряли всё приложение.
  if (url.origin === location.origin && url.pathname.startsWith('/audio/')) {
    event.respondWith(cacheFirst(request, AUDIO_CACHE));
    return;
  }

  // Всё своё (same-origin) — стратегия cache-first для статики
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request, APP_CACHE));
    return;
  }

  // Для остального — просто сеть, без кэша
});

/**
 * Cache First: сначала проверяем кэш, если нет — идём в сеть.
 * Полученный из сети ответ кладём в кэш для следующего раза.
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // Кэшируем только успешные ответы
    if (response && response.ok && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Если сеть недоступна и в кэше нет — отдаём offline-заглушку на навигации
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/');
      if (fallback) return fallback;
    }
    throw err;
  }
}

/**
 * Stale While Revalidate: мгновенно отдаём из кэша (если есть),
 * параллельно запрашиваем свежую версию и обновляем кэш.
 * Идеально для тайлов карты — быстро и всегда актуально при наличии сети.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached); // Если сеть умерла — вернём то что было в кэше

  return cached || fetchPromise;
}
