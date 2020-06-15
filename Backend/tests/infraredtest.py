from RPi import GPIO as io
import time
import board
import adafruit_ws2801
import random
import colorsys
import subprocess

leds = adafruit_ws2801.WS2801(board.SCLK, board.MOSI, 32)
pir = 14
monitor_status = 0

def setup():
    io.setmode(io.BCM)
    io.setup(pir, io.IN, io.PUD_DOWN)
    print("Sensor initializing . . .")
    time.sleep(2)  # Give sensor time to startup
    print("Active")

counter = 0


def hsv2rgb(h, s, v):
    return tuple(round(i * 255) for i in colorsys.hsv_to_rgb(h, s, v))

def random_color():
    return random.randrange(0, 7) * 32

def turn_on():
    subprocess.call("sh display_on.sh", shell=True)

def turn_off():
    subprocess.call("sh display_off.sh", shell=True)

try:
    setup()
    while True:
        if io.input(pir) == True:  # If PIR pin goes high, motion is detected
            counter += 1
            print("Motion Detected!", counter)
            leds.fill((0, 0, 0x80))
            # if not monitor_status:
            #     turn_on()
            #     monitor_status = 1
            time.sleep(0.01)
        else:
            leds.fill((0, 0, 0))
            # if monitor_status:
            #     turn_off()
            #     monitor_status = 0
        
except KeyboardInterrupt:  # Ctrl+c
    pass  # Do nothing, continue to finally
finally:
    leds.fill((0, 0, 0))
    io.cleanup()  # reset all io
    print("Program ended")
