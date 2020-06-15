# Simple demo of the MAX9744 20W class D amplifier I2C control.
# This show how to set the volume of the amplifier.
# Author: Tony DiCola
#pylint: skip-file
from RPi import GPIO as io
import board
import time
import busio
import adafruit_max9744

io.setmode(io.BCM)
# io.setup(13, io.OUT)
# io.setup(23, io.IN, pull_up_down=io.PUD_UP)
# io.setup(24, io.IN, pull_up_down=io.PUD_UP)


# def up(pin):
#     for i in range(5):
#         amp.volume_up()
#     print("volume up")


# def down(pin):
#     for i in range(5):
#         amp.volume_down()
#     print("volume up")

# io.add_event_detect(23, io.FALLING, up, bouncetime=200)
# io.add_event_detect(24, io.FALLING, down, bouncetime=200)




# Initialize I2C bus.
i2c = busio.I2C(board.SCL, board.SDA)

# Initialize amplifier.
amp = adafruit_max9744.MAX9744(i2c)
# Optionally you can specify a different addres if you override the AD1, AD2
# pins to change the address.
# amp = adafruit_max9744.MAX9744(i2c, address=0x49)

# Setting the volume is as easy as writing to the volume property (note
# you cannot read the property so keep track of volume in your own code if
# you need it).
amp.volume = 0  # Volume is a value from 0 to 63 where 0 is muted/off and
# 63 is maximum volume.

# In addition you can call a function to instruct the amp to move up or down
# a single volume level.  This is handy if you just have up/down buttons in
# your project for volume:
# amp.volume_up()  # Increase volume by one level.

# amp.volume_down()  # Decrease volume by one level.



