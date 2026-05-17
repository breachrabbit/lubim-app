<div align="center">

# Гид по Любиму

Туристическое мобильное приложение о самом маленьком городе Ярославской области.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-c9a96e.svg)](LICENSE)

</div>

---

## О проекте

Любим — самый маленький город Ярославской области. Пять тысяч жителей, пятьсот лет истории, одиннадцать сохранившихся храмов, музеев и парков. Этот проект — современное мобильное приложение-путеводитель: интерактивная карта, готовые маршруты, аудиогиды на каждое место с выбором голоса.

Разработано в рамках выпускной квалификационной работы в ГПОАУ ЯО «Любимский аграрно-политехнический колледж».

## Возможности

- 📍 **11 достопримечательностей** — храмы XVIII–XIX веков, музей, парки, природные объекты
- 🗺️ **Интерактивная карта** на Leaflet + OpenStreetMap с кастомными метками
- 🧭 **4 готовых маршрута** разной длительности
- 🎧 **Аудиогиды** с выбором мужского/женского голоса (Yandex SpeechKit)
- 📱 **PWA** — устанавливается на экран «Домой», работает офлайн
- 🤖 **Android APK** — собирается через Capacitor 7 + GitHub Actions
- ✨ **View Transitions** — плавные переходы между страницами
- 🎨 **Тёмная премиальная тема** — графит, бронза, слоновая кость

## Технологический стек

| Слой | Технология |
|:-----|:-----------|
| Язык | TypeScript 5.7 |
| Фреймворк | Next.js 16.2 (App Router) |
| UI | React 19.2 |
| Стилизация | Tailwind CSS 4.1 |
| Карта | Leaflet 1.9 + react-leaflet 5 |
| Аудио | Yandex SpeechKit (TTS) |
| Сборка Android | Capacitor 7 |
| CI/CD | GitHub Actions |
| Картография | OpenStreetMap |

## Запуск

```bash
git clone https://github.com/breachrabbit/lubim-app.git
cd lubim-app
npm install
npm run dev
```

Приложение откроется на http://localhost:3000.

### Production-сборка

```bash
npm run build
npm start
```

## Сборка Android APK

Сборка автоматизирована через GitHub Actions — ничего не нужно ставить локально:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Через ~5 минут на странице Releases появится готовый APK.

## Структура проекта

```
├── src/app/
│   ├── page.tsx            Главная (о городе)
│   ├── places/             Каталог достопримечательностей + детали
│   ├── routes/             Туристические маршруты
│   ├── map/                Интерактивная карта
│   ├── components/         Переиспользуемые компоненты
│   └── data/               Данные (места, маршруты, сценарии аудио)
├── public/
│   ├── manifest.json       PWA-манифест
│   ├── sw.js               Service Worker
│   ├── icons/              Иконки приложения
│   └── audio/              Аудиогиды (male/ + female/)
├── capacitor.config.ts     Конфигурация Android
└── .github/workflows/      CI/CD пайплайны
```

## Источники

Информация о городе собрана из открытых источников: Большая российская энциклопедия, Википедия, портал органов власти Ярославской области, Любимский историко-краеведческий музей. Аудиогиды сгенерированы через Yandex SpeechKit.

## Лицензия

[MIT](LICENSE)
