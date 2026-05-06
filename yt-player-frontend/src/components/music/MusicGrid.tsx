import { Skeleton } from "@/components/ui/skeleton";
import { Play, Plus } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";

export function MusicGrid({ results, loading }: any) {
  const player = usePlayerStore();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="flex items-center justify-center h-60 text-zinc-500">
        Descubra uma nova vibe sonora 🎧
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {results.map((r: any) => (
        <div
          key={r.video_id}
          className="relative group bg-zinc-900/60 rounded-2xl overflow-hidden"
        >
          <img src={r.thumbnail} className="h-44 w-full object-cover" />

          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => player.play(r)}
              className="p-3 bg-white text-black rounded-full"
            >
              <Play size={18} />
            </button>

            <button
              onClick={() => player.addToQueue(r)}
              className="p-3 bg-black text-white border border-white/20 rounded-full"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="p-3">
            <p className="text-sm text-white line-clamp-2">
              {r.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}