"use client";

import { create } from "zustand";
import { getStream } from "@/lib/api";

type Track = any;
type RepeatMode = "off" | "one" | "all";

const getTrackId = (t: Track) =>
  `${t.artist || t.author}-${t.name || t.title}`;

type PlayerState = {
  current: Track | null;
  queue: Track[];
  currentIndex: number;

  volume: number;
  playerOpen: boolean;
  loadingTrack: string | null;

  repeatMode: RepeatMode;

  setVolume: (v: number) => void;
  setPlayerOpen: (v: boolean) => void;
  setRepeatMode: (m: RepeatMode) => void;

  play: (track: Track) => Promise<void>;
  addToQueue: (track: Track) => void;
  playNext: () => Promise<void>;
  playPrev: () => Promise<void>;
  selectFromQueue: (track: Track) => Promise<void>;
  removeFromQueue: (track: Track) => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  current: null,
  queue: [],
  currentIndex: -1,

  volume: 0.4,
  playerOpen: false,
  loadingTrack: null,

  repeatMode: "off",

  setRepeatMode: (mode) => set({ repeatMode: mode }),
  setVolume: (v) => set({ volume: v }),
  setPlayerOpen: (v) => set({ playerOpen: v }),

  /* ---------------- PLAY ---------------- */
  play: async (track) => {
    set({
      playerOpen: true,
      loadingTrack: track.name || track.title,
    });

    const stream = await getStream(
      track.video_id || track.yt_search || track.title
    );

    const normalized = {
      video_id: track.video_id || track.yt_search,

      // 🔥 PADRÃO DO PLAYERBAR
      title: track.title || track.name,
      author: track.author || track.artist,

      thumbnail:
        track.thumbnail ||
        track.artist_image ||
        track.image,

      artist_image: track.artist_image,
      image: track.image,

      stream,
    };

    set({
      current: normalized,
      loadingTrack: null,
    });
  },

  /* ---------------- QUEUE ---------------- */
  addToQueue: (track) => {
    const { queue, current } = get();

    const normalized = {
      video_id: track.video_id || track.yt_search,

      title: track.title || track.name,
      author: track.author || track.artist,

      thumbnail:
        track.thumbnail ||
        track.artist_image ||
        track.image,

      artist_image: track.artist_image,
      image: track.image,
    };

    const exists = queue.find(
      (t) => t.video_id === normalized.video_id
    );

    if (exists) return;

    const newQueue = [...queue, normalized];

    set({ queue: newQueue, playerOpen: true });

    if (!current) get().play(normalized);
  },

  /* ---------------- NEXT ---------------- */
  playNext: async () => {
    const { queue, currentIndex, repeatMode, current } = get();

    if (!queue.length) return;

    if (repeatMode === "one" && current) {
      const query =
        current.video_id ||
        current.yt_search ||
        `${current.name || current.title} ${current.artist || current.author}`;

      const stream = await getStream(query);

      set({
        current: { ...current, stream },
      });

      return;
    }

    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        return;
      }
    }

    const next = queue[nextIndex];

    if (!next) return;

    const id = getTrackId(next);

    set({ currentIndex: nextIndex, loadingTrack: id });

    const query =
      next.video_id ||
      next.yt_search ||
      `${next.name || next.title} ${next.artist || next.author}`;

    const stream = await getStream(query);

    set({
      current: { ...next, stream },
      loadingTrack: null,
    });
  },

  /* ---------------- PREV ---------------- */
  playPrev: async () => {
    const { queue, currentIndex } = get();

    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) return;

    const prev = queue[prevIndex];

    if (!prev) return;

    const id = getTrackId(prev);

    set({ currentIndex: prevIndex, loadingTrack: id });

    const query =
      prev.video_id ||
      prev.yt_search ||
      `${prev.name || prev.title} ${prev.artist || prev.author}`;

    const stream = await getStream(query);

    set({
      current: { ...prev, stream },
      loadingTrack: null,
    });
  },

  /* ---------------- SELECT ---------------- */
  selectFromQueue: async (track) => {
    const { queue } = get();

    const id = getTrackId(track);

    const index = queue.findIndex(
      (v) => getTrackId(v) === id
    );

    if (index === -1) return;

    set({ currentIndex: index, loadingTrack: id });

    const query =
      track.video_id ||
      track.yt_search ||
      `${track.name || track.title} ${track.artist || track.author}`;

    const stream = await getStream(query);

    set({
      current: { ...track, stream },
      loadingTrack: null,
    });
  },

  /* ---------------- REMOVE ---------------- */
  removeFromQueue: (track) => {
    const { queue } = get();

    const id = getTrackId(track);

    const newQueue = queue.filter(
      (v) => getTrackId(v) !== id
    );

    set({ queue: newQueue });
  },
}));