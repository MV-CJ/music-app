"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Radio, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { getTopTrack } from "@/lib/api";
import { Recommendations } from "@/components/home/Recommendations";
import { UpdatesCard } from "@/components/home/UpdatesCard";

type Props = {
  onPickSearch?: (query: string) => void;
  onPlayTrack?: (video: any) => void;
  onAddToQueue?: (video: any) => void;
};

export function HomeInfo({
  onPickSearch,
  onPlayTrack,
  onAddToQueue,
}: Props) {
  const router = useRouter();

  const [topTrackName, setTopTrackName] = useState<string | null>(null);
  const [topTrackArtist, setTopTrackArtist] = useState<string | null>(null);

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

  return (
    <ScrollArea className="h-full w-full pr-3">
  <div className="flex flex-col space-y-10 pb-6">

    {/* HEADER */}
    <div className="text-center mt-6 space-y-4">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
        Descubra uma nova vibe 🎧
      </h1>

      <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
        <Radio size={14} />
        Last.fm + YouTube Backend
      </p>
    </div>

    {/* RECOMMENDATIONS */}
    <Recommendations
      onPlay={onPlayTrack}
      onAddToQueue={onAddToQueue}
    />

    {/* NAV */}
    <div className="flex items-center justify-end">
      <Button
        size="sm"
        className="bg-purple-800/60 hover:bg-purple-700"
        onClick={() => router.push("/ranking")}
      >
        Ver mais <ChevronRight size={14} />
      </Button>
    </div>

    <Separator />

    {/* FOOTER NORMAL (SEM FORÇAR ALTURA) */}
    <UpdatesCard />

  </div>
</ScrollArea>
  );
}