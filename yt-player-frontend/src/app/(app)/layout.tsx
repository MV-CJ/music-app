"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Player } from "@/components/player/Player";
import { usePlayerStore } from "@/store/usePlayerStore";
import { SearchBar } from "@/components/layout/SearchBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const player = usePlayerStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  // 🔥 estado da busca global
  const [query, setQuery] = useState("");
  const [musicMode, setMusicMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const hasSession =
      player.current || (player.queue && player.queue.length > 0);

    if (hasSession) {
      player.setPlayerOpen(true);
    }
  }, [player.current, player.queue]);

  // 🔥 agora a busca só navega
  const handleSearch = () => {
    if (!query.trim()) return;

    router.push(
      `/search_web?q=${encodeURIComponent(query)}&music=${musicMode}`
    );
  };

  return (
    <div className="h-dvh flex overflow-hidden">
      {/* SIDEBAR */}
      <div className="hidden md:flex md:w-64">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* 🔍 SEARCH BAR GLOBAL */}
        <div className="px-3 sm:px-6 py-4 border-b border-white/10">
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              loading={false}
              musicMode={musicMode}
              setMusicMode={setMusicMode}
            />
          </div>
        </div>

        {/* 🔥 CONTENT */}
        <div className="flex-1 overflow-y-auto pb-28">
          {children}
        </div>
      </div>

      {/* 🔥 PLAYER FIXO */}
      {mounted && player.playerOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:left-64">
          <Player
            current={player.current}
            queue={player.queue}
            currentIndex={player.currentIndex}
            onNext={player.playNext}
            onPrev={player.playPrev}
            onSelect={player.selectFromQueue}
            onRemove={player.removeFromQueue}
            onEnd={player.playNext}
          />
        </div>
      )}
    </div>
  );
}