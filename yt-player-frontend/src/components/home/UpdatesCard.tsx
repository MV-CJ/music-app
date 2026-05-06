"use client";

import { Card, CardContent } from "@/components/ui/card";

export function UpdatesCard() {
  return (
    <Card className="bg-purple-950/30 border-purple-500/20">
      <CardContent className="p-4 text-sm">
        <p className="font-bold">📌 Atualizações</p>

        <ul className="list-disc pl-5 text-muted-foreground space-y-1 mt-2">
          <li>Integração completa com backend FastAPI</li>
          <li>Recomendações dinâmicas (Last.fm)</li>
          <li>Player global com fila</li>
          <li>Arquitetura separada (frontend leve)</li>
        </ul>
      </CardContent>
    </Card>
  );
}