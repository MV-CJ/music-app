import yt_dlp
import traceback
from fastapi import HTTPException

PAGE_SIZE = 20
MAX_RESULTS = 100


def is_music_video(e):
    title = (e.get("title") or "").lower()

    blocked = ["podcast", "interview", "live", "full album", "mix"]
    return not any(b in title for b in blocked)


def search_youtube(query: str, page: int = 1, music_mode: bool = False):
    if page < 1:
        page = 1

    if music_mode:
        query = f"{query} official audio"

    with yt_dlp.YoutubeDL({"quiet": True, "extract_flat": True}) as ydl:
        data = ydl.extract_info(f"ytsearch{MAX_RESULTS}:{query}", download=False)

    entries = data.get("entries", [])

    if music_mode:
        entries = [e for e in entries if is_music_video(e)]

    total_pages = (len(entries) + PAGE_SIZE - 1) // PAGE_SIZE

    if page > total_pages:
        page = total_pages if total_pages > 0 else 1

    start = (page - 1) * PAGE_SIZE
    end = start + PAGE_SIZE

    results = [
        {
            "title": e.get("title"),
            "video_id": e.get("id"),
            "thumbnail": f"https://i.ytimg.com/vi/{e.get('id')}/hqdefault.jpg",
            "duration": e.get("duration"),
            "channel": e.get("uploader") or e.get("channel"),
        }
        for e in entries[start:end]
        if e.get("id")
    ]

    return {
        "current_page": page,
        "per_page": PAGE_SIZE,
        "total_pages": total_pages,
        "data": results,
    }


def stream(query: str):
    try:
        ydl_opts = {
            "quiet": True,
            "format": "best[ext=mp4][height<=720]/best",
            "noplaylist": True,
        }

        # detectar tipo
        if "youtube.com" in query or "youtu.be" in query:
            url = query
        elif len(query) == 11 and " " not in query:
            url = f"https://www.youtube.com/watch?v={query}"
        else:
            # fallback search
            with yt_dlp.YoutubeDL({"quiet": True, "extract_flat": True}) as ydl:
                data = ydl.extract_info(f"ytsearch1:{query}", download=False)

            entries = data.get("entries") or []
            if not entries:
                raise Exception("Nenhum resultado encontrado")

            video_id = entries[0].get("id")
            url = f"https://www.youtube.com/watch?v={video_id}"

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        stream_url = info.get("url")

        if not stream_url:
            for f in reversed(info.get("formats", [])):
                if f.get("url"):
                    stream_url = f["url"]
                    break

        if not stream_url:
            raise Exception("Stream não encontrado")

        return {
            "stream_url": stream_url,
            "title": info.get("title"),
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))