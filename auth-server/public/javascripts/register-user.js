toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

async function registerUser() {
    payload={
        "username" : document.getElementById("username").value,
        "name" : document.getElementById("name").value,
        "password" : document.getElementById("password").value,
        "image": await toBase64(document.getElementById("image").files[0])
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