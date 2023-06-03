async function registerUser() {
    var username = document.getElementById("username").value;
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var image = document.getElementById("image").files[0];
    if (username == "" || username == undefined || name == "" || name == undefined || password == "" || password == undefined || image == undefined) {
        return
    }
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('password', password);
    formData.append('image', image);
    fetch('/user-register', {
        method: 'POST',
        body: formData
    }).then(res => {
        if (res.status == 200) {
            document.getElementById("registration-successfull").style.display = "block";
        }
    })

}