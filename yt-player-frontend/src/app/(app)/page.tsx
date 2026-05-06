"use client";

import { useState } from "react";

import { MusicGrid } from "../../components/music/MusicGrid";
import { HomeInfo } from "../../components/home/HomeInfo";
import { SearchBar } from "../../components/layout/SearchBar";

import { searchMusic } from "../../lib/api";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [musicMode, setMusicMode] = useState(false);

  const player = usePlayerStore();

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchMusic(query, musicMode);
      setResults(data.data);
    } finally {
      setLoading(false);
    }
  };

  const searchWith = async (q: string) => {
    if (!q.trim()) return;

    setQuery(q);
    setLoading(true);

    try {
      const data = await searchMusic(q, musicMode);
      setResults(data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SEARCH */}
      <div className="px-3 sm:px-6 py-4 flex justify-center">
        <div className="w-full max-w-2xl">
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-2">
        {results.length === 0 ? (
          <HomeInfo
            onPickSearch={searchWith}
            onPlayTrack={(video) => player.play(video)}   // 🔥 wrapper
            onAddToQueue={(video) => player.addToQueue(video)} // 🔥 wrapper
          />
        ) : (
          <MusicGrid
            results={results}
            loading={loading}
            onPlay={(video: any) => player.play(video)}// 🔥 wrapper aqui também
            onAddToQueue={(video: any) => player.addToQueue(video)}
            loadingTrack={player.loadingTrack}
          />
        )}
      </div>
    </>
  );
}