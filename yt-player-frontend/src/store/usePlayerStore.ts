"use client";

import { create } from "zustand";
import { getStream } from "@/lib/api";

type Track = any;
type RepeatMode = "off" | "one" | "all";

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

  play: async (track) => {
    set({ playerOpen: true, loadingTrack: track.title });

    const stream = await getStream(track.video_id || track.title);

    set({
      current: { ...track, stream },
      loadingTrack: null,
    });
  },

  addToQueue: (track) => {
    const { queue, current } = get();

    const exists = queue.find(
      (v) => v.title === track.title && v.artist === track.artist
    );

    if (exists) return;

    const newQueue = [...queue, track];

    set({ queue: newQueue, playerOpen: true });

    if (!current) get().play(track);
  },

  playNext: async () => {
    const { queue, currentIndex, repeatMode, current } = get();

    // 🔁 REPEAT ONE
    if (repeatMode === "one" && current) {
      const stream = await getStream(current.video_id || current.title);
      set({ current: { ...current, stream } });
      return;
    }

    let nextIndex = currentIndex + 1;

    // 🔁 REPEAT ALL
    if (nextIndex >= queue.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        return;
      }
    }

    const next = queue[nextIndex];

    set({ currentIndex: nextIndex, loadingTrack: next.title });

    const stream = await getStream(next.video_id || next.title);

    set({
      current: { ...next, stream },
      loadingTrack: null,
    });
  },

  playPrev: async () => {
    const { queue, currentIndex } = get();

    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) return;

    const prev = queue[prevIndex];

    set({ currentIndex: prevIndex, loadingTrack: prev.title });

    const stream = await getStream(prev.video_id || prev.title);

    set({
      current: { ...prev, stream },
      loadingTrack: null,
    });
  },

  selectFromQueue: async (track) => {
    const { queue } = get();

    const index = queue.findIndex(
      (v) => v.title === track.title && v.artist === track.artist
    );

    if (index === -1) return;

    set({ currentIndex: index, loadingTrack: track.title });

    const stream = await getStream(track.video_id || track.title);

    set({
      current: { ...track, stream },
      loadingTrack: null,
    });
  },

  removeFromQueue: (track) => {
    const { queue, current, currentIndex } = get();

    const newQueue = queue.filter(
      (v) => !(v.title === track.title && v.artist === track.artist)
    );

    set({ queue: newQueue });
  },
}));