import os
import threading
import time
import webbrowser
import dotenv

dotenv.load_dotenv()
SPOTIFY_CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
SPOTIFY_CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
SPOTIFY_REDIRECT_HOST = os.environ['SPOTIFY_REDIRECT_HOST']
SPOTIFY_REDIRECT_URI_ROUTE = os.environ['SPOTIFY_REDIRECT_URI_ROUTE']
SERPAPI_KEY = os.environ['SERPAPI_KEY']
BACKEND_URL = os.environ['BACKEND_URL']

from binascii import Error
from http.server import BaseHTTPRequestHandler,HTTPServer
from urllib.parse import urlparse,parse_qs
import random
import requests
def get_token():
    token_container = {"token":""} #Possible improvement with TokenHTTPServer wrapper(with parameter token) 
    
    class TokenWebServer(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path == "/login":
                self.login()
            if self.path.startswith("/spotifyauth"):
                self.spotifyauth()
        def login(self):
            self.send_response(301)
            scope="user-read-currently-playing+user-read-private+user-read-email"
            state = random.randint(1,1000000)
            query = (f"https://accounts.spotify.com/authorize",
                     f"?response_type=code",
                    f"&client_id={SPOTIFY_CLIENT_ID}",
                    f"&scope={scope}",
                    f"&redirect_uri={SPOTIFY_REDIRECT_HOST}{SPOTIFY_REDIRECT_URI_ROUTE}",
                    f"&state={state}")
            query = "".join(query)

            self.send_header("Location",query)
            self.end_headers()
            self.wfile.write(bytes("Redirecting, if not working something has gone horribly wrong :)", encoding="utf-8"))
            self.wfile.flush()
        def spotifyauth(self): 
            parsed_url = urlparse(self.path)
            parsed_query = parse_qs(parsed_url.query)
            code = parsed_query.get("code",[""])[0]
            response = requests.post(
                "https://accounts.spotify.com/api/token",
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": f"{SPOTIFY_REDIRECT_HOST}{SPOTIFY_REDIRECT_URI_ROUTE}",
                    "client_id": SPOTIFY_CLIENT_ID,
                    "client_secret": SPOTIFY_CLIENT_SECRET  # You must define this
                },
                headers={
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            )
            token_container["token"] = response.json().get("access_token", "")
            print(code)
            self.wfile.write(bytes("Auth successful, you can close this now :)",encoding="utf-8"))

            # Shutdown the server in a separate thread to avoid blocking
            threading.Thread(target=self.server.shutdown, daemon=True).start()

    httpd = HTTPServer(('localhost',3000),TokenWebServer)
    def openBrowserWindow():
        time.sleep(3)
        webbrowser.open("http://localhost:3000/login")
    threading.Thread(target=openBrowserWindow).start()
    httpd.serve_forever()
    token = token_container["token"]
    print(f"successful shutdown of server {token}")
    if token == "":
        raise Error("Failed to get spotify token")
    return token

def get_current_track(token):
    query = f"https://api.spotify.com/v1/me/player/currently-playing"
    return requests.get(query,headers={
        "Authorization":f'Bearer {token}'
    }).json()

def querySongOnYTMusic(track):
    query = f"https://serpapi.com/search?engine=youtube&search_query={track}&api_key={SERPAPI_KEY}"
    link = requests.get(query).json()['video_results'][0]['link']
    ID = link.split('=')[1]
    return ID

def queryBackendForBeats(ID):
    response = requests.get(BACKEND_URL+ID).json()
    print(response)
    return response['beatTimestamps']
