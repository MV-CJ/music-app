"use client";

import { Card } from "@/components/ui/card";

import {
  Play,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { theme } from "@/lib/theme";

interface Props {
  item: any;
  rank?: number;

  loading?: boolean;

  onPlay: (
    item: any
  ) => void;

  onQueue?: (
    item: any
  ) => void;
}

export function MusicCard({
    item,
    rank,
    onPlay,
    onQueue,
}: Props) {

  
  return (
    <Card
      onClick={() => onPlay(item)}

      className={cn(
        "relative overflow-hidden cursor-pointer",
        theme.radius.xl,
        theme.colors.panel,
        theme.colors.border,
        theme.effects.glass,
        theme.effects.hover
      )}
    >

      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-t-3xl bg-zinc-900">

  {/* RANK */}
  {rank && rank <= 3 && (

    <div
      className={`
        absolute
        top-3
        left-3
        z-20
        px-3
        py-1
        rounded-full
        backdrop-blur-xl
        text-xs
        font-bold
        border
        shadow-lg

        ${
          rank === 1
            ? "bg-yellow-400/20 text-yellow-200 border-yellow-300/30 shadow-yellow-500/20"
            : rank === 2
            ? "bg-zinc-300/20 text-zinc-100 border-zinc-200/30 shadow-zinc-400/20"
            : "bg-amber-700/20 text-amber-200 border-amber-500/30 shadow-amber-700/20"
        }
      `}
    >

      {rank === 1 && "🥇 #1"}
      {rank === 2 && "🥈 #2"}
      {rank === 3 && "🥉 #3"}

    </div>

  )}

  <img
    src={
      item.thumbnail ||
      item.artist_image ||
      item.image ||
      "https://placehold.co/600x600/18181b/71717a?text=Music"
    }

    onError={(e) => {
      e.currentTarget.src =
        "https://placehold.co/600x600/18181b/71717a?text=Music";
    }}

    className="
      h-56
      w-full
      object-cover
      opacity-90
      block
    "
  />

</div>

      {/* CONTENT */}
      <div className="p-3">

        <p className="text-sm line-clamp-2 text-zinc-100">
          {item.title || item.name}
        </p>

        <p className="text-xs text-zinc-400 mt-1 truncate">
          {item.author || item.artist}
        </p>

        {/* ACTIONS */}
        <div className="mt-3 flex justify-between items-center">

          {/* PLAY */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}

            className="
              transition-all
              duration-150
              hover:scale-110
              active:scale-90
            "
          >
            <Play
              className={theme.colors.primary}
              fill="currentColor"
              size={18}
            />
          </button>

          {/* QUEUE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQueue?.(item);
            }}

            className="
              transition-all
              duration-150
              hover:scale-110
              active:scale-90
            "
          >
            <Plus
              className={theme.colors.primary}
              size={18}
            />
          </button>

        </div>
      </div>

      {/* GLOW */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 hover:opacity-100 transition pointer-events-none",
          theme.colors.glow
        )}
      />
    </Card>
  );
}