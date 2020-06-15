// MIRROR js file

// constants
const lanIP = `${window.location.hostname}:5000`;
const openWeatherAPI =
    "https://api.openweathermap.org/data/2.5/forecast?q=kortrijk,BE&appid=5ab3cf66921da480525dffd751748008&units=metric&lang=nl";

let html_time, html_date, html_roomtemp, html_weather, html_todolist;

//default user = 1
let currentUser = 1;

let timerRunning = false,
    countdownInterval;

function showTime(h, m) {
    html_time.innerHTML = h + ":" + m;
}

function showDate(date) {
    html_date.innerHTML = date;
}

function showTemperature(temp) {
    html_roomtemp.innerHTML = temp.value;
}

function showTodos(list) {
    html_todolist.innerHTML = "";
    for (let option of list) {
        html_todolist.innerHTML += `<li>${option.todo_item}</li>`;
    }
}

function showAlarms(alarms) {
    html_alarms.innerHTML = "";
    for (let a of alarms) {
        if (a.enabled == 1) {
            html_alarms.innerHTML += `<div>${a.time}</div>`;
        }
    }
}

function showTimer(json) {
    if (json == -1){
        timerRunning = false;
        clearInterval(countdownInterval);
        document.querySelector(".js-timer").innerHTML = "";
    }

    let time = new Date(json.stoptime);
    time.setHours(time.getHours() - 2);

    let now = new Date(Date.now());

    if (time >= now) {
        if (timerRunning == false) {
            let timeLeft = time.getTime() - now.getTime();
            timeLeft = Math.floor(timeLeft / 1000);

            timerRunning = true;

            countdownInterval = setInterval(() => {
                timeLeft -= 1;
                let hours = Math.floor(timeLeft / 3600)
                    .toString()
                    .padStart(2, "0");
                let minutes = Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0");
                let seconds = Math.floor(timeLeft % 60).toString().padStart(2, '0');
                if (hours == "00"){
                    document.querySelector(".js-timer").innerHTML = `${minutes}:${seconds}`;
                } else {
                    document.querySelector(".js-timer").innerHTML = `${hours}:${minutes}:${seconds}`;
                }
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);
        }
    } else {
        document.querySelector(".js-timer").innerHTML = "";
        clearInterval(countdownInterval);
    }
}

function showWeather(json) {
    let days = [];
    for (let i = 0; i < 7; i++) {
        days.push(json.list[i].main.temp);
    }

    let today = days[0];

    document.querySelector(".js-weather").innerHTML = `Today: ${days[0]}°C <br>Tomorrow: ${days[1]}°C`;
}

function showNews(xml) {
    // parse xml from the xml string
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, "text/xml");

        // some rss feeds work with items, while others work with entries:
        if (xmlDoc.querySelector("item") != null) {
            document.querySelector(".js-news").innerHTML = xmlDoc
                .querySelector("item")
                .firstElementChild.innerHTML.replace(/[\r\n\t]/g);
        } else if (xmlDoc.querySelector("entry") != null) {
            document.querySelector(".js-news").innerHTML = xmlDoc
                .querySelector("entry")
                .firstElementChild.innerHTML.replace(/[\r\n\t]/g);
        }
    }
}

function showUser(user) {
    currentUser = user.iduser;
}

function showIP(ip) {
    console.info(ip);
    html_ip.innerHTML = ip;
}

function showError(json) {
    console.error(json);
}

function getTime() {
    let today = new Date(),
        h = today.getHours().toString().padStart(2, "0"),
        m = today.getMinutes().toString().padStart(2, "0");
    showTime(h, m);
}

function getDate() {
    let today = new Date();
    showDate(today.toLocaleDateString("en-be", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
}

function getTemperature() {
    handleData(`http://${lanIP}/api/v1/temperature-now`, showTemperature, null);
}

//todo: openweathermap or darksky?
function getWeather() {
    handleData(`http://${lanIP}/api/v1/weather`, showWeather, null);
}

function getAlarms() {
    handleData(`http://${lanIP}/api/v1/alarms`, showAlarms);
}

function getTimer() {
    handleData(`http://${lanIP}/api/v1/timer`, showTimer);
}

function getIP() {
    handleData(`http://${lanIP}/api/v1/ip`, showIP, null);
}

function getNews() {
    handleData(`http://${lanIP}/api/v1/newssources-current`, showNews, null);
}

function getTodolist() {
    handleData(`http://${lanIP}/api/v1/todos`, showTodos);
}

function getCurrentUser() {
    handleData(`http://${lanIP}/api/v1/user`, showUser);
}

function timeThread() {
    setInterval(function () {
        getTime();
        getDate();
        getCurrentUser();
        getTimer();
    }, 1500);

    setInterval(() => {
        getTodolist();
        getTemperature();
        getWeather();
        getAlarms();
        getNews();
    }, 5000);
}

function init() {
    html_time = document.querySelector(".js-time");
    html_date = document.querySelector(".js-date");
    html_roomtemp = document.querySelector(".js-roomtemp");
    html_weather = document.querySelector(".js-weather");
    html_todolist = document.querySelector(".js-todolist");
    html_alarms = document.querySelector(".js-alarms");
    html_ip = document.querySelector(".js-ip");

    getIP();

    handleData(`http://${lanIP}/api/v1/user`, (user) => {
        currentUser = user.iduser;
        getTime();
        getDate();
        getTodolist();
        getTemperature();
        getAlarms();
        getTimer();
        getNews();
        getWeather();

        timeThread();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Mirror DOM loaded");
    init();
});
