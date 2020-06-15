let html_newssources;

function callbackUserAdded(json){
    console.log(json);
    window.location.replace("/users.html");
}

function changeColor(target){
    let color = target.value;
    console.log(color);
    document.querySelector("label.c-color__picker").style.backgroundColor = color;
}

function addUser(){
    jsonObject = {
        username: document.querySelector("#username").value,
        ledcolor: document.querySelector("#changeColor").value.toString().substring(1, 7),
        idnewssource: document.querySelector("#changeNewssource").value
    };
    console.log(jsonObject);
    handleData(`http://${lanIP}/api/v1/users`, callbackUserAdded, null, 'POST', JSON.stringify(jsonObject));
}

function showNewssources(newssources) {
    html_newssources = document.querySelector(".js-newssources");
    
    html_newssources.innerHTML = "";
    for (let newssource of newssources) {
        let option = document.createElement("option");
        option.setAttribute("value", newssource.idnewssource);
        option.appendChild(document.createTextNode(newssource.idnewssource));
        html_newssources.appendChild(option);
    }
    
}

function getNewsSources() {
    handleData(`http://${lanIP}/api/v1/newssources`, showNewssources, null);
}

function initAddUsers(){
    getNewsSources();

}