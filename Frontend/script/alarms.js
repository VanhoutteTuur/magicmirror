// js file for alarms.html

let alarms = [];

function createAlarmElement(alarm) {
    let enabled = "";
    if (alarm.enabled == 1) {
        enabled += "checked";
	}
	// omit seconds, add leading 0
	if(alarm.time.length > 5){
		alarm.time = alarm.time.substring(0, alarm.time.length - 3).padStart(5, "0");
	}
	let sound_options = ``;
	for(let s of sounds){
		sound_options += `<option value=${s.idsounds}>${s.soundname}</option>`;
	}
	let weekdays = alarm.weekdays;
	
	console.log(alarm);

    return `<div class="c-box u-max-width--sm" data-idalarm=${alarm.idalarm}>
				<div class="c-box__row">
					<span data-idalarm=${alarm.idalarm} class="c-box__title js-time js-editing">${alarm.time}</span>
					<div class="js-editing u-display--none">
						<label for="setTime">Set time: </label>
						<input type="time" id="setTime" name="setTime" value="${alarm.time}">
					</div>
					<div class="js-editing u-display--none">
						<a onclick="removeAlarm(this)" data-idalarm=${alarm.idalarm} href="javascript:void(0)">
							<svg class="u-icon--sm u-fill--red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
								<path
										d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" />
							</svg>
						</a>
					</div>
					<label class="c-switch js-editing">
						<input onclick="toggleAlarm(this)" data-idalarm=${alarm.idalarm} ${enabled} type="checkbox" />
						<span class="slider"></span>
					</label>
				</div>
				<div class="c-box__row js-editing u-display--none">
					<div class="c-sound">
						<label for="selectSound">Sound: </label>
						<select name="selectSound" id="selectSound">
							${sound_options}
						</select>
					</div>
				</div>
				<div class="c-box__row">
					<div class="c-box__days js-days">
						<button onclick="toggleAlarmDay(this)" data-idalarm=${alarm.idalarm} data-checked=${weekdays[0]}
								class="c-button c-button--round c-button--xs">M
						</button>
						<button onclick="toggleAlarmDay(this)" data-idalarm=${alarm.idalarm} data-checked=${weekdays[1]} 
								class="c-button c-button--round c-button--xs">T
						</button>
						<button onclick="toggleAlarmDay(this)" data-idalarm=${alarm.idalarm} data-checked=${weekdays[2]}
								class="c-button c-button--round c-button--xs">W
						</button>
						<button onclick="toggleAlarmDay(this)" data-idalarm=${alarm.idalarm} data-checked=${weekdays[3]}
								class="c-button c-button--round c-button--xs">T
						</button>
						<button onclick="toggleAlarmDay(this)" data-idalarm=${alarm.idalarm} data-checked=${weekdays[4]}
								class="c-button c-button--round c-button--xs">F
						</button>
						<button onclick="toggleAlarmDay(this)" data-idalarm=${alarm.idalarm} data-checked=${weekdays[5]}
								class="c-button c-button--round c-button--xs">S
						</button>
						<button onclick="toggleAlarmDay(this)" data-idalarm=${alarm.idalarm} data-checked=${weekdays[6]}
								class="c-button c-button--round c-button--xs">S
						</button>
					</div>
					<div>
						<div class="js-editing">
							<a onclick="toggleDisplayEdit(this)" data-idalarm=${alarm.idalarm} href="javascript:void(0)">
								<svg
										class="u-fill--green u-icon--sm"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512">
									<path
											d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z" />
								</svg>
							</a>
						</div>
						<div class="c-box__editBtns js-editing u-display--none">
							<div>
								<a onclick="cancelEditAlarm(this)" data-idalarm=${alarm.idalarm} href="javascript:void(0)">
									<svg class="u-fill--red u-icon--sm" xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 352 512">
										<path
												d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
									</svg>
								</a>
							</div>
							<div>
								<a onclick="confirmEditAlarm(this)" data-idalarm=${alarm.idalarm} href="javascript:void(0)">
									<svg class="u-fill--green u-icon--sm" xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 512 512">
										<path
												d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>`;
}

