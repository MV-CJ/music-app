"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { MusicCard } from "./MusicCard";

interface Props {
  items?: any[];
  loading?: boolean;
  loadingTrack?: string | null;

  onPlay: (item: any) => void;
  onQueue: (item: any) => void;
}

export function MusicGrid({
  items = [],
  loading = false,
  loadingTrack,
  onPlay,
  onQueue,
}: Props) {

  // loading inicial
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-44 rounded-2xl bg-white/5"
          />
        ))}
      </div>
    );
  }

  // proteção contra undefined/null
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 text-zinc-500">
        Descubra uma nova vibe sonora 🎧
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {items.map((item, index) => (
        <MusicCard
        key={
          item?.video_id ||
          `${item?.artist}-${item?.name}` ||
          index
        }

        item={item}
        rank={index + 1}

        loading={
          loadingTrack === item?.video_id
        }

        onPlay={onPlay}
        onQueue={onQueue}
      />
      ))}

    </div>
  );
}