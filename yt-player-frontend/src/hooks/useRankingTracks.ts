"use client";

import {
  useEffect,
  useState,
} from "react";

import { Track } from "@/types/track";

const ITEMS_PER_PAGE = 50;

export function useRankingTracks() {

  const [tracks, setTracks] =
    useState<Track[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [hasMore, setHasMore] =
    useState(true);

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

      const newTracks: Track[] =
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
            prev.map(
              (track) =>
                `${track.artist}-${track.name}`
            )
          );

        const filtered =
          newTracks.filter(
            (track) =>
              !existingIds.has(
                `${track.artist}-${track.name}`
              )
          );

        return [
          ...prev,
          ...filtered,
        ];
      });

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

  useEffect(() => {
    loadTracks(1);
  }, []);

  return {
    tracks,
    loading,
    loadingMore,
    currentPage,
    hasMore,
    loadTracks,
  };
}