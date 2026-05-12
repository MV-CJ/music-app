"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";

interface Props {
  query: string;
  setQuery: (v: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export function SearchBar({
  query,
  setQuery,
  onSearch,
  loading,
}: Props) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl flex items-center gap-2 px-4 py-2",
        theme.colors.panel,
        theme.colors.border,
        theme.radius.xl,
        theme.effects.glass
      )}
    >
      <Search className="w-4 h-4 text-zinc-400 shrink-0" />

      <Input
        className="border-none bg-transparent focus-visible:ring-0"
        placeholder="Buscar música..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />

      {/* limpar busca */}
      {query && !loading && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => setQuery("")}
          className="shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      <Button
        onClick={onSearch}
        disabled={loading || !query.trim()}
        className="shrink-0"
      >
        {loading ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          "Explorar"
        )}
      </Button>
    </div>
  );
}