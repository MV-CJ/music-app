import { parseLRC } from "./lrc";

export async function getLyrics(
  artist: string,
  track: string
) {
  try {
    const url =
      `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`;

    const res = await fetch(url);

    if (!res.ok) return [];

    const data = await res.json();

    if (!data.syncedLyrics) return [];

    return parseLRC(data.syncedLyrics);
  } catch {
    return [];
  }
}