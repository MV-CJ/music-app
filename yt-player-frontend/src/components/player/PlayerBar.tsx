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
} from "lucide-react";

function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
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
}: any) {
  if (!current) return null;

  const VolumeIcon =
    volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const isRepeatActive = repeatMode !== "off";

  return (
    <div className="w-full border-t border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6">

        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-[220px]">
          <img
            src={current.thumbnail}
            className="w-12 h-12 rounded-lg object-cover shadow-md"
          />

          <div className="flex flex-col">
            <p className="text-sm text-white truncate max-w-[180px] font-medium">
              {current.title}
            </p>
            <p className="text-xs text-zinc-400">MusicFlow Engine</p>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center flex-1 gap-2">

          {/* CONTROLS */}
          <div className="flex items-center gap-3">

            <button
              onClick={onPrev}
              className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={onPlayPause}
              className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:scale-105 transition"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              onClick={onNext}
              className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition"
            >
              <SkipForward size={18} />
            </button>

            {/* MODE */}
            <button
              onClick={onToggleMode}
              className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 hover:bg-white hover:text-black transition"
            >
              {videoMode ? "🎧 Audio" : "🎬 Video"}
            </button>

            {/* QUEUE */}
            <button
              onClick={onToggleQueue}
              className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition relative"
            >
              <ListMusic size={18} />
            </button>

            {/* REPEAT */}
            <button
              onClick={onToggleRepeat}
              className={`p-2 rounded-full transition relative hover:bg-white/10 ${
                isRepeatActive ? "text-purple-400" : "text-zinc-300"
              }`}
            >
              {repeatMode === "one" ? (
                <Repeat1 size={18} />
              ) : (
                <Repeat size={18} />
              )}

              {isRepeatActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              )}
            </button>

          </div>

          {/* SEEK BAR */}
          <div className="flex items-center gap-2 w-full max-w-md">

            <span className="text-xs text-zinc-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={onSeek}
              className="w-full accent-purple-500 cursor-pointer"
            />

            <span className="text-xs text-zinc-400 w-10">
              {formatTime(duration)}
            </span>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <VolumeIcon className="text-zinc-300" />

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolume}
            className="w-24 accent-purple-500 cursor-pointer"
          />

        </div>
      </div>
    </div>
  );
}