function registerApp() {
    payload={
        "app_name" : document.getElementById("name").value,
        "redirect_url" : document.getElementById("redirect_url").value
    }
    fetch('/app-register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res => {
            document.getElementById("client_id").innerText=res.client_id;
            document.getElementById("registration-successfull").style.display="block";
        });

}