"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader({ title }: { title?: string }) {
  const router = useRouter();

  return (
    <div className="mb-4 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft size={18} />
          Voltar
        </Button>

        <Button variant="ghost" onClick={() => router.push("/")}>
          <Home size={18} />
          Home
        </Button>
      </div>

      {/* TITLE */}
      {title && (
        <p className="text-sm text-zinc-400">{title}</p>
      )}

    </div>
  );
}