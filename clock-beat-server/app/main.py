import os.path

import librosa
from serpapi.youtube_search import YoutubeSearch
from yt_dlp import YoutubeDL
from fastapi import FastAPI

ydl_opts = {
    'format': 'bestaudio/best',
    'outtmpl': 'out',  # Output template
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'cookiefile': './ytcookies.txt',
    'http_headers': {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
    }
}


def librosaProcess():
    y, sr = librosa.load(os.path.abspath("out.mp3"))
    beats = librosa.beat.beat_track(y=y, sr=sr)
    print(beats)
    return {"BPM": beats[0].tolist(), "beatTimestamps": beats[1].tolist()}


def analyzeSongName(ytID):
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([f"https://www.youtube.com/watch?v={ytID}"])

    return librosaProcess()


app = FastAPI()


@app.get("/analyzeSongName/{songID}")
def analyzeSongNameRoute(songID):
    return analyzeSongName(songID)
