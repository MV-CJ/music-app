import { Loader2 } from "lucide-react";

export function RankingLoading() {

  return (
    <div className="flex flex-col items-center justify-center py-28 gap-4">

      <Loader2 className="animate-spin text-purple-400 w-10 h-10" />

      <p className="text-zinc-500 text-sm">
        Carregando ranking...
      </p>

    </div>
  );
}