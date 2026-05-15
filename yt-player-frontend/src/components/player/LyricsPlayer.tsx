"use client";

import { useEffect, useRef } from "react";

type LyricsLine = {
  text: string;
  time: number;
};

type Props = {
  show: boolean;
  lyrics: LyricsLine[];
  activeLine: number;
  title: string;
  author: string;
};

export function LyricsPlayer({
  show,
  lyrics,
  activeLine,
  title,
  author,
}: Props) {
  const activeLineRef =
    useRef<HTMLParagraphElement | null>(
      null
    );

  /* AUTO SCROLL */
  useEffect(() => {
    if (!activeLineRef.current) return;

    activeLineRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeLine]);

  if (!show) return null;

  return (
    <div
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
            {title}
          </h2>

          <p
            className="
              text-zinc-400
              mt-2
            "
          >
            {author}
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
  );
}