const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function searchYouTubeVideo(query: string, musicMode = true) {
  const res = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}&music_mode=${musicMode}&page=1`
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar vídeo no backend");
  }

  const data = await res.json();

  const video = data?.data?.[0];

  if (!video) {
    throw new Error("Nenhum vídeo encontrado");
  }

  return video;
}