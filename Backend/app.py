from rotary import Rotary
from RPi import GPIO as io
from ledstrip import Ledstrip
from pir import PIR
from repositories.DataRepository import DataRepository
from flask import Flask, jsonify, request
# from flask_socketio import SocketIO
from flask_cors import CORS
import json
import threading
import sys
import os
import time
import datetime
import requests
from subprocess import check_output

openweathermap_url = "https://api.openweathermap.org/data/2.5/forecast?q=kortrijk,BE&appid=5ab3cf66921da480525dffd751748008&units=metric&lang=nl"

# rotary encoder
rotary_encoder = Rotary()

# PIR sensor
pir = PIR(14)

# temperature sensor: name of the one-wire bus file
sensor_filename = "/sys/bus/w1/devices/28-0317977998cd/w1_slave"

# ledstrip (32 leds)
ledstrip = Ledstrip(16)

current_user = None

# flask
app = Flask(__name__)
# app.config['SECRET_KEY'] = 'S4cr4tK4y'
CORS(app)
endpoint = '/api/v1'


# main method
def main():
    # thread for current user info
    threading.Thread(target=user_info).start()
    # thread for temperature:
    threading.Thread(target=read_temp_every_min).start()
    # thread for volume:
    threading.Thread(target=read_volume).start()
    # thread for infrared sensor:
    threading.Thread(target=read_pir).start()
    # thread for timers:
    threading.Thread(target=listen_to_timers).start()
    # thread for alarms:
    threading.Thread(target=listen_to_alarms).start()
    # run app
    app.run(debug=False, host='0.0.0.0')



# GET:  Read all temperatures
# POST: Create a new entry in the database


@app.route(endpoint + '/temperature', methods=['GET', 'POST'])
def get_temperature():
    if request.method == 'GET':
        s = DataRepository.read_temperature()
        return jsonify(s), 200
    elif request.method == 'POST':
        gegevens = DataRepository.json_or_formdata(request)
        nieuw_id = DataRepository.create_temp(
            gegevens['value'], gegevens['time'])
        return jsonify(tempid=nieuw_id), 201


# Read the latest temperature out of the database
@app.route(endpoint + '/temperature-now', methods=['GET'])
def get_temperature_now():
    if request.method == 'GET':
        s = DataRepository.read_temperature_current()
        return jsonify(s), 200

# Read the temperatures from the latest x hours out of the database


@app.route(endpoint + '/temperature-<hour>', methods=['GET'])
def get_temperature_last_x(hour):
    if request.method == 'GET':
        s = DataRepository.read_temperature_last_x(hour)
        return jsonify(s), 200


@app.route(endpoint + '/sounds', methods=['GET'])
def get_sounds():
    if request.method == 'GET':
        s = DataRepository.get_sounds()
        return jsonify(s), 200


@app.route(endpoint + '/alarms', methods=['GET'])
def get_alarms():
    if request.method == 'GET':
        s = DataRepository.get_alarms()
        for row in s:
            row['time'] = str(row['time'])
            weekdays = DataRepository.get_alarm_weekdays(row['idalarm'])
            row['weekdays'] = [0, 0, 0, 0, 0, 0, 0]
            for i in range(len(weekdays)):
                day = weekdays[i]['weekday']
                row['weekdays'][day - 1] = 1
        return jsonify(s), 200


@app.route(endpoint + '/alarms', methods=['POST'])
def add_alarm():
    if request.method == 'POST':
        gegevens = DataRepository.json_or_formdata(request)
        data = DataRepository.add_alarm(
            gegevens['idsound'], gegevens['time'], gegevens['enabled'], gegevens['weekdays'])
        print(data)
        return jsonify(id=data), 201


