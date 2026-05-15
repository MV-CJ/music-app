import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RankingHeader() {

  return (
    <div className="flex flex-col gap-4">

      <Link href="/">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit hover:bg-white/10"
        >
          <ArrowLeft
            size={16}
            className="mr-2"
          />
          Voltar
        </Button>
      </Link>

      <div className="space-y-2">

        <h1
          className="
            text-4xl
            font-black
            tracking-tight
            bg-gradient-to-r
            from-white
            via-purple-200
            to-purple-400
            bg-clip-text
            text-transparent
          "
        >
          Ranking Global
        </h1>

        <p className="text-zinc-400 max-w-2xl">
          As músicas mais ouvidas do
          mundo em tempo real.
        </p>

      </div>
    </div>
  );
}