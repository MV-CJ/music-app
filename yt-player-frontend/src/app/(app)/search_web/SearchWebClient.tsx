"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"

import { MusicGrid } from "@/components/music/MusicGrid"
import { searchMusic } from "@/lib/api"
import { usePlayerStore } from "@/store/usePlayerStore"
import { AppHeader } from "@/components/layout/AppHeader"
import { Loader2 } from "lucide-react"

export default function SearchWebClient() {
  const params = useSearchParams()

  const queryParam = params.get("q") || ""
  const musicParam = params.get("music") === "true"

  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const player = usePlayerStore()

  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const isFetchingRef = useRef(false)

  /* RESET SEARCH */
  useEffect(() => {
    setResults([])
    setPage(1)
    setTotalPages(1)
    isFetchingRef.current = false
  }, [queryParam, musicParam])

  /* FETCH DATA */
  useEffect(() => {
    if (!queryParam) return

    const run = async () => {
      if (isFetchingRef.current) return

      isFetchingRef.current = true
      setLoading(true)

      try {
        const data = await searchMusic(
          queryParam,
          musicParam,
          page
        )

        setTotalPages(data.total_pages || 1)

        setResults((prev) => {
          const existingIds = new Set(
            prev.map((item) => item.video_id)
          )

          const filtered = (data.data || []).filter(
            (item: any) => !existingIds.has(item.video_id)
          )

          return [...prev, ...filtered]
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
        isFetchingRef.current = false
      }
    }

    run()
  }, [queryParam, musicParam, page])

  /* INFINITE SCROLL */
  useEffect(() => {
    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !loading &&
          page < totalPages &&
          !isFetchingRef.current
        ) {
          setPage((prev) => prev + 1)
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [loading, page, totalPages])

  /* LOADING PRIMEIRA PÁGINA (FULL SCREEN FEEL) */
  const isInitialLoading = loading && page === 1

  return (
    <div className="px-3 sm:px-6 py-4 min-h-screen">
      <AppHeader title="Busca" />

      <h2 className="text-lg font-bold mb-4">
        Resultados para: "{queryParam}"
      </h2>

      {/* 🔥 LOADING BONITO CENTRAL */}
      {isInitialLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
          <p className="text-sm text-zinc-500 mt-3">
            Buscando músicas...
          </p>
        </div>
      ) : (
        <>
          <MusicGrid
            results={results}
            loading={false}
            onPlay={player.play}
            onAddToQueue={player.addToQueue}
            loadingTrack={player.loadingTrack}
          />

          {/* TRIGGER INFINITO */}
          <div
            ref={loadMoreRef}
            className="h-20 flex items-center justify-center"
          >
            {loading && page > 1 && (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            )}

            {!loading &&
              page >= totalPages &&
              results.length > 0 && (
                <span className="text-sm text-zinc-500">
                  Fim dos resultados
                </span>
              )}
          </div>
        </>
      )}
    </div>
  )
}