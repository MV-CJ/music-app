"use client";

import { useRef, useState } from "react";

import { usePlayerStore } from "@/store/usePlayerStore";

import { useRankingTracks } from "@/hooks/useRankingTracks";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import { Track } from "@/types/track";

import { RankingHeader } from "@/components/ranking/RankingHeader";

import { RankingLoading } from "@/components/ranking/RankingLoading";

import { LoadingMore } from "@/components/ranking/LoadingMore";

import { MusicGrid } from "@/components/music/MusicGrid";

import { ScrollTopButton } from "@/components/ranking/ScrollTopButton";

export default function RankingPage() {

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const [showScrollTop, setShowScrollTop] =
    useState(false);

  const {
    tracks,
    loading,
    loadingMore,
    currentPage,
    hasMore,
    loadTracks,
  } = useRankingTracks();

  const {
    play,
    addToQueue,
    loadingTrack,
  } = usePlayerStore();

  useInfiniteScroll({
    containerRef: scrollRef,
    hasMore,
    loading: loadingMore,
    currentPage,
    onLoadMore: loadTracks,
    onToggleButton:
      setShowScrollTop,
  });

  const scrollToTop = () => {

    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
    track: Track
  ) => {

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

        <RankingHeader />

        {loading ? (

          <RankingLoading />

        ) : (

          <>
            <MusicGrid
              items={tracks}
              loading={loading}
              loadingTrack={loadingTrack}
              onPlay={handlePlay}
              onQueue={handleQueue}
            />
            {loadingMore && (
              <LoadingMore />
            )}
          </>
        )}
      </div>

      <ScrollTopButton
        visible={showScrollTop}
        onClick={scrollToTop}
      />
    </div>
  );
}