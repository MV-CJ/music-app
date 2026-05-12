"use client";

import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  Repeat,
  Repeat1,
  Mic2,
  FileText,
} from "lucide-react";

function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return "0:00";

  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);

  return `${m}:${s
    .toString()
    .padStart(2, "0")}`;
}

export function PlayerBar({
  current,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolume,
  currentTime,
  duration,
  volume,
  onToggleMode,
  videoMode,
  onToggleQueue,
  repeatMode,
  onToggleRepeat,

  /* LYRICS */
  showLyrics,
  onToggleLyrics,
}: any) {
  if (!current) return null;

  const VolumeIcon =
    volume === 0
      ? VolumeX
      : volume < 0.5
      ? Volume1
      : Volume2;

  const isRepeatActive =
    repeatMode !== "off";

  const cover =
    current.artist_image ||
    current.thumbnail ||
    current.image ||
    "https://placehold.co/100x100/18181b/71717a?text=Music";

  return (
    <div className="w-full border-t border-white/10 bg-black/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">

        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-[240px] max-w-[240px]">

          <div className="relative">

            {/* GLOW */}
            <div
              className="
                absolute
                inset-0
                rounded-xl
                bg-purple-500/20
                blur-xl
                scale-110
              "
            />

            <img
              src={cover}
              alt={current.title || "Music"}

              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/100x100/18181b/71717a?text=Music";
              }}

              className="
                relative
                w-14
                h-14
                rounded-xl
                object-cover
                border
                border-white/10
                shadow-2xl
              "
            />

          </div>

          <div className="min-w-0 flex-1">

            <p
              className="
                text-sm
                font-semibold
                text-white
                truncate
              "
            >
              {current.title}
            </p>

            <div
              className="
                flex
                items-center
                gap-1
                text-xs
                text-zinc-400
                mt-1
              "
            >

              <Mic2 size={11} />

              <span className="truncate">
                {current.author ||
                  "MusicFlow Engine"}
              </span>

            </div>

          </div>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center flex-1 gap-2">

          {/* CONTROLS */}
          <div className="flex items-center gap-2">

            {/* PREV */}
            <button
              onClick={onPrev}
              className="
                p-2
                rounded-full
                text-zinc-300
                hover:text-white
                hover:bg-white/10
                transition
              "
            >
              <SkipBack size={18} />
            </button>

            {/* PLAY */}
            <button
              onClick={onPlayPause}
              className="
                w-11
                h-11
                rounded-full
                bg-gradient-to-br
                from-purple-500
                to-fuchsia-500
                text-white
                flex
                items-center
                justify-center
                shadow-xl
                shadow-purple-500/30
                hover:scale-105
                transition
              "
            >
              {isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play
                  size={18}
                  className="ml-0.5"
                  fill="white"
                />
              )}
            </button>

            {/* NEXT */}
            <button
              onClick={onNext}
              className="
                p-2
                rounded-full
                text-zinc-300
                hover:text-white
                hover:bg-white/10
                transition
              "
            >
              <SkipForward size={18} />
            </button>

            {/* MODE */}
            <button
              onClick={onToggleMode}
              className="
                px-3
                py-1.5
                rounded-full
                text-xs
                border
                border-white/10
                bg-white/5
                text-zinc-300
                hover:bg-white
                hover:text-black
                transition
              "
            >
              {videoMode
                ? "🎧 Audio"
                : "🎬 Video"}
            </button>

            {/* QUEUE */}
            <button
              onClick={onToggleQueue}
              className="
                p-2
                rounded-full
                text-zinc-300
                hover:text-white
                hover:bg-white/10
                transition
              "
            >
              <ListMusic size={18} />
            </button>

            {/* REPEAT */}
            <button
              onClick={onToggleRepeat}
              className={`
                p-2
                rounded-full
                transition
                hover:bg-white/10
                ${
                  isRepeatActive
                    ? "text-purple-400"
                    : "text-zinc-300"
                }
              `}
            >
              {repeatMode === "one" ? (
                <Repeat1 size={18} />
              ) : (
                <Repeat size={18} />
              )}
            </button>

            {/* LYRICS */}
            <button
              onClick={onToggleLyrics}
              className={`
                p-2
                rounded-full
                transition
                hover:bg-white/10
                ${
                  showLyrics
                    ? "text-purple-400"
                    : "text-zinc-300"
                }
              `}
            >
              <FileText size={18} />
            </button>

          </div>

          {/* SEEK */}
          <div className="flex items-center gap-3 w-full max-w-2xl">

            <span className="text-[11px] text-zinc-500 w-10 text-right">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={onSeek}
              className="
                w-full
                h-1
                rounded-full
                accent-purple-500
                cursor-pointer
              "
            />

            <span className="text-[11px] text-zinc-500 w-10">
              {formatTime(duration)}
            </span>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 min-w-[140px] justify-end">

          <VolumeIcon
            size={18}
            className="text-zinc-400"
          />

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolume}
            className="
              w-24
              h-1
              rounded-full
              accent-purple-500
              cursor-pointer
            "
          />

        </div>
      </div>
    </div>
  );
}