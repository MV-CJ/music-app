"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";
import { FloatingVideo } from "./FloatingVideo";
import { PlayerBar } from "./PlayerBar";
import { QueuePanel } from "./QueuePanel";

import { usePlayerStore } from "@/store/usePlayerStore";

export function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    current,
    queue,
    currentIndex,
    volume,
    setVolume,
    playNext,
    playPrev,
    repeatMode,
    setRepeatMode,
  } = usePlayerStore();

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoMode, setVideoMode] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const lastTrackRef = useRef<string | null>(null);

  const getActiveMedia = () =>
    videoMode ? videoRef.current : audioRef.current;

  const getInactiveMedia = () =>
    videoMode ? audioRef.current : videoRef.current;

  /* RESET TRACK */
  useEffect(() => {
    const id = current?.video_id || current?.id;

    if (lastTrackRef.current !== id) {
      lastTrackRef.current = id;

      setVideoMode(false);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
    }
  }, [current]);

  /* PLAYER CONTROL */
  useEffect(() => {
    const active = getActiveMedia();
    const inactive = getInactiveMedia();

    if (!active) return;

    if (inactive) inactive.pause();

    active.volume = volume;

    if (isPlaying) {
      active.play().catch(() => setIsPlaying(false));
    } else {
      active.pause();
    }
  }, [isPlaying, videoMode, current, volume]);

  /* RESTORE TIME ON MODE SWITCH */
  useEffect(() => {
    const active = getActiveMedia();
    if (!active) return;

    active.currentTime = currentTime;

    if (isPlaying) {
      active.play().catch(() => setIsPlaying(false));
    }
  }, [videoMode]);

  const togglePlay = () => {
    const media = getActiveMedia();
    if (!media) return;

    if (media.paused) {
      media.play();
      setIsPlaying(true);
    } else {
      media.pause();
      setIsPlaying(false);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);

    if (audioRef.current) audioRef.current.currentTime = time;
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
  };

  const handleEnd = () => {
    playNext();
  };

  if (!current) return null;

  return (
    <>
      {/* VIDEO MODE */}
      {videoMode && (
        <FloatingVideo
          key={current.stream}
          src={current.stream}
          videoRef={videoRef}
          onClose={() => setVideoMode(false)}
          onTimeUpdate={setCurrentTime}
          onLoadedMetadata={setDuration}
          onEnd={handleEnd}
        />
      )}

      <div className={cn("w-full", theme.colors.border)}>
        {/* PLAYER BAR */}
        <PlayerBar
          current={current}
          isPlaying={isPlaying}
          onPlayPause={togglePlay}
          onNext={playNext}
          onPrev={playPrev}
          onSeek={seek}
          onVolume={changeVolume}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          videoMode={videoMode}
          onToggleMode={() => setVideoMode(v => !v)}
          onToggleQueue={() => setShowQueue(v => !v)}
          repeatMode={repeatMode}
          onToggleRepeat={() =>
            setRepeatMode(
              repeatMode === "off"
                ? "one"
                : repeatMode === "one"
                ? "all"
                : "off"
            )
          }
        />

        {/* QUEUE */}
        <QueuePanel
          open={showQueue}
          onClose={() => setShowQueue(false)}
        />

        {/* AUDIO */}
        <audio
          ref={audioRef}
          src={current.stream}
          onTimeUpdate={(e) =>
            setCurrentTime(e.currentTarget.currentTime)
          }
          onLoadedMetadata={(e) =>
            setDuration(e.currentTarget.duration)
          }
          onEnded={handleEnd}
          className="hidden"
        />
      </div>
    </>
  );
}