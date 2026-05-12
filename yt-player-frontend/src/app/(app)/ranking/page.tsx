"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  Mic2,
  ArrowLeft,
  Loader2,
  Headphones,
  Plus,
  Play,
  Disc3,
  ChevronUp,
} from "lucide-react";

import Link from "next/link";

import { usePlayerStore } from "@/store/usePlayerStore";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

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

/* ---------------- CONFIG ---------------- */
const ITEMS_PER_PAGE = 50;

export default function RankingPage() {

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const [tracks, setTracks] =
    useState<Track[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [hasMore, setHasMore] =
    useState(true);

  // 👇 botão subir
  const [showScrollTop, setShowScrollTop] =
    useState(false);

  const {
    play,
    addToQueue,
    loadingTrack,
  } = usePlayerStore();

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

  /* ---------------- LOAD TRACKS ---------------- */
  const loadTracks = async (
    pageToLoad = 1
  ) => {

    if (loadingMore) return;

    try {

      if (pageToLoad === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lastfm/top-tracks?page=${pageToLoad}&limit=${ITEMS_PER_PAGE}`
      );

      const json = await res.json();

      const newTracks =
        Array.isArray(json.data)
          ? json.data
          : [];

      if (newTracks.length === 0) {
        setHasMore(false);
        return;
      }

      setTracks((prev) => {

        if (pageToLoad === 1) {
          return newTracks;
        }

        const existingIds =
          new Set(
            prev.map((t) =>
              `${t.artist}-${t.name}`
            )
          );

        const filtered =
          newTracks.filter(
            (t) =>
              !existingIds.has(
                `${t.artist}-${t.name}`
              )
          );

        return [
          ...prev,
          ...filtered,
        ];
      });

      setTotalPages(
        json.total_pages || 1
      );

      setCurrentPage(pageToLoad);

      if (
        pageToLoad >=
        (json.total_pages || 1)
      ) {
        setHasMore(false);
      }

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
      setLoadingMore(false);

    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    loadTracks(1);
  }, []);

  /* ---------------- INFINITE SCROLL ---------------- */
  useEffect(() => {

    const container =
      scrollRef.current;

    if (!container) return;

    const handleScroll = () => {

      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = container;

      // 👇 mostrar botão
      setShowScrollTop(
        scrollTop > 1200
      );

      const nearBottom =
        scrollTop +
          clientHeight >=
        scrollHeight - 800;

      if (
        nearBottom &&
        hasMore &&
        !loadingMore
      ) {

        loadTracks(
          currentPage + 1
        );
      }
    };

    container.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {

      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };

  }, [
    currentPage,
    hasMore,
    loadingMore,
  ]);

  /* ---------------- SCROLL TO TOP ---------------- */
  const scrollToTop = () => {

    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ---------------- ACTIONS ---------------- */
  const handlePlay = async (
    track: Track
  ) => {

    await play({
      video_id: track.yt_search,
      title: track.name,
      author: track.artist,

      thumbnail:
        track.artist_image ||
        track.image,

      artist_image:
        track.artist_image,

      image:
        track.image,
    });
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

      thumbnail:
        track.artist_image ||
        track.image,

      artist_image:
        track.artist_image,

      image:
        track.image,
    });
  };

  return (

    <div
      ref={scrollRef}
      className="
        h-full
        w-full
        overflow-y-auto
        bg-gradient-to-b
        from-black
        via-zinc-950
        to-black
        relative
      "
    >

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col gap-4">

          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-fit hover:bg-white/10"
            >
              <ArrowLeft
                size={16}
                className="mr-2"
              />
              Voltar
            </Button>
          </Link>

          <div className="space-y-2">

            <h1
              className="
                text-4xl
                font-black
                tracking-tight
                bg-gradient-to-r
                from-white
                via-purple-200
                to-purple-400
                bg-clip-text
                text-transparent
              "
            >
              Ranking Global
            </h1>

            <p className="text-zinc-400 max-w-2xl">
              As músicas mais ouvidas do
              mundo em tempo real.
            </p>

          </div>
        </div>

        {/* LOADING */}
        {loading ? (

          <div className="flex flex-col items-center justify-center py-28 gap-4">

            <Loader2 className="animate-spin text-purple-400 w-10 h-10" />

            <p className="text-zinc-500 text-sm">
              Carregando ranking...
            </p>

          </div>

        ) : (

          <>
            {/* GRID */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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

                  <CardContent className="relative z-10 p-4">

                    {/* COVER */}
                    <div className="relative mb-4 overflow-hidden rounded-2xl">

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
                            w-16
                            h-16
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
                            size={24}
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
                            text-base
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
                    <div className="mt-5 flex gap-2">

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

            {/* LOADING MORE */}
            {loadingMore && (

              <div className="flex justify-center py-10">

                <Loader2 className="animate-spin text-purple-400 w-8 h-8" />

              </div>
            )}

          </>
        )}
      </div>

      {/* 👇 SCROLL TO TOP */}
      {showScrollTop && (

        <button
          onClick={scrollToTop}
          className="
            fixed
            bottom-24
            right-5
            z-50
            w-12
            h-12
            rounded-full
            bg-purple-600/90
            hover:bg-purple-500
            text-white
            shadow-2xl
            shadow-purple-500/30
            backdrop-blur-xl
            border
            border-white/10
            flex
            items-center
            justify-center
            transition-all
            duration-300
            hover:scale-110
          "
        >
          <ChevronUp size={22} />
        </button>
      )}
    </div>
  );
}