import { parseLRC } from "./lrc";

function cleanTrackName(
  track: string
) {
  let cleaned = track;

  console.log(
    "[LYRICS] Raw Track:",
    cleaned
  );

  /* PIPE
     Ex:
     Foo Bar | Artist - Music
     => Artist - Music
  */
  if (cleaned.includes("|")) {
    const parts =
      cleaned.split("|");

    cleaned =
      parts[parts.length - 1];

    console.log(
      "[LYRICS] After PIPE:",
      cleaned
    );
  }

  cleaned = cleaned
    /* remove (...) */
    .replace(/\(.*?\)/g, "")

    /* remove [...] */
    .replace(/\[.*?\]/g, "")

    /* remove feat */
    .replace(
      /feat\.?.*/gi,
      ""
    )

    /* remove ft */
    .replace(/ft\.?.*/gi, "")

    /* remove official */
    .replace(
      /official.*/gi,
      ""
    )

    /* remove lyric */
    .replace(/lyrics?.*/gi, "")

    /* remove live */
    .replace(/live.*/gi, "")

    /* remove session */
    .replace(
      /session.*/gi,
      ""
    )

    /* remove remaster */
    .replace(
      /remaster.*/gi,
      ""
    )

    /* remove visualizer */
    .replace(
      /visualizer.*/gi,
      ""
    )

    /* remove audio */
    .replace(/audio.*/gi, "")

    /* remove hd */
    .replace(/hd.*/gi, "")

    /* remove mv */
    .replace(/mv.*/gi, "")

    /* remove karaoke */
    .replace(
      /karaoke.*/gi,
      ""
    )

    /* remove version */
    .replace(
      /version.*/gi,
      ""
    )

    /* remove extra spaces */
    .replace(/\s+/g, " ")

    .trim();

  console.log(
    "[LYRICS] Final Cleaned:",
    cleaned
  );

  return cleaned;
}

function similarity(
  a: string,
  b: string
) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  if (a === b) return 999;

  let score = 0;

  const aWords = a.split(" ");
  const bWords = b.split(" ");

  for (const word of aWords) {
    if (bWords.includes(word)) {
      score++;
    }
  }

  return score;
}

export async function getLyrics(
  artist: string,
  track: string,
  lyricsFromSearch: boolean = false
) {
  try {
    /* SEARCH MODE */
    if (lyricsFromSearch) {
      const cleanedTrack =
        cleanTrackName(track);

      const url =
        `https://lrclib.net/api/search?track_name=${encodeURIComponent(cleanedTrack)}`;

      console.log(
        "[LYRICS] =========================="
      );

      console.log(
        "[LYRICS] SEARCH MODE"
      );

      console.log(
        "[LYRICS] Original Track:",
        track
      );

      console.log(
        "[LYRICS] Cleaned Track:",
        cleanedTrack
      );

      console.log(
        "[LYRICS] Request URL:",
        url
      );

      const res = await fetch(url);

      console.log(
        "[LYRICS] Response Status:",
        res.status
      );

      if (!res.ok) {
        console.log(
          "[LYRICS] Request Failed"
        );

        return [];
      }

      const data = await res.json();

      console.log(
        "[LYRICS] Results Count:",
        Array.isArray(data)
          ? data.length
          : 0
      );

      console.log(
        "[LYRICS] Raw Results:",
        data
      );

      if (!Array.isArray(data)) {
        console.log(
          "[LYRICS] Invalid response format"
        );

        return [];
      }

      if (!data.length) {
        console.log(
          "[LYRICS] No results found"
        );

        return [];
      }

      /* BEST MATCH */
      const sorted = data.sort(
        (a, b) => {
          const scoreA =
            similarity(
              cleanedTrack,
              a.trackName || ""
            );

          const scoreB =
            similarity(
              cleanedTrack,
              b.trackName || ""
            );

          return scoreB - scoreA;
        }
      );

      console.log(
        "[LYRICS] Sorted Results:",
        sorted.map((item) => ({
          track:
            item.trackName,
          artist:
            item.artistName,
          score: similarity(
            cleanedTrack,
            item.trackName || ""
          ),
        }))
      );

      const best = sorted[0];

      console.log(
        "[LYRICS] Best Match:",
        best
      );

      if (!best?.syncedLyrics) {
        console.log(
          "[LYRICS] Best match has no synced lyrics"
        );

        return [];
      }

      console.log(
        "[LYRICS] Synced lyrics found"
      );

      console.log(
        "[LYRICS] =========================="
      );

      return parseLRC(
        best.syncedLyrics
      );
    }

    /* NORMAL MODE */
    const url =
      `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`;

    console.log(
      "[LYRICS] =========================="
    );

    console.log(
      "[LYRICS] NORMAL MODE"
    );

    console.log(
      "[LYRICS] Artist:",
      artist
    );

    console.log(
      "[LYRICS] Track:",
      track
    );

    console.log(
      "[LYRICS] Request URL:",
      url
    );

    const res = await fetch(url);

    console.log(
      "[LYRICS] Response Status:",
      res.status
    );

    if (!res.ok) {
      console.log(
        "[LYRICS] Request Failed"
      );

      return [];
    }

    const data = await res.json();

    console.log(
      "[LYRICS] Response Data:",
      data
    );

    if (!data.syncedLyrics) {
      console.log(
        "[LYRICS] No synced lyrics"
      );

      return [];
    }

    console.log(
      "[LYRICS] Synced lyrics found"
    );

    console.log(
      "[LYRICS] =========================="
    );

    return parseLRC(
      data.syncedLyrics
    );
  } catch (err) {
    console.error(
      "[LYRICS ERROR]",
      err
    );

    return [];
  }
}