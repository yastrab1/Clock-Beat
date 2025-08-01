import time
import pygame
import serial
import spotify
from spotify import querySongOnYTMusic, queryBackendForBeats

SERIAL_PORT = '/dev/ttyACM0'
arduino = serial.Serial(SERIAL_PORT,9600,timeout=1)

win = pygame.display.set_mode()
running = True
token = spotify.get_token()
print(f"{token} is my token in the main")
track = spotify.get_current_track(token)
trackName = track['item']['name']
progressTime = int(track["progress_ms"])/1000
requestTime = time.time()

processedBeats = []

ID = querySongOnYTMusic(trackName)
beats = queryBackendForBeats(ID)

for beat in beats:
    processedBeats.append(beat-requestTime-progressTime)

print(time.time(),requestTime,progressTime,processedBeats)
for i in range(0,len(processedBeats)-1):
    relativeTime = time.time() + processedBeats[i]
    if relativeTime < 0:
        print(relativeTime)
        continue
    print("sleeping for ",relativeTime )
    time.sleep(relativeTime)
    arduino.write(b'2\n')
    print("beat")




