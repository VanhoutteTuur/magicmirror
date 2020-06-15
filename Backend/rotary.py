#pylint: skip-file
from RPi import GPIO as io
import board
import time
import busio
import adafruit_max9744
import os
from repositories.DataRepository import DataRepository

# Class for the rotary encoder: 
# It changes the volume of the max9744 amplifier.
class Rotary:
    def __init__(self, clk=23, dt=24, sw=25):
        self.dt = dt
        self.clk = clk
        self.sw = sw

        # variables needed to make the rotary encoder work
        self.clkLastState = 0
        self.counter = 0
        self.switchState = 0

        # setup gpio pins, event callbacks
        self.setup_pins()

        # Initialize I2C bus.
        i2c = busio.I2C(board.SCL, board.SDA)
        # Initialize amplifier.
        self.__amp = adafruit_max9744.MAX9744(i2c)
        self.__amp.volume = 0
        self.__volume = 0


    def setup_pins(self):
        # setups
        io.setmode(io.BCM)
        io.setup(self.dt, io.IN, pull_up_down=io.PUD_UP)
        io.setup(self.clk, io.IN, pull_up_down=io.PUD_UP)
        io.setup(self.sw, io.IN, pull_up_down=io.PUD_UP)

        #event callbacks
        io.add_event_detect(self.clk, io.BOTH, self.rotation_decode, 1)
        io.add_event_detect(self.sw, io.FALLING, self.pushed, 200)

    @property
    def volume(self):
        return self.__volume

    @volume.setter
    def volume(self, value):
        self.__volume = value
        self.__amp.volume = value


    def rotation_decode(self, pin):
        dt_value = io.input(self.dt)
        clk_value = io.input(self.clk)
        
        if clk_value != self.clkLastState and clk_value == False:
            if dt_value != clk_value:
                self.volume_up()
            else:
                self.volume_down()
            print(self.volume)
        self.clkLastState = clk_value

    def pushed(self, sw):
        print("Druk")
        os.system("killall omxplayer.bin")
        DataRepository.remove_all_timers()
        

    def volume_up(self):
        if self.__volume < 63:
            self.volume += 1

    def volume_down(self):
        if self.__volume > 0:
            self.volume -= 1

    def stop(self):
        self.volume = 0


if __name__ == "__main__":
    rotary = Rotary(23, 24, 25)
    try:
        while True:
            time.sleep(0.1) # this line is important, if it isn't included the rotary encoder will read wrong values
    except KeyboardInterrupt:
        pass
    finally:
        rotary.stop()
