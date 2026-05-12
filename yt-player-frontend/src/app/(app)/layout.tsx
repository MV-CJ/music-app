"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Player } from "@/components/player/Player";
import { usePlayerStore } from "@/store/usePlayerStore";
import { SearchBar } from "@/components/layout/SearchBar";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const player = usePlayerStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  /* 🔥 scroll listener no CONTAINER (não window) */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      setShowTop(el.scrollTop > 600);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    router.push(
      `/search_web?q=${encodeURIComponent(query)}&music=${musicMode}`
    );
  };

  return (
    <div className="h-dvh flex overflow-hidden">
      {/* SIDEBAR */}
      <div className="hidden md:flex md:w-64 md:shrink-0">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* SEARCH */}
        <div className="px-3 sm:px-6 py-4 border-b border-white/10 shrink-0">
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar
              query={query}
              setQuery={setQuery}
              loading={false}
              musicMode={musicMode}
              setMusicMode={setMusicMode}
            />
          </div>
        </div>

        {/* 🔥 SCROLL AREA REAL */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
        >
          {children}
        </div>
      </div>

      {/* BOTÃO TO TOP */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="
            fixed
            bottom-28
            right-6
            z-50
            w-12 h-12
            rounded-full
            bg-purple-600/90
            hover:bg-purple-500
            text-white
            shadow-xl
            backdrop-blur-xl
            border border-white/10
            flex items-center justify-center
            transition
            hover:scale-110
          "
        >
          <ChevronUp size={22} />
        </button>
      )}

      {/* PLAYER */}
      {mounted && player.playerOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:left-64">
          <Player />
        </div>
      )}
    </div>
  );
}