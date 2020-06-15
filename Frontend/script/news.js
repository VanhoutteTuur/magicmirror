let html_news;

function createNewsElement(news){
    console.log(news);
    return `
        <div class="c-box u-max-width--sm" data-idnewssource="${news.idnewssource}">
            <div class="c-box__row">
                <span class="c-box__title">${news.idnewssource}</span>
                <div class="c-box__editBtns js-editing u-display--none">
                    <a onclick="removeNews(this)" data-idnewssource="${news.idnewssource}" href="javascript:void(0)">
							<svg class="u-icon--sm u-fill--red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
								<path
										d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" />
							</svg>
						</a>
                </div>
                <div class="js-editing">
                    <a onclick="toggleDisplayEdit(this)" data-idnewssource="${news.idnewssource}" href="javascript:void(0)">
                        <svg
                                class="u-fill--green u-icon--sm"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512">
                            <path
                                    d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z" />
                        </svg>
                    </a>
                </div>
            </div>
            <div class="c-box__row">
                <span class="c-box__subtitle js-editing">${news.rss_url}</span>
                <input value="${news.rss_url}" id="changeNewsURL" type="text" class="js-editing u-display--none">
                <div class="c-box__editBtns js-editing u-display--none">
                    <div>
                        <a onclick="cancelEditNews(this)" data-idnewssource="${news.idnewssource}" href="javascript:void(0)">
                            <svg class="u-fill--red u-icon--sm" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 352 512">
                                <path
                                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
                            </svg>
                        </a>
                    </div>
                    <div>
                        <a onclick="confirmEditNews(this)" data-idnewssource="${news.idnewssource}" href="javascript:void(0)">
                            <svg class="u-fill--green u-icon--sm" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512">
                                <path
                                        d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
}


function showNewssources(json){
    html_news.innerHTML = "";
    for(let n of json){
        html_news.innerHTML += createNewsElement(n);
    }
}

function showEditedNewssource(json){
    console.log(json);
}

function showDeletedNewssource(json){
    window.location.replace("/news.html");
}

function removeNews(target){
    let id = target.dataset.idnewssource;
    console.log(id);
    handleData(`http://${lanIP}/api/v1/newssources/${id}`, showDeletedNewssource, null, 'DELETE');

}

function confirmEditNews(target){
    let id = target.dataset.idnewssource;
    let news = document.querySelector(`.c-box[data-idnewssource="${id}"]`);
    let jsonObject = {
        id: id,
        url: news.querySelector("#changeNewsURL").value
    };
    handleData(`http://${lanIP}/api/v1/newssources/${id}`, showEditedNewssource, null, 'PUT', JSON.stringify(jsonObject))

    toggleDisplayEdit(target);
}

function cancelEditNews(target){
    toggleDisplayEdit(target);
}

function toggleDisplayEdit(target){
    let id = target.dataset.idnewssource;
    let news = document.querySelector(`.c-box[data-idnewssource="${id}"]`);
    news.querySelectorAll(".js-editing").forEach((el) => {
        el.classList.toggle("u-display--none");
    });
}

function getNewssources(){
    handleData(`http://${lanIP}/api/v1/newssources`, showNewssources, null);
}

function initNews(){
    html_news = document.querySelector(".js-news");

    getNewssources();
}