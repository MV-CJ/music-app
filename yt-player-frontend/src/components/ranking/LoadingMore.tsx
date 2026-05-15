import { Loader2 } from "lucide-react";

export function LoadingMore() {

  return (
    <div className="flex justify-center py-10">

      <Loader2 className="animate-spin text-purple-400 w-8 h-8" />

    </div>
  );
}