@app.route(endpoint + '/alarms/<alarmid>', methods=['GET', 'PUT', 'DELETE'])
def get_alarm(alarmid):
    if request.method == 'GET':
        s = DataRepository.get_alarm(alarmid)
        s['time'] = str(s['time'])
        weekdays = DataRepository.get_alarm_weekdays(s['idalarm'])
        s['weekdays'] = []
        for i in range(len(weekdays)):
            s['weekdays'].append(weekdays[i]['weekday'] - 1)
        return jsonify(s), 200
    elif request.method == 'PUT':
        gegevens = DataRepository.json_or_formdata(request)
        data = DataRepository.change_alarm(
            gegevens['idalarm'], gegevens['idsound'], gegevens['time'], gegevens['enabled'])
        DataRepository.set_weekdays(gegevens['idalarm'], gegevens['weekdays'])
        print("changing alarm")
        return jsonify(id=data), 200
    elif request.method == 'DELETE':
        s = DataRepository.delete_alarm(alarmid)
        print("deleting alarm")
        return jsonify(s), 200


@app.route(endpoint + '/alarm/<idalarm>/status', methods=['PUT'])
def set_alarm_status(idalarm):
    if request.method == 'PUT':
        gegevens = DataRepository.json_or_formdata(request)
        data = DataRepository.set_enabled(idalarm, gegevens['status'])
        return jsonify(id=idalarm), 200


@app.route(endpoint + '/volume', methods=['GET', 'PUT'])
def volume():
    if request.method == 'GET':
        s = DataRepository.get_volume()
        return jsonify(s), 200
    elif request.method == 'PUT':
        gegevens = DataRepository.json_or_formdata(request)
        data = DataRepository.change_volume(gegevens['volume'])
        change_volume(int(gegevens['volume']))
        return jsonify(id=data), 200


@app.route(endpoint + '/todos', methods=['GET', 'POST'])
def todo():
    if request.method == 'GET':
        s = DataRepository.get_todolist()
        return jsonify(s), 200
    elif request.method == 'POST':
        gegevens = DataRepository.json_or_formdata(request)
        nieuw_id = DataRepository.create_todo(gegevens['todo'])
        return jsonify(id=nieuw_id), 200


@app.route(endpoint + '/todos/<id>', methods=['DELETE'])
def delete_todo(id):
    if request.method == 'DELETE':
        data = DataRepository.delete_todo(id)
        if data > 0:
            return jsonify(status="0", row_count=data), 201
        else:
            return jsonify(status="1", row_count=data), 201

# get the current user id or change the current user


@app.route(endpoint + '/user', methods=['GET', 'PUT'])
def get_current_user():
    if request.method == 'GET':
        s = DataRepository.get_current_user()
        return jsonify(s), 200
    elif request.method == 'PUT':
        gegevens = DataRepository.json_or_formdata(request)
        print(gegevens)
        data = DataRepository.set_user(gegevens['iduser'])
        print("changing current user")
        return jsonify(id=data), 200

# Get all users (GET)


