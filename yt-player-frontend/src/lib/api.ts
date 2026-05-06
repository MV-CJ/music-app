const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ---------------- SEARCH ---------------- */
export async function searchMusic(query: string, musicMode = true) {
  const res = await fetch(
    `${API}/search?query=${encodeURIComponent(query)}&music_mode=${musicMode}`
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Erro backend:", text);
    throw new Error("Erro na API");
  }

  return res.json();
}

/* ---------------- STREAM ---------------- */
export async function getStream(url: string) {
  const res = await fetch(
    `${API}/stream?url=${encodeURIComponent(url)}`
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Erro backend:", text);
    throw new Error("Erro na API");
  }

  const data = await res.json();
  return data.stream_url;
}

/* ---------------- LASTFM ---------------- */
export async function getTopTracks(page = 1, limit = 12) {
  const res = await fetch(
    `${API}/lastfm/top-tracks?page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Erro backend:", text);
    throw new Error("Erro ao buscar top tracks");
  }

  const data = await res.json();

  return data.data; // 🔥 já retorna direto array
}

export async function getTopTrack() {
  const res = await fetch(`${API}/lastfm/top-track`);

  if (!res.ok) {
    const text = await res.text();
    console.error("Erro backend:", text);
    throw new Error("Erro ao buscar top track");
  }

  return res.json();
}