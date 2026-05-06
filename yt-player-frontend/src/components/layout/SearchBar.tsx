"use client";

import { Search, Loader2, Music } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  loading: boolean;
  musicMode: boolean;
  setMusicMode: (v: boolean) => void;
};

export function SearchBar({
  query,
  setQuery,
  loading,
  musicMode,
  setMusicMode,
}: Props) {
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;

    router.push(
      `/search_web?q=${encodeURIComponent(query)}&music=${musicMode}`
    );
  };

  return (
    <div className="flex items-center gap-3 w-full">

      {/* 🔍 INPUT + BUTTON */}
      <div className="flex items-center gap-2 flex-1">
        <Input
          placeholder="Buscar músicas, artistas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="bg-zinc-900 border-white/10"
        />

        <Button
          onClick={handleSearch}
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-600"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
        </Button>
      </div>

      {/* 🎵 MODO MÚSICA (DIREITA) */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 whitespace-nowrap">
        <Music size={14} />
        <span>Modo música</span>
        <Switch
          checked={musicMode}
          onCheckedChange={setMusicMode}
        />
      </div>
    </div>
  );
}