// src/app/components/AudioGuidePlayer.tsx
// Аудиоплеер для воспроизведения голосового гида на странице достопримечательности.
//
// Особенности:
// - Два голоса: мужской и женский. Выбор сохраняется в localStorage,
//   поэтому пользовательская настройка сохраняется между сессиями.
// - При переключении голоса позиция воспроизведения сохраняется.
// - Прогресс-бар кликабелен — можно перематывать.
// - Если аудио-файл недоступен (ещё не сгенерирован), плеер не рендерится.
// - Отображает длительность и текущую позицию в формате М:СС.

"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface AudioGuidePlayerProps {
  /** Путь к мужской версии аудио (например, "/audio/male/museum.mp3") */
  maleSrc?: string;
  /** Путь к женской версии аудио */
  femaleSrc?: string;
  /** Известная длительность в секундах — отображается до загрузки аудио */
  knownDurationSeconds?: number;
}

type Voice = "male" | "female";
const VOICE_STORAGE_KEY = "lubim-audio-voice";

export default function AudioGuidePlayer({
  maleSrc,
  femaleSrc,
  knownDurationSeconds,
}: AudioGuidePlayerProps) {
  // Если нет ни одного варианта аудио — плеер не показываем вовсе
  if (!maleSrc && !femaleSrc) return null;

  return <Player
    maleSrc={maleSrc}
    femaleSrc={femaleSrc}
    knownDurationSeconds={knownDurationSeconds}
  />;
}

/**
 * Внутренняя реализация — вынесена отдельно, чтобы early-return выше
 * не мешал хукам React (нельзя вызывать хуки после условного return).
 */
function Player({ maleSrc, femaleSrc, knownDurationSeconds }: AudioGuidePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [voice, setVoice] = useState<Voice>("male");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(knownDurationSeconds || 0);
  const [isLoading, setIsLoading] = useState(false);

  // Восстанавливаем выбор голоса из localStorage при монтировании
  useEffect(() => {
    try {
      const saved = localStorage.getItem(VOICE_STORAGE_KEY) as Voice | null;
      if (saved === "male" || saved === "female") {
        if (saved === "male" && maleSrc) setVoice("male");
        else if (saved === "female" && femaleSrc) setVoice("female");
        else if (femaleSrc) setVoice("female");
        else setVoice("male");
      } else {
        setVoice(maleSrc ? "male" : "female");
      }
    } catch {
      // localStorage может быть недоступен (privacy mode) — просто игнорируем
    }
  }, [maleSrc, femaleSrc]);

  const currentSrc = voice === "male" ? maleSrc : femaleSrc;
  const fallbackSrc = voice === "male" ? femaleSrc : maleSrc;
  const activeSrc = currentSrc || fallbackSrc;

  /**
   * Переключает голос, сохраняя текущую позицию воспроизведения.
   */
  const handleVoiceChange = useCallback(
    (newVoice: Voice) => {
      if (newVoice === voice) return;
      const audio = audioRef.current;
      const savedTime = audio?.currentTime || 0;
      const wasPlaying = !audio?.paused;

      setVoice(newVoice);
      try {
        localStorage.setItem(VOICE_STORAGE_KEY, newVoice);
      } catch {
        /* ignore */
      }

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = savedTime;
          if (wasPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
          }
        }
      }, 50);
    },
    [voice]
  );

  /** Переключает воспроизведение (play/pause). */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setIsLoading(true);
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsLoading(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  /** Обработчик клика по прогресс-бару — перемотка. */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
  };

  // Слушаем события аудио-элемента
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, [activeSrc]);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const displayTime = isPlaying || currentTime > 0 ? currentTime : duration;

  if (!activeSrc) return null;

  const bothVoicesAvailable = Boolean(maleSrc && femaleSrc);

  return (
    <section
      className="mx-6 mt-6 p-4 rounded-2xl border"
      style={{
        backgroundColor: "rgba(201, 169, 110, 0.06)",
        borderColor: "rgba(201, 169, 110, 0.25)",
      }}
    >
      {/* Скрытый audio-элемент */}
      <audio
        ref={audioRef}
        src={activeSrc}
        preload="metadata"
      />

      {/* Верхняя строка: кнопка play + название + время */}
      <div className="flex items-center gap-3 mb-3.5">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Пауза" : "Слушать аудиогид"}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95 shrink-0"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-bg)",
            boxShadow: "0 4px 16px rgba(201, 169, 110, 0.3)",
          }}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div
            className="text-[11px] uppercase font-medium tracking-widest mb-0.5"
            style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
          >
            Аудиогид
          </div>
          <div className="text-sm" style={{ color: "var(--color-text)" }}>
            {isPlaying ? "Играет рассказ о месте" : "Слушать рассказ о месте"}
          </div>
        </div>

        <div
          className="text-xs tabular-nums shrink-0"
          style={{ color: "var(--color-text-muted)", fontVariantNumeric: "tabular-nums" }}
        >
          {formatTime(displayTime)}
        </div>
      </div>

      {/* Прогресс-бар */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPercent)}
        onClick={handleSeek}
        className="h-1 rounded-full relative cursor-pointer mb-3.5"
        style={{ backgroundColor: "rgba(201, 169, 110, 0.15)" }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
          style={{
            width: `${progressPercent}%`,
            background: "linear-gradient(to right, var(--color-accent), var(--color-accent-bright))",
          }}
        />
        {progressPercent > 0 && (
          <div
            className="absolute top-1/2 w-2.5 h-2.5 rounded-full -translate-y-1/2 -translate-x-1/2"
            style={{
              left: `${progressPercent}%`,
              backgroundColor: "var(--color-accent-bright)",
              boxShadow: "0 0 8px rgba(228, 196, 138, 0.6)",
            }}
          />
        )}
      </div>

      {/* Переключатель голосов — только если оба варианта доступны */}
      {bothVoicesAvailable && (
        <div className="flex items-center justify-between">
          <div
            className="text-[10px] uppercase"
            style={{
              color: "var(--color-text-muted)",
              letterSpacing: "0.1em",
            }}
          >
            Голос
          </div>
          <div
            className="flex rounded-full p-0.5 border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <VoiceButton
              label="Мужской"
              isActive={voice === "male"}
              onClick={() => handleVoiceChange("male")}
            />
            <VoiceButton
              label="Женский"
              isActive={voice === "female"}
              onClick={() => handleVoiceChange("female")}
            />
          </div>
        </div>
      )}
    </section>
  );
}

// ==================== Вспомогательные компоненты ====================

function VoiceButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-1 rounded-full text-xs font-medium transition-colors"
      style={{
        backgroundColor: isActive ? "var(--color-accent)" : "transparent",
        color: isActive ? "var(--color-bg)" : "var(--color-text-dim)",
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ marginLeft: "2px" }}
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <div
      className="w-4 h-4 border-2 rounded-full animate-spin"
      style={{
        borderColor: "currentColor",
        borderTopColor: "transparent",
      }}
      aria-hidden="true"
    />
  );
}

/** Форматирует секунды в формат М:СС (например, 84 → "1:24"). */
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
