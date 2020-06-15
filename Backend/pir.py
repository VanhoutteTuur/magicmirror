#pylint: skip-file
from RPi import GPIO as io
import time

class PIR:
    def __init__(self, pin):
        self.pin = pin
        io.setmode(io.BCM)
        io.setup(self.pin, io.IN, io.PUD_DOWN)
        print("PIR initializing . . .")
        time.sleep(1)  # Give sensor time to startup
        print("PIR Active")

    def read(self):
        # If PIR pin outputs high, motion is detected
        return io.input(self.pin)
