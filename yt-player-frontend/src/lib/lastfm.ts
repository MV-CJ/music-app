const API_KEY = "a0cc2b1cbed30a1d7f4db8e10389b1d9";
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export async function fetchLastFM<T>(
  method: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(BASE_URL);
  url.searchParams.append("method", method);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("format", "json");

  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.append(k, v)
  );

  const res = await fetch(url.toString());

  const data = await res.json();

  if (data?.error) {
    throw new Error(data.message || "LastFM error");
  }

  return data;
}

/* ---------------- TOP TRACK ---------------- */

export async function fetchTopTrack() {
  const data = await fetchLastFM<any>("chart.getTopTracks", {
    limit: "1",
  });

  const topTrack = data?.tracks?.track?.[0];

  if (!topTrack) return null;

  return {
    name: topTrack.name,
    artist: topTrack.artist.name,
  };
}

/* ---------------- TRACK TYPE ---------------- */

export type Track = {
  rank: number;
  name: string;
  artist: string;
  playcount: number;
  listeners: number;
  imageUrl: string;
  tags: string[];
};

/* ---------------- TOP 12 ---------------- */

export async function fetchFirst12Tracks(): Promise<Track[]> {
  const data = await fetchLastFM<any>("chart.getTopTracks", {
    limit: "12",
  });

  let tracksRaw = data?.tracks?.track || [];
  if (!Array.isArray(tracksRaw)) tracksRaw = [tracksRaw];

  const tracks: Track[] = tracksRaw.map((t: any, index: number) => {
    let imageUrl = "";

    if (Array.isArray(t.image)) {
      const sizes = ["extralarge", "large", "medium"];

      for (const size of sizes) {
        const img = t.image.find((i: any) => i.size === size);
        if (img?.["#text"]) {
          imageUrl = img["#text"];
          if (imageUrl.startsWith("//")) {
            imageUrl = "https:" + imageUrl;
          }
          break;
        }
      }
    }

    return {
      rank: index + 1,
      name: t.name,
      artist: t.artist.name,
      playcount: parseInt(t.playcount || "0"),
      listeners: parseInt(t.listeners || "0"),
      imageUrl,
      tags: [],
    };
  });

  return tracks;
}

/* ---------------- TRACK TAGS ---------------- */

export async function fetchTrackTags(track: Track) {
  try {
    const info = await fetchLastFM<any>("track.getInfo", {
      artist: track.artist,
      track: track.name,
      autocorrect: "1",
    });

    let tags: string[] = [];

    const raw = info?.track?.toptags?.tag;

    if (raw) {
      const arr = Array.isArray(raw) ? raw : [raw];
      tags = arr.map((t: any) => t.name).filter(Boolean).slice(0, 3);
    }

    return tags;
  } catch {
    return [];
  }
}