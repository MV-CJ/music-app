"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { MusicGrid } from "@/components/music/MusicGrid";
import { searchMusic } from "@/lib/api";
import { usePlayerStore } from "@/store/usePlayerStore";

import { AppHeader } from "@/components/layout/AppHeader";

export default function SearchWebPage() {
  const params = useSearchParams();

  const queryParam = params.get("q") || "";
  const musicParam = params.get("music") === "true";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const player = usePlayerStore();

  useEffect(() => {
    if (!queryParam) return;

    const run = async () => {
      setLoading(true);
      try {
        const data = await searchMusic(queryParam, musicParam);
        setResults(data.data);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [queryParam, musicParam]);

  return (
    <div className="px-3 sm:px-6 py-4">

      {/* HEADER GLOBAL DA PÁGINA */}
      <AppHeader title="Busca" />

      {/* TÍTULO */}
      <h2 className="text-lg font-bold mb-4">
        Resultados para: "{queryParam}"
      </h2>

      {/* GRID */}
      <MusicGrid
        results={results}
        loading={loading}
        onPlay={player.play}
        onAddToQueue={player.addToQueue}
        loadingTrack={player.loadingTrack}
      />
    </div>
  );
}