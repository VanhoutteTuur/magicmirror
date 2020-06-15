import board
import colorsys
import random
import time
import adafruit_ws2801
from RPi import GPIO as io


class Ledstrip:
    def __init__(self, led_amount=32):
        self.led_amount = led_amount
        self.leds = adafruit_ws2801.WS2801(
            board.SCLK, board.MOSI, self.led_amount)
        self.leds.fill((0, 0, 0))

    # input: HSV color values
    # output: the corresponding RGB values, in a tuple, so it's usable for the leds class
    @staticmethod
    def hsv2rgb(h, s, v):
        return tuple(round(i * 255) for i in colorsys.hsv_to_rgb(h, s, v))

    @staticmethod
    def string2rgb(string):
        r = int(string[0:2], 16)
        g = int(string[2:4], 16)
        b = int(string[4:6], 16)
        return [r, g, b]



    # set all leds to this color
    def set_color(self, r, g, b):
        # adafruit's library uses r,b,g for some reason
        self.leds.fill((r, b, g))

    # a cool effect
    # it goes over the whole color spectrum
    def led_effect(self):
        for i in range(self.led_amount):
            self.leds[i] = self.hsv2rgb(i/self.led_amount, 1, 1)
            time.sleep(0.02)

        for i in range(self.led_amount - 1, -1, -1):
            self.leds[i] = (0, 0, 0)
            time.sleep(0.02)

    def off(self):
        self.leds.fill((0, 0, 0))

    # turn all leds off
    def stop(self):
        self.off()
        self.leds.deinit()
