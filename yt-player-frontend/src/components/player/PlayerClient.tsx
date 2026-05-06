"use client";

import { useEffect, useState } from "react";
import { Player } from "./Player";

export function PlayerClient(props: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔥 evita hydration mismatch
  if (!mounted) return null;

  return <Player {...props} />;
}