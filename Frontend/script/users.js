let html_users, html_newssources;

let user_news = {};

function createUserElement(user){
    return `
        <div class="c-box u-max-width--sm" data-iduser=${user.iduser}>
            <div class="c-box__row">
                <span class="c-box__title js-editing">${user.username}</span>
                <div class="c-color js-editing" style="background-color: #${user.ledcolor}"></div>
                <input type="text" data-iduser=${user.iduser} class="js-editing u-display--none" id="changeUsername" value=${user.username}>
                <div class="c-box__editBtns js-editing u-display--none">
                    <a onclick="removeUser(this)" data-iduser=${user.iduser} href="javascript:void(0)">
							<svg class="u-icon--sm u-fill--red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
								<path
										d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" />
							</svg>
						</a>
                    <label style="background-color: #${user.ledcolor}" class="c-color c-color__picker"><input onchange="changeColor(this)"  data-iduser=${user.iduser} value="#${user.ledcolor}" type="color" id="changeColor"></label>
                </div>
            </div>
            <div class="c-box__row">
                <span class="c-box__subtitle js-editing">${user.idnewssource}</span>
                <select data-iduser=${user.iduser} id="changeNewssource" class="js-newssources js-editing u-display--none"></select>
                <div class="js-editing">
                    <a onclick="toggleDisplayEdit(this)" data-iduser=${user.iduser} href="javascript:void(0)">
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
                        <a onclick="cancelEditUser(this)" data-iduser=${user.iduser} href="javascript:void(0)">
                            <svg class="u-fill--red u-icon--sm" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 352 512">
                                <path
                                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
                            </svg>
                        </a>
                    </div>
                    <div>
                        <a onclick="confirmEditUser(this)" data-iduser=${user.iduser} href="javascript:void(0)">
                            <svg class="u-fill--green u-icon--sm" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512">
                                <path
                                        d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>`
}

function toggleDisplayEdit(target) {
    let id = target.dataset.iduser;
    console.log(id);
    let user = document.querySelector(`.c-box[data-iduser="${id}"]`);
    user.querySelectorAll(".js-editing").forEach((el) => {
        el.classList.toggle("u-display--none");
    });
}

function changeColor(target) {
    let label = target.parentNode;
    let color = target.value;
    label.style.backgroundColor = color;
}

function callbackRemoveUser() {
    window.location.replace("/users.html");
}

function removeUser(target){
    console.log(remove + target.dataset.iduser);
    handleData(`http://${lanIP}/api/v1/users/${id}`, callbackRemoveUser, null, "PUT", JSON.stringify(jsonObject));
}

function showEditedUser(json){
    console.log("user edited:");
    console.log(json);
}

function confirmEditUser(target) {
    let id = target.dataset.iduser;
    let userBox = document.querySelector(`.c-box[data-iduser="${id}"]`);
    
    let jsonObject = {
        iduser: id,
        username: userBox.querySelector("#changeUsername").value,
        newssource: userBox.querySelector("#changeNewssource").value,
        ledcolor: userBox.querySelector("#changeColor").value.toString().substring(1, 7)
    };
    console.log(jsonObject);
    handleData(`http://${lanIP}/api/v1/users/${id}`, showEditedUser, null, 'PUT', JSON.stringify(jsonObject));
    //update display
    userBox.querySelector(".c-box__subtitle").innerHTML = jsonObject.newssource;
    userBox.querySelector(".c-box__title").innerHTML = jsonObject.username;
    userBox.querySelector(".c-color").style.backgroundColor = `#${jsonObject.ledcolor}`;
    toggleDisplayEdit(target);
}

function cancelEditUser(target) {
    toggleDisplayEdit(target);
    let id = target.dataset.iduser;
}

function showNewssources(newssources) {
    html_newssources = document.querySelectorAll(".js-newssources");
    html_newssources.forEach((dropdown) => {
        dropdown.innerHTML = "";
        for (let newssource of newssources) {
            let option = document.createElement("option");
            option.setAttribute("value", newssource.idnewssource);
            option.appendChild(document.createTextNode(newssource.idnewssource));
            dropdown.appendChild(option);
        }
        let userid = dropdown.dataset.iduser;
        dropdown.value = user_news[userid];
    });
}

function showUsers(users) {
    user_news = {};
    html_users.innerHTML == "";
    for (let user of users) {
        user_news[user.iduser] = user.idnewssource;
        html_users.innerHTML += createUserElement(user);
    }
    getNewsSources();
}

function getUsers() {
    handleData(`http://${lanIP}/api/v1/users`, showUsers, null);
}

function getNewsSources() {
    handleData(`http://${lanIP}/api/v1/newssources`, showNewssources, null);
}

function initUsers() {
    html_users = document.querySelector(".js-users");

    getUsers();
}
