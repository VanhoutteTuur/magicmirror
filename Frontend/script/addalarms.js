function toggleAlarmDay(target){
    if (target.dataset.checked == 1) {
        target.dataset.checked = 0;
    } else {
        target.dataset.checked = 1;
    }
}

function showNewAlarm(json){
    console.log(json);
    window.location.replace("/alarms.html");
}

function addAlarm(){

    let enabled = 0;
    if (document.querySelector('input[type="checkbox"]').checked) {
        enabled = 1;
    }

    let weekdays = [];
    let html_weekdays = document.querySelector(".js-days");
    for (let day of html_weekdays.children) {
        if (day.dataset.checked == "1") {
            weekdays.push(1);
        } else {
            weekdays.push(0);
        }
    }

    let alarm = {
        idsound: document.querySelector("#selectSound").value,
        time: document.querySelector("#setTime").value,
        enabled: enabled,
        weekdays: weekdays
    }

    console.log(alarm);
    handleData(`http://${lanIP}/api/v1/alarms`, showNewAlarm, null, "POST", JSON.stringify(alarm));
    
}