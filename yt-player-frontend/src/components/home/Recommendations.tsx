"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Flame,
  Loader2,
  Mic2,
  Trophy,
  Play,
  Plus,
  Headphones,
  Disc3,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
  getTopTracks,
  getTopTrack,
} from "@/lib/api";

import { usePlayerStore } from "@/store/usePlayerStore";

/* ---------------- TYPES ---------------- */
type Track = {
  rank: number;
  name: string;
  artist: string;
  playcount: number;
  listeners: number;
  image?: string;
  artist_image?: string;
  yt_search: string;
};

type Props = {
  onPlay?: (video: any) => void;
  onAddToQueue?: (video: any) => void;
};

/* ---------------- COMPONENT ---------------- */
export function Recommendations({
  onPlay,
  onAddToQueue,
}: Props) {

  const {
    play,
    addToQueue,
    loadingTrack,
  } = usePlayerStore();

  const [tracks, setTracks] =
    useState<Track[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [topTrackName, setTopTrackName] =
    useState<string | null>(null);

  const [
    topTrackArtist,
    setTopTrackArtist,
  ] = useState<string | null>(null);

  /* ---------------- LOAD LIST ---------------- */
  useEffect(() => {

    (async () => {

      try {

        const data =
          await getTopTracks(1, 10);

        if (Array.isArray(data)) {

          setTracks(data);

        } else {

          console.error(
            "Formato inválido:",
            data
          );

          setTracks([]);
        }

      } catch (err) {

        console.error(err);
        setTracks([]);

      } finally {

        setLoading(false);

      }
    })();

  }, []);

  /* ---------------- LOAD TOP TRACK ---------------- */
  useEffect(() => {

    (async () => {

      try {

        const top =
          await getTopTrack();

        if (top) {

          setTopTrackName(top.name);

          setTopTrackArtist(
            top.artist
          );
        }

      } catch (err) {

        console.error(err);

      }
    })();

  }, []);

  /* ---------------- HELPERS ---------------- */
  const getId = (t: Track) =>
    `${t.artist}-${t.name}`;

  const isLoading = (t: Track) =>
    loadingTrack === getId(t);

  const getTrackImage = (
    track: Track
  ) => {

    if (
      track.artist_image &&
      track.artist_image.trim() !== ""
    ) {
      return track.artist_image;
    }

    if (
      track.image &&
      track.image.trim() !== ""
    ) {
      return track.image;
    }

    return "https://placehold.co/600x600/18181b/71717a?text=Music";
  };

  /* ---------------- ACTIONS ---------------- */
  /* ---------------- ACTIONS ---------------- */
  const handlePlay = async (
    track: Track
  ) => {

    await play({
      video_id: track.yt_search,

      title: track.name,

      author: track.artist,

      // 🔥 capas
      artist_image:
        track.artist_image,

      thumbnail:
        track.image,

      image:
        track.image,
    });

    onPlay?.(track);
  };

  const handleQueue = async (
    e: React.MouseEvent,
    track: Track
  ) => {

    e.stopPropagation();

    await addToQueue({
      video_id: track.yt_search,

      title: track.name,

      author: track.artist,

      // 🔥 capas
      artist_image:
        track.artist_image,

      thumbnail:
        track.image,

      image:
        track.image,
    });

    onAddToQueue?.(track);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">

        <h2 className="font-bold text-2xl flex items-center gap-2">

          <Flame
            size={24}
            className="text-orange-400"
          />

          Top 10 do momento

        </h2>

        {topTrackName &&
          topTrackArtist && (

            <Badge
              className="
                bg-yellow-500/20
                text-yellow-300
                border-yellow-500/50
                px-3
                py-1
                text-xs
                flex
                items-center
                gap-2
              "
            >

              <Trophy size={12} />

              #1 {topTrackName}

            </Badge>
          )}
      </div>

      {/* LOADING */}
      {loading ? (

        <div className="flex justify-center py-16">

          <Loader2 className="animate-spin text-purple-400 w-8 h-8" />

        </div>

      ) : (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

          {tracks.map((track) => (

            <Card
              key={getId(track)}

              onClick={() =>
                handlePlay(track)
              }

              className="
                group
                relative
                overflow-hidden
                cursor-pointer
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                hover:border-purple-400/40
                hover:bg-purple-500/10
                transition-all
                duration-300
                hover:scale-[1.02]
              "
            >

              {/* BG */}
              <div className="absolute inset-0 overflow-hidden">

                <img
                  src={getTrackImage(track)}
                  alt={track.artist}
                  className="
                    w-full
                    h-full
                    object-cover
                    scale-125
                    blur-3xl
                    opacity-20
                    group-hover:opacity-30
                    transition
                  "
                />

                <div className="absolute inset-0 bg-black/70" />

              </div>

              {/* LOADING */}
              {isLoading(track) && (

                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">

                  <Loader2 className="animate-spin text-purple-400 w-8 h-8" />

                </div>
              )}

              <CardContent className="relative z-10 p-3">

                {/* COVER */}
                <div className="relative mb-3 overflow-hidden rounded-xl">

                  <img
                    src={getTrackImage(track)}

                    alt={track.artist}

                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x600/18181b/71717a?text=Music";
                    }}

                    className="
                      w-full
                      aspect-square
                      object-cover
                      rounded-2xl
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />

                  {/* TOP BADGE */}
                  {track.rank <= 3 && (

                    <div
                      className="
                        absolute
                        top-3
                        left-3
                        px-2
                        py-1
                        rounded-full
                        bg-yellow-400
                        text-black
                        text-[10px]
                        font-black
                        shadow-lg
                      "
                    >
                      TOP {track.rank}
                    </div>
                  )}

                  {/* PLAY */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/30
                      opacity-0
                      group-hover:opacity-100
                      transition
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <div
                      className="
                        w-12
                        h-12
                        rounded-full
                        bg-purple-500/90
                        backdrop-blur-xl
                        flex
                        items-center
                        justify-center
                        shadow-2xl
                        shadow-purple-500/40
                      "
                    >

                      <Play
                        className="text-white ml-1"
                        size={18}
                        fill="white"
                      />

                    </div>
                  </div>
                </div>

                {/* INFO */}
                <div className="space-y-3">

                  <div>

                    <p className="text-xs text-purple-400 font-semibold mb-1">
                      #{track.rank}
                    </p>

                    <h3
                      className="
                        font-bold
                        leading-tight
                        line-clamp-2
                        text-white
                        text-sm
                      "
                    >
                      {track.name}
                    </h3>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-zinc-300
                    "
                  >

                    <Mic2 size={14} />

                    <span className="truncate">
                      {track.artist}
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      text-xs
                      text-zinc-400
                    "
                  >

                    <div className="flex items-center gap-1">

                      <Headphones size={12} />

                      <span>
                        {track.listeners.toLocaleString()}
                      </span>

                    </div>

                    <div className="flex items-center gap-1">

                      <Disc3 size={12} />

                      <span>
                        {track.playcount.toLocaleString()}
                      </span>

                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex gap-2">

                  <Button
                    size="sm"
                    className="
                      flex-1
                      bg-purple-600
                      hover:bg-purple-500
                      font-semibold
                    "
                  >

                    <Play size={14} />

                    Ouvir

                  </Button>

                  <Button
                    size="icon"
                    variant="secondary"

                    onClick={(e) =>
                      handleQueue(
                        e,
                        track
                      )
                    }

                    className="
                      bg-white/10
                      hover:bg-white/20
                      border
                      border-white/10
                    "
                  >

                    <Plus size={16} />

                  </Button>

                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}