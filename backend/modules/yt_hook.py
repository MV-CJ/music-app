import yt_dlp
import traceback
import requests

from fastapi import HTTPException

PAGE_SIZE = 20
MAX_RESULTS = 100

ARTIST_IMAGE_CACHE = {}


# =========================================================
# CLEAN ARTIST NAME
# =========================================================
def clean_artist_name(name: str) -> str:
    if not name:
        return ""

    remove_words = [
        "- Topic",
        "VEVO",
        "Official",
        "Official Audio",
        "Official Video",
        "Records",
    ]

    for word in remove_words:
        name = name.replace(word, "")

    return name.strip()


# =========================================================
# DEEZER ARTIST IMAGE
# =========================================================
def get_artist_image(
    artist_name: str
) -> str:

    if not artist_name:
        return ""

    artist_name = clean_artist_name(
        artist_name
    )

    if artist_name in ARTIST_IMAGE_CACHE:
        return ARTIST_IMAGE_CACHE[
            artist_name
        ]

    try:
        response = requests.get(
            "https://api.deezer.com/search/artist",
            params={
                "q": artist_name
            },
            timeout=5,
        )

        data = response.json()

        results = data.get(
            "data",
            []
        )

        if results:
            artist = results[0]

            image = (
                artist.get("picture_xl")
                or artist.get("picture_big")
                or artist.get("picture_medium")
                or artist.get("picture")
                or ""
            )

            if image:
                ARTIST_IMAGE_CACHE[
                    artist_name
                ] = image

            return image

    except Exception:
        traceback.print_exc()

    return ""


# =========================================================
# FILTER MUSIC
# =========================================================
def is_music_video(e):
    title = (
        e.get("title") or ""
    ).lower()

    blocked = [
        "podcast",
        "interview",
        "live",
        "full album",
        "mix",
    ]

    return not any(
        b in title for b in blocked
    )


# =========================================================
# SEARCH
# =========================================================
def search_youtube(
    query: str,
    page: int = 1,
    music_mode: bool = False,
):
    if page < 1:
        page = 1

    if music_mode:
        query = (
            f"{query} official audio"
        )

    with yt_dlp.YoutubeDL(
        {
            "quiet": True,
            "extract_flat": True,
        }
    ) as ydl:

        data = ydl.extract_info(
            f"ytsearch{MAX_RESULTS}:{query}",
            download=False,
        )

    entries = data.get(
        "entries",
        []
    )

    if music_mode:
        entries = [
            e for e in entries
            if is_music_video(e)
        ]

    total_pages = (
        len(entries)
        + PAGE_SIZE
        - 1
    ) // PAGE_SIZE

    if page > total_pages:
        page = (
            total_pages
            if total_pages > 0
            else 1
        )

    start = (
        (page - 1)
        * PAGE_SIZE
    )

    end = start + PAGE_SIZE

    results = []

    for e in entries[start:end]:

        if not e.get("id"):
            continue

        channel = (
            e.get("uploader")
            or e.get("channel")
            or ""
        )

        artist_image = (
            get_artist_image(channel)
        )

        results.append(
            {
                "title": e.get("title"),
                "video_id": e.get("id"),
                "thumbnail": (
                    f"https://i.ytimg.com/vi/"
                    f"{e.get('id')}/hqdefault.jpg"
                ),

                "artist_image": artist_image,
                "duration": e.get("duration"),
                "channel": channel,
                "artist": clean_artist_name(channel)
            }
        )

    return {
        "current_page": page,
        "per_page": PAGE_SIZE,
        "total_pages": total_pages,
        "data": results,
    }


# =========================================================
# STREAM
# =========================================================
def stream(query: str):
    try:
        ydl_opts = {
            "quiet": True,
            "format": (
                "best[ext=mp4][height<=720]/best"
            ),
            "noplaylist": True,
        }

        if (
            "youtube.com" in query
            or "youtu.be" in query
        ):
            url = query

        elif (
            len(query) == 11
            and " " not in query
        ):
            url = (
                "https://www.youtube.com/watch?v="
                f"{query}"
            )

        else:
            with yt_dlp.YoutubeDL(
                {
                    "quiet": True,
                    "extract_flat": True,
                }
            ) as ydl:

                data = ydl.extract_info(
                    f"ytsearch1:{query}",
                    download=False,
                )

            entries = (
                data.get("entries")
                or []
            )

            if not entries:
                raise Exception(
                    "Nenhum resultado encontrado"
                )

            video_id = (
                entries[0].get("id")
            )

            url = (
                "https://www.youtube.com/watch?v="
                f"{video_id}"
            )

        with yt_dlp.YoutubeDL(
            ydl_opts
        ) as ydl:

            info = ydl.extract_info(
                url,
                download=False,
            )

        stream_url = info.get("url")

        if not stream_url:

            for f in reversed(
                info.get("formats", [])
            ):

                if f.get("url"):
                    stream_url = f["url"]
                    break

        if not stream_url:
            raise Exception(
                "Stream não encontrado"
            )

        return {
            "stream_url": stream_url,
            "title": info.get("title"),
        }

    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )