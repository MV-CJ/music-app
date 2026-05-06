"use client";

import { useEffect, useState } from "react";
import { Flame, Loader2, Mic2, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getTopTracks, getTopTrack } from "@/lib/api";
import { usePlayerStore } from "@/store/usePlayerStore";

type Track = {
  rank: number;
  name: string;
  artist: string;
  playcount: number;
  listeners: number;
  image: string;
  yt_search: string;
};

export function Recommendations() {
  const { play, addToQueue, loadingTrack } = usePlayerStore();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const [topTrackName, setTopTrackName] = useState<string | null>(null);
  const [topTrackArtist, setTopTrackArtist] = useState<string | null>(null);

  /* ---------------- LOAD LIST ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await getTopTracks();

        if (Array.isArray(data)) {
          setTracks(data);
        } else {
          console.error("Formato inválido:", data);
          setTracks([]);
        }
      } catch (err) {
        console.error(err);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- LOAD TOP TRACK ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const top = await getTopTrack();
        if (top) {
          setTopTrackName(top.name);
          setTopTrackArtist(top.artist);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  /* ---------------- HELPERS ---------------- */
  const getId = (t: Track) => `${t.artist}-${t.name}`;

  const isLoading = (t: Track) =>
    loadingTrack === `${t.artist}-${t.name}`;

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

  /* ---------------- UI ---------------- */
  return (
    <div>
      <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
        <Flame size={20} className="text-orange-400" />
        Recomendações do momento

        {topTrackName && topTrackArtist && (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
            <Trophy size={12} />
            #1 {topTrackName}
          </Badge>
        )}
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
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
                <p className="font-bold text-sm truncate">
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
    </div>
  );
}