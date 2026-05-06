"use client";

import { useEffect, useState } from "react";
import { Mic2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { usePlayerStore } from "@/store/usePlayerStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getTopTracks } from "@/lib/api";

/* ---------------- TYPES ---------------- */
type Track = {
  rank: number;
  name: string;
  artist: string;
  playcount: number;
  listeners: number;
  image: string;
  yt_search: string;
};

/* ---------------- CONFIG ---------------- */
const ITEMS_PER_PAGE = 50;

export default function RankingPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { play, addToQueue, loadingTrack } = usePlayerStore();

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/lastfm/top-tracks?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
        );

        const json = await res.json();

        setTracks(Array.isArray(json.data) ? json.data : []);
        setTotalPages(json.total_pages || 1);

      } catch (err) {
        console.error(err);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage]);

  /* ---------------- HELPERS ---------------- */
  const getId = (t: Track) => `${t.artist}-${t.name}`;
  const isLoading = (t: Track) => loadingTrack === getId(t);

  /* ---------------- ACTIONS ---------------- */
  const handlePlay = async (track: Track) => {
    await play({
      video_id: track.yt_search,
      title: track.name,
      author: track.artist,
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
    });
  };

  /* ---------------- PAGINATION ---------------- */
  const renderPages = () => {
    const pages = [];

    for (let i = 1; i <= Math.min(5, totalPages); i++) {
      let pageNumber = i;

      if (totalPages > 5 && currentPage > 3) {
        pageNumber = currentPage - 2 + i;
        if (pageNumber > totalPages) return null;
      }

      const isActive = pageNumber === currentPage;

      pages.push(
        <PaginationItem key={pageNumber}>
          <PaginationLink
            isActive={isActive}
            onClick={() => setCurrentPage(pageNumber)}
            className={`
              cursor-pointer
              ${isActive
                ? "bg-purple-600 text-white"
                : "hover:bg-purple-500/20"}
            `}
          >
            {pageNumber}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="h-full w-full p-6 space-y-8 overflow-y-auto">

      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold ...">
          Ranking Global
        </h1>

        <div className="flex gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} /> Voltar
            </Button>
          </Link>
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tracks.map((track) => (
            <Card
              key={getId(track)}
              onClick={() => handlePlay(track)}
              className="relative cursor-pointer bg-purple-950/40 border border-purple-500/20 hover:border-purple-400/60 transition"
            >
              {isLoading(track) && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-purple-400" />
                </div>
              )}

              <CardContent className="p-3">
                <p className="font-bold text-sm">
                  #{track.rank} {track.name}
                </p>

                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mic2 size={10} /> {track.artist}
                </p>

                <p className="text-[10px] mt-1 text-muted-foreground">
                  👥 {track.listeners.toLocaleString()}
                </p>

                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleQueue(e, track)}
                  >
                    + Fila
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination>
            <PaginationContent>

              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  className={currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                />
              </PaginationItem>

              {renderPages()}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  className={currentPage === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* FOOTER */}
      <div className="text-center text-xs text-muted-foreground">
        Página {currentPage} de {totalPages}
      </div>

    </div>
  );
}