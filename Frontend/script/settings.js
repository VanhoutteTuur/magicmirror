let html_userSelect, html_volumeInput;

// add users to dropdown
function showUsers(json) {
    html_userSelect.innerHTML = "";
    for (let user of json) {
        let option = document.createElement("option");
        option.setAttribute("value", user.iduser);
        option.appendChild(document.createTextNode(user.username));
        html_userSelect.appendChild(option);
    }
    getCurrentUser();
}

function showUserChanged(json){
    console.log(json);
}

function showCurrentUser(user){
    html_userSelect.value = user.currentUser;
}

function showVolume(json){
    console.log(json);
    html_volumeInput.value = json.volume;
}

function showVolumeChanged(json){
    console.log(json);
}

// change current user
function changeUser(target) {
    let id = target.value;
    let jsonObject = {
        iduser: id
    }
    console.log(jsonObject);
    handleData(`http://${lanIP}/api/v1/user`, showUserChanged, showError, 'PUT', JSON.stringify(jsonObject))
}

function changeVolume(){
    jsonObject = {
        volume: html_volumeInput.value
    }
    handleData(`http://${lanIP}/api/v1/volume`, showVolumeChanged, null, 'PUT', JSON.stringify(jsonObject));
}

function getCurrentUser(){
    handleData(`http://${lanIP}/api/v1/user`, showCurrentUser, null);
}

function getUsers() {
    handleData(`http://${lanIP}/api/v1/users`, showUsers, null);
}

function getVolume(){
    handleData(`http://${lanIP}/api/v1/volume`, showVolume, null);
}

function initSettings(){
    html_userSelect = document.querySelector("#changeUser");
    html_volumeInput = document.querySelector("#changeVolume");


    getUsers();
    getVolume();
}