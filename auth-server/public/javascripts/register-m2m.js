function registerM2M() {
    payload={
        "app_name" : document.getElementById("name").value
    }
    fetch('/m2m-register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res => {
            document.getElementById("client_id").innerText=res.client_id;
            document.getElementById("client_secret").innerText=res.client_secret;
            document.getElementById("registration-successfull").style.display="block";
        });

}