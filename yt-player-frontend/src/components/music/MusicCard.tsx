"use client";

import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";

interface Props {
  data: any;
  onClick: () => void;
}

export function MusicCard({ data, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden cursor-pointer",
        theme.radius.xl,
        theme.colors.panel,
        theme.colors.border,
        theme.effects.glass,
        theme.effects.hover
      )}
    >
      <img src={data.thumbnail} className="h-40 w-full object-cover opacity-90" />

      <div className="p-3">
        <p className="text-sm line-clamp-2 text-zinc-100">
          {data.title}
        </p>

        <div className="mt-2 flex justify-between">
          <span className={theme.colors.muted}>track</span>
          <Play className={theme.colors.primary} />
        </div>
      </div>

      <div className={cn(
        "absolute inset-0 opacity-0 hover:opacity-100 transition",
        theme.colors.glow
      )} />
    </Card>
  );
}