// display all alarms from the database
function showAlarms(json) {
    //console.log(json);
    let html_alarms = document.querySelector(".js-alarms");
    html_alarms.innerHTML = "";
    alarms = json;
    for (let alarm of alarms) {
		html_alarms.innerHTML += createAlarmElement(alarm);
		html_alarms.querySelector(`.c-box[data-idalarm="${alarm.idalarm}"]`).querySelector("#selectSound").value = alarm.idsound;
    }
    getSounds();
}

// generic callback function, logs callback data to console
function callback(json) {
    console.info(json);
}

function callbackRemoveAlarm(){
	window.location.replace("/alarms.html");
}

// generic error function
function error(json) {
    console.warn(json);
}

// when clicking on a weekday to turn it on or off
function toggleAlarmDay(target) {
	//check if current alarm is being edited
	let id = target.dataset.idalarm;
	let alarm = document.querySelector(`.c-box[data-idalarm="${id}"]`);
	let btns = alarm.querySelector(".c-box__editBtns");
	if (!btns.classList.contains("u-display--none")){
		// if editing
		if (target.dataset.checked == 1) {
        	target.dataset.checked = 0;
		} else {
			target.dataset.checked = 1;
		}
	}
    
}

// turn an alarm on or off
function toggleAlarm(target) {
    let jsonObject = {
        alarm: target.dataset.idalarm,
        status: target.checked,
    };
    // update locally stored alarm
    for (let a of alarms) {
        if (a.idalarm == target.dataset.idalarm) {
            a.enabled = target.checked;
            break;
        }
    }
    // send status to backend
    handleData(
        `http://${lanIP}/api/v1/alarm/${target.dataset.idalarm}/status`,
        callback,
        null,
        "PUT",
        JSON.stringify(jsonObject)
    );
}

// toggle the edit options
function toggleDisplayEdit(target) {
    let id = target.dataset.idalarm;
    let alarm = document.querySelector(`.c-box[data-idalarm="${id}"]`);
    alarm.querySelectorAll(".js-editing").forEach((el) => {
        el.classList.toggle("u-display--none");
    });
}

// confirm new options
function confirmEditAlarm(target) {
    toggleDisplayEdit(target);
    let alarm = document.querySelector(`.c-box[data-idalarm="${target.dataset.idalarm}"]`);
    let enabled = 0;
    if (alarm.querySelector('input[type="checkbox"]').checked) {
        enabled = 1;
    }
	let weekdays = [];
	let html_weekdays = alarm.querySelector(".js-days");
	for(let day of html_weekdays.children){
		if (day.dataset.checked == "1"){
			weekdays.push(1);
		} else {
			weekdays.push(0);
		}
	}
    jsonObject = {
        idalarm: target.dataset.idalarm,
        idsound: alarm.querySelector("#selectSound").value,
        time: alarm.querySelector("#setTime").value,
        enabled: enabled,
        weekdays: weekdays,
	};
	
    handleData(
        `http://${lanIP}/api/v1/alarms/${target.dataset.idalarm}`,
        callback,
        null,
        "PUT",
        JSON.stringify(jsonObject)
	);

    for (let a of alarms) {
        if (a.idalarm == target.dataset.idalarm) {
			a = jsonObject;
            alarm.innerHTML = createAlarmElement(a);
            break;
        }
    }
}

// reset alarm to what it was before editing
function cancelEditAlarm(target) {
    let id = target.dataset.idalarm;
    toggleDisplayEdit(target);
    let alarm = document.querySelector(`.c-box[data-idalarm="${target.dataset.idalarm}"]`);
    for (let a of alarms) {
        if (a.idalarm == id) {
            alarm.innerHTML = createAlarmElement(a);
            break;
        }
    }
    showSounds();
}

// delete an alarm
function removeAlarm(target) {
    console.log(`remove alarm ${target.dataset.idalarm}`);
	handleData(`http://${lanIP}/api/v1/alarms/${target.dataset.idalarm}`, callbackRemoveAlarm, error, "DELETE");
}

// Get alarms
function getAlarms() {
    handleData(`http://${lanIP}/api/v1/alarms`, showAlarms);
}
