// Main js file

// constants
const lanIP = `${window.location.hostname}:5000`;
//const socket = io(`http://${lanIP}`);

// Declare DOM elements
// for data page
let html_current_temp, html_timeFrameDropdown;
//for timer
let html_timerDigits, html_timerTime, html_pauseButton;

let currentUser;
let sounds = [];

// populate sound select with options
function showSounds() {
    let dropdowns = document.querySelectorAll("#selectSound");
    for (let d of dropdowns) {
        d.innerHTML = "";
        for (let sound of sounds) {
            let option = document.createElement("option");
            option.setAttribute("value", sound.idsounds);
            option.appendChild(document.createTextNode(sound.soundname));
            d.appendChild(option);
        }
    }
}

// Generic callback, prints data to console
function showConsoleLog(data){
    console.log(data);
}

// Generic error logger
function showError(error) {
    console.log("error:");
    console.log(error);
}

// Add sounds to dropdown
function getSounds() {
    handleData(`http://${lanIP}/api/v1/sounds`, (json) => {
        sounds = json;
        showSounds();
    }, showError);
}


/* Set the width of the side navigation to 50% */
function openNav() {
    document.querySelector(".c-sidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.querySelector(".c-sidenav").style.width = "0";
}

function init() {
    // Assign DOM elements:
    // data page
    html_current_temp = document.querySelector(".js-temperature");
    html_timeFrameDropdown = document.querySelector(".js-timeframe");

    // timers page
    html_timerDigits = document.querySelectorAll(".js-timerDigit");
    html_timerTime = document.querySelector(".js-timerTime");
    html_pauseButton = document.querySelector(".js-pauseButton");

    // alarms page
    html_toggleAlarmDays = document.querySelectorAll(".js-toggleAlarmDay");
    html_editAlarm = document.querySelectorAll(".js-editAlarm");
    html_cancelEditAlarm = document.querySelectorAll(".js-cancelEditAlarm");
    html_confirmEditAlarm = document.querySelectorAll(".js-confirmEditAlarm");
    html_removeAlarm = document.querySelectorAll(".js-removeAlarm");


    let url = window.location.pathname;
        let filename = url.substring(url.lastIndexOf("/") + 1);

        // data page
        if (filename == "index.html" || filename == "") {
            getCurrentTemperature();
            listenToTimeFrame();
        }

        // timers and alarms page
        if (filename == "timer.html") {
            initTimer();
        } else if (filename == "alarms.html") {
            getAlarms();
        }

        if (filename == "addalarms.html"){
            getSounds();
        }
        

        // Todolist page
        if (filename == 'todo.html'){
            initTodoList();
        }

        // Settings page
        if (filename == 'settings.html'){
            initSettings();
        }

        if (filename == 'users.html'){
            initUsers();
        }

        if (filename == 'adduser.html') {
            initAddUsers();
        }

        if (filename == 'news.html'){
            initNews();
        }
}

// when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");
    init();
});
