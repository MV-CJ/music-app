from fastapi import FastAPI
from modules.yt_hook import search_youtube, stream
from modules.lastfm import get_top_track, get_top_tracks
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # depois a gente restringe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Parabens a todos os envolvidos!"}

@app.get("/life_check")
def root():
    return {"status": "ok"}

@app.get("/search")
def search(query: str, page: int = 1, music_mode: bool = False):
    return search_youtube(query, page, music_mode)

@app.get("/stream")
def stream_route(url: str):
    return stream(url)


# 🎧 LASTFM
@app.get("/lastfm/top-track")
def top_track():
    return get_top_track()


@app.get("/lastfm/top-tracks")
def top_tracks(page: int = 1, limit: int = 12):
    return get_top_tracks(page, limit)