from .Database import Database
from datetime import datetime
from dateutil.parser import parse

# Class DataRepository:
# All database CRUD actions are defined here.


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    # Get all temperature rows
    @staticmethod
    def read_temperature():
        sql = "SELECT time, value FROM sensor_data WHERE idsensor = 1 ORDER BY time"
        return Database.get_rows(sql)

    # Get current temperature
    @staticmethod
    def read_temperature_current():
        sql = "SELECT time, value FROM sensor_data WHERE idsensor = 1 ORDER BY time DESC"
        return Database.get_one_row(sql)

    # Get temperature from last x hours
    @staticmethod
    def read_temperature_last_x(hour):
        sql = "SELECT time, value FROM sensor_data WHERE idsensor = 1 and time >= (current_timestamp() - interval %s hour) ORDER BY time"
        params = [hour]
        return Database.get_rows(sql, params)

    # Insert new row into sensor_data table with idsensor = 1 (=temperature)
    @staticmethod
    def create_temp(value, time):
        sql = "INSERT INTO sensor_data(idsensor, value, time, idmirror) VALUES(%s,%s,%s,%s)"
        params = [1, value, time, 1]
        return Database.execute_sql(sql, params)

    # Get current global volume
    @staticmethod
    def get_volume():
        sql = "SELECT volume FROM mirror WHERE idmirror = 1"
        return Database.get_one_row(sql)

    # Change the global volume for the mirror.
    @staticmethod
    def change_volume(volume):
        sql = "UPDATE mirror set volume = %s where mirror.idmirror = 1"
        params = [volume]
        return Database.execute_sql(sql, params)

    # Get alarm and timer sounds
    @staticmethod
    def get_sounds():
        sql = "SELECT * FROM sounds"
        return Database.get_rows(sql)

    # Get alarms
    @staticmethod
    def get_alarm(idalarm):
        sql = "SELECT idalarm, idsound, time, enabled FROM alarm WHERE idalarm = %s"
        params = [idalarm]
        return Database.get_one_row(sql, params)

    # change an alarm
    @staticmethod
    def change_alarm(idalarm, idsound, time, enabled):
        sql = "UPDATE alarm SET idsound = %s, time = %s, enabled = %s WHERE idalarm = %s"
        params = [idsound, time, enabled, idalarm]
        return Database.execute_sql(sql, params)

    # add a new alarm
    @staticmethod
    def add_alarm(idsound, time, enabled, weekdays):
        sql = "INSERT INTO alarm (idsound, time, enabled) VALUES (%s, %s, %s)"
        params = [idsound, time, enabled]
        idalarm = Database.execute_sql(sql, params)
        print("setting weekdays")
        DataRepository.set_weekdays(idalarm, weekdays)
        return idalarm

    # delete an alarm
    @staticmethod
    def delete_alarm(idalarm):
        sql = "DELETE FROM alarm WHERE idalarm = %s"
        params = [idalarm]
        return Database.execute_sql(sql, params)

    # get all alarms from the current user
    @staticmethod
    def get_alarms():
        sql = "SELECT idalarm, idsound, time, enabled FROM alarm ORDER BY alarm.time"
        return Database.get_rows(sql)

    # get the list of selected days of an alarm
    @staticmethod
    def get_alarm_weekdays(idalarm):
        sql = "SELECT weekday FROM alarm join alarm_weekdays on alarm.idalarm = alarm_weekdays.idalarm where alarm.idalarm = %s"
        params = [idalarm]
        return Database.get_rows(sql, params)

    # set the list of selected days of an alarm
    @staticmethod
    def set_weekdays(idalarm, weekdays):
        sql = "DELETE FROM alarm_weekdays WHERE idalarm = %s"
        params = [idalarm]
        Database.execute_sql(sql, params)
        for day in range(len(weekdays)):
            if weekdays[day] == 1:
                sql = "INSERT INTO alarm_weekdays (idalarm, weekday) VALUES (%s, %s)"
                params = [idalarm, day + 1]
                Database.execute_sql(sql, params)

    # Toggle the status of an alarm
    @staticmethod
    def set_enabled(alarmid, status):
        sql = "UPDATE magicMirrorDB.alarm SET enabled = %s where idalarm = %s"
        params = [status, alarmid]
        return Database.execute_sql(sql, params)

    # get next alarm
    @staticmethod
    def get_next_alarm():
        sql = "SELECT alarm.idalarm, time, weekday, idsound FROM magicMirrorDB.alarm join alarm_weekdays on alarm.idalarm = alarm_weekdays.idalarm where enabled = 1 and weekday = weekday(curdate()) + 1 and DATE_FORMAT(NOW(), '%H:%i:00') = time"
        return Database.get_one_row(sql)

    # Get todolist
    @staticmethod
    def get_todolist():
        sql = "SELECT user.iduser, idtodo, todo_item FROM todolist join user on todolist.iduser = user.iduser join mirror on user.idmirror = mirror.idmirror where mirror.currentUser = todolist.iduser"
        return Database.get_rows(sql)

    # create a new todo item
    @staticmethod
    def create_todo(todo):
        user = DataRepository.get_current_user()['currentUser']
        sql = "INSERT INTO todolist(iduser, todo_item) VALUES(%s,%s)"
        params = [user, todo]
        return Database.execute_sql(sql, params)

    # delete a todo item
    @staticmethod
    def delete_todo(id):
        sql = "DELETE FROM todolist WHERE todolist.idtodo = %s"
        params = [id]
        return Database.execute_sql(sql, params)

    # get the current user
    @staticmethod
    def get_current_user():
        sql = "SELECT currentUser FROM mirror"
        return Database.get_one_row(sql)

    # Get all users
    @staticmethod
    def get_users():
        sql = "SELECT * FROM user ORDER BY iduser"
        return Database.get_rows(sql)

    # add user
    @staticmethod
    def create_user(username, newssource, ledcolor):
        sql = "INSERT INTO user(username, idnewssource, ledcolor, idmirror) VALUES (%s, %s, %s, 1)"
        params = [username, newssource, ledcolor]
        return Database.execute_sql(sql, params)

    # change user
    @staticmethod
    def change_user(iduser, username, newssource, ledcolor):
        sql = "UPDATE user SET username = %s, idnewssource = %s, ledcolor = %s, idmirror = 1 WHERE iduser = %s"
        params = [username, newssource, ledcolor, iduser]
        return Database.execute_sql(sql, params)

    # Get user by id
    @staticmethod
    def get_user(id):
        sql = "SELECT * FROM user WHERE user.iduser = %s"
        params = [id]
        return Database.get_one_row(sql, params)

    @staticmethod
    def delete_user(id):
        sql = "DELETE FROM user WHERE iduser = %s"
        params = [id]
        Database.execute_sql(sql, params)

    # change the current user
    @staticmethod
    def set_user(userid):
        sql = "UPDATE mirror SET currentUser = %s WHERE idmirror = 1"
        params = [userid]
        return Database.execute_sql(sql, params)

    # get all newssources
    @staticmethod
    def get_newssources():
        sql = "SELECT * FROM newssource"
        return Database.get_rows(sql)

    # get newssource of the current selected user
    @staticmethod
    def get_current_newssource():
        sql = "SELECT * FROM newssource join user on user.idnewssource = newssource.idnewssource join mirror on mirror.idmirror = user.idmirror where mirror.currentUser = user.iduser"
        return Database.get_one_row(sql)

    # change a newssource
    @staticmethod
    def change_newssource(id, url):
        sql = "UPDATE newssource SET rss_url = %s WHERE idnewssource = %s"
        params = [url, id]
        return Database.execute_sql(sql, params)

    # delete a newssource
    @staticmethod
    def delete_newssource(id):
        sql = "DELETE FROM newssource WHERE idnewssource = %s"
        params = [id]
        return Database.execute_sql(sql, params)

    # add a newssource
    @staticmethod
    def add_newssource(id, url):
        sql = "INSERT INTO newssource(idnewssource, rss_url) VALUES(%s,%s)"
        params = [id, url]
        return Database.execute_sql(sql, params)

    @staticmethod
    def get_timer():
        sql = "SELECT * FROM timer ORDER BY stoptime DESC"
        return Database.get_one_row(sql)

    @staticmethod
    def remove_all_timers():
        sql = "DELETE FROM timer"
        return Database.execute_sql(sql)

    @staticmethod
    def add_timer(idsound, stoptime):
        DataRepository.remove_all_timers()
        sql = "INSERT INTO timer(idsound, stoptime) VALUES(%s, %s)"
        stoptime = parse(stoptime, dayfirst=True)
        params = [idsound, stoptime]
        return Database.execute_sql(sql, params)