@app.route(endpoint + '/users', methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        s = DataRepository.get_users()
        return jsonify(s), 200
    elif request.method == 'POST':
        gegevens = DataRepository.json_or_formdata(request)
        nieuw_id = DataRepository.create_user(
            gegevens['username'], gegevens['idnewssource'], gegevens['ledcolor'])
        return jsonify(id=nieuw_id), 200


@app.route(endpoint + '/users/<id>', methods=['GET', 'PUT', 'DELETE'])
def user(id):
    if request.method == 'GET':
        s = DataRepository.get_user(id)
        return jsonify(s), 200
    elif request.method == 'PUT':
        gegevens = DataRepository.json_or_formdata(request)
        s = DataRepository.change_user(
            gegevens['iduser'], gegevens['username'], gegevens['newssource'], gegevens['ledcolor'])
        print(s)
        return jsonify(s), 200
    elif request.method == 'DELETE':
        s = DataRepository.delete_user(id)
        return jsonify(s), 200


@app.route(endpoint + '/newssources-current', methods=['GET'])
def get_current_newssource():
    if request.method == 'GET':
        s = DataRepository.get_current_newssource()
        if s != None:
            url = s['rss_url']
            response = requests.get(url)
            if response.status_code == 200:
                return jsonify(response.text), 200
            else:
                print('request failed')
        else:
            return jsonify(-1), 200


@app.route(endpoint + '/newssources', methods=['GET', 'POST'])
def newssources():
    if request.method == 'GET':
        s = DataRepository.get_newssources()
        return jsonify(s), 200
    elif request.method == 'POST':
        gegevens = DataRepository.json_or_formdata(request)
        s = DataRepository.add_newssource(gegevens['id'], gegevens['url'])
        return jsonify(s), 200


@app.route(endpoint + '/newssources/<id>', methods=['PUT', 'DELETE'])
def change_newssource(id):
    if request.method == 'PUT':
        gegevens = DataRepository.json_or_formdata(request)
        s = DataRepository.change_newssource(id, gegevens['url'])
        print(s)
        return jsonify(s), 200
    elif request.method == 'DELETE':
        s = DataRepository.delete_newssource(id)
        return jsonify(s), 200


@app.route(endpoint + '/ip', methods=['GET'])
def get_ip():
    ips = check_output(['hostname', '--all-ip-addresses']).split()
    return jsonify(ips[0].decode()), 200


@app.route(endpoint + '/timer', methods=['GET', 'POST', 'DELETE'])
def timer():
    if request.method == 'GET':
        s = DataRepository.get_timer()
        if s == None:
            return jsonify(-1), 200
        else:
            return jsonify(s), 200
    elif request.method == 'POST':
        gegevens = DataRepository.json_or_formdata(request)
        s = DataRepository.add_timer(gegevens['idsound'], gegevens['stoptime'])
        return jsonify(s), 200
    elif request.method == 'DELETE':
        s = DataRepository.remove_all_timers()
        os.system("killall omxplayer.bin")
        return jsonify(s), 200


@app.route(endpoint + '/weather', methods=['GET'])
def get_weather():
    if request.method == 'GET':
        response = requests.get(openweathermap_url)
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            print('request failed')

# temperature function
def read_temp_every_min():
    print('*** reading temperature ***')
    while True:
        with open(sensor_filename, 'r') as sensorfile:
            for i, line in enumerate(sensorfile):
                if i == 1:  # 2de lijn
                    temp = int(line.strip('\n')[line.find('t=')+2:])/1000
                    DataRepository.create_temp(temp, datetime.datetime.now())
        time.sleep(60)


# volume functions
def change_volume(volume):
    rotary_encoder.volume = volume


def save_volume(volume):
    #print("volume: ", volume)
    DataRepository.change_volume(volume)


def read_volume():
    vol = DataRepository.get_volume()['volume']
    # set volume to value from database
    rotary_encoder.volume = vol
    print('*** reading volume ***')
    while True:
        save_volume(rotary_encoder.volume)
        time.sleep(1)

# get user info from current user


def user_info():
    print('getting user info')
    while True:
        u_id = DataRepository.get_current_user()['currentUser']
        global current_user
        current_user = DataRepository.get_user(u_id)
        time.sleep(2)

# infrared sensor functions


def read_pir():
    print('*** reading infrared sensor ***')
    u_id = DataRepository.get_current_user()['currentUser']
    global current_user
    current_user = DataRepository.get_user(u_id)
    while True:
        if pir.read():
            print("Motion detected")
            color = current_user['ledcolor']
            [r, g, b] = Ledstrip.string2rgb(color)
            ledstrip.set_color(r, g, b)
            time.sleep(5)
        else:
            ledstrip.off()
        time.sleep(0.01)


def play_sound(idsound):
    print("playing sound", idsound)
    os.system("omxplayer -o local 'sounds/" + idsound + "' &")

# wait until a timer ends, then play a sound


def listen_to_timers():
    print('*** listenting to timers ***')
    while True:
        s = DataRepository.get_timer()
        if s != None:
            if s['stoptime'] <= datetime.datetime.today():
                play_sound(s['idsound'])
                DataRepository.remove_all_timers()
        time.sleep(2)

# wait until an alarm ends, then play a sound


def listen_to_alarms():
    print('*** listenting to alarms ***')
    while True:
        s = DataRepository.get_next_alarm()
        if s != None:
            play_sound(s['idsound'])
            time.sleep(60)
        time.sleep(30)


# Start app
if __name__ == '__main__':
    try:
        main()
    except (KeyboardInterrupt, SystemExit) as e:
        pass
    finally:
        ledstrip.stop()
        rotary_encoder.stop()
        print("Stopping...")
