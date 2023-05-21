function registerUser() {
    payload={
        "username" : document.getElementById("username").value,
        "name" : document.getElementById("name").value,
        "password" : document.getElementById("password").value
    }
    fetch('/user-register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => {
        if(res.status==200){
            document.getElementById("registration-successfull").style.display="block";
        }
    })

}