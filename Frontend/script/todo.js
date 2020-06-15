let html_todolist;

function createTodoElement(todo){
    let button = `
    <button onclick="deleteTodo(this)" data-idtodo=${todo.idtodo} class="c-button c-button--round c-button--red c-button--sm">
        <svg class="u-icon--xs u-fill--white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/>
        </svg>
        `;
    let text = todo.todo_item;
    return `<li class="c-todolist__item" data-idtodo=${todo.idtodo}><div>${text}${button}</div></li>`;
}

function showTodos(json){
    html_todolist.innerHTML = "";
    for(let todo of json){
        html_todolist.innerHTML += createTodoElement(todo)
    }
    // add input and + button
    html_todolist.innerHTML += `
    <li class="c-todolist__item">
		<div>
            <input class="c-todolist__input" type="text" id="addTodo">
            <button onclick="addNewTodo()" class="c-button c-button--round c-button--sm">
                <svg class="u-icon--xs u-fill--white" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512">
                    <path
                            d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
            </button>
        </div>
    </li>`;
    
}

function refreshTodos(json){
    getTodoList();
}

function addNewTodo(){
    jsonObject = {
        todo: document.querySelector("#addTodo").value
    }
    handleData(`http://${lanIP}/api/v1/todos`, refreshTodos, null, "POST", JSON.stringify(jsonObject));
}


function deleteTodo(target){
    let id = target.dataset.idtodo;
    handleData(`http://${lanIP}/api/v1/todos/${id}`, refreshTodos, null, "DELETE");
}

function getTodoList(){
    handleData(`http://${lanIP}/api/v1/todos`, showTodos, null);
}

function initTodoList(){
    html_todolist = document.querySelector(".js-todos");
    getTodoList();
}
