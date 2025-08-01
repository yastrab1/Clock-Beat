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
ID = querySongOnYTMusic(trackName)
beats = queryBackendForBeats(ID)

while running:
    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            running = False
    
    win.fill((0,0,0))   
    pygame.display.flip()
    arduino.write(b"1\n")
    time.sleep(0.2)
    arduino.write(b"2\n")
    time.sleep(0.2)
    arduino.write(b"3\n")
    time.sleep(0.2)

