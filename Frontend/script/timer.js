let time,
    timeLeft,
    TIME_LIMIT,
    timerInterval,
    running = 0;

function showTimer(json){
    if(json == -1){
        return;
    }
    console.log(json);
    
    
}


function getTimer(){
    handleData(`http://${lanIP}/api/v1/timer`, showTimer, showError);
}

function getTimerTime() {
    // remove h, m, s, return array of numbers
    return html_timerTime.innerText.replace(/[a-z]/g, "").split(" ");
}

function setTimerTime(hours, minutes, seconds) {
    html_timerTime.innerText =
        hours.padStart(2, "0") + "h " + minutes.padStart(2, "0") + "m " + seconds.padStart(2, "0") + "s";
}

// add a digit to the end of the timer
function addDigit(digit) {
    digit = digit.innerText;

    let currentTime = getTimerTime().join("");
    // only add if there's a leading zero
    if (currentTime[0] == "0") {
        currentTime += digit;
    }
    // make string correct length
    currentTime = currentTime.substring(currentTime.length - 6, currentTime.length);
    // set time
    setTimerTime(currentTime.substring(0, 2), currentTime.substring(2, 4), currentTime.substring(4, 6));
}

// remove one digit from the timer
function removeDigit() {
    let currentTime = getTimerTime().join("");
    currentTime = "0" + currentTime.substring(0, currentTime.length - 1);
    setTimerTime(currentTime.substring(0, 2), currentTime.substring(2, 4), currentTime.substring(4, 6));
}


function formatTime(time) {
    let hours = Math.floor(time / 3600)
        .toString()
        .padStart(2, "0");
    let minutes = (Math.floor(time / 60) % 60).toString().padStart(2, "0");
    let seconds = (time % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

// Divides time left by the defined time limit.
function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

// Update the dasharray value as time passes, starting with 283
function setCircleDasharray() {
    const circleDasharray = `${(calculateTimeFraction() * 283).toFixed(0)} 283`;
    document.querySelector(".c-countdown__path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}

function startTimer() {
    time = getTimerTime().join("");
    if (time == "000000") {
        return;
    }
    time = parseInt(time.substring(0, 2)) * 3600 + parseInt(time.substring(2, 4) * 60) + parseInt(time.substring(4, 6));
    TIME_LIMIT = time;
    timeLeft = time;

    console.log(time);
    let stoptime = new Date(Date.now())
    stoptime.setSeconds(stoptime.getSeconds() + time);

    datetime = stoptime.toLocaleString("nl-BE", { timeZone: "Europe/Brussels" });


    jsonObject = {
        idsound: document.querySelector("#selectSound").value,
        stoptime: datetime,
    };

    console.log(jsonObject);

    handleData(`http://${lanIP}/api/v1/timer`, showTimer, showError, 'POST', JSON.stringify(jsonObject))


    document.querySelector(".c-countdown__path-remaining").style.transition = "all 1s linear";
    document.querySelector(".c-countdown__path-remaining").style.stroke = "#3345ff";
    document.querySelector(".c-timer").classList.toggle("u-display--none");
    document.querySelector(".c-countdown").classList.toggle("u-display--none");
    startCounting();
}

function startCounting() {
    timerInterval = setInterval(() => {
        timeLeft -= 1;
        let formattedTime = formatTime(timeLeft);
        document.querySelector(".js-time-remaining").innerHTML = formattedTime;
        setCircleDasharray();

        if (timeLeft == 0) {
            document.querySelector(".c-countdown__path-remaining").style.transition = "none";
            document.querySelector(".c-countdown__path-remaining").style.stroke = "red";
            clearInterval(timerInterval);
        }
    }, 1000);
    running = 1;
}

function stopTimer() {
    console.log("stopping");
    clearInterval(timerInterval);
    document.querySelector(".c-countdown__path-remaining").style.transition = "all 1s linear";
    document.querySelector(".c-countdown__path-remaining").style.stroke = "#3345ff";
    document.querySelector(".c-timer").classList.toggle("u-display--none");
    document.querySelector(".c-countdown").classList.toggle("u-display--none");
    html_timerTime.innerHTML = "00h 00m 00s";
    running = 0;
    handleData(`http://${lanIP}/api/v1/timer`, showConsoleLog, null, 'DELETE')
}


function initTimer(){
    getSounds();
    getTimer();
}