"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";

import { FloatingVideo } from "./FloatingVideo";
import { PlayerBar } from "./PlayerBar";
import { QueuePanel } from "./QueuePanel";

import { usePlayerStore } from "@/store/usePlayerStore";
import { getLyrics } from "@/lib/lyrics";

export function Player() {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const lyricsContainerRef =
    useRef<HTMLDivElement | null>(null);

  const activeLineRef =
    useRef<HTMLParagraphElement | null>(null);

  const {
    current,
    volume,
    setVolume,
    playNext,
    playPrev,
    repeatMode,
    setRepeatMode,
  } = usePlayerStore();

  const [isPlaying, setIsPlaying] =
    useState(true);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [videoMode, setVideoMode] =
    useState(false);

  const [showQueue, setShowQueue] =
    useState(false);

  /* LYRICS */
  const [lyrics, setLyrics] = useState<any[]>(
    []
  );

  const [showLyrics, setShowLyrics] =
    useState(false);

  const [activeLine, setActiveLine] =
    useState(0);

  const lastTrackRef =
    useRef<string | null>(null);

  const LYRICS_OFFSET = 3.2;

  const getActiveMedia = () =>
    videoMode
      ? videoRef.current
      : audioRef.current;

  const getInactiveMedia = () =>
    videoMode
      ? audioRef.current
      : videoRef.current;

  /* RESET TRACK */
  useEffect(() => {
    const id =
      current?.video_id || current?.id;

    if (lastTrackRef.current !== id) {
      lastTrackRef.current = id;

      setVideoMode(false);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);

      setLyrics([]);
      setActiveLine(0);

      async function loadLyrics() {
        if (!current) return;

        const result = await getLyrics(
          current.author,
          current.title
        );

        setLyrics(result || []);
      }

      loadLyrics();
    }
  }, [current]);

  /* SYNC ACTIVE LYRIC */
  useEffect(() => {
    if (!lyrics.length) return;

    const index = lyrics.findIndex(
      (line, i) =>
        currentTime >=
          line.time + LYRICS_OFFSET &&
        (!lyrics[i + 1] ||
          currentTime <
            lyrics[i + 1].time +
              LYRICS_OFFSET)
    );

    if (index !== -1) {
      setActiveLine(index);
    }
  }, [currentTime, lyrics]);

  /* AUTO SCROLL */
  useEffect(() => {
    if (!activeLineRef.current) return;

    activeLineRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeLine]);

  /* PLAYER CONTROL */
  useEffect(() => {
    const active = getActiveMedia();

    const inactive =
      getInactiveMedia();

    if (!active) return;

    if (inactive) inactive.pause();

    active.volume = volume;

    if (isPlaying) {
      active
        .play()
        .catch(() =>
          setIsPlaying(false)
        );
    } else {
      active.pause();
    }
  }, [
    isPlaying,
    videoMode,
    current,
    volume,
  ]);

  /* RESTORE TIME ON MODE SWITCH */
  useEffect(() => {
    const active = getActiveMedia();

    if (!active) return;

    active.currentTime = currentTime;

    if (isPlaying) {
      active
        .play()
        .catch(() =>
          setIsPlaying(false)
        );
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

  const seek = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const time = Number(e.target.value);

    setCurrentTime(time);

    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const changeVolume = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
          onClose={() =>
            setVideoMode(false)
          }
          onTimeUpdate={setCurrentTime}
          onLoadedMetadata={
            setDuration
          }
          onEnd={handleEnd}
        />
      )}

      <div
        className={cn(
          "w-full",
          theme.colors.border
        )}
      >
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
          onToggleMode={() =>
            setVideoMode((v) => !v)
          }
          onToggleQueue={() =>
            setShowQueue((v) => !v)
          }
          repeatMode={repeatMode}
          onToggleRepeat={() =>
            setRepeatMode(
              repeatMode === "off"
                ? "one"
                : repeatMode ===
                  "one"
                ? "all"
                : "off"
            )
          }
          showLyrics={showLyrics}
          onToggleLyrics={() =>
            setShowLyrics((v) => !v)
          }
        />

        {/* QUEUE */}
        <QueuePanel
          open={showQueue}
          onClose={() =>
            setShowQueue(false)
          }
        />

        {/* LYRICS */}
        {showLyrics && (
          <div
            ref={lyricsContainerRef}
            className="
              h-[420px]
              overflow-y-auto
              px-6
              py-16
              bg-gradient-to-b
              from-black
              via-zinc-950
              to-black
              border-t
              border-white/10
            "
          >
            <div
              className="
                max-w-3xl
                mx-auto
                flex
                flex-col
                items-center
              "
            >
              {/* TITLE */}
              <div className="mb-12 text-center">
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-white
                  "
                >
                  {current.title}
                </h2>

                <p
                  className="
                    text-zinc-400
                    mt-2
                  "
                >
                  {current.author}
                </p>
              </div>

              {/* EMPTY */}
              {lyrics.length === 0 && (
                <div
                  className="
                    text-center
                    py-20
                  "
                >
                  <p
                    className="
                      text-zinc-500
                      text-lg
                    "
                  >
                    Lyrics not found
                  </p>
                </div>
              )}

              {/* LINES */}
              <div
                className="
                  w-full
                  flex
                  flex-col
                  gap-5
                "
              >
                {lyrics.map((line, i) => {
                  const active =
                    i === activeLine;

                  return (
                    <p
                      key={i}
                      ref={
                        active
                          ? activeLineRef
                          : null
                      }
                      className={`
                        text-center
                        transition-all
                        duration-300
                        leading-relaxed
                        px-4
                        ${
                          active
                            ? `
                              text-white
                              text-3xl
                              font-bold
                              scale-105
                              opacity-100
                            `
                            : `
                              text-zinc-500
                              text-xl
                              opacity-60
                            `
                        }
                      `}
                    >
                      {line.text}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* AUDIO */}
        <audio
          ref={audioRef}
          src={current.stream}
          onTimeUpdate={(e) =>
            setCurrentTime(
              e.currentTarget.currentTime
            )
          }
          onLoadedMetadata={(e) =>
            setDuration(
              e.currentTarget.duration
            )
          }
          onEnded={handleEnd}
          className="hidden"
        />
      </div>
    </>
  );
}