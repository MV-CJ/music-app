export type LyricLine = {
  time: number;
  text: string;
};

export function parseLRC(lrc: string): LyricLine[] {
  if (!lrc) return [];

  const lines = lrc.split("\n");

  return lines
    .map((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);

      if (!match) return null;

      const minutes = Number(match[1]);
      const seconds = Number(match[2]);

      return {
        time: minutes * 60 + seconds,
        text: match[3].trim(),
      };
    })
    .filter(Boolean) as LyricLine[];
}