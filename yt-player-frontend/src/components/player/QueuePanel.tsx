"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/store/usePlayerStore";

export function QueuePanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    queue,
    currentIndex,
    selectFromQueue,
    removeFromQueue,
  } = usePlayerStore();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="
            fixed bottom-24 right-6 w-80
            bg-zinc-900 border border-white/10
            rounded-xl p-3 max-h-72 overflow-auto z-50
            shadow-2xl
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-white">Fila</p>

            <button onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          {/* EMPTY */}
          {queue.length === 0 ? (
            <p className="text-xs text-zinc-400">Fila vazia</p>
          ) : (
            queue.map((item, index) => {
              const isActive = index === currentIndex;

              return (
                <div
                  key={item.video_id + index}
                  onClick={() => selectFromQueue(item)}
                  className={`
                    flex items-center justify-between gap-2 p-2 rounded-lg
                    cursor-pointer hover:bg-zinc-800
                    ${isActive ? "bg-zinc-800/80" : ""}
                  `}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src={item.thumbnail}
                      className="w-10 h-10 rounded object-cover"
                    />

                    <p className="text-xs text-white line-clamp-1">
                      {item.title}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(item);
                    }}
                    className="text-red-500 hover:text-red-400 px-2"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}