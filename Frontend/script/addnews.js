function showAddedNewssource(json){
    console.log(json);
    window.location.replace("/news.html");
}

function addNews(){
    let name = document.querySelector("#name").value;
    let rss_url = document.querySelector("#rss").value;
    let jsonObject = {
        id: name,
        url: rss_url
    }
    console.log(jsonObject);
    handleData(
        `http://${lanIP}/api/v1/newssources`,
        showAddedNewssource,
        showAddedNewssource,
        "POST",
        JSON.stringify(jsonObject)
    );
}