"use client";

import { createContext, useContext, useState } from "react";

type PlayerContextType = {
  current: any;
  setCurrent: (v: any) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<any>(null);

  return (
    <PlayerContext.Provider value={{ current, setCurrent }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}