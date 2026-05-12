import requests
from fastapi import HTTPException
import time
import threading

from modules.yt_hook import get_artist_image

import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("LASTFM_API_KEY")
BASE_URL = os.getenv("LASTFM_BASE_URL")

CACHE = {}
CACHE_TTL = 60 * 5  # 5 minutos


# =========================================================
# CACHE
# =========================================================
def get_cache(key):
    item = CACHE.get(key)

    if not item:
        return None

    if time.time() - item["time"] > CACHE_TTL:
        return None

    return item["data"]


def set_cache(key, data):
    CACHE[key] = {
        "data": data,
        "time": time.time()
    }


# =========================================================
# PREFETCH
# =========================================================
def prefetch_next_page(page, limit):
    try:
        next_page = page + 1
        key = f"top:{next_page}:{limit}"

        if get_cache(key):
            return

        data = fetch_lastfm(
            "chart.getTopTracks",
            {
                "page": str(next_page),
                "limit": str(limit)
            }
        )

        processed = process_tracks(
            data,
            next_page,
            limit
        )

        set_cache(key, processed)

    except:
        pass


# =========================================================
# PROCESS TRACKS
# =========================================================
def process_tracks(data, page, limit):
    tracks_raw = data.get(
        "tracks",
        {}
    ).get("track", [])

    attr = data.get(
        "tracks",
        {}
    ).get("@attr", {})

    total = (
        int(attr.get("total", 0))
        if attr.get("total")
        else 1000
    )

    total_pages = max(
        1,
        (total + limit - 1) // limit
    )

    if isinstance(tracks_raw, dict):
        tracks_raw = [tracks_raw]

    result = []

    for index, t in enumerate(tracks_raw):

        artist_name = (
            t.get("artist", {})
            .get("name", "")
        )

        result.append(
            {
                "rank": index + 1 + ((page - 1) * limit),

                "name": t.get("name", ""),

                "artist": artist_name,

                "playcount": int(
                    t.get("playcount", 0)
                ),

                "listeners": int(
                    t.get("listeners", 0)
                ),

                # capa da música
                "image": extract_image(t),

                # 🔥 imagem do artista
                "artist_image": get_artist_image(
                    artist_name
                ),

                "yt_search": (
                    f"{t.get('name', '')} "
                    f"{artist_name}"
                )
            }
        )

    return {
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "data": result
    }


# =========================================================
# FETCH LASTFM
# =========================================================
def fetch_lastfm(
    method: str,
    params: dict | None = None
):
    try:
        if params is None:
            params = {}

        params.update(
            {
                "method": method,
                "api_key": API_KEY,
                "format": "json"
            }
        )

        res = requests.get(
            BASE_URL,
            params=params,
            timeout=5
        )

        if res.status_code != 200:
            raise Exception(
                f"Status {res.status_code}"
            )

        data = res.json()

        if "error" in data:
            raise Exception(
                data.get("message")
            )

        return data

    except Exception as e:
        print("🔥 ERRO LASTFM:", e)
        raise


# =========================================================
# EXTRACT IMAGE
# =========================================================
def extract_image(track):
    images = track.get("image", [])

    for size in [
        "extralarge",
        "large",
        "medium"
    ]:
        for img in images:
            if (
                img.get("size") == size
                and img.get("#text")
            ):
                url = img["#text"]

                return (
                    "https:" + url
                    if url.startswith("//")
                    else url
                )

    return ""


# =========================================================
# NORMALIZE
# =========================================================
def normalize_tracks(raw):
    if isinstance(raw, dict):
        return [raw]

    return raw or []


# =========================================================
# TOP TRACK
# =========================================================
def get_top_track():
    data = fetch_lastfm(
        "chart.getTopTracks",
        {"limit": "1"}
    )

    tracks = normalize_tracks(
        data.get("tracks", {})
        .get("track")
    )

    if not tracks:
        return None

    t = tracks[0]

    artist_name = (
        t.get("artist", {})
        .get("name", "")
    )

    return {
        "name": t.get("name", ""),
        "artist": artist_name,

        # 🔥 imagem artista
        "artist_image": get_artist_image(
            artist_name
        ),

        "yt_search": (
            f"{t.get('name', '')} "
            f"{artist_name}"
        )
    }


# =========================================================
# TOP TRACKS
# =========================================================
def get_top_tracks(
    page: int = 1,
    limit: int = 12
):
    key = f"top:{page}:{limit}"

    # cache
    cached = get_cache(key)

    if cached:
        return cached

    try:
        data = fetch_lastfm(
            "chart.getTopTracks",
            {
                "page": str(page),
                "limit": str(limit)
            }
        )

        processed = process_tracks(
            data,
            page,
            limit
        )

        set_cache(key, processed)

        # prefetch próxima página
        threading.Thread(
            target=prefetch_next_page,
            args=(page, limit),
            daemon=True
        ).start()

        return processed

    except Exception:

        if cached:
            return cached

        raise HTTPException(
            status_code=500,
            detail=(
                "Erro ao buscar dados "
                "e sem cache disponível"
            )
        )