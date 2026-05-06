"use client";

import { useState } from "react";
import {
  Music,
  ListMusic,
  Clock,
  Heart,
  User,
  LogOut,
  Coffee,
  LogIn,
} from "lucide-react";

import { cn } from "@/lib/utils";

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const user = {
    name: "Marcos",
    avatar: "https://i.pravatar.cc/100?img=12",
  };

  return (
    <div className="w-64 hidden md:flex flex-col border-r border-white/10 p-5 gap-6 
    bg-gradient-to-b from-black/60 to-black/30 backdrop-blur-2xl">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          <Music className="w-5 h-5 text-violet-400" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-white font-semibold text-lg">MusicFlow</span>
          <span className="text-xs text-zinc-500">Music Player</span>
        </div>
      </div>

      {/* NAV */}
      <div className="flex flex-col gap-2 px-2">
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">
          Library
        </p>

        <SidebarItem icon={<ListMusic />} label="Playlists" />
        <SidebarItem icon={<Clock />} label="Recentes" />
        <SidebarItem icon={<Heart />} label="Favoritos" />
      </div>

      {/* PLAYLISTS */}
      <div className="flex flex-col gap-2 px-2">
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">
          Playlists
        </p>

        {["Chill Vibes", "Focus Flow", "Night Drive"].map((p) => (
          <button
            key={p}
            className="text-left px-3 py-2 rounded-xl text-sm text-zinc-400 
            hover:text-white hover:bg-violet-500/10 hover:text-violet-300 transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-auto px-2 flex flex-col gap-2">

        {/* USER */}
        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center gap-3 p-2 rounded-xl 
            hover:bg-violet-500/10 hover:text-violet-300 transition border border-transparent hover:border-white/10"
          >
            {/* AVATAR GENÉRICO */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/40 to-fuchsia-500/30 flex items-center justify-center border border-white/10">
              <User className="w-4 h-4 text-white/80" />
            </div>

            <div className="flex flex-col text-left leading-tight">
              <span className="text-sm text-white">
                {isLogged ? user.name : "Guest"}
              </span>
              <span className="text-xs text-zinc-500">
                {isLogged ? "Online" : "Not logged in"}
              </span>
            </div>
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute bottom-14 left-2 w-[220px] rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl p-2 shadow-xl">

              {!isLogged ? (
                <button
                  onClick={() => {
                    setIsLogged(true);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLogged(false);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logoff
                </button>
              )}

            </div>
          )}
        </div>

        {/* DIVISOR */}
        <div className="border-t border-white/10 pt-2">

          {/* DONATION (SEPARADO MESMO) */}
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl 
            text-xs text-zinc-400 hover:text-violet-300 hover:bg-violet-500/10 hover:text-violet-300 transition border border-transparent hover:border-white/10"
          >
            <Coffee className="w-3.5 h-3.5 text-violet-300" />
            Me pague um café
          </button>

        </div>

      </div>
    </div>
  );
}

/* ITEM */
function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition items-center",
        "text-zinc-400 hover:text-violet-300",
        "hover:bg-violet-500/10 border border-transparent hover:border-violet-500/20"
      )}
    >
      <span className="w-4 h-4 flex items-center justify-center opacity-80">
        {icon}
      </span>
      {label}
    </button>
  );
}