// src/app/components/CityMap.tsx
// Интерактивная карта города на Leaflet + OpenStreetMap.
// Метки стилизованы под бронзовые маркеры, тайлы затемнены через CSS-фильтр
// (см. globals.css), что даёт эффект "ночной карты" без платных тайл-серверов.

"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { places, CATEGORY_LABELS, type PlaceCategory } from "../data/places";
import { cityInfo } from "../data/city";

/**
 * SVG-иконки для меток карты. Минималистичные пиктограммы в круге.
 * Генерируются как inline-HTML, потому что DivIcon Leaflet-а ожидает строку.
 */
const CATEGORY_SVG_PATHS: Record<PlaceCategory, string> = {
  church: `<path d="M12 2v4M10 4h4M9 10l3-3 3 3v10H9z M11 14h2"/>`,
  museum: `<path d="M3 9l9-5 9 5M5 9v10M19 9v10M9 19v-5h6v5M3 19h18"/>`,
  park: `<circle cx="8" cy="10" r="4"/><path d="M8 14v6M16 6l-3 6h6z M16 12v8M4 20h16"/>`,
  monument: `<ellipse cx="12" cy="5" rx="6" ry="2"/><path d="M6 5v14M12 5v14M18 5v14M5 19h14"/>`,
  nature: `<path d="M8 3l-4 8h8z M8 8l-3 6h6z M8 14v6M16 5l-3 7h6z M16 12v8M4 20h16"/>`,
};

function createIcon(category: PlaceCategory): L.DivIcon {
  const svgPath = CATEGORY_SVG_PATHS[category];
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 44px;
      ">
        <svg viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
          <path d="M18 0 C8 0 0 8 0 18 C0 32 18 44 18 44 C18 44 36 32 36 18 C36 8 28 0 18 0 Z" fill="#c9a96e"/>
          <circle cx="18" cy="18" r="12" fill="#0f0f0f"/>
          <g transform="translate(6, 6) scale(1)" stroke="#c9a96e" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
            ${svgPath}
          </g>
        </svg>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -42],
  });
}

export default function CityMap() {
  const center: [number, number] = [
    cityInfo.coordinatesCenter.latitude,
    cityInfo.coordinatesCenter.longitude,
  ];

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude, place.longitude]}
          icon={createIcon(place.category)}
        >
          <Popup>
            <div style={{ minWidth: "220px", fontFamily: "var(--font-sans)" }}>
              <div
                style={{
                  fontSize: "10px",
                  color: "#c9a96e",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: 500,
                }}
              >
                {CATEGORY_LABELS[place.category]}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "1.3",
                  marginBottom: "8px",
                  color: "#f5e6c8",
                }}
              >
                {place.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#a89878",
                  lineHeight: "1.5",
                  marginBottom: "12px",
                }}
              >
                {place.shortDescription}
              </div>
              <a
                href={`/places/${place.slug}`}
                style={{
                  display: "inline-block",
                  color: "#c9a96e",
                  fontSize: "12px",
                  fontWeight: 500,
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #c9a96e",
                  paddingBottom: "2px",
                }}
              >
                Подробнее →